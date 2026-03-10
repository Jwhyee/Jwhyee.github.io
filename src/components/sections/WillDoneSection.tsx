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
            <p className="text-[8pt] text-zinc-500 uppercase tracking-widest">1인 개발 (기여도 100%)</p>
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
            <Markdown content="커리어 성장의 가장 큰 적은 기억의 휘발성입니다. 이직, 퇴사 혹은 연봉 협상 시점에 **&quot;나는 무엇을 했는가&quot;**를 복기하지 못하는 개발자가 많습니다. 저 또한, 전 직장이 경영 악화로 권고 사직을 경험하면서,**&quot;내가 이 회사에서 이룬 것은 무엇일까?&quot;**에 대해서 제대로 정리하지 못한 채 퇴사를 맞이하게 되었습니다." />
          </div>
          <div className="text-zinc-300">
            <Markdown content="시중의 타임 트래커들은 두 가지 결정적 한계를 가집니다. 첫째, 긴급 업무 발생 시 타임라인을 **수동으로 재조정**해야 합니다. 둘째, 기록이 축적되어도 **성과 문서화로 자동 연결되지 않습니다.** 이 두 문제를 동시에 해결하는 도구가 존재하지 않았기 때문에 직접 설계했습니다." />
          </div>
          <p>
            <Markdown content="이 프로젝트는 동시에 하나의 실험이었습니다. **&quot;개발자가 코드를 한 줄도 작성하지 않고, AI 에이전트만을 오케스트레이션하여 풀스택 데스크톱 앱을 완성할 수 있는가&quot;**, 그 가설을 실증하는 것이 두 번째 목표였습니다." />
          </p>
        </div>
      </section>

      {/* 2. Architecture & Vibe Coding Strategy */}
      <section className="mb-16 space-y-8 print:break-inside-avoid">
        <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
          2. Architecture & Vibe Coding Strategy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1 mb-8">
          <div className="space-y-3">
            <h3 className="text-[9pt] font-black text-emerald-500 uppercase tracking-widest">Core Engine Architecture</h3>
            <p className="text-zinc-400 text-[10pt] leading-relaxed">
              <Markdown content="Tauri v2 + Rust를 선택한 기준은 하나였습니다. **&quot;AI 에이전트가 생성하는 코드가 런타임에서 예측 불가능하게 동작하는 것을 막을 수 있는가.&quot;** Rust의 강타입 시스템은 에이전트가 잘못된 코드를 작성했을 때 컴파일 단계에서 즉시 차단합니다. 이는 AI 오케스트레이션 환경에서 **검증 비용을 극적으로 낮추는 아키텍처 선택**이었습니다." />
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-[9pt] font-black text-emerald-500 uppercase tracking-widest">AI Orchestration Strategy</h3>
            <p className="text-zinc-400 text-[10pt] leading-relaxed">
              <Markdown content="이 프로젝트에서 제가 직접 작성한 코드는 없습니다. 대신 **구조화된 레퍼런스(SSOT)**를 통해 AI의 환각을 방지하고, **작업 범위의 물리적 제한(Atomic Loop)**으로 실패율을 낮췄으며, 빌드/테스트 실패 시 다음 단계로 진행하지 않는 **검증 게이트(Verification Gate)**를 설계하여 시스템적 안정성을 확보했습니다." />
            </p>
          </div>
        </div>

        <div className="space-y-6 px-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800/50">
              <h4 className="text-[8pt] font-black text-zinc-500 uppercase mb-2">① SSOT 설계</h4>
              <p className="text-[9pt] text-zinc-400 leading-snug">
                <Markdown content="`STRUCTURE.md`를 단일 진실 공급원으로 운영하여 에이전트가 프로젝트 상태를 동일하게 인식하도록 강제" />
              </p>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800/50">
              <h4 className="text-[8pt] font-black text-zinc-500 uppercase mb-2">② 원자 단위 제약</h4>
              <p className="text-[9pt] text-zinc-400 leading-snug">
                <Markdown content="`PLANNING.md` 기반으로 한 번에 하나의 작업만 수행하도록 제약하여 복잡도에 의한 실패 차단" />
              </p>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded border border-zinc-800/50">
              <h4 className="text-[8pt] font-black text-zinc-500 uppercase mb-2">③ 검증 게이트</h4>
              <p className="text-[9pt] text-zinc-400 leading-snug">
                <Markdown content="빌드/테스트 실패 상태에서는 다음 작업 진행을 절대 불허하는 규칙으로 컨텍스트 오염 방지" />
              </p>
            </div>
          </div>
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
              <Markdown content="**설계 판단:** 처음에는 단순히 블록을 밀고 당기는 방식으로 구현을 지시했습니다. 그러나 실제로 사용해보니 긴급 업무가 삽입될 때마다 이후의 모든 일정을 수동 조정해야 하는 도미노 현상이 발생했습니다. 이 경험이 **단순 계산기가 아니라 블록을 물리적으로 쪼개는 엔진**이 필요하다는 판단으로 이어졌습니다." />
            </div>
            <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
              <div className="space-y-2">
                <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution: Recursive Scheduling Engine</p>
                <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                  <Markdown content="실시간 일정 변화를 **재귀적 스케줄링 엔진**을 통해 자동 조정하는 로직을 구현했습니다. **재귀적 블록 분할** 기술을 적용하여 긴급 업무 발생 시 기존 블록을 원자 단위로 쪼개어 사이사이에 재배정하는 동적 시프트를 수행합니다." />
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-800/50">
                <p className="text-[9pt] text-zinc-400 leading-relaxed">
                  <Markdown content="**결과:** 타임라인 재조정 작업이 필요 없어짐" />
                </p>
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
              <Markdown content="**이 문제가 가장 많이 실패한 지점입니다.** 초기에는 AI에게 넓은 자율성을 허용했으나, 무관한 파일을 수정하여 빌드를 깨뜨리거나 중복 구현을 하는 사례가 발생했습니다. 이 실패를 통해 **검증 가능한 구조 안에서만 자율성을 허용**하는 Harness Protocol을 수립했습니다." />
            </div>
            <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
              <div className="space-y-2">
                <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution: Strict Harness Protocol</p>
                <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                  <Markdown content="잘 설계된 제약이 오히려 AI의 생산성을 높인다는 역설을 **빌드 실패율 0%** 수치로 확인했습니다. 핵심은 AI를 믿지 않는 것이 아니라, **Harness Protocol이라는 시스템적 신뢰 구조** 위에서 작업하는 것입니다." />
                </div>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-[9pt] ml-1">
                <li><Markdown content="**SSOT (Single Source of Truth):** `STRUCTURE.md`를 통한 실시간 상태 동기화" /></li>
                <li><Markdown content="**Atomic Loop:** 한 번에 하나의 원자 단위 작업만 수행하도록 제약" /></li>
                <li><Markdown content="**Verification Gate:** 빌드/테스트 성공 전에는 스테이징 절대 불가" /></li>
              </ul>
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
            <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
              <span className="text-emerald-500">●</span> 개발자의 가치는 코드 작성량이 아니다
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="Rust를 선택한 이유, 폴백 순서를 정의한 기준, Harness Protocol을 수립한 시점, 이 모든 결정이 제품의 완성도를 결정했습니다. AI는 도구일 뿐, **미래 개발자의 경쟁력은 &quot;어떤 기준으로 AI에게 무엇을 맡기느냐&quot;의 설계 역량**에 있음을 확신했습니다." />
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
              <span className="text-emerald-500">●</span> 제약은 생산성의 적이 아니다
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
              <Markdown content="SSOT, Atomic Loop, Verification Gate라는 세 가지 제약을 도입한 이후 롤백 없는 연속적인 작업 성공을 경험했습니다. **잘 설계된 규칙이 자유보다 더 빠른 결과를 만든다는 것**이 이 프로젝트의 가장 큰 수확입니다." />
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
