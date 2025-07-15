'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ChevronLeftIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import { HomeIcon, ClockIcon } from '@heroicons/react/24/solid'
import { QRCodeSVG } from 'qrcode.react'

// Tipe data Ticket
type Ticket = {
    id_lokasi: number;
    nama_lokasi: string;
    alamat_lokasi: string;
    spot_terpilih: string;
    waktu_mulai: string;
    user: { username: string; nama: string; };
};

// --- Komponen Peta Dimuat Secara Dinamis ---
const InteractiveMap = dynamic(() => import('@/public/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse"></div>
});

// Simulasi data koordinat untuk setiap lokasi
const locationCoordinates: { [key: string]: [number, number] } = {
  'Parkir Artos Mall': [-7.542, 110.428], // Koordinat Magelang
  'Parkir Mall A': [-6.200, 106.816], // Contoh: Koordinat Jakarta
  'Parkir Kampus B': [-6.917, 107.619], // Contoh: Koordinat Bandung
  'Default': [-6.208, 106.845] // Fallback
};

export default function NavigationPage() {
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    useEffect(() => {
        const ticketData = localStorage.getItem('active_ticket');
        if (ticketData) {
            setTicket(JSON.parse(ticketData));
        } else {
            router.replace('/dashboard');
        }
    }, [router]);

    const mapCenter = useMemo(() => {
        if (!ticket) return locationCoordinates['Default'];
        return locationCoordinates[ticket.nama_lokasi] || locationCoordinates['Default'];
    }, [ticket]);
    
    const arrivalTime = ticket ? new Date(ticket.waktu_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
    const qrValue = ticket ? `parksmart-ticket:${ticket.id_lokasi}:${ticket.user.username}:${ticket.spot_terpilih}` : '';

    if (!ticket) {
        return <div className="p-4 text-center">Memuat data navigasi...</div>;
    }

    return (
        <>
            {/* --- STRUKTUR UTAMA DIPERBAIKI DI SINI --- */}
            <div className="relative w-screen h-screen">
                {/* Peta sebagai lapisan paling bawah */}
                <div className="absolute inset-0 z-0">
                    <InteractiveMap center={mapCenter} locationName={ticket.nama_lokasi} />
                </div>
                
                {/* Tombol Kembali di lapisan atas */}
                <header className="absolute top-0 left-0 z-20 p-4">
                    <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-lg">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                    </button>
                </header>

                {/* Bottom Sheet di lapisan atas */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-2xl p-4 shadow-2xl">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg"><HomeIcon className="w-6 h-6 text-gray-700"/></div>
                            <div>
                                <p className="font-bold text-lg">{ticket.nama_lokasi}</p>
                                <p className="text-sm text-gray-500">{ticket.alamat_lokasi}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsQrModalOpen(true)} className="flex flex-col items-center text-blue-600 flex-shrink-0">
                            <QrCodeIcon className="w-7 h-7"/>
                            <span className="text-xs font-semibold">Lihat QR</span>
                        </button>
                    </div>

                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gray-100 rounded-lg"><ClockIcon className="w-6 h-6 text-gray-700"/></div>
                        <div>
                            <p className="font-bold text-lg">Perkiraan tiba {arrivalTime}</p>
                            <p className="text-sm text-gray-500">Tempatmu sudah menunggu</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700"
                    >
                        Akhiri Navigasi
                    </button>
                </div>
            </div>

            {/* Modal QR Code */}
            {isQrModalOpen && (
                <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50" onClick={() => setIsQrModalOpen(false)}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">Tiket QR Anda</h3>
                        <div className="p-4 bg-white rounded-lg border">
                            <QRCodeSVG value={qrValue} size={256} />
                        </div>
                        <button onClick={() => setIsQrModalOpen(false)} className="mt-6 bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg">
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
