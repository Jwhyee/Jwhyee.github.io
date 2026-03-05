### 1. 개발 환경 및 구성 요소

* **LM Studio**: 로컬 환경에서 LLM을 구동하여 코드 리뷰를 수행하는 역할 (사용 모델: `gpt-oss-20b`)
* **n8n**: GitLab과 LM Studio 사이에서 이벤트를 수신하고 데이터를 가공, API 호출을 중계하는 워크플로우 파이프라인
* **GitLab**: 코드 저장소 및 실제 코드 리뷰(Comment)가 등록되는 타겟 시스템

### 2. 단계별 세부 설정 방법

#### A. LM Studio 설정

* **모델 설치**: `gpt-oss-20b` 모델을 다운로드하여 실행합니다.
* **필수 옵션 체크**: API 응답 설정에서 `When applicable, separate reasoning_content and content in API responses` 옵션을 반드시 활성화해야 합니다. 이를 누락할 경우 LLM의 추론(Reasoning) 과정이 결과(Content)에 포함되어 n8n에서 데이터를 파싱할 때 불필요한 노이즈가 발생합니다.
* **네트워크 설정**: 외부(n8n)에서 로컬 LM Studio API를 호출할 수 있도록 포트포워딩을 구성해야 합니다.

#### B. n8n 및 GitLab Webhook 설정

1. **n8n Webhook 노드 생성**:
* 이벤트를 수신할 Webhook 노드를 생성합니다.
* 인증을 위한 Secret token으로 임의의 UUID를 지정하고, 실제 연동을 위해 'Production URL'을 사용합니다.


2. **GitLab Webhook 등록**:
* 리뷰를 적용할 GitLab Repository의 Webhook 설정에 진입합니다.
* n8n에서 발급된 URL과 UUID(Secret Token)를 입력합니다.
* Trigger 이벤트로 `Merge request events`를 체크합니다.


3. **연동 테스트**: n8n에서 워크플로우 실행을 대기 상태로 두고, GitLab에서 Test Event를 발생시켜 정상 수신 여부를 확인합니다.

### 3. n8n 워크플로우(파이프라인) 동작 원리

저자는 코드가 변경된 위치에 정확히 Inline Comment를 남기기 위해 복잡한 데이터 가공 파이프라인을 구축했습니다.

1. **이벤트 필터링**: Webhook을 통해 수신된 데이터 중 MR 상태가 `opened`이고 액션이 `open`인 경우만 처리합니다.
2. **변경 사항 조회**: GitLab API(`GET /changes`)를 호출하여 변경된 코드의 Diff 데이터를 가져옵니다.
3. **Diff 파싱 및 Hunk 분리 (가장 난이도 높은 작업)**:
* Git diff 포맷(`@@ -a,b +c,d @@`)을 파싱하여 변경된 블록(Hunk) 단위로 데이터를 분할합니다.
* 단순 삭제나 특수 라인을 필터링하고, 실제 코드가 추가된 위치(`new_line`)를 계산합니다.
* GitLab에 리뷰를 남기기 위해 필수적인 `old_path`, `new_path`, 커밋 SHA 값들을 추출하여 객체로 매핑합니다.


4. **LLM 프롬프트 구성 및 API 호출**:
* 추출된 각 Hunk 단위의 코드 변경 사항과 사전에 정의된 System Prompt를 조합합니다.
* OpenAI API 규격에 맞춰 로컬 LM Studio로 리뷰 요청을 전송합니다.


5. **결과 병합 및 리뷰 등록**:
* LLM의 응답 결과를 n8n의 Merge 노드를 사용해 기존 MR 메타데이터와 결합합니다.
* GitLab API(`POST /discussions`)를 호출하여 해당 코드 라인에 최종 Comment를 등록합니다.



### 4. 개발자 회고 및 인사이트

* **n8n의 한계 및 극복**: n8n은 HTTP 요청(LLM 호출) 노드를 통과하면 이전 노드의 데이터(MR 컨텍스트)를 잃어버리는 특성이 있습니다. 이를 해결하기 위해 Merge 노드를 활용하여 이전 상태 데이터를 유지하는 방식을 적용했습니다.
* **프롬프트 엔지니어링 전략**: 효율적인 System Prompt를 작성하기 위해 약 100회 이상의 반복 검증을 수행했습니다.
* GPT를 통해 초기 프롬프트를 작성하고, LM Studio로 결과를 테스트한 뒤, **Google AI Studio(Gemini)를 활용해 무료로 프롬프트를 고도화**하는 실용적인 파이프라인을 구축하여 비용을 절감했습니다.