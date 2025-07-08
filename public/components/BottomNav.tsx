'use client'

import { useRouter } from 'next/navigation'
import { HomeIcon, MagnifyingGlassIcon, CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/solid'

// Konfigurasi item navigasi
const navItems = [
  { href: '/dashboard', icon: HomeIcon, label: 'Home' },
  { href: '/search', icon: MagnifyingGlassIcon, label: 'Search' },
  { href: '/riwayat', icon: CalendarDaysIcon, label: 'Reservations' },
  { href: '/account', icon: UserCircleIcon, label: 'Account' },
]

export default function BottomNav() {
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <item.icon className="w-6 h-6 mb-1 text-gray-500 group-hover:text-blue-600" />
            <span className="text-sm text-gray-500 group-hover:text-blue-600">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
