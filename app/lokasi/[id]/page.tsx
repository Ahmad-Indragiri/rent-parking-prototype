'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeftIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

// --- Tipe Data (Tidak Diubah) ---
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
const promoList: Promo[] = [
  { kode: 'DISKON10K', tipe: 'nominal', nilai: 10000, deskripsi: 'Diskon Rp10.000' },
  { kode: 'PROMO10', tipe: 'persen', nilai: 10, deskripsi: 'Diskon 10%' },
]

// --- KOMPONEN UTAMA ---
export default function DetailLokasiPage() {
  const params = useParams()
  const router = useRouter() // Tambahkan router untuk tombol kembali
  const id = Number(params.id)

  // --- SEMUA STATE DAN FUNGSI ANDA TETAP SAMA (TIDAK DIUBAH) ---
  const [lokasi, setLokasi] = useState<Lokasi | null>(null)
  const [loading, setLoading] = useState(true)
  const [durasi, setDurasi] = useState(1)
  const [kodePromo, setKodePromo] = useState('')
  const [diskon, setDiskon] = useState(0)
  const [errorPromo, setErrorPromo] = useState('')
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

  const cekPromo = () => {
    const promo = promoList.find(p => p.kode.toUpperCase() === kodePromo.toUpperCase())
    if (!promo) {
      setErrorPromo('Kode promo tidak valid'); setDiskon(0); return
    }
    setErrorPromo('')
    if (!lokasi) {
      setErrorPromo('Data lokasi belum siap'); return
    }
    let diskonValue = 0
    if (promo.tipe === 'nominal') {
      diskonValue = promo.nilai
    } else if (promo.tipe === 'persen') {
      diskonValue = (lokasi.tarif * durasi * promo.nilai) / 100
    }
    setDiskon(diskonValue)
  }

  const totalBayar = lokasi ? Math.max(lokasi.tarif * durasi - diskon, 0) : 0

  const handleReservasi = () => {
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;

    if (!parsedUser) return alert('Silakan login terlebih dahulu.');
    if (!lokasi) return alert('Lokasi tidak ditemukan.');

    // 1. Simpan detail reservasi SEMENTARA ke localStorage
    // Halaman berikutnya akan membaca data ini
    const pendingReservasi = {
      id_lokasi: lokasi.id,
      nama_lokasi: lokasi.nama,
      alamat_lokasi: lokasi.alamat,
      gambar_lokasi: lokasi.gambar,
      waktu_mulai: new Date().toISOString(),
      durasi,
      tarif: lokasi.tarif,
      user: parsedUser,
      kodePromo: kodePromo.toUpperCase(),
      diskon,
      totalBayar,
    };
    localStorage.setItem('pending_reservasi', JSON.stringify(pendingReservasi));

    // 2. Alihkan ke halaman baru untuk memilih spot
    router.push(`/book-spot/${lokasi.id}`);
}

  const handleSubmitUlasan = () => {
    const user = localStorage.getItem('user'); const parsedUser = user ? JSON.parse(user) : null
    if (!parsedUser) return alert('Silakan login terlebih dahulu.')
    if (!komentar) return alert('Komentar tidak boleh kosong')
    const newUlasan: Ulasan = {
      id_lokasi: id, username: parsedUser.username, rating, komentar, tanggal: new Date().toISOString()
    }
    const all = JSON.parse(localStorage.getItem('ulasanList') || '[]'); all.push(newUlasan)
    localStorage.setItem('ulasanList', JSON.stringify(all))
    setKomentar(''); setRating(5); setUlasanList(all.filter((u: Ulasan) => u.id_lokasi === id))
  }

  // --- TAMPILAN BARU DIMULAI DARI SINI ---
  if (loading) return <div className="p-4 text-center">Memuat detail lokasi...</div>
  if (!lokasi) return <div className="p-4 text-center text-red-600">Lokasi parkir tidak ditemukan</div>

  // Kondisi jika QR ditampilkan, layout disederhanakan

  return (
    <div className="bg-white min-h-screen pb-28"> {/* Padding bottom untuk tombol fixed */}
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
            Parking Details
          </h1>
          <div className="w-7" /> {/* Placeholder */}
        </header>

        {/* Gambar Utama */}
        <img src={lokasi.gambar} alt={lokasi.nama} className="w-full h-60 object-cover" />
        
        <main className="p-6">
            {/* Informasi Dasar */}
            <section>
                <h1 className="text-3xl font-bold text-gray-900">{lokasi.nama}</h1>
                <p className="text-gray-500 mt-1">{lokasi.alamat}</p>
                <div className="mt-4 space-y-2 text-gray-700">
                    <p>Open 24 hours</p>
                    <p>Spaces available: {lokasi.slot_tersedia}</p>
                    <p>Rate: ${lokasi.tarif / 1000}/hour</p> {/* Asumsi tarif dalam ribuan */}
                </div>
            </section>
            
            <div className="my-6 border-t border-gray-200"></div>

            {/* Opsi Reservasi (Durasi & Promo) */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">Reservation Options</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                    <input
                      type="number" value={durasi} min={1} max={24}
                      onChange={(e) => setDurasi(parseInt(e.target.value))}
                      className="mt-1 w-full p-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Promo Code</label>
                    <div className="flex gap-2 mt-1">
                        <input
                            type="text" value={kodePromo} onChange={(e) => setKodePromo(e.target.value)}
                            className="w-full p-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter promo code"
                        />
                        <button onClick={cekPromo} className="px-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900">
                            Apply
                        </button>
                    </div>
                     {errorPromo && <p className="text-red-600 text-sm mt-1">{errorPromo}</p>}
                     {diskon > 0 && <p className="text-green-600 text-sm mt-1">Diskon berhasil: Rp{diskon.toLocaleString()}</p>}
                </div>
                <div className="text-right pt-2">
                    <p className="text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-gray-900">Rp{totalBayar.toLocaleString()}</p>
                </div>
            </section>

            <div className="my-6 border-t border-gray-200"></div>

            {/* Ulasan */}
            <section>
                <h2 className="text-xl font-bold mb-4">User Reviews</h2>
                {ulasanList.length === 0 ? <p className="text-gray-500">No reviews yet.</p> : (
                    <div className="space-y-4">
                        {ulasanList.map((u, idx) => (
                          <div key={idx} className="border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">{u.username}</p>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => i < u.rating ? <StarSolid key={i} className="w-4 h-4 text-yellow-500"/> : <StarOutline key={i} className="w-4 h-4 text-yellow-500"/>)}
                                </div>
                            </div>
                            <p className="text-gray-600 mt-1">{u.komentar}</p>
                          </div>
                        ))}
                    </div>
                )}
                 {/* Form Ulasan */}
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Leave a Review</h3>
                    <div className="mb-2">
                        <select
                            className="w-full p-3 bg-gray-100 rounded-lg"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            {[5,4,3,2,1].map(r => <option key={r} value={r}>{Array(r).fill('⭐').join('')}</option>)}
                        </select>
                    </div>
                    <textarea
                        className="w-full p-3 bg-gray-100 rounded-lg mb-2"
                        rows={3} placeholder="Write your review here..."
                        value={komentar} onChange={(e) => setKomentar(e.target.value)}
                    />
                    <button onClick={handleSubmitUlasan} className="w-full bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-900">
                        Submit Review
                    </button>
                </div>
            </section>
        </main>

        {/* Tombol Fixed di Bawah */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-10">
            <button
                onClick={handleReservasi}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700 transition"
            >
                Reserve Now
            </button>
        </div>
    </div>
  )
}