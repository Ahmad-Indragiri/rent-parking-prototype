'use client'

import { useEffect, useState } from 'react'
import ModalLokasi from '@/public/components/admin/ModalLokasi' // pastikan path ini benar

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

type Reservasi = {
  id: number
  id_lokasi: number
  nama_lokasi: string
  waktu: string
  durasi: number
  tarif: number
  user: {
    username: string
    nama: string
    kendaraan: string
  }
  status: 'aktif' | 'selesai' | 'batal'
}

export default function AdminDashboard() {
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([])
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState<Lokasi | null>(null)

  // Load data lokasi dan reservasi dari localStorage
  useEffect(() => {
    const lokasi = localStorage.getItem('lokasiList')
    const reservasi = localStorage.getItem('reservasiList')

    if (lokasi) setLokasiList(JSON.parse(lokasi))
    else {
      fetch('/data/lokasi.json')
        .then((res) => res.json())
        .then((data: Lokasi[]) => setLokasiList(data))
    }

    if (reservasi) setReservasiList(JSON.parse(reservasi))
  }, [])

  useEffect(() => {
    localStorage.setItem('lokasiList', JSON.stringify(lokasiList))
  }, [lokasiList])

  // Hitung statistik
  const totalReservasi = reservasiList.length
  const slotAktif = reservasiList.filter((r) => r.status === 'aktif').length
  const estimasiPendapatan = reservasiList
    .filter((r) => r.status !== 'batal')
    .reduce((total, r) => total + (r.tarif || 0) * r.durasi, 0)

  // CRUD handler
  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus lokasi ini?')) {
      setLokasiList((prev) => prev.filter((lokasi) => lokasi.id !== id))
    }
  }

  const handleAdd = () => {
    setEditData(null)
    setShowModal(true)
  }

  const handleEdit = (lokasi: Lokasi) => {
    setEditData(lokasi)
    setShowModal(true)
  }

  const handleSave = (lokasi: Lokasi) => {
    setLokasiList((prev) => {
      const exist = prev.find((l) => l.id === lokasi.id)
      if (exist) {
        return prev.map((l) => (l.id === lokasi.id ? lokasi : l))
      } else {
        return [...prev, lokasi]
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Dashboard Admin - Lokasi Parkir</h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-sm text-gray-500">Total Reservasi</p>
          <p className="text-2xl font-bold text-blue-700">{totalReservasi}</p>
        </div>

        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-sm text-gray-500">Slot Aktif</p>
          <p className="text-2xl font-bold text-green-600">{slotAktif}</p>
        </div>

        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-sm text-gray-500">Estimasi Pendapatan</p>
          <p className="text-xl font-bold text-yellow-600">
            Rp {estimasiPendapatan.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-sm text-gray-500">Total Lokasi</p>
          <p className="text-2xl font-bold text-purple-700">{lokasiList.length}</p>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        + Tambah Lokasi Baru
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lokasiList.length === 0 && <p>Tidak ada data lokasi parkir.</p>}

        {lokasiList.map((lokasi) => (
          <div
            key={lokasi.id}
            className="bg-white rounded-xl shadow p-4 relative"
          >
            <img
              src={lokasi.gambar}
              alt={lokasi.nama}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h2 className="font-semibold text-lg">{lokasi.nama}</h2>
            <p className="text-sm text-gray-600">{lokasi.alamat}</p>
            <p className="text-sm">Tarif: Rp{lokasi.tarif}/jam</p>
            <p className="text-sm">Slot tersedia: {lokasi.slot_tersedia} dari {lokasi.total_slot}</p>
            <p className="text-sm">Rating: ⭐ {lokasi.rating}</p>

            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEdit(lokasi)}
                className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lokasi.id)}
                className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-xs text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalLokasi
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        dataEdit={editData}
      />
    </div>
  )
}
