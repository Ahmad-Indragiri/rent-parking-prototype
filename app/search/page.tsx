'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, ChevronLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import ParkirCard from '@/public/components/ParkirCard'
import BottomNav from '@/public/components/BottomNav'

// Definisikan tipe data Lokasi
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

const suggestionChips = ['Mall', 'Dekat Kampus', '24 Jam', 'Murah'];

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Mengambil data lokasi & riwayat pencarian saat komponen dimuat
  useEffect(() => {
    fetch('/data/lokasi.json')
      .then((res) => res.json())
      .then((data) => setLokasiList(data))
      .catch((err) => console.error("Gagal memuat data lokasi:", err))

    const savedSearches = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    setRecentSearches(savedSearches);
  }, [])

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return lokasiList.filter(
      (lokasi) =>
        lokasi.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lokasi.alamat.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, lokasiList])

  // Fungsi untuk menyimpan pencarian baru
  const handleSaveSearch = (query: string) => {
    if (!query.trim()) return;

    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5); // Simpan 5 terakhir
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveSearch(searchQuery);
  }

  const handleSuggestionClick = (query: string) => {
      setSearchQuery(query);
      handleSaveSearch(query);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="flex items-center p-4 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-800">
            Cari Tempat Parkir
          </h1>
          <div className="w-7"></div>
        </header>

        <main className="p-4">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau alamat parkir..."
              className="w-full py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>

          {/* --- BAGIAN BARU: SARAN & RIWAYAT --- */}
          {!searchQuery && (
            <div className="animate-fade-in">
                <div className="mb-6">
                    <h2 className="font-bold text-gray-700 mb-2">Saran Pencarian</h2>
                    <div className="flex flex-wrap gap-2">
                        {suggestionChips.map(chip => (
                            <button key={chip} onClick={() => handleSuggestionClick(chip)} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full hover:bg-blue-200">
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
                {recentSearches.length > 0 && (
                    <div>
                        <h2 className="font-bold text-gray-700 mb-2">Pencarian Terakhir</h2>
                        <div className="space-y-2">
                            {recentSearches.map(term => (
                                <button key={term} onClick={() => setSearchQuery(term)} className="w-full flex items-center gap-2 text-gray-600 p-2 rounded-lg hover:bg-gray-100">
                                    <ArrowPathIcon className="w-4 h-4 text-gray-400"/> {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* --- AREA HASIL PENCARIAN --- */}
          {searchQuery && (
            <div className="space-y-4">
              {filteredResults.length > 0 && (
                <p className="text-sm text-gray-600">Menampilkan <strong>{filteredResults.length}</strong> hasil untuk <strong>{searchQuery}</strong></p>
              )}
              {filteredResults.map((lokasi) => (
                <div key={lokasi.id} className="animate-fade-in-up">
                  <ParkirCard lokasi={lokasi} />
                </div>
              ))}
              {filteredResults.length === 0 && (
                <div className="py-10 text-center animate-fade-in">
                  <p className="font-semibold text-gray-700">Tidak ada hasil ditemukan</p>
                  <p className="mt-1 text-sm text-gray-500">Coba gunakan kata kunci lain.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </>
  )
}