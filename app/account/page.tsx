'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/public/components/BottomNav'
import {
  ChevronLeftIcon,
  UserCircleIcon,
  CreditCardIcon,
  TruckIcon,
  BellIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'

// Tipe data untuk pengguna
type User = {
  nama: string
  username: string // diasumsikan username adalah email
  // tambahkan properti lain jika ada
}

// Tipe data untuk item menu
type MenuItemProps = {
  icon: React.ElementType
  label: string
  href?: string
}

// Data untuk menu items
const accountMenuItems: MenuItemProps[] = [
  { icon: UserCircleIcon, label: 'Profile', href: '#' },
  { icon: CreditCardIcon, label: 'Payment Methods', href: '#' },
  { icon: TruckIcon, label: 'Vehicles', href: '#' },
]

const settingsMenuItems: MenuItemProps[] = [
  { icon: BellIcon, label: 'Notifications', href: '#' },
  { icon: GlobeAltIcon, label: 'Language', href: '#' },
  { icon: QuestionMarkCircleIcon, label: 'Help & Support', href: '#' },
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
    // Ambil data pengguna dari localStorage di sisi klien
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <header className="flex items-center p-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-grow text-xl font-bold text-center text-gray-800">
            Account
          </h1>
          <div className="w-7" /> {/* Placeholder */}
        </header>

        {/* Main Content */}
        <main className="px-4">
          {/* Profile Section */}
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

          {/* Menu Sections */}
          <div className="space-y-8">
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
          </div>
        </main>
      </div>

      <BottomNav />
    </>
  )
}