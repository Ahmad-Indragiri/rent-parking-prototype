'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, StarIcon as StarSolid, SparklesIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

// --- Tipe Data ---
type Registration = { 
  id: number; 
  nama_lokasi: string; 
  alamat: string; 
  tarif: number; 
  total_slot: number; 
  gambar: string;
  owner: { nama: string; email: string; password?: string; } 
};
type Lokasi = { id: number; nama: string; alamat: string; tarif: number; slot_tersedia: number; total_slot: number; rating: number; gambar: string; }
type Ulasan = { id_lokasi: number; username: string; rating: number; komentar: string; tanggal: string; }
type Promo = { kode: string; tipe: 'nominal' | 'persen'; nilai: number; deskripsi: string; }

const promoList: Promo[] = [
  { kode: 'DISKON10K', tipe: 'nominal', nilai: 10000, deskripsi: 'Diskon Rp10.000' },
  { kode: 'PROMO10', tipe: 'persen', nilai: 10, deskripsi: 'Diskon 10%' },
]

export default function DetailLokasiPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(params.id);

  const [lokasi, setLokasi] = useState<Lokasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [durasi, setDurasi] = useState(1);
  const [kodePromo, setKodePromo] = useState('');
  const [diskon, setDiskon] = useState(0);
  const [errorPromo, setErrorPromo] = useState('');
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [ulasanList, setUlasanList] = useState<Ulasan[]>([]);
  const [komentar, setKomentar] = useState('');
  const [rating, setRating] = useState(5);

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
    } else {
      diskonValue = (currentLokasi.tarif * currentDurasi * promo.nilai) / 100;
    }
    setDiskon(diskonValue);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('parkings_data');
    if (savedData) {
        const registrations: Registration[] = JSON.parse(savedData);
        const foundRegistration = registrations.find(reg => reg.id === id);

        if (foundRegistration) {
            const transformedLokasi: Lokasi = {
                id: foundRegistration.id,
                nama: foundRegistration.nama_lokasi,
                alamat: foundRegistration.alamat,
                tarif: foundRegistration.tarif,
                total_slot: foundRegistration.total_slot,
                gambar: foundRegistration.gambar,
                slot_tersedia: Math.floor(foundRegistration.total_slot * 0.4),
                rating: 4.5,
            };
            setLokasi(transformedLokasi);

            const promoCodeFromUrl = searchParams.get('promoCode');
            if (promoCodeFromUrl) {
                setKodePromo(promoCodeFromUrl);
                applyPromoCode(promoCodeFromUrl, transformedLokasi, 1);
            }
        }
    }
    setLoading(false);

    const allUlasan = JSON.parse(localStorage.getItem('ulasanList') || '[]');
    setUlasanList(allUlasan.filter((u: Ulasan) => u.id_lokasi === id));
  }, [id, searchParams]);

  const handleSubmitUlasan = (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    if (!parsedUser) return alert('Silakan login terlebih dahulu.');
    if (!komentar) return alert('Komentar tidak boleh kosong');

    const newUlasan: Ulasan = {
      id_lokasi: id,
      username: parsedUser.username,
      rating,
      komentar,
      tanggal: new Date().toISOString()
    };
    
    const all = JSON.parse(localStorage.getItem('ulasanList') || '[]');
    all.push(newUlasan);
    localStorage.setItem('ulasanList', JSON.stringify(all));

    setKomentar('');
    setRating(5);
    setUlasanList(all.filter((u: Ulasan) => u.id_lokasi === id));
  };

  const totalBayar = lokasi ? Math.max(lokasi.tarif * durasi - diskon, 0) : 0;
  
  const handleReservasi = () => {
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    if (!parsedUser) return alert('Silakan login terlebih dahulu.');
    if (!lokasi) return alert('Lokasi tidak ditemukan.');
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
    router.push(`/book-spot/${lokasi.id}`);
  };

  const takenSpots = ['A3', 'B1', 'C4', 'D2', 'A1'];
  const parkingSpots = Array.from({ length: 20 }, (_, i) => `${String.fromCharCode(65 + Math.floor(i / 5))}${(i % 5) + 1}`);

  if (loading) return <div className="p-4 text-center">Memuat detail lokasi...</div>;
  if (!lokasi) return <div className="p-4 text-center text-red-600">Lokasi parkir tidak ditemukan</div>;

  return (
    <>
      <div className="bg-white min-h-screen pb-28">
        <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
          <button onClick={() => router.back()} className="p-1"><ChevronLeftIcon className="w-6 h-6 text-gray-800" /></button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-900">Parking Details</h1>
          <div className="w-7" />
        </header>

        <Image src={lokasi.gambar} alt={lokasi.nama} width={800} height={600} priority={true} className="w-full h-60 object-cover" />
        
        <main className="p-6">
          <section>
            <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{lokasi.nama}</h1>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                    <StarSolid className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold">{lokasi.rating}</span>
                </div>
            </div>
            <p className="text-gray-500 mt-1">{lokasi.alamat}</p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p>Buka 24 Jam</p>
              <p>Tempat yang Tersedia: {lokasi.slot_tersedia}</p>
              <p>Harga: Rp{lokasi.tarif.toLocaleString()}/Jam</p>
            </div>
            <button onClick={() => setIsSlotModalOpen(true)} className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
              <SparklesIcon className="w-5 h-5" />
              Lihat Slot Tersedia
            </button>
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

          <div className="my-6 border-t border-gray-200"></div>
          
          {/* --- BAGIAN ULASAN DITAMBAHKAN KEMBALI DI SINI --- */}
          <section>
            <h2 className="text-xl font-bold mb-4">Ulasan Pengguna</h2>
            <div className="space-y-4 mb-6">
              {ulasanList.length > 0 ? ulasanList.map((u, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{u.username}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => i < u.rating ? <StarSolid key={i} className="w-4 h-4 text-yellow-500"/> : <StarOutline key={i} className="w-4 h-4 text-gray-300"/>)}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1 italic">{u.komentar}</p>
                </div>
              )) : <p className="text-gray-500 text-sm">Belum ada ulasan untuk lokasi ini.</p>}
            </div>

            <form onSubmit={handleSubmitUlasan} className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2">Tinggalkan Ulasan Anda</h3>
              <div className="mb-2">
                <label className="text-sm font-medium">Rating:</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-md">
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Bintang</option>)}
                </select>
              </div>
              <textarea value={komentar} onChange={(e) => setKomentar(e.target.value)} className="w-full border p-2 rounded-md mb-2" rows={3} placeholder="Tulis ulasan Anda..."/>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">Kirim Ulasan</button>
            </form>
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-10">
          <button onClick={handleReservasi} className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700 transition">Pesan Sekarang</button>
        </div>
      </div>

      {isSlotModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setIsSlotModalOpen(false)}>
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-center mb-4">Denah Slot Parkir</h3>
                <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="grid grid-cols-5 gap-3">
                    {parkingSpots.map((spot) => {
                        const isTaken = takenSpots.includes(spot);
                        return (
                        <div key={spot} className={`py-3 text-sm font-bold rounded-md text-center ${isTaken ? 'bg-gray-300 text-gray-500' : 'bg-green-200 text-green-800'}`}>
                            {spot}
                        </div>
                        );
                    })}
                    </div>
                </div>
                <div className="mt-4 flex justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-200 border"></div><span>Tersedia</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-300 border"></div><span>Terisi</span></div>
                </div>
                <button onClick={() => setIsSlotModalOpen(false)} className="mt-6 w-full py-2 bg-gray-800 text-white rounded-lg font-semibold">
                    Tutup
                </button>
            </div>
        </div>
      )}
    </>
  )
}
