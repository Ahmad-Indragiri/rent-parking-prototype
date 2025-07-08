'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Username atau password salah!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-blue-700">Login Admin</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full border px-3 py-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}
