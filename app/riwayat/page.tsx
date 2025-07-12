'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNav from '@/public/components/BottomNav'
import { ChevronLeftIcon, CalendarDaysIcon, TrashIcon } from '@heroicons/react/24/outline' // Impor ikon hapus

type Reservasi = {
  id: number;
  nama_lokasi: string;
  alamat: string;
  tarif: number;
  gambar: string;
  status: 'upcoming' | 'past';
  waktu_mulai: string;
};

const dummyReservations: Reservasi[] = [
  { id: 1, nama_lokasi: 'Parkir Mall A', alamat: 'Jl. Merdeka No.10', tarif: 5000, gambar: 'https://images.unsplash.com/photo-1543356983-33a7b441da23?w=300', status: 'upcoming', waktu_mulai: '2025-07-13T10:00:00Z' },
  { id: 2, nama_lokasi: 'Parkir Kampus B', alamat: 'Mertoyudan', tarif: 5000, gambar: 'https://images.unsplash.com/photo-1506521781263-d5449e820979?w=300', status: 'past', waktu_mulai: '2025-07-11T14:30:00Z' },
];

// --- Komponen ReservationItem Diperbarui ---
const ReservationItem: React.FC<{ 
  reservasi: Reservasi;
  onClick: () => void;
  onDelete: () => void;
}> = ({ reservasi, onClick, onDelete }) => {
  const formattedDate = new Date(reservasi.waktu_mulai).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah navigasi saat tombol hapus diklik
    onDelete();
  };

  return (
    <div onClick={onClick} className="flex items-start space-x-4 py-4 text-left w-full hover:bg-gray-50 transition cursor-pointer">
      <Image
        src={reservasi.gambar || '/placeholder.png'}
        alt={reservasi.nama_lokasi}
        width={64} height={64}
        className="rounded-lg object-cover w-16 h-16 flex-shrink-0"
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{reservasi.nama_lokasi}</p>
        <p className="text-sm text-gray-500">{reservasi.alamat}</p>
        <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
            <CalendarDaysIcon className="w-4 h-4" />
            <p className="font-medium">{formattedDate}</p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full min-h-[64px]">
        <p className="font-semibold text-gray-800 flex-shrink-0">
          Rp{reservasi.tarif?.toLocaleString() ?? '0'}
        </p>
        {/* Tombol hapus hanya muncul jika status 'past' */}
        {reservasi.status === 'past' && (
            <button onClick={handleDeleteClick} className="p-1 text-gray-400 hover:text-red-500">
                <TrashIcon className="w-5 h-5"/>
            </button>
        )}
      </div>
    </div>
  )
};

export default function RiwayatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);

  useEffect(() => {
    const savedList = localStorage.getItem('reservasi_list');
    if (savedList) {
      const parsedData = JSON.parse(savedList) as Reservasi[];
      const listWithDate = parsedData.map((item) => ({...item, waktu_mulai: item.waktu_mulai || new Date().toISOString()}));
      setReservasiList(listWithDate);
    } else {
      localStorage.setItem('reservasi_list', JSON.stringify(dummyReservations));
      setReservasiList(dummyReservations);
    }
  }, []);

  const filteredList = useMemo(() => {
    return reservasiList.filter((item) => item && item.status === activeTab);
  }, [reservasiList, activeTab]);

  const handleViewMonitoring = (reservasi: Reservasi) => {
    localStorage.setItem('monitoring_ticket', JSON.stringify(reservasi));
    router.push(`/monitoring/${reservasi.id}`);
  };

  // --- FUNGSI BARU UNTUK HAPUS RIWAYAT ---
  const handleDeleteReservation = (id: number) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus riwayat ini? Aksi ini tidak bisa dibatalkan.')) {
        const newList = reservasiList.filter(res => res.id !== id);
        setReservasiList(newList);
        localStorage.setItem('reservasi_list', JSON.stringify(newList));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        <header className="flex items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <button onClick={() => router.back()} className="p-1"><ChevronLeftIcon className="w-6 h-6 text-gray-700" /></button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-800">Reservasi</h1>
          <div className="w-7" />
        </header>

        <nav className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('upcoming')} className={`flex-1 py-3 text-center font-semibold transition-all duration-200 ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
            Mendatang
          </button>
          <button onClick={() => setActiveTab('past')} className={`flex-1 py-3 text-center font-semibold transition-all duration-200 ${activeTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
            Lampau
          </button>
        </nav>

        <main className="px-4">
          {filteredList.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {/* --- Logika Tampilan Diperbarui --- */}
              {filteredList.filter(Boolean).map((reservasi, index) => (
                <ReservationItem 
                  key={`${reservasi.id}-${index}`}
                  reservasi={reservasi}
                  onClick={() => handleViewMonitoring(reservasi)}
                  onDelete={() => handleDeleteReservation(reservasi.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20"><p className="text-gray-600">Tidak ada reservasi dalam kategori {activeTab}.</p></div>
          )}
        </main>
      </div>
      <BottomNav />
    </>
  );
}