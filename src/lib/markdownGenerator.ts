import { Project } from "@/src/data/projects";

/**
 * Project 데이터를 바탕으로 포트폴리오용 마크다운 전문을 생성합니다.
 */
export function generateProjectMarkdown(project: Project): string {
  const { title, overview, content, conclusion } = project;

  return `
# ${title}

> ${overview.description}

## 1. Overview & Motivation
- **Duration:** ${overview.duration}
- **Team:** ${overview.teamSize}
- **Contribution:** ${overview.contribution}

### Background
${content.background}

## 2. Technical Solutions
${content.solutions.map((s) => `- ${s}`).join('\n')}

## 3. Engineering Highlights: ${content.code.title}

\`\`\`${content.code.language}
${content.code.snippet.trim()}
\`\`\`

## 4. Outcomes & Impact
${conclusion.outcomes.map((o) => `- ${o}`).join('\n')}

## 5. Retrospective
${conclusion.retrospective}

---
*Technical Stack: ${overview.techStack.map(t => t.name).join(', ')}*
  `.trim();
}
