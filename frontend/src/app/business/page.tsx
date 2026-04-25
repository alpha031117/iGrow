"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, CheckCircle2, Circle, ChevronRight,
  QrCode, BarChart3, Megaphone, Banknote, X, Download, Share2, Loader2,
  FileText,
} from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  "Food & Drinks": "Home-Based Food Seller",
  "Products & Goods": "Informal Trader",
  "Services & Skills": "Freelancer / Service Provider",
}

function mockQrPayload(businessName: string) {
  return `tngd://pay?merchant=BRISVAL&name=${encodeURIComponent(businessName)}&mid=TNG-BIZ-20260425&type=MERCHANT_QR&v=1`
}

function MockQrSvg({ size = 200 }: { size?: number }) {
  const cells = [
    "111111101001011111111",
    "100000101100010000001",
    "101110100010010111101",
    "101110101011010111101",
    "101110101100010111101",
    "100000100110010000001",
    "111111101010111111111",
    "000000001101100000000",
    "101011110011011010110",
    "010100001101001010001",
    "110011110110110011110",
    "001010001001000100010",
    "110110100110110101100",
    "000000001011001000100",
    "111111101100111011010",
    "100000101001100010001",
    "101110100110010110110",
    "101110101001101001001",
    "101110101010010100110",
    "100000100110001000011",
    "111111101011111111101",
  ]
  const cell = size / 21
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill="white" />
      {cells.map((row, r) =>
        row.split("").map((bit, c) =>
          bit === "1" ? (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#0D2B6E" />
          ) : null
        )
      )}
      <rect x={size / 2 - 14} y={size / 2 - 14} width={28} height={28} rx={6} fill="white" />
      <rect x={size / 2 - 10} y={size / 2 - 10} width={20} height={20} rx={4} fill="#1A5FD5" />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fill="white" fontSize={9} fontWeight="bold" fontFamily="Inter, sans-serif">
        TNG
      </text>
    </svg>
  )
}

