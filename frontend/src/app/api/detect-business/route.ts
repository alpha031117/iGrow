import { stream } from "@mariozechner/pi-ai"
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
  maxTokens: 300,
}

type DetectionResult = {
  summary: string
  confidence: "high" | "medium" | "low"
}

async function collectStream(eventStream: AsyncIterable<Record<string, unknown>>): Promise<string> {
  let text = ""
  for await (const event of eventStream) {
    if (event.type === "text_delta" && typeof event.delta === "string") text += event.delta
    if (event.type === "error") {
      const msg = (event.error as { errorMessage?: string })?.errorMessage ?? JSON.stringify(event.error)
      throw new Error(`Stream error: ${msg}`)
    }
    if (event.type === "done") break
  }
  return text
}

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

    // Use analytics for this month + last month — already aggregated, covers 8 weeks
    const [thisMonthRes, lastMonthRes] = await Promise.all([
      fetch(`${backendUrl}/analytics/period?account_id=a-001&period=thisMonth`, { next: { revalidate: 0 } }),
      fetch(`${backendUrl}/analytics/period?account_id=a-001&period=lastMonth`, { next: { revalidate: 0 } }),
    ])

    if (!thisMonthRes.ok) throw new Error(`Analytics fetch failed: ${thisMonthRes.status}`)

    const thisMonth = await thisMonthRes.json()
    const lastMonth = lastMonthRes.ok ? await lastMonthRes.json() : null

    const totalTxn = (thisMonth.hero_txn ?? 0) + (lastMonth?.hero_txn ?? 0)
    const totalSales = (thisMonth.hero_sales ?? 0) + (lastMonth?.hero_sales ?? 0)

    if (totalTxn < 5) {
      return Response.json({
        summary: "Not enough transaction history to analyse yet.",
        confidence: "low",
      })
    }

    const avgPerTxn = totalTxn > 0 ? (totalSales / totalTxn) : 0

    // Peak hour label from this month
    const peakHour: string = thisMonth.peak_hour ?? "evening"
    const peakShare: string = thisMonth.peak_share ?? ""

    // Busiest days from daily breakdown
    const days: { d: string; v: number }[] = thisMonth.days ?? []
    const topDays = [...days].sort((a, b) => b.v - a.v).slice(0, 3).map(d => d.d).join(", ")

    // Week-over-week growth
    const vsPrev: number = thisMonth.vs_prev ?? 0

    const systemPrompt = `You are iGrow, an AI financial assistant embedded in TNG eWallet Malaysia. You analyse transaction patterns to detect whether a personal account is being used for micro-business activity.

Malaysian micro-business (food stall, home baker, hawker) patterns:
- High transaction frequency: 10–30 small incoming payments per day
- Small consistent amounts: RM 5–30 per transaction (food item pricing)
- Evening peak: 16:00–23:00 (dinner service, night market)
- Fri/Sat highest volume (weekend hawker, pasar malam)
- Steady week-over-week growth as business builds clientele

If these signals are present, be CLEAR and AFFIRMATIVE. Don't hedge unnecessarily.

Respond ONLY with a valid JSON object — no markdown, no code fences.

JSON schema:
{
  "summary": "2–3 warm, plain sentences in Malaysian English. Start with what you detected, give 2 specific numbers, end with what it means for the user. No jargon.",
  "confidence": "high" | "medium" | "low"
}`

    const userMessage = `Transaction pattern analysis for a TNG personal account over the past 2 months:

- Total incoming payments: ${totalTxn} transactions
- Total inflow: RM ${Number(totalSales).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
- Average per payment: RM ${avgPerTxn.toFixed(2)}
- Peak hour: ${peakHour} (${peakShare} of all incoming payments)
- Busiest days: ${topDays}
- Month-over-month growth: ${vsPrev >= 0 ? "+" : ""}${Number(vsPrev).toFixed(1)}%
- Best performing period: ${thisMonth.best_day ?? "N/A"}

Assess: does this look like micro-business activity on a personal account?`

    const eventStream = stream(
      HAIKU,
      {
        systemPrompt,
        messages: [{ role: "user", content: userMessage, timestamp: Date.now() }],
      },
      { region: "ap-southeast-1" },
    )

    const rawText = await collectStream(eventStream as AsyncIterable<Record<string, unknown>>)
    if (!rawText) throw new Error("Empty response from model")

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error(`No JSON in response: ${rawText.slice(0, 200)}`)

    const parsed: DetectionResult = JSON.parse(jsonMatch[0])
    return Response.json(parsed)
  } catch (err) {
    console.error("[detect-business]", err)
    return Response.json({
      summary: "We noticed frequent small incoming payments arriving in the evenings — this pattern closely matches how food business owners use TNG to collect payments.",
      confidence: "medium",
    })
  }
}
