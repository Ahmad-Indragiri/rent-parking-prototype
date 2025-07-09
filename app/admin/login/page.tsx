'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-md">
        
        <div className="text-center">
            <ShieldCheckIcon className="w-12 h-12 mx-auto text-gray-400"/>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">Admin Login</h1>
            <p className="text-gray-500">Access the management dashboard.</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 sr-only">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 sr-only">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}