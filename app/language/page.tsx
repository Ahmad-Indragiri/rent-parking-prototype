'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline'

// Tipe data & daftar bahasa yang didukung
type Language = {
  code: string;
  name: string;
};

const supportedLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default ke English

  // Efek untuk memuat bahasa yang tersimpan saat halaman dibuka
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app_language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleSelectLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Simpan pilihan bahasa ke localStorage
    localStorage.setItem('app_language', languageCode);
    // Di aplikasi nyata, Anda mungkin ingin me-refresh aplikasi atau
    // menggunakan library i18n untuk mengubah bahasa secara dinamis.
    alert(`Bahasa diubah ke ${languageCode.toUpperCase()}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
          Language
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6">
        <div className="divide-y divide-gray-200">
          
          {supportedLanguages.map(lang => (
            <button 
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-800">{lang.name}</span>
              {selectedLanguage === lang.code && (
                <CheckIcon className="w-6 h-6 text-blue-600" />
              )}
            </button>
          ))}

        </div>
      </main>
    </div>
  );
}