import { stream } from "@mariozechner/pi-ai";
import type { Message, Model } from "@mariozechner/pi-ai";

const MODELS: Record<string, Model<"bedrock-converse-stream">> = {
  haiku: {
    id: "global.anthropic.claude-haiku-4-5-20251001-v1:0",
    name: "Claude Haiku 4.5",
    api: "bedrock-converse-stream",
    provider: "amazon-bedrock",
    baseUrl: "https://bedrock-runtime.ap-southeast-1.amazonaws.com",
    reasoning: false,
    input: ["text", "image"],
    cost: { input: 0.8, output: 4, cacheRead: 0.08, cacheWrite: 1 },
    contextWindow: 200000,
    maxTokens: 8192,
  },
  sonnet: {
    id: "global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    name: "Claude Sonnet 4.5",
    api: "bedrock-converse-stream",
    provider: "amazon-bedrock",
    baseUrl: "https://bedrock-runtime.ap-southeast-1.amazonaws.com",
    reasoning: false,
    input: ["text", "image"],
    cost: { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
    contextWindow: 200000,
    maxTokens: 8192,
  },
};

export async function POST(request: Request) {
  const { messages, systemPrompt, modelId = "haiku" } = (await request.json()) as {
    messages: Message[];
    systemPrompt?: string;
    modelId?: string;
  };

  const model = MODELS[modelId] ?? MODELS.haiku;

  const FALLBACK_MESSAGE =
    "I'm having a little trouble connecting right now. Please try again in a moment — I'm here to help you grow your business with TNG! 🙏";

  const readable = new ReadableStream({
    async start(controller) {
      const enqueue = (text: string) =>
        controller.enqueue(new TextEncoder().encode(text));

      try {
        const eventStream = stream(
          model,
          { systemPrompt, messages },
          { region: "ap-southeast-1" },
        );

        for await (const event of eventStream) {
          if (event.type === "text_delta") {
            enqueue(event.delta as string);
          }
          if (event.type === "error") {
            const errMsg =
              (event.error as { errorMessage?: string })?.errorMessage ??
              "Unknown Bedrock error";
            console.error("[chat] stream error:", errMsg, event.error);
            // Emit a user-friendly fallback instead of the raw error string
            enqueue(FALLBACK_MESSAGE);
            controller.close();
            return;
          }
          if (event.type === "done") {
            controller.close();
            return;
          }
        }
        controller.close();
      } catch (err) {
        console.error("[chat] caught error:", err);
        // Emit a user-friendly fallback instead of the raw stack trace
        enqueue(FALLBACK_MESSAGE);
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
