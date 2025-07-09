'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Bars3Icon, HomeIcon, ChartPieIcon, MapPinIcon, UserCircleIcon
} from '@heroicons/react/24/solid'

// Tipe data untuk Owner
type Owner = { name: string; locationManaged: string; };

// --- Komponen Header ---
const OwnerHeader = () => {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white">
            <button onClick={() => router.push('/owner/account')} className="p-1"><Bars3Icon className="w-6 h-6 text-gray-800" /></button>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <div className="w-7" />
        </header>
    )
};

// --- Komponen Navigasi Bawah (Diperbarui) ---
const OwnerBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname(); // Hook untuk mendapatkan path URL saat ini
    
    const navItems = [
        { href: '/owner/home', icon: HomeIcon, label: 'Home' },
        { href: '/owner/dashboard', icon: ChartPieIcon, label: 'Dashboard' },
        { href: '/owner/locations', icon: MapPinIcon, label: 'Locations' },
        { href: '/owner/account', icon: UserCircleIcon, label: 'Account' },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                {navItems.map(item => {
                    const isActive = pathname === item.href;
                    const activeClass = "text-blue-600";
                    const inactiveClass = "text-gray-500 hover:text-blue-600";
                    return (
                        <button key={item.label} onClick={() => router.push(item.href)} type="button" className="inline-flex flex-col items-center justify-center px-5 group">
                            <item.icon className={`w-6 h-6 mb-1 ${isActive ? activeClass : inactiveClass}`}/>
                            <span className={`text-sm ${isActive ? activeClass : inactiveClass}`}>{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
};


// Komponen lainnya tetap sama (FilterChips, BarChart, LineChart)
const FilterChips: React.FC<{ active: string, setActive: (filter: string) => void }> = ({ active, setActive }) => (
    <div className="flex bg-gray-100 rounded-full p-1 text-sm">
        {['Daily', 'Weekly', 'Monthly'].map(filter => (
            <button key={filter} onClick={() => setActive(filter)} className={`flex-1 py-1.5 rounded-full font-semibold transition ${active === filter ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
                {filter}
            </button>
        ))}
    </div>
);
const BarChart = () => { const data = [40, 60, 80, 50, 75, 65, 90]; return (<div className="h-28 flex items-end justify-between gap-2">{data.map((height, i) => (<div key={i} className="w-full bg-gray-200 rounded-t-md" style={{ height: `${height}%` }}></div>))}</div>); };
const LineChart = () => ( <div className="h-28"><svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none"><path d="M 0 60 L 50 40 L 100 70 L 150 50 L 200 80 L 250 60 L 300 75" fill="none" stroke="#4A5568" strokeWidth="2" /></svg></div>);


// --- Komponen Utama Halaman ---
export default function OwnerDashboardPage() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [revenueFilter, setRevenueFilter] = useState('Monthly');
  const [occupancyFilter, setOccupancyFilter] = useState('Monthly');

  useEffect(() => {
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login');
      return;
    }
    const ownerData = localStorage.getItem('ownerData');
    if (ownerData) {
      setOwner(JSON.parse(ownerData));
    }
  }, [router]);

  if (!owner) return <div className="p-4 text-center">Loading Dashboard...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 h-1.5 w-full"></div>
      <OwnerHeader />
      <main className="p-4 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">Revenue</h2>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <FilterChips active={revenueFilter} setActive={setRevenueFilter} />
            <div className="mt-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <div className="flex items-baseline gap-2"><p className="text-3xl font-bold">$12,500</p><p className="text-sm font-semibold text-green-500">+15%</p></div>
              <p className="text-xs text-gray-400">This Month</p>
            </div>
            <div className="mt-4"><BarChart /></div>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-3">Occupancy</h2>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <FilterChips active={occupancyFilter} setActive={setOccupancyFilter} />
            <div className="mt-4">
              <p className="text-sm text-gray-500">Occupancy Rate</p>
              <div className="flex items-baseline gap-2"><p className="text-3xl font-bold">85%</p><p className="text-sm font-semibold text-red-500">-5%</p></div>
              <p className="text-xs text-gray-400">This Month</p>
            </div>
            <div className="mt-4"><LineChart /></div>
          </div>
        </section>
      </main>
      <OwnerBottomNav />
    </div>
  );
}