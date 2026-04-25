"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, FileText, ChevronRight, Clock, Calendar,
  TrendingUp, TrendingDown, CheckCircle,
} from "lucide-react"

// ─── TNG Colour tokens ───────────────────────────────────────────────
const C = {
  pri: "#1A5FD5",
  priLight: "#2B7BE5",
  priDark: "#0D2B6E",
  priBg: "#EEF2FB",
  priMuted: "#D6E4FF",
  grn: "#10b981",
  grnBg: "#ecfdf5",
  warn: "#f59e0b",
  warnBg: "#fffbeb",
  red: "#ef4444",
  redBg: "#fef2f2",
  blu: "#3b82f6",
  bluBg: "#eff6ff",
  g50: "#f8fafc",
  g100: "#f1f5f9",
  g200: "#e2e8f0",
  g300: "#cbd5e1",
  g400: "#94a3b8",
  g500: "#64748b",
  g600: "#475569",
  g700: "#334155",
  g900: "#0f172a",
}

// ─── Mock data ────────────────────────────────────────────────────────
type PeriodData = {
  periodLabel: string
  heroLabel: string
  heroSales: number
  heroTxn: number
  heroAvg: number
  vsPrev: number
  vsPrevLabel: string
  summary: { total: string; avg: string; bestDay: string; vsPrev: string; up: boolean }
  days: { d: string; v: number }[]
  hours: { t: string; pct: number }[]
  peakHour: string
  peakShare: string
  arriveBy: string
  tip: { icon: string; title: string; color: string; bg: string; border: string; body: string }
  monthEarned: string | null
  monthPace: string | null
  monthPct: number
  monthLabel: string
  weeks: { w: string; v: number }[]
  weekTrendLabel: string
  health: { icon: string; title: string; color: string; bg: string; border: string; body: string }
}

