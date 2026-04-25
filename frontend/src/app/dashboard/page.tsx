"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, FileText, ChevronRight, Clock, Calendar,
  TrendingUp, TrendingDown, CheckCircle,
  Banknote, Sparkles, ExternalLink, Loader2, X,
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

// ─── Simulation data ──────────────────────────────────────────────────
type SimDay = { d: string; v: number; txn: number; hours: { t: string; pct: number }[]; peakHour: string; peakShare: string; arriveBy: string }

const DASH_SIM_DATA: SimDay[] = [
  { d: "Mon", v: 112, txn: 17, peakHour: "8–9 PM", peakShare: "54%", arriveBy: "7:00 PM",
    hours: [{ t: "4–5 PM", pct: 4 }, { t: "5–6 PM", pct: 8 }, { t: "6–7 PM", pct: 42 }, { t: "7–8 PM", pct: 68 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 55 }, { t: "10–11 PM", pct: 18 }, { t: "11–12 AM", pct: 6 }] },
  { d: "Tue", v: 158, txn: 24, peakHour: "7–9 PM", peakShare: "61%", arriveBy: "6:30 PM",
    hours: [{ t: "4–5 PM", pct: 6 }, { t: "5–6 PM", pct: 14 }, { t: "6–7 PM", pct: 58 }, { t: "7–8 PM", pct: 88 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 72 }, { t: "10–11 PM", pct: 30 }, { t: "11–12 AM", pct: 9 }] },
  { d: "Wed", v: 91, txn: 14, peakHour: "8–9 PM", peakShare: "56%", arriveBy: "7:00 PM",
    hours: [{ t: "4–5 PM", pct: 3 }, { t: "5–6 PM", pct: 9 }, { t: "6–7 PM", pct: 38 }, { t: "7–8 PM", pct: 70 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 58 }, { t: "10–11 PM", pct: 22 }, { t: "11–12 AM", pct: 6 }] },
  { d: "Thu", v: 189, txn: 28, peakHour: "7–9 PM", peakShare: "63%", arriveBy: "6:30 PM",
    hours: [{ t: "4–5 PM", pct: 7 }, { t: "5–6 PM", pct: 16 }, { t: "6–7 PM", pct: 52 }, { t: "7–8 PM", pct: 91 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 74 }, { t: "10–11 PM", pct: 38 }, { t: "11–12 AM", pct: 12 }] },
  { d: "Fri", v: 245, txn: 36, peakHour: "7–9 PM", peakShare: "65%", arriveBy: "6:00 PM",
    hours: [{ t: "4–5 PM", pct: 10 }, { t: "5–6 PM", pct: 20 }, { t: "6–7 PM", pct: 62 }, { t: "7–8 PM", pct: 95 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 80 }, { t: "10–11 PM", pct: 42 }, { t: "11–12 AM", pct: 14 }] },
  { d: "Sat", v: 278, txn: 41, peakHour: "8–10 PM", peakShare: "67%", arriveBy: "6:00 PM",
    hours: [{ t: "4–5 PM", pct: 12 }, { t: "5–6 PM", pct: 24 }, { t: "6–7 PM", pct: 68 }, { t: "7–8 PM", pct: 92 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 88 }, { t: "10–11 PM", pct: 52 }, { t: "11–12 AM", pct: 18 }] },
  { d: "Sun", v: 54, txn: 8, peakHour: "8–9 PM", peakShare: "52%", arriveBy: "7:30 PM",
    hours: [{ t: "4–5 PM", pct: 3 }, { t: "5–6 PM", pct: 7 }, { t: "6–7 PM", pct: 28 }, { t: "7–8 PM", pct: 60 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 45 }, { t: "10–11 PM", pct: 15 }, { t: "11–12 AM", pct: 5 }] },
  { d: "Mon", v: 78, txn: 12, peakHour: "8–9 PM", peakShare: "55%", arriveBy: "7:00 PM",
    hours: [{ t: "4–5 PM", pct: 4 }, { t: "5–6 PM", pct: 9 }, { t: "6–7 PM", pct: 36 }, { t: "7–8 PM", pct: 72 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 50 }, { t: "10–11 PM", pct: 20 }, { t: "11–12 AM", pct: 5 }] },
  { d: "Tue", v: 172, txn: 26, peakHour: "7–9 PM", peakShare: "62%", arriveBy: "6:30 PM",
    hours: [{ t: "4–5 PM", pct: 8 }, { t: "5–6 PM", pct: 16 }, { t: "6–7 PM", pct: 55 }, { t: "7–8 PM", pct: 90 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 68 }, { t: "10–11 PM", pct: 32 }, { t: "11–12 AM", pct: 10 }] },
  { d: "Wed", v: 134, txn: 20, peakHour: "7–9 PM", peakShare: "59%", arriveBy: "6:30 PM",
    hours: [{ t: "4–5 PM", pct: 5 }, { t: "5–6 PM", pct: 12 }, { t: "6–7 PM", pct: 48 }, { t: "7–8 PM", pct: 86 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 62 }, { t: "10–11 PM", pct: 30 }, { t: "11–12 AM", pct: 8 }] },
  { d: "Thu", v: 218, txn: 32, peakHour: "7–9 PM", peakShare: "64%", arriveBy: "6:30 PM",
    hours: [{ t: "4–5 PM", pct: 8 }, { t: "5–6 PM", pct: 17 }, { t: "6–7 PM", pct: 54 }, { t: "7–8 PM", pct: 88 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 76 }, { t: "10–11 PM", pct: 40 }, { t: "11–12 AM", pct: 13 }] },
  { d: "Fri", v: 302, txn: 45, peakHour: "7–9 PM", peakShare: "66%", arriveBy: "6:00 PM",
    hours: [{ t: "4–5 PM", pct: 11 }, { t: "5–6 PM", pct: 22 }, { t: "6–7 PM", pct: 65 }, { t: "7–8 PM", pct: 96 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 82 }, { t: "10–11 PM", pct: 45 }, { t: "11–12 AM", pct: 15 }] },
  { d: "Sat", v: 356, txn: 52, peakHour: "8–10 PM", peakShare: "70%", arriveBy: "5:30 PM",
    hours: [{ t: "4–5 PM", pct: 14 }, { t: "5–6 PM", pct: 28 }, { t: "6–7 PM", pct: 72 }, { t: "7–8 PM", pct: 94 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 92 }, { t: "10–11 PM", pct: 58 }, { t: "11–12 AM", pct: 20 }] },
  { d: "Sun", v: 62, txn: 9, peakHour: "8–9 PM", peakShare: "51%", arriveBy: "7:30 PM",
    hours: [{ t: "4–5 PM", pct: 2 }, { t: "5–6 PM", pct: 6 }, { t: "6–7 PM", pct: 24 }, { t: "7–8 PM", pct: 56 }, { t: "8–9 PM", pct: 100 }, { t: "9–10 PM", pct: 42 }, { t: "10–11 PM", pct: 12 }, { t: "11–12 AM", pct: 4 }] },
]
const DASH_SIM_THRESHOLD = 14
const DASH_SIM_INTERVAL_MS = 1200

