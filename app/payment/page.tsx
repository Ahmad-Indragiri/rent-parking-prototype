'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, CreditCardIcon } from '@heroicons/react/24/outline'

// Tipe data & data dummy untuk metode pembayaran
type PaymentMethod = {
  id: number;
  type: 'Credit Card' | 'Debit Card' | 'Digital Wallet';
  details: string;
  isDefault?: boolean;
};

const dummyPaymentMethods: PaymentMethod[] = [
  { id: 1, type: 'Credit Card', details: '**** 1234', isDefault: true },
  { id: 2, type: 'Debit Card', details: '**** 5678' },
  { id: 3, type: 'Digital Wallet', details: 'Available balance: $100' },
];


export default function PaymentPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [totalBayar, setTotalBayar] = useState(0);

  useEffect(() => {
    // Simulasi mengambil metode pembayaran & data reservasi
    setPaymentMethods(dummyPaymentMethods);
    
    // Set metode pembayaran default
    const defaultMethod = dummyPaymentMethods.find(m => m.isDefault);
    if (defaultMethod) {
      setSelectedMethodId(defaultMethod.id);
    }
    
    // Ambil total bayar dari reservasi sementara
    const pendingData = localStorage.getItem('pending_reservasi');
    if (pendingData) {
      const reservasi = JSON.parse(pendingData);
      setTotalBayar(reservasi.totalBayar);
    }
  }, []);

  const handleFinalizeReservation = () => {
    if (!selectedMethodId) {
      alert('Pilih metode pembayaran terlebih dahulu.');
      return;
    }
    
    const pendingData = localStorage.getItem('pending_reservasi');
    if (!pendingData) {
      alert('Sesi reservasi berakhir. Mohon ulangi dari awal.');
      router.push('/dashboard');
      return;
    }
    const finalReservasi = JSON.parse(pendingData);

    finalReservasi.metode_pembayaran_id = selectedMethodId;
    finalReservasi.status = 'upcoming';

    // 1. Simpan ke daftar reservasi utama (untuk riwayat)
    const allReservasi = JSON.parse(localStorage.getItem('reservasi_list') || '[]');
    allReservasi.push(finalReservasi);
    localStorage.setItem('reservasi_list', JSON.stringify(allReservasi));

    // 2. Simpan juga sebagai "tiket aktif" untuk halaman selanjutnya
    localStorage.setItem('active_ticket', JSON.stringify(finalReservasi));

    // 3. Hapus data sementara
    localStorage.removeItem('pending_reservasi');

    // 4. Alihkan ke halaman tiket
    router.push('/ticket');
};


  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
          Payment Method
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6 pb-28">
        {/* Daftar Metode Pembayaran */}
        <section>
          <h2 className="font-bold text-lg mb-2">Payment Methods</h2>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                onClick={() => setSelectedMethodId(method.id)}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  selectedMethodId === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  checked={selectedMethodId === method.id}
                  onChange={() => setSelectedMethodId(method.id)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-4 flex-grow">
                  <p className="font-semibold text-gray-800">{method.type}</p>
                  <p className="text-sm text-gray-500">{method.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="my-6 border-t border-gray-100"></div>

        {/* Tambah Metode Pembayaran */}
        <section>
          <h2 className="font-bold text-lg mb-2">Add Payment Method</h2>
          <div className="space-y-2">
            <button className="flex items-center w-full p-3 space-x-4 rounded-lg hover:bg-gray-100">
              <div className="p-2 bg-gray-100 rounded-md"><CreditCardIcon className="w-6 h-6 text-gray-700" /></div>
              <span className="font-medium text-gray-800">Add Credit or Debit Card</span>
            </button>
            <button className="flex items-center w-full p-3 space-x-4 rounded-lg hover:bg-gray-100">
              <div className="p-2 bg-gray-100 rounded-md"><CreditCardIcon className="w-6 h-6 text-gray-700" /></div>
              <span className="font-medium text-gray-800">Add Digital Wallet</span>
            </button>
          </div>
        </section>
      </main>

      {/* Tombol Fixed di Bawah */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-10">
        <button
          onClick={handleFinalizeReservation}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg hover:bg-blue-700"
        >
          Pay Rp{totalBayar.toLocaleString()}
        </button>
      </div>
    </div>
  );
}