'use client';

import ResumeSection from '@/src/components/sections/ResumeSection';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-zinc-950 min-h-screen py-12 px-4 print:py-0 print:px-0">
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 no-print">
        <Link 
          href="/print"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-black text-[10pt] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          VIEW PRINT VERSION (A4 Portrait)
        </Link>
      </div>

      <div className="max-w-[210mm] mx-auto bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0 print:max-w-none print:w-full">
        <ResumeSection />
      </div>
    </main>
  );
}
