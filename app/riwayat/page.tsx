'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNav from '@/public/components/BottomNav'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

// Menggunakan 'tarif' agar konsisten dengan data yang disimpan
type Reservasi = {
  id: number;
  nama_lokasi: string;
  alamat: string;
  tarif: number; // Diubah dari 'harga' menjadi 'tarif'
  gambar: string;
  status: 'upcoming' | 'past';
};

// Data dummy disesuaikan menggunakan 'tarif'
const dummyReservations: Reservasi[] = [
  { id: 1, nama_lokasi: 'Parkir Mall A', alamat: 'Jl. Merdeka No.10', tarif: 5000, gambar: 'https://images.unsplash.com/photo-1543356983-33a7b441da23?w=300', status: 'upcoming' },
  { id: 2, nama_lokasi: 'Parkir Kampus B', alamat: 'Mertoyudan', tarif: 5000, gambar: 'https://images.unsplash.com/photo-1506521781263-d5449e820979?w=300', status: 'past' },
  { id: 3, nama_lokasi: 'Parkir Mall A', alamat: 'Jl. Merdeka No.10', tarif: 5000, gambar: 'https://images.unsplash.com/photo-1588117367383-af72591512a8?w=300', status: 'past' },
  { id: 4, nama_lokasi: 'Parkir Kampus B', alamat: 'Mertoyudan', tarif: 5000, gambar: 'https://images.unsplash.com/photo-1590674899484-d5640e854c4a?w=300', status: 'upcoming' },
];

// Komponen item dibuat lebih aman
const ReservationItem: React.FC<{ reservasi: Reservasi }> = ({ reservasi }) => (
  <div className="flex items-center space-x-4 py-3">
    <Image
      src={reservasi.gambar || '/images/placeholder.png'} // gunakan gambar fallback jika kosong
      alt={reservasi.nama_lokasi}
      width={64}
      height={64}
      className="rounded-lg object-cover w-16 h-16"
    />

    <div className="flex-grow">
      <p className="font-semibold text-gray-800">{reservasi.nama_lokasi}</p>
      <p className="text-sm text-gray-500">{reservasi.alamat}</p>
    </div>
    {/* Menampilkan tarif dan aman dari error jika data tidak ada */}
    <p className="font-semibold text-gray-800">
      Rp{reservasi.tarif?.toLocaleString() ?? '0'}
    </p>
  </div>
);


// --- KOMPONEN UTAMA ---
export default function RiwayatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('reservasi_list')) {
      localStorage.setItem('reservasi_list', JSON.stringify(dummyReservations));
    }
    const data = localStorage.getItem('reservasi_list');
    if (data) {
      setReservasiList(JSON.parse(data));
    }
  }, []);

  const filteredList = useMemo(() => {
    return reservasiList.filter((item) => item && item.status === activeTab);
  }, [reservasiList, activeTab]);

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        <header className="flex items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-800">
            Reservations
          </h1>
          <div className="w-7" />
        </header>

        <nav className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 text-center font-semibold transition-all duration-200 ${activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 text-center font-semibold transition-all duration-200 ${activeTab === 'past'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500'
              }`}
          >
            Past
          </button>
        </nav>

        <main className="px-4">
          {filteredList.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {/* Filter data tidak valid sebelum di-map untuk mencegah error */}
              {filteredList.filter(Boolean).map((reservasi, index) => (
                <ReservationItem key={`${reservasi.id}-${reservasi.status}-${index}`} reservasi={reservasi} />
              ))}

            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600">
                Tidak ada reservasi dalam kategori {activeTab}.
              </p>
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </>
  );
}