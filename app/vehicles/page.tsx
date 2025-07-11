'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, TruckIcon, TrashIcon } from '@heroicons/react/24/outline'

// Tipe data & data dummy untuk kendaraan
type Vehicle = {
  id: number;
  nickname: string;
  plateNumber: string;
};

const dummyVehicles: Vehicle[] = [
  { id: 1, nickname: 'Mobil Keluarga', plateNumber: 'B 1234 ABC' },
  { id: 2, nickname: 'Motor Harian', plateNumber: 'AA 5678 XYZ' },
];

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [newPlateNumber, setNewPlateNumber] = useState('');

  useEffect(() => {
    // Simulasi mengambil data kendaraan dari localStorage
    const savedVehicles = localStorage.getItem('saved_vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    } else {
      setVehicles(dummyVehicles);
      localStorage.setItem('saved_vehicles', JSON.stringify(dummyVehicles));
    }
  }, []);

  const updateVehicles = (updatedVehicles: Vehicle[]) => {
    setVehicles(updatedVehicles);
    localStorage.setItem('saved_vehicles', JSON.stringify(updatedVehicles));
  };

  const handleRemove = (id: number) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      const newVehicles = vehicles.filter(v => v.id !== id);
      updateVehicles(newVehicles);
    }
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlateNumber.trim()) {
      alert('License plate cannot be empty.');
      return;
    }
    const newVehicle: Vehicle = {
      id: Date.now(), // Gunakan timestamp sebagai ID unik sederhana
      nickname: newNickname.trim() || `Vehicle ${vehicles.length + 1}`,
      plateNumber: newPlateNumber.trim().toUpperCase(),
    };
    updateVehicles([...vehicles, newVehicle]);
    
    // Reset form
    setNewNickname('');
    setNewPlateNumber('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
          Kendaraanmu
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6">
        <section className="space-y-4">
          
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="p-4 border rounded-lg flex items-center gap-4">
              <TruckIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold">{vehicle.nickname}</p>
                <p className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block">{vehicle.plateNumber}</p>
              </div>
              <button onClick={() => handleRemove(vehicle.id)} className="p-2 text-gray-400 hover:text-red-500">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}

          {vehicles.length === 0 && (
            <p className="text-center text-gray-500 py-8">No vehicles registered.</p>
          )}
        </section>

        <section className="mt-8">
          {showAddForm ? (
            <form onSubmit={handleAddVehicle} className="p-4 border rounded-lg bg-gray-50 space-y-4">
                <h3 className="font-semibold text-lg">Add New Vehicle</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Kendaraan (Optional)</label>
                    <input
                        type="text"
                        value={newNickname}
                        onChange={e => setNewNickname(e.target.value)}
                        className="mt-1 w-full p-3 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Mobil Ayah"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Plat Kendaraan</label>
                    <input
                        type="text"
                        value={newPlateNumber}
                        onChange={e => setNewPlateNumber(e.target.value)}
                        className="mt-1 w-full p-3 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="B 1234 ABC"
                        required
                    />
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={() => setShowAddForm(false)} className="w-full py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                        Batal
                    </button>
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        Simpan
                    </button>
                </div>
            </form>
          ) : (
            <button onClick={() => setShowAddForm(true)} className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition">
                + Tambah Kendaraanmu
            </button>
          )}
        </section>
      </main>
    </div>
  );
}