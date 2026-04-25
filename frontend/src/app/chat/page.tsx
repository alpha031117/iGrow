"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { TrendingUp, PiggyBank, Calculator, BarChart2, Sparkles, FileText } from "lucide-react";
import { PromptBox, type FileAttachment } from "@/components/ui/chatgpt-prompt-input";
import type { Message, ImageContent, TextContent } from "@mariozechner/pi-ai";

const SYSTEM_PROMPT =
  "You are iGrow, an AI-powered financial growth assistant for TNG (Touch 'n Go) merchants and micro-SME users in Malaysia. You help users understand TNG Business Account features, Merchant QR setup, BizCash financing readiness, and incubator/grant programs like MDEC, TEKUN, SIDEC, Cradle Fund, SME Corp, Bank Negara iTEKAD, 1337 Ventures, and PERNAS. You guide informal traders, home-based sellers, freelancers, and micro-businesses toward becoming finance-ready merchants. Keep answers clear, practical, and encouraging. Always remind users that this is not financial advice and that TNG products are subject to eligibility review. When the user shares a file or document, analyze it carefully and provide specific insights.";

const MODEL_OPTIONS = [
  { id: "haiku", label: "Haiku 4.5", sublabel: "Fast" },
  { id: "sonnet", label: "Sonnet 4.5", sublabel: "Smart" },
] as const;
type ModelId = (typeof MODEL_OPTIONS)[number]["id"];

