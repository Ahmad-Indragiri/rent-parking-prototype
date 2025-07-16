'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  PlusIcon, // <-- Impor ikon baru
} from '@heroicons/react/24/outline'

// Tipe data untuk Pengguna
type User = {
  id: number;
  nama: string;
  username: string; // email
  kendaraan: string;
  password?: string;
};

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Cek login admin
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      router.replace('/admin/login');
      return;
    }
    // Ambil data pengguna dari localStorage, sesuai dengan yang disimpan oleh halaman registrasi
    const savedUsers = JSON.parse(localStorage.getItem('user_list') || '[]');
    setUsers(savedUsers);
  }, [router]);

  const updateUsers = (updatedList: User[]) => {
    setUsers(updatedList);
    localStorage.setItem('user_list', JSON.stringify(updatedList));
  };

  const handleOpenModal = (mode: 'add' | 'edit', user?: User) => {
    setModalMode(mode);
    setCurrentUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    
    const userData = {
      nama: formData.get('nama') as string,
      username: formData.get('username') as string,
      kendaraan: formData.get('kendaraan') as string,
    };

    if (modalMode === 'add') {
      if (!password) {
        alert('Password wajib diisi untuk pengguna baru.');
        return;
      }
      const newUser: User = { id: Date.now(), ...userData, password };
      updateUsers([...users, newUser]);
    } else if (currentUser) {
      const updatedUserData: Partial<User> = { ...userData };
      if (password) {
        updatedUserData.password = password;
      }
      const updatedList = users.map(u => 
        u.id === currentUser.id ? { ...u, ...updatedUserData } : u
      );
      updateUsers(updatedList);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      const filteredList = users.filter(u => u.id !== id);
      updateUsers(filteredList);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white p-4 border-b flex items-center shadow-sm sticky top-0 z-10">
          <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Manajemen Pengguna</h1>
        </header>

        <main className="p-4 md:p-6">
          {/* Tombol Tambah Pengguna */}
          <div className="flex justify-end items-center mb-6">
            <button onClick={() => handleOpenModal('add')} className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow">
                <PlusIcon className="w-5 h-5"/> Tambah Pengguna
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Nama Pengguna</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Kendaraan</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserCircleIcon className="w-6 h-6 text-gray-500"/>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{user.nama}</p>
                                <p className="text-xs text-gray-500">{user.username}</p>
                            </div>
                        </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-mono">{user.kendaraan}</td>
                    <td className="py-4 px-6 text-sm flex gap-2">
                      <button onClick={() => handleOpenModal('edit', user)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600"><PencilIcon className="w-5 h-5"/></button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="text-center py-10 text-gray-500">Belum ada pengguna terdaftar.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">
                <h3 className="text-xl font-bold mb-6">{modalMode === 'add' ? 'Tambah Pengguna Baru' : 'Edit Data Pengguna'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="nama" type="text" placeholder="Nama Lengkap" defaultValue={currentUser?.nama || ''} required className="w-full p-3 bg-gray-100 rounded-lg"/>
                    <input name="username" type="email" placeholder="Email" defaultValue={currentUser?.username || ''} required className="w-full p-3 bg-gray-100 rounded-lg"/>
                    <input name="kendaraan" type="text" placeholder="Nomor Kendaraan" defaultValue={currentUser?.kendaraan || ''} required className="w-full p-3 bg-gray-100 rounded-lg"/>
                    <input name="password" type="password" placeholder={modalMode === 'edit' ? "Password Baru (opsional)" : "Password"} required={modalMode === 'add'} className="w-full p-3 bg-gray-100 rounded-lg"/>
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
