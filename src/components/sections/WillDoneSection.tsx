'use client';

import React, { useState } from 'react';
import { projects } from "@/src/data/projects";
import CodeBlock from "@/src/components/CodeBlock";
import Link from "next/link";
import Markdown from "@/src/components/Markdown";
import Image from "next/image";
import ImageModal from "@/src/components/ImageModal";
import CopyMarkdownButton from "@/src/components/CopyMarkdownButton";
import { generateProjectMarkdown } from "@/src/lib/markdownGenerator";

export default function WillDoneSection({ isPrintMode = false }: { isPrintMode?: boolean }) {
  const project = projects.find((p) => p.id === 'will-done');
  const [modalState, setModalState] = useState<{ isOpen: boolean; src: string; alt: string }>({
    isOpen: false,
    src: '',
    alt: '',
  });

  if (!project) return <div>Project not found</div>;

  const markdownContent = generateProjectMarkdown(project);

  const openModal = (src: string, alt: string) => {
    setModalState({ isOpen: true, src, alt });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <section className={`p-10 md:p-16 print:p-[8mm] print:min-h-0 flex flex-col bg-zinc-950 ${isPrintMode ? 'print-break-before-page print-section-divider' : 'min-h-[297mm]'}`}>
      <CopyMarkdownButton markdown={markdownContent} />

      {/* Back Link */}
      <Link href="/" className="text-zinc-500 hover:text-white mb-12 inline-block transition-colors font-mono text-[8pt] font-bold group no-print">
        <span className="group-hover:-translate-x-1 inline-block transition-transform mr-2">←</span>
        BACK TO RESUME
      </Link>

      {/* Header */}
      <header className="mb-12 border-b-2 border-white pb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-h1 tracking-tighter text-white">
              {project.title}
            </h1>
            <a
              href="https://github.com/Jwhyee/will-done"
              target="_blank"
              rel="noopener noreferrer"
              className="no-print bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-2.5 py-1 rounded text-[8pt] font-mono border border-zinc-700 transition-colors flex items-center gap-2 mt-1"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              GITHUB
            </a>
          </div>
          <div className="text-right no-print">
            <p className="text-[10pt] font-mono text-emerald-500 font-bold">{project.overview.duration}</p>
            <p className="text-[8pt] text-zinc-100 uppercase tracking-widest">1인 개발 (기여도 100%)</p>
          </div>
        </div>
        <p className="text-[12pt] text-zinc-400 font-medium tracking-wide max-w-2xl leading-relaxed">
          <Markdown content={project.overview.description} />
        </p>
        <div className="flex flex-wrap gap-1.5 mt-8">
          {project.overview.techStack.map((tech) => (
            <span key={tech.name} className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded text-[8pt] font-mono border border-zinc-700 uppercase tracking-wider">
              {tech.name}
            </span>
          ))}
        </div>
      </header>

      {/* Technical Insights & Blog Links */}
      <section className="mb-12 px-1 no-print">
        <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest mb-4">Technical Insights & Record</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-[10.5pt] text-emerald-500 font-medium hover:text-emerald-400 transition-colors">
            <span className="text-zinc-700 text-[8pt]">▶</span>
            <Markdown content="[바이브 코딩 상세 회고 (Gemini CLI & AI Orchestration)](https://jwhy-study.tistory.com/144)" />
          </li>
          <li className="flex items-center gap-2 text-[10.5pt] text-emerald-500 font-medium hover:text-emerald-400 transition-colors">
            <span className="text-zinc-700 text-[8pt]">▶</span>
            <Markdown content="[Gemini CLI 사용기](https://jwhy-study.tistory.com/145)" />
          </li>
        </ul>
      </section>

      {/* 1. Why this project? (Motivation) */}
      <section className="mb-16 space-y-6">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          1. Why this project? (Motivation)
        </h2>
        <div className="text-zinc-300 space-y-4 leading-relaxed text-[10.5pt]">
          <div className="text-zinc-300">
            <Markdown content="갑작스러운 권고 사직을 경험하면서 **'내가 이 회사에서 뭘 했지?'**를 제대로 정리하지 못한 채 퇴사했습니다. 이직이나 연봉 협상 시점에 자신의 성과를 복기하지 못하는 건 저만의 문제가 아닐 거라고 생각했습니다. 시중의 투두를 써봤지만 두 가지가 불편했습니다." />
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 text-[10.5pt] ml-2">
            <li><Markdown content="긴급 업무가 생기면 타임라인을 손으로 다시 맞춰야 함" /></li>
            <li><Markdown content="기록은 쌓여도 무엇을 했는지 요약된 성과 문서로 연결되지 않음" /></li>
          </ul>
          <div className="text-zinc-300">
            <Markdown content="둘 다 해결하는 도구가 없어서 직접 만들었습니다. 동시에 하나의 실험이기도 했습니다. **코드를 한 줄도 작성하지 않고 AI 에이전트만으로 풀스택 데스크톱 앱을 완성**할 수 있는가, 그 가설을 직접 검증해보고 싶었습니다." />
          </div>
        </div>
      </section>

      {/* 2. Architecture & Vibe Coding Strategy */}
      <section className="mb-16 space-y-8 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          2. Architecture & Vibe Coding Strategy
        </h2>

        <div className="text-zinc-300 space-y-4 leading-relaxed text-[10.5pt]">
          <div className="text-zinc-300">
            <Markdown content="Tauri v2 + Rust를 선택한 기준은 하나였습니다. **AI 에이전트가 잘못된 코드를 작성했을 때 런타임이 아닌 컴파일 단계에서 차단할 수 있는가.** Rust의 강타입 시스템이 그 역할을 해줬고, 덕분에 에이전트가 생성한 코드를 일일이 검증하는 부담이 줄었습니다." />
          </div>
          <div className="text-zinc-300">
            <Markdown content="이 프로젝트에서 제가 직접 작성한 코드는 없습니다. 대신 세 가지 제약으로 AI가 안정적으로 작동하는 환경을 만들었습니다." />
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-400 text-[10.5pt] ml-2">
            <li><Markdown content="**SSOT(Single Soruce of Truth):** `STRUCTURE.md`를 단일 진실 공급원으로 운영, 에이전트가 항상 동일한 프로젝트 상태를 인식하도록 강제" /></li>
            <li><Markdown content="**Atomic Loop:** `PLANNING.md` 기반으로 한 번에 하나의 작업만 수행하도록 제약해 복잡도로 인한 실패를 차단" /></li>
            <li><Markdown content="**Verification Gate:** 빌드 혹은 테스트가 실패한 상태에서는 다음 작업으로 절대 넘어가지 않도록 함" /></li>
          </ul>
        </div>

        {/* App Preview Image */}
        <div
          className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1 cursor-zoom-in"
          onClick={() => openModal("/images/will-done/app-main-image.png", "Will Done App Main Interface")}
        >
          <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Application Preview & System Architecture</span>
              <span className="text-[6pt] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors uppercase no-print">Click to Enlarge</span>
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full bg-zinc-950 print:aspect-auto print:h-[55mm]">
            <Image
              src="/images/will-done/app-main-image.png"
              alt="Will Done App Main Interface"
              fill
              className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity print-img-constrain"
            />
          </div>
        </div>
      </section>


      {/* 3. Problems & Technical Solutions */}
      <section className="mb-16 space-y-10">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          3. Problems & Technical Solutions
        </h2>

        <div className="space-y-12 px-1">
          {/* Problem 1 */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
              Problem 01: Schedule Resilience
            </div>
            <h3 className="text-[12pt] font-bold text-white tracking-tight">동적인 업무 환경에서의 스케줄링 붕괴</h3>
            <div className="text-[10pt] text-zinc-400 leading-relaxed mb-4">
              <Markdown content="처음에는 긴급 업무가 추가되면 진행 중이던 태스크를 종료하고, 긴급 업무를 현재 시간에 배치한 뒤, 남은 시간만큼 새 태스크를 다시 자동으로 생성해주는 방식으로 구현했습니다. 하지만 직접 사용해보면서 기존에 진행하던 업무가 종료된 것과 진행할 업무로 분리되어 표시되다 보니, 자동으로 추가된 태스크가 잘못 추가한 건지 헷갈리기 시작했습니다." />
            </div>
            <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
              <div className="space-y-2">
                <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution: Recursive Scheduling Engine</p>
                <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                  <Markdown content="단순히 기존 태스크를 종료하고 추가하는게 아니라 태스크를 쪼개는 방식이 필요하다고 판단했습니다. 긴급 업무가 삽입되면 진행 중이던 태스크는 분리되고, 두 태스크는 `time_block` 테이블에서 `task` 테이블의 키를 참조하는 방식으로 연결 관계를 유지했습니다. 분리된 태스크는 모두 `PENDING` 상태로 표시해 긴급 태스크로 인해 멈춘 상태임을 명확하게 보여줬습니다." />
                </div>
              </div>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="space-y-4 print:break-inside-avoid">
            <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
              Problem 02: The Harness Problem
            </div>
            <h3 className="text-[12pt] font-bold text-white tracking-tight">AI 에이전트의 자율성에 따른 코드 오염</h3>
            <div className="text-[10pt] text-zinc-400 leading-relaxed mb-4">
              <Markdown content="초기에 가장 많이 실패한 지점이었습니다. AI에게 연관된 수정 사항을 3개 정도 한 번에 전달하면, 그 중 하나를 빼먹거나 원하지 않는 결과를 만들거나, 완료했다고는 했지만 빌드가 깨지는 일이 반복됐습니다. `GEMINI.md`에 단계별 규칙을 작성했지만, 이마저도 여러 작업을 한꺼번에 처리하면서 중간에 길을 잃거나 제대로 동작하지 않는 기능을 커밋하는 문제가 또 생겼습니다." />
            </div>
            <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
              <div className="space-y-2">
                <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution: Strict Harness Protocol</p>
                <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                  <Markdown content="`oh-my-opencode`를 쓰다 Rate Limit이 자주 걸리면서 협업 기능을 Gemini CLI에 직접 붙일 수 없을까 생각했습니다. 당시 공식 지원이 없어서 `oh-my-opencode`의 결과물을 기반으로 `/init`, `/plan`, `/work`, `/git` 커스텀 커맨드를 직접 만들어 Gemini CLI에 붙였습니다. 이를 통해 한 번에 한 가지 작업만 처리하고, 계획 문서를 기반으로 AI가 먼저 검증한 뒤 진행하며, 세션이 끊겨도 이어서 작업할 수 있는 구조가 만들어졌습니다. 이 과정이 Harness Protocol의 기반이 됐습니다." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Project Highlights & Results */}
      <section className="mb-16 space-y-12">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          4. Project Highlights & Results
        </h2>
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-10 text-center mx-1 print:break-inside-avoid">
          <h4 className="text-zinc-500 font-black uppercase tracking-widest mb-8 text-[9pt]">Development Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
            <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
              <p className="text-[7pt] text-zinc-100 uppercase mb-1">개발 기간</p>
              <p className="text-[11pt] font-black text-emerald-500">1주일</p>
              <p className="text-[11pt] font-black text-emerald-500">(기획 → 설계 → 배포)</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
              <p className="text-[7pt] text-zinc-100 uppercase mb-1">빌드 성공률</p>
              <p className="text-[11pt] font-black text-emerald-500">100%</p>
            </div>
            <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
              <p className="text-[7pt] text-zinc-100 uppercase mb-1">Total Commits</p>
              <p className="text-[11pt] font-black text-emerald-500">259+</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Lessons Learned */}
      <section className="mb-16 space-y-6 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          5. Lessons Learned
        </h2>
        <div className="bg-zinc-900/20 p-8 rounded-lg border border-zinc-800/50 space-y-8">
          <div className="space-y-3">
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="단순히 필요에 의해 만든 앱을 넘어, **처음 써보는 언어를 통해 AI 에이전트만으로 풀스택 데스크톱 앱을 완성할 수 있다는 가설을 증명**할 수 있었습니다. 이 과정에서 가장 크게 느낀 것은, AI를 쓸수록 **기획과 설계에 더 많은 시간을 써야 한다**는 것입니다. 코드는 AI가 쓰더라도 무엇을 만들지, 어떤 구조로 만들지는 사람이 먼저 구체적으로 정해야합니다. 지시가 모호하면 결과도 모호했고, 계획이 구체적일수록 실패가 줄었습니다. 결국 **'무엇을 AI에게 맡기고 무엇을 직접 판단할 것인가'를 설계하는 능력**이 앞으로 더 중요해질 것 같다고 생각했습니다." />
            </p>
          </div>
        </div>
      </section>

      {/* Footer Link */}
      <footer className="mt-auto pt-12 border-t border-zinc-900 flex justify-between items-center text-[7.5pt] text-zinc-700 font-mono no-print">
        <Link href="/" className="text-zinc-500 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-800">
          Return to Main Portfolio
        </Link>
        <span>DEEP DIVE / {project.title.toUpperCase()}</span>
      </footer>

      {/* Image Modal */}
      {modalState.isOpen && (
        <ImageModal
          isOpen={modalState.isOpen}
          src={modalState.src}
          alt={modalState.alt}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