// ─── Partner data ─────────────────────────────────────────────────────
const TRACK1_PARTNERS = [
  { abbr: "MD", name: "MDEC", offer: "Digital grants up to RM 5,000" },
  { abbr: "TK", name: "TEKUN Nasional", offer: "RM 1,000 – RM 50,000 micro-financing" },
  { abbr: "SD", name: "SIDEC", offer: "Selangor digital economy grants" },
  { abbr: "CF", name: "Cradle Fund", offer: "Pre-seed investment for innovators" },
]

const TRACK2_PARTNERS = [
  { abbr: "SC", name: "SME Corp Malaysia", offer: "Advisory services + business grants" },
  { abbr: "iT", name: "Bank Negara iTEKAD", offer: "B40 matched savings programme" },
  { abbr: "13", name: "1337 Ventures", offer: "VC funding for early-stage startups" },
  { abbr: "PN", name: "PERNAS", offer: "Procurement for Bumiputera enterprises" },
]

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-[12px] font-medium text-[#0D2B6E] text-right">{value}</span>
    </div>
  )
}

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

// ─── SSM Nudge Sheet ──────────────────────────────────────────────────

function SsmNudgeSheet({ onDismiss, onChat }: { onDismiss: () => void; onChat: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}>
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-[#0D2B6E] text-[18px] font-bold leading-snug mb-1">One step to unlock more</h2>
        <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
          Your revenue pattern looks great. To qualify for financing and incubator programs, you&apos;ll need an SSM registration first.
        </p>
        <div className="bg-[#EEF2FB] rounded-2xl p-4 mb-4">
          <p className="text-[#0D2B6E] text-[12px] font-bold mb-3">With SSM, you can access:</p>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: Banknote, label: "Starter Track Package B", sub: "RM 10,000 – RM 50,000 revenue-based financing" },
              { icon: Sparkles, label: "Growth Track programs", sub: "MDEC grants, TEKUN financing, incubator matching" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0D2B6E]">{label}</p>
                  <p className="text-[11px] text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-5" style={{ backgroundColor: "#FFFBEB", borderLeft: "3px solid #F59E0B" }}>
          <span className="text-[12px] text-amber-700 leading-relaxed">
            <span className="font-bold">SSM registration</span> costs from RM 30 for sole proprietors and can be done online at <span className="font-semibold">ssm.com.my</span>.
          </span>
        </div>
        <button onClick={onChat}
          className="w-full rounded-full py-4 font-bold text-[15px] text-white mb-3 active:scale-95 transition-transform duration-200 shadow-md flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}>
          <ExternalLink className="w-4 h-4" /> Ask iGrow how to register SSM
        </button>
        <button onClick={onDismiss}
          className="w-full rounded-full py-3.5 font-semibold text-[14px] border-2 border-[#E5EBF8] text-[#6B7280] hover:bg-[#F5F8FF] transition-colors">
          I&apos;ll do it later
        </button>
      </div>
    </div>
  )
}

