export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") ?? "thisWeek"
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

  const res = await fetch(
    `${backendUrl}/analytics/period?account_id=a-001&period=${period}`,
    { next: { revalidate: 30 } }
  )
  if (!res.ok) {
    return Response.json({ error: "backend unavailable" }, { status: res.status })
  }

  const raw = await res.json()

  const heroSales = Number(raw.hero_sales)
  const vsPrev = Number(raw.vs_prev)

  return Response.json({
    periodLabel: raw.period_label,
    heroLabel: raw.hero_label,
    heroSales,
    heroTxn: raw.hero_txn,
    heroAvg: Number(raw.hero_avg),
    vsPrev,
    vsPrevLabel: raw.vs_prev_label,
    summary: {
      total: `RM ${heroSales.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`,
      avg: raw.daily_avg,
      bestDay: raw.best_day,
      vsPrev: `${vsPrev >= 0 ? "+" : ""}${vsPrev.toFixed(0)}%`,
      up: vsPrev >= 0,
    },
    days: raw.days,
    hours: raw.hours,
    peakHour: raw.peak_hour,
    peakShare: raw.peak_share,
    arriveBy: raw.arrive_by,
    weeks: raw.weeks,
    weekTrendLabel: raw.week_trend_label,
    monthEarned: raw.month_earned,
    monthPace: raw.month_pace,
    monthPct: raw.month_pct,
    monthLabel: raw.month_label,
  })
}
