'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, CreditCardIcon, TrashIcon } from '@heroicons/react/24/outline'

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
];

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    // Simulasi mengambil metode pembayaran dari localStorage
    const savedMethods = localStorage.getItem('payment_methods');
    if (savedMethods) {
      setMethods(JSON.parse(savedMethods));
    } else {
      // Jika belum ada, gunakan data dummy
      setMethods(dummyPaymentMethods);
      localStorage.setItem('payment_methods', JSON.stringify(dummyPaymentMethods));
    }
  }, []);

  const updateMethods = (updatedMethods: PaymentMethod[]) => {
    setMethods(updatedMethods);
    localStorage.setItem('payment_methods', JSON.stringify(updatedMethods));
  };

  const handleSetDefault = (id: number) => {
    const newMethods = methods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    updateMethods(newMethods);
  };

  const handleRemove = (id: number) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      const newMethods = methods.filter(method => method.id !== id);
      updateMethods(newMethods);
    }
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

      <main className="p-6">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Kartu Pembayaranmu</h2>
          
          {methods.map(method => (
            <div key={method.id} className="p-4 border rounded-lg flex items-center gap-4">
              <CreditCardIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold">{method.type}</p>
                <p className="text-sm text-gray-500">{method.details}</p>
                {method.isDefault && (
                  <span className="text-xs font-bold text-blue-600">DEFAULT</span>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => handleRemove(method.id)} className="p-1 text-gray-400 hover:text-red-500">
                  <TrashIcon className="w-5 h-5"/>
                </button>
                {!method.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(method.id)} 
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}

          {methods.length === 0 && (
            <p className="text-center text-gray-500 py-8">No payment methods saved.</p>
          )}
        </section>

        <section className="mt-8">
            <button className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition">
                + Tambah Metode Pembayaran
            </button>
        </section>
      </main>
    </div>
  );
}