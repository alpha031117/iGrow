"use client"

import { ArrowDownLeft, ArrowUpRight, Car, Dumbbell, TrendingUp, BarChart3, ChevronRight, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { dummyTransactions, simulationTransactions, RawTransaction } from './data'
import { useState, useEffect, useRef } from 'react'
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

type StoredHomeSimTransaction = {
  id: string
  title: string
  time: string
  amount: number
  categoryId: string
}

const HOME_SIM_COUNT_KEY = 'igrow_home_sim_count'
const HOME_SIM_TOTAL_KEY = 'igrow_home_sim_total'
const HOME_SIM_TXNS_KEY = 'igrow_home_sim_transactions'

function getIconForCategory(categoryId: string, credit: boolean) {
  if (credit) return { Icon: ArrowDownLeft, iconBg: '#10B981' }
  switch (categoryId) {
    case 'c-008': return { Icon: Car, iconBg: '#0D2B6E' }
    case 'c-010': return { Icon: Dumbbell, iconBg: '#E5584F' }
    default: return { Icon: ArrowUpRight, iconBg: '#1A5FD5' }
  }
}

function mapTransaction(tx: RawTransaction): Transaction {
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
}

function mapStoredHomeSimTransaction(tx: StoredHomeSimTransaction): Transaction {
  return {
    id: tx.id,
    name: tx.title,
    time: tx.time,
    amount: `+RM ${tx.amount.toFixed(2)}`,
    credit: true,
    ...getIconForCategory(tx.categoryId, true),
  }
}

function readStoredHomeSimTransactions(): StoredHomeSimTransaction[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HOME_SIM_TXNS_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((tx): tx is StoredHomeSimTransaction =>
      typeof tx?.id === 'string' &&
      typeof tx?.title === 'string' &&
      typeof tx?.time === 'string' &&
      typeof tx?.amount === 'number' &&
      typeof tx?.categoryId === 'string'
    )
  } catch {
    return []
  }
}

const allMappedTransactions: Transaction[] = dummyTransactions.map(mapTransaction)
const initialTodayTransactions = allMappedTransactions.slice(0, 4)
const yesterdayTransactions = allMappedTransactions.slice(4)

const SIM_THRESHOLD = 5
const SIM_INTERVAL_MS = 1200

