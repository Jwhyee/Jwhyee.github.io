import { projects, personalInfo, Project, Career } from "@/src/data/projects";
import Image from 'next/image';
import Link from 'next/link';
import PrintButton from '@/src/components/PrintButton';
import CodeBlock from '@/src/components/CodeBlock';

/**
 * Common Header for PDF
 */
const ResumeHeader = () => (
  <header className="mb-10 border-b-2 border-white pb-6">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-h1 mb-1 tracking-tighter">{personalInfo.name.ko}</h1>
        <h2 className="text-h3 text-zinc-400 font-medium tracking-wide">{personalInfo.jobTitle}</h2>
      </div>
      <div className="text-right flex flex-col gap-0.5">
        <a href={personalInfo.contact.github} className="text-caption text-zinc-400 hover:text-white transition-colors leading-tight">{personalInfo.contact.github.replace('https://', '')}</a>
        <a href={`mailto:${personalInfo.contact.email}`} className="text-caption text-zinc-400 hover:text-white transition-colors leading-tight">{personalInfo.contact.email}</a>
        <span className="text-caption text-zinc-400 leading-tight">{personalInfo.contact.phone}</span>
        <a href={personalInfo.contact.blog} className="text-caption text-zinc-400 hover:text-white transition-colors leading-tight">{personalInfo.contact.blog.replace('https://', '')}</a>
      </div>
    </div>
  </header>
);

/**
 * Highlight performance metrics and key technical terms
 */
const MetricHighlight = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*|\d+(?:\.\d+)?(?:ms|배|%|fps|GB|MB)|O\(N.*?\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-black">{part.slice(2, -2)}</strong>;
        }
        if (/(\d+(?:\.\d+)?(?:ms|배|%|fps|GB|MB)|O\(N.*?\))/.test(part)) {
          return <span key={i} className="text-emerald-400 font-bold underline underline-offset-2 decoration-emerald-500/30">{part}</span>;
        }
        return part;
      })}
    </>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const deepDiveRoutes: Record<string, string> = {
    'profanity-filter-library': '/projects/profanity-filter',
    'ai-code-review': '/projects/ai-code-review',
    'will-done': '/projects/will-done'
  };

  return (
    <article className="mb-12 print:break-inside-avoid last:mb-0">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-[14pt] font-black text-white tracking-tight">{project.title}</h3>
          {deepDiveRoutes[project.id] && (
            <Link
              href={deepDiveRoutes[project.id]}
              className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all no-print"
            >
              Project Deep Dive →
            </Link>
          )}
        </div>
      </header>

      <div className="space-y-4 px-1">
        <div className="flex items-center gap-2 text-[8pt] text-zinc-500 font-mono font-bold uppercase tracking-wider">
          <span>{project.overview.duration}</span>
          <span className="text-zinc-800">/</span>
          <span>{project.overview.teamSize} ({project.overview.contribution})</span>
        </div>

        <p className="text-[10pt] text-zinc-400 leading-relaxed font-medium border-l-2 border-zinc-800 pl-4">
          <MetricHighlight text={project.overview.description} />
        </p>

        <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50">
          <ul className="space-y-2.5">
            {project.conclusion.outcomes.map((o, i) => (
              <li key={i} className="text-[9.5pt] text-zinc-300 flex gap-3 items-start leading-snug">
                <span className="text-emerald-500 font-black shrink-0 mt-0.5 text-[8pt]">✓</span>
                <span><MetricHighlight text={o} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default function Home() {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <main className="bg-zinc-950 min-h-screen py-12 px-4 print:py-0 print:px-0">
      {isDev && <PrintButton />}

      {/* A4 Wrapper with forced padding */}
      <div className="max-w-[210mm] mx-auto bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0 print:max-w-none print:w-full">
        <section className="p-10 md:p-16 print:p-16 min-h-[297mm] flex flex-col">
          <ResumeHeader />

          <div>
            <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-4 uppercase tracking-tighter font-black">Project Summary</h2>
            <div className="space-y-12">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          <div className="mt-auto pt-16 border-t border-zinc-900/50 flex justify-between items-center text-[7.5pt] text-zinc-700 font-mono print:flex no-print">
            <span>RESUME / {new Date().getFullYear()}</span>
            <span>TECHNICAL RESUME - PAGE 01</span>
          </div>
        </section>
      </div>
    </main>
  );
}
