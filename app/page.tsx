'use client'

import { useRouter } from 'next/navigation'
import { ArrowRightIcon, ShieldCheckIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid'

export default function HomePage() {
  const router = useRouter()

  const handleUser = () => router.push('/login')
  const handleAdmin = () => router.push('/admin/login')
  const handleOwner = () => router.push('/owner/login') // <-- Rute baru untuk Owner

  return (
    <div 
        className="min-h-screen bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485233483930-22d394746059?fit=crop&w=1000&q=80')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 flex flex-col flex-grow items-center justify-center p-4 text-center text-white">
        
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2">
            ParkSmart
          </h1>
          <p className="text-gray-200 text-md mb-8">
            Pilih peran Anda untuk melanjutkan.
          </p>

          <div className="space-y-4">
            {/* Tombol Pengguna */}
            <button
              onClick={handleUser}
              className="w-full bg-blue-600 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-base hover:bg-blue-700 transition transform hover:scale-105"
            >
              <ArrowRightIcon className="w-5 h-5" />
              Masuk sebagai Pengguna
            </button>

            {/* Tombol Owner BARU */}
            <button
              onClick={handleOwner}
              className="w-full bg-green-600 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-base hover:bg-green-700 transition"
            >
               <BuildingStorefrontIcon className="w-5 h-5" />
               Masuk sebagai Owner
            </button>

            {/* Tombol Admin */}
            <button
              onClick={handleAdmin}
              className="w-full bg-gray-500/50 text-gray-200 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-base hover:bg-gray-500/80 transition"
            >
               <ShieldCheckIcon className="w-5 h-5" />
               Masuk sebagai Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}