const SUGGESTIONS = [
  { icon: TrendingUp, title: "Start investing", prompt: "What's the best way to start investing with a small amount of money?", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" },
  { icon: PiggyBank, title: "Monthly budget", prompt: "Help me create a realistic monthly budget. Where do I start?", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" },
  { icon: Calculator, title: "Loan calculator", prompt: "How do I calculate whether a loan is worth taking? Walk me through the math.", color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400" },
  { icon: BarChart2, title: "Grow my savings", prompt: "What are the best strategies to grow my savings faster?", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400" },
];

type ChatAttachment = { type: "image"; previewUrl: string; name: string } | { type: "document"; name: string };

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  attachment?: ChatAttachment;
  // Raw image data only stored for constructing pi-ai messages
  _imageData?: { base64: string; mimeType: string };
};

function toPiMessages(msgs: ChatMessage[], modelId: ModelId): Message[] {
  return msgs.map((m) => {
    if (m.role === "user") {
      const parts: (TextContent | ImageContent)[] = [];
      if (m.content) parts.push({ type: "text", text: m.content });
      if (m._imageData) parts.push({ type: "image", data: m._imageData.base64, mimeType: m._imageData.mimeType });
      return {
        role: "user",
        content: parts.length === 1 && parts[0].type === "text" ? (parts[0] as TextContent).text : parts,
        timestamp: Date.now(),
      };
    }
    return {
      role: "assistant",
      content: [{ type: "text", text: m.content }],
      api: "bedrock-converse-stream",
      provider: "amazon-bedrock",
      model: modelId === "sonnet"
        ? "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
        : "global.anthropic.claude-haiku-4-5-20251001-v1:0",
      usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
      stopReason: "stop",
      timestamp: Date.now(),
    };
  });
}

async function processAttachment(attachment: FileAttachment): Promise<{
  chatAttachment: ChatAttachment;
  textInjection?: string;
  imageData?: { base64: string; mimeType: string };
}> {
  const { file } = attachment;

  if (file.type.startsWith("image/")) {
    // base64 without the data: prefix
    const base64 = (attachment.previewUrl ?? "").replace(/^data:[^;]+;base64,/, "");
    return {
      chatAttachment: { type: "image", previewUrl: attachment.previewUrl!, name: file.name },
      imageData: { base64, mimeType: file.type },
    };
  }

  // PDF / text / CSV — extract server-side
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/extract-text", { method: "POST", body: form });
  const { text, error } = await res.json();

  if (error) throw new Error(error);

  // ~100k chars ≈ ~25k tokens, well within the 200k limit with room for conversation history
  const truncated = text.length > 100_000 ? text.slice(0, 100_000) + "\n\n[... file truncated for length ...]" : text;
  return {
    chatAttachment: { type: "document", name: file.name },
    textInjection: `[Attached file: ${file.name}]\n\n${truncated}\n\n---\n`,
  };
}

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelId, setModelId] = useState<ModelId>("haiku");
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt) setInput(prompt);
  }, [searchParams]);

  async function send(text?: string) {
    const rawText = (text ?? input).trim();
    if ((!rawText && !attachment) || isStreaming) return;

    setIsStreaming(true);

    let chatAttachment: ChatAttachment | undefined;
    let finalContent = rawText;
    let imageData: { base64: string; mimeType: string } | undefined;

    if (attachment) {
      try {
        const result = await processAttachment(attachment);
        chatAttachment = result.chatAttachment;
        imageData = result.imageData;
        if (result.textInjection) finalContent = result.textInjection + (rawText || "Please analyze this file.");
      } catch (err) {
        setIsStreaming(false);
        alert(`Failed to process file: ${String(err)}`);
        return;
      }
    }

    const userMsg: ChatMessage = { role: "user", content: rawText, attachment: chatAttachment, _imageData: imageData };
    // Store text+injection for API but display raw text
    const userMsgForApi: ChatMessage = { ...userMsg, content: finalContent };

    const next = [...messages, userMsg];
    const nextForApi = [...messages, userMsgForApi];

    setMessages(next);
    setInput("");
    setAttachment(null);

    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    setMessages([...next, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toPiMessages(nextForApi, modelId), systemPrompt: SYSTEM_PROMPT, modelId }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMsg.content += decoder.decode(value, { stream: true });
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
        updated[updated.length - 1] = { role: "assistant", content: `Error: ${String(err)}` };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-[#212121]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 bg-white dark:bg-[#2a2a2a] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-sm">iG</div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">iGrow</span>
        </div>
        <div className="flex gap-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-1">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setModelId(opt.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                modelId === opt.id
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {opt.label}
              <span className={`text-[10px] ${modelId === opt.id ? "text-emerald-500" : "text-zinc-400"}`}>{opt.sublabel}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col flex-1 overflow-hidden">
        {isEmpty ? (
          <div className="flex flex-col flex-1 items-center justify-center px-4 pb-4">
            <div className="flex flex-col items-center mb-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white text-2xl font-bold shadow-lg mb-5">iG</div>
              <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 text-center">How can I help you?</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-center mt-2 text-sm flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                Your personal financial assistant
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-2xl mb-8">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => send(s.prompt)}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#2a2a2a] p-4 text-left transition-all hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-700 hover:-translate-y-0.5 group"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{s.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">{s.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="w-full max-w-2xl">
              <PromptBox value={input} onValueChange={setInput} onSubmit={() => send()} isLoading={isStreaming} attachment={attachment} onAttachmentChange={setAttachment} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white text-xs font-bold mt-0.5 shadow-sm">iG</div>
                    )}
                    <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end flex flex-col" : ""}`}>
                      {/* Attachment preview */}
                      {msg.attachment && (
                        msg.attachment.type === "image" ? (
                          <img src={msg.attachment.previewUrl} alt={msg.attachment.name} className="max-h-48 rounded-2xl rounded-tr-sm object-cover shadow-sm" />
                        ) : (
                          <div className="flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-700 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200">
                            <FileText className="h-4 w-4 text-zinc-500 dark:text-zinc-300 shrink-0" />
                            {msg.attachment.name}
                          </div>
                        )
                      )}
                      {/* Message bubble */}
                      {(msg.content || msg.role === "assistant") && (
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-emerald-500 text-white rounded-tr-sm"
                              : "bg-white dark:bg-[#2a2a2a] text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm shadow-sm"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : msg.content ? (
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-3 last:mb-0 leading-7">{children}</p>,
                                ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1.5">{children}</ul>,
                                ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1.5">{children}</ol>,
                                li: ({ children }) => <li className="leading-7">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                code: ({ children, className }) =>
                                  className ? (
                                    <code className="block my-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 px-3 py-2.5 font-mono text-xs overflow-x-auto">{children}</code>
                                  ) : (
                                    <code className="rounded bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 font-mono text-xs">{children}</code>
                                  ),
                                pre: ({ children }) => <>{children}</>,
                                h1: ({ children }) => <h1 className="mt-4 mb-2 text-base font-bold">{children}</h1>,
                                h2: ({ children }) => <h2 className="mt-4 mb-2 text-sm font-bold">{children}</h2>,
                                h3: ({ children }) => <h3 className="mt-3 mb-1.5 text-sm font-semibold">{children}</h3>,
                                hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-700" />,
                                a: ({ href, children }) => (
                                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-emerald-600 dark:text-emerald-400">{children}</a>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="my-3 border-l-2 border-zinc-300 dark:border-zinc-600 pl-3 italic text-zinc-500 dark:text-zinc-400">{children}</blockquote>
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            <span className="flex gap-1">
                              <span className="animate-bounce">●</span>
                              <span className="animate-bounce [animation-delay:150ms]">●</span>
                              <span className="animate-bounce [animation-delay:300ms]">●</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="px-4 pb-4 shrink-0">
              <div className="max-w-2xl mx-auto">
                <PromptBox value={input} onValueChange={setInput} onSubmit={() => send()} isLoading={isStreaming} attachment={attachment} onAttachmentChange={setAttachment} />
                <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600 mt-2">
                  iGrow can make mistakes. Always verify financial decisions.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ChatPageWrapper() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}
