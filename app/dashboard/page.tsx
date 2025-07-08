'use client'

import { useEffect, useState } from 'react'
import ParkirCard from '@/public/components/ParkirCard'
import ChatbotFAQ from '@/public/components/ChatbotFAQ'
import BottomNav from '@/public/components/BottomNav' // Import komponen baru
import { BellIcon, MagnifyingGlassIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'

// Definisikan tipe data
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

type Promotion = {
  id: number
  title: string
  description: string
  image: string
}

// Data dummy untuk promosi
const dummyPromotions: Promotion[] = [
  { id: 1, title: 'Early Bird Special', description: 'Park before 9 AM and save 20%', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8c2VhcmNofDN8fHBhcmtpbmclMjBnYXJhZ2V8ZW58MHx8fHwxNzIwNDY1MDUxfDA&ixlib=rb-4.0.3&q=80&w=400' },
  { id: 2, title: 'Weekend Discount', description: 'Enjoy 15% off on weekends', image: 'https://images.unsplash.com/photo-1543356983-33a7b441da23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8c2VhcmNofDF8fHBhcmtpbmclMjBsb3R8ZW58MHx8fHwxNzIwNDY1MDc3fDA&ixlib=rb-4.0.3&q=80&w=400' },
  { id: 3, title: 'First Time User', description: 'Your first parking is on us!', image: 'https://images.unsplash.com/photo-1611689102197-34d3584a86d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTAwNXwwfDF8c2VhcmNofDEyfHxjYXIlMjBwYXJraW5nfGVufDB8fHx8MTcyMDQ2NTA5OHww&ixlib=rb-4.0.3&q=80&w=400' },
]

// --- KOMPONEN UTAMA ---
export default function Dashboard() {
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([])
  const [activeFilter, setActiveFilter] = useState('Promotions')
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    // Fitur fetch data parkir Anda tetap ada
    fetch('/data/lokasi.json')
      .then((res) => res.json())
      .then((data) => setLokasiList(data))
  }, [])

  const renderContent = () => {
    // Menampilkan konten berdasarkan filter yang aktif
    switch (activeFilter) {
      case 'Promotions':
        return (
          <section>
            <h2 className="text-xl font-bold text-gray-800">Promotions</h2>
            <div className="flex gap-4 pb-4 mt-3 overflow-x-auto">
              {dummyPromotions.map(promo => (
                <div key={promo.id} className="flex-shrink-0 w-2/3 md:w-1/3">
                  <img src={promo.image} alt={promo.title} className="object-cover w-full h-24 rounded-lg" />
                  <h3 className="mt-2 font-semibold">{promo.title}</h3>
                  <p className="text-sm text-gray-500">{promo.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'Nearby':
      case 'Popular':
        return (
          <section>
            <h2 className="text-xl font-bold text-gray-800">{activeFilter} Places</h2>
            <div className="mt-3 space-y-4">
              {/* Fitur daftar parkir Anda ditampilkan di sini */}
              {lokasiList.length > 0 ? (
                lokasiList.map((lokasi) => <ParkirCard key={lokasi.id} lokasi={lokasi} />)
              ) : (
                <p>Memuat data parkir...</p>
              )}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white pb-20"> {/* Padding bottom untuk navigasi bawah */}
        <div className="bg-blue-500 h-1.5 w-full"></div>
        {/* Header */}
        <header className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-800">Rent Parking</h1>
          <button>
            <BellIcon className="w-7 h-7 text-gray-600" />
          </button>
        </header>

        {/* Main Content */}
        <main className="px-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for parking"
              className="w-full py-3 pl-10 pr-4 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-4">
            {['Nearby', 'Popular', 'Promotions'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Map Image */}
          <div className="w-full h-48 mb-6 overflow-hidden rounded-xl">
              <img src="https://user-images.githubusercontent.com/39943537/236122602-2334421b-8521-4363-9993-4e4835a51372.png" alt="Map" className="object-cover w-full h-full" />
          </div>

          {/* Dynamic Content Area */}
          {renderContent()}
        </main>
      </div>
      
      {/* Fitur Chatbot Anda sebagai FAB */}
      <div className="fixed z-40 right-4 bottom-24">
        {isChatOpen && <ChatbotFAQ />}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="p-4 mt-2 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
          aria-label="Toggle Chatbot"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8"/>
        </button>
      </div>

      {/* Navigasi Bawah */}
      <BottomNav />
    </>
  )
}