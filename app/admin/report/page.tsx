'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  CurrencyDollarIcon,
  TicketIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

// Tipe data yang relevan dari riwayat reservasi
type Reservasi = {
  id: number;
  nama_lokasi: string;
  totalBayar: number;
  waktu_mulai: string;
  user: {
      nama: string;
  }
};

// Komponen untuk kartu statistik
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
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

// Komponen Halaman Utama
export default function ReportsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservasi[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    mostPopularLocation: 'N/A'
  });

  useEffect(() => {
    // Cek login admin
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      router.replace('/admin/login');
      return;
    }
    
    // Ambil semua data reservasi dari localStorage
    const allReservations: Reservasi[] = JSON.parse(localStorage.getItem('reservasi_list') || '[]');
    setReservations(allReservations);

    // Proses data untuk statistik
    if (allReservations.length > 0) {
      const totalRevenue = allReservations.reduce((sum, res) => sum + (res.totalBayar || 0), 0);
      
      const locationCounts = allReservations.reduce((acc, res) => {
        acc[res.nama_lokasi] = (acc[res.nama_lokasi] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostPopularLocation = Object.keys(locationCounts).length > 0 
        ? Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b)
        : 'N/A';

      setStats({
        totalRevenue,
        totalTransactions: allReservations.length,
        mostPopularLocation
      });
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 border-b flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => router.push('/admin/dashboard')} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Laporan & Analitik</h1>
      </header>

      <main className="p-4 md:p-6 space-y-8">
        {/* Ringkasan Statistik */}
        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Keseluruhan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Pendapatan" value={`Rp${stats.totalRevenue.toLocaleString()}`} icon={CurrencyDollarIcon} />
                <StatCard title="Total Transaksi" value={stats.totalTransactions} icon={TicketIcon} />
                <StatCard title="Lokasi Paling Ramai" value={stats.mostPopularLocation} icon={TrophyIcon} />
            </div>
        </section>

        {/* Tabel Detail Transaksi */}
        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Semua Transaksi</h2>
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">ID Transaksi</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nama Lokasi</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Pengguna</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reservations.length > 0 ? reservations.map((res) => (
                      <tr key={res.id}>
                        <td className="py-3 px-4 text-sm text-gray-500 font-mono">#{res.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{res.nama_lokasi}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{res.user?.nama || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(res.waktu_mulai).toLocaleDateString('id-ID')}</td>
                        <td className="py-3 px-4 text-sm text-gray-800 font-semibold">Rp{res.totalBayar.toLocaleString()}</td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">Belum ada data transaksi.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
            </div>
        </section>
      </main>
    </div>
  );
}
