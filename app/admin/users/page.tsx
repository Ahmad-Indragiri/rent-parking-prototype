'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

// Tipe data untuk Pengguna
type User = {
  id: number;
  nama: string;
  username: string; // email
  kendaraan: string;
  password?: string; // Password optional
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      router.replace('/admin/login');
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem('user_list') || '[]');
    setUsers(savedUsers);
  }, [router]);

  const updateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('user_list', JSON.stringify(updatedUsers));
  };

  const handleOpenModal = (mode: 'add' | 'edit', user?: User) => {
    setModalMode(mode);
    setCurrentUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    
    // Buat objek data baru, hanya sertakan password jika diisi
    const newUserData: Omit<User, 'id' | 'password'> & { password?: string } = {
      nama: formData.get('nama') as string,
      username: formData.get('username') as string,
      kendaraan: formData.get('kendaraan') as string,
    };
    if (password) {
        newUserData.password = password;
    }

    if (modalMode === 'add') {
      const newUser: User = { id: Date.now(), ...newUserData, password: newUserData.password || 'defaultpass' }; // Beri password default jika kosong
      updateUsers([...users, newUser]);
    } else if (currentUser) {
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, ...newUserData } : u
      );
      updateUsers(updatedUsers);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      const filteredUsers = users.filter(u => u.id !== id);
      updateUsers(filteredUsers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header Baru */}
        <header className="bg-white p-4 border-b flex items-center">
            <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-4">Manajemen Pengguna</h1>
        </header>

        <main className="p-6">
            <div className="flex justify-end items-center mb-6">
                <button onClick={() => handleOpenModal('add')} className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5"/> Tambah Pengguna
                </button>
            </div>
            
            {/* Tabel Pengguna */}
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Kendaraan</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="py-3 px-4 text-sm text-gray-700 font-medium">{user.nama}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{user.username}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 font-mono">{user.kendaraan}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 flex gap-2">
                            <button onClick={() => handleOpenModal('edit', user)} className="p-1 text-gray-500 hover:text-blue-600"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={() => handleDelete(user.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </main>

        {/* Modal untuk Tambah/Edit Pengguna */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                    <h3 className="text-xl font-bold mb-4">{modalMode === 'add' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="nama" type="text" placeholder="Nama Lengkap" defaultValue={currentUser?.nama} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input name="username" type="email" placeholder="Email" defaultValue={currentUser?.username} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input name="kendaraan" type="text" placeholder="Nomor Kendaraan" defaultValue={currentUser?.kendaraan} required className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input name="password" type="password" placeholder="Password Baru (kosongi jika tidak diubah)" className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={handleCloseModal} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
                            <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}