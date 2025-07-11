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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'card' | 'wallet' | null>(null);

  useEffect(() => {
    setPaymentMethods(dummyPaymentMethods);
    const defaultMethod = dummyPaymentMethods.find(m => m.isDefault);
    if (defaultMethod) setSelectedMethodId(defaultMethod.id);

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

    const allReservasi = JSON.parse(localStorage.getItem('reservasi_list') || '[]');
    allReservasi.push(finalReservasi);
    localStorage.setItem('reservasi_list', JSON.stringify(allReservasi));

    localStorage.setItem('active_ticket', JSON.stringify(finalReservasi));
    localStorage.removeItem('pending_reservasi');
    router.push('/ticket');
  };

  const handleAddPayment = (name: string) => {
    const newMethod: PaymentMethod = {
      id: Date.now(),
      type: addMode === 'card' ? 'Debit Card' : 'Digital Wallet',
      details: name,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddModal(false);
    setAddMode(null);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
          Metode Pembayaran
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6 pb-28">
        {/* Daftar Metode Pembayaran */}
        <section>
          <h2 className="font-bold text-lg mb-2">Metode Pembayaran</h2>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                onClick={() => setSelectedMethodId(method.id)}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${selectedMethodId === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
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
          <h2 className="font-bold text-lg mb-2">Tambahkan Metode Pembayaran</h2>
          <div className="space-y-2">
            <button
              onClick={() => {
                setAddMode('card');
                setShowAddModal(true);
              }}
              className="flex items-center w-full p-3 space-x-4 rounded-lg hover:bg-gray-100"
            >
              <div className="p-2 bg-gray-100 rounded-md"><CreditCardIcon className="w-6 h-6 text-gray-700" /></div>
              <span className="font-medium text-gray-800">Tambahkan Kartu Kredit atau Debit</span>
            </button>
            <button
              onClick={() => {
                setAddMode('wallet');
                setShowAddModal(true);
              }}
              className="flex items-center w-full p-3 space-x-4 rounded-lg hover:bg-gray-100"
            >
              <div className="p-2 bg-gray-100 rounded-md"><CreditCardIcon className="w-6 h-6 text-gray-700" /></div>
              <span className="font-medium text-gray-800">Tambahkan Dompet Digital</span>
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

      {/* Modal Pilihan Tambahan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md mx-auto p-6">
            <h3 className="text-lg font-bold mb-4 text-center">
              {addMode === 'card' ? 'Pilih Bank Anda' : 'Pilih Dompet Digital'}
            </h3>

            <div className="space-y-3">
              {(addMode === 'card'
                ? ['BCA', 'BRI', 'Mandiri', 'BNI', 'CIMB Niaga']
                : ['DANA', 'OVO', 'GoPay', 'LinkAja']
              ).map((name) => (
                <button
                  key={name}
                  onClick={() => handleAddPayment(name)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-left hover:bg-gray-100"
                >
                  {name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(false)}
              className="mt-6 w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
