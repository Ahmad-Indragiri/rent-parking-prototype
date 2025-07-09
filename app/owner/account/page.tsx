'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon, ChartPieIcon, MapPinIcon, UserCircleIcon,
  BuildingStorefrontIcon, WalletIcon, ArrowRightOnRectangleIcon
} from '@heroicons/react/24/solid'

// --- Komponen Navigasi (Bisa dipindah ke file terpisah) ---
const OwnerHeader = () => {
  // Baris `const router = useRouter()` yang tidak perlu sudah dihapus.
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white">
        <h1 className="flex-grow text-center text-xl font-bold text-gray-900">Account</h1>
    </header>
  )
};

const OwnerBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
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


// Tipe data untuk Owner
type Owner = { name: string; email: string; locationManaged: string; };

export default function OwnerAccountPage() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);

  useEffect(() => {
    // Perlindungan Rute
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login');
      return;
    }
    const ownerData = localStorage.getItem('ownerData');
    if (ownerData) {
      setOwner(JSON.parse(ownerData));
    }
  }, [router]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('isOwnerLoggedIn');
        localStorage.removeItem('ownerData');
        router.push('/owner/login');
    }
  };

  if (!owner) return <div className="p-4 text-center">Loading account...</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
        <div className="bg-blue-600 h-1.5 w-full"></div>
        <OwnerHeader />

        <main className="p-4 space-y-6">
            {/* Profile Card */}
            <section className="p-6 bg-white rounded-xl border text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <UserCircleIcon className="w-16 h-16 text-gray-400"/>
                </div>
                <h2 className="text-2xl font-bold">{owner.name}</h2>
                <p className="text-gray-500">{owner.email}</p>
                 <button className="mt-2 text-sm font-semibold text-blue-600 hover:underline">
                    Edit Profile
                </button>
            </section>

            {/* Menu Section */}
            <section className="bg-white rounded-xl border divide-y">
                <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <BuildingStorefrontIcon className="w-6 h-6 text-gray-500"/>
                        <div>
                            <p className="text-sm text-gray-500">Managed Location</p>
                            <p className="font-semibold">{owner.locationManaged}</p>
                        </div>
                    </div>
                    <a href="/owner/locations" className="text-sm font-semibold text-blue-600">View</a>
                </div>

                 <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <WalletIcon className="w-6 h-6 text-gray-500"/>
                        <div>
                            <p className="text-sm text-gray-500">Payout Details</p>
                            <p className="font-semibold">Bank Account **** 4321</p>
                        </div>
                    </div>
                    <button className="text-sm font-semibold text-blue-600">Manage</button>
                </div>
            </section>
            
            {/* Logout Button */}
            <section>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-white border rounded-xl text-red-500 font-bold hover:bg-red-50"
                >
                    <ArrowRightOnRectangleIcon className="w-6 h-6"/>
                    Log Out
                </button>
            </section>
        </main>

        <OwnerBottomNav />
    </div>
  )
}