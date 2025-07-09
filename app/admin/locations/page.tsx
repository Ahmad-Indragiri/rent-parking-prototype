'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

// ... (Tipe data 'Lokasi' dan 'dummyLocations' tetap sama seperti kode Anda sebelumnya) ...
type Lokasi = { id: number; nama: string; alamat: string; tarif: number; total_slot: number; };
const dummyLocations: Lokasi[] = [
    { id: 1, nama: 'Parking Spot A', alamat: '123 Main St, Anytown', tarif: 15000, total_slot: 50 },
    { id: 2, nama: 'Parking Spot B', alamat: '456 Oak Ave, Anytown', tarif: 12500, total_slot: 30 },
];

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Lokasi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ... (semua state dan fungsi lainnya seperti handleOpenModal, handleSubmit, handleDelete tetap sama) ...
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentLocation, setCurrentLocation] = useState<Lokasi | null>(null);

    useEffect(() => {
        if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        router.replace('/admin/login');
        return;
        }
        const savedLocations = localStorage.getItem('parking_locations');
        if (savedLocations) {
        setLocations(JSON.parse(savedLocations));
        } else {
        setLocations(dummyLocations);
        localStorage.setItem('parking_locations', JSON.stringify(dummyLocations));
        }
    }, [router]);

    const updateLocations = (updatedLocations: Lokasi[]) => {
        setLocations(updatedLocations);
        localStorage.setItem('parking_locations', JSON.stringify(updatedLocations));
    };

    const handleOpenModal = (mode: 'add' | 'edit', location?: Lokasi) => {
        setModalMode(mode);
        setCurrentLocation(location || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentLocation(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newLocationData = {
        nama: formData.get('nama') as string,
        alamat: formData.get('alamat') as string,
        tarif: Number(formData.get('tarif')),
        total_slot: Number(formData.get('total_slot')),
        };

        if (modalMode === 'add') {
        const newLocation: Lokasi = { id: Date.now(), ...newLocationData };
        updateLocations([...locations, newLocation]);
        } else if (currentLocation) {
        const updatedLocations = locations.map(loc => 
            loc.id === currentLocation.id ? { ...loc, ...newLocationData } : loc
        );
        updateLocations(updatedLocations);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Yakin ingin menghapus lokasi ini?')) {
        const filteredLocations = locations.filter(loc => loc.id !== id);
        updateLocations(filteredLocations);
        }
    };


  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header Baru */}
        <header className="bg-white p-4 border-b flex items-center">
            <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-4">Manajemen Lokasi</h1>
        </header>

        <main className="p-6">
            <div className="flex justify-end items-center mb-6">
                <button onClick={() => handleOpenModal('add')} className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5"/> Tambah Lokasi
                </button>
            </div>
            
            {/* Tabel Lokasi dengan styling baru */}
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                {/* ... (Isi tabel Anda tetap sama, tetapi sekarang akan terlihat lebih menyatu) ... */}
                 <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nama Lokasi</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Tarif/Jam</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Total Slot</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {locations.map((loc) => (
                        <tr key={loc.id}>
                            <td className="py-3 px-4 text-sm text-gray-700 font-medium">{loc.nama}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{loc.alamat}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Rp{loc.tarif.toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{loc.total_slot}</td>
                            <td className="py-3 px-4 text-sm text-gray-700 flex gap-2">
                                <button onClick={() => handleOpenModal('edit', loc)} className="p-1 text-gray-500 hover:text-blue-600"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(loc.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
            </div>
        </main>

        {/* Modal (tidak perlu diubah, akan otomatis terlihat serasi) */}
        {isModalOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                    <h3 className="text-xl font-bold mb-4">{modalMode === 'add' ? 'Tambah Lokasi Baru' : 'Edit Lokasi'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ... (isi form Anda tetap sama) ... */}
                        <div>
                            <label className="block text-sm font-medium">Nama Lokasi</label>
                            <input name="nama" type="text" defaultValue={currentLocation?.nama} required className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Alamat</label>
                            <input name="alamat" type="text" defaultValue={currentLocation?.alamat} required className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Tarif/Jam</label>
                                <input name="tarif" type="number" defaultValue={currentLocation?.tarif} required className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Total Slot</label>
                                <input name="total_slot" type="number" defaultValue={currentLocation?.total_slot} required className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={handleCloseModal} className="py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300">Batal</button>
                            <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}