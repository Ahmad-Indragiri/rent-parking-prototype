'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BuildingStorefrontIcon, ChevronLeftIcon } from '@heroicons/react/24/solid'

// Tipe data untuk mencocokkan data yang disimpan oleh admin
type Registration = {
  id: number;
  owner: {
    email: string;
    password: string;
  }
  // properti lain tidak perlu didefinisikan di sini
};

export default function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const allData: Registration[] = JSON.parse(localStorage.getItem('parkings_data') || '[]');
    const foundOwnerRegistration = allData.find(
      reg => reg.owner.email === email && reg.owner.password === password
    );

    if (foundOwnerRegistration) {
      localStorage.setItem('isOwnerLoggedIn', 'true');
      localStorage.setItem('owner_session_data', JSON.stringify(foundOwnerRegistration));
      router.push('/owner/dashboard');
    } else {
      setError('Email atau password owner tidak valid.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        
        <div className="relative flex justify-center items-center">
            <button onClick={() => router.back()} className="absolute left-0 p-2 rounded-full hover:bg-gray-100">
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-center text-gray-800">
                Owner Login
            </h1>
        </div>
        
        <div className="text-center pt-4">
            <BuildingStorefrontIcon className="w-16 h-16 mx-auto text-green-500"/>
            <p className="mt-2 text-gray-600">Login untuk memantau properti Anda.</p>
        </div>

        <form onSubmit={handleOwnerLogin} className="space-y-4">
          <div>
            <label className="sr-only">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full rounded-lg bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 shadow-sm hover:shadow-md"
          >
            Log in as Owner
          </button>
        </form>
      </div>
    </div>
  );
}
