# OVERVIEW
A professional portfolio website for a Senior Backend Developer (Kotlin & Spring Boot focus).
Optimized for A4 portrait PDF export to demonstrate technical problem-solving depth.

- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, react-syntax-highlighter, gray-matter.
- **Goal**: High-fidelity PDF output that preserves dark mode aesthetics while ensuring perfect pagination for technical reviews.

# STRUCTURE
```text
/Users/jwhy/dev/git/jwhyee.github.io/
├── .github/workflows/nextjs-deploy.yml    # CI/CD (GitHub Pages)
├── app/                                    # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css                         # Print optimization CSS
│   ├── layout.tsx                          # Root layout (fonts, metadata)
│   ├── page.tsx                            # Main portfolio page
│   ├── print/                              # PDF-only view
│   └── projects/                           # Project detail pages (legacy)
├── docs/                                   # Documentation (R/W for AI, R-O for content)
│   ├── ai/                                 # AI Guidelines, Planning, Interview Questions
│   │   ├── GUIDE.md                        # Master Portfolio Guide
│   │   ├── PLANNING.md                     # Technical roadmaps
│   │   └── LAYOUT.md                       # (Implicit) Layout blueprint
│   └── projects/                           # Raw project documentation (READ-ONLY)
│       ├── ai-code-review/
│       ├── profanity-filter-library/
│       └── will-done/
├── public/                                 # Static assets (images, logos)
├── src/                                    # Source code
│   ├── components/                         # UI Components
│   │   ├── CodeBlock.tsx                   # syntax-highlighter wrapper
│   │   ├── CopyMarkdownButton.tsx
│   │   ├── Markdown.tsx                    # React-markdown wrapper
│   │   ├── PrintButton.tsx
│   │   └── sections/                       # Portfolio specific sections
│   ├── data/                               # Static data & TypeScript interfaces
│   │   └── projects.ts                     # Core project and personal data
│   └── lib/                                # Utilities
│       └── markdownGenerator.ts            # Markdown-to-PDF/HTML logic
├── package.json                            # Dependency management
├── tsconfig.json                           # TS configuration
└── GEMINI.md                               # AI Agent Directives
```

# WHERE TO LOOK
| Task / Workflow | Exact File Path |
| :--- | :--- |
| **Modify PDF Layout** | `docs/ai/GUIDE.md`, `app/globals.css` |
| **Update Project Data** | `src/data/projects.ts` |
| **Adjust Typography** | `docs/ai/GUIDE.md`, `app/layout.tsx` |
| **Change Code Styling** | `src/components/CodeBlock.tsx` |
| **Update Personal Info** | `src/data/projects.ts` (personalInfo) |
| **Add New Project** | `docs/ai/{project}/QUESTION.md`, `src/data/projects.ts` |

# CODE MAP
| Symbol | Type | Location |
| :--- | :--- | :--- |
| `PersonalInfo` | Interface | `src/data/projects.ts` |
| `Project` | Interface | `src/data/projects.ts` |
| `CodeBlock` | Component | `src/components/CodeBlock.tsx` |
| `markdownToHtml` | Function | `src/lib/markdownGenerator.ts` (Implicit) |
| `ResumeSection` | Component | `src/components/sections/ResumeSection.tsx` |

# CONVENTIONS (THIS PROJECT)
- **PDF Optimization**: Use `print:break-inside-avoid` and `print:color-adjust-exact`.
- **Unit System**: Prefer `mm` and `pt` for print styles, `px` and `rem` for web.
- **Copywriting**: No passive voice. Use STAR (Situation, Task, Action, Result) with metrics.
- **Directory Permissions**: `/docs/projects` is strictly READ-ONLY.
- **Code Highlighting**: `react-syntax-highlighter` with `vscDarkPlus` theme.

# ANTI-PATTERNS / TECH DEBT
- **Static Data**: Project data is currently hardcoded in `src/data/projects.ts` instead of being parsed from `/docs/projects` MD files as planned.
- **Hydration Mismatch**: Potential risk with syntax highlighter or print-only classes if not handled carefully.
- **Placeholder Usage**: Explicitly use `[PLACEHOLDER]` for missing assets.

# COMMANDS
- **Run Dev**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: `npx tsc --noEmit`

# NOTES
- This is a "Zero-Budget" professional portfolio, emphasizing engineering discipline over flashy animations.
- Every layout decision must be verified by "Print Preview" (A4 Portrait).
