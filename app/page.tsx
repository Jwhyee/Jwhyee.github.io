"use client";

import { projects, personalInfo, DeepDive, Project, Career } from "@/src/data/projects";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';

/**
 * Page 0: Personal Introduction
 */
const IntroPage = () => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[167mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col justify-center gap-12 relative overflow-hidden">
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
    </div>
  </section>
);

/**
 * Page 0-1: Career History
 */
const CareerPage = ({ career }: { career: Career[] }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[167mm] print:break-after-page print:color-adjust-exact overflow-hidden">
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
    </div>
  </section>
);

/**
 * Page 1: Project Overview (Main)
 */
const OverviewPage = ({ project }: { project: Project }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[167mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-12 flex flex-col justify-center gap-16">
      <header>
        <h1 className="text-6xl font-black mb-4 tracking-tight">{project.title}</h1>
        <p className="text-xl text-zinc-400 font-black tracking-tight">{project.overview.description}</p>
      </header>

      <div className="grid grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-6 py-6 border-y border-zinc-800/50">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Duration</p>
              <p className="text-sm font-black text-zinc-200">{project.overview.duration}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Team Size</p>
              <p className="text-sm font-black text-zinc-200">{project.overview.teamSize}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Contribution</p>
              <p className="text-sm font-black text-zinc-200">{project.overview.contribution}</p>
            </div>
          </div>
          
          <p className="text-lg leading-relaxed text-zinc-200 font-bold">
            {project.overview.intro}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.overview.techStack.map((tech) => (
              <span
                key={tech.name}
                className="bg-zinc-900 text-zinc-400 px-3 py-1 rounded border border-zinc-800 text-[11px] font-black uppercase tracking-tight"
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
    </div>
  </section>
);

/**
 * Page 2 & 4: Technical Deep Dive - THE PROBLEM
 */
const DeepDiveProblemPage = ({ project, deepDive }: { project: Project, deepDive: DeepDive }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[167mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col justify-center gap-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <header className="flex justify-between items-start border-b border-zinc-800 pb-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em]">{project.title}</h2>
            <div className="h-4 w-px bg-zinc-800" />
            <h3 className="text-sm font-black text-red-500/80 tracking-[0.2em] uppercase">{deepDive.subSectionName}</h3>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight max-w-4xl">
            {deepDive.point.problemTitle}
          </h1>
        </div>
      </header>

      <div className="flex flex-col gap-10 relative z-10">
        <div className="max-w-4xl">
          <p className="text-lg text-zinc-400 leading-relaxed font-bold border-l-2 border-red-900/50 pl-6">
            &quot;{deepDive.point.problem}&quot;
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
              </div>
              <h4 className="text-xl font-black text-zinc-100 uppercase tracking-widest">Pain Point Identified</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {deepDive.point.symptoms?.map((symptom, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-700/50 p-5 rounded-2xl flex gap-5 items-center group hover:scale-[1.02] hover:bg-zinc-800/80 hover:border-red-500/30 transition-all duration-300 shadow-lg">
                <span className="text-xl font-black text-red-500/60 group-hover:text-red-500 transition-colors">0{i+1}</span>
                <p className="text-[15px] text-zinc-200 font-bold leading-snug tracking-tight">{symptom}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * Page 3 & 5: Technical Deep Dive - THE SOLUTION
 */
const DeepDiveSolutionPage = ({ project, deepDive }: { project: Project, deepDive: DeepDive }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[167mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col gap-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-950/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <header className="flex justify-between items-start border-b border-zinc-800 pb-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em]">{project.title}</h2>
            <div className="h-4 w-px bg-zinc-800" />
            <h3 className="text-sm font-black text-green-500/80 tracking-[0.2em] uppercase">{deepDive.subSectionName}</h3>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight max-w-4xl">
              {deepDive.point.solutionTitle}
          </h1>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8 overflow-hidden relative z-10">
        {/* Left Section: Key Logic */}
        <div className="col-span-5 flex flex-col">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-8 h-full">
            <h4 className="text-sm font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Key Architectural Logic
            </h4>
            <div className="space-y-6">
              {deepDive.point.keyLogic?.map((logic, i) => {
                  const [title, desc] = logic.split(': ');
                  return (
                      <div key={i} className="group border-l-2 border-zinc-800 pl-4 hover:border-green-900/50 transition-colors">
                          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-green-500 transition-colors">{title}</p>
                          <p className="text-[15px] text-zinc-200 font-bold leading-relaxed">{desc}</p>
                      </div>
                  );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Code Implementation */}
        <div className="col-span-7 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col rounded-3xl overflow-hidden border border-zinc-800 bg-[#080808] shadow-2xl">
            <div className="bg-[#121212] px-6 py-3 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 font-black bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700 uppercase tracking-widest">
                {deepDive.point.language}
              </span>
            </div>
            <div className="flex-1 overflow-hidden text-[11px] font-bold">
              <SyntaxHighlighter
                language={deepDive.point.language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '2rem',
                  background: 'transparent',
                  lineHeight: '1.6',
                  height: '100%',
                }}
              >
                {deepDive.point.codeSnippet}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);


/**
 * Page 4: Outcomes & Retrospective (Redesigned)
 */
const ConclusionPage = ({ project }: { project: Project }) => (
  <section className="h-screen w-full flex flex-col bg-black text-white p-12 print:h-screen print:w-[297mm] print:h-[167mm] print:break-after-page print:color-adjust-exact overflow-hidden">
    <div className="flex-1 border-2 border-zinc-800 p-10 flex flex-col justify-center gap-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <header className="relative z-10 border-b border-zinc-800 pb-8 mb-4">
        <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">{project.title}</h2>
        <h1 className="text-5xl font-black tracking-tight flex items-center gap-4 uppercase">
          Outcomes <span className="text-zinc-700">&</span> Retrospective
        </h1>
      </header>

      <div className="relative z-10 grid grid-cols-2 gap-12 overflow-hidden">
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
          className="bg-white text-black px-6 py-2 rounded-full font-black text-sm hover:bg-zinc-200 transition shadow-2xl flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          EXPORT TO PDF (16:9 Landscape)
        </button>
      </div>

      {/* Intro & Career Sections */}
      <IntroPage />
      <CareerPage career={personalInfo.career} />

      {/* Projects Sections */}
      {projects.map((project) => (
        <div key={project.id}>
          <OverviewPage project={project} />
          {project.deepDives.map((deepDive, idx) => (
            <div key={`${project.id}-deepdive-${idx}`}>
              <DeepDiveProblemPage
                project={project}
                deepDive={deepDive}
              />
              <DeepDiveSolutionPage
                project={project}
                deepDive={deepDive}
              />
            </div>
          ))}
          <ConclusionPage project={project} />
        </div>
      ))}
    </main>
  );
}
