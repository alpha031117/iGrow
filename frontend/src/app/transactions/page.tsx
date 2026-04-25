import { ArrowDownLeft, ArrowUpRight, Car, Dumbbell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Transaction = {
  id: number
  name: string
  time: string
  amount: string
  credit: boolean
  iconBg: string
  Icon: LucideIcon
  timeIcon?: LucideIcon
  timeIconColor?: string
}

const todayTransactions: Transaction[] = [
  {
    id: 1,
    name: 'Freelance Payment',
    time: '5:44 PM',
    amount: '+RM 850.00',
    credit: true,
    iconBg: '#10B981',
    Icon: ArrowDownLeft,
  },
  {
    id: 2,
    name: 'Petronas Station',
    time: '5:44 PM',
    amount: 'RM 120.00',
    credit: false,
    iconBg: '#1A1A2E',
    Icon: ArrowUpRight,
  },
  {
    id: 3,
    name: 'Netflix Subscription',
    time: '5:44 PM',
    amount: 'RM 54.90',
    credit: false,
    iconBg: '#4F46E5',
    Icon: ArrowUpRight,
  },
  {
    id: 4,
    name: 'iPhone 17 Purchase',
    time: '11:37 AM',
    amount: 'RM 1,020.00',
    credit: false,
    iconBg: '#4F46E5',
    Icon: ArrowUpRight,
  },
]

const yesterdayTransactions: Transaction[] = [
  {
    id: 5,
    name: 'Spotify Premium',
    time: '11:37 AM',
    amount: 'RM 14.99',
    credit: false,
    iconBg: '#4F46E5',
    Icon: ArrowUpRight,
    timeIcon: ArrowUpRight,
    timeIconColor: '#6B7280',
  },
  {
    id: 6,
    name: 'Grab Ride',
    time: '11:37 AM',
    amount: 'RM 25.50',
    credit: false,
    iconBg: '#1A1A2E',
    Icon: Car,
    timeIcon: ArrowUpRight,
    timeIconColor: '#6B7280',
  },
  {
    id: 7,
    name: 'Gym Membership',
    time: '11:37 AM',
    amount: 'RM 89.00',
    credit: false,
    iconBg: '#E5584F',
    Icon: Dumbbell,
    timeIcon: ArrowUpRight,
    timeIconColor: '#6B7280',
  },
  {
    id: 8,
    name: 'Salary Deposit',
    time: '09:00 AM',
    amount: '+RM 5,500.00',
    credit: true,
    iconBg: '#10B981',
    Icon: ArrowDownLeft,
    timeIcon: ArrowDownLeft,
    timeIconColor: '#10B981',
  },
]

function TodayCard({ tx }: { tx: Transaction }) {
  const Icon = tx.Icon
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-4 w-full">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: tx.iconBg }}
      >
        <Icon size={20} color="white" />
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[#1A1A2E] text-[14px] font-semibold leading-snug">
          {tx.name}
        </span>
        <span className="text-[#6B7280] text-[12px]">{tx.time}</span>
      </div>
      <span
        className="text-[14px] font-semibold shrink-0"
        style={{ color: tx.credit ? '#10B981' : '#1A1A2E' }}
      >
        {tx.amount}
      </span>
    </div>
  )
}

function YesterdayCard({ tx }: { tx: Transaction }) {
  const Icon = tx.Icon
  const TimeIcon = tx.timeIcon
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-4 w-full">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: tx.iconBg }}
      >
        <Icon size={18} color="white" />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-[#1A1A2E] text-[15px] font-semibold leading-snug">
          {tx.name}
        </span>
        <div className="flex items-center gap-1">
          {TimeIcon && (
            <TimeIcon size={12} color={tx.timeIconColor ?? '#6B7280'} />
          )}
          <span className="text-[#6B7280] text-[12px]">{tx.time}</span>
        </div>
      </div>
      <span
        className="text-[15px] font-semibold shrink-0"
        style={{ color: tx.credit ? '#10B981' : '#1A1A2E' }}
      >
        {tx.amount}
      </span>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <div
      className="min-h-screen bg-[#F8F9FC] flex flex-col"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between py-5">
          <button className="flex items-center gap-1 bg-[#10B981] text-white text-[14px] font-semibold px-3.5 py-2 rounded-full cursor-pointer">
            + Simulate
          </button>
          <span className="text-[#6B7280] text-[14px] font-medium">Brisval</span>
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-1 pb-6">
          <span className="text-[#6B7280] text-[13px] font-medium">Total Balance</span>
          <span className="text-[#1A1A2E] text-[32px] sm:text-[36px] font-bold leading-tight">
            RM 103,164.10
          </span>
        </div>

        {/* Transaction History Header */}
        <div className="flex items-center justify-between pb-4">
          <span className="text-[#1A1A2E] text-[16px] font-bold">Transaction History</span>
          <span className="text-[#6B7280] text-[13px] font-medium">8 items</span>
        </div>

        {/* Today Section */}
        <div className="flex flex-col gap-3 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-[#1A1A2E] text-[14px] font-bold">Today</span>
            <span className="text-[#6B7280] text-[13px] font-medium">4 Transactions</span>
          </div>
          {todayTransactions.map((tx) => (
            <TodayCard key={tx.id} tx={tx} />
          ))}
        </div>

        {/* Yesterday Section */}
        <div className="flex flex-col gap-3 pb-8">
          <div className="flex items-center justify-between">
            <span className="text-[#1A1A2E] text-[16px] font-semibold">Yesterday</span>
            <span className="text-[#6B7280] text-[13px]">4 Transactions</span>
          </div>
          {yesterdayTransactions.map((tx) => (
            <YesterdayCard key={tx.id} tx={tx} />
          ))}
        </div>
      </div>
    </div>
  )
}
