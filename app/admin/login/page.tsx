'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheckIcon, ChevronLeftIcon } from '@heroicons/react/24/solid'

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin username or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        
        <div className="relative flex justify-center items-center">
            <button onClick={() => router.push('/')} className="absolute left-0 p-2 rounded-full hover:bg-gray-100">
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-center text-gray-800">
                Admin Panel
            </h1>
        </div>
        
        <div className="text-center pt-4">
            <ShieldCheckIcon className="w-16 h-16 mx-auto text-blue-500"/>
            <p className="mt-2 text-gray-600">Login untuk mengakses dasbor manajemen.</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="sr-only">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="sr-only">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 shadow-sm hover:shadow-md"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
