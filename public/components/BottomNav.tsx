'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as SearchOutline,
  RectangleStackIcon as ReservationsOutline, // Mengganti CalendarDaysIcon agar lebih sesuai
  UserCircleIcon as AccountOutline,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as SearchSolid,
  RectangleStackIcon as ReservationsSolid,
  UserCircleIcon as AccountSolid,
} from '@heroicons/react/24/solid'

// Konfigurasi item navigasi dengan dua jenis ikon
const navItems = [
  { href: '/dashboard', label: 'Beranda', icon: HomeOutline, activeIcon: HomeSolid },
  { href: '/search', label: 'Pencarian', icon: SearchOutline, activeIcon: SearchSolid },
  { href: '/riwayat', label: 'Reservasi', icon: ReservationsOutline, activeIcon: ReservationsSolid },
  { href: '/account', label: 'Akun', icon: AccountOutline, activeIcon: AccountSolid },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    // Kontainer utama untuk efek "floating"
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm z-50">
      <div className="grid h-16 grid-cols-4 mx-auto bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = isActive ? item.activeIcon : item.icon

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              type="button"
              className="relative inline-flex flex-col items-center justify-center px-5 group transition-all duration-300"
            >
              {/* Latar belakang pill untuk item aktif */}
              {isActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-blue-100 rounded-full transition-all duration-300"></div>
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <Icon className={`w-6 h-6 mb-1 transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}