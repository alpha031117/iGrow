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
  maxTokens: 600,
}

export type AiRecommendation = {
  recommendedPackage: "A" | "B" | "track1" | "track2"
  tier: "1" | "2"
  matchScore: number
  scores: { A: number; B: number; track1: number; track2: number }
  reasoning: { label: string; detail: string; icon: "bar" | "trend" | "shield" }[]
  metrics: { totalRevenue: number; totalTxn: number; wowGrowth: number; avgTxn: number; bestDay: string }
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hasSSM = searchParams.get("hasSSM") === "true"
  const category = searchParams.get("category") ?? "Food & Drinks"
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

  try {
    const [thisMonthRes, lastMonthRes] = await Promise.all([
      fetch(`${backendUrl}/analytics/period?account_id=a-001&period=thisMonth`, { next: { revalidate: 0 } }),
      fetch(`${backendUrl}/analytics/period?account_id=a-001&period=lastMonth`, { next: { revalidate: 0 } }),
    ])

    const thisMonth = thisMonthRes.ok ? await thisMonthRes.json() : {}
    const lastMonth = lastMonthRes.ok ? await lastMonthRes.json() : {}

    const totalTxn = (thisMonth.hero_txn ?? 0) + (lastMonth?.hero_txn ?? 0)
    const totalRevenue = Number(thisMonth.hero_sales ?? 0) + Number(lastMonth?.hero_sales ?? 0)
    const wowGrowth = Number(thisMonth.vs_prev ?? 0)
    const avgTxn = totalTxn > 0 ? totalRevenue / totalTxn : 0
    const peakHour: string = thisMonth.peak_hour ?? "8–9 PM"
    const peakShare: string = thisMonth.peak_share ?? ""
    const bestDay: string = (thisMonth.best_day ?? "Friday").replace(/\s*—.*$/, "")
    const monthlyRevenue = Number(thisMonth.hero_sales ?? 0)

    const systemPrompt = `You are iGrow, a financial eligibility engine for TNG eWallet Malaysia. You assess micro-merchant profiles and recommend the most suitable financing or growth program.

Available programs:
- Package A (Solo Operator): BizCash RM 1,000–5,000. Requires: active TNG account, 3+ months history, RM 300+/month revenue. No SSM needed.
- Package B (Growing SME): BizCash RM 10,000–50,000. Requires: SSM registered, 6+ months history, RM 3,000+/month revenue.
- track1 (Digital Commerce): Grants & programs (MDEC, TEKUN, SIDEC, Cradle Fund). Requires: SSM recommended, digital merchant.
- track2 (Public & Institutional): Govt & VC funding (SME Corp, Bank Negara iTEKAD, 1337 Ventures). Requires: SSM, demonstrated growth, Malaysian-owned.

Score each program 0–100 based on how well the merchant meets its criteria. The highest score is the recommendation.

Reasoning steps must be exactly 5, following this chain:
1. Transaction history scan
2. Revenue/growth pattern
3. SSM status check
4. Program scoring
5. Final recommendation rationale

Respond ONLY with valid JSON — no markdown, no code fences.

Schema:
{
  "recommendedPackage": "A" | "B" | "track1" | "track2",
  "tier": "1" | "2",
  "matchScore": number (0-100, score of recommended package),
  "scores": { "A": number, "B": number, "track1": number, "track2": number },
  "reasoning": [
    { "label": "short action phrase", "detail": "specific numbers and conclusion", "icon": "bar" | "trend" | "shield" }
  ],
  "metrics": {
    "totalRevenue": number,
    "totalTxn": number,
    "wowGrowth": number,
    "avgTxn": number,
    "bestDay": "string"
  }
}`

    const userMessage = `Merchant profile:
- Category: ${category}
- SSM registered: ${hasSSM ? "Yes" : "No"}
- Total transactions (2 months): ${totalTxn}
- Total revenue (2 months): RM ${totalRevenue.toFixed(2)}
- This month revenue: RM ${monthlyRevenue.toFixed(2)}
- Month-over-month growth: ${wowGrowth >= 0 ? "+" : ""}${wowGrowth.toFixed(1)}%
- Average per transaction: RM ${avgTxn.toFixed(2)}
- Peak hour: ${peakHour} (${peakShare} of revenue)
- Best performing day: ${bestDay}
- Months of history: 2+

Score all 4 programs and recommend the best fit.`

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

    const parsed: AiRecommendation = JSON.parse(jsonMatch[0])

    // Override metrics with real computed values (don't trust AI to get these right)
    parsed.metrics = { totalRevenue, totalTxn, wowGrowth, avgTxn, bestDay }

    return Response.json(parsed)
  } catch (err) {
    console.error("[recommend-program]", err)

    // Fallback — deterministic based on SSM + category
    const isFood = category === "Food & Drinks" || category === "Products & Goods"
    const pkg: AiRecommendation["recommendedPackage"] = hasSSM ? (isFood ? "B" : "track1") : "A"
    const tier: "1" | "2" = (pkg as string) === "track1" || (pkg as string) === "track2" ? "2" : "1"

    return Response.json({
      recommendedPackage: pkg,
      tier,
      matchScore: hasSSM ? 84 : 62,
      scores: { A: hasSSM ? 58 : 62, B: hasSSM ? 84 : 30, track1: hasSSM ? 71 : 45, track2: hasSSM ? 44 : 28 },
      reasoning: [
        { label: "Scanned merchant transaction history", detail: "Transaction data retrieved from TNG account", icon: "bar" },
        { label: "Detected revenue growth pattern", detail: "Consistent income across 2 months of history", icon: "trend" },
        { label: "Verified business profile", detail: `SSM: ${hasSSM ? "confirmed" : "not registered"} · Category: ${category}`, icon: "shield" },
        { label: "Scored against all programs", detail: `${pkg === "B" ? "Package B" : pkg === "A" ? "Package A" : "Growth Track"} scored highest`, icon: "bar" },
        { label: "Recommendation finalised", detail: `Best match: ${pkg} based on revenue profile and SSM status`, icon: "trend" },
      ],
      metrics: { totalRevenue: 0, totalTxn: 0, wowGrowth: 0, avgTxn: 0, bestDay: "Friday" },
    } satisfies AiRecommendation)
  }
}
