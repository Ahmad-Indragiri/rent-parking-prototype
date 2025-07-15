'use client'

import Image from 'next/image'
import Link from 'next/link'
import { StarIcon } from '@heroicons/react/24/solid'

// Tipe data yang diterima oleh komponen ini
type Lokasi = {
  id: number;
  nama: string;
  alamat: string;
  tarif: number;
  rating: number;
  gambar: string;
};

// Props untuk komponen ParkirCard
type ParkirCardProps = {
  lokasi: Lokasi;
};

export default function ParkirCard({ lokasi }: ParkirCardProps) {
  return (
    // Gunakan <Link> dari Next.js untuk navigasi yang optimal
    <Link href={`/lokasi/${lokasi.id}`} className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden group">
      <div className="flex items-center">
        <div className="relative w-1/3">
          <Image
            src={lokasi.gambar}
            alt={lokasi.nama}
            width={150}
            height={150}
            className="object-cover w-full h-28 transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-bold text-lg text-gray-800">{lokasi.nama}</h3>
          <p className="text-sm text-gray-500 mt-1">{lokasi.alamat}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="font-semibold text-blue-600">
              Rp{lokasi.tarif.toLocaleString()}<span className="text-xs text-gray-500 font-normal">/jam</span>
            </p>
            <div className="flex items-center gap-1 text-sm">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-gray-700">{lokasi.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