const DATA: Record<string, PeriodData> = {
  thisWeek: {
    periodLabel: "This Week", heroLabel: "Weekly Sales", heroSales: 1440, heroTxn: 218, heroAvg: 6.61, vsPrev: 14, vsPrevLabel: "vs last week",
    summary: { total: "RM 1,440", avg: "RM 206 / day", bestDay: "Friday — RM 342", vsPrev: "+14%", up: true },
    days: [{ d: "Mon", v: 145 }, { d: "Tue", v: 180 }, { d: "Wed", v: 195 }, { d: "Thu", v: 210 }, { d: "Fri", v: 342 }, { d: "Sat", v: 305 }, { d: "Sun", v: 63 }],
    hours: [{ t: "4–5 PM", pct: 8 }, { t: "5–6 PM", pct: 15 }, { t: "6–7 PM", pct: 55 }, { t: "7–8 PM", pct: 90 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 70 }, { t: "10–11 PM", pct: 35 }, { t: "11–12 AM", pct: 10 }],
    peakHour: "7–9 PM", peakShare: "62%", arriveBy: "6:30 PM",
    tip: { icon: "💡", title: "Smart Insight", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "Your Friday + Saturday sales make up <strong>52%</strong> of weekly income. Consider stocking 20% more on these days." },
    monthEarned: "RM 4,320", monthPace: "RM 5,760", monthPct: 75, monthLabel: "earned so far in April",
    weeks: [{ w: "Week 1", v: 980 }, { w: "Week 2", v: 1120 }, { w: "Week 3", v: 1260 }, { w: "Week 4 (now)", v: 1440 }],
    weekTrendLabel: "April Weekly Trend",
    health: { icon: "🌱", title: "Growing Steady", color: C.grn, bg: `linear-gradient(135deg,${C.grnBg},#fff)`, border: "#a7f3d0", body: "Income up for <strong>3 weeks straight</strong>. Keep this pace!" },
  },
  lastWeek: {
    periodLabel: "Last Week", heroLabel: "Weekly Sales", heroSales: 1260, heroTxn: 194, heroAvg: 6.49, vsPrev: 12, vsPrevLabel: "vs week before",
    summary: { total: "RM 1,260", avg: "RM 180 / day", bestDay: "Saturday — RM 298", vsPrev: "+12%", up: true },
    days: [{ d: "Mon", v: 120 }, { d: "Tue", v: 155 }, { d: "Wed", v: 168 }, { d: "Thu", v: 190 }, { d: "Fri", v: 290 }, { d: "Sat", v: 298 }, { d: "Sun", v: 39 }],
    hours: [{ t: "4–5 PM", pct: 6 }, { t: "5–6 PM", pct: 12 }, { t: "6–7 PM", pct: 50 }, { t: "7–8 PM", pct: 85 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 65 }, { t: "10–11 PM", pct: 30 }, { t: "11–12 AM", pct: 8 }],
    peakHour: "7–9 PM", peakShare: "58%", arriveBy: "6:30 PM",
    tip: { icon: "💡", title: "Smart Insight", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "Saturday was your top earner. The 7–9 PM slot brought <strong>58%</strong> of total sales." },
    monthEarned: "RM 4,320", monthPace: "RM 5,760", monthPct: 75, monthLabel: "earned so far in April",
    weeks: [{ w: "Week 1", v: 980 }, { w: "Week 2", v: 1120 }, { w: "Week 3", v: 1260 }],
    weekTrendLabel: "April Weekly Trend",
    health: { icon: "💪", title: "Solid Week", color: C.blu, bg: `linear-gradient(135deg,${C.bluBg},#fff)`, border: "#93c5fd", body: "You earned <strong>12% more</strong> than the week before." },
  },
  customWeek: {
    periodLabel: "Custom Range", heroLabel: "Total Sales", heroSales: 2680, heroTxn: 412, heroAvg: 6.50, vsPrev: 0, vsPrevLabel: "",
    summary: { total: "RM 2,680", avg: "RM 191 / day", bestDay: "Saturdays — avg RM 295", vsPrev: "—", up: true },
    days: [{ d: "Mon", v: 310 }, { d: "Tue", v: 360 }, { d: "Wed", v: 380 }, { d: "Thu", v: 400 }, { d: "Fri", v: 520 }, { d: "Sat", v: 490 }, { d: "Sun", v: 120 }],
    hours: [{ t: "4–5 PM", pct: 10 }, { t: "5–6 PM", pct: 18 }, { t: "6–7 PM", pct: 50 }, { t: "7–8 PM", pct: 88 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 65 }, { t: "10–11 PM", pct: 30 }, { t: "11–12 AM", pct: 8 }],
    peakHour: "7–9 PM", peakShare: "59%", arriveBy: "6:30 PM",
    tip: { icon: "💡", title: "Range Insight", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "In your selected period, <strong>weekends</strong> contributed the most revenue." },
    monthEarned: null, monthPace: null, monthPct: 0, monthLabel: "", weeks: [], weekTrendLabel: "",
    health: { icon: "🔍", title: "Custom Analysis", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "Showing data for your selected date range." },
  },
  thisMonth: {
    periodLabel: "April 2026", heroLabel: "Monthly Sales", heroSales: 4320, heroTxn: 672, heroAvg: 6.43, vsPrev: 9, vsPrevLabel: "vs March",
    summary: { total: "RM 4,320", avg: "RM 216 / day", bestDay: "Fridays — avg RM 310", vsPrev: "+9%", up: true },
    days: [{ d: "Mon", v: 520 }, { d: "Tue", v: 610 }, { d: "Wed", v: 640 }, { d: "Thu", v: 690 }, { d: "Fri", v: 890 }, { d: "Sat", v: 820 }, { d: "Sun", v: 150 }],
    hours: [{ t: "4–5 PM", pct: 7 }, { t: "5–6 PM", pct: 14 }, { t: "6–7 PM", pct: 52 }, { t: "7–8 PM", pct: 88 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 68 }, { t: "10–11 PM", pct: 32 }, { t: "11–12 AM", pct: 9 }],
    peakHour: "7–9 PM", peakShare: "60%", arriveBy: "6:30 PM",
    tip: { icon: "💡", title: "Monthly Insight", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "Averaging <strong>RM 216/day</strong>. Fridays outperform by 40%." },
    monthEarned: "RM 4,320", monthPace: "RM 5,760", monthPct: 75, monthLabel: "earned so far in April",
    weeks: [{ w: "Week 1", v: 980 }, { w: "Week 2", v: 1120 }, { w: "Week 3", v: 1260 }, { w: "Week 4 (now)", v: 1440 }],
    weekTrendLabel: "April Weekly Trend",
    health: { icon: "🌱", title: "Great Month So Far", color: C.grn, bg: `linear-gradient(135deg,${C.grnBg},#fff)`, border: "#a7f3d0", body: "On track for your <strong>best month yet</strong>." },
  },
  lastMonth: {
    periodLabel: "March 2026", heroLabel: "Monthly Sales", heroSales: 3960, heroTxn: 624, heroAvg: 6.35, vsPrev: -3, vsPrevLabel: "vs February",
    summary: { total: "RM 3,960", avg: "RM 198 / day", bestDay: "Saturdays — avg RM 285", vsPrev: "-3%", up: false },
    days: [{ d: "Mon", v: 480 }, { d: "Tue", v: 540 }, { d: "Wed", v: 580 }, { d: "Thu", v: 620 }, { d: "Fri", v: 780 }, { d: "Sat", v: 810 }, { d: "Sun", v: 150 }],
    hours: [{ t: "4–5 PM", pct: 9 }, { t: "5–6 PM", pct: 16 }, { t: "6–7 PM", pct: 48 }, { t: "7–8 PM", pct: 82 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 72 }, { t: "10–11 PM", pct: 38 }, { t: "11–12 AM", pct: 12 }],
    peakHour: "8–10 PM", peakShare: "55%", arriveBy: "7:00 PM",
    tip: { icon: "💡", title: "Monthly Recap", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "March dipped due to <strong>weaker Mon–Tue</strong>. Weekends stayed strong." },
    monthEarned: "RM 3,960", monthPace: null, monthPct: 100, monthLabel: "total for March 2026",
    weeks: [{ w: "Week 1", v: 920 }, { w: "Week 2", v: 1040 }, { w: "Week 3", v: 1020 }, { w: "Week 4", v: 980 }],
    weekTrendLabel: "March Weekly Trend",
    health: { icon: "⚠️", title: "Slight Dip", color: C.warn, bg: `linear-gradient(135deg,${C.warnBg},#fff)`, border: "#fde68a", body: "March was <strong>3% below</strong> February." },
  },
  customMonth: {
    periodLabel: "Custom Range", heroLabel: "Total Sales", heroSales: 8280, heroTxn: 1296, heroAvg: 6.39, vsPrev: 0, vsPrevLabel: "",
    summary: { total: "RM 8,280", avg: "RM 207 / day", bestDay: "Fridays — avg RM 310", vsPrev: "—", up: true },
    days: [{ d: "Mon", v: 1000 }, { d: "Tue", v: 1150 }, { d: "Wed", v: 1220 }, { d: "Thu", v: 1310 }, { d: "Fri", v: 1670 }, { d: "Sat", v: 1630 }, { d: "Sun", v: 300 }],
    hours: [{ t: "4–5 PM", pct: 8 }, { t: "5–6 PM", pct: 15 }, { t: "6–7 PM", pct: 50 }, { t: "7–8 PM", pct: 85 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 70 }, { t: "10–11 PM", pct: 35 }, { t: "11–12 AM", pct: 10 }],
    peakHour: "7–9 PM", peakShare: "60%", arriveBy: "6:30 PM",
    tip: { icon: "💡", title: "Range Insight", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "In your selected period, <strong>weekends</strong> contributed the most revenue." },
    monthEarned: null, monthPace: null, monthPct: 0, monthLabel: "", weeks: [], weekTrendLabel: "",
    health: { icon: "🔍", title: "Custom Analysis", color: C.pri, bg: `linear-gradient(135deg,${C.priBg},#fff)`, border: C.priMuted, body: "Showing data for your selected date range." },
  },
}

