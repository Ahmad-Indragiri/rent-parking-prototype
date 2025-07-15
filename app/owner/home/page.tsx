'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OwnerHeader from '../components/OwnerHeader'
import OwnerBottomNav from '../components/OwnerBottomNav'
import {
  ArrowDownOnSquareIcon, CameraIcon, TicketIcon, ClockIcon,
  UsersIcon, ArrowUpRightIcon, ArrowDownRightIcon,
  MapPinIcon // <-- Ikon ditambahkan di sini
} from '@heroicons/react/24/solid'

// --- Tipe Data ---
type Owner = { 
    nama: string; 
};
type Reservasi = { 
    nama_lokasi: string; 
    user: { kendaraan: string }; 
    waktu_mulai: string; 
    status: 'upcoming' | 'past' | 'active' 
};
type Lokasi = { 
    nama: string, 
    total_slot: number 
};

// --- Komponen-komponen UI Baru ---

// Kartu Statistik yang lebih baik
const LiveStatCard: React.FC<{ title: string; value: number; icon: React.ElementType; change: number }> = ({ title, value, icon: Icon, change }) => {
    const isIncrease = change >= 0;
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isIncrease ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Icon className={`w-6 h-6 ${isIncrease ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <p className="font-semibold text-gray-600">{title}</p>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-3">{value}</p>
            <div className="flex items-center text-xs mt-1">
                <span className={`flex items-center gap-1 ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncrease ? <ArrowUpRightIcon className="w-3 h-3"/> : <ArrowDownRightIcon className="w-3 h-3"/>}
                    {Math.abs(change)} hari ini
                </span>
            </div>
        </div>
    );
};

// Tombol Aksi Cepat yang lebih baik
const QuickActionButton: React.FC<{ title: string; icon: React.ElementType }> = ({ title, icon: Icon }) => (
    <button className="p-4 bg-white rounded-2xl border text-left font-semibold text-gray-700 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 shadow-sm">
        <Icon className="w-8 h-8 text-blue-600 mb-2"/> 
        <span>{title}</span>
    </button>
);


// --- Komponen Utama Halaman ---
export default function OwnerHomePage() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [liveStats, setLiveStats] = useState({ parked: 0, available: 0 });
  const [activityFeed, setActivityFeed] = useState<Reservasi[]>([]);

  useEffect(() => {
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login');
      return;
    }

    const ownerSessionData = JSON.parse(localStorage.getItem('owner_session_data') || '{}');
    const allLocations: Lokasi[] = JSON.parse(localStorage.getItem('parking_locations') || '[]');
    const allReservations: Reservasi[] = JSON.parse(localStorage.getItem('reservasi_list') || '[]');
    
    setOwner(ownerSessionData.owner);
    
    if (ownerSessionData.nama_lokasi) {
        const myLocation = allLocations.find(loc => loc.nama === ownerSessionData.nama_lokasi);
        const myReservations = allReservations.filter(res => res.nama_lokasi === ownerSessionData.nama_lokasi);
        
        const currentlyParked = myReservations.filter(res => res.status === 'active' || res.status === 'upcoming').length;
        
        setLiveStats({
            parked: currentlyParked,
            available: myLocation ? myLocation.total_slot - currentlyParked : 0,
        });

        setActivityFeed(myReservations.slice(-5).reverse());
    }
  }, [router]);

  if (!owner) {
      return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-600 h-1.5 w-full"></div>
      <OwnerHeader title="Beranda" />

      <main className="p-4 md:p-6 space-y-8">
        <section>
            <h2 className="text-2xl font-bold text-gray-800">Halo, {owner.nama}!</h2>
            <p className="text-gray-500">Berikut adalah kondisi terkini di lokasi Anda.</p>
        </section>

        {/* Live Stats yang Diperbarui */}
        <section className="grid grid-cols-2 gap-4">
            <LiveStatCard title="Sedang Parkir" value={liveStats.parked} icon={UsersIcon} change={-2}/>
            <LiveStatCard title="Slot Tersedia" value={liveStats.available} icon={MapPinIcon} change={+5}/>
        </section>

        {/* Quick Actions yang Diperbarui */}
        <section>
             <h3 className="text-lg font-bold mb-3 text-gray-700">Aksi Cepat</h3>
             <div className="grid grid-cols-2 gap-4">
                <QuickActionButton title="Check-in Manual" icon={ArrowDownOnSquareIcon}/>
                <QuickActionButton title="Lihat Kamera CCTV" icon={CameraIcon}/>
             </div>
        </section>

        {/* Activity Feed yang Diperbarui */}
        <section>
            <h3 className="text-lg font-bold mb-3 text-gray-700">Aktivitas Terbaru</h3>
            <div className="space-y-3">
                {activityFeed.length > 0 ? activityFeed.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <TicketIcon className="w-6 h-6 text-blue-600"/>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">
                                {item.user.kendaraan || 'Kendaraan'} check-in
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <ClockIcon className="w-4 h-4"/> 
                                {new Date(item.waktu_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 bg-white rounded-xl border">
                        <p className="text-gray-500">Belum ada aktivitas terbaru.</p>
                    </div>
                )}
            </div>
        </section>
      </main>

      <OwnerBottomNav />
    </div>
  )
}
