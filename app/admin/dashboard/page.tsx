'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  UsersIcon,
  MapIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link';

// Komponen Kartu Navigasi
const NavCard: React.FC<{ href: string, icon: React.ElementType, title: string, description: string }> = ({ href, icon: Icon, title, description }) => (
    <Link href={href} className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border">
        <Icon className="w-8 h-8 text-blue-600 mb-3" />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
);

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white p-4 border-b flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600">
                <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                Log Out
            </button>
        </header>

        {/* Konten Utama */}
        <main className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Manajemen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NavCard 
                    href="/admin/locations"
                    icon={MapIcon}
                    title="Manajemen Lokasi"
                    description="Tambah, edit, atau hapus data lokasi parkir."
                />
                <NavCard 
                    href="/admin/users"
                    icon={UsersIcon}
                    title="Manajemen Pengguna"
                    description="Lihat, edit, atau hapus data pengguna terdaftar."
                />
                <NavCard 
                    href="/admin/settings"
                    icon={Cog6ToothIcon}
                    title="Pengaturan"
                    description="Atur konfigurasi aplikasi dan kode promo."
                />
            </div>
        </main>
    </div>
  );
}