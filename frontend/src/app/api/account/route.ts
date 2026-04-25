export async function GET() {
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000"

  const res = await fetch(`${backendUrl}/accounts/a-001`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    return Response.json({ error: "backend error" }, { status: res.status })
  }

  const raw = await res.json()
  return Response.json({
    id: raw.id,
    accountNumber: raw.account_number,
    balance: raw.balance,
    currency: raw.currency,
  })
}
