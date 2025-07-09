'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { HomeIcon, ClockIcon } from '@heroicons/react/24/solid'

// Definisikan tipe data yang sama seperti di halaman Tiket
// (Tips: Untuk proyek besar, tipe ini bisa disimpan di satu file terpisah, misal `types.ts`)
type Ticket = {
    nama_lokasi: string;
    alamat_lokasi: string;
    waktu_mulai: string;
};

export default function NavigationPage() {
    const router = useRouter();
    // Gunakan tipe "Ticket" di sini, bukan "any"
    const [ticket, setTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        const ticketData = localStorage.getItem('active_ticket');
        if (ticketData) {
            setTicket(JSON.parse(ticketData));
        }
    }, []);

    const arrivalTime = ticket ? new Date(ticket.waktu_mulai).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
    
    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header dengan Search Bar */}
            <header className="absolute top-0 z-20 p-4 w-full">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                    </button>
                    <div className="relative flex-grow">
                        {/* Letakkan ikon di sini untuk memperbaiki warning */}
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-white rounded-full py-3 pl-10 pr-4 shadow focus:outline-none"
                            readOnly
                        />
                    </div>
                </div>
            </header>

            {/* Map Area */}
            <div className="flex-grow relative">
                <Image
                    src="https://user-images.githubusercontent.com/39943537/236122602-2334421b-8521-4363-9993-4e4835a51372.png"
                    alt="Map Navigation"
                    layout="fill"
                    objectFit="cover"
                />
                {/* Map Control Buttons */}
                <div className="absolute right-4 bottom-48 flex flex-col gap-2">
                    <button className="w-12 h-12 bg-white rounded-t-lg shadow text-2xl font-light">+</button>
                    <button className="w-12 h-12 bg-white rounded-b-lg shadow text-2xl font-light">-</button>
                    <button className="w-12 h-12 bg-white rounded-lg shadow mt-2">➤</button>
                </div>
            </div>

            {/* Bottom Sheet */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl z-10">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gray-100 rounded-lg"><HomeIcon className="w-6 h-6 text-gray-700"/></div>
                    <div>
                        <p className="font-bold text-lg">{ticket?.nama_lokasi || 'Loading...'}</p>
                        <p className="text-sm text-gray-500">{ticket?.alamat_lokasi}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-100 rounded-lg"><ClockIcon className="w-6 h-6 text-gray-700"/></div>
                    <div>
                        <p className="font-bold text-lg">Arrive by {arrivalTime}</p>
                        <p className="text-sm text-gray-500">Your spot is waiting for you</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg"
                >
                    End Navigation
                </button>
            </div>
        </div>
    );
}