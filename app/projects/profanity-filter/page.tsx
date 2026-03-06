'use client';

import React from 'react';
import ProfanityFilterSection from '@/src/components/sections/ProfanityFilterSection';

export default function ProfanityFilterProjectPage() {
  return (
    <main className="bg-zinc-950 min-h-screen py-12 px-4 print:py-0 print:px-0">
      <div className="max-w-[210mm] mx-auto bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0 print:max-w-none print:w-full">
        <ProfanityFilterSection />
      </div>
    </main>
  );
}
