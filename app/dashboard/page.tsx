'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ParkirCard from '@/public/components/ParkirCard'
import ChatbotFAQ from '@/public/components/ChatbotFAQ'
import BottomNav from '@/public/components/BottomNav'
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import { StarIcon, UserCircleIcon } from '@heroicons/react/24/solid'

// --- Tipe Data ---
type Lokasi = { id: number; nama: string; alamat: string; tarif: number; slot_tersedia: number; total_slot: number; rating: number; gambar: string; }
type Ulasan = { id_lokasi: number; username: string; rating: number; komentar: string; tanggal: string; }
type Promotion = { id: number; title: string; description: string; image: string; kode: string; };

const dummyPromotions: Promotion[] = [
  { id: 1, title: 'Early Bird Special', description: 'Parkir sebelum jam 9 pagi diskon 50%', image: '/50.jpeg', kode: 'PROMO10' },
  { id: 2, title: 'Weekend Discount', description: 'Nikmati diskon akhir pekan 15%', image: '/15.jpg', kode: 'DISKON10K' },
  { id: 3, title: 'First Time User', description: 'Diskon Pengguna Baru!', image: '/new.png', kode: 'PROMO10' },
]

// Tipe data registrasi dari admin
type Registration = {
  id: number;
  nama_lokasi: string;
  alamat: string;
  tarif: number;
  total_slot: number;
  gambar: string;
};

