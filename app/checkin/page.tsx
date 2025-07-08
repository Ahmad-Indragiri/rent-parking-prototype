'use client'

import { useEffect, useState } from 'react'

type Reservasi = {
  id_lokasi: number
  nama_lokasi: string
  waktu: string
  durasi: number
  tarif: number
  user: { username: string }
  status: string
}

export default function CheckinPage() {
  const [reservasi, setReservasi] = useState<Reservasi[]>([])
  const [filtered, setFiltered] = useState<Reservasi[]>([])

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null

    const all = JSON.parse(localStorage.getItem('reservasiList') || '[]')
    setReservasi(all)

    const userReservasi = all.filter((r: Reservasi) =>
      r.user.username === user?.username
    )

    setFiltered(userReservasi)
  }, [])

  const handleCheckin = (index: number) => {
    const updated = [...reservasi]
    updated[index].status = 'checkin'
    setReservasi(updated)
    localStorage.setItem('reservasiList', JSON.stringify(updated))
    alert('Check-in berhasil!')
  }

  const handleCheckout = (index: number) => {
    const updated = [...reservasi]
    updated[index].status = 'checkout'
    setReservasi(updated)
    localStorage.setItem('reservasiList', JSON.stringify(updated))
    alert('Check-out berhasil!')
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Simulasi Check-in / Check-out</h1>

      {filtered.length === 0 ? (
        <p className="text-gray-600">Belum ada reservasi aktif.</p>
      ) : (
        filtered.map((r, i) => (
          <div key={i} className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-lg font-semibold">{r.nama_lokasi}</h2>
            <p className="text-sm text-gray-600">
              Waktu: {new Date(r.waktu).toLocaleString()} | Durasi: {r.durasi} jam
            </p>
            <p>Status: <strong>{r.status}</strong></p>

            {r.status === 'aktif' && (
              <button
                onClick={() => handleCheckin(i)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Simulasi Check-in
              </button>
            )}
            {r.status === 'checkin' && (
              <button
                onClick={() => handleCheckout(i)}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Simulasi Check-out
              </button>
            )}
            {r.status === 'checkout' && (
              <p className="mt-2 text-sm text-gray-500">✅ Reservasi selesai</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
