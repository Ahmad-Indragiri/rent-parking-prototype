'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // 'useParams' dihapus dari sini
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

// Data dummy untuk spot yang sudah terisi.
const takenSpots = ['A3', 'B1', 'C4', 'D2'];

export default function BookSpotPage() {
  const router = useRouter();
  // const params = useParams(); // <-- BARIS INI DIHAPUS
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [lokasiNama, setLokasiNama] = useState('');

  // Membuat daftar slot parkir untuk ditampilkan
  const parkingSpots = Array.from({ length: 20 }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 5)); // A, B, C, D
    const num = (i % 5) + 1;
    return `${row}${num}`;
  });

  useEffect(() => {
    // Ambil nama lokasi dari reservasi sementara untuk ditampilkan
    const pendingData = localStorage.getItem('pending_reservasi');
    if (pendingData) {
      const parsedData = JSON.parse(pendingData);
      setLokasiNama(parsedData.nama_lokasi);
    }
  }, []);

  const handleConfirmSpot = () => {
    if (!selectedSpot) {
      alert('Silakan pilih slot parkir terlebih dahulu.');
      return;
    }

    const pendingData = localStorage.getItem('pending_reservasi');
    if (!pendingData) {
      alert('Sesi reservasi tidak ditemukan. Silakan ulangi.');
      router.push('/dashboard');
      return;
    }
    const reservasi = JSON.parse(pendingData);

    reservasi.spot_terpilih = selectedSpot;
    
    localStorage.setItem('pending_reservasi', JSON.stringify(reservasi));

    router.push('/payment');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
        Pesan tempat
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6 pb-28">
        <p className="text-center text-gray-600 mb-4">
          Pilih spot yang tersedia di <span className="font-bold">{lokasiNama}</span>
        </p>

        {/* Denah Parkir (Simulasi) */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="grid grid-cols-5 gap-3">
            {parkingSpots.map((spot) => {
              const isTaken = takenSpots.includes(spot);
              const isSelected = selectedSpot === spot;

              return (
                <button
                  key={spot}
                  disabled={isTaken}
                  onClick={() => setSelectedSpot(spot)}
                  className={`py-3 text-sm font-bold rounded-md transition ${
                    isTaken
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : 'bg-white text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {spot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 border-t border-gray-200 text-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white border"></div><span>Tersedia</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-600"></div><span>Terpilih</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-300"></div><span>Sudah ditempati</span></div>
            </div>
        </div>

      </main>

      {/* Tombol Fixed di Bawah */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-10">
        <button
          onClick={handleConfirmSpot}
          disabled={!selectedSpot}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {selectedSpot ? `Lanjutkan ke Pembayaran` : 'Book a spot'}
        </button>
      </div>
    </div>
  );
}