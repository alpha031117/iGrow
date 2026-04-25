"use client";

import { useRef, useState } from "react";
import type { Message } from "@mariozechner/pi-ai";

const SYSTEM_PROMPT = "You are iGrow, a helpful financial assistant.";

const MODEL_OPTIONS = [
  { id: "haiku", label: "Haiku 4.5", sublabel: "Fast" },
  { id: "sonnet", label: "Sonnet 4.5", sublabel: "Smart" },
] as const;

type ModelId = (typeof MODEL_OPTIONS)[number]["id"];
type ChatMessage = { role: "user" | "assistant"; content: string };

function toPiMessages(msgs: ChatMessage[], modelId: ModelId): Message[] {
  return msgs.map((m) =>
    m.role === "user"
      ? { role: "user", content: m.content, timestamp: Date.now() }
      : {
          role: "assistant",
          content: [{ type: "text", text: m.content }],
          api: "bedrock-converse-stream",
          provider: "amazon-bedrock",
          model: modelId === "sonnet"
            ? "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
            : "global.anthropic.claude-haiku-4-5-20251001-v1:0",
          usage: {
            input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
          },
          stopReason: "stop",
          timestamp: Date.now(),
        }
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelId, setModelId] = useState<ModelId>("haiku");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsStreaming(true);

    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: toPiMessages(next, modelId),
          systemPrompt: SYSTEM_PROMPT,
          modelId,
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMsg.content += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMsg };
          return updated;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Error: " + String(err) };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
            iG
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">iGrow Assistant</span>
        </div>
        <div className="flex gap-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-1">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setModelId(opt.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                modelId === opt.id
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {opt.label}
              <span className={`text-[10px] ${modelId === opt.id ? "text-emerald-500" : "text-zinc-400"}`}>
                {opt.sublabel}
              </span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-zinc-400 dark:text-zinc-600 mt-16 text-sm">
            Ask me anything about your finances.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {msg.content || <span className="opacity-50 animate-pulse">●</span>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4">
        <form
          className="flex gap-3 max-w-3xl mx-auto"
          onSubmit={(e) => { e.preventDefault(); send(); }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message iGrow..."
            disabled={isStreaming}
            className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-5 py-3 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white disabled:opacity-40 hover:bg-emerald-600 transition-colors"
            aria-label="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 rotate-90">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
