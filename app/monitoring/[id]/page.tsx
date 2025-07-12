'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { ClockIcon, TicketIcon } from '@heroicons/react/24/solid';
import { QRCodeSVG } from 'qrcode.react';

// Tipe data Reservasi diperbarui
type Reservasi = {
  id: number;
  nama_lokasi: string;
  spot_terpilih: string;
  waktu_mulai: string;
  status: 'upcoming' | 'past' | 'active';
  // Properti baru untuk menyimpan data final
  waktu_akhir?: string;
  durasi_final?: string;
};

export default function MonitoringPage() {
  const router = useRouter();
  const [ticket, setTicket] = useState<Reservasi | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutQrValue, setCheckoutQrValue] = useState('');

  useEffect(() => {
    const ticketData = localStorage.getItem('monitoring_ticket');
    if (ticketData) {
      setTicket(JSON.parse(ticketData));
    } else {
      router.replace('/riwayat');
    }
  }, [router]);

  useEffect(() => {
    // Timer hanya berjalan jika status BUKAN 'past'
    if (ticket && ticket.status !== 'past') {
      const interval = setInterval(() => {
        const startTime = new Date(ticket.waktu_mulai).getTime();
        const now = new Date().getTime();
        const difference = now - startTime;

        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
        const minutes = Math.floor((difference / (1000 * 60)) % 60).toString().padStart(2, '0');
        const seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, '0');
        
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      
      return () => clearInterval(interval); // Hentikan interval saat komponen unmount atau ticket berubah
    }
  }, [ticket]);

  // --- FUNGSI Diperbarui ---
  const handleEndReservation = () => {
    if (!ticket) return;

    if (window.confirm('Apakah Anda yakin ingin mengakhiri sesi parkir ini?')) {
      // Hitung dan simpan durasi final sebelum menghentikan semuanya
      const finalElapsedTime = elapsedTime;
      const endTime = new Date().toISOString();
      
      // Buat objek tiket yang sudah terupdate
      const updatedTicket: Reservasi = {
        ...ticket,
        status: 'past',
        waktu_akhir: endTime,
        durasi_final: finalElapsedTime,
      };

      // 1. Update status di daftar reservasi utama localStorage
      const allReservasi: Reservasi[] = JSON.parse(localStorage.getItem('reservasi_list') || '[]');
      const updatedReservasiList = allReservasi.map(res => 
        res.id === ticket.id ? updatedTicket : res // Simpan objek yang sudah lengkap
      );
      localStorage.setItem('reservasi_list', JSON.stringify(updatedReservasiList));

      // 2. Buat QR Code untuk checkout
      const qrValue = `parksmart-checkout:${ticket.id}:${ticket.spot_terpilih}`;
      setCheckoutQrValue(qrValue);

      // 3. Update state lokal, ini akan menghentikan timer secara otomatis
      setTicket(updatedTicket);
      
      // 4. Tampilkan modal QR Code
      setIsCheckoutModalOpen(true);
      
      localStorage.removeItem('monitoring_ticket');
    }
  };

  if (!ticket) {
    return <div className="p-4 text-center">Memuat data pemantauan...</div>;
  }
  
  const parkingSpots = Array.from({ length: 20 }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 5));
    const num = (i % 5) + 1;
    return `${row}${num}`;
  });

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white p-4 border-b flex items-center">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5 text-gray-600"/></button>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Pemantauan Parkir</h1>
        </header>
        <main className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 pb-4 border-b">
              <TicketIcon className="w-8 h-8 text-blue-600"/>
              <div>
                <p className="font-bold text-lg">{ticket.nama_lokasi}</p>
                <p className="text-sm text-white">Status: 
                  <span className={`font-semibold capitalize ${ticket.status === 'past' ? 'text-red-500' : 'text-green-600'}`}>
                    {' '}{ticket.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm text-white">Spot Parkir Anda</p>
                <p className="text-2xl font-bold font-mono">{ticket.spot_terpilih || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white flex items-center justify-end gap-1"><ClockIcon className="w-4 h-4"/> Durasi Parkir</p>
                {/* Tampilkan durasi final jika status 'past', jika tidak tampilkan timer berjalan */}
                <p className="text-2xl font-bold font-mono">
                  {ticket.status === 'past' ? ticket.durasi_final : elapsedTime}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border shadow-sm">
            <h3 className="font-bold mb-4 text-center">Posisi Kendaraan Anda</h3>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="grid grid-cols-5 gap-3">
                {parkingSpots.map((spot) => (
                  <div key={spot} className={`py-3 text-sm font-bold rounded-md text-center ${spot === ticket.spot_terpilih ? 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg' : 'bg-white text-gray-700'}`}>{spot}</div>
                ))}
              </div>
            </div>
          </div>
          {ticket.status !== 'past' && (
             <button onClick={handleEndReservation} className="w-full py-4 bg-red-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105">
                Akhiri Reservasi & Keluar
            </button>
          )}
        </main>
      </div>

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">Checkout QR Code</h3>
                <p className="text-gray-600 max-w-xs mb-4">Pindai kode ini di gerbang keluar.</p>
                <div className="p-4 bg-white rounded-lg border">
                  <QRCodeSVG value={checkoutQrValue} size={220} />
                </div>
                <button onClick={() => router.push('/riwayat')} className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg">
                    Kembali ke Riwayat
                </button>
            </div>
        </div>
      )}
    </>
  );
}