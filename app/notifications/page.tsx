'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

// Tipe untuk menampung semua pengaturan notifikasi
type NotificationSettings = {
  promotions: boolean;
  reservationReminders: boolean;
  paymentConfirmations: boolean;
  appUpdates: boolean;
};

// Komponen Toggle Switch yang bisa digunakan kembali
const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`${
      enabled ? 'bg-blue-600' : 'bg-gray-200'
    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`${
        enabled ? 'translate-x-5' : 'translate-x-0'
      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);


export default function NotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    promotions: true,
    reservationReminders: true,
    paymentConfirmations: true,
    appUpdates: false,
  });

  // Efek untuk memuat pengaturan dari localStorage saat halaman dibuka
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Efek untuk menyimpan pengaturan ke localStorage setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);


  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
          Notifications
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6">
        <div className="divide-y divide-gray-200">
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Promotions & Offers</p>
              <p className="text-sm text-gray-500">Receive updates about special discounts.</p>
            </div>
            <ToggleSwitch enabled={settings.promotions} onChange={() => handleToggle('promotions')} />
          </div>

          <div className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Reservation Reminders</p>
              <p className="text-sm text-gray-500">Get reminders before your booking time.</p>
            </div>
            <ToggleSwitch enabled={settings.reservationReminders} onChange={() => handleToggle('reservationReminders')} />
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">Payment Confirmations</p>
              <p className="text-sm text-gray-500">Receive a notification for every transaction.</p>
            </div>
            <ToggleSwitch enabled={settings.paymentConfirmations} onChange={() => handleToggle('paymentConfirmations')} />
          </div>

          <div className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">App Updates</p>
              <p className="text-sm text-gray-500">Get notified when new features are available.</p>
            </div>
            <ToggleSwitch enabled={settings.appUpdates} onChange={() => handleToggle('appUpdates')} />
          </div>

        </div>
      </main>
    </div>
  );
}