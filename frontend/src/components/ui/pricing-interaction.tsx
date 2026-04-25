"use client"

import React from "react";
import { ChevronDown } from "lucide-react";

// --- Data ---

const tier1 = {
  title: "Tier 1: Starter Track — Revenue-Based Financing (RBF)",
  description:
    "Borrowers repay through automatic percentage deductions from their TNG merchant revenue. No fixed monthly instalments. If revenue drops, repayment drops proportionally.",
  packages: [
    {
      title: "Package A — Solo Operator",
      rows: [
        { field: "Eligible for", detail: "Sole proprietors, hawkers, informal traders" },
        { field: "Loan range", detail: "RM 1,000 – RM 5,000" },
        { field: "Revenue deduction", detail: "Flat rate: 5% of monthly TNG revenue" },
        { field: "Repayment cap", detail: "Up to 18 months or until principal settled" },
        {
          field: "Default trigger",
          detail: "3 consecutive months below minimum floor — account flagged for review",
        },
      ],
    },
    {
      title: "Package B — Growing SME",
      rows: [
        {
          field: "Eligible for",
          detail: "Registered businesses with consistent TNG transaction volume",
        },
        { field: "Loan range", detail: "RM 10,000 – RM 50,000" },
        {
          field: "Revenue deduction",
          detail: "8% of monthly TNG revenue (flat rate across all loan sizes)",
        },
        { field: "Repayment cap", detail: "Up to 24 months or until principal settled" },
        {
          field: "Default trigger",
          detail:
            "3 consecutive months below minimum floor — account flagged for review and escalate to collections partner",
        },
      ],
    },
  ],
};

const tier2 = {
  title: "Tier 2: Growth Track — Incubator Match-Making",
  description:
    "For businesses ready to go online, scale their digital presence, or adopt e-commerce. For partners with API integration, TNG pre-fills the application form using merchant data (revenue history, business type, location). The merchant reviews and submits.",
  prefill:
    "Prefill info needs to be submitted — business type, revenue range, registration status, geography, and demographic requirements.",
  tracks: [
    {
      title: "Track 1 — Digital Commerce",
      subtitle:
        "For businesses ready to go online, scale their digital presence, or adopt e-commerce.",
      partners: [
        {
          name: "Cradle Fund & MyStartup",
          offer: "Pre-seed grants and equity-free funding for digital ventures",
        },
        { name: "SIDEC", offer: "Selangor-based digital commerce enablement and grants" },
        {
          name: "MDEC",
          offer: "Digital economy grants (up to RM 5k), e-commerce onboarding support",
        },
        {
          name: "MRANTI",
          offer: "R&D commercialisation and deep-tech incubation for scaling businesses",
        },
        {
          name: "TEKUN",
          offer:
            "Fast microfinancing (RM 1,000–RM 50,000) for Bumiputera and Indian entrepreneurs, particularly those who do not qualify for traditional bank loans.",
        },
      ],
    },
    {
      title: "Track 2 — Public & Institutional Funding (P&I)",
      subtitle:
        "For businesses seeking formal institutional backing, government financing, or strategic investment.",
      partners: [
        {
          name: "PERNAS",
          offer:
            "National trading corporation — procurement and business development for Bumiputera enterprises",
        },
        {
          name: "Bank Negara iTEKAD",
          offer: "Social finance programme — matched savings + microfinancing for B40 entrepreneurs",
        },
        {
          name: "SME Corp",
          offer:
            "Grant matching, business advisory, and programme referrals across all SME lifecycle stages",
        },
        {
          name: "1337 Ventures",
          offer:
            "Early-stage VC focused on Southeast Asian founders; equity investment for scalable startups",
        },
      ],
    },
  ],
};

// --- Sub-components ---