function QrModal({ businessName, businessType, onClose }: { businessName: string; businessType: string; onClose: () => void }) {
  const mid = "TNG-BIZ-20260425"
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}>
          <div>
            <p className="text-blue-200 text-[11px] font-medium uppercase tracking-wider">Merchant QR</p>
            <p className="text-white font-bold text-[16px]">{businessName}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-col items-center px-6 pt-6 pb-4 gap-3">
          <div className="p-3 rounded-2xl border-2 border-[#E5EBF8] shadow-sm"><MockQrSvg size={180} /></div>
          <p className="text-[#0D2B6E] font-bold text-[15px]">{businessName}</p>
          <p className="text-gray-400 text-[12px]">{businessType}</p>
          <div className="bg-[#EEF2FB] rounded-xl px-4 py-2 flex flex-col items-center gap-0.5">
            <p className="text-[11px] text-gray-400">Merchant ID</p>
            <p className="text-[13px] font-bold text-[#0D2B6E] font-mono">{mid}</p>
          </div>
          <p className="text-[11px] text-gray-400 text-center leading-relaxed px-2">
            Display this QR at your stall or share it with customers to accept TNG payments.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-7">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 border-[#1A5FD5] text-[#1A5FD5] font-semibold text-[14px] active:scale-95 transition-transform"
            onClick={() => { if (navigator.share) navigator.share({ title: `${businessName} — TNG Merchant QR`, text: mockQrPayload(businessName) }) }}
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-[14px] text-white active:scale-95 transition-transform shadow-md"
            style={{ background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}
            onClick={() => {
              const blob = new Blob([mockQrPayload(businessName)], { type: "text/plain" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${businessName.replace(/\s+/g, "_")}_MerchantQR.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BusinessPage() {
  const router = useRouter()
  const [category, setCategory] = useState("Food & Drinks")
  const [hasSSM, setHasSSM] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [qrGenerated, setQrGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showQr, setShowQr] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("igrow_category")
    if (saved) setCategory(saved)
    setQrGenerated(localStorage.getItem("igrow_qr_generated") === "true")
    setHasSSM(localStorage.getItem("igrow_ssm") === "Yes, I have SSM")
  }, [])

  const businessType = CATEGORY_LABELS[category] ?? "Micro-Business Owner"

  const pathwaySteps = [
    { icon: Banknote, label: "TNG Business Account", done: true },
    { icon: QrCode, label: "Merchant QR", done: qrGenerated },
    { icon: BarChart3, label: "Weekly Sales Summary", done: false },
    { icon: Megaphone, label: "Breakfast Campaign", done: false },
    { icon: Banknote, label: "BizCash Readiness", done: false },
  ]

  const checklist = [
    { task: "Confirm business name", done: true, key: "name" },
    { task: "Set up TNG Business Account", done: true, key: "account" },
    { task: "Generate Merchant QR code", done: qrGenerated, key: "qr" },
    { task: "Complete first 10 QR payments", done: false, key: "payments" },
    { task: "SSM registration", done: hasSSM, key: "ssm" },
  ]

  const doneCount = checklist.filter((c) => c.done).length
  const readinessScore = Math.round(20 + (doneCount / checklist.length) * 50)

  const NEXT_STEPS = [
    "Use your Business Account for business income only",
    "Accept QR payments from customers",
    "Build 3 months of consistent transaction history",
    "Prepare SSM registration to unlock financing",
  ]

  function handleGenerateQr() {
    if (qrGenerated) { setShowQr(true); return }
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setQrGenerated(true)
      localStorage.setItem("igrow_qr_generated", "true")
      setShowQr(true)
    }, 1800)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#EEF2FB", fontFamily: "Inter, sans-serif" }}>

      {/* Hero */}
      <div className="w-full px-5 pt-10 pb-10" style={{ background: "linear-gradient(160deg, #1A5FD5 0%, #0D2B6E 100%)" }}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => router.push("/")} className="text-white/70 hover:text-white mb-5 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </button>

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-blue-200 text-[12px] font-medium uppercase tracking-wider mb-1">TNG Business Account</p>
              <h1 className="text-white text-[26px] font-bold leading-tight">Brisval</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}>
                  {businessType}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.25)", color: "#6EE7B7" }}>
                  Early Active
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                  <circle
                    cx="32" cy="32" r="26"
                    fill="none"
                    stroke="#6EE7B7"
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - readinessScore / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-[13px]">{readinessScore}%</span>
                </div>
              </div>
              <span className="text-blue-200 text-[10px] mt-1 font-medium">Readiness</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="w-full max-w-lg mx-auto px-4 -mt-4 flex flex-col gap-4 pb-8">

        {/* Pathway chips */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-[#E5EBF8]">
          <p className="text-[#0D2B6E] text-[13px] font-bold mb-3">Your TNG Pathway</p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {pathwaySteps.map((step, i) => (
              <div
                key={i}
                className="shrink-0 flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl border-2 min-w-[80px]"
                style={{ borderColor: step.done ? "#1A5FD5" : "#E5EBF8", backgroundColor: step.done ? "#F0F5FF" : "white" }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.done ? "#1A5FD5" : "#9ca3af" }} />
                <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: step.done ? "#0D2B6E" : "#9ca3af" }}>
                  {step.label}
                </span>
                {step.done && (
                  <span className="text-[9px] font-bold text-[#1A5FD5] bg-[#D6E4FF] px-1.5 py-0.5 rounded-full">Active</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding checklist */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-[#E5EBF8]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#0D2B6E] text-[13px] font-bold">Onboarding Checklist</p>
            <span className="text-[12px] font-semibold text-[#1A5FD5]">{doneCount}/{checklist.length} done</span>
          </div>
          <div className="w-full h-1.5 bg-[#EEF2FB] rounded-full mb-4">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(doneCount / checklist.length) * 100}%`, backgroundColor: "#1A5FD5" }} />
          </div>
          <div className="flex flex-col gap-3">
            {checklist.map((item) => (
              <div key={item.key}>
                <div className="flex items-center gap-3">
                  {item.done
                    ? <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1A5FD5]" />
                    : <Circle className="w-5 h-5 shrink-0 text-gray-300" />
                  }
                  <span className="text-[14px] leading-snug flex-1" style={{ color: item.done ? "#0D2B6E" : "#6B7280", fontWeight: item.done ? 600 : 400 }}>
                    {item.task}
                  </span>
                  {item.key === "ssm" && !item.done && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                      Required
                    </span>
                  )}
                </div>
                {item.key === "ssm" && !item.done && (
                  <div className="ml-8 mt-2 rounded-xl px-3 py-2.5 flex items-start gap-2.5" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        SSM registration unlocks financing packages and incubator programs. From <span className="font-bold">RM 30</span> online at ssm.com.my.
                      </p>
                      <button
                        onClick={() => router.push('/chat?prompt=' + encodeURIComponent("How do I register my business with SSM in Malaysia? I'm a small business owner using TNG."))}
                        className="mt-1.5 text-[11px] font-bold text-amber-700 underline underline-offset-2"
                      >
                        Ask iGrow how to get started →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financing Readiness */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-[#E5EBF8]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[#0D2B6E] text-[13px] font-bold">Financing Readiness</p>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
              {readinessScore >= 60 ? "Almost Ready" : "Building"}
            </span>
          </div>
          <p className="text-[12px] text-gray-400 mb-3">
            Not a credit score — this shows how ready you are to explore financing later.
          </p>
          <div className="w-full h-2.5 bg-[#EEF2FB] rounded-full mb-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%`, background: "linear-gradient(90deg, #1A5FD5, #6EE7B7)" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 mb-4">
            <span>0</span>
            <span className="font-semibold text-[#1A5FD5]">{readinessScore} / 100</span>
            <span>100</span>
          </div>
          <div className="flex flex-col gap-2">
            {NEXT_STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#1A5FD5]" />
                <span className="text-[12px] text-gray-600 leading-snug">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Generate QR CTA */}
        <button
          onClick={handleGenerateQr}
          disabled={generating}
          className="w-full rounded-full py-4 font-bold text-[15px] text-white flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-md disabled:opacity-80"
          style={{ background: qrGenerated ? "linear-gradient(135deg, #059669 0%, #047857 100%)" : "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)" }}
        >
          {generating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating your QR…</>
          ) : qrGenerated ? (
            <><QrCode className="w-5 h-5" /> View Merchant QR</>
          ) : (
            <><QrCode className="w-5 h-5" /> Generate Merchant QR</>
          )}
        </button>
      </div>

      {showQr && (
        <QrModal businessName="Brisval" businessType={businessType} onClose={() => setShowQr(false)} />
      )}
    </div>
  )
}
