'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline'

// Tipe data untuk Promo
type Promo = {
  id: number;
  kode: string;
  tipe: 'nominal' | 'persen';
  nilai: number;
};

export default function SettingsPage() {
  const router = useRouter();
  
  const [promos, setPromos] = useState<Promo[]>([]);
  const [newPromo, setNewPromo] = useState({ kode: '', tipe: 'nominal' as 'nominal' | 'persen', nilai: 0 });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      router.replace('/admin/login');
      return;
    }
    const savedPromos = JSON.parse(localStorage.getItem('promo_list') || '[]');
    setPromos(savedPromos);
  }, [router]);

  const updatePromos = (updatedPromos: Promo[]) => {
    setPromos(updatedPromos);
    localStorage.setItem('promo_list', JSON.stringify(updatedPromos));
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.kode || newPromo.nilai <= 0) {
        alert('Kode dan Nilai promo harus diisi dengan benar.');
        return;
    }
    const promoToAdd: Promo = { id: Date.now(), ...newPromo };
    updatePromos([...promos, promoToAdd]);
    setNewPromo({ kode: '', tipe: 'nominal', nilai: 0 });
  };

  const handleDeletePromo = (id: number) => {
    if (window.confirm('Yakin ingin menghapus promo ini?')) {
        const filteredPromos = promos.filter(p => p.id !== id);
        updatePromos(filteredPromos);
    }
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordMessage({type: '', text: ''});
      
      if(passwordData.current !== 'admin123') {
          setPasswordMessage({type: 'error', text: 'Password saat ini salah.'});
          return;
      }
      if(passwordData.new !== passwordData.confirm || !passwordData.new) {
          setPasswordMessage({type: 'error', text: 'Password baru tidak cocok atau kosong.'});
          return;
      }
      
      setPasswordMessage({type: 'success', text: 'Password berhasil diubah! (Ini hanya simulasi).'});
      setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header Baru */}
        <header className="bg-white p-4 border-b flex items-center">
            <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-4">Pengaturan</h1>
        </header>

      {/* Konten Utama */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Kolom Kiri: Manajemen Promo */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Manajemen Kode Promo</h3>
                <form onSubmit={handleAddPromo} className="flex flex-wrap gap-2 items-end p-4 bg-gray-50 border rounded-lg">
                    <input value={newPromo.kode} onChange={e => setNewPromo({...newPromo, kode: e.target.value.toUpperCase()})} type="text" placeholder="Kode" className="p-2 bg-white border-gray-300 rounded-md flex-grow"/>
                    <select value={newPromo.tipe} onChange={e => setNewPromo({...newPromo, tipe: e.target.value as 'nominal' | 'persen'})} className="p-2 bg-white border-gray-300 rounded-md">
                        <option value="nominal">Nominal (Rp)</option>
                        <option value="persen">Persen (%)</option>
                    </select>
                    <input value={newPromo.nilai} onChange={e => setNewPromo({...newPromo, nilai: Number(e.target.value)})} type="number" placeholder="Nilai" className="p-2 bg-white border-gray-300 rounded-md w-24"/>
                    <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Tambah</button>
                </form>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <tbody>
                            {promos.map(p => (
                                <tr key={p.id} className="border-b">
                                    <td className="py-2 font-mono text-gray-700">{p.kode}</td>
                                    <td className="text-gray-600">{p.tipe === 'nominal' ? `Rp${p.nilai.toLocaleString()}` : `${p.nilai}%`}</td>
                                    <td className="text-right"><button onClick={() => handleDeletePromo(p.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Kolom Kanan: Keamanan */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Keamanan</h3>
                <form onSubmit={handleChangePassword} className="space-y-3">
                    <p className="text-sm text-gray-600">Ubah password login admin. Password saat ini adalah `admin123`.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password Saat Ini</label>
                        <input value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} type="password" required className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                        <input value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} type="password" required className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                        <input value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} type="password" required className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                     {passwordMessage.text && <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{passwordMessage.text}</p>}
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Ubah Password</button>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}