function DetailTable({ rows }: { rows: { field: string; detail: string }[] }) {
  return (
    <div className="w-full border border-[#C8D8F5] rounded-xl overflow-hidden text-sm">
      <div className="grid grid-cols-[2fr_3fr]" style={{ backgroundColor: '#D6E4FF' }}>
        <div className="px-3 py-2 font-semibold text-[#0D2B6E] border-b border-r border-[#C8D8F5]">
          Field
        </div>
        <div className="px-3 py-2 font-semibold text-[#0D2B6E] border-b border-[#C8D8F5]">
          Detail
        </div>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-[2fr_3fr] bg-white ${i < rows.length - 1 ? "border-b border-[#C8D8F5]" : ""}`}
        >
          <div className="px-3 py-2.5 font-medium text-[#0D2B6E] border-r border-[#C8D8F5] leading-snug">
            {row.field}
          </div>
          <div className="px-3 py-2.5 text-[#374151] leading-snug">{row.detail}</div>
        </div>
      ))}
    </div>
  );
}

function PartnerTable({ partners }: { partners: { name: string; offer: string }[] }) {
  return (
    <div className="w-full border border-[#C8D8F5] rounded-xl overflow-hidden text-sm">
      <div className="grid grid-cols-[2fr_3fr]" style={{ backgroundColor: '#D6E4FF' }}>
        <div className="px-3 py-2 font-semibold text-[#0D2B6E] border-b border-r border-[#C8D8F5]">
          Partner
        </div>
        <div className="px-3 py-2 font-semibold text-[#0D2B6E] border-b border-[#C8D8F5]">
          What They Offer
        </div>
      </div>
      {partners.map((p, i) => (
        <div
          key={i}
          className={`grid grid-cols-[2fr_3fr] bg-white ${i < partners.length - 1 ? "border-b border-[#C8D8F5]" : ""}`}
        >
          <div className="px-3 py-2.5 font-semibold text-[#0D2B6E] border-r border-[#C8D8F5] leading-snug">
            {p.name}
          </div>
          <div className="px-3 py-2.5 text-[#374151] leading-snug">{p.offer}</div>
        </div>
      ))}
    </div>
  );
}

function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="w-full">
      <button
        className="w-full flex items-center justify-between text-left px-4 py-3 gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-bold text-[14px] text-[#0D2B6E]">{title}</span>
        <ChevronDown
          className="shrink-0 w-4 h-4 text-[#1A5FD5] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

// --- Main component ---

export function PricingInteraction() {
  const [tier, setTier] = React.useState(0);
  const [activePackage, setActivePackage] = React.useState(0);

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Tier toggle */}
      <div
        className="rounded-full relative w-full p-1 flex items-center"
        style={{ backgroundColor: '#D6E4FF' }}
      >
        {["Tier 1: Starter", "Tier 2: Growth"].map((label, i) => (
          <button
            key={i}
            className="font-bold rounded-full w-full py-2 px-2 z-20 text-[13px] transition-colors duration-200"
            style={{ color: tier === i ? '#0D2B6E' : '#1A5FD5' }}
            onClick={() => setTier(i)}
          >
            {label}
          </button>
        ))}
        <div
          className="flex items-center justify-center absolute inset-0 w-1/2 z-10 pointer-events-none p-1"
          style={{ transform: `translateX(${tier * 100}%)`, transition: "transform 0.3s" }}
        >
          <div className="bg-white shadow-md rounded-full w-full h-full" />
        </div>
      </div>

      {/* Tier 1 */}
      {tier === 0 && (
        <div className="flex flex-col gap-3">
          {/* Description card */}
          <div className="bg-white rounded-2xl p-4 border border-[#C8D8F5]">
            <p className="font-bold text-[13px] text-[#0D2B6E]">{tier1.title}</p>
            <p className="text-[12px] text-[#4B5563] mt-1.5 leading-relaxed">
              <span className="font-semibold text-[#1A5FD5]">Description: </span>
              {tier1.description}
            </p>
          </div>

          {/* Package cards */}
          {tier1.packages.map((pkg, i) => (
            <div
              key={i}
              className="w-full rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border: `2px solid ${activePackage === i ? '#1A5FD5' : '#C8D8F5'}`,
                backgroundColor: activePackage === i ? '#F0F5FF' : 'white',
              }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                onClick={() => setActivePackage(activePackage === i ? -1 : i)}
              >
                <span className="font-bold text-[14px] text-[#0D2B6E]">{pkg.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className="border-2 size-5 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{ borderColor: activePackage === i ? '#1A5FD5' : '#9ca3af' }}
                  >
                    <div
                      className="size-2.5 rounded-full transition-opacity duration-200"
                      style={{
                        backgroundColor: '#1A5FD5',
                        opacity: activePackage === i ? 1 : 0,
                      }}
                    />
                  </div>
                  <ChevronDown
                    className="w-4 h-4 transition-transform duration-200"
                    style={{
                      color: activePackage === i ? '#1A5FD5' : '#9ca3af',
                      transform: activePackage === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>
              </button>
              {activePackage === i && (
                <div className="px-4 pb-4">
                  <DetailTable rows={pkg.rows} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tier 2 */}
      {tier === 1 && (
        <div className="flex flex-col gap-3">
          {/* Description card */}
          <div className="bg-white rounded-2xl p-4 border border-[#C8D8F5]">
            <p className="font-bold text-[13px] text-[#0D2B6E]">{tier2.title}</p>
            <p className="text-[12px] text-[#4B5563] mt-1.5 leading-relaxed">
              <span className="font-semibold text-[#1A5FD5]">Description: </span>
              {tier2.description}
            </p>
            <p className="text-[12px] text-[#4B5563] mt-2 leading-relaxed border-t border-[#EEF2FB] pt-2">
              <span className="font-semibold text-[#1A5FD5]">Prefill info: </span>
              {tier2.prefill}
            </p>
          </div>

          {/* Track cards */}
          {tier2.tracks.map((track, i) => (
            <div
              key={i}
              className="w-full rounded-2xl overflow-hidden bg-white border border-[#C8D8F5]"
            >
              <Collapsible title={track.title} defaultOpen={i === 0}>
                <p className="text-[12px] text-[#6B7280] leading-relaxed">{track.subtitle}</p>
                <PartnerTable partners={track.partners} />
              </Collapsible>
            </div>
          ))}
        </div>
      )}

      {/* CTA button — TNG blue */}
      <button
        className="rounded-full text-[15px] font-bold text-white w-full py-3.5 active:scale-95 transition-transform duration-200 mt-1 shadow-md"
        style={{ background: 'linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)' }}
      >
        Get Started
      </button>
    </div>
  );
}
