# Project Planning
The project aims to build a high-fidelity, professional portfolio website for a Senior Backend Developer. It is uniquely designed to be exported as an A4 Portrait PDF, serving as a technical CV/Resume that showcases deep problem-solving skills using the STAR (Situation, Task, Action, Result) method.

## Core Logic & Mechanisms
The project operates through a specific data-to-UI pipeline:
1.  **Data Ingestion**: (Planned) Parse Markdown files from `/docs/projects` using `gray-matter`. (Current) Static data defined in `src/data/projects.ts` adhering to `Project` and `PersonalInfo` interfaces.
2.  **Section Generation**: `app/page.tsx` maps data to specialized components in `src/components/sections/`.
3.  **Visual Presentation**: Tailwind CSS 4 provides both web-responsive and print-optimized styles.
4.  **Print Optimization**: 
    - `@page { size: A4 portrait; margin: 15mm; }` in `app/globals.css` forces the print layout.
    - `print:break-inside-avoid` ensures that project cards or code blocks do not split across pages.
    - `react-syntax-highlighter` ensures that code snippets are readable and professional in both digital and print formats.
5.  **Technical Storytelling**: The content follows a strict anti-pattern check (no "expert", "helped", or "star ratings") and emphasizes metrics (e.g., "27x faster", "70% reduced latency").

## Versioning
- **v1.0.0 - 2026-03-10**: Initial foundational documents and project structure analysis.
