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
 * About Me Section
 */
const AboutMeSection = () => (
  <section className="mb-12">
    <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-4 uppercase tracking-tighter font-black">About Me</h2>
    <div className="space-y-2 px-1">
      {personalInfo.aboutMe.map((paragraph, i) => (
        <p key={i} className="text-body text-zinc-300 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  </section>
);

/**
 * Core Tech Stack Section (New)
 */
const TechStackSection = () => (
  <section className="mb-12">
    <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black">Core Tech Stack</h2>
    <div className="grid grid-cols-3 gap-6">
      {personalInfo.coreTechStack.map((category, i) => (
        <div key={i} className="space-y-3">
          <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">{category.category}</h3>
          <div className="flex flex-wrap gap-1.5">
            {category.techs.map((tech, ti) => (
              <span key={ti} className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded text-[8pt] font-mono border border-zinc-700">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

/**
 * Experience Section
 */
const ExperienceSection = ({ career }: { career: Career[] }) => (
  <section className="mb-12">
    <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black">Work Experience</h2>
    <div className="space-y-6">
      {career.map((item, idx) => (
        <div key={idx} className="print-break-inside-avoid">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-zinc-800 rounded flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                <Image src={item.logoPath} alt={item.company} width={32} height={32} className="object-contain" />
              </div>
              <div>
                <h3 className="text-[12pt] font-bold text-white leading-tight">{item.company}</h3>
                <p className="text-[9pt] text-zinc-500 font-mono">{item.period} ({item.duration})</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 border-l-2 border-zinc-800 ml-5 pl-8">
            {item.roles.map((role, rIdx) => (
              <div key={rIdx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[10pt] font-bold text-zinc-200">{role.title}</h4>
                  <span className="text-[8pt] font-mono text-zinc-600">{role.period}</span>
                </div>
                <p className="text-[9.5pt] text-zinc-400 leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
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
  return (
    <main className="bg-zinc-950 min-h-screen py-12 px-4 print:py-0 print:px-0">
      <PrintButton />

      {/* A4 Wrapper with forced padding */}
      <div className="max-w-[210mm] mx-auto bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0 print:max-w-none print:w-full">
        {/* Page 1: Executive Summary */}
        <section className="p-10 md:p-16 print:p-16 print:h-[297mm] flex flex-col print:break-after-page">
          <ResumeHeader />
          <AboutMeSection />
          <TechStackSection />
          <ExperienceSection career={personalInfo.career} />
          
          <div className="mt-auto pt-8 border-t border-zinc-900/50 flex justify-between items-center text-[7.5pt] text-zinc-700 font-mono print:flex no-print">
            <span>RESUME / {new Date().getFullYear()}</span>
            <span>EXECUTIVE SUMMARY - PAGE 01</span>
          </div>
        </section>
        
        {/* Page 2 onwards: Projects */}
        <section className="p-10 md:p-16 pt-0 print:p-16 print:pt-0">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-10 uppercase tracking-tighter font-black">Project Summary</h2>
          <div className="space-y-12">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
