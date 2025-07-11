'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import ParkirCard from '@/public/components/ParkirCard'
import BottomNav from '@/public/components/BottomNav'

// Definisikan tipe data Lokasi (bisa diimpor dari file terpisah jika ada)
type Lokasi = {
  id: number
  nama: string
  alamat: string
  tarif: number
  slot_tersedia: number
  total_slot: number
  rating: number
  gambar: string
}

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([])
  
  // Ambil semua data lokasi saat komponen pertama kali dimuat
  useEffect(() => {
    fetch('/data/lokasi.json')
      .then((res) => res.json())
      .then((data) => setLokasiList(data))
      .catch((err) => console.error("Gagal memuat data lokasi:", err))
  }, [])

  // Gunakan useMemo untuk memfilter hasil agar lebih efisien.
  // Logika filter hanya berjalan saat `searchQuery` atau `lokasiList` berubah.
  const filteredResults = useMemo(() => {
    if (!searchQuery) {
      return [] // Jangan tampilkan apa-apa jika query kosong
    }
    return lokasiList.filter(
      (lokasi) =>
        lokasi.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lokasi.alamat.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, lokasiList])

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <header className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-800">
            Cari Tempat Parkir
          </h1>
          <div className="w-7"></div> {/* Placeholder untuk menyeimbangkan header */}
        </header>

        {/* Main Content */}
        <main className="p-4">
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau alamat parkir..."
              className="w-full py-3 pl-12 pr-4 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Results Area */}
          <div className="space-y-4">
            {searchQuery && filteredResults.length > 0 && (
                <p className="text-sm text-gray-600">
                    Menampilkan <strong>{filteredResults.length}</strong> hasil untuk <strong>{searchQuery}</strong>
                </p>
            )}

            {filteredResults.map((lokasi) => (
              <ParkirCard key={lokasi.id} lokasi={lokasi} />
            ))}

            {/* Pesan jika tidak ada hasil */}
            {searchQuery && filteredResults.length === 0 && (
              <div className="py-10 text-center">
                <p className="font-semibold text-gray-700">Tidak ada hasil ditemukan</p>
                <p className="mt-1 text-sm text-gray-500">
                  Coba gunakan kata kunci lain.
                </p>
              </div>
            )}

            {/* Pesan awal sebelum mencari */}
            {!searchQuery && (
              <div className="py-10 text-center">
                <p className="font-semibold text-gray-700">Mulai mencari lokasi parkir</p>
                <p className="mt-1 text-sm text-gray-500">
                  Ketik nama atau alamat di kolom pencarian di atas.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Navigasi Bawah dengan state aktif */}
      <BottomNav />
    </>
  )
}