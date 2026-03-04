"use client";

import { projects, personalInfo, DeepDive, Project, Career } from "@/src/data/projects";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

/**
 * Simple Diagram Component for Architecture Visualization
 */
const Diagram = ({ type, steps }: { type: 'pipeline' | 'fallback' | 'sequence', steps: { label: string; description: string }[] }) => {
  return (
    <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
      <div className="flex flex-col gap-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex-none w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-black border border-zinc-600">
              {idx + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-zinc-200">{step.label}</span>
                {idx < steps.length - 1 && (
                  <svg className="w-3 h-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight font-bold">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Page 0: Personal Introduction
 */
const IntroPage = ({ pageNumber }: { pageNumber: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-900/30 -skew-x-12 translate-x-1/2 z-0" />

      <div className="relative z-10">
        <header className="mb-10">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-1.5 bg-white" />
            <span className="text-zinc-400 font-mono tracking-[0.4em] uppercase text-sm font-black">{personalInfo.jobTitle}</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter mb-2">
            {personalInfo.name.ko}
          </h1>
          <h2 className="text-3xl font-bold text-zinc-500 tracking-tight">
            {personalInfo.name.en}
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-8 space-y-8">
            <div className="space-y-4">
              {personalInfo.aboutMe.map((paragraph, i) => (
                <p key={i} className="text-lg leading-relaxed text-zinc-300">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-zinc-800">
              <div className="space-y-2">
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">GitHub</span>
                <a
                  href={personalInfo.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-zinc-400 font-mono text-sm truncate hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
                >
                  {personalInfo.contact.github.replace('https://', '')}
                </a>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Email</span>
                <a
                  href={`mailto:${personalInfo.contact.email}`}
                  className="block text-zinc-400 font-mono text-sm truncate hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
                >
                  {personalInfo.contact.email}
                </a>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Phone</span>
                <p className="text-zinc-400 font-mono text-sm">{personalInfo.contact.phone}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Tech Blog</span>
                <a
                  href={personalInfo.contact.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-zinc-400 font-mono text-sm truncate hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
                >
                  {personalInfo.contact.blog.replace('https://', '')}
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-4 flex justify-end items-start">
            <div className="relative w-72 h-96 group">
              <div className="absolute inset-0 border-2 border-white translate-x-4 translate-y-4 z-0 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="relative w-full h-full bg-zinc-900 overflow-hidden z-10 border border-zinc-700 grayscale-0 hover:grayscale transition-all duration-700 shadow-2xl">
                <Image
                  src={personalInfo.profileImagePath}
                  alt={personalInfo.name.ko}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        <footer className="text-xs text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-6">
            <div className="flex gap-6">
          <span className="flex items-center gap-2 tracking-widest font-black uppercase">
            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
            PAGE {String(pageNumber).padStart(2, '0')} / INTRODUCTION
          </span>
            </div>
            <div className="flex gap-4 font-black">
                <span>© 2025</span>
                <span>CRAFTED FOR EXCELLENCE</span>
            </div>
        </footer>
    </div>
  </section>
);

/**
 * Page 0-1: Career History
 */
const CareerPage = ({ career, pageNumber }: { career: Career[], pageNumber: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Professional Journey</h2>
          <h1 className="text-5xl font-black tracking-tight">Experience</h1>
        </div>
        <div className="text-right">
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest font-black">Backend Focus</p>
            <p className="text-zinc-300 text-sm font-black uppercase tracking-tight">Robust Architectures</p>
        </div>
      </header>

      <div className="flex-1 space-y-12 overflow-hidden">
        {career.map((item, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <div className="sticky top-0">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-4 overflow-hidden p-2 shadow-xl">
                  <Image src={item.logoPath} alt={item.company} width={64} height={64} className="object-contain" />
                </div>
                <h3 className="text-2xl font-black mb-1 tracking-tight">{item.company}</h3>
                <p className="text-zinc-500 font-mono text-[11px] font-black uppercase">{item.period}</p>
                <p className="text-zinc-400 text-[10px] font-black mt-1 tracking-widest uppercase">({item.duration})</p>
              </div>
            </div>

            <div className="col-span-9 space-y-8 border-l-2 border-zinc-800/50 pl-10 ml-6 relative">
              {item.roles.map((role, rIdx) => (
                <div key={rIdx} className="relative group">
                  <div className="absolute -left-[51px] top-2 w-5 h-5 rounded-full bg-black border-4 border-zinc-700 group-hover:border-white transition-colors z-10" />
                  <div className="mb-2 flex justify-between items-baseline">
                    <h4 className="text-lg font-black text-zinc-100 group-hover:text-white transition-colors">{role.title}</h4>
                    <span className="text-[11px] font-mono text-zinc-500 font-black bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase">{role.period}</span>
                  </div>
                  <p className="text-zinc-400 text-[15px] leading-relaxed font-bold max-w-3xl">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

        <footer className="text-xs text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-6">
            <div className="flex gap-6">
          <span className="flex items-center gap-2 tracking-widest font-black uppercase">
            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
            PAGE {String(pageNumber).padStart(2, '0')} / CAREER HISTORY
          </span>
            </div>
        </footer>
    </div>
  </section>
);

/**
 * Page 1: Project Overview (Main)
 */
const OverviewPage = ({ project, pageNumber }: { project: Project, pageNumber: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-8 flex flex-col justify-between">
      <header>
        <h1 className="text-6xl font-black mb-4 tracking-tight">{project.title}</h1>
        <p className="text-xl text-zinc-400 font-black tracking-tight">{project.overview.description}</p>
      </header>

      <div className="grid grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-zinc-200 font-black">
            {project.overview.intro}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.overview.techStack.map((tech) => (
              <span
                key={tech.name}
                className="bg-zinc-800 text-zinc-100 px-4 py-1.5 rounded-full text-sm font-black border border-zinc-700"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
          <div className="relative overflow-hidden rounded-xl shadow-2xl w-full border border-zinc-800 bg-zinc-900">
              {project.overview.visualPlaceholder.startsWith('/') ? (
                  <Image
                      src={project.overview.visualPlaceholder}
                      alt={project.title}
                      width={1200}
                      height={675}
                      className="w-full h-auto object-contain"
                  />
              ) : (
                  <div className="aspect-video flex items-center justify-center text-zinc-500 font-black uppercase tracking-widest">
                      {project.overview.visualPlaceholder}
                  </div>
              )}
          </div>
      </div>

      <footer className="text-xs text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-6">
        <span className="tracking-widest font-black uppercase">
          PAGE {String(pageNumber).padStart(2, '0')} / PROJECT OVERVIEW
        </span>
      </footer>
    </div>
  </section>
);

/**
 * Page 2 & 3: Technical Deep Dive (2-Column Layout)
 */
const DeepDivePage = ({ project, deepDive, pageNumber }: { project: Project, deepDive: DeepDive, pageNumber: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-8 flex flex-col gap-6 overflow-hidden">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">{project.title}</h2>
          <h3 className="text-2xl font-black text-white tracking-tight">{deepDive.subSectionName}</h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 font-black uppercase tracking-widest">
          Technical Deep Dive
        </span>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        {/* Left Column: Problem & Architecture */}
        <div className="col-span-5 flex flex-col gap-6 overflow-y-auto pr-4">
          <div className="space-y-3">
            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              The Problem
            </h4>
            <p className="text-[13px] text-zinc-200 leading-relaxed font-black">
              {deepDive.point.problem}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Strategic Solution
            </h4>
            <p className="text-[13px] text-zinc-300 leading-relaxed font-black">
              {deepDive.point.solution}
            </p>
          </div>

          {deepDive.point.diagram && (
            <div className="space-y-3">
               <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></span>
                Architecture Flow
              </h4>
              <Diagram type={deepDive.point.diagram.type} steps={deepDive.point.diagram.steps} />
            </div>
          )}
        </div>

        {/* Right Column: Implementation Code */}
        <div className="col-span-7 flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-[#1e1e1e] shadow-2xl h-full">
          <div className="bg-[#2d2d2d] px-6 py-2.5 border-b border-zinc-800 flex justify-between items-center flex-none">
            <div className="flex items-center gap-4">
              <h5 className="text-[11px] font-black text-zinc-200 uppercase tracking-widest truncate max-w-[300px]">
                {deepDive.point.title}
              </h5>
              <span className="text-[10px] font-mono text-zinc-500 font-black uppercase">impl.{deepDive.point.language === 'kotlin' ? 'kt' : deepDive.point.language === 'rust' ? 'rs' : 'ts'}</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden text-[11px] syntax-highlighter-container font-bold">
            <SyntaxHighlighter
              language={deepDive.point.language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1.25rem',
                background: 'transparent',
                lineHeight: '1.5',
                height: '100%',
              }}
            >
              {deepDive.point.codeSnippet}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <footer className="text-xs text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-6 flex-none">
        <span className="tracking-widest font-black uppercase">
          PAGE {String(pageNumber).padStart(2, '0')} / PROJECT DEEP DIVE
        </span>
      </footer>
    </div>
  </section>
);

/**
 * Page 4: Outcomes & Retrospective (Redesigned)
 */
const ConclusionPage = ({ project, pageNumber }: { project: Project, pageNumber: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <header className="relative z-10 border-b border-zinc-800 pb-8 mb-8">
        <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">{project.title}</h2>
        <h1 className="text-5xl font-black tracking-tight flex items-center gap-4 uppercase">
          Outcomes <span className="text-zinc-700">&</span> Retrospective
        </h1>
      </header>

      <div className="flex-1 grid grid-cols-2 gap-12 relative z-10 overflow-hidden">
        {/* Left Column: Measurable Achievements */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-zinc-200 tracking-tight uppercase tracking-widest">Achievements</h3>
          </div>
          
          <ul className="space-y-3 overflow-y-auto pr-4">
            {project.conclusion.outcomes.map((outcome, i) => (
              <li key={i} className="group bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-xl hover:border-zinc-600 transition-colors">
                <div className="flex gap-4">
                  <span className="text-zinc-500 font-mono text-sm pt-1 font-black">0{i + 1}</span>
                  <p className="text-zinc-300 leading-relaxed group-hover:text-white transition-colors text-base">
                    {outcome}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Reflection & Lessons Learned */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-zinc-200 tracking-tight uppercase tracking-widest">Lessons Learned</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            <svg className="absolute top-6 left-6 w-24 h-24 text-zinc-800/20 -z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V11C3.017 11.5523 2.56928 12 2.017 12H1.017V5H11.017V15C11.017 18.3137 8.33072 21 5.017 21H3.017Z" />
            </svg>
            
            <div className="relative">
              <p className="text-base text-zinc-300 leading-relaxed mb-6">
                {project.conclusion.retrospective}
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-zinc-800/50">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden shadow-2xl">
                  <Image src={personalInfo.profileImagePath} alt={personalInfo.name.ko} width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <p className="text-base font-black text-zinc-100 uppercase tracking-tight">{personalInfo.name.ko}</p>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-black">{personalInfo.jobTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-xs text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-6 mt-8 relative z-10">
        <span className="tracking-widest font-black uppercase">
          PAGE {String(pageNumber).padStart(2, '0')} / PROJECT CONCLUSION
        </span>
        <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] uppercase font-black tracking-widest text-zinc-400">
          Reflective Summary
        </div>
      </footer>
    </div>
  </section>
);

export default function Home() {
  let globalPageCounter = 1;

  return (
    <main className="bg-zinc-950 min-h-screen">
      {/* Floating Export Button */}
      <div className="fixed top-8 right-8 z-50 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-white text-black px-6 py-2 rounded-full font-black text-sm hover:bg-zinc-200 transition shadow-2xl flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          EXPORT TO PDF (A4 Landscape)
        </button>
      </div>

      {/* Intro & Career Sections */}
      <IntroPage pageNumber={globalPageCounter++} />
      <CareerPage career={personalInfo.career} pageNumber={globalPageCounter++} />

      {/* Projects Sections */}
      {projects.map((project) => (
        <div key={project.id}>
          <OverviewPage project={project} pageNumber={globalPageCounter++} />
          {project.deepDives.map((deepDive, idx) => (
            <DeepDivePage
              key={`${project.id}-deepdive-${idx}`}
              project={project}
              deepDive={deepDive}
              pageNumber={globalPageCounter++}
            />
          ))}
          <ConclusionPage project={project} pageNumber={globalPageCounter++} />
        </div>
      ))}
    </main>
  );
}
