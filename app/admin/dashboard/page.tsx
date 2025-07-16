'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    UsersIcon,
    MapIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    BuildingStorefrontIcon,
    DocumentChartBarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link';

// --- Komponen-komponen UI Baru ---

// Kartu Statistik Cepat
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
                <Icon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

// Kartu Navigasi Utama
const NavCard: React.FC<{ href: string, icon: React.ElementType, title: string, description: string }> = ({ href, icon: Icon, title, description }) => (
    <Link href={href} className="block p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200 group">
        <Icon className="w-10 h-10 text-blue-600 mb-3 transition-transform group-hover:scale-110" />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
);


export default function AdminDashboardPage() {
    const router = useRouter();
    // State untuk menampung data statistik (simulasi)
    const [stats, setStats] = useState({ totalLocations: 0, totalOwners: 0 });

    useEffect(() => {
        if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
            router.replace('/admin/login');
            return;
        }
        // Ambil data untuk statistik
        const savedData = JSON.parse(localStorage.getItem('parkings_data') || '[]');
        setStats({
            totalLocations: savedData.length,
            totalOwners: savedData.length // Asumsi 1 owner per lokasi
        });
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white p-4 border-b border-gray-200 shadow-sm flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Log Out
                </button>
            </header>

            {/* Konten Utama */}
            <main className="p-4 md:p-6 space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-gray-800">Selamat Datang, Admin!</h2>
                    <p className="text-gray-500">Kelola semua aspek aplikasi dari sini.</p>
                </section>

                {/* Statistik Cepat */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Total Lokasi Terdaftar" value={stats.totalLocations} icon={MapIcon} />
                    <StatCard title="Total Owner Terdaftar" value={stats.totalOwners} icon={BuildingStorefrontIcon} />
                </section>

                {/* Menu Manajemen */}
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Menu Utama</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <NavCard
                            href="/admin/manage-owners"
                            icon={UsersIcon}
                            title="Manajemen Owner & Lokasi"
                            description="Daftarkan, edit, atau hapus data owner dan lokasi parkir."
                        />
                        <NavCard
                            href="/admin/users"
                            icon={UsersIcon}
                            title="Manajemen Pengguna"
                            description="Edit dan hapus data Pengguna."
                        />
                        <NavCard
                            href="/admin/report" // Arahkan ke halaman laporan jika sudah dibuat
                            icon={DocumentChartBarIcon}
                            title="Laporan & Analitik"
                            description="Lihat laporan pendapatan dan okupansi dari semua lokasi."
                        />
                        <NavCard
                            href="/admin/settings"
                            icon={Cog6ToothIcon}
                            title="Pengaturan Aplikasi"
                            description="Atur konfigurasi global dan kelola kode promo."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}
