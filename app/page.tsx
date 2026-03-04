"use client";

import { projects, personalInfo, DeepDive, Project, Career } from "@/src/data/projects";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

/**
 * Page 0: Personal Introduction
 */
const IntroPage = () => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col justify-between relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-900/30 -skew-x-12 translate-x-1/2 z-0" />

      <div className="relative z-10">
        <header className="mb-8">
          <div className="flex items-center gap-6 mb-3">
            <div className="w-16 h-1 bg-white" />
            <span className="text-zinc-500 font-mono tracking-[0.3em] uppercase text-xs">{personalInfo.jobTitle}</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-1">
            {personalInfo.name.ko}
          </h1>
          <h2 className="text-2xl font-light text-zinc-400 tracking-tight">
            {personalInfo.name.en}
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-7 space-y-6">
            <div className="space-y-3">
              {personalInfo.aboutMe.map((paragraph, i) => (
                <p key={i} className="text-lg leading-relaxed text-zinc-300 font-medium">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-zinc-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">GitHub</span>
                <a
                  href={personalInfo.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-zinc-300 font-mono text-xs truncate hover:text-white transition-colors underline-offset-4 hover:underline decoration-zinc-700"
                >
                  {personalInfo.contact.github}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</span>
                <a
                  href={`mailto:${personalInfo.contact.email}`}
                  className="block text-zinc-300 font-mono text-xs truncate hover:text-white transition-colors underline-offset-4 hover:underline decoration-zinc-700"
                >
                  {personalInfo.contact.email}
                </a>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone</span>
                <p className="text-zinc-300 font-mono text-xs">{personalInfo.contact.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Blog</span>
                <a
                  href={personalInfo.contact.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-zinc-300 font-mono text-xs truncate hover:text-white transition-colors underline-offset-4 hover:underline decoration-zinc-700"
                >
                  {personalInfo.contact.blog}
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-5 flex justify-end items-start">
            <div className="relative w-64 h-80 hover:grayscale transition-all duration-500">
              <div className="absolute inset-0 border-2 border-white translate-x-3 translate-y-3 z-0" />
              <div className="relative w-full h-full bg-zinc-800 overflow-hidden z-10 border border-zinc-700">
                <Image
                  src={personalInfo.profileImagePath}
                  alt={personalInfo.name.ko}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        <footer className="text-sm text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-4">
            <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
            PAGE 01 / INTRODUCTION
          </span>
            </div>
        </footer>
    </div>
  </section>
);

/**
 * Page 0-1: Career History
 */
const CareerPage = ({ career }: { career: Career[] }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col">
      <header className="mb-8">
        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-1">Professional Experience</h2>
        <h1 className="text-4xl font-bold tracking-tight">Career Journey</h1>
      </header>

      <div className="flex-1 space-y-8 overflow-hidden">
        {career.map((item, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <div className="sticky top-0">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center mb-3 overflow-hidden p-1.5">
                  <Image src={item.logoPath} alt={item.company} width={48} height={48} className="object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-0.5">{item.company}</h3>
                <p className="text-zinc-500 font-mono text-[10px]">{item.period}</p>
                <p className="text-zinc-600 text-[9px] font-bold mt-0.5">({item.duration})</p>
              </div>
            </div>

            <div className="col-span-9 space-y-6 border-l border-zinc-800 pl-6 ml-4">
              {item.roles.map((role, rIdx) => (
                <div key={rIdx} className="relative">
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-zinc-800 border-2 border-zinc-600" />
                  <div className="mb-0.5 flex justify-between items-baseline">
                    <h4 className="text-base font-bold text-zinc-200">{role.title}</h4>
                    <span className="text-[10px] font-mono text-zinc-500">{role.period}</span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

        <footer className="text-sm text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-4">
            <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
            PAGE 02 / CAREER
          </span>
            </div>
        </footer>
    </div>
  </section>
);

/**
 * Page 1: Project Overview (Main)
 */
const OverviewPage = ({ project, pageOffset }: { project: Project, pageOffset: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact">
    <div className="flex-1 border-2 border-zinc-800 p-8 flex flex-col justify-between">
      <header>
        <h1 className="text-6xl font-bold mb-4 tracking-tight">{project.title}</h1>
        <p className="text-xl text-zinc-400 font-medium">{project.overview.description}</p>
      </header>

      <div className="grid grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-zinc-300">
            {project.overview.intro}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.overview.techStack.map((tech) => (
              <span
                key={tech.name}
                className="bg-zinc-800 text-zinc-200 px-4 py-1.5 rounded-full text-sm font-semibold border border-zinc-700"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
          <div className="relative overflow-hidden rounded-xl shadow-2xl w-full">
              {project.overview.visualPlaceholder.startsWith('/') ? (
                  <Image
                      src={project.overview.visualPlaceholder}
                      alt={project.title}
                      width={1200} // 원본 비율을 유지하기 위한 기준 값
                      height={675}
                      className="w-full h-auto object-contain" // 가로를 꽉 채우고 세로는 자동 조절
                  />
              ) : (
                  <div className="aspect-video flex items-center justify-center text-zinc-500 italic">
                      {project.overview.visualPlaceholder}
                  </div>
              )}
          </div>
      </div>

      <footer className="text-sm text-zinc-600 font-mono">
        PAGE 3 / PROJECT OVERVIEW
      </footer>
    </div>
  </section>
);

/**
 * Page 2 & 3: Technical Deep Dive (Vertical Layout)
 */
const DeepDivePage = ({ project, deepDive, pageNumber }: { project: Project, deepDive: DeepDive, pageNumber: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact">
    <div className="flex-1 border-2 border-zinc-800 p-8 flex flex-col gap-6 overflow-hidden">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em]">{project.title}</h2>
          <h3 className="text-2xl font-bold text-white tracking-tight">{deepDive.subSectionName}</h3>
        </div>
        <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          TECHNICAL DEEP DIVE
        </span>
      </header>

      {/* Top Part: Problem & Solution Description */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            The Problem / Constraint
          </h4>
          <p className="text-[14px] text-zinc-300 leading-relaxed font-medium">
            {deepDive.point.problem}
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            The Strategic Solution
          </h4>
          <p className="text-[14px] text-zinc-300 leading-relaxed">
            {deepDive.point.solution}
          </p>
        </div>
      </div>

      {/* Bottom Part: Large Code Block */}
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-[#1e1e1e] shadow-2xl">
        <div className="bg-[#2d2d2d] px-6 py-2.5 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h5 className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest">
              {deepDive.point.title}
            </h5>
            <span className="text-[10px] font-mono text-zinc-500">implementation.kt</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden text-[12px] syntax-highlighter-container">
          <SyntaxHighlighter
            language={deepDive.point.language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              lineHeight: '1.6',
              height: '100%',
            }}
          >
            {deepDive.point.codeSnippet}
          </SyntaxHighlighter>
        </div>
      </div>

      <footer className="text-sm text-zinc-600 font-mono flex justify-between items-center border-t border-zinc-800 pt-4">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
            PAGE {pageNumber + 2} / PROJECT DEEP DIVE
          </span>
        </div>
      </footer>
    </div>
  </section>
);

/**
 * Page 4: Outcomes & Retrospective
 */
const ConclusionPage = ({ project, pageNumber }: { project: Project, pageNumber: number }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[210mm] print:break-after-page print:color-adjust-exact">
    <div className="flex-1 border-2 border-zinc-800 p-8 flex flex-col justify-between">
      <header>
        <h2 className="text-xl font-bold text-zinc-500 uppercase tracking-widest mb-2">{project.title}</h2>
        <h1 className="text-5xl font-bold tracking-tight">Outcomes & Retrospective</h1>
      </header>

      <div className="grid grid-cols-12 gap-12 items-start">
        <div className="col-span-7 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-4">Measurable Achievements</h3>
            <ul className="space-y-4">
              {project.conclusion.outcomes.map((outcome, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="text-green-500 mt-1 font-bold">✓</span>
                  <p className="text-zinc-300 font-medium leading-relaxed">{outcome}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-5 bg-zinc-900 border border-zinc-800 p-8 rounded-lg relative">
          <div className="absolute -top-3 -left-3 bg-zinc-800 px-3 py-1 text-[10px] font-bold text-zinc-400 border border-zinc-700 rounded uppercase">
            Reflection
          </div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Lessons Learned</h3>
          <p className="text-zinc-400 text-sm leading-relaxed italic">
            "{project.conclusion.retrospective}"
          </p>
        </div>
      </div>

      <footer className="text-sm text-zinc-600 font-mono">
          PAGE {pageNumber + 2} / CONCLUSION
      </footer>
    </div>
  </section>
);

export default function Home() {
  return (
    <main className="bg-zinc-950 min-h-screen">
      {/* Floating Export Button */}
      <div className="fixed top-8 right-8 z-50 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-200 transition shadow-2xl flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          EXPORT TO PDF (A4 Landscape)
        </button>
      </div>

      {/* Intro & Career Sections */}
      <IntroPage />
      <CareerPage career={personalInfo.career} />

      {/* Projects Sections */}
      {projects.map((project, pIdx) => {
        // Offset by previous project pages + intro pages (2)
        const projectStartPage = (pIdx * 4) + 1;
        return (
          <div key={project.id}>
            <OverviewPage project={project} pageOffset={projectStartPage} />
            {project.deepDives.map((deepDive, idx) => (
              <DeepDivePage
                key={`${project.id}-deepdive-${idx}`}
                project={project}
                deepDive={deepDive}
                pageNumber={projectStartPage + idx + 1}
              />
            ))}
            <ConclusionPage project={project} pageNumber={projectStartPage + 3} />
          </div>
        );
      })}
    </main>
  );
}
