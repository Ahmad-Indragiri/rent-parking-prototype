'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation' // <-- Impor useSearchParams
import { useEffect, useState } from 'react'
import Image from 'next/image' // <-- Impor Image
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

// ... (Tipe Data tidak berubah) ...
type Lokasi = { id: number; nama: string; alamat: string; tarif: number; slot_tersedia: number; total_slot: number; rating: number; gambar: string; }
type Promo = { kode: string; tipe: 'nominal' | 'persen'; nilai: number; deskripsi: string; }
const promoList: Promo[] = [
  { kode: 'DISKON10K', tipe: 'nominal', nilai: 10000, deskripsi: 'Diskon Rp10.000' },
  { kode: 'PROMO10', tipe: 'persen', nilai: 10, deskripsi: 'Diskon 10%' },
]

export default function DetailLokasiPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // <-- Hook untuk membaca parameter URL
  const id = Number(params.id);

  // ... (State tidak berubah) ...
  const [lokasi, setLokasi] = useState<Lokasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [durasi, setDurasi] = useState(1);
  const [kodePromo, setKodePromo] = useState('');
  const [diskon, setDiskon] = useState(0);
  const [errorPromo, setErrorPromo] = useState('');

  // --- FUNGSI 'cekPromo' DIUBAH MENJADI LEBIH FLEKSIBEL ---
  const applyPromoCode = (code: string, currentLokasi: Lokasi, currentDurasi: number) => {
    const promo = promoList.find(p => p.kode.toUpperCase() === code.toUpperCase());
    if (!promo) {
      setErrorPromo('Kode promo tidak valid');
      setDiskon(0);
      return;
    }
    
    setErrorPromo('');
    let diskonValue = 0;
    if (promo.tipe === 'nominal') {
      diskonValue = promo.nilai;
    } else if (promo.tipe === 'persen') {
      diskonValue = (currentLokasi.tarif * currentDurasi * promo.nilai) / 100;
    }
    setDiskon(diskonValue);
  };

  // --- useEffect DIMODIFIKASI UNTUK MENANGANI PROMO DARI URL ---
  useEffect(() => {
    // Ambil data lokasi
    fetch('/data/lokasi.json')
      .then((res) => res.json())
      .then((data: Lokasi[]) => {
        const found = data.find((item) => item.id === id) || null;
        setLokasi(found);
        setLoading(false);

        // Setelah data lokasi ditemukan, cek promo dari URL
        const promoCodeFromUrl = searchParams.get('promoCode');
        if (promoCodeFromUrl && found) {
          setKodePromo(promoCodeFromUrl);
          applyPromoCode(promoCodeFromUrl, found, 1); // Asumsi durasi awal 1 jam
        }
      });
  }, [id, searchParams]);


  const totalBayar = lokasi ? Math.max(lokasi.tarif * durasi - diskon, 0) : 0;
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

  if (loading) return <div className="p-4 text-center">Memuat detail lokasi...</div>
  if (!lokasi) return <div className="p-4 text-center text-red-600">Lokasi parkir tidak ditemukan</div>

  return (
    // --- GANTI `img` dengan `Image` ---
    <div className="bg-white min-h-screen pb-28">
        <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
            <button onClick={() => router.back()} className="p-1"><ChevronLeftIcon className="w-6 h-6 text-gray-800" /></button>
            <h1 className="flex-grow text-xl font-bold text-center text-gray-900">Parking Details</h1>
            <div className="w-7" />
        </header>

        <Image
            src={lokasi.gambar}
            alt={lokasi.nama}
            width={800}
            height={600}
            priority={true}
            className="w-full h-60 object-cover"
        />
        
        <main className="p-6">
            {/* ... (sisa kode JSX tidak ada yang berubah, hanya tombol Apply Promo) ... */}
            <section>
                <h1 className="text-3xl font-bold text-gray-900">{lokasi.nama}</h1>
                <p className="text-gray-500 mt-1">{lokasi.alamat}</p>
                <div className="mt-4 space-y-2 text-gray-700">
                    <p>Buka 24 Jam</p>
                    <p>Tempat yang Tersedia: {lokasi.slot_tersedia}</p>
                    <p>Harga: Rp{lokasi.tarif.toLocaleString()}/Jam</p>
                </div>
            </section>
            <div className="my-6 border-t border-gray-200"></div>
            <section className="space-y-4">
                <h2 className="text-xl font-bold">Pilihan Reservasi</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Durasi (Jam)</label>
                    <input type="number" value={durasi} min={1} max={24} onChange={(e) => setDurasi(parseInt(e.target.value))} className="mt-1 w-full p-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kode Promo</label>
                    <div className="flex gap-2 mt-1">
                        <input type="text" value={kodePromo} onChange={(e) => setKodePromo(e.target.value)} className="w-full p-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan Kode Promo" />
                        <button onClick={() => applyPromoCode(kodePromo, lokasi, durasi)} className="px-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900">Apply</button>
                    </div>
                    {errorPromo && <p className="text-red-600 text-sm mt-1">{errorPromo}</p>}
                    {diskon > 0 && <p className="text-green-600 text-sm mt-1">Diskon berhasil: Rp{diskon.toLocaleString()}</p>}
                </div>
                <div className="text-right pt-2">
                    <p className="text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-gray-900">Rp{totalBayar.toLocaleString()}</p>
                </div>
            </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-10">
            <button onClick={handleReservasi} className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700 transition">Reserve Now</button>
        </div>
    </div>
  )
}