'use client'

import { useState, useEffect } from 'react'

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

type ModalProps = {
  show: boolean
  onClose: () => void
  onSave: (lokasi: Lokasi) => void
  dataEdit?: Lokasi | null
}

export default function ModalLokasi({ show, onClose, onSave, dataEdit }: ModalProps) {
  const [nama, setNama] = useState('')
  const [alamat, setAlamat] = useState('')
  const [tarif, setTarif] = useState(0)
  const [slotTersedia, setSlotTersedia] = useState(0)
  const [totalSlot, setTotalSlot] = useState(0)
  const [rating, setRating] = useState(0)
  const [gambar, setGambar] = useState('')

  useEffect(() => {
    if (dataEdit) {
      setNama(dataEdit.nama)
      setAlamat(dataEdit.alamat)
      setTarif(dataEdit.tarif)
      setSlotTersedia(dataEdit.slot_tersedia)
      setTotalSlot(dataEdit.total_slot)
      setRating(dataEdit.rating)
      setGambar(dataEdit.gambar)
    } else {
      setNama('')
      setAlamat('')
      setTarif(0)
      setSlotTersedia(0)
      setTotalSlot(0)
      setRating(0)
      setGambar('')
    }
  }, [dataEdit])

  if (!show) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama || !alamat) {
      alert('Nama dan alamat harus diisi')
      return
    }

    const lokasi: Lokasi = {
      id: dataEdit ? dataEdit.id : Date.now(),
      nama,
      alamat,
      tarif,
      slot_tersedia: slotTersedia,
      total_slot: totalSlot,
      rating,
      gambar,
    }

    onSave(lokasi)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-md w-full space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {dataEdit ? 'Edit Lokasi Parkir' : 'Tambah Lokasi Parkir'}
        </h2>

        <input
          type="text"
          placeholder="Nama Lokasi"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Tarif per jam"
          value={tarif}
          onChange={(e) => setTarif(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          min={0}
        />

        <input
          type="number"
          placeholder="Slot Tersedia"
          value={slotTersedia}
          onChange={(e) => setSlotTersedia(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          min={0}
        />

        <input
          type="number"
          placeholder="Total Slot"
          value={totalSlot}
          onChange={(e) => setTotalSlot(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          min={0}
        />

        <input
          type="number"
          placeholder="Rating (0-5)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
          min={0}
          max={5}
          step={0.1}
        />

        <input
          type="text"
          placeholder="URL Gambar"
          value={gambar}
          onChange={(e) => setGambar(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}
