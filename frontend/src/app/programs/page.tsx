"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Star,
  ExternalLink,
  Info,
  Bot,
  TrendingUp,
  ShieldCheck,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  pri: "#1A5FD5",
  priDark: "#0D2B6E",
  priBg: "#EEF2FB",
  g400: "#94a3b8",
};

// ─── Program data ────────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    id: "A",
    track: "1" as const,
    trackLabel: "Starter Track",
    name: "Package A — Solo Operator",
    tagline: "For solo hustlers. Start small, grow steady.",
    icon: "banknote" as const,
    loanRange: "RM 1,000 – RM 5,000",
    deduction: "6.02% of monthly TNG revenue",
    repayment: "No fixed monthly instalments",
    reviewTrigger: "3+ months below floor — restructure support",
    highlights: [
      "Revenue-based eligibility — no SSM required",
      "No fixed repayment schedule",
      "Linked directly to your TNG merchant account",
      "Quick approval based on transaction history",
    ],
    eligibility: [
      "Active TNG merchant account",
      "Min. 3 months of transaction history",
      "Consistent monthly revenue of RM 300+",
    ],
    partners: [] as { abbr: string; name: string; offer: string }[],
    category: "BizCash Financing",
    color: "#1A5FD5",
  },
  {
    id: "B",
    track: "1" as const,
    trackLabel: "Starter Track",
    name: "Package B — Growing SME",
    tagline: "For businesses ready for their next chapter.",
    icon: "banknote" as const,
    loanRange: "RM 10,000 – RM 50,000",
    deduction: "6.02% of monthly TNG revenue",
    repayment: "No fixed monthly instalments",
    reviewTrigger: "3+ months below floor — restructure support",
    highlights: [
      "Higher credit ceiling for established merchants",
      "Revenue-linked repayment — no stress months",
      "Eligibility boosted by SSM registration",
      "Access to TNG merchant growth tools",
    ],
    eligibility: [
      "SSM-registered business",
      "Min. 6 months of TNG merchant history",
      "Monthly revenue of RM 3,000+",
    ],
    partners: [] as { abbr: string; name: string; offer: string }[],
    category: "BizCash Financing",
    color: "#1A5FD5",
  },
  {
    id: "track1",
    track: "2" as const,
    trackLabel: "Growth Track",
    name: "Digital Commerce",
    tagline: "Grants, incubators, and investors for digital-first businesses.",
    icon: "sparkles" as const,
    loanRange: null,
    deduction: null,
    repayment: null,
    reviewTrigger: null,
    highlights: [
      "MDEC digital grants up to RM 5,000",
      "TEKUN micro-financing RM 1,000–50,000",
      "Selangor digital economy support via SIDEC",
      "Pre-seed investment from Cradle Fund",
    ],
    eligibility: [
      "Active digital commerce merchant",
      "SSM registration recommended",
      "Operating in Malaysia",
    ],
    partners: [
      { abbr: "MD", name: "MDEC", offer: "Digital grants up to RM 5,000" },
      {
        abbr: "TK",
        name: "TEKUN Nasional",
        offer: "RM 1,000 – RM 50,000 micro-financing",
      },
      { abbr: "SD", name: "SIDEC", offer: "Selangor digital economy grants" },
      {
        abbr: "CF",
        name: "Cradle Fund",
        offer: "Pre-seed investment for innovators",
      },
    ],
    category: "Grants & Programs",
    color: "#7C3AED",
  },
  {
    id: "track2",
    track: "2" as const,
    trackLabel: "Growth Track",
    name: "Public & Institutional Funding",
    tagline: "Government and VC programs for scalable businesses.",
    icon: "sparkles" as const,
    loanRange: null,
    deduction: null,
    repayment: null,
    reviewTrigger: null,
    highlights: [
      "SME Corp advisory + business grants",
      "Bank Negara iTEKAD matched savings",
      "VC funding from 1337 Ventures",
      "PERNAS procurement for Bumiputera enterprises",
    ],
    eligibility: [
      "SSM-registered business",
      "Demonstrated revenue growth",
      "Malaysian-owned business",
    ],
    partners: [
      {
        abbr: "SC",
        name: "SME Corp Malaysia",
        offer: "Advisory services + business grants",
      },
      {
        abbr: "iT",
        name: "Bank Negara iTEKAD",
        offer: "B40 matched savings programme",
      },
      {
        abbr: "13",
        name: "1337 Ventures",
        offer: "VC funding for early-stage startups",
      },
      {
        abbr: "PN",
        name: "PERNAS",
        offer: "Procurement for Bumiputera enterprises",
      },
    ],
    category: "Grants & Programs",
    color: "#7C3AED",
  },
];

