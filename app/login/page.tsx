'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: number
  username: string
  password: string
  nama: string
  kendaraan: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Email dan password tidak boleh kosong')
      return
    }

    // Ambil data user dari localStorage
    const users: User[] = JSON.parse(localStorage.getItem('user_list') || '[]')
    const user = users.find(
      (u) => u.username === email && u.password === password
    )

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    } else {
      setError('Email atau password salah')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white p-6">
      <header className="flex w-full items-center">
        <button onClick={() => router.back()} className="text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="flex-grow text-center text-xl font-bold text-gray-800">Masuk Akun Anda</h1>
        <div className="h-6 w-6" />
      </header>

      <div className="flex flex-grow flex-col justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm self-center">
          <div className="mb-4">
            <input type="email" placeholder="Email" className="w-full rounded-md bg-gray-100 p-4" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Password" className="w-full rounded-md bg-gray-100 p-4" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-6 text-left">
            <a href="#" className="text-sm text-gray-600 hover:underline">Lupa kata sandi?</a>
          </div>
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700">Masuk</button>
        </form>
      </div>

      <footer className="w-full text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="font-semibold text-blue-600 hover:underline">
            Silahkan Mendaftar
          </a>
        </p>
      </footer>
    </div>
  )
}
