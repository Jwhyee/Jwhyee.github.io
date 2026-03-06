'use client';

import React from 'react';
import WillDoneSection from '@/src/components/sections/WillDoneSection';

export default function WillDoneProjectPage() {
  return (
    <main className="bg-zinc-950 min-h-screen py-12 px-4 print:py-0 print:px-0">
      <div className="max-w-[210mm] mx-auto bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0 print:max-w-none print:w-full">
        <WillDoneSection />
      </div>
    </main>
  );
}