// --- KOMPONEN UTAMA ---
export default function Dashboard() {
  const router = useRouter();
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [ulasanList, setUlasanList] = useState<Ulasan[]>([]);
  const [activeFilter, setActiveFilter] = useState('Nearby');
  
  // State untuk form ulasan
  const [komentar, setKomentar] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedLokasiId, setSelectedLokasiId] = useState<string>('');

  // State untuk UI
  const [userName, setUserName] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const MapView = dynamic(() => import('@/public/components/MapView'), { ssr: false });

  useEffect(() => {
    // Mengambil data lokasi dari localStorage yang dikelola admin
    const savedData = localStorage.getItem('parkings_data');
    if (savedData) {
        const registrations: Registration[] = JSON.parse(savedData);
        const transformedList = registrations.map(reg => ({
            id: reg.id,
            nama: reg.nama_lokasi,
            alamat: reg.alamat,
            tarif: reg.tarif,
            total_slot: reg.total_slot,
            gambar: reg.gambar,
            slot_tersedia: Math.floor(reg.total_slot * 0.4),
            rating: 4.5,
        }));
        setLokasiList(transformedList);
    }
    
    const allUlasan = JSON.parse(localStorage.getItem('ulasanList') || '[]');
    setUlasanList(allUlasan.slice(-3).reverse());
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.nama);
    }
  }, []);

  const handlePromoClick = (promo: Promotion) => {
    if (lokasiList.length > 0) {
      const targetLokasiId = lokasiList[0].id;
      router.push(`/lokasi/${targetLokasiId}?promoCode=${promo.kode}`);
    } else {
      alert("Lokasi parkir belum termuat.");
    }
  };

  const handleSubmitUlasan = () => {
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    if (!parsedUser) return alert('Silakan login terlebih dahulu.');
    if (!selectedLokasiId) return alert('Pilih lokasi terlebih dahulu.');
    if (!komentar) return alert('Komentar tidak boleh kosong.');

    const newUlasan: Ulasan = {
      id_lokasi: Number(selectedLokasiId),
      username: parsedUser.username,
      rating,
      komentar,
      tanggal: new Date().toISOString(),
    };

    const all = JSON.parse(localStorage.getItem('ulasanList') || '[]');
    all.push(newUlasan);
    localStorage.setItem('ulasanList', JSON.stringify(all));

    setKomentar('');
    setRating(5);
    setSelectedLokasiId('');
    // --- PERBAIKAN DI SINI ---
    // Refresh daftar ulasan dengan 3 yang paling baru dari semua data
    setUlasanList(all.slice(-3).reverse()); 
    setShowReviewForm(false);
    alert('Ulasan berhasil dikirim!');
  };

  const renderContent = () => {
    switch (activeFilter) {
      case 'Promotions':
        return (
          <section>
            <h2 className="text-xl font-bold text-gray-800">Promotions</h2>
            <div className="flex gap-4 pb-4 mt-3 -mx-4 px-4 overflow-x-auto">
              {dummyPromotions.map(promo => (
                <button key={promo.id} onClick={() => handlePromoClick(promo)} className="flex-shrink-0 w-2/3 md:w-1/3 text-left transition-transform transform hover:-translate-y-1">
                  <div className="shadow-md rounded-lg overflow-hidden bg-white">
                    <Image src={promo.image} alt={promo.title} width={300} height={150} className="object-cover w-full h-24" />
                    <div className="p-3">
                        <h3 className="font-semibold text-gray-800">{promo.title}</h3>
                        <p className="text-sm text-gray-500">{promo.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        );
      default:
        return (
          <section>
            <h2 className="text-xl font-bold text-gray-800">{activeFilter} Places</h2>
            <div className="mt-3 space-y-4">
              {lokasiList.length > 0 ? (
                lokasiList.map((lokasi) => <ParkirCard key={lokasi.id} lokasi={lokasi} />)
              ) : ( <p className="text-center text-gray-500">Belum ada lokasi parkir yang terdaftar.</p> )}
            </div>
          </section>
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-blue-600 h-1.5 w-full"></div>
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rent Parking</h1>
            {userName && <p className="text-sm text-gray-500">Selamat datang, {userName}!</p>}
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100"><BellIcon className="w-7 h-7 text-gray-600" /></button>
        </header>

        <main className="p-4 space-y-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2" />
            <input type="text" placeholder="Cari lokasi parkir..." className="w-full py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 justify-center">
            {['Nearby', 'Popular', 'Promotions'].map(filter => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeFilter === filter ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border'}`}>
                {filter}
              </button>
            ))}
          </div>
          <div className="w-full rounded-xl overflow-hidden shadow-md"><MapView /></div>
          
          {renderContent()}

          <section className="mt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Ulasan Pengguna</h2>
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-sm font-semibold text-blue-600 hover:underline">
                  {showReviewForm ? 'Tutup' : 'Tulis Ulasan'}
                </button>
            </div>
            {showReviewForm && (
                <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm animate-fade-in-up">
                    <div className="space-y-3">
                        <select className="w-full p-3 bg-gray-100 rounded-lg" value={selectedLokasiId} onChange={(e) => setSelectedLokasiId(e.target.value)}>
                            <option value="" disabled>Pilih Lokasi untuk Diulas</option>
                            {lokasiList.map((lokasi) => (<option key={lokasi.id} value={lokasi.id}>{lokasi.nama}</option>))}
                        </select>
                        <select className="w-full p-3 bg-gray-100 rounded-lg" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{Array(r).fill('⭐').join('')}</option>)}
                        </select>
                        <textarea className="w-full p-3 bg-gray-100 rounded-lg" rows={3} placeholder="Bagaimana pengalaman parkir Anda..." value={komentar} onChange={(e) => setKomentar(e.target.value)} />
                        <button onClick={handleSubmitUlasan} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700">Kirim Ulasan</button>
                    </div>
                </div>
            )}
            <div className="mt-4 space-y-4">
              {ulasanList.length > 0 ? ulasanList.map((ulasan, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><UserCircleIcon className="w-8 h-8 text-gray-400" /></div>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800">{ulasan.username}</p>
                      <div className="flex items-center">{[...Array(5)].map((_, i) => (<StarIcon key={i} className={`w-5 h-5 ${i < ulasan.rating ? 'text-yellow-400' : 'text-gray-300'}`} />))}</div>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(ulasan.tanggal).toLocaleDateString('id-ID')}</p>
                  </div>
                  <p className="text-gray-700 mt-3 pl-1 italic">{ulasan.komentar}</p>
                </div>
              )) : (<div className="text-center py-8"><p className="text-gray-500">Belum ada ulasan.</p></div>)}
            </div>
          </section>
        </main>
      </div>

      <ChatbotFAQ />
      <BottomNav />
    </>
  )
}
