'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

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

type Ulasan = {
  id_lokasi: number
  username: string
  rating: number
  komentar: string
  tanggal: string
}

type Promo = {
  kode: string
  tipe: 'nominal' | 'persen'
  nilai: number
  deskripsi: string
}

// Contoh data promo hardcoded (bisa nanti kamu pindahkan ke file/data tersendiri)
const promoList: Promo[] = [
  { kode: 'DISKON10K', tipe: 'nominal', nilai: 10000, deskripsi: 'Diskon Rp10.000' },
  { kode: 'PROMO10', tipe: 'persen', nilai: 10, deskripsi: 'Diskon 10%' },
]

export default function DetailLokasiPage() {
  const params = useParams()
  const id = Number(params.id)

  const [lokasi, setLokasi] = useState<Lokasi | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [durasi, setDurasi] = useState(1)
  const [kodeQR, setKodeQR] = useState('')

  // Promo related states
  const [kodePromo, setKodePromo] = useState('')
  const [diskon, setDiskon] = useState(0)
  const [errorPromo, setErrorPromo] = useState('')

  // Ulasan
  const [ulasanList, setUlasanList] = useState<Ulasan[]>([])
  const [komentar, setKomentar] = useState('')
  const [rating, setRating] = useState(5)

  useEffect(() => {
    fetch('/data/lokasi.json')
      .then((res) => res.json())
      .then((data: Lokasi[]) => {
        const found = data.find((item) => item.id === id) || null
        setLokasi(found)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('ulasanList') || '[]')
    const filtered = all.filter((u: Ulasan) => u.id_lokasi === id)
    setUlasanList(filtered)
  }, [id])

  // Fungsi cek kode promo
  const cekPromo = () => {
    const promo = promoList.find(p => p.kode.toUpperCase() === kodePromo.toUpperCase())
    if (!promo) {
      setErrorPromo('Kode promo tidak valid')
      setDiskon(0)
      return
    }
    setErrorPromo('')

    if (!lokasi) {
      setErrorPromo('Data lokasi belum siap')
      return
    }

    let diskonValue = 0
    if (promo.tipe === 'nominal') {
      diskonValue = promo.nilai
    } else if (promo.tipe === 'persen') {
      diskonValue = (lokasi.tarif * durasi * promo.nilai) / 100
    }
    setDiskon(diskonValue)
  }

  // Hitung total bayar setelah diskon
  const totalBayar = lokasi ? Math.max(lokasi.tarif * durasi - diskon, 0) : 0

  const handleReservasi = () => {
    const user = localStorage.getItem('user')
    const parsedUser = user ? JSON.parse(user) : null

    if (!parsedUser) return alert('Silakan login terlebih dahulu.')

    if (!lokasi) return alert('Lokasi tidak ditemukan.')

    const reservasi = {
      id_lokasi: lokasi.id,
      nama_lokasi: lokasi.nama,
      waktu: new Date().toISOString(),
      durasi,
      tarif: lokasi.tarif,
      user: parsedUser,
      status: 'aktif',
      kodePromo: kodePromo.toUpperCase(),
      diskon,
      totalBayar,
    }

    const allReservasi = JSON.parse(localStorage.getItem('reservasiList') || '[]')
    allReservasi.push(reservasi)
    localStorage.setItem('reservasiList', JSON.stringify(allReservasi))

    const qr = `Reservasi:${lokasi.id}-${parsedUser.username}-${new Date().getTime()}`
    setKodeQR(qr)
    setShowQR(true)

    setTimeout(() => {
      window.location.href = '/checkin'
    }, 3000)
  }

  const handleSubmitUlasan = () => {
    const user = localStorage.getItem('user')
    const parsedUser = user ? JSON.parse(user) : null
    if (!parsedUser) return alert('Silakan login terlebih dahulu.')

    if (!komentar) return alert('Komentar tidak boleh kosong')

    const newUlasan: Ulasan = {
      id_lokasi: id,
      username: parsedUser.username,
      rating,
      komentar,
      tanggal: new Date().toISOString()
    }

    const all = JSON.parse(localStorage.getItem('ulasanList') || '[]')
    all.push(newUlasan)
    localStorage.setItem('ulasanList', JSON.stringify(all))

    setKomentar('')
    setRating(5)
    setUlasanList(all.filter((u: Ulasan) => u.id_lokasi === id))
  }

  if (loading) return <p className="p-4">Memuat detail lokasi...</p>
  if (!lokasi) return <p className="p-4 text-red-600">Lokasi parkir tidak ditemukan</p>

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img src={lokasi.gambar} alt={lokasi.nama} className="w-full h-60 object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{lokasi.nama}</h1>
          <p className="text-gray-700 mb-4">{lokasi.alamat}</p>
          <p className="mb-2">Tarif parkir: <strong>Rp{lokasi.tarif}/jam</strong></p>
          <p className="mb-2">Slot tersedia: {lokasi.slot_tersedia} dari {lokasi.total_slot}</p>
          <p className="mb-4">Rating: ⭐ {lokasi.rating}</p>

          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">Durasi parkir (jam)</label>
            <input
              type="number"
              value={durasi}
              min={1}
              max={24}
              onChange={(e) => setDurasi(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Input Kode Promo */}
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">Kode Promo</label>
            <input
              type="text"
              value={kodePromo}
              onChange={(e) => setKodePromo(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Masukkan kode promo"
            />
            <button
              onClick={cekPromo}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Cek Promo
            </button>
            {errorPromo && <p className="text-red-600 text-sm mt-1">{errorPromo}</p>}
            {diskon > 0 && <p className="text-green-600 text-sm mt-1">Diskon: Rp{diskon.toLocaleString()}</p>}
          </div>

          <p className="font-semibold mb-4">
            Total Bayar: Rp{totalBayar.toLocaleString()}
          </p>

          <button
            onClick={handleReservasi}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            Konfirmasi & Dapatkan QR Code
          </button>

          {showQR && (
            <div className="mt-6 text-center">
              <p className="mb-2 text-sm">Tunjukkan QR ini di gerbang parkir:</p>
              <div className="inline-block bg-white p-4 rounded-xl shadow">
                <QRCodeSVG value={kodeQR} size={180} />
              </div>

              <button
                onClick={() => window.location.href = '/checkin'}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Lanjut ke Check-in
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ulasan */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Ulasan Pengguna</h2>

        {ulasanList.length === 0 && <p className="text-gray-500">Belum ada ulasan.</p>}

        <div className="space-y-4 mb-6">
          {ulasanList.map((u, idx) => (
            <div key={idx} className="border-b pb-2">
              <p className="text-sm text-gray-700"><strong>{u.username}</strong> - ⭐ {u.rating}</p>
              <p className="text-sm italic text-gray-600"> {u.komentar} </p>
              <p className="text-xs text-gray-400">{new Date(u.tanggal).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Form Kirim Ulasan */}
        <h3 className="font-semibold mb-1">Kirim Ulasan Anda</h3>
        <div className="mb-2">
          <label className="text-sm">Rating:</label>
          <select
            className="ml-2 border rounded p-1"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>⭐ {r}</option>
            ))}
          </select>
        </div>
        <textarea
          className="w-full border p-2 rounded mb-2"
          rows={3}
          placeholder="Tulis ulasan kamu di sini..."
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
        />
        <button
          onClick={handleSubmitUlasan}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kirim Ulasan
        </button>
      </div>
    </div>
  )
}
