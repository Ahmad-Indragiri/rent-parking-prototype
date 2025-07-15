'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ChevronLeftIcon, 
    PencilIcon, 
    TrashIcon, 
    PlusIcon,
    UserCircleIcon // Ikon baru untuk avatar
} from '@heroicons/react/24/outline'

// --- Tipe Data Terpadu ---
type Registration = {
  id: number;
  nama_lokasi: string;
  alamat: string;
  tarif: number;
  total_slot: number;
  gambar: string;
  owner: {
    nama: string;
    email: string;
    password?: string; // Password dibuat opsional saat ditampilkan
  }
};

// --- Data Simulasi Awal ---
const dummyData: Registration[] = [
    { 
        id: 1, 
        nama_lokasi: 'Parkir Artos Mall', 
        alamat: 'Jl. Mayjend Bambang Soegeng No. 1', 
        tarif: 5000, 
        total_slot: 200, 
        gambar: '/artos.jpeg',
        owner: {
            nama: 'Budi Santoso',
            email: 'owner.artos@parksmart.com',
            password: 'password123'
        }
    }
];

export default function ManageOwnersPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentTarget, setCurrentTarget] = useState<Registration | null>(null);

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      router.replace('/admin/login');
      return;
    }
    const savedData = localStorage.getItem('parkings_data');
    if (savedData) {
      setRegistrations(JSON.parse(savedData));
    } else {
      setRegistrations(dummyData);
      localStorage.setItem('parkings_data', JSON.stringify(dummyData));
    }
  }, [router]);

  const updateRegistrations = (updatedList: Registration[]) => {
    setRegistrations(updatedList);
    localStorage.setItem('parkings_data', JSON.stringify(updatedList));
  };

  const handleOpenModal = (mode: 'add' | 'edit', registration?: Registration) => {
    setModalMode(mode);
    setCurrentTarget(registration || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Ambil password hanya jika ada dan tidak kosong
    const password = formData.get('owner_password') as string;
    const ownerData = {
        nama: formData.get('owner_nama') as string,
        email: formData.get('owner_email') as string,
        ...(password && { password: password }) // Hanya tambahkan password jika ada isinya
    };

    const newRegistrationData = {
      nama_lokasi: formData.get('nama_lokasi') as string,
      alamat: formData.get('alamat') as string,
      tarif: Number(formData.get('tarif')),
      total_slot: Number(formData.get('total_slot')),
      gambar: formData.get('gambar') as string,
      owner: ownerData
    };

    if (modalMode === 'add') {
      const newRegistration: Registration = { id: Date.now(), ...newRegistrationData, owner: { ...ownerData, password: password || 'default' } };
      updateRegistrations([...registrations, newRegistration]);
    } else if (currentTarget) {
      const updatedList = registrations.map(reg => 
        reg.id === currentTarget.id ? { ...reg, ...newRegistrationData, owner: {...currentTarget.owner, ...ownerData} } : reg
      );
      updateRegistrations(updatedList);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.')) {
      const filteredList = registrations.filter(reg => reg.id !== id);
      updateRegistrations(filteredList);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white p-4 border-b flex items-center shadow-sm sticky top-0 z-10">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Manajemen Owner & Lokasi</h1>
        </header>

        <main className="p-4 md:p-6">
          <div className="flex justify-end items-center mb-6">
            <button onClick={() => handleOpenModal('add')} className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow">
              <PlusIcon className="w-5 h-5"/> Daftarkan Owner Baru
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Nama Pemilik</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Tarif</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserCircleIcon className="w-6 h-6 text-gray-500"/>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{reg.owner.nama}</p>
                                <p className="text-xs text-gray-500">{reg.owner.email}</p>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{reg.nama_lokasi}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">Rp{reg.tarif.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm flex gap-2">
                      <button onClick={() => handleOpenModal('edit', reg)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600"><PencilIcon className="w-5 h-5"/></button>
                      <button onClick={() => handleDelete(reg.id)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{modalMode === 'add' ? 'Daftarkan Owner & Lokasi Baru' : 'Edit Data'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Informasi Owner</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="owner_nama" type="text" placeholder="Nama Lengkap Owner" defaultValue={currentTarget?.owner.nama} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <input name="owner_email" type="email" placeholder="Email Login Owner" defaultValue={currentTarget?.owner.email} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <input name="owner_password" type="password" placeholder={modalMode === 'edit' ? "Password Baru (opsional)" : "Password Login Owner"} required={modalMode === 'add'} className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Informasi Lokasi Parkir</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="nama_lokasi" type="text" placeholder="Nama Lokasi Parkir" defaultValue={currentTarget?.nama_lokasi} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <input name="alamat" type="text" placeholder="Alamat Lengkap" defaultValue={currentTarget?.alamat} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <input name="tarif" type="number" placeholder="Tarif per Jam" defaultValue={currentTarget?.tarif} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <input name="total_slot" type="number" placeholder="Total Slot" defaultValue={currentTarget?.total_slot} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <input name="gambar" type="text" placeholder="URL Gambar (misal: /artos.jpeg)" defaultValue={currentTarget?.gambar} required className="w-full p-3 bg-gray-100 rounded-lg col-span-2"/>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-6">
                      <button type="button" onClick={handleCloseModal} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
                      <button type="submit" className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Simpan</button>
                  </div>
                </form>
            </div>
        </div>
      )}
    </>
  )
}
