'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeftIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import { HomeIcon, ClockIcon } from '@heroicons/react/24/solid'
import { QRCodeSVG } from 'qrcode.react'

// 1. Tipe data Ticket disesuaikan agar lengkap seperti di halaman tiket
type Ticket = {
    id_lokasi: number;
    nama_lokasi: string;
    alamat_lokasi: string;
    spot_terpilih: string;
    waktu_mulai: string;
    user: {
        username: string;
        nama: string;
    };
};

export default function NavigationPage() {
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false); // <-- State baru untuk modal

    useEffect(() => {
        const ticketData = localStorage.getItem('active_ticket');
        if (ticketData) {
            setTicket(JSON.parse(ticketData));
        }
    }, []);

    const arrivalTime = ticket ? new Date(ticket.waktu_mulai).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
    
    // 2. Nilai QR Code dibuat di sini juga
    const qrValue = ticket ? `parksmart-ticket:${ticket.id_lokasi}:${ticket.user.username}:${ticket.spot_terpilih}` : '';

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-100">
                <header className="absolute top-0 z-20 p-4 w-full">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow">
                            <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                        </button>
                        {/* Search bar bisa Anda fungsikan nanti jika perlu */}
                    </div>
                </header>

                <div className="flex-grow relative">
                    <Image
                        src="https://user-images.githubusercontent.com/39943537/236122602-2334421b-8521-4363-9993-4e4835a51372.png"
                        alt="Map Navigation"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                {/* Bottom Sheet */}
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl z-10">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    
                    {/* 3. Tombol untuk menampilkan QR ditambahkan di sini */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg"><HomeIcon className="w-6 h-6 text-gray-700"/></div>
                            <div>
                                <p className="font-bold text-lg">{ticket?.nama_lokasi || 'Loading...'}</p>
                                <p className="text-sm text-gray-500">{ticket?.alamat_lokasi}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsQrModalOpen(true)} className="flex flex-col items-center text-blue-600">
                            <QrCodeIcon className="w-7 h-7"/>
                            <span className="text-xs font-semibold">Show QR</span>
                        </button>
                    </div>

                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gray-100 rounded-lg"><ClockIcon className="w-6 h-6 text-gray-700"/></div>
                        <div>
                            <p className="font-bold text-lg">Tiba sekitar {arrivalTime}</p>
                            <p className="text-sm text-gray-500">Tempatmu sudah menunggu</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg"
                    >
                        Akhiri Navigasi
                    </button>
                </div>
            </div>

            {/* 4. Modal untuk menampilkan QR Code */}
            {isQrModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setIsQrModalOpen(false)}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">Your QR Ticket</h3>
                        <QRCodeSVG value={qrValue} size={256} />
                        <button onClick={() => setIsQrModalOpen(false)} className="mt-6 bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}