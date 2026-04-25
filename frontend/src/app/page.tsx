"use client"

import { ArrowDownLeft, ArrowUpRight, Car, Dumbbell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { dummyTransactions, RawTransaction } from './data'
import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { PricingInteractionDemo } from '@/components/ui/pricing-demo'

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
        <span className="text-[#0D2B6E] text-[14px] font-semibold leading-snug truncate">
          {tx.name}
        </span>
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

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEF2FB', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero header — TNG blue */}
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
          <span className="text-blue-300 text-[13px] font-medium mt-0.5">Brisval</span>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-white/15 border border-white/30 text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-white/25 transition-colors active:scale-95"
            >
              + iGrow Launchpad
            </button>
            <button className="flex items-center gap-1 text-white text-[13px] font-semibold px-4 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-colors">
              Transactions →
            </button>
          </div>
        </div>
      </div>

      {/* Content card pulled up over the hero */}
      <div className="w-full max-w-lg mx-auto px-4 -mt-5 flex flex-col flex-1 pb-8 gap-5">

        {/* Transaction History */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEF2FB]">
            <span className="text-[#0D2B6E] text-[15px] font-bold">Transaction History</span>
            <span className="text-[#6B7280] text-[12px] font-medium bg-[#EEF2FB] px-2.5 py-0.5 rounded-full">
              {allMappedTransactions.length} items
            </span>
          </div>

          <div className="flex flex-col px-4 py-3 gap-2">
            {/* Today */}
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-[#1A5FD5] text-[13px] font-bold uppercase tracking-wide">Today</span>
              <span className="text-[#6B7280] text-[12px]">{todayTransactions.length} transactions</span>
            </div>
            {todayTransactions.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}

            {/* Yesterday */}
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

      {/* iGrow Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="TNG Business Launchpad"
      >
        <PricingInteractionDemo />
      </Modal>
    </div>
  )
}
