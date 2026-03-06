"use client";

import React, { useState } from 'react';

interface CopyMarkdownButtonProps {
  markdown: string;
}

export default function CopyMarkdownButton({ markdown }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  return (
    <div className="fixed top-24 right-8 z-50 print:hidden">
      <button
        onClick={handleCopy}
        className="bg-zinc-800 text-emerald-400 px-6 py-2 rounded-full font-black text-sm hover:bg-zinc-700 transition shadow-2xl border border-emerald-500/30 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {copied ? 'COPIED!' : 'COPY MD (DEV ONLY)'}
      </button>
    </div>
  );
}
