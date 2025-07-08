'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleUser = () => router.push('/login')
  const handleAdmin = () => router.push('/admin/login')

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Selamat Datang</h1>
        <p className="text-gray-600 text-sm mb-4">Pilih tipe login untuk masuk ke sistem</p>

        <button
          onClick={handleUser}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Masuk sebagai Pengguna
        </button>

        <button
          onClick={handleAdmin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Masuk sebagai Admin
        </button>
      </div>
    </div>
  )
}
