"use client"

import { ArrowDownLeft, ArrowUpRight, Car, Dumbbell, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { dummyTransactions, RawTransaction } from '../data'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Transaction = {
  id: string | number
  name: string
  time: string
  amount: string
  credit: boolean
  iconBg: string
  Icon: LucideIcon
}

function getIconForCategory(categoryId: string, credit: boolean) {
  if (credit) return { Icon: ArrowDownLeft, iconBg: '#10B981' }
  switch (categoryId) {
    case 'c-008': return { Icon: Car, iconBg: '#0D2B6E' }
    case 'c-010': return { Icon: Dumbbell, iconBg: '#E5584F' }
    default: return { Icon: ArrowUpRight, iconBg: '#1A5FD5' }
  }
}

const allMappedTransactions: Transaction[] = dummyTransactions.map((tx: RawTransaction) => {
  const credit = tx.direction === 'credit'
  const { Icon, iconBg } = getIconForCategory(tx.category_id, credit)
  return {
    id: tx.id,
    name: tx.title,
    time: '12:00 PM',
    amount: `${credit ? '+RM ' : 'RM '}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    credit,
    iconBg,
    Icon,
  }
})

const todayTransactions = allMappedTransactions.slice(0, 4)
const yesterdayTransactions = allMappedTransactions.slice(4)

function TransactionCard({ tx }: { tx: Transaction }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 w-full shadow-sm">
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: tx.iconBg }}
      >
        <tx.Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[#0D2B6E] text-[14px] font-semibold leading-snug truncate">{tx.name}</span>
        <span className="text-[#6B7280] text-[12px]">{tx.time}</span>
      </div>
      <span
        className="text-[14px] font-bold shrink-0"
        style={{ color: tx.credit ? '#10B981' : '#0D2B6E' }}
      >
        {tx.amount}
      </span>
    </div>
  )
}

// --- Consent bottom sheet ---
function ConsentSheet({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)' }}
        >
          <TrendingUp className="w-6 h-6 text-white" />
        </div>

        <h2 className="text-[#0D2B6E] text-[18px] font-bold leading-snug mb-2">
          We noticed business activity
        </h2>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-1">
          We noticed regular incoming payments that look like business activity on your account.
        </p>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
          Open a <span className="font-semibold text-[#0D2B6E]">TNG Business Account</span> to separate your business income, accept QR payments, and track your sales.
        </p>

        <p className="text-[11px] text-gray-400 mb-5 leading-relaxed">
          Based on similar merchant journeys, tools such as QR payments, sales tracking, and campaigns may help you manage and grow your business better. This is not financial advice.
        </p>

        <button
          onClick={onAccept}
          className="w-full rounded-full py-4 font-bold text-[15px] text-white mb-3 active:scale-95 transition-transform duration-200 shadow-md"
          style={{ background: 'linear-gradient(135deg, #1A5FD5 0%, #0D2B6E 100%)' }}
        >
          Yes, I run a business
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-full py-3.5 font-semibold text-[14px] border-2 border-[#E5EBF8] text-[#6B7280] hover:bg-[#F5F8FF] transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  const router = useRouter()
  const [showConsent, setShowConsent] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    setIsOnboarded(localStorage.getItem('igrow_onboarded') === 'true')
  }, [])

  function handleLaunchpadClick() {
    if (isOnboarded) {
      router.push('/business')
    } else {
      setShowConsent(true)
    }
  }

  function handleAccept() {
    setShowConsent(false)
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEF2FB', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero */}
      <div
        className="w-full px-5 pt-8 pb-10"
        style={{ background: 'linear-gradient(160deg, #1A5FD5 0%, #0D2B6E 100%)' }}
      >
        <div className="max-w-lg mx-auto flex flex-col gap-1">
          <span className="text-blue-200 text-[13px] font-medium tracking-wide uppercase">
            Total Balance
          </span>
          <span className="text-white text-[36px] font-bold leading-tight tracking-tight">
            RM 103,164.10
          </span>
          <span className="text-blue-300 text-[13px] font-medium mt-0.5">
            Brisval
            {isOnboarded && (
              <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(110,231,183,0.2)', color: '#6EE7B7' }}>
                Business profile active · Building readiness
              </span>
            )}
          </span>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleLaunchpadClick}
              className="flex items-center gap-1.5 border border-white/30 text-white text-[13px] font-semibold px-4 py-2 rounded-full transition-colors active:scale-95"
              style={{ backgroundColor: isOnboarded ? 'rgba(110,231,183,0.2)' : 'rgba(255,255,255,0.15)' }}
            >
              {isOnboarded ? '🏢 My Business →' : '+ iGrow Launchpad'}
            </button>
            <button className="flex items-center gap-1 text-white text-[13px] font-semibold px-4 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-colors">
              Transactions →
            </button>
          </div>
        </div>
      </div>

      {/* Transaction history card */}
      <div className="w-full max-w-lg mx-auto px-4 -mt-5 flex flex-col flex-1 pb-8 gap-5">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEF2FB]">
            <span className="text-[#0D2B6E] text-[15px] font-bold">Transaction History</span>
            <span className="text-[#6B7280] text-[12px] font-medium bg-[#EEF2FB] px-2.5 py-0.5 rounded-full">
              {allMappedTransactions.length} items
            </span>
          </div>

          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-[#1A5FD5] text-[13px] font-bold uppercase tracking-wide">Today</span>
              <span className="text-[#6B7280] text-[12px]">{todayTransactions.length} transactions</span>
            </div>
            {todayTransactions.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}

            <div className="flex items-center justify-between px-1 py-1 mt-2">
              <span className="text-[#1A5FD5] text-[13px] font-bold uppercase tracking-wide">Yesterday</span>
              <span className="text-[#6B7280] text-[12px]">{yesterdayTransactions.length} transactions</span>
            </div>
            {yesterdayTransactions.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      </div>

      {/* Consent sheet */}
      {showConsent && (
        <ConsentSheet
          onClose={() => setShowConsent(false)}
          onAccept={handleAccept}
        />
      )}
    </div>
  )
}
