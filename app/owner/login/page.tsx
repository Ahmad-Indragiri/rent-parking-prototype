'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- LOGIKA LOGIN OWNER SEDERHANA ---
    // Di aplikasi nyata, Anda akan memvalidasi ini ke database owner
    const OWNER_EMAIL = 'aaa@aaa';
    const OWNER_PASSWORD = 'qwerty';

    if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
      // Simpan data owner yang login (simulasi)
      const ownerData = {
        email: OWNER_EMAIL,
        name: 'John Doe',
        locationManaged: 'Parking Spot A' // Lokasi yang dikelola owner ini
      };
      localStorage.setItem('isOwnerLoggedIn', 'true');
      localStorage.setItem('ownerData', JSON.stringify(ownerData));
      router.push('/owner/dashboard');
    } else {
      setError('Invalid owner email or password.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white p-6">
      {/* Header */}
      <header className="flex w-full items-center">
        <button onClick={() => router.back()} className="text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="flex-grow text-center text-xl font-bold text-gray-800">
          Owner Log in
        </h1>
        <div className="h-6 w-6"></div>
      </header>

      {/* Form Container */}
      <div className="flex flex-grow flex-col justify-center">
        <form onSubmit={handleOwnerLogin} className="w-full max-w-sm self-center">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-gray-100 p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700"
          >
            Log in as Owner
          </button>
        </form>
      </div>
    </div>
  );
}