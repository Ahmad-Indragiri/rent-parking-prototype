'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

// Definisikan tipe untuk data pengguna
type User = {
  nama: string;
  username: string; // Diasumsikan sebagai email
  kendaraan: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({ nama: '', username: '', kendaraan: '' });

  useEffect(() => {
    // Ambil data pengguna dari localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Simulasi menyimpan perubahan ke localStorage
    localStorage.setItem('user', JSON.stringify(formData));
    setUser(formData);
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  if (!user) {
    return <div className="p-4 text-center">Memuat profil...</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
          Profil
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6">
        {/* Foto Profil */}
        <section className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src="/propil.jpg"
              alt="Profile Avatar"
              layout="fill"
              className="rounded-full object-cover"
            />
          </div>
          <button className="text-sm font-semibold text-blue-600 hover:underline">
            Ganti Foto Profil
          </button>
        </section>

        {/* Detail Profil & Form Edit */}
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Nama Lengkap</label>
            {isEditing ? (
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-lg text-gray-800">{user.nama}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Alamat Email</label>
            {isEditing ? (
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-lg text-gray-800">{user.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Plat Kendaraan</label>
            {isEditing ? (
              <input
                type="text"
                name="kendaraan"
                value={formData.kendaraan}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-lg text-gray-800">{user.kendaraan}</p>
            )}
          </div>
        </section>

        {/* Tombol Aksi */}
        <section className="mt-8">
          {isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900"
            >
              Edit Profile
            </button>
          )}
        </section>
      </main>
    </div>
  );
}