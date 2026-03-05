import React from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * A simple Markdown renderer that handles:
 * 1. **bold** -> <strong>
 * 2. `code` -> <code>
 * 3. &quot; or " -> "
 */
export const Markdown = ({ content, className }: MarkdownProps) => {
  // Replace escaped quotes if any
  const processedContent = content.replace(/&quot;/g, '"');

  // Split by bold (**) and inline code (`)
  // Regex explains:
  // (\*\*.*?\*\*) matches **text**
  // (`.*?`) matches `text`
  const parts = processedContent.split(/(\*\*.*?\*\*|`.*?`)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded text-[0.9em] font-mono border border-zinc-700 mx-0.5">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </span>
  );
};

export default Markdown;
