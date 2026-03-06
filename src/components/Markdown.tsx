import React from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * A simple Markdown renderer that handles:
 * 1. **bold** -> <strong>
 * 2. `code` -> <code>
 * 3. [text](url) -> <a>
 * 4. $math$ -> <span className="font-serif italic">
 * 5. &quot; or " -> "
 */
export const Markdown = ({ content, className }: MarkdownProps) => {
  // Replace escaped quotes if any
  const processedContent = content.replace(/&quot;/g, '"');

  // Split by bold (**), inline code (`), links ([...](...)), and math ($...$)
  const parts = processedContent.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))|(\$.*?\$)/g).filter(Boolean);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        // Handle Bold
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Handle Inline Code
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded text-[0.9em] font-mono border border-zinc-700 mx-0.5">
              {part.slice(1, -1)}
            </code>
          );
        }
        // Handle Links
        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            const [, text, url] = match;
            return (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-500 hover:text-emerald-400 underline underline-offset-4 decoration-emerald-500/30 transition-colors font-medium"
              >
                {text}
              </a>
            );
          }
        }
        // Handle Math Expressions
        if (part.startsWith('$') && part.endsWith('$')) {
          const mathContent = part.slice(1, -1).replace(/\\times/g, '×');
          return (
            <span key={i} className="font-serif italic text-zinc-200 mx-0.5 tracking-tight bg-zinc-900/50 px-1 rounded border border-zinc-800/30">
              {mathContent}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

export default Markdown;
