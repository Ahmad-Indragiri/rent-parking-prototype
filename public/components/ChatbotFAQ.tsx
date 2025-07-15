'use client'

import { useState, useEffect, useRef, MouseEvent } from 'react'
import { MessageCircle, Send, X, GripVertical } from 'lucide-react'
import Fuse from 'fuse.js'

const faqList = [
 { q: 'Bagaimana cara reservasi?', a: 'Pilih lokasi parkir dari dasbor, tentukan durasi, lalu klik "Pesan Sekarang" untuk melanjutkan ke proses pemilihan spot dan pembayaran.' },
 { q: 'Metode pembayaran apa saja?', a: 'Kami mendukung berbagai metode, termasuk Kartu Kredit/Debit dan Dompet Digital seperti DANA, OVO, dan GoPay.' },
 { q: 'Bagaimana cara membatalkan?', a: 'Saat ini pembatalan belum bisa dilakukan via aplikasi. Silakan hubungi customer service kami.' },
 { q: 'Bagaimana cara check-in?', a: 'Setelah pembayaran berhasil, Anda akan mendapatkan Tiket QR Code. Pindai kode tersebut di gerbang masuk.' },
 { q: 'Apakah promo bisa digabung?', a: 'Tidak, hanya satu kode promo yang bisa digunakan untuk setiap transaksi.' }
]

const fuse = new Fuse(faqList, { keys: ['q'], threshold: 0.4 })

export default function ChatbotFAQ() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // --- State untuk Fitur Drag & Drop Jendela Chat ---
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [isChatDragging, setIsChatDragging] = useState(false);
  const chatDragOffset = useRef({ x: 0, y: 0 });
  const chatboxRef = useRef<HTMLDivElement | null>(null);
  
  // --- State BARU untuk Fitur Drag & Drop Tombol Ikon ---
  const [buttonPosition, setButtonPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 120 });
  const [isButtonDragging, setIsButtonDragging] = useState(false);
  const buttonDragOffset = useRef({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wasDragged = useRef(false);

  // Efek untuk menempatkan chatbox di posisi awal
  useEffect(() => {
    if (isOpen) {
        const initialX = window.innerWidth / 2 - 192;
        const initialY = window.innerHeight - 550;
        setChatPosition({ x: initialX, y: initialY });
        if (messages.length === 0) {
            setMessages([welcomeMessage]);
        }
    }
  }, [isOpen]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);
  const welcomeMessage = { from: 'bot' as const, text: 'Halo! Ada yang bisa saya bantu? Pilih salah satu topik di bawah atau ketik pertanyaanmu.'};

  // --- Logika Drag & Drop untuk Jendela Chat ---
  const handleChatMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (chatboxRef.current) {
        setIsChatDragging(true);
        const { left, top } = chatboxRef.current.getBoundingClientRect();
        chatDragOffset.current = { x: e.clientX - left, y: e.clientY - top };
    }
  };

  const handleChatMouseMove = (e: globalThis.MouseEvent) => {
    if (isChatDragging) {
        setChatPosition({
            x: e.clientX - chatDragOffset.current.x,
            y: e.clientY - chatDragOffset.current.y,
        });
    }
  };

  const handleChatMouseUp = () => setIsChatDragging(false);

  useEffect(() => {
    if (isChatDragging) {
        window.addEventListener('mousemove', handleChatMouseMove);
        window.addEventListener('mouseup', handleChatMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleChatMouseMove);
        window.removeEventListener('mouseup', handleChatMouseUp);
    };
  }, [isChatDragging]);

  // --- Logika BARU untuk Drag & Drop Tombol Ikon ---
  const handleButtonMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsButtonDragging(true);
    wasDragged.current = false;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    buttonDragOffset.current = { x: e.clientX - left, y: e.clientY - top };
  };

  const handleButtonMouseMove = (e: globalThis.MouseEvent) => {
    if (isButtonDragging) {
      wasDragged.current = true;
      setButtonPosition({
        x: e.clientX - buttonDragOffset.current.x,
        y: e.clientY - buttonDragOffset.current.y,
      });
    }
  };

  const handleButtonMouseUp = () => {
    setIsButtonDragging(false);
    // Reset wasDragged setelah beberapa saat untuk memastikan onClick tidak terpicu
    setTimeout(() => {
      wasDragged.current = false;
    }, 50);
  };

  useEffect(() => {
    if (isButtonDragging) {
      window.addEventListener('mousemove', handleButtonMouseMove);
      window.addEventListener('mouseup', handleButtonMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleButtonMouseMove);
      window.removeEventListener('mouseup', handleButtonMouseUp);
    };
  }, [isButtonDragging]);

  const handleButtonClick = () => {
    // Hanya buka jendela jika tombol tidak digeser
    if (!wasDragged.current) {
        setIsOpen(!isOpen);
    }
  };

  const handleSend = (question?: string) => {
    const messageToSend = question || input;
    if (!messageToSend.trim()) return;
    const userMessage = { from: 'user' as const, text: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
        const result = fuse.search(messageToSend);
        const jawaban = result[0]?.item.a || 'Maaf, saya belum punya jawaban untuk itu.';
        const botMessage = { from: 'bot' as const, text: jawaban };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onMouseDown={handleButtonMouseDown}
        onClick={handleButtonClick}
        style={{ top: `${buttonPosition.y}px`, left: `${buttonPosition.x}px` }}
        className="fixed z-[2000] bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 cursor-grab active:cursor-grabbing"
        aria-label="Buka Chat Bantuan"
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {isOpen && (
        <div 
          ref={chatboxRef}
          className="fixed w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-[1999] animate-fade-in-up"
          style={{ top: `${chatPosition.y}px`, left: `${chatPosition.x}px` }}
        >
          <header 
            onMouseDown={handleChatMouseDown}
            className="p-4 border-b bg-white text-gray-800 font-bold text-base rounded-t-2xl flex justify-between items-center cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-5 h-5 text-gray-400"/>
            <span>Bantuan ParkSmart</span>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500"/>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-sm h-96 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] px-4 py-2.5 ${
                    msg.from === 'user' ? 'bg-blue-500 text-white rounded-t-2xl rounded-l-2xl' : 'bg-gray-200 text-gray-800 rounded-t-2xl rounded-r-2xl'
                 }`}>{msg.text}</div>
              </div>
            ))}
            {isTyping && (
                <div className="self-start flex items-center gap-1.5 bg-gray-200 px-4 py-2.5 rounded-t-2xl rounded-r-2xl">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t text-xs text-gray-600">
                <p className="mb-2 font-semibold">Saran Pertanyaan:</p>
                <div className="flex flex-wrap gap-2">
                    {faqList.slice(0, 3).map(faq => (
                        <button key={faq.q} onClick={() => handleSend(faq.q)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 font-medium">{faq.q}</button>
                    ))}
                </div>
            </div>
          )}

          <div className="p-3 border-t flex items-center gap-2 bg-white rounded-b-2xl">
            <div className="relative flex-grow">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Tulis pertanyaan..." className="w-full p-2 pl-4 pr-12 border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" autoFocus/>
                <button onClick={() => handleSend()} className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"><Send className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
