'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ParkirCard from '@/public/components/ParkirCard'
import ChatbotFAQ from '@/public/components/ChatbotFAQ'
import BottomNav from '@/public/components/BottomNav'
import { BellIcon, MagnifyingGlassIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import { StarIcon, UserCircleIcon } from '@heroicons/react/24/solid'

// --- Tipe Data ---
type Lokasi = { 
  id: number; 
  nama: string; 
  alamat: string; 
  tarif: number; 
  slot_tersedia: number; 
  total_slot: number; 
  rating: number; 
  gambar: string; 
}

type Ulasan = {
  id_lokasi: number
  username: string
  rating: number
  komentar: string
  tanggal: string
}

type Promotion = {
  id: number;
  title: string;
  description: string;
  image: string;
  kode: string;
};

const dummyPromotions: Promotion[] = [
  { id: 1, title: 'Early Bird Special', description: 'Parkir sebelum jam 9 pagi diskon 50%', image: '/50.jpeg', kode: 'PROMO10' },
  { id: 2, title: 'Weekend Discount', description: 'Nikmati diskon akhir pekan 15%', image: '/15.jpg', kode: 'DISKON10K' },
  { id: 3, title: 'First Time User', description: 'Diskon Pengguna Baru!', image: '/new.png', kode: 'PROMO10' },
]

export default function Dashboard() {
  const router = useRouter()
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([])
  const [ulasanList, setUlasanList] = useState<Ulasan[]>([])
  const [activeFilter, setActiveFilter] = useState('Promotions')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [komentar, setKomentar] = useState('')
  const [rating, setRating] = useState(5)
  const [selectedLokasiId, setSelectedLokasiId] = useState<number | null>(null)

  const MapView = dynamic(() => import('@/public/components/MapView'), { ssr: false })

  useEffect(() => {
    fetch('/data/lokasi.json').then((res) => res.json()).then((data) => setLokasiList(data))
    const allUlasan = JSON.parse(localStorage.getItem('ulasanList') || '[]')
    setUlasanList(allUlasan.slice(-3).reverse())
  }, [])

  const handlePromoClick = (promo: Promotion) => {
    if (lokasiList.length > 0) {
      const targetLokasiId = lokasiList[0].id;
      router.push(`/lokasi/${targetLokasiId}?promoCode=${promo.kode}`);
    } else {
      alert("Lokasi parkir belum termuat.");
    }
  };

  const handleSubmitUlasan = () => {
    const user = localStorage.getItem('user')
    const parsedUser = user ? JSON.parse(user) : null
    if (!parsedUser) return alert('Silakan login terlebih dahulu.')
    if (!selectedLokasiId) return alert('Pilih lokasi terlebih dahulu.')
    if (!komentar) return alert('Komentar tidak boleh kosong')

    const newUlasan: Ulasan = {
      id_lokasi: selectedLokasiId,
      username: parsedUser.username,
      rating,
      komentar,
      tanggal: new Date().toISOString(),
    }

    const all = JSON.parse(localStorage.getItem('ulasanList') || '[]')
    all.push(newUlasan)
    localStorage.setItem('ulasanList', JSON.stringify(all))

    setKomentar('')
    setRating(5)
    setSelectedLokasiId(null)
    setUlasanList(all.filter((u: Ulasan) => u.id_lokasi === selectedLokasiId))
  }

  const renderContent = () => {
    switch (activeFilter) {
      case 'Promotions':
        return (
          <section>
            <h2 className="text-xl font-bold text-gray-800">Promotions</h2>
            <div className="flex gap-4 pb-4 mt-3 overflow-x-auto">
              {dummyPromotions.map(promo => (
                <button key={promo.id} onClick={() => handlePromoClick(promo)} className="flex-shrink-0 w-2/3 md:w-1/3 text-left">
                  <img src={promo.image} alt={promo.title} className="object-cover w-full h-24 rounded-lg" />
                  <h3 className="mt-2 font-semibold">{promo.title}</h3>
                  <p className="text-sm text-gray-500">{promo.description}</p>
                </button>
              ))}
            </div>
          </section>
        )
      default:
        return (
          <section>
            <h2 className="text-xl font-bold text-gray-800">{activeFilter} Places</h2>
            <div className="mt-3 space-y-4">
              {lokasiList.length > 0 ? (
                lokasiList.map((lokasi) => <ParkirCard key={lokasi.id} lokasi={lokasi} />)
              ) : (
                <p>Memuat data parkir...</p>
              )}
            </div>
          </section>
        )
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        <div className="bg-blue-500 h-1.5 w-full"></div>
        <header className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-800">Rent Parking</h1>
          <button><BellIcon className="w-7 h-7 text-gray-600" /></button>
        </header>
        <main className="px-4">
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 -translate-y-1/2" />
            <input type="text" placeholder="Search for parking" className="w-full py-3 pl-10 pr-4 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 mb-4">
            {['Nearby', 'Popular', 'Promotions'].map(filter => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeFilter === filter ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {filter}
              </button>
            ))}
          </div>
          <div className="w-full mb-6"><MapView /></div>
          {renderContent()}

          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-800">Ulasan Terbaru</h2>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Tinggalkan Review</h3>

              {/* Dropdown lokasi */}
              <div className="mb-2">
                <select
                  className="w-full p-3 bg-gray-100 rounded-lg"
                  value={selectedLokasiId ?? ''}
                  onChange={(e) => setSelectedLokasiId(Number(e.target.value))}
                >
                  <option value="">Pilih Lokasi Parkir</option>
                  {lokasiList.map((lokasi) => (
                    <option key={lokasi.id} value={lokasi.id}>{lokasi.nama}</option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <select
                  className="w-full p-3 bg-gray-100 rounded-lg"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{Array(r).fill('⭐').join('')}</option>)}
                </select>
              </div>

              <textarea
                className="w-full p-3 bg-gray-100 rounded-lg mb-2"
                rows={3}
                placeholder="Berikan Ulasan Kamu Disini..."
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
              />

              <button onClick={handleSubmitUlasan} className="w-full bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-900">
                Kirim Ulasanmu
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {ulasanList.length > 0 ? ulasanList.map((ulasan, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800">{ulasan.username}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-5 h-5 ${i < ulasan.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(ulasan.tanggal).toLocaleDateString('id-ID')}</p>
                  </div>
                  <p className="text-gray-700 mt-3 pl-1">{ulasan.komentar}</p>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Belum ada ulasan.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <div className="fixed z-40 right-4 bottom-24">
        {isChatOpen && <ChatbotFAQ />}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-4 mt-2 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700" aria-label="Toggle Chatbot">
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
        </button>
      </div>

      <BottomNav />
    </>
  )
}
