# Project Layout Schema (LAYOUT.md)

This document defines the standard schema for project documentation in `/docs/projects` and how it maps to the frontend.

## 1. Markdown File Structure (`CV.md`)

Each project must have a `CV.md` file with the following frontmatter and structure:

```markdown
---
id: "project-id"
title: "Project Title"
role: "Lead Developer / 1인 개발"
duration: "2026.01"
techStack: ["Kotlin", "Aho-Corasick"]
summary: "A one-line summary of the project."
contribution: "100%"
teamSize: "1인 개발"
tags: ["Performance", "Algorithm"]
codeTitle: "Core Engine Logic"
codeLanguage: "kotlin"
---

## STAR

### 1. Situation
Detailed background and context of the problem.

### 2. Task
The specific objectives and challenges faced.

### 3. Action
Step-by-step technical solutions and implementation details.

### 4. Result
Quantitative and qualitative outcomes (Metrics!).
```

## 2. Supporting Files

- `README.md`: General project overview and quick start.
- `[SourceCode].kt/ts`: Actual source code snippets to be referenced or pulled into the portfolio.
- `[Images]`: Architecture diagrams or benchmarks in `/public/images/{project-id}/`.

## 3. TypeScript Interface (`src/data/projects.ts`)

```typescript
export interface Project {
  id: string;
  title: string;
  role: string;
  duration: string;
  techStack: string[];
  summary: string;
  contribution: string;
  teamSize: string;
  tags: string[];
  
  // STAR Content
  situation: string;
  task: string;
  action: string[]; // List of actions for bullet points
  result: string[]; // List of outcomes for bullet points
  
  // Technical Deep Dive
  code: {
    title: string;
    language: string;
    snippet: string;
  };
  
  // Optional detailed markdown content (if needed for deep dive pages)
  fullContent?: string;
}
```
