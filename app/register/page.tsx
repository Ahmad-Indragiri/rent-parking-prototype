// app/register/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // Tambahkan field nama dan kendaraan agar bisa disimpan
    nama: '',
    kendaraan: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('') 

    if (!form.email || !form.password || !form.nama || !form.kendaraan) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    // --- LOGIKA BARU UNTUK MENYIMPAN PENGGUNA ---
    const allUsers = JSON.parse(localStorage.getItem('user_list') || '[]');
    const newUser = {
        id: Date.now(),
        username: form.email, // Simpan email sebagai username
        password: form.password,
        nama: form.nama,
        kendaraan: form.kendaraan
    };
    
    allUsers.push(newUser);
    localStorage.setItem('user_list', JSON.stringify(allUsers));
    // --- AKHIR LOGIKA BARU ---

    alert('Registrasi berhasil! Silakan login.');
    router.push('/login');
  }

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Ganti form lama dengan ini agar ada input Nama & Kendaraan */}
      <h1 className="text-2xl font-bold text-center mb-6">Buat Akun</h1>
       <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          <input type="text" name="nama" placeholder="Nama Lengkap" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-lg"/>
          <input type="text" name="kendaraan" placeholder="Plat Nomor (contoh. B 1234 ABC)" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-lg"/>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-lg"/>
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-lg"/>
          <input type="password" name="confirmPassword" placeholder="Konfirmasi Password Password" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-lg"/>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg">Mendaftar</button>
       </form>
    </div>
  )
}