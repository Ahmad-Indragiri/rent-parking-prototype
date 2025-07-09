'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { HomeIcon, ChartPieIcon, MapPinIcon, UserCircleIcon, ChevronLeftIcon } from '@heroicons/react/24/solid' // Impor ikon header

// Tipe data (sebaiknya ditaruh di file terpusat)
type Lokasi = { id: number; nama: string; alamat: string; tarif: number; total_slot: number; };

// --- Komponen Navigasi ---
// Header dibuat lebih lengkap dengan tombol kembali
const OwnerHeader = () => {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
            <button onClick={() => router.back()} className="p-1">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
                My Location
            </h1>
            <div className="w-7" />
        </header>
    )
};

// Navigasi Bawah yang sudah dinamis
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


export default function OwnerLocationsPage() {
  const router = useRouter();
  // State 'owner' dihapus karena tidak digunakan
  const [myLocation, setMyLocation] = useState<Lokasi | null>(null);

  useEffect(() => {
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login');
      return;
    }
    
    const ownerData = JSON.parse(localStorage.getItem('ownerData') || '{}');
    const allLocations: Lokasi[] = JSON.parse(localStorage.getItem('parking_locations') || '[]');
        
    const location = allLocations.find(loc => loc.nama === ownerData.locationManaged);
    if (location) {
      setMyLocation(location);
    }
  }, [router]);

  if (!myLocation) return <div className="p-4 text-center">Loading location data...</div>

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 h-1.5 w-full"></div>
      <OwnerHeader />

      <main className="p-6">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">{myLocation.nama}</h2>
            <p className="text-gray-500 mt-1">{myLocation.alamat}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500">Tarif per Jam</p>
                    <p className="text-xl font-bold">Rp{myLocation.tarif.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500">Total Slot</p>
                    <p className="text-xl font-bold">{myLocation.total_slot}</p>
                </div>
            </div>
            
            <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Edit Location Details
            </button>
        </div>
      </main>
      
      <OwnerBottomNav />
    </div>
  )
}