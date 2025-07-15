'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
   ArrowUpRightIcon, ArrowDownRightIcon
} from '@heroicons/react/24/solid'

import OwnerHeader from '../components/OwnerHeader'
import OwnerBottomNav from '../components/OwnerBottomNav'

// --- Tipe Data ---
type Owner = {
  nama: string
  email: string
}

// --- Komponen UI Tambahan ---

const FilterChips: React.FC<{ active: string, setActive: (filter: string) => void }> = ({ active, setActive }) => (
  <div className="flex bg-gray-100 rounded-full p-1 text-sm">
    {['Harian', 'Mingguan', 'Bulanan'].map(filter => (
      <button
        key={filter}
        onClick={() => setActive(filter)}
        className={`flex-1 py-1.5 rounded-full font-semibold transition ${active === filter ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
      >
        {filter}
      </button>
    ))}
  </div>
)

const StatCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <div className="flex items-center text-xs mt-1">
      <span className={`flex items-center gap-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
        {changeType === 'increase' ? <ArrowUpRightIcon className="w-3 h-3" /> : <ArrowDownRightIcon className="w-3 h-3" />}
        {change}
      </span>
      <span className="text-gray-400 ml-1">vs kemarin</span>
    </div>
  </div>
)

const BarChart = () => {
  const data = [
    { month: 'Jan', value: 40 }, { month: 'Feb', value: 60 }, { month: 'Mar', value: 80 },
    { month: 'Apr', value: 50 }, { month: 'Mei', value: 75 }, { month: 'Jun', value: 65 }, { month: 'Jul', value: 90 }
  ]
  return (
    <div className="h-32 flex items-end justify-between gap-2 border-t pt-4 mt-4">
      {data.map(({ month, value }) => (
        <div key={month} className="w-full flex flex-col items-center gap-1">
          <div className="w-full bg-blue-100 hover:bg-blue-300 transition-colors rounded-t-md" style={{ height: `${value}%` }}></div>
          <span className="text-xs text-gray-500 font-medium">{month}</span>
        </div>
      ))}
    </div>
  )
}

const LineChart = () => (
  <div className="h-32 relative border-t pt-4 mt-4">
    <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(59, 130, 246, 0.2)' }} />
          <stop offset="100%" style={{ stopColor: 'rgba(59, 130, 246, 0)' }} />
        </linearGradient>
      </defs>
      <path d="M 0 60 L 50 40 L 100 70 L 150 50 L 200 80 L 250 60 L 300 75" fill="url(#lineGradient)" />
      <path d="M 0 60 L 50 40 L 100 70 L 150 50 L 200 80 L 250 60 L 300 75" fill="none" stroke="#3B82F6" strokeWidth="3" />
    </svg>
  </div>
)


// --- KOMPONEN UTAMA ---
export default function OwnerDashboardPage() {
  const router = useRouter()
  const [owner, setOwner] = useState<Owner | null>(null)
  const [revenueFilter, setRevenueFilter] = useState('Bulanan')
  const [occupancyFilter, setOccupancyFilter] = useState('Bulanan')

  useEffect(() => {
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login')
      return
    }

    const session = localStorage.getItem('owner_session_data')
    if (session) {
      const parsed = JSON.parse(session)
      setOwner(parsed.owner)
    } else {
      router.replace('/owner/login')
    }
  }, [router])

  if (!owner) return <div className="p-4 text-center">Memuat Dashboard...</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 h-1.5 w-full" />
      <OwnerHeader title="Dashboard" />
      <main className="p-4 space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-800">Selamat Datang, {owner.nama}!</h2>
          <p className="text-gray-500">Berikut adalah ringkasan performa properti Anda.</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Booking Hari Ini" value="24" change="+5" changeType="increase" />
          <StatCard title="Sedang Parkir" value="18" change="-2" changeType="decrease" />
        </div>

        <section className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Pendapatan</h3>
            <div className="w-40">
              <FilterChips active={revenueFilter} setActive={setRevenueFilter} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Total Pendapatan (Bulan Ini)</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">Rp12.500.000</p>
              <p className="text-sm font-semibold text-green-500">+15%</p>
            </div>
          </div>
          <BarChart />
        </section>

        <section className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Tingkat Keterisian</h3>
            <div className="w-40">
              <FilterChips active={occupancyFilter} setActive={setOccupancyFilter} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Rata-rata Okupansi (Bulan Ini)</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">85%</p>
              <p className="text-sm font-semibold text-red-500">-5%</p>
            </div>
          </div>
          <LineChart />
        </section>
      </main>
      <OwnerBottomNav />
    </div>
  )
}