// ─── Sub-components ───────────────────────────────────────────────────

function SvgRing({ pct, size, strokeW, color }: { pct: number; size: number; strokeW: number; color: string }) {
  const r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.g200} strokeWidth={strokeW} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeW}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .6s ease" }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        style={{ fontSize: size * 0.21, fontWeight: 800, fill: color, fontFamily: "Inter, sans-serif" }}>
        {pct}%
      </text>
    </svg>
  )
}

function phBarColor(pct: number) {
  if (pct >= 85) return `linear-gradient(90deg,${C.pri},${C.priLight})`
  if (pct >= 50) return `linear-gradient(90deg,${C.priMuted},${C.priLight})`
  if (pct >= 20) return C.g300
  return C.g200
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[.7px] px-6 pb-2.5 pt-1" style={{ color: C.g400 }}>
      {children}
    </p>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-[20px] p-5 mx-5 mb-4 shadow-sm ${className ?? ""}`}>
      {children}
    </div>
  )
}

// ─── Report sheet ─────────────────────────────────────────────────────

type SheetState = "idle" | "open"
type GenState = Record<string, "idle" | "generating">

function ReportSheet({ open, onClose, activeData }: { open: boolean; onClose: () => void; activeData: PeriodData }) {
  const [genState, setGenState] = useState<GenState>({ weekly: "idle", monthly: "idle", annual: "idle" })
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function genPDF(type: "weekly" | "monthly" | "annual") {
    setGenState(s => ({ ...s, [type]: "generating" }))
    await new Promise(r => setTimeout(r, 800))

    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF({ unit: "mm", format: "a4" })
    const W = 210, M = 20, CW = W - 2 * M
    let y = 20

    // Header
    doc.setFillColor(26, 95, 213); doc.rect(0, 0, W, 38, "F")
    doc.setFillColor(13, 43, 110); doc.rect(0, 30, W, 8, "F")
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.setFont("helvetica", "bold")
    doc.text("iGrow", M, 18)
    doc.setFontSize(10); doc.setFont("helvetica", "normal")
    const tl = type === "weekly" ? "Weekly Report" : type === "monthly" ? "Monthly Report" : "Annual Report"
    doc.text(`${tl} — Brisval`, M, 26)
    doc.text(new Date().toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }), W - M, 26, { align: "right" })
    y = 48

    const d = activeData
    doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.setFont("helvetica", "bold")
    doc.text("Key Metrics", M, y); y += 8
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3)

    const rows: [string, string][] = [
      ["Total Sales", `RM ${d.heroSales.toLocaleString()}`],
      ["Transactions", `${d.heroTxn}`],
      ["Avg / Txn", `RM ${d.heroAvg.toFixed(2)}`],
      ["vs Previous", `${d.vsPrev >= 0 ? "+" : ""}${d.vsPrev}%`],
      ["Daily Average", d.summary.avg],
      ["Best Day", d.summary.bestDay],
    ]
    rows.forEach(([l, v]) => {
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139)
      doc.text(l, M, y)
      doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42)
      doc.text(v, W - M, y, { align: "right" })
      y += 7; doc.line(M, y - 3, W - M, y - 3)
    })
    y += 6

    // Bar chart
    doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.setFont("helvetica", "bold")
    doc.text("Sales By Day", M, y); y += 10
    const maxD = Math.max(...d.days.map(x => x.v)), bw = (CW - 18) / 7
    d.days.forEach((day, i) => {
      const x = M + i * (bw + 3), bH = Math.max((day.v / maxD) * 30, 2), best = day.v === maxD
      doc.setFillColor(best ? 26 : 226, best ? 95 : 232, best ? 213 : 240)
      doc.roundedRect(x, y + 30 - bH, bw, bH, 1.5, 1.5, "F")
      doc.setFontSize(7); doc.setFont("helvetica", "bold")
      doc.setTextColor(best ? 26 : 100, best ? 95 : 116, best ? 213 : 139)
      doc.text(`RM ${day.v}`, x + bw / 2, y + 30 - bH - 2, { align: "center" })
      doc.setTextColor(100, 116, 139); doc.setFontSize(8); doc.setFont("helvetica", "normal")
      doc.text(day.d, x + bw / 2, y + 36, { align: "center" })
    })
    y += 46

    // Peak hours
    doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.setFont("helvetica", "bold")
    doc.text("Peak Hours", M, y); y += 8
    d.hours.forEach(hr => {
      const bW = (hr.pct / 100) * CW * 0.7, pk = hr.pct >= 85
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139)
      doc.text(hr.t, M, y + 3)
      doc.setFillColor(pk ? 26 : 226, pk ? 95 : 232, pk ? 213 : 240)
      doc.roundedRect(M + 38, y - 1, Math.max(bW, 3), 5, 1.5, 1.5, "F")
      doc.setFontSize(7); doc.setFont("helvetica", "bold")
      doc.setTextColor(pk ? 26 : 100, pk ? 95 : 116, pk ? 213 : 139)
      doc.text(`${hr.pct}%`, M + 38 + Math.max(bW, 3) + 3, y + 3)
      y += 7
    })
    y += 4

    doc.setFillColor(238, 242, 251); doc.roundedRect(M, y, CW, 10, 3, 3, "F")
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(26, 95, 213)
    doc.text(`Peak: ${d.peakHour} (${d.peakShare})  |  Arrive by ${d.arriveBy}`, M + 4, y + 6.5)
    y += 18

    if (y > 255) { doc.addPage(); y = 20 }
    doc.setFillColor(236, 253, 245); doc.roundedRect(M, y, CW, 16, 3, 3, "F")
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(16, 185, 129)
    doc.text("iGrow Insight", M + 6, y + 7)
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100, 116, 139)
    const insightText = d.tip.body.replace(/<[^>]+>/g, "")
    doc.text(doc.splitTextToSize(insightText, CW - 12), M + 6, y + 12)

    doc.setFontSize(7); doc.setTextColor(148, 163, 184)
    doc.text("Generated by iGrow · Powered by TNG", W / 2, 285, { align: "center" })
    doc.save(`iGrow-${tl.replace(" ", "-")}-${new Date().toISOString().slice(0, 10)}.pdf`)

    setGenState(s => ({ ...s, [type]: "idle" }))
    onClose()
    showToast(`${tl} downloaded!`)
  }

  const opts = [
    { key: "weekly" as const, label: "Weekly Report", desc: "7-day summary with daily breakdown & tips", badge: "W", badgeBg: C.priBg, badgeColor: C.pri },
    { key: "monthly" as const, label: "Monthly Report", desc: "30-day overview with weekly trends & insights", badge: "M", badgeBg: C.grnBg, badgeColor: C.grn },
    { key: "annual" as const, label: "Annual Report", desc: "12-month performance with growth trajectory", badge: "Y", badgeBg: C.bluBg, badgeColor: C.blu },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.4)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-1/2 w-full max-w-[430px] bg-white rounded-t-3xl px-6 pt-5 pb-9 z-50 transition-transform duration-300"
        style={{ transform: `translateX(-50%) translateY(${open ? "0" : "100%"})` }}
      >
        <div className="w-9 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: C.g300 }} />
        <p className="text-[18px] font-bold mb-1" style={{ color: C.g900, letterSpacing: "-0.3px" }}>Generate Report</p>
        <p className="text-[13px] mb-5 leading-relaxed" style={{ color: C.g500 }}>Download a PDF summary of your business performance.</p>

        {opts.map(o => {
          const busy = genState[o.key] === "generating"
          return (
            <div
              key={o.key}
              onClick={() => !busy && genPDF(o.key)}
              className="flex items-center gap-3.5 p-4 rounded-2xl mb-2.5 border-[1.5px] cursor-pointer transition-all duration-200 active:scale-[.98]"
              style={{
                borderColor: busy ? C.pri : C.g200,
                backgroundColor: busy ? C.priBg : "white",
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[18px] font-bold shrink-0"
                style={{ backgroundColor: o.badgeBg, color: o.badgeColor }}>
                {o.badge}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold" style={{ color: C.g900 }}>{o.label}</p>
                <p className="text-[12px] mt-0.5 leading-snug" style={{ color: C.g500 }}>{o.desc}</p>
              </div>
              {busy
                ? <div className="w-[18px] h-[18px] rounded-full border-[2.5px] border-[#EEF2FB] border-t-[#1A5FD5] animate-spin shrink-0" />
                : <ChevronRight className="shrink-0 w-5 h-5" style={{ color: C.g300 }} />
              }
            </div>
          )
        })}

        <button
          onClick={onClose}
          className="w-full mt-2 py-3.5 rounded-2xl text-[14px] font-bold transition-colors"
          style={{ backgroundColor: C.g100, color: C.g600 }}
        >
          Cancel
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-[13px] font-semibold text-white"
          style={{ backgroundColor: C.g900 }}>
          <CheckCircle className="w-4 h-4" style={{ color: C.grn }} />
          {toast}
        </div>
      )}
    </>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"week" | "month">("week")
  const [weekFilter, setWeekFilter] = useState<string>("thisWeek")
  const [monthFilter, setMonthFilter] = useState<string>("thisMonth")
  const [showCustom, setShowCustom] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const now = new Date().toISOString().slice(0, 10)
    setDateFrom(now); setDateTo(now)
  }, [])

  const activeKey = activeTab === "week" ? weekFilter : monthFilter
  const d = DATA[activeKey]

  function applyCustom() {
    if (!dateFrom || !dateTo) return
    const label = `${dateFrom} to ${dateTo}`
    if (activeTab === "week") {
      DATA.customWeek.periodLabel = label
      setWeekFilter("customWeek")
    } else {
      DATA.customMonth.periodLabel = label
      setMonthFilter("customMonth")
    }
    setShowCustom(false)
  }

  if (!mounted) return null

  const maxDay = Math.max(...d.days.map(x => x.v))
  const weeks = d.weeks.filter(w => w.v !== null)
  const maxWeek = weeks.length ? Math.max(...weeks.map(x => x.v)) : 1
  const dateStr = new Date().toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  const weekFilters = [{ key: "thisWeek", label: "This Week" }, { key: "lastWeek", label: "Last Week" }]
  const monthFilters = [{ key: "thisMonth", label: "This Month" }, { key: "lastMonth", label: "Last Month" }]
  const subFilters = activeTab === "week" ? weekFilters : monthFilters
  const activeFilter = activeTab === "week" ? weekFilter : monthFilter
  const setFilter = activeTab === "week" ? setWeekFilter : setMonthFilter
  const customKey = activeTab === "week" ? "customWeek" : "customMonth"

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: C.g50, fontFamily: "Inter, sans-serif", maxWidth: 430, margin: "0 auto" }}>

      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-12 pb-6" style={{ background: `linear-gradient(145deg,${C.pri},${C.priDark})` }}>
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,.06)" }} />
        <div className="absolute -left-5 -bottom-8 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,.04)" }} />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <button onClick={() => router.push("/")} className="flex items-center gap-1 mb-3" style={{ color: "rgba(255,255,255,.7)" }}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[13px]">Home</span>
            </button>
            <p className="text-[14px] font-medium" style={{ color: "rgba(255,255,255,.7)" }}>Good evening,</p>
            <p className="text-[24px] font-extrabold mt-0.5 tracking-tight text-white">Brisval</p>
            <p className="text-[12px] mt-1.5 font-medium" style={{ color: "rgba(255,255,255,.5)" }}>{dateStr}</p>
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold text-white border transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", borderColor: "rgba(255,255,255,.2)" }}
          >
            <FileText className="w-4 h-4" />
            Report
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="mx-5 mt-4 bg-white rounded-2xl p-1.5 flex relative shadow-sm">
        <div
          className="absolute top-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-xl transition-transform duration-300"
          style={{ left: 6, background: `linear-gradient(135deg,${C.pri},${C.priDark})`, transform: `translateX(${activeTab === "month" ? "100%" : "0"})` }}
        />
        {(["week", "month"] as const).map(t => (
          <button
            key={t}
            onClick={() => { setActiveTab(t); setShowCustom(false) }}
            className="flex-1 text-center py-3 text-[14px] font-bold relative z-10 rounded-xl transition-colors duration-200"
            style={{ color: activeTab === t ? "white" : C.g500 }}
          >
            {t === "week" ? "Week" : "Month"}
          </button>
        ))}
      </div>

      {/* Sub filters */}
      <div className="flex gap-2 px-5 pt-3 items-center">
        {subFilters.map(f => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setShowCustom(false) }}
            className="px-4 py-2 rounded-xl text-[12.5px] font-semibold border-[1.5px] transition-all whitespace-nowrap"
            style={{
              color: activeFilter === f.key ? C.pri : C.g500,
              backgroundColor: activeFilter === f.key ? C.priBg : "white",
              borderColor: activeFilter === f.key ? C.pri : C.g200,
            }}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(v => !v)}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold border-[1.5px] transition-all"
          style={{
            color: activeFilter === customKey ? C.pri : C.g500,
            backgroundColor: activeFilter === customKey ? C.priBg : "white",
            borderColor: activeFilter === customKey ? C.pri : C.g200,
          }}
        >
          <Calendar className="w-3.5 h-3.5" />
          Custom
        </button>
      </div>

      {/* Custom range picker */}
      {showCustom && (
        <div className="mx-5 mt-2.5 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex gap-2.5 mb-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold mb-1" style={{ color: C.g500 }}>From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium border-[1.5px] outline-none transition-colors"
                style={{ borderColor: C.g200, color: C.g700 }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold mb-1" style={{ color: C.g500 }}>To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] font-medium border-[1.5px] outline-none transition-colors"
                style={{ borderColor: C.g200, color: C.g700 }}
              />
            </div>
          </div>
          <button
            onClick={applyCustom}
            className="w-full py-3 rounded-xl text-[13px] font-bold text-white transition-colors"
            style={{ background: `linear-gradient(135deg,${C.pri},${C.priDark})` }}
          >
            Apply Range
          </button>
        </div>
      )}

      <div className="h-4" />

      {/* ── Hero metrics ── */}
      <div className="grid grid-cols-2 gap-3 px-5 mb-4">
        {/* Sales card */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-14 h-14 rounded-bl-[60px]" style={{ background: `linear-gradient(135deg,rgba(26,95,213,.08),transparent)` }} />
          <p className="text-[11px] font-semibold uppercase tracking-[.5px]" style={{ color: C.g400 }}>{d.heroLabel}</p>
          <p className="text-[26px] font-extrabold my-1.5 tracking-tight" style={{ color: C.g900 }}>RM {d.heroSales.toLocaleString()}</p>
          {d.vsPrevLabel ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-lg"
              style={{ color: d.vsPrev >= 0 ? C.grn : C.red, backgroundColor: d.vsPrev >= 0 ? C.grnBg : C.redBg }}>
              {d.vsPrev >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(d.vsPrev)}% {d.vsPrevLabel}
            </span>
          ) : null}
        </div>
        {/* Txn card */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-14 h-14 rounded-bl-[60px]" style={{ background: `linear-gradient(135deg,rgba(16,185,129,.08),transparent)` }} />
          <p className="text-[11px] font-semibold uppercase tracking-[.5px]" style={{ color: C.g400 }}>Transactions</p>
          <p className="text-[26px] font-extrabold my-1.5 tracking-tight" style={{ color: C.g900 }}>{d.heroTxn}</p>
          <span className="inline-flex items-center text-[12px] font-semibold px-2 py-0.5 rounded-lg" style={{ color: C.g500, backgroundColor: C.g100 }}>
            avg RM {d.heroAvg.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ── Summary ── */}
      <SectionLabel>{d.periodLabel} Summary</SectionLabel>
      <Card>
        {[
          { label: "Total earned", value: d.summary.total, color: C.g900 },
          { label: "Daily average", value: d.summary.avg, color: C.g900 },
          { label: "Best day", value: d.summary.bestDay, color: C.pri },
        ].map((row, i) => (
          <div key={i} className={`flex justify-between items-center py-2.5 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: C.g100 }}>
            <span className="text-[13.5px] font-medium" style={{ color: C.g500 }}>{row.label}</span>
            <span className="text-[14px] font-bold" style={{ color: row.color }}>{row.value}</span>
          </div>
        ))}
        {d.summary.vsPrev !== "—" && (
          <div className="flex justify-between items-center py-2.5 border-t" style={{ borderColor: C.g100 }}>
            <span className="text-[13.5px] font-medium" style={{ color: C.g500 }}>vs previous</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-bold"
              style={{ color: d.summary.up ? C.grn : C.red, backgroundColor: d.summary.up ? C.grnBg : C.redBg }}>
              {d.summary.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {d.summary.vsPrev}
            </span>
          </div>
        )}
      </Card>

      {/* ── Bar chart ── */}
      <SectionLabel>Sales By Day</SectionLabel>
      <Card>
        <div className="flex items-end gap-1.5 h-28 pt-3">
          {d.days.map((x, i) => {
            const ht = Math.max((x.v / maxDay) * 90, 4)
            const best = x.v === maxDay
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="relative w-full rounded-lg" style={{
                  height: ht,
                  background: best ? `linear-gradient(180deg,${C.pri},${C.priDark})` : C.g200,
                  transition: "height .5s cubic-bezier(.4,0,.2,1)"
                }}>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: best ? C.pri : C.g700 }}>
                    RM {x.v}
                  </span>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: best ? C.pri : C.g400 }}>{x.d}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── Peak hours ── */}
      <SectionLabel>Evening Timeline</SectionLabel>
      <Card>
        <div className="flex flex-col gap-0.5">
          {d.hours.map((h, i) => {
            const isPeak = h.pct >= 85
            return (
              <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl" style={{ backgroundColor: isPeak ? C.priBg : "transparent" }}>
                <span className="w-14 text-[11.5px] font-semibold shrink-0" style={{ color: isPeak ? C.pri : C.g500 }}>{h.t}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.g100 }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(h.pct, 4)}%`, background: phBarColor(h.pct) }} />
                </div>
                <span className="w-9 text-right text-[12px] font-bold shrink-0" style={{ color: isPeak ? C.pri : C.g400 }}>{h.pct}%</span>
                {isPeak && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ color: C.pri, backgroundColor: `rgba(26,95,213,.1)` }}>PEAK</span>}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-3.5 px-3.5 py-3 rounded-xl text-[12.5px] font-semibold leading-snug" style={{ backgroundColor: C.priBg, color: C.pri }}>
          <Clock className="w-4 h-4 shrink-0 opacity-70" />
          <span>Peak: <strong>{d.peakHour}</strong> ({d.peakShare}) · Arrive by {d.arriveBy}</span>
        </div>
      </Card>

      {/* ── Tip card ── */}
      <div className="mx-5 mb-4">
        <div className="rounded-[20px] p-5 flex gap-3.5 items-start" style={{ background: d.tip.bg, border: `1px solid ${d.tip.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0" style={{ backgroundColor: d.tip.color }}>
            {d.tip.icon}
          </div>
          <div>
            <p className="text-[12px] font-bold mb-0.5" style={{ color: d.tip.color }}>{d.tip.title}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: C.g600 }} dangerouslySetInnerHTML={{ __html: d.tip.body }} />
          </div>
        </div>
      </div>

      {/* ── Monthly projection ring ── */}
      {d.monthEarned && d.monthPace && (
        <Card>
          <div className="flex items-center gap-4">
            <SvgRing pct={d.monthPct} size={68} strokeW={7} color={C.pri} />
            <div>
              <p className="text-[22px] font-extrabold tracking-tight" style={{ color: C.g900 }}>{d.monthEarned}</p>
              <p className="text-[13px] mt-0.5 leading-snug" style={{ color: C.g500 }}>{d.monthLabel}</p>
              <p className="text-[13px] mt-1">
                <span style={{ color: C.g500 }}>On pace for </span>
                <span className="font-bold" style={{ color: C.pri }}>{d.monthPace}</span>
                <span style={{ color: C.g500 }}> by month end</span>
              </p>
            </div>
          </div>
        </Card>
      )}
      {d.monthEarned && !d.monthPace && (
        <Card>
          <div className="flex items-center gap-4">
            <SvgRing pct={100} size={68} strokeW={7} color={C.pri} />
            <div>
              <p className="text-[22px] font-extrabold tracking-tight" style={{ color: C.g900 }}>{d.monthEarned}</p>
              <p className="text-[13px] mt-0.5" style={{ color: C.g500 }}>{d.monthLabel}</p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Weekly trend ── */}
      {weeks.length > 0 && (
        <>
          <SectionLabel>{d.weekTrendLabel}</SectionLabel>
          <Card>
            {weeks.map((wk, i) => {
              const pct = (wk.v / maxWeek) * 100
              const isLast = i === weeks.length - 1
              const delta = i > 0 ? Math.round(((wk.v - weeks[i - 1].v) / weeks[i - 1].v) * 100) : null
              return (
                <div key={i} className={`${i < weeks.length - 1 ? "mb-3.5" : ""}`}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12.5px] font-medium" style={{ color: C.g500 }}>{wk.w}</span>
                    <span className="text-[13px] font-bold" style={{ color: isLast ? C.pri : C.g700 }}>
                      RM {wk.v.toLocaleString()}
                      {delta !== null && (
                        <span className="ml-1.5 text-[10px] font-semibold" style={{ color: delta >= 0 ? C.grn : C.red }}>
                          {delta >= 0 ? "+" : ""}{delta}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.g100 }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{
                      width: `${pct}%`,
                      background: isLast ? `linear-gradient(90deg,${C.pri},${C.priLight})` : C.g200,
                    }} />
                  </div>
                </div>
              )
            })}
          </Card>
        </>
      )}

      {/* ── Health card ── */}
      <div className="mx-5 mb-4">
        <div className="rounded-[20px] p-5 flex gap-3.5 items-start" style={{ background: d.health.bg, border: `1px solid ${d.health.border}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0" style={{ backgroundColor: d.health.color }}>
            {d.health.icon}
          </div>
          <div>
            <p className="text-[12px] font-bold mb-0.5" style={{ color: d.health.color }}>{d.health.title}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: C.g600 }} dangerouslySetInnerHTML={{ __html: d.health.body }} />
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] font-medium pb-4" style={{ color: C.g400 }}>iGrow · Powered by TNG</p>

      {/* Report sheet */}
      <ReportSheet open={sheetOpen} onClose={() => setSheetOpen(false)} activeData={d} />
    </div>
  )
}
