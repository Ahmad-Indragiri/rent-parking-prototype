'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import Fuse from 'fuse.js'

const faqList = [
  { q: 'Bagaimana cara melakukan reservasi?', a: 'Pilih lokasi parkir, isi durasi, lalu klik Konfirmasi & Dapatkan QR Code.' },
  { q: 'Metode pembayaran apa saja yang didukung?', a: 'Kami mendukung dompet digital, kartu debit/kredit, dan virtual account.' },
  { q: 'Apakah saya bisa membatalkan reservasi?', a: 'Ya, pembatalan bisa dilakukan selama belum melakukan check-in.' },
  { q: 'Bagaimana cara check-in?', a: 'Tunjukkan QR Code Anda di gerbang masuk.' },
  { q: 'Apakah saya bisa mendapatkan promo?', a: 'Ya, Anda bisa memasukkan kode promo saat melakukan reservasi.' }
]

const fuse = new Fuse(faqList, { keys: ['q'], threshold: 0.4 })

export default function ChatbotFAQ() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([])

  const handleSend = () => {
    if (!input.trim()) return

    const result = fuse.search(input)
    const jawaban = result[0]?.item.a || 'Maaf, saya belum punya jawaban untuk itu.'

    setMessages(prev => [
      ...prev,
      { from: 'user', text: input },
      { from: 'bot', text: jawaban }
    ])
    setInput('')
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbox UI ala WhatsApp */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col z-50">
          <div className="p-3 border-b text-blue-700 font-bold text-sm">Bantuan 24/7 Chat</div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm h-64">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[70%] px-3 py-2 rounded-lg ${
                  msg.from === 'user'
                    ? 'bg-blue-500 text-white self-end ml-auto'
                    : 'bg-gray-200 text-gray-800 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tulis pertanyaan..."
              className="flex-1 p-2 border rounded text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 text-sm"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </>
  )
}
