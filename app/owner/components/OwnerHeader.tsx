// app/owner/components/OwnerHeader.tsx
'use client'
import { useRouter } from 'next/navigation';
import { Bars3Icon, ChevronLeftIcon } from '@heroicons/react/24/solid';

// Terima 'title' dan 'showBackButton' sebagai props
export default function OwnerHeader({ title, showBackButton = false }: { title: string, showBackButton?: boolean }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white border-b">
      {showBackButton ? (
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
      ) : (
        <button onClick={() => router.push('/owner/account')} className="p-1">
          <Bars3Icon className="w-6 h-6 text-gray-800" />
        </button>
      )}
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="w-7" />
    </header>
  );
}