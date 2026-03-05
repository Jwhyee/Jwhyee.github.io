"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="bg-[#080808] rounded border border-zinc-800 overflow-hidden">
      <div className="bg-[#121212] px-3 py-1 flex justify-between items-center border-b border-zinc-800">
        <span className="text-[7pt] font-mono text-zinc-500 uppercase">{language}</span>
      </div>
      <div className="syntax-highlighter-container">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          wrapLines={true}
          lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
          customStyle={{
            margin: 0,
            padding: '12px',
            background: 'transparent',
            fontSize: '8.5pt',
            lineHeight: '1.4',
            width: '100%',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
