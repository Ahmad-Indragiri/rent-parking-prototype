'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { QRCodeSVG } from 'qrcode.react'

// 1. Definisikan tipe data yang spesifik untuk Tiket
type Ticket = {
    id_lokasi: number;
    nama_lokasi: string;
    alamat_lokasi: string;
    spot_terpilih: string;
    totalBayar: number;
    user: {
        username: string;
        nama: string;
    };
    // Tambahkan properti lain yang mungkin ada di tiket Anda
};

export default function TicketPage() {
    const router = useRouter();
    // 2. Gunakan tipe "Ticket" di sini, bukan "any"
    const [ticket, setTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        const ticketData = localStorage.getItem('active_ticket');
        if (ticketData) {
            setTicket(JSON.parse(ticketData));
        } else {
            // Jika tidak ada tiket, kembali ke dashboard
            router.replace('/dashboard');
        }
    }, [router]);

    if (!ticket) {
        return <div className="p-4 text-center">Memuat tiket...</div>;
    }

    const qrValue = `parksmart-ticket:${ticket.id_lokasi}:${ticket.user.username}:${ticket.spot_terpilih}`;

    return (
        <div className="bg-white min-h-screen">
            <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
                <button onClick={() => router.back()} className="p-1">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                </button>
                <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
                    Scan QR Code
                </h1>
                <div className="w-7" />
            </header>

            <main className="p-6 flex flex-col items-center">
                <p className="text-center text-gray-600 max-w-xs mb-6">
                Pindai kode QR di pintu masuk untuk check in dan di pintu keluar untuk check out.
                </p>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-full max-w-sm">
                    <div className="bg-orange-100 h-8 rounded-t-lg -m-6 mb-6"></div>
                    <div className="flex justify-center">
                        <QRCodeSVG value={qrValue} size={200} />
                    </div>
                    <div className="bg-orange-100 h-8 rounded-b-lg -m-6 mt-6"></div>
                </div>

                <div className="text-center mt-6">
                    <h2 className="text-2xl font-bold">{ticket.nama_lokasi}</h2>
                    <p className="text-gray-500">{ticket.alamat_lokasi}</p>
                    <p className="font-semibold mt-1">Spot: {ticket.spot_terpilih}</p>
                </div>

                <button
                    onClick={() => router.push('/navigation')}
                    className="mt-8 w-full max-w-sm flex justify-center items-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
                >
                    <MapPinIcon className="w-6 h-6" />
                    Mulai Navigasi
                </button>
            </main>
        </div>
    );
}