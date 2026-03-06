'use client';

import React from 'react';
import PrintButton from "@/src/components/PrintButton";
import ResumeSection from "@/src/components/sections/ResumeSection";
import AiCodeReviewSection from "@/src/components/sections/AiCodeReviewSection";
import ProfanityFilterSection from "@/src/components/sections/ProfanityFilterSection";
import WillDoneSection from "@/src/components/sections/WillDoneSection";
import Link from 'next/link';

export default function ConsolidatedPrintPage() {
  return (
    <main className="bg-zinc-900 min-h-screen py-12 px-4 print:py-0 print:px-0 flex flex-col items-center">
      {/* Navigation & Actions */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 no-print">
        <Link
          href="/"
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full font-black text-[10pt] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-zinc-700"
        >
          <span className="text-[12pt]">←</span>
          BACK TO HOME
        </Link>
        <PrintButton />
      </div>

      {/* Consolidated A4 Document — continuous flow for print */}
      <div className="flex flex-col gap-8 print:gap-0 max-w-[210mm] print:max-w-none print:w-full">
        {/* Page 1: Resume / Summary */}
        <div className="bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0">
          <ResumeSection />
        </div>

        {/* Page 2: Project - AI Code Review */}
        <div className="bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0">
          <AiCodeReviewSection isPrintMode />
        </div>

        {/* Page 3: Project - Profanity Filter */}
        <div className="bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0">
          <ProfanityFilterSection isPrintMode />
        </div>

        {/* Page 4: Project - Will Done */}
        <div className="bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0">
          <WillDoneSection isPrintMode />
        </div>
      </div>
    </main>
  );
}
