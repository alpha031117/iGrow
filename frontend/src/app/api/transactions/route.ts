export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get("limit") ?? "50"
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

  const res = await fetch(
    `${backendUrl}/transactions?account_id=a-001&limit=${limit}`,
    { next: { revalidate: 30 } },
  )
  if (!res.ok) {
    return Response.json({ error: "backend error" }, { status: res.status })
  }

  const raw = await res.json()
  const data = (raw.data ?? []).map((tx: Record<string, unknown>) => ({
    id: tx.id,
    title: tx.title,
    amount: Number(tx.amount),
    direction: tx.direction,
    status: tx.status,
    transactedAt: tx.transacted_at,
    category: {
      id: (tx.category as Record<string, unknown>)?.id,
      name: (tx.category as Record<string, unknown>)?.name,
      type: (tx.category as Record<string, unknown>)?.type,
      iconColor: (tx.category as Record<string, unknown>)?.icon_color,
    },
  }))

  return Response.json({ data, total: raw.total })
}
