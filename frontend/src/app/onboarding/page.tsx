"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"

const CATEGORIES = [
  { emoji: "🍱", label: "Food & Drinks" },
  { emoji: "🛍️", label: "Products & Goods" },
  { emoji: "🔧", label: "Services & Skills" },
]

const SELL_MODES = [
  { label: "Online only", sub: "Social media, WhatsApp, e-commerce" },
  { label: "Offline only", sub: "Physical stall, shop, or home delivery" },
  { label: "Both online & offline", sub: "Mix of digital and in-person" },
]

const SSM_OPTIONS = [
  { label: "Yes, I have SSM", sub: "My business is registered" },
  { label: "Not yet", sub: "I'll register when I'm ready" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("")
  const [customInput, setCustomInput] = useState("")
  const [sellMode, setSellMode] = useState("")
  const [ssm, setSsm] = useState("")

  const totalSteps = 3

  function handleNext() {
    if (step < totalSteps) {
      setStep((s) => s + 1)
    } else {
      localStorage.setItem("igrow_onboarded", "true")
      localStorage.setItem("igrow_category", category || customInput || "General Business")
      localStorage.setItem("igrow_sell_mode", sellMode)
      localStorage.setItem("igrow_ssm", ssm)
      router.push("/business")
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((s) => s - 1)
    } else {
      router.back()
    }
  }

  const canProceed =
    step === 1 ? category !== "" || customInput.trim() !== "" :
    step === 2 ? sellMode !== "" :
    ssm !== ""

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#EEF2FB", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div
        className="w-full px-5 pt-10 pb-8"
        style={{ background: "linear-gradient(160deg, #1A5FD5 0%, #0D2B6E 100%)" }}
      >
        <div className="max-w-lg mx-auto">
          <button onClick={handleBack} className="text-white/70 hover:text-white mb-5 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Progress bar */}
          <div className="flex gap-1.5 mb-5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full flex-1 transition-all duration-300"
                style={{ backgroundColor: i < step ? "white" : "rgba(255,255,255,0.25)" }}
              />
            ))}
          </div>

          <p className="text-blue-200 text-[12px] font-medium uppercase tracking-wider mb-1">
            Step {step} of {totalSteps}
          </p>
          <h1 className="text-white text-[22px] font-bold leading-snug">
            {step === 1 && "What does your business sell?"}
            {step === 2 && "How do you sell?"}
            {step === 3 && "Are you SSM registered?"}
          </h1>
          <p className="text-blue-200 text-[13px] mt-1">
            {step === 1 && "Choose a category or describe your business."}
            {step === 2 && "Tell us how you reach your customers."}
            {step === 3 && "This helps us tailor your financing readiness path."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-lg mx-auto px-4 py-5 flex flex-col flex-1 gap-4">

        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="flex flex-col gap-2.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.label}
                  onClick={() => { setCategory(c.label); setCustomInput("") }}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 text-left border-2 transition-all duration-200 shadow-sm"
                  style={{ borderColor: category === c.label ? "#1A5FD5" : "#E5EBF8" }}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span
                    className="font-semibold text-[15px]"
                    style={{ color: category === c.label ? "#0D2B6E" : "#374151" }}
                  >
                    {c.label}
                  </span>
                  {category === c.label && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-[#1A5FD5] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#C8D8F5]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#EEF2FB] px-3 text-[12px] text-gray-400 font-medium">or describe it</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="e.g. I sell nasi lemak from home"
              value={customInput}
              onChange={(e) => { setCustomInput(e.target.value); setCategory("") }}
              className="bg-white border-2 border-[#E5EBF8] rounded-2xl px-4 py-3.5 text-[14px] text-gray-800 placeholder-gray-400 outline-none focus:border-[#1A5FD5] transition-colors"
            />
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-2.5">
            {SELL_MODES.map((m) => (
              <button
                key={m.label}
                onClick={() => setSellMode(m.label)}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 text-left border-2 transition-all duration-200 shadow-sm"
                style={{ borderColor: sellMode === m.label ? "#1A5FD5" : "#E5EBF8" }}
              >
                <div className="flex flex-col flex-1">
                  <span
                    className="font-semibold text-[15px]"
                    style={{ color: sellMode === m.label ? "#0D2B6E" : "#374151" }}
                  >
                    {m.label}
                  </span>
                  <span className="text-[12px] text-gray-400 mt-0.5">{m.sub}</span>
                </div>
                <div
                  className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                  style={{ borderColor: sellMode === m.label ? "#1A5FD5" : "#9ca3af" }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-[#1A5FD5] transition-opacity"
                    style={{ opacity: sellMode === m.label ? 1 : 0 }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-2.5">
            {SSM_OPTIONS.map((o) => (
              <button
                key={o.label}
                onClick={() => setSsm(o.label)}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-4 text-left border-2 transition-all duration-200 shadow-sm"
                style={{ borderColor: ssm === o.label ? "#1A5FD5" : "#E5EBF8" }}
              >
                <div className="flex flex-col flex-1">
                  <span
                    className="font-semibold text-[15px]"
                    style={{ color: ssm === o.label ? "#0D2B6E" : "#374151" }}
                  >
                    {o.label}
                  </span>
                  <span className="text-[12px] text-gray-400 mt-0.5">{o.sub}</span>
                </div>
                <div
                  className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                  style={{ borderColor: ssm === o.label ? "#1A5FD5" : "#9ca3af" }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-[#1A5FD5] transition-opacity"
                    style={{ opacity: ssm === o.label ? 1 : 0 }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full rounded-full py-4 font-bold text-[15px] text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md"
          style={{
            background: canProceed
              ? "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)"
              : "#C8D8F5",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          {step < totalSteps ? (
            <>Next <ChevronRight className="w-4 h-4" /></>
          ) : (
            "Set Up My Business Account →"
          )}
        </button>

        <p className="text-center text-[11px] text-gray-400 pb-4">
          This is not financial advice. TNG Business Account is subject to eligibility review.
        </p>
      </div>
    </div>
  )
}
