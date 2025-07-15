'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import OwnerHeader from '../components/OwnerHeader'
import OwnerBottomNav from '../components/OwnerBottomNav'
import { CurrencyDollarIcon, Squares2X2Icon } from '@heroicons/react/24/solid'

// Tipe data (sebaiknya ditaruh di file terpusat)
type Registration = { 
  id: number; 
  nama_lokasi: string; 
  alamat: string; 
  tarif: number; 
  total_slot: number;
  owner: {
      nama: string;
      email: string;
      password?: string;
  } 
};

// Tipe data yang lebih sederhana untuk state lokal
type Lokasi = {
    id: number;
    nama_lokasi: string;
    alamat: string;
    tarif: number;
    total_slot: number;
}

export default function OwnerLocationsPage() {
  const router = useRouter();
  const [myLocation, setMyLocation] = useState<Lokasi | null>(null);
  
  // State baru untuk mengontrol modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Cek login & ambil data sesi
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login');
      return;
    }
    const sessionData = localStorage.getItem('owner_session_data');
    if (sessionData) {
      // Ambil hanya data lokasi dari sesi
      const parsedData: Registration = JSON.parse(sessionData);
      setMyLocation({
          id: parsedData.id,
          nama_lokasi: parsedData.nama_lokasi,
          alamat: parsedData.alamat,
          tarif: parsedData.tarif,
          total_slot: parsedData.total_slot
      });
    } else {
      router.replace('/owner/login');
    }
  }, [router]);

  // Fungsi baru untuk menyimpan perubahan
  const handleSaveChanges = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!myLocation) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
        nama_lokasi: formData.get('nama_lokasi') as string,
        alamat: formData.get('alamat') as string,
        tarif: Number(formData.get('tarif')),
        total_slot: Number(formData.get('total_slot')),
    };

    // Update data di daftar registrasi utama
    const allData: Registration[] = JSON.parse(localStorage.getItem('parkings_data') || '[]');
    const updatedList = allData.map((reg) => 
        reg.id === myLocation.id ? { ...reg, ...updatedData } : reg
    );
    localStorage.setItem('parkings_data', JSON.stringify(updatedList));

    // Update data sesi dan state lokal
    const currentSessionData = JSON.parse(localStorage.getItem('owner_session_data') || '{}');
    const newSessionData = { ...currentSessionData, ...updatedData };
    localStorage.setItem('owner_session_data', JSON.stringify(newSessionData));
    setMyLocation(newSessionData);

    alert('Perubahan berhasil disimpan!');
    setIsEditModalOpen(false);
  };

  if (!myLocation) {
    return <div className="p-4 text-center">Memuat data lokasi...</div>;
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen pb-20">
        <div className="bg-blue-600 h-1.5 w-full"></div>
        <OwnerHeader title="Lokasi Saya" showBackButton={true}/>

        <main className="p-4 md:p-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">{myLocation.nama_lokasi}</h2>
              <p className="text-gray-500 mt-1">{myLocation.alamat}</p>
              
              <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                          <CurrencyDollarIcon className="w-6 h-6 text-green-600"/>
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Tarif per Jam</p>
                          <p className="text-lg font-bold">Rp{myLocation.tarif.toLocaleString()}</p>
                      </div>
                  </div>
                   <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                          <Squares2X2Icon className="w-6 h-6 text-blue-600"/>
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Total Slot Parkir</p>
                          <p className="text-lg font-bold">{myLocation.total_slot}</p>
                      </div>
                  </div>
              </div>
              
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow"
              >
                  Edit Detail Lokasi
              </button>
          </div>
        </main>
        
        <OwnerBottomNav />
      </div>

      {/* JSX baru untuk Modal Edit */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-30 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">
                <h3 className="text-xl font-bold mb-6">Edit Detail Lokasi</h3>
                <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nama Lokasi</label>
                        <input name="nama_lokasi" type="text" defaultValue={myLocation.nama_lokasi} required className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Alamat</label>
                        <input name="alamat" type="text" defaultValue={myLocation.alamat} required className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600">Tarif/Jam</label>
                            <input name="tarif" type="number" defaultValue={myLocation.tarif} required className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600">Total Slot</label>
                            <input name="total_slot" type="number" defaultValue={myLocation.total_slot} required className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
                        <button type="submit" className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </>
  )
}
