'use client';

import React, { useState } from 'react';
import { projects } from "@/src/data/projects";
import CodeBlock from "@/src/components/CodeBlock";
import Link from "next/link";
import Markdown from "@/src/components/Markdown";
import Image from "next/image";
import ImageModal from "@/src/components/ImageModal";
import PrintButton from "@/src/components/PrintButton";
import CopyMarkdownButton from "@/src/components/CopyMarkdownButton";
import { generateProjectMarkdown } from "@/src/lib/markdownGenerator";

export default function ProfanityFilterProjectPage() {
  const project = projects.find((p) => p.id === 'profanity-filter-library');
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
    <main className="bg-zinc-950 min-h-screen py-12 px-4 print:py-0 print:px-0">
      <PrintButton />
      <CopyMarkdownButton markdown={markdownContent} />

      <div className="max-w-[210mm] mx-auto bg-zinc-950 shadow-2xl print:shadow-none min-h-[297mm] print:min-h-0 print:max-w-none print:w-full p-10 md:p-16 print:p-16">
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
                href="https://github.com/Jwhyee/profanity-filter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-print bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-2.5 py-1 rounded text-[8pt] font-mono border border-zinc-700 transition-colors flex items-center gap-2 mt-1"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
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

        {/* 1. Why this project? (Motivation) */}
        <section className="mb-16 space-y-6">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            1. Why this project? (Motivation)
          </h2>
          <div className="text-zinc-300 space-y-4 leading-relaxed text-[10.5pt]">
            <div className="text-zinc-300">
              <Markdown content="대규모 트래픽이 발생하는 실시간 서비스에서 비속어 필터링은 단순한 기능 그 이상의 의미를 가집니다. [우아한형제들 기술 블로그의 비속어 탐지 전략](https://techblog.woowahan.com/15764/)에서 영감을 받아, 기존 `String.contains` 반복 루프나 복합 정규식(`Regex`) 기반 탐지 방식의 치명적인 한계를 분석했습니다." />
            </div>
            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
              <li><Markdown content="**성능의 선형 저하:** 금칙어 사전의 크기가 커질수록 모든 패턴을 개별적으로 검사해야 하므로 시간 복잡도가 $O(N \times K)$로 증가합니다. 특히 10,000개 이상의 패턴을 가진 복합 정규식은 실서비스 적용이 불가능할 정도의 지연을 초래합니다." /></li>
              <li><Markdown content="**변칙 우회의 취약성:** 숫자나 공백을 섞은 변칙 표현(예: &quot;시1발&quot;)을 정규식으로 처리하려면 패턴이 기하급수적으로 복잡해져 성능이 더욱 악화됩니다." /></li>
            </ul>
            <p>
              <Markdown content="이러한 성능 병목을 근본적으로 해결하고, **JMH(Java Microbenchmark Harness)**를 통해 입증된 압도적인 성능의 **아호코라식(Aho-Corasick)** 필터링 엔진을 직접 구축하고자 본 라이브러리를 기획하게 되었습니다." />
            </p>
          </div>
        </section>

        {/* 2. Architecture & Deployment */}
        <section className="mb-16 space-y-8 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            2. Architecture & Deployment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Core Architecture</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="Trie 자료구조를 기반으로 **Failure Function**을 결합한 아호코라식 알고리즘을 핵심 엔진으로 채택했습니다. 매칭 실패 시 루트로 돌아가지 않고 최장 공통 접미사 노드로 즉시 이동하여 입력 문자열을 단 한 번만 순회(**O(N)**)하도록 설계했습니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-[9pt] font-black text-zinc-500 uppercase tracking-widest">Deployment Process</h3>
              <p className="text-zinc-400 text-[10pt] leading-relaxed">
                <Markdown content="오픈소스 라이브러리로서의 범용성을 위해 **Jitpack**을 배포 저장소로 선택했습니다. GitHub 리포지토리의 태그 릴리즈를 통해 버전 관리를 수행하며, `Gradle` 및 `Maven` 환경에서 별도의 복잡한 설정 없이 의존성을 추가하여 즉시 사용 가능하도록 배포 체계를 구축했습니다." />
              </p>
            </div>
          </div>

          {/* Algorithm Diagram */}
          <div 
            className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1 cursor-zoom-in"
            onClick={() => openModal("/images/profanity-filter/aho-corasick-tree.png", "Aho-Corasick Algorithm Structure")}
          >
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[7pt] font-black text-zinc-500 uppercase tracking-[0.2em]">Aho-Corasick Algorithm & Trie Diagram</span>
                <span className="text-[6pt] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors uppercase no-print">Click to Enlarge</span>
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full bg-white">
              <Image 
                src="/images/profanity-filter/aho-corasick-tree.png"
                alt="Aho-Corasick Algorithm Structure"
                fill
                className="object-contain p-8 opacity-90 group-hover:opacity-100 transition-opacity"
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
                Problem 01: Performance Bottleneck
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">JMH 기반 측정: 10,000개 금칙어 및 100KB 페이로드 환경에서의 지연</h3>
              <div className="text-[10pt] text-zinc-400 leading-relaxed">
                <Markdown content="**10,000개의 금칙어**가 등록된 상태에서 **100KB(약 10만 자) 규모의 텍스트**를 필터링할 때, 기존 복합 정규식 엔진은 약 **85.89ms**의 응답 지연을 발생시켰습니다. 이는 대규모 트래픽 환경에서 서버 리소스를 과도하게 점유하는 치명적인 병목이었습니다." />
              </div>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="Trie 자료구조와 Failure Function을 결합하여, 금칙어 개수와 무관하게 입력 텍스트를 단 한 번만 순회하는 $O(N)$ 알고리즘을 적용했습니다. 그 결과, 동일 환경에서 **3.15ms**의 처리 속도를 달성하며 기존 대비 **약 27배의 성능 향상**을 이루어냈습니다." />
                  </div>
                </div>
                <CodeBlock 
                  language="kotlin"
                  code={`// Aho-Corasick PayloadTrie를 활용한 O(N) 고속 탐색
// 금칙어 개수가 늘어나도 입력 문자열 순회 횟수는 단 1회로 고정
val detectedBans = trie.parseText(normalizedSentence)
  .map { it.payload.word }
  .distinct()`}
                />
              </div>
            </div>

            {/* Problem 2 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 02: Index Restoration
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">변칙 우회 방어 및 원본 인덱스 복원 알고리즘 구현</h3>
              <div className="text-[10pt] text-zinc-400 leading-relaxed">
                <Markdown content="**이슈:** 숫자/공백을 섞은 변칙 표현(&quot;시 1 발&quot;) 방어를 위해 정규화(Normalization) 전처리를 도입했으나, 전처리 후 텍스트 길이가 달라져 원본 문자열을 마스킹할 때 인덱스가 어긋나는 치명적인 문제 발생." />
              </div>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="전처리 과정에서 정제된 텍스트의 각 문자가 원본 텍스트의 어느 인덱스에 해당하는지를 추적하는 **IntArray 기반의 인덱스 매핑 테이블(Index Mapping Table)**을 동적으로 생성하는 로직을 고안함." />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-500 font-black text-[8pt] uppercase tracking-widest">Result:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed italic">
                    <Markdown content="변칙 우회 패턴을 100% 탐지함과 동시에, 공간 복잡도 $O(N)$의 매핑 테이블만으로 탐지된 비속어 구간을 원본 텍스트의 정확한 위치에 오차 없이 ***로 치환하는 데 성공함." />
                  </div>
                </div>
                <CodeBlock 
                  language="kotlin"
                  code={`// Index Mapping Table 구축: 원본 인덱스 역추적 로직
val indexMap = IntArray(text.length)
var filteredIndex = 0
text.forEachIndexed { originalIndex, char ->
    if (!combinedRegex.matches(char.toString())) {
        filtered.append(char)
        indexMap[filteredIndex++] = originalIndex
    }
}

// 탐지된 비속어 구간을 원본 위치로 복원하여 마스킹
val originalStart = mapping.indexMap[ban.start]
val originalEnd = mapping.indexMap[ban.end]`}
                />
              </div>
            </div>

            {/* Problem 3 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 03: Atomic Swap & Concurrency
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">실시간 동시성 제어 및 메모리 트레이드오프 대응</h3>
              <div className="text-[10pt] text-zinc-400 leading-relaxed">
                <Markdown content="**이슈:** 정규식의 시간 복잡도($O(N \times K)$) 문제를 아호코라식($O(N)$)으로 해결했으나, 노드 객체 생성으로 인한 메모리 오버헤드 증가 및 런타임 사전 업데이트 시 스레드 경합(Race Condition) 발생 가능성 식별." />
              </div>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="빈번한 읽기(Read)와 간헐적인 쓰기(Write)가 발생하는 비속어 필터 특성에 맞춰, 사전 업데이트 시 내부 Trie를 새로 빌드하여 원자적으로 교체(**Atomic Swap**)하는 **CopyOnWrite** 패턴을 적용." />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-500 font-black text-[8pt] uppercase tracking-widest">Result (Metrics):</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed space-y-2">
                    <p><Markdown content="**성능:** JMH 벤치마크 결과 (금칙어 5,000개, 10만 자 텍스트 기준), 정규식 엔진(85.89ms) 대비 **3.15ms로 약 27배(96% 단축)**의 응답 속도 향상 달성." /></p>
                    <p><Markdown content="**안정성:** 사전 업데이트 중에도 탐색 로직의 블로킹(Lock-contention)이 발생하지 않아 **1,000 TPS 이상의 환경에서도 Thread-safe**한 탐색 성능 보장." /></p>
                  </div>
                </div>
                <CodeBlock 
                  language="kotlin"
                  code={`// AtomicReference를 활용한 Lock-free 사전 업데이트 (Atomic Swap)
private val trieReference = AtomicReference<PayloadTrie<Profanity>>()

@Synchronized
private fun rebuildTrie() {
    val newTrie = ProfanityTrie.create(customWords = currentBanned)
    trieReference.set(newTrie) // 원자적 교환 수행
}`}
                />
              </div>
            </div>

            {/* Problem 4 */}
            <div className="space-y-4 print:break-inside-avoid">
              <div className="inline-block bg-red-900/10 text-red-500 px-2 py-0.5 rounded text-[7pt] font-black uppercase tracking-widest mb-3 border border-red-500/20">
                Problem 04: False Positives
              </div>
              <h3 className="text-[12pt] font-bold text-white tracking-tight">정상 단어 내 금칙어 포함 이슈 (&quot;시발점&quot;)</h3>
              <div className="text-[10pt] text-zinc-400 leading-relaxed">
                <Markdown content="단순 문자열 제거 방식을 사용하면 의미 있는 정상 단어까지 훼손되는 문제가 발생했습니다. 비속어와 화이트리스트 간의 정교한 구분법이 필요했습니다." />
              </div>
              <div className="bg-zinc-900/30 p-5 rounded-lg border border-zinc-800/50 space-y-4">
                <div className="space-y-2">
                  <p className="text-emerald-500 font-black text-[8pt] uppercase tracking-widest">Solution Implementation:</p>
                  <div className="text-zinc-300 text-[9.5pt] leading-relaxed">
                    <Markdown content="탐지된 금칙어의 인덱스 구간과 미리 정의된 **허용 단어(White-list)**의 구간을 비교하는 **Interval Overlap** 로직을 구현했습니다. 금칙어 구간이 허용 단어 구간에 완전히 포함될 경우(예: '시발' ⊂ '시발점') 이를 정상어로 판단하여 제외함으로써 필터링의 정확도를 극대화했습니다." />
                  </div>
                </div>
                <CodeBlock 
                  language="kotlin"
                  code={`// Interval Overlap 검증 로직: 금칙어가 허용 단어 구간에 포함되면 무시
val remains = detectedBans.filterNot { ban ->
    detectedAllows.any { allow -> 
        overlaps(ban.start, ban.end, allow.start, allow.end)
    }
}

private fun overlaps(s1: Int, e1: Int, s2: Int, e2: Int) = s1 <= e2 && s2 <= e1`}
                />
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden group hover:border-emerald-500/50 transition-colors mx-1 print:break-inside-avoid">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 text-center">
              <h4 className="text-white font-black uppercase tracking-widest text-[9pt]">Performance Benchmark Results</h4>
            </div>
            <div className="p-8 space-y-8">
              <div 
                className="relative aspect-[21/9] w-full bg-zinc-950 rounded border border-zinc-800/50 overflow-hidden cursor-zoom-in"
                onClick={() => openModal("/images/profanity-filter/benchmark.png", "Performance Benchmark Results")}
              >
                <div className="absolute top-3 right-3 z-10 no-print">
                  <span className="text-[6pt] bg-zinc-900/80 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-colors uppercase">Click to Enlarge</span>
                </div>
                <Image 
                  src="/images/profanity-filter/benchmark.png"
                  alt="Regex vs Aho-Corasick Performance Comparison"
                  fill
                  className="object-contain p-4 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Library (O(N))</p>
                  <p className="text-[12pt] font-black text-emerald-500">3.15 ms</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Complex Regex</p>
                  <p className="text-[12pt] font-black text-red-900">85.89 ms</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Performance Gain</p>
                  <p className="text-[12pt] font-black text-emerald-400">27x</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <p className="text-[7pt] text-zinc-500 uppercase mb-1">Time Complexity</p>
                  <p className="text-[12pt] font-black text-blue-500">O(N)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Lessons Learned */}
        <section className="mb-16 space-y-6 print:break-inside-avoid">
          <h2 className="text-[14pt] border-l-4 border-white pl-4 mb-6 uppercase tracking-tighter font-black text-white">
            4. Lessons Learned
          </h2>
          <div className="bg-zinc-900/20 p-8 rounded-lg border border-zinc-800/50 space-y-6">
            <div className="space-y-3">
              <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
                <span className="text-emerald-500">●</span> 이론의 실제적 가치 실증
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="교과서적인 알고리즘(`Aho-Corasick`, `Trie`)이 실제 비즈니스 환경에서 발생하는 극심한 성능 병목을 어떻게 효율적으로 해결할 수 있는지 체득했습니다. 기술적 선택이 단순한 취향의 문제를 넘어 서비스의 품질(응답 속도, 리소스 절감)과 직결됨을 깊이 이해했습니다." />
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-zinc-200 font-bold flex items-center gap-2 text-[10pt]">
                <span className="text-emerald-500">●</span> 라이브러리 설계의 범용성 고려
              </h4>
              <p className="text-zinc-400 leading-relaxed text-[9.5pt]">
                <Markdown content="단순히 기능을 구현하는 것을 넘어, 다른 개발자가 내 코드를 어떻게 사용할지 고민하며 **의존성 주입(DI)**과 **설정 커스텀(Policy)**이 용이한 API 구조를 설계하는 법을 배웠습니다. `Jitpack` 배포 과정을 통해 안정적인 버전 관리와 배포 파이프라인의 중요성을 경험했습니다." />
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
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalState.isOpen}
        src={modalState.src}
        alt={modalState.alt}
        onClose={closeModal}
      />
    </main>
  );
}
