type Lokasi = {
    id: number
    nama: string
    alamat: string
    tarif: number
    slot_tersedia: number
    total_slot: number
    rating: number
    gambar: string
  }
  
  export default function ParkirCard({ lokasi }: { lokasi: Lokasi }) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
        <img src={lokasi.gambar} alt={lokasi.nama} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h2 className="text-lg font-bold">{lokasi.nama}</h2>
          <p className="text-sm text-gray-600">{lokasi.alamat}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-blue-600 font-medium">
              {lokasi.slot_tersedia} / {lokasi.total_slot} slot
            </span>
            <span className="text-sm bg-yellow-400 text-black px-2 py-1 rounded">
              ⭐ {lokasi.rating}
            </span>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className="text-green-600 font-bold">Rp{lokasi.tarif}/jam</span>
            <a
              href={`/lokasi/${lokasi.id}`}
              className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              Pesan
            </a>
          </div>
        </div>
      </div>
    )
  }
  