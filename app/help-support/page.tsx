'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid'

// Tipe data & daftar FAQ
type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: 'How do I reserve a parking spot?',
    answer: 'You can reserve a spot by selecting a location from the main dashboard, choosing your duration, and completing the payment process. Your spot will be confirmed via a QR code ticket.',
  },
  {
    question: 'How do I cancel a reservation?',
    answer: 'To cancel a reservation, go to the "Reservations" tab, find your upcoming booking, and select the "Cancel" option. Please note that cancellations are subject to our policy.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept major credit cards, debit cards, and various digital wallets. You can manage your payment methods in the "Account" > "Payment Methods" section.',
  },
  {
    question: 'My QR code is not scanning. What should I do?',
    answer: 'Ensure your screen brightness is turned up. If it still doesn\'t work, please show your booking details in the app to the parking attendant for manual verification.',
  },
];

export default function HelpAndSupportPage() {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="flex-grow text-xl font-bold text-center text-gray-900">
          Help & Support
        </h1>
        <div className="w-7" />
      </header>

      <main className="p-6">
        <section className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">How can we help?</h2>
            <p className="text-gray-500 mt-1">Find answers to your questions or contact us.</p>
        </section>

        {/* Opsi Kontak */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <a href="mailto:support@parksmart.com" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                <EnvelopeIcon className="w-8 h-8 text-blue-600 mb-2"/>
                <span className="font-semibold text-gray-800">Email Us</span>
            </a>
            <a href="tel:+123456789" className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                <PhoneIcon className="w-8 h-8 text-blue-600 mb-2"/>
                <span className="font-semibold text-gray-800">Call Us</span>
            </a>
        </section>


        {/* FAQ Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center py-4 text-left"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="pb-4 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}