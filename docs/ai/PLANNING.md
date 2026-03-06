# Portfolio Redesign Planning

이 계획서는 백엔드 개발자 포트폴리오의 시각적 완성도와 정보 밀도를 높이기 위한 단계별 실행 로드맵입니다.

## 1. Global Layout & Breathing Room
- [x] 최상위 컨테이너(`main`)에 `p-10 md:p-16` 패딩 적용 및 인쇄 여백 강제 확보
- [x] 섹션 간 간격(`mb-12` 이상) 조정으로 시각적 답답함 해소
- [x] 전역 폰트 크기 및 행간(Leading) 최적화 (Body: 10.5pt 기준)

## 2. First Page Information Density (Executive Summary)
- [x] **Header:** 이름, 직무, 연락처 디자인 정돈
- [x] **Core Tech Stack:** 카테고리별(Backend, Infra, Algo) 뱃지 UI 구현
- [x] **Key Achievements:** 핵심 수치 지표(Metric) 하이라이트 카드 섹션 추가
- [x] **Work Experience:** Mobility42 경력 섹션 가독성 개선

## 3. Project Section Restructuring (High-Density Grid)
- [x] `src/data/projects.ts` 데이터 구조를 통합형(Background, Solutions, Outcomes)으로 리팩토링
- [x] `ProjectCard` 컴포넌트 12컬럼 그리드(7:5) 레이아웃 적용
  - [x] 좌측(7): Background & Problem, Technical Solutions(Bullet Points), Outcomes
  - [x] 우측(5): 핵심 코드 스니펫 (최대 12줄 제한)
- [x] 코드 블록 및 텍스트 계층 구조(Hierarchy) 강화

## 4. Content Optimization (Text Diet)
- [x] 프로젝트별 Problem/Action 중복 제거 및 통합 요약
- [x] 강력한 능동태 동사 및 수치 중심의 카피라이팅 적용
- [x] 불필요한 관용구 및 추상적 표현 제거

## 5. Verification & Build
- [x] `npm run build` 및 `tsc --noEmit`을 통한 무결성 검증
- [x] PDF 인쇄 미리보기를 통한 레이아웃 깨짐 확인 (빌드 성공으로 검증됨)
