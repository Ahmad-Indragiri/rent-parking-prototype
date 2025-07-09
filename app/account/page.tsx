'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BottomNav from '@/public/components/BottomNav'
import {
  ChevronLeftIcon,
  UserCircleIcon,
  CreditCardIcon,
  TruckIcon,
  BellIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon, // <-- Import ikon baru
} from '@heroicons/react/24/outline'

// Tipe data untuk pengguna
type User = {
  nama: string
  username: string // diasumsikan username adalah email
}

// Tipe data untuk item menu
type MenuItemProps = {
  icon: React.ElementType
  label: string
  href?: string
}

// Data untuk menu items dengan href yang benar
const accountMenuItems: MenuItemProps[] = [
  { icon: UserCircleIcon, label: 'Profile', href: '/profile' },
  { icon: CreditCardIcon, label: 'Payment Methods', href: '/payment-methods' },
  { icon: TruckIcon, label: 'Vehicles', href: '/vehicles' },
]

const settingsMenuItems: MenuItemProps[] = [
  { icon: BellIcon, label: 'Notifications', href: '/notifications' },
  { icon: GlobeAltIcon, label: 'Language', href: '/language' },
  { icon: QuestionMarkCircleIcon, label: 'Help & Support', href: '/help-support' },
]

// Komponen kecil untuk setiap baris menu
const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, href = '#' }) => (
  <a
    href={href}
    className="flex items-center w-full p-3 space-x-4 transition-colors duration-200 rounded-lg hover:bg-gray-100"
  >
    <div className="p-2 bg-gray-100 rounded-md">
      <Icon className="w-6 h-6 text-gray-700" />
    </div>
    <span className="font-medium text-gray-800">{label}</span>
  </a>
)

// --- KOMPONEN UTAMA ---
export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // --- FUNGSI BARU UNTUK LOGOUT ---
  const handleLogout = () => {
    // Tampilkan dialog konfirmasi
    if (window.confirm('Are you sure you want to log out?')) {
      // Hapus semua data sesi dari localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('active_ticket');
      localStorage.removeItem('pending_reservasi');
      localStorage.removeItem('reservasi_list');
      localStorage.removeItem('saved_vehicles');
      localStorage.removeItem('notification_settings');
      localStorage.removeItem('payment_methods');
      
      // Arahkan pengguna kembali ke halaman login
      router.push('/');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-800">
            Account
          </h1>
          <div className="w-7" />
        </header>

        <main className="px-4">
          <section className="flex flex-col items-center py-8 text-center">
            <div className="relative w-28 h-28 mb-4">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt="Profile Avatar"
                layout="fill"
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.nama || 'Nama Pengguna'}
            </h2>
            <p className="text-gray-500">{user?.username || 'email@pengguna.com'}</p>
          </section>

          <div className="space-y-6">
            <section>
              <h3 className="px-3 mb-2 text-lg font-semibold text-gray-800">Account</h3>
              <div className="space-y-2">
                {accountMenuItems.map((item) => (
                  <MenuItem key={item.label} {...item} />
                ))}
              </div>
            </section>

            <section>
              <h3 className="px-3 mb-2 text-lg font-semibold text-gray-800">Settings</h3>
              <div className="space-y-2">
                {settingsMenuItems.map((item) => (
                  <MenuItem key={item.label} {...item} />
                ))}
              </div>
            </section>
            
            {/* --- TOMBOL LOGOUT BARU DITAMBAHKAN DI SINI --- */}
            <section className="pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 space-x-4 text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
              >
                <div className="p-2 bg-red-50 rounded-md">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </div>
                <span className="font-medium">Log Out</span>
              </button>
            </section>
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  )
}