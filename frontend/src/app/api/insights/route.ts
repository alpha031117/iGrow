import { complete } from "@mariozechner/pi-ai"
import type { Model } from "@mariozechner/pi-ai"

const HAIKU: Model<"bedrock-converse-stream"> = {
  id: "global.anthropic.claude-haiku-4-5-20251001-v1:0",
  name: "Claude Haiku 4.5",
  api: "bedrock-converse-stream",
  provider: "amazon-bedrock",
  baseUrl: "https://bedrock-runtime.ap-southeast-1.amazonaws.com",
  reasoning: false,
  input: ["text", "image"],
  cost: { input: 0.8, output: 4, cacheRead: 0.08, cacheWrite: 1 },
  contextWindow: 200000,
  maxTokens: 512,
}

type InsightCard = {
  title: string
  body: string
  icon: string
}

type InsightsResponse = {
  tip: InsightCard
  health: InsightCard
}

type InsightPayload = {
  periodLabel: string
  heroSales: number
  heroTxn: number
  heroAvg: number
  vsPrev: number
  vsPrevLabel: string
  bestDay: string
  dailyAvg: string
  peakHour: string
  peakShare: string
  days: { d: string; v: number }[]
  weekTrend: string
  category: string
  hasSSM: boolean
}

function buildSystemPrompt(payload: InsightPayload): string {
  return `You are iGrow, an AI business advisor for Malaysian micro-merchants using TNG eWallet.
Generate two short insight cards based on merchant sales data.
Respond ONLY with a valid JSON object — no markdown, no code fences, no explanation.

JSON schema:
{
  "tip": { "title": "2-4 words", "body": "1-2 sentences HTML with <strong> for key numbers, max 25 words", "icon": "single emoji" },
  "health": { "title": "2-4 words", "body": "1-2 sentences HTML with <strong> for key numbers, max 20 words", "icon": "single emoji" }
}

Rules:
- tip.body: actionable advice tied to a specific data pattern (best day, peak hour, or trend)
- health.body: one-line business health assessment (growing / stable / dipping)
- Use RM for currency; context is Malaysia
- Business type: ${payload.category}. SSM registered: ${payload.hasSSM ? "yes" : "no"}.
- Warm, encouraging tone even for dips`
}

function buildUserMessage(payload: InsightPayload): string {
  const daysStr = payload.days.map((d) => `${d.d}:${d.v}`).join(", ")
  return `Period: ${payload.periodLabel}
Sales: RM ${payload.heroSales} | Txns: ${payload.heroTxn} | Avg: RM ${payload.heroAvg.toFixed(2)}
vs prev: ${payload.vsPrev >= 0 ? "+" : ""}${payload.vsPrev}% (${payload.vsPrevLabel})
Best day: ${payload.bestDay} | Daily avg: ${payload.dailyAvg}
Peak: ${payload.peakHour} (${payload.peakShare} of sales)
Days (RM): ${daysStr}
Week trend: ${payload.weekTrend}`
}

export async function POST(request: Request) {
  try {
    const payload: InsightPayload = await request.json()

    const result = await complete(
      HAIKU,
      {
        systemPrompt: buildSystemPrompt(payload),
        messages: [
          {
            role: "user",
            content: buildUserMessage(payload),
            timestamp: Date.now(),
          },
        ],
      },
      { region: "ap-southeast-1" }
    )

    const rawText = result.content
      .filter((c) => c.type === "text")
      .map((c) => (c as { type: "text"; text: string }).text)
      .join("")

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON in response")

    const parsed: InsightsResponse = JSON.parse(jsonMatch[0])
    if (!parsed.tip?.body || !parsed.health?.body) throw new Error("Invalid response shape")

    return Response.json(parsed)
  } catch (err) {
    console.error("[insights]", err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