// ─── Launchpad Nudge Sheet ────────────────────────────────────────────

function LaunchpadNudgeSheet({
  tier, pkg, onAccept, onDismiss,
}: {
  tier: "1" | "2"
  pkg: "A" | "B" | "track1" | "track2"
  onAccept: () => void
  onDismiss: () => void
}) {
  const isTrack1 = pkg === "track1"
  const partners = isTrack1 ? TRACK1_PARTNERS : TRACK2_PARTNERS

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onDismiss}>
      <div className="w-full max-w-lg bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}>
          {tier === "1" ? <Banknote className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
        </div>
        <h2 className="text-[#0D2B6E] text-[18px] font-bold leading-snug mb-1">You&apos;re ready for Launchpad</h2>
        <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
          Based on your revenue pattern and business profile, you may be eligible for:
        </p>
        <div className="bg-[#EEF2FB] rounded-2xl p-4 mb-5">
          {tier === "1" ? (
            <>
              <p className="text-[#1A5FD5] text-[11px] font-bold uppercase tracking-wide mb-0.5">Starter Track</p>
              <p className="text-[#0D2B6E] text-[15px] font-bold mb-1">
                {pkg === "A" ? "Package A — Solo Operator" : "Package B — Growing SME"}
              </p>
              <p className="text-gray-500 text-[12px] mb-3">
                {pkg === "A" ? "For solo hustlers. Start small, grow steady." : "For businesses ready for their next chapter."}
              </p>
              <div className="flex flex-col gap-2">
                <DetailRow label="Loan range" value={pkg === "A" ? "RM 1,000 – RM 5,000" : "RM 10,000 – RM 50,000"} />
                <DetailRow label="Revenue deduction" value="6.02% of monthly TNG revenue" />
                <DetailRow label="Repayment" value="No fixed monthly instalments" />
              </div>
            </>
          ) : (
            <>
              <p className="text-[#1A5FD5] text-[11px] font-bold uppercase tracking-wide mb-0.5">Growth Track</p>
              <p className="text-[#0D2B6E] text-[15px] font-bold mb-1">
                {isTrack1 ? "Digital Commerce" : "Public & Institutional Funding"}
              </p>
              <p className="text-gray-500 text-[12px] mb-3">Get matched with grants, programs, and investors.</p>
              <div className="flex flex-wrap gap-1.5">
                {partners.slice(0, 3).map(p => (
                  <span key={p.abbr} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white text-[#0D2B6E]">{p.name}</span>
                ))}
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white text-[#6B7280]">+{partners.length - 3} more</span>
              </div>
              <p className="text-[11px] text-[#1A5FD5] font-medium mt-3">TNG pre-fills your application using your merchant data.</p>
            </>
          )}
        </div>
        <button onClick={onAccept}
          className="w-full rounded-full py-4 font-bold text-[15px] text-white mb-3 active:scale-95 transition-transform duration-200 shadow-md"
          style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}>
          Explore this for me →
        </button>
        <button onClick={onDismiss}
          className="w-full rounded-full py-3.5 font-semibold text-[14px] border-2 border-[#E5EBF8] text-[#6B7280] hover:bg-[#F5F8FF] transition-colors">
          Maybe later
        </button>
        <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
          This is not a loan approval. TNG Launchpad products are subject to eligibility review.
        </p>
      </div>
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
    rows.forEach(([l, v], i) => {
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139)
      doc.text(l, M, y)
      doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42)
      doc.text(v, W - M, y, { align: "right" })
      // Draw separator line well below the text baseline
      if (i < rows.length - 1) {
        doc.line(M, y + 3, W - M, y + 3)
      }
      y += 9
    })
    y += 4

    doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.setFont("helvetica", "bold")
    doc.text("Sales By Day", M, y); y += 10
    const maxD = Math.max(...d.days.map(x => x.v))
    const barChartH = 30, barGap = 2
    const bw = (CW - barGap * 6) / 7
    const barBaseY = y + barChartH  // bottom of all bars aligned here
    d.days.forEach((day, i) => {
      const x = M + i * (bw + barGap)
      const bH = Math.max((day.v / maxD) * barChartH, 2)
      const best = day.v === maxD
      doc.setFillColor(best ? 26 : 226, best ? 95 : 232, best ? 213 : 240)
      doc.roundedRect(x, barBaseY - bH, bw, bH, 1.5, 1.5, "F")
      // Value label — always 2mm above the bar top
      doc.setFontSize(7); doc.setFont("helvetica", "bold")
      doc.setTextColor(best ? 26 : 100, best ? 95 : 116, best ? 213 : 139)
      doc.text(`RM ${day.v}`, x + bw / 2, barBaseY - bH - 2, { align: "center" })
      // Day label — always 5mm below bar baseline
      doc.setTextColor(100, 116, 139); doc.setFontSize(8); doc.setFont("helvetica", "normal")
      doc.text(day.d, x + bw / 2, barBaseY + 5, { align: "center" })
    })
    y = barBaseY + 14

    doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.setFont("helvetica", "bold")
    doc.text("Peak Hours", M, y); y += 8
    const timeColW = 22  // fixed width for time labels
    const barStartX = M + timeColW + 4  // consistent bar start
    const barMaxW = CW - timeColW - 20  // leave room for % label
    d.hours.forEach(hr => {
      const bW = (hr.pct / 100) * barMaxW, pk = hr.pct >= 85
      // Time label — right-aligned in fixed column
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139)
      doc.text(hr.t, M + timeColW, y + 3, { align: "right" })
      // Bar
      doc.setFillColor(pk ? 26 : 226, pk ? 95 : 232, pk ? 213 : 240)
      doc.roundedRect(barStartX, y - 1, Math.max(bW, 3), 5, 1.5, 1.5, "F")
      // Percentage label
      doc.setFontSize(7); doc.setFont("helvetica", "bold")
      doc.setTextColor(pk ? 26 : 100, pk ? 95 : 116, pk ? 213 : 139)
      doc.text(`${hr.pct}%`, barStartX + Math.max(bW, 3) + 3, y + 3)
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
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.4)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />
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
              style={{ borderColor: busy ? C.pri : C.g200, backgroundColor: busy ? C.priBg : "white" }}
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

        <button onClick={onClose}
          className="w-full mt-2 py-3.5 rounded-2xl text-[14px] font-bold transition-colors"
          style={{ backgroundColor: C.g100, color: C.g600 }}>
          Cancel
        </button>
      </div>

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

  // Simulation state
  const [dashSimCount, setDashSimCount] = useState(0)
  const [activeSimBarIdx, setActiveSimBarIdx] = useState<number | null>(null)
  const [simRunning, setSimRunning] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showLaunchpadNudge, setShowLaunchpadNudge] = useState(false)
  const [showSsmNudge, setShowSsmNudge] = useState(false)
  const [launchpadAccepted, setLaunchpadAccepted] = useState(false)
  const [recommendedTier, setRecommendedTier] = useState<"1" | "2" | "">("")
  const [recommendedPackage, setRecommendedPackage] = useState<"A" | "B" | "track1" | "track2" | "">("")

  const dashSimCountRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

   useEffect(() => {
     const loadState = () => {
       const savedCount = parseInt(localStorage.getItem("igrow_dash_sim_count") ?? "0")
       console.log("[Dashboard] Loaded dashSimCount from localStorage:", savedCount)
       setDashSimCount(savedCount)
       dashSimCountRef.current = savedCount

       const accepted = localStorage.getItem("igrow_launchpad_accepted") === "true"
       setLaunchpadAccepted(accepted)

       const savedTier = localStorage.getItem("igrow_tier") as "1" | "2" | null
       const savedPkg = localStorage.getItem("igrow_package") as "A" | "B" | "track1" | "track2" | null
       if (savedTier) {
         setRecommendedTier(savedTier)
         setRecommendedPackage(savedPkg ?? "")
       }

       // If simulation was completed but nudges weren't shown/closed, show them now
       const simCompleted = localStorage.getItem("igrow_sim_completed") === "true"
       if (simCompleted && savedCount >= DASH_SIM_THRESHOLD && !accepted) {
         const userHasSSM = localStorage.getItem("igrow_ssm") === "Yes, I have SSM"
         if (!userHasSSM) {
           setShowSsmNudge(true)
         } else if (savedTier) {
           setShowLaunchpadNudge(true)
         }
       }
     }

     setMounted(true)
     const now = new Date().toISOString().slice(0, 10)
     setDateFrom(now); setDateTo(now)
     
     loadState()
   }, [])

   useEffect(() => {
     return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
   }, [])

    // Listen for visibility/focus changes and storage events to sync state
    useEffect(() => {
      const syncStateFromStorage = () => {
        const savedCount = parseInt(localStorage.getItem("igrow_dash_sim_count") ?? "0")
        console.log("[Dashboard] Current state dashSimCount:", dashSimCount, "Saved in localStorage:", savedCount)
        if (savedCount !== dashSimCount) {
          console.log("[Dashboard] Syncing dashSimCount from localStorage to:", savedCount)
          setDashSimCount(savedCount)
          dashSimCountRef.current = savedCount
        }
      }

      const handleFocus = () => {
        console.log("[Dashboard] Window focused, syncing state")
        syncStateFromStorage()
      }

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log("[Dashboard] Page became visible, syncing state")
          syncStateFromStorage()
        }
      }

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "igrow_dash_sim_count") {
          const newCount = parseInt(e.newValue ?? "0")
          console.log("[Dashboard] Storage event - dashSimCount changed to:", newCount)
          setDashSimCount(newCount)
          dashSimCountRef.current = newCount
        }
      }

      window.addEventListener('focus', handleFocus)
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('storage', handleStorageChange)

      return () => {
        window.removeEventListener('focus', handleFocus)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('storage', handleStorageChange)
      }
    }, [])

    function runOneDashSimTick() {
      const next = dashSimCountRef.current + 1
      dashSimCountRef.current = next
      setDashSimCount(next)
      setActiveSimBarIdx(6)  // newest day is always rightmost bar
      localStorage.setItem("igrow_dash_sim_count", String(next))
      console.log("[Dashboard] Simulation tick:", next, "- saved to localStorage")

     if (next >= DASH_SIM_THRESHOLD) {
       if (intervalRef.current) clearInterval(intervalRef.current)
       intervalRef.current = null
       setSimRunning(false)
       setIsAnalyzing(true)
       localStorage.setItem("igrow_sim_completed", "true")
       setTimeout(() => {
         setIsAnalyzing(false)
         const userHasSSM = localStorage.getItem("igrow_ssm") === "Yes, I have SSM"
         if (!userHasSSM) {
           setShowSsmNudge(true)
           localStorage.setItem("igrow_ssm_nudge_shown", "true")
           return
         }
         const cat = localStorage.getItem("igrow_category") ?? ""
         const isFood = cat === "Food & Drinks" || cat === "Products & Goods"
         const tier: "1" | "2" = "2"
         const pkg: "track1" | "track2" = isFood ? "track1" : "track2"
         setRecommendedTier(tier)
         setRecommendedPackage(pkg)
         localStorage.setItem("igrow_tier", tier)
         localStorage.setItem("igrow_package", pkg)
         setShowLaunchpadNudge(true)
         localStorage.setItem("igrow_launchpad_nudge_shown", "true")
       }, 2500)
     }
   }

  function handleStartDashSimulate() {
    if (simRunning || launchpadAccepted || dashSimCount >= DASH_SIM_THRESHOLD) return
    setSimRunning(true)
    intervalRef.current = setInterval(runOneDashSimTick, DASH_SIM_INTERVAL_MS)
  }

  function handleLaunchpadAccept() {
    localStorage.setItem("igrow_tier", recommendedTier)
    localStorage.setItem("igrow_package", recommendedPackage)
    localStorage.setItem("igrow_launchpad_accepted", "true")
    setLaunchpadAccepted(true)
    setShowLaunchpadNudge(false)
  }

   const activeKey = activeTab === "week" ? weekFilter : monthFilter
   const d = DATA[activeKey]

   // Always read fresh count from localStorage to ensure we have latest value
   const currentDashSimCount = typeof window !== 'undefined' ? parseInt(localStorage.getItem("igrow_dash_sim_count") ?? "0") : dashSimCount

   // Simulation continues from existing demo data — append new days and show last 7
   const simRevealedDays = DASH_SIM_DATA.slice(0, currentDashSimCount)
   const allChartDays = [...d.days, ...simRevealedDays]
   const simTotalSales = simRevealedDays.reduce((acc, day) => acc + day.v, 0)
   const simTotalTxn = simRevealedDays.reduce((acc, day) => acc + day.txn, 0)
   const displaySales = d.heroSales + simTotalSales
   const displayTxn = d.heroTxn + simTotalTxn
   const displayAvg = displayTxn > 0 ? displaySales / displayTxn : d.heroAvg

   // Derive which sim day the active bar corresponds to
   const activeSimDayData: SimDay | null = (() => {
     if (activeSimBarIdx === null || currentDashSimCount === 0) return null
     const allIdx = currentDashSimCount + activeSimBarIdx  // position in allChartDays
     const simIdx = allIdx - 7  // subtract the 7 base days
     return simIdx >= 0 && simIdx < simRevealedDays.length ? DASH_SIM_DATA[simIdx] : null
   })()
  const activeHours = activeSimDayData ? activeSimDayData.hours : d.hours
  const activePeakHour = activeSimDayData ? activeSimDayData.peakHour : d.peakHour
  const activePeakShare = activeSimDayData ? activeSimDayData.peakShare : d.peakShare
  const activeArriveBy = activeSimDayData ? activeSimDayData.arriveBy : d.arriveBy

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

  const hasSSM = localStorage.getItem("igrow_ssm") === "Yes, I have SSM"
  const chartDays = allChartDays.slice(-7)
  const maxDay = Math.max(...chartDays.map(x => x.v), 1)
  const weeks = d.weeks.filter(w => w.v !== null)
  const maxWeek = weeks.length ? Math.max(...weeks.map(x => x.v)) : 1
  const dateStr = new Date().toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  const weekFilters = [{ key: "thisWeek", label: "This Week" }, { key: "lastWeek", label: "Last Week" }]
  const monthFilters = [{ key: "thisMonth", label: "This Month" }, { key: "lastMonth", label: "Last Month" }]
  const subFilters = activeTab === "week" ? weekFilters : monthFilters
  const activeFilter = activeTab === "week" ? weekFilter : monthFilter
  const setFilter = activeTab === "week" ? setWeekFilter : setMonthFilter
  const customKey = activeTab === "week" ? "customWeek" : "customMonth"
  const isTrack1 = recommendedPackage === "track1"
  const partners = isTrack1 ? TRACK1_PARTNERS : TRACK2_PARTNERS

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
          <button onClick={applyCustom}
            className="w-full py-3 rounded-xl text-[13px] font-bold text-white transition-colors"
            style={{ background: `linear-gradient(135deg,${C.pri},${C.priDark})` }}>
            Apply Range
          </button>
        </div>
      )}

      <div className="h-4" />

      {/* ── Launchpad Package card (post-acceptance) ── */}
      {launchpadAccepted && recommendedTier !== "" && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}>
                {recommendedTier === "1" ? <Banknote className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
              </div>
              <div>
                <p className="text-[#0D2B6E] text-[14px] font-bold">
                  {recommendedTier === "1" ? "Starter Track" : "Growth Track"}
                </p>
                <p className="text-[#1A5FD5] text-[12px] font-semibold">
                  {recommendedPackage === "A" && "Package A — Solo Operator"}
                  {recommendedPackage === "B" && "Package B — Growing SME"}
                  {recommendedPackage === "track1" && "Digital Commerce"}
                  {recommendedPackage === "track2" && "Public & Institutional Funding"}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>
              Active
            </span>
          </div>

          {recommendedTier === "1" ? (
            <>
              <p className="text-[13px] text-gray-500 mb-3 leading-relaxed">
                {recommendedPackage === "A" ? "For solo hustlers. Start small, grow steady." : "For businesses ready for their next chapter."}
              </p>
              <div className="bg-[#EEF2FB] rounded-2xl p-3 flex flex-col gap-2 mb-3">
                <DetailRow label="Loan range" value={recommendedPackage === "A" ? "RM 1,000 – RM 5,000" : "RM 10,000 – RM 50,000"} />
                <DetailRow label="Revenue deduction" value="6.02% of monthly TNG revenue" />
                <DetailRow label="Repayment" value="No fixed monthly instalments" />
                <DetailRow label="Review trigger" value="3+ months below floor — we'll help you restructure" />
              </div>
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-[#E5EBF8] hover:border-[#1A5FD5] transition-colors">
                <span className="text-[#0D2B6E] text-[13px] font-semibold">Learn about BizCash Readiness</span>
                <ChevronRight className="w-4 h-4 text-[#1A5FD5]" />
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2.5 mb-3">
                {partners.map(p => (
                  <div key={p.abbr} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EEF2FB] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#1A5FD5]">{p.abbr}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#0D2B6E] truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{p.offer}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ backgroundColor: "#F0F5FF" }}>
                <span className="text-[11px] text-[#1A5FD5] font-medium leading-snug">
                  TNG pre-fills your application form using your merchant data.
                </span>
              </div>
              <button
                onClick={() => router.push('/chat?prompt=' + encodeURIComponent(
                  isTrack1
                    ? "What incubator and grant programs are available for digital commerce food businesses in Malaysia? I'm a TNG merchant looking to grow."
                    : "What public funding and institutional programs are available for service-based micro businesses in Malaysia? I'm a TNG merchant."
                ))}
                className="w-full rounded-full py-3.5 font-bold text-[14px] text-white flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
                style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}
              >
                View Matched Programs →
              </button>
            </>
          )}
        </Card>
      )}

      {/* ── Hero metrics ── */}
      <div className="grid grid-cols-2 gap-3 px-5 mb-4">
        <div className="bg-white rounded-[20px] p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-14 h-14 rounded-bl-[60px]" style={{ background: `linear-gradient(135deg,rgba(26,95,213,.08),transparent)` }} />
          <p className="text-[11px] font-semibold uppercase tracking-[.5px]" style={{ color: C.g400 }}>
            {currentDashSimCount > 0 ? `${currentDashSimCount}-Day Revenue` : d.heroLabel}
          </p>
          <p className="text-[26px] font-extrabold my-1.5 tracking-tight" style={{ color: C.g900 }}>
            RM {displaySales.toLocaleString()}
          </p>
          {currentDashSimCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-lg" style={{ color: C.grn, backgroundColor: C.grnBg }}>
              <TrendingUp className="w-3 h-3" /> Growing
            </span>
          ) : d.vsPrevLabel ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-lg"
              style={{ color: d.vsPrev >= 0 ? C.grn : C.red, backgroundColor: d.vsPrev >= 0 ? C.grnBg : C.redBg }}>
              {d.vsPrev >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(d.vsPrev)}% {d.vsPrevLabel}
            </span>
          ) : null}
        </div>
        <div className="bg-white rounded-[20px] p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-14 h-14 rounded-bl-[60px]" style={{ background: `linear-gradient(135deg,rgba(16,185,129,.08),transparent)` }} />
          <p className="text-[11px] font-semibold uppercase tracking-[.5px]" style={{ color: C.g400 }}>Transactions</p>
          <p className="text-[26px] font-extrabold my-1.5 tracking-tight" style={{ color: C.g900 }}>{displayTxn}</p>
          <span className="inline-flex items-center text-[12px] font-semibold px-2 py-0.5 rounded-lg" style={{ color: C.g500, backgroundColor: C.g100 }}>
            avg RM {displayAvg.toFixed(2)}
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
      <div className="px-6 pb-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[.7px]" style={{ color: C.g400 }}>Sales By Day</p>
            {!launchpadAccepted && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: hasSSM ? "#DCFCE7" : "#FEF3C7",
                  color: hasSSM ? "#166534" : "#92400E",
                }}
              >
                {hasSSM ? "SSM ✓" : "No SSM"}
              </span>
            )}
          </div>
          {!launchpadAccepted && (
             <button
               onClick={handleStartDashSimulate}
               disabled={simRunning || isAnalyzing || currentDashSimCount >= DASH_SIM_THRESHOLD}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border-2 transition-all active:scale-95 disabled:opacity-60"
               style={{ borderColor: "#10B981", color: simRunning || isAnalyzing ? "#10B981" : (currentDashSimCount >= DASH_SIM_THRESHOLD ? C.g400 : "#10B981"), backgroundColor: simRunning ? "rgba(16,185,129,0.08)" : "transparent" }}
             >
               {isAnalyzing ? (
                 <><Loader2 className="w-3 h-3 animate-spin" /> Analyzing…</>
               ) : simRunning ? (
                 <><span className="animate-pulse">●</span> Simulating…</>
               ) : currentDashSimCount >= DASH_SIM_THRESHOLD ? (
                 "Done ✓"
               ) : (
                 `▶ Simulate`
               )}
             </button>
          )}
        </div>
      </div>
      <Card>
        <div className="flex items-end gap-1.5 h-28 pt-3">
          {chartDays.map((x, i) => {
             const ht = Math.max((x.v / maxDay) * 90, x.v > 0 ? 4 : 2)
             const isEmpty = x.v === 0
             const isActiveBar = activeSimBarIdx === i && currentDashSimCount > 0 && !isEmpty
             const isSimDay = currentDashSimCount > 0 && (currentDashSimCount + i) >= 7
            return (
              <div
                key={i}
                className={`flex-1 flex flex-col items-center gap-1.5 group ${isSimDay && !isEmpty ? "cursor-pointer" : ""}`}
                onClick={() => { if (isSimDay && !isEmpty) setActiveSimBarIdx(i) }}
              >
                <div className="relative w-full rounded-lg transition-all duration-500" style={{
                  height: ht,
                  background: isEmpty ? C.g100
                    : isActiveBar ? `linear-gradient(180deg,${C.pri},${C.priDark})`
                    : C.g200,
                  boxShadow: isActiveBar ? `0 0 0 2px ${C.pri}` : "none",
                }}>
                  {!isEmpty && (
                    <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap transition-opacity ${isActiveBar ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                      style={{ color: isActiveBar ? C.pri : C.g700 }}>
                      RM {x.v}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold" style={{ color: isActiveBar ? C.pri : C.g400 }}>{x.d}</span>
              </div>
            )
          })}
        </div>
        {activeSimDayData && (
          <p className="text-[11px] font-medium mt-3 text-center" style={{ color: C.g400 }}>
            Tap a bar to see that day&apos;s timeline
          </p>
        )}
      </Card>

      {/* ── Peak hours ── */}
      <div className="flex items-center justify-between px-6 pb-2.5 pt-1">
        <p className="text-[11px] font-bold uppercase tracking-[.7px]" style={{ color: C.g400 }}>Evening Timeline</p>
        {activeSimDayData && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: C.priBg, color: C.pri }}>
            {activeSimDayData.d}
          </span>
        )}
      </div>
      <Card>
        <div className="flex flex-col gap-0.5">
          {activeHours.map((h, i) => {
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
          <span>Peak: <strong>{activePeakHour}</strong> ({activePeakShare}) · Arrive by {activeArriveBy}</span>
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

      {/* Launchpad Nudge */}
      {showLaunchpadNudge && recommendedTier !== "" && recommendedPackage !== "" && (
        <LaunchpadNudgeSheet
          tier={recommendedTier as "1" | "2"}
          pkg={recommendedPackage as "A" | "B" | "track1" | "track2"}
          onAccept={handleLaunchpadAccept}
          onDismiss={() => setShowLaunchpadNudge(false)}
        />
      )}

      {/* SSM Nudge */}
      {showSsmNudge && (
        <SsmNudgeSheet
          onDismiss={() => setShowSsmNudge(false)}
          onChat={() => {
            setShowSsmNudge(false)
            router.push('/chat?prompt=' + encodeURIComponent("How do I register my business with SSM in Malaysia? I'm a small business owner using TNG and want to access financing packages."))
          }}
        />
      )}
    </div>
  )
}