function TransactionCard({ tx, isNew }: { tx: Transaction; isNew?: boolean }) {
  return (
    <div className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 w-full shadow-sm${isNew ? ' animate-in fade-in slide-in-from-top-2 duration-300' : ''}`}>
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

function ConsentSheet({ onClose, onAccept, simCount, simTotal }: {
  onClose: () => void
  onAccept: () => void
  simCount: number
  simTotal: number
}) {
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
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
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
          We detected <span className="font-semibold text-[#0D2B6E]">{simCount} incoming payments</span> totalling{' '}
          <span className="font-semibold text-[#0D2B6E]">RM {simTotal.toFixed(2)}</span> that look like business activity.
        </p>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-4">
          Open a <span className="font-semibold text-[#0D2B6E]">TNG Business Account</span> to separate your business income, accept QR payments, and track your sales.
        </p>

        {/* Social proof stats */}
        <div className="bg-[#EEF2FB] rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#1A5FD5] shrink-0" />
            <span className="text-[#0D2B6E] text-[12px] font-bold uppercase tracking-wide">What merchants say</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { stat: '73%', desc: 'cleaner income separation' },
              { stat: '2.4×', desc: 'more likely BizCash-ready' },
              { stat: '68%', desc: 'more repeat customers' },
            ].map(({ stat, desc }) => (
              <div key={stat} className="bg-white rounded-xl px-2 py-3 flex flex-col items-center gap-1 text-center">
                <span className="text-[#1A5FD5] text-[22px] font-extrabold leading-none">{stat}</span>
                <span className="text-[11px] text-gray-500 leading-snug">{desc}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed mt-2.5">
            Based on similar TNG merchant journeys. This is not financial advice.
          </p>
        </div>

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

export default function HomePage() {
  const router = useRouter()
  const [showConsent, setShowConsent] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(false)

  const [balance, setBalance] = useState(103164.10)
  const [simCount, setSimCount] = useState(0)
  const [simTotal, setSimTotal] = useState(0)
  const [simRunning, setSimRunning] = useState(false)
  const [todayTxns, setTodayTxns] = useState<Transaction[]>(initialTodayTransactions)
  const [newTxnIds, setNewTxnIds] = useState<Set<string>>(new Set())
  const [detectionBannerVisible, setDetectionBannerVisible] = useState(false)

  // Use refs so the interval callback always reads fresh values
  const simCountRef = useRef(0)
  const simTotalRef = useRef(0)
  const simTransactionsRef = useRef<StoredHomeSimTransaction[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const onboarded = localStorage.getItem('igrow_onboarded') === 'true'
    setIsOnboarded(onboarded)
    if (!onboarded) {
      const keys = ['igrow_category', 'igrow_sell_mode', 'igrow_ssm', 'igrow_qr_generated']
      keys.forEach(k => localStorage.removeItem(k))
    }

    const savedTransactions = readStoredHomeSimTransactions()
    const savedCount = Number.parseInt(localStorage.getItem(HOME_SIM_COUNT_KEY) ?? String(savedTransactions.length), 10)
    const savedTotal = Number.parseFloat(localStorage.getItem(HOME_SIM_TOTAL_KEY) ?? '')
    const simCountValue = Number.isFinite(savedCount) ? Math.min(savedCount, SIM_THRESHOLD) : savedTransactions.length
    const simTotalValue = Number.isFinite(savedTotal)
      ? savedTotal
      : savedTransactions.reduce((acc, tx) => acc + tx.amount, 0)

    simCountRef.current = simCountValue
    simTotalRef.current = simTotalValue
    simTransactionsRef.current = savedTransactions
    setSimCount(simCountValue)
    setSimTotal(simTotalValue)
    setTodayTxns([...savedTransactions.map(mapStoredHomeSimTransaction), ...initialTodayTransactions])
    setBalance(103164.10 + simTotalValue)
    setDetectionBannerVisible(!onboarded && simCountValue >= SIM_THRESHOLD)
  }, [])

  // Clean up interval on unmount
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  function addOneSimTransaction() {
    const idx = simCountRef.current % simulationTransactions.length
    const txRaw = simulationTransactions[idx]
    const storedTx: StoredHomeSimTransaction = {
      id: `${txRaw.id}-${Date.now()}`,
      title: txRaw.title,
      time: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
      amount: txRaw.amount,
      categoryId: txRaw.category_id,
    }
    const newTx: Transaction = {
      id: storedTx.id,
      name: storedTx.title,
      time: storedTx.time,
      amount: `+RM ${storedTx.amount.toFixed(2)}`,
      credit: true,
      ...getIconForCategory(storedTx.categoryId, true),
    }

    setTodayTxns(prev => [newTx, ...prev])
    setNewTxnIds(prev => new Set([...prev, newTx.id as string]))
    setTimeout(() => {
      setNewTxnIds(prev => { const s = new Set(prev); s.delete(newTx.id as string); return s })
    }, 600)

    const nextCount = simCountRef.current + 1
    const nextTotal = simTotalRef.current + txRaw.amount
    simCountRef.current = nextCount
    simTotalRef.current = nextTotal
    simTransactionsRef.current = [storedTx, ...simTransactionsRef.current]
    setSimCount(nextCount)
    setSimTotal(nextTotal)
    setBalance(prev => prev + txRaw.amount)
    localStorage.setItem(HOME_SIM_COUNT_KEY, String(nextCount))
    localStorage.setItem(HOME_SIM_TOTAL_KEY, String(nextTotal))
    localStorage.setItem(HOME_SIM_TXNS_KEY, JSON.stringify(simTransactionsRef.current))

    if (nextCount >= SIM_THRESHOLD) {
      // Stop the interval
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      setSimRunning(false)
      setDetectionBannerVisible(true)
      setTimeout(() => setShowConsent(true), 1000)
    }
  }

  function handleStartSimulate() {
    if (isOnboarded || simRunning || simCount >= SIM_THRESHOLD) return
    setSimRunning(true)
    intervalRef.current = setInterval(addOneSimTransaction, SIM_INTERVAL_MS)
  }

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
            RM {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-blue-300 text-[13px] font-medium mt-0.5">
            Brisval
            {isOnboarded && (
              <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(110,231,183,0.2)', color: '#6EE7B7' }}>
                Business profile active · Building readiness
              </span>
            )}
          </span>

          {detectionBannerVisible && !isOnboarded && (
            <div
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold"
              style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#6EE7B7' }}
            >
              <span className="animate-pulse">●</span>
              {simCount} business payments detected · RM {simTotal.toFixed(2)} received
            </div>
          )}

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

      {/* Transaction history */}
      <div className="w-full max-w-lg mx-auto px-4 -mt-5 flex flex-col flex-1 pb-8 gap-5">

        {isOnboarded && (
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-white rounded-3xl shadow-md overflow-hidden text-left active:scale-[.98] transition-transform duration-150"
          >
            <div className="px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#1A5FD5,#0D2B6E)' }}>
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0D2B6E] text-[14px] font-bold leading-snug">Business Dashboard</p>
                <p className="text-[#6B7280] text-[12px] mt-0.5">Weekly sales · Peak hours · PDF reports</p>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 text-[#94a3b8]" />
            </div>
            <div className="flex border-t border-[#EEF2FB]">
              {[
                { label: 'This Week', value: 'RM 1,440' },
                { label: 'Transactions', value: '218' },
                { label: 'Best Day', value: 'Friday' },
              ].map((s, i) => (
                <div key={i} className={`flex-1 px-3 py-2.5 ${i > 0 ? 'border-l border-[#EEF2FB]' : ''}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">{s.label}</p>
                  <p className="text-[13px] font-bold text-[#0D2B6E] mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </button>
        )}

        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEF2FB]">
            <span className="text-[#0D2B6E] text-[15px] font-bold">Transaction History</span>
            <div className="flex items-center gap-2">
              {!isOnboarded && (
                <button
                  onClick={handleStartSimulate}
                  disabled={simRunning || simCount >= SIM_THRESHOLD}
                  className="rounded-full px-3 py-1 text-[12px] font-bold text-white bg-[#10B981] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  {simRunning ? (
                    <><span className="animate-pulse">●</span> Simulating…</>
                  ) : simCount >= SIM_THRESHOLD ? (
                    'Done ✓'
                  ) : (
                    '▶ Simulate'
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between px-1 py-1">
              <span className="text-[#1A5FD5] text-[13px] font-bold uppercase tracking-wide">Today</span>
              <span className="text-[#6B7280] text-[12px]">{todayTxns.length} transactions</span>
            </div>
            {todayTxns.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} isNew={newTxnIds.has(tx.id as string)} />
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

      {showConsent && (
        <ConsentSheet
          onClose={() => setShowConsent(false)}
          onAccept={handleAccept}
          simCount={simCount}
          simTotal={simTotal}
        />
      )}

      {/* Hidden demo reset — bottom-right corner */}
      <button
        onClick={() => {
          [
            'igrow_onboarded', 'igrow_category', 'igrow_sell_mode', 'igrow_ssm', 'igrow_qr_generated',
            'igrow_tier', 'igrow_package', 'igrow_dash_sim_count', 'igrow_launchpad_accepted',
            'igrow_sim_completed', 'igrow_ssm_nudge_shown', 'igrow_launchpad_nudge_shown',
            HOME_SIM_COUNT_KEY, HOME_SIM_TOTAL_KEY, HOME_SIM_TXNS_KEY,
          ].forEach(k => localStorage.removeItem(k))
          window.location.reload()
        }}
        className="fixed bottom-4 right-4 w-4 h-4 rounded-full opacity-5 hover:opacity-25 transition-opacity"
        style={{ backgroundColor: '#0D2B6E' }}
        aria-hidden="true"
      />
    </div>
  )
}
