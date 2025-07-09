'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon, ChartPieIcon, MapPinIcon, UserCircleIcon,
  ArrowDownOnSquareIcon, CameraIcon, TicketIcon, ClockIcon
} from '@heroicons/react/24/solid'

// --- Komponen Navigasi ---
const OwnerHeader = () => {
    // Variabel router yang tidak terpakai dihapus
    return (
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white">
            <h1 className="text-xl font-bold text-gray-900">Home</h1>
            <div className="w-7" />
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

// Tipe data
type Reservasi = { nama_lokasi: string; user: { kendaraan: string }; waktu_mulai: string; status: 'upcoming' | 'past' | 'active' };
type Lokasi = { nama: string, total_slot: number };

export default function OwnerHomePage() {
  const router = useRouter();
  // State 'owner' dihapus karena tidak digunakan
  const [liveStats, setLiveStats] = useState({ parked: 0, available: 0 });
  const [activityFeed, setActivityFeed] = useState<Reservasi[]>([]);

  useEffect(() => {
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login');
      return;
    }

    const ownerData = JSON.parse(localStorage.getItem('ownerData') || '{}');
    const allLocations: Lokasi[] = JSON.parse(localStorage.getItem('parking_locations') || '[]');
    const allReservations: Reservasi[] = JSON.parse(localStorage.getItem('reservasi_list') || '[]');
    
    if (ownerData.locationManaged) {
        const myLocation = allLocations.find(loc => loc.nama === ownerData.locationManaged);
        const myReservations = allReservations.filter(res => res.nama_lokasi === ownerData.locationManaged);
        
        const currentlyParked = myReservations.filter(res => res.status === 'active' || res.status === 'upcoming').length;
        
        setLiveStats({
            parked: currentlyParked,
            available: myLocation ? myLocation.total_slot - currentlyParked : 0,
        });

        setActivityFeed(myReservations.slice(-5).reverse());
    }
  }, [router]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 h-1.5 w-full"></div>
      <OwnerHeader />

      <main className="p-4 space-y-6">
        {/* Live Stats */}
        <section className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border">
                <p className="text-sm text-gray-500">Currently Parked</p>
                <p className="text-3xl font-bold">{liveStats.parked}</p>
            </div>
             <div className="p-4 bg-white rounded-xl border">
                <p className="text-sm text-gray-500">Available Spots</p>
                <p className="text-3xl font-bold">{liveStats.available}</p>
            </div>
        </section>

        {/* Quick Actions */}
        <section>
             <h2 className="text-lg font-bold mb-3 text-gray-700">Quick Actions</h2>
             <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-white rounded-xl border text-left font-semibold text-gray-700 hover:bg-gray-100">
                    <ArrowDownOnSquareIcon className="w-7 h-7 text-blue-600 mb-2"/> Manual Check-in
                </button>
                 <button className="p-4 bg-white rounded-xl border text-left font-semibold text-gray-700 hover:bg-gray-100">
                    <CameraIcon className="w-7 h-7 text-blue-600 mb-2"/> View Live Camera
                </button>
             </div>
        </section>

        {/* Activity Feed */}
        <section>
            <h2 className="text-lg font-bold mb-3 text-gray-700">Recent Activity</h2>
            <div className="space-y-3">
                {activityFeed.length > 0 ? activityFeed.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <TicketIcon className="w-6 h-6 text-blue-600"/>
                        </div>
                        <div>
                            <p className="font-semibold">
                                {item.user.kendaraan || 'N/A'} checked in
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <ClockIcon className="w-4 h-4"/> 
                                {new Date(item.waktu_mulai).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-4">No recent activity.</p>
                )}
            </div>
        </section>
      </main>

      <OwnerBottomNav />
    </div>
  )
}