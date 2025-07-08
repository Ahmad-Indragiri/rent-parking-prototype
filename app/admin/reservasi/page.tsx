'use client'

import { useEffect, useState } from 'react'

type Reservasi = {
  id: number
  id_lokasi: number
  nama_lokasi: string
  waktu: string
  durasi: number
  user: {
    username: string
    nama: string
    kendaraan: string
  }
  status: 'aktif' | 'selesai' | 'batal'
}

export default function AdminReservasiPage() {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([])

  useEffect(() => {
    const data = localStorage.getItem('reservasiList')
    if (data) setReservasiList(JSON.parse(data))
  }, [])

  const updateStatus = (id: number, status: Reservasi['status']) => {
    const updated = reservasiList.map((r) =>
      r.id === id ? { ...r, status } : r
    )
    setReservasiList(updated)
    localStorage.setItem('reservasiList', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Manajemen Reservasi</h1>

      {reservasiList.length === 0 && <p>Belum ada reservasi.</p>}

      <div className="space-y-4">
        {reservasiList.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <p><strong>Lokasi:</strong> {r.nama_lokasi}</p>
              <p><strong>Waktu:</strong> {new Date(r.waktu).toLocaleString()}</p>
              <p><strong>Durasi:</strong> {r.durasi} jam</p>
              <p><strong>User:</strong> {r.user.nama} ({r.user.kendaraan})</p>
              <p><strong>Status:</strong> <span className={`font-semibold capitalize ${r.status === 'aktif' ? 'text-green-600' : r.status === 'selesai' ? 'text-gray-600' : 'text-red-600'}`}>{r.status}</span></p>
            </div>

            <div className="space-x-2 mt-4 md:mt-0">
              {r.status !== 'aktif' && (
                <button
                  onClick={() => updateStatus(r.id, 'aktif')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Aktifkan
                </button>
              )}
              {r.status !== 'selesai' && (
                <button
                  onClick={() => updateStatus(r.id, 'selesai')}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Selesai
                </button>
              )}
              {r.status !== 'batal' && (
                <button
                  onClick={() => updateStatus(r.id, 'batal')}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Batalkan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
