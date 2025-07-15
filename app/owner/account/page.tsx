'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import OwnerBottomNav from '../components/OwnerBottomNav'
import { 
    ChevronLeftIcon,
    BuildingStorefrontIcon, 
    QuestionMarkCircleIcon, 
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

// Tipe data untuk Owner
type Owner = { 
    nama: string; 
    email: string;
};

// Komponen untuk item menu berbasis grid
const MenuGridItem: React.FC<{ href: string, icon: React.ElementType, label: string }> = ({ href, icon: Icon, label }) => (
    <a href={href} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-100 hover:shadow-lg transition-all duration-300 border border-gray-200">
        <Icon className="w-10 h-10 text-blue-600 mb-2"/>
        <span className="font-semibold text-gray-800 text-center">{label}</span>
    </a>
);


export default function OwnerAccountPage() {
  const router = useRouter();
  const [owner, setOwner] = useState<Owner | null>(null);

  useEffect(() => {
    if (localStorage.getItem('isOwnerLoggedIn') !== 'true') {
      router.replace('/owner/login');
      return;
    }
    const sessionData = localStorage.getItem('owner_session_data');
    if (sessionData) {
      setOwner(JSON.parse(sessionData).owner);
    } else {
        router.replace('/owner/login');
    }
  }, [router]);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.clear();
        router.push('/');
    }
  };
  
  if (!owner) {
    return <div className="p-4 text-center">Memuat akun...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
        {/* Hero Section (Header + Profil) */}
        <section className="bg-slate-800 text-white p-4 pb-20 rounded-b-3xl">
            <div className="flex items-center">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/10">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-grow text-xl font-bold text-center">Akun Saya</h1>
                <div className="w-10" />
            </div>
            <div className="flex flex-col items-center mt-6">
                <div className="relative w-24 h-24 mb-3 border-4 border-white/50 rounded-full">
                    <Image
                        src="/propil.jpg"
                        alt="Owner Avatar"
                        layout="fill"
                        className="rounded-full object-cover"
                    />
                </div>
                <h2 className="text-2xl font-bold">{owner.nama}</h2>
                <p className="text-slate-300">{owner.email}</p>
            </div>
        </section>

        {/* Konten Utama dengan efek 'Layered' */}
        <main className="p-4 md:p-6 -mt-12">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <MenuGridItem 
                    href="/owner/locations"
                    icon={BuildingStorefrontIcon}
                    label="Lokasi Saya"
                />
                <MenuGridItem 
                    href="#"
                    icon={QuestionMarkCircleIcon}
                    label="Bantuan"
                />
            </div>
            
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white border rounded-xl text-red-500 font-bold hover:bg-red-50 shadow-sm"
            >
                <ArrowRightOnRectangleIcon className="w-6 h-6"/>
                Keluar
            </button>
        </main>
      
      <OwnerBottomNav />
    </div>
  )
}