function ApplySheet({
  program,
  onClose,
  prefilled,
}: {
  program: (typeof PROGRAMS)[0];
  onClose: () => void;
  prefilled: { name: string; category: string; revenue: string; txn: string };
}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg bg-white rounded-t-3xl px-5 pt-5 pb-10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-8" />
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <div className="w-16 h-16 rounded-full bg-[#EEF2FB] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#1A5FD5]" />
            </div>
            <h2 className="text-[#0D2B6E] text-[20px] font-bold">
              Expression of Interest Sent
            </h2>
            <p className="text-gray-500 text-[13px] leading-relaxed max-w-xs">
              A TNG advisor will review your profile and reach out within 2
              business days.
            </p>
            <div className="w-full bg-[#EEF2FB] rounded-2xl p-4 text-left mt-2">
              <p className="text-[11px] font-bold uppercase text-[#1A5FD5] mb-2">
                What happens next
              </p>
              {[
                "TNG pre-fills your application form",
                "Partner notified with your merchant data",
                "You'll receive an in-app notification",
              ].map((s) => (
                <div key={s} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5FD5] shrink-0 mt-0.5" />
                  <span className="text-[12px] text-[#0D2B6E]">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full rounded-full py-4 font-bold text-[15px] text-white active:scale-95 transition-transform shadow-md"
            style={{
              background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)",
            }}
          >
            Back to Programs
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)",
            }}
          >
            {program.icon === "banknote" ? (
              <Banknote className="w-5 h-5 text-white" />
            ) : (
              <Sparkles className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-[#0D2B6E] text-[16px] font-bold leading-snug">
              Apply — {program.name}
            </h2>
            <p className="text-[11px] text-gray-400">{program.trackLabel}</p>
          </div>
        </div>

        <div className="bg-[#EEF2FB] rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-[#1A5FD5]" />
            <span className="text-[11px] font-bold text-[#1A5FD5] uppercase tracking-wide">
              Pre-filled from your TNG account
            </span>
          </div>
          {[
            { label: "Business name", value: prefilled.name },
            { label: "Category", value: prefilled.category },
            { label: "Revenue signal", value: `RM ${prefilled.revenue}` },
            { label: "Total transactions", value: prefilled.txn },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center py-1.5 border-b border-[#E5EBF8] last:border-0"
            >
              <span className="text-[12px] text-gray-500">{label}</span>
              <span className="text-[12px] font-semibold text-[#0D2B6E]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-gray-400 leading-relaxed mb-5">
          By submitting, you authorise TNG to share your merchant data with this
          program partner to assess your eligibility. This is not a loan
          approval.
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-full py-4 font-bold text-[15px] text-white mb-3 active:scale-95 transition-transform shadow-md"
          style={{
            background: "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)",
          }}
        >
          Take me to BizCash →
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-full py-3.5 font-semibold text-[14px] border-2 border-[#E5EBF8] text-[#6B7280] hover:bg-[#F5F8FF] transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

type AiRec = {
  recommendedPackage: string;
  tier: string;
  matchScore: number;
  scores: { A: number; B: number; track1: number; track2: number };
  reasoning: { label: string; detail: string; icon: string }[];
  metrics: {
    totalRevenue: number;
    totalTxn: number;
    wowGrowth: number;
    avgTxn: number;
    bestDay: string;
  };
};

function loadAiRec(): AiRec | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem("igrow_ai_recommendation");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export default function ProgramsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [recommendedId, setRecommendedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyingProgram, setApplyingProgram] = useState<
    (typeof PROGRAMS)[0] | null
  >(null);
  const [prefilled, setPrefilled] = useState({
    name: "My Business",
    category: "Food & Drinks",
    revenue: "2,449",
    txn: "318",
  });
  const [reportExpanded, setReportExpanded] = useState(true);
  const [aiRec, setAiRec] = useState<AiRec | null>(null);

  useEffect(() => {
    setMounted(true);
    const cat = localStorage.getItem("igrow_category") ?? "";
    const simCompleted = localStorage.getItem("igrow_sim_completed") === "true";

    // Load AI recommendation
    const rec = loadAiRec();
    setAiRec(rec);

    // Determine recommended package: prefer AI result, fallback to saved tier/pkg
    const savedPkg = localStorage.getItem("igrow_package") as string | null;
    const aiPkg = rec?.recommendedPackage ?? savedPkg;
    if (simCompleted && aiPkg) {
      setRecommendedId(aiPkg);
      setExpandedId(aiPkg);
    }

    const simCount = Number.parseInt(
      localStorage.getItem("igrow_dash_sim_count") ?? "0",
      10,
    );
    const revenue = rec?.metrics?.totalRevenue
      ? Number(rec.metrics.totalRevenue).toLocaleString("en-MY", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : simCount >= 14
        ? "2,609"
        : "—";
    const txn = rec?.metrics?.totalTxn
      ? String(rec.metrics.totalTxn)
      : simCount >= 14
        ? "388"
        : "—";
    setPrefilled({
      name: "My Business",
      category: cat || "Food & Drinks",
      revenue,
      txn,
    });

    if (window.location.hash === "#recommended") {
      setTimeout(() => {
        document
          .getElementById("recommended-program")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  if (!mounted) return null;

  const recommendedProgram = PROGRAMS.find((p) => p.id === recommendedId);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#EEF2FB", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <div
        className="w-full px-5 pt-10 pb-7"
        style={{
          background: "linear-gradient(160deg, #1A5FD5 0%, #0D2B6E 100%)",
        }}
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="text-white/70 hover:text-white mb-5 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <p className="text-blue-200 text-[11px] font-bold uppercase tracking-wider mb-1">
            AlphaGrow Launchpad
          </p>
          <h1 className="text-white text-[22px] font-bold leading-snug">
            Matched Programs
          </h1>
          <p className="text-blue-200 text-[13px] mt-1">
            {recommendedProgram
              ? `AI-matched to ${recommendedProgram.name} · all programs shown below`
              : "All available programs — pick what suits you"}
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 py-5 flex flex-col gap-3">
        {/* AI Analysis Report */}
        {recommendedId && (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-[#E5EBF8] overflow-hidden">
            {/* Report header — always visible */}
            <button
              className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
              onClick={() => setReportExpanded((v) => !v)}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)",
                }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-bold text-[#0D2B6E]">
                    AlphaGrow Analytics Engine
                  </p>
                  <span className="text-[9px] font-bold bg-[#EEF2FB] text-[#1A5FD5] px-1.5 py-0.5 rounded-full">
                    v2.1
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Merchant profile analysis · 5 signals evaluated ·{" "}
                  {aiRec?.matchScore ?? 87}% match
                </p>
              </div>
              <motion.div
                animate={{ rotate: reportExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {reportExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-[#F0F5FF]">
                    {/* Key metrics strip */}
                    {(() => {
                      const m = aiRec?.metrics;
                      const totalRev = m?.totalRevenue ?? 0;
                      const wowG = m?.wowGrowth ?? 0;
                      const avgT = m?.avgTxn ?? 0;
                      return (
                        <div className="grid grid-cols-3 gap-2 mt-3 mb-4">
                          {[
                            {
                              value: totalRev
                                ? `RM ${Number(totalRev).toLocaleString("en-MY", { maximumFractionDigits: 0 })}`
                                : "—",
                              label: "Revenue signal",
                            },
                            {
                              value: totalRev
                                ? `${wowG >= 0 ? "+" : ""}${Number(wowG).toFixed(1)}%`
                                : "—",
                              label: "MoM growth",
                            },
                            {
                              value: totalRev
                                ? `RM ${Number(avgT).toFixed(2)}`
                                : "—",
                              label: "Avg per txn",
                            },
                          ].map(({ value, label }) => (
                            <div
                              key={label}
                              className="bg-[#EEF2FB] rounded-xl px-2 py-2.5 text-center"
                            >
                              <p className="text-[14px] font-extrabold text-[#0D2B6E] leading-tight">
                                {value}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {label}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Agent reasoning steps */}
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2.5">
                      Agent reasoning chain
                    </p>
                    <div className="flex flex-col gap-0">
                      {(aiRec?.reasoning ?? []).map((step, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="flex flex-col items-center shrink-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{
                                background:
                                  "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)",
                              }}
                            >
                              {step.icon === "bar" ? (
                                <BarChart2 className="w-3 h-3 text-white" />
                              ) : step.icon === "shield" ? (
                                <ShieldCheck className="w-3 h-3 text-white" />
                              ) : (
                                <TrendingUp className="w-3 h-3 text-white" />
                              )}
                            </div>
                            {i < (aiRec?.reasoning ?? []).length - 1 && (
                              <div
                                className="w-px flex-1 bg-[#E5EBF8] my-1"
                                style={{ minHeight: 12 }}
                              />
                            )}
                          </div>
                          <div className="pb-3 flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-[#0D2B6E] leading-snug">
                              {step.label}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Program score comparison */}
                    {aiRec?.scores && (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2.5 mt-1">
                          Match score — all programs
                        </p>
                        <div className="flex flex-col gap-2">
                          {(
                            [
                              { id: "B", label: "Package B — Growing SME" },
                              {
                                id: "track1",
                                label: "Digital Commerce (Growth Track)",
                              },
                              { id: "A", label: "Package A — Solo Operator" },
                              { id: "track2", label: "Public & Institutional" },
                            ] as { id: keyof AiRec["scores"]; label: string }[]
                          )
                            .sort(
                              (a, b) =>
                                (aiRec.scores[b.id] ?? 0) -
                                (aiRec.scores[a.id] ?? 0),
                            )
                            .map(({ id, label }) => {
                              const score = aiRec.scores[id] ?? 0;
                              const recommended =
                                id === aiRec.recommendedPackage;
                              return (
                                <div key={id}>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-semibold text-[#0D2B6E]">
                                        {label}
                                      </span>
                                      {recommended && (
                                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                          Best match
                                        </span>
                                      )}
                                    </div>
                                    <span
                                      className="text-[11px] font-bold"
                                      style={{
                                        color: recommended
                                          ? "#1A5FD5"
                                          : "#94a3b8",
                                      }}
                                    >
                                      {score}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-[#E5EBF8] overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{
                                        background: recommended
                                          ? "linear-gradient(90deg, #1A5FD5, #2B7BE5)"
                                          : "#CBD5E1",
                                      }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${score}%` }}
                                      transition={{ duration: 0.7, delay: 0.1 }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Programs list */}
        {PROGRAMS.map((program) => {
          const isRecommended = program.id === recommendedId;
          const isExpanded = expandedId === program.id;

          return (
            <div
              key={program.id}
              id={isRecommended ? "recommended-program" : undefined}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border-2"
              style={{ borderColor: isRecommended ? C.pri : "#E5EBF8" }}
            >
              {/* Card header — always visible */}
              <button
                className="w-full px-4 py-4 flex items-start gap-3 text-left"
                onClick={() => setExpandedId(isExpanded ? null : program.id)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: isRecommended
                      ? "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)"
                      : "#EEF2FB",
                  }}
                >
                  {program.icon === "banknote" ? (
                    <Banknote
                      className={`w-5 h-5 ${isRecommended ? "text-white" : "text-[#1A5FD5]"}`}
                    />
                  ) : (
                    <Sparkles
                      className={`w-5 h-5 ${isRecommended ? "text-white" : "text-[#7C3AED]"}`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        color: program.track === "1" ? C.pri : "#7C3AED",
                      }}
                    >
                      {program.trackLabel}
                    </span>
                    {isRecommended && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Star className="w-2.5 h-2.5" /> Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-bold text-[#0D2B6E] leading-snug">
                    {program.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                    {program.tagline}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                </motion.div>
              </button>

              {/* Expanded content with animation */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    className="px-4 pb-4 border-t border-[#F0F5FF] overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {/* Quick stats for BizCash */}
                    {program.loanRange && (
                      <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
                        {[
                          { label: "Loan range", value: program.loanRange },
                          {
                            label: "Revenue deduction",
                            value: program.deduction!,
                          },
                          { label: "Repayment", value: program.repayment! },
                          {
                            label: "Review trigger",
                            value: program.reviewTrigger!,
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="bg-[#EEF2FB] rounded-xl p-2.5"
                          >
                            <p className="text-[10px] text-gray-400 mb-0.5">
                              {label}
                            </p>
                            <p className="text-[12px] font-semibold text-[#0D2B6E] leading-snug">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Partners for Growth Track */}
                    {program.partners.length > 0 && (
                      <div className="flex flex-col gap-2 mt-3 mb-3">
                        {program.partners.map((p) => (
                          <div key={p.abbr} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#EEF2FB] flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-[#1A5FD5]">
                                {p.abbr}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-[#0D2B6E] truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate">
                                {p.offer}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Highlights */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2 mt-1">
                        What you get
                      </p>
                      <div className="flex flex-col gap-1.5 mb-3">
                        {program.highlights.map((h) => (
                          <div key={h} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5FD5] shrink-0 mt-0.5" />
                            <span className="text-[12px] text-[#374151] leading-snug">
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">
                        Eligibility
                      </p>
                      <div className="flex flex-col gap-1.5 mb-4">
                        {program.eligibility.map((e) => (
                          <div key={e} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                            <span className="text-[12px] text-gray-500 leading-snug">
                              {e}
                            </span>
                          </div>
                        ))}
                      </div>

                      {program.partners.length > 0 && (
                        <p className="text-[11px] text-[#1A5FD5] font-medium mb-4">
                          TNG pre-fills your application form using your
                          merchant data.
                        </p>
                      )}

                      <button
                        onClick={() => setApplyingProgram(program)}
                        className="w-full rounded-full py-3.5 font-bold text-[14px] text-white flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
                        style={{
                          background: isRecommended
                            ? "linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)"
                            : "#374151",
                        }}
                      >
                        {isRecommended
                          ? "Apply — Recommended for You"
                          : "Apply for This Program"}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <p className="text-center text-[11px] text-gray-400 pb-6 pt-2 px-4 leading-relaxed">
          All programs are subject to individual eligibility review. This is not
          a guarantee of approval.
        </p>
      </div>

      <AnimatePresence>
        {applyingProgram && (
          <ApplySheet
            program={applyingProgram}
            onClose={() => setApplyingProgram(null)}
            prefilled={prefilled}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
