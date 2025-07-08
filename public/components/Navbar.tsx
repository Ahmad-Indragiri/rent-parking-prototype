'use client'

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 text-sm flex justify-between items-center">
      <div>
        <a href="/dashboard" className="mr-4 hover:underline">🏠 Dashboard</a>
        <a href="/riwayat" className="mr-4 hover:underline">🧾 Riwayat</a>
        <a href="/admin/reservasi" className="mr-4 hover:underline">Reservasi</a>
      </div>
      <a href="/login" className="hover:underline text-red-300">Logout</a>
    </nav>
  )
}
