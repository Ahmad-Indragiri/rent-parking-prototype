'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ChevronLeftIcon, 
    TrashIcon, 
    TicketIcon, 
    LockClosedIcon 
} from '@heroicons/react/24/outline'

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 border-b flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Pengaturan</h1>
      </header>

      <main className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Kartu Manajemen Promo */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                <div className="flex items-center gap-3">
                    <TicketIcon className="w-7 h-7 text-blue-600"/>
                    <h3 className="text-xl font-bold text-gray-800">Manajemen Kode Promo</h3>
                </div>
                
                <form onSubmit={handleAddPromo} className="p-4 bg-gray-50 border rounded-lg space-y-3">
                    <h4 className="font-semibold text-gray-700">Tambah Promo Baru</h4>
                    <input value={newPromo.kode} onChange={e => setNewPromo({...newPromo, kode: e.target.value.toUpperCase()})} type="text" placeholder="Kode Promo" className="w-full p-3 bg-white border-gray-300 rounded-lg"/>
                    <div className="flex gap-2">
                        <select value={newPromo.tipe} onChange={e => setNewPromo({...newPromo, tipe: e.target.value as 'nominal' | 'persen'})} className="w-full p-3 bg-white border-gray-300 rounded-lg">
                            <option value="nominal">Nominal (Rp)</option>
                            <option value="persen">Persen (%)</option>
                        </select>
                        <input value={newPromo.nilai || ''} onChange={e => setNewPromo({...newPromo, nilai: Number(e.target.value)})} type="number" placeholder="Nilai" className="w-full p-3 bg-white border-gray-300 rounded-lg"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Tambah</button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">Diskon</th>
                                <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {promos.map(p => (
                                <tr key={p.id}>
                                    <td className="py-3 px-3 font-mono text-gray-700">{p.kode}</td>
                                    <td className="py-3 px-3 text-gray-600">{p.tipe === 'nominal' ? `Rp${p.nilai.toLocaleString()}` : `${p.nilai}%`}</td>
                                    <td className="py-3 px-3 text-right">
                                        <button onClick={() => handleDeletePromo(p.id)} className="p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Kartu Keamanan */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                <div className="flex items-center gap-3">
                    <LockClosedIcon className="w-7 h-7 text-blue-600"/>
                    <h3 className="text-xl font-bold text-gray-800">Keamanan</h3>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <p className="text-sm text-gray-600">Ubah password login admin.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                        <input value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} type="password" required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                        <input value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} type="password" required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                        <input value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} type="password" required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                     {passwordMessage.text && <p className={`text-sm font-semibold ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{passwordMessage.text}</p>}
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Ubah Password</button>
                </form>
            </div>
        </div>
      </main>
    </div>
  );
}
