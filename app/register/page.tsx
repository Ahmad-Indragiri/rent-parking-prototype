'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Reset error message

    // Validasi input
    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Semua field wajib diisi.')
      return
    }

    // Cek apakah password cocok
    if (form.password !== form.confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.')
      return
    }

    // Simulasi registrasi berhasil
    console.log('Data pendaftaran:', { email: form.email, password: form.password })
    alert('Registrasi berhasil (simulasi)')
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white p-6">
      {/* Header */}
      <header className="flex w-full items-center">
        <button onClick={() => router.back()} className="text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="flex-grow text-center text-xl font-bold text-gray-800">
          Sign up
        </h1>
        {/* Placeholder untuk menyeimbangkan tombol kembali */}
        <div className="h-6 w-6"></div>
      </header>

      {/* Form Container */}
      <div className="flex flex-grow flex-col justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm self-center">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full rounded-md bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full rounded-md bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full rounded-md bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Sign up
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="w-full text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </footer>
    </div>
  )
}