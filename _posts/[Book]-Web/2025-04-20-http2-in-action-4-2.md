---
title: "[Chapter4] HTTP2 프로토콜 기초 (2)"
last_modified_at: 2025-04-20T21:00:37-21:30
categories: "[Book]-Web"
tags:
  - "HTTP2 IN ACTION"
toc: true
toc_sticky: true
toc_label: "Chapter4"
toc_icon: "file"
---

HTTP/2 IN ACTION을 공부하며 정리한 글입니다.<br>
틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## HTTP/2 프레임

이전 포스팅에서 설명한 것과 같이, HTTP/2는 스트림이라는 통로를 이용해 프레임이라는 작고 정형화된 데이터 블록 전송하는 것이라고 설명했다. 그렇다면, 이 프레임이라는 것이 무엇을 구성하는지 알아보자.

기본적으로 HTTP/2의 프레임은 각각 고정 길이 헤더를 가지고, 그에 이어지는 페이로드로 구성된다. 여기서 페이로드는 해당 프레임이 실제로 전달하려는 데이터의 내용을 의미한다.

> 앞으로 나올 옥텟이라는 단어는 8비트(1바이트)를 의미하며, HTTP/2처럼 명세나 프로토콜에서는 명확함이 중요하니까, 애매하지 않게 “8비트짜리 단위”라고 확실히 말하려고 옥텟이라는 명칭을 사용한다고 한다. 예) 9옥텟 == 9바이트 == 72비트

### 프레임 헤더 형식

줄 바꿈과 공백을 스캔하여, 해석하는 HTTP/1의 비효율적인 방식 대신, HTTP/2의 프레임은 엄격하고, 잘 정의된 형식을 통해 사용할 수 있다. 때문에, 구문 분석에 용이하고, HEADERS 프레임을 0x01로 표현하는 등 메시지 크기를 줄일 수도 있다.

프레임의 헤더는 Length(24비트), Type(8비트), Flags(8비트), Reserved Bit(1비트), Stream Identifier(31비트)로 구성된다.

주요 타입은 다음과 같이 정의되어 있으며, 해당 포스팅에서 모두 설명하지는 않는다. 또한, 아래 정의하지 않은 다른 타입들이 있으니, 정확한 내용은 [RFC 7540](https://datatracker.ietf.org/doc/html/rfc7540) 문서의 Frame Definitions 부분을 확인하는 것을 추천한다.

| Type          | 바이너리 |
| ------------- | ---- |
| DATA          | 0x0  |
| HEADERS       | 0x1  |
| PRIORITY      | 0x2  |
| RST_STREAM    | 0x3  |
| SETTINGS      | 0x4  |
| PUSH_PROMISE  | 0x5  |
| PING          | 0x6  |
| GOAWAY        | 0x7  |
| WINDOW_UPDATE | 0x8  |
| CONTINUATION  | 0x9  |

### SETTINGS

SETTINGS 프레임은 SETTINGS 프레임은 연결 수준에서 양쪽이 사용할 HTTP/2의 동작 방식을 협상하는 설정 정보를 전달하는 데 사용된다. 즉, 서버와 클라이언트가 모두 보내야만 하는 프레임인 것이다.

해당 프레임의 플로우는 다음과 같다.

1. 연결 성립 직후 클라이언트가 SETTINGS 프레임 전송
2. 서버는 이를 수신 후, 필요한 설정 반영
3. 설정을 적용했다는 의미로 ACK 플래그가 설정된 SETTINGS 프레임을 다시 클라이언트에게 전송

> ACK 플래그란, 상대방의 설정을 잘 받았고, 적용 완료했다는 응답 신호인 Acknowledgment를 의미한다.

SETTINGS의 프레임 형식은 Identifier(16비트)와 Value(32비트)로 구성된다.

| 설정 항목                           | 설명                             |
| ------------------------------- | ------------------------------ |
| SETTINGS_HEADER_TABLE_SIZE      | 헤더 압축을 위한 테이블 크기 조정            |
| SETTINGS_ENABLE_PUSH            | 서버 푸시 기능 사용 여부 (1: 허용, 0: 비허용) |
| SETTINGS_MAX_CONCURRENT_STREAMS | 동시에 열 수 있는 최대 스트림 수            |
| SETTINGS_INITIAL_WINDOW_SIZE    | 플로우 제어를 위한 초기 윈도우 크기           |
| SETTINGS_MAX_FRAME_SIZE         | 하나의 프레임에 담을 수 있는 최대 페이로드 크기    |

한 설정 항목 당 6옥텟으로 구성되며, 5개의 설정을 모두 사용할 경우, 30옥텟 길이의 페이로드를 가지게 된다.

### WINDOW_UPDATE

WINDOW_UPDATE 프레임은 송신 측이 더 많은 데이터를 보내도 된다고 알리는 용도로 사용된다.

해당 프레임의 플로우는 다음과 같다.

1. 서버가 클라이언트에게 데이터를 보냄
2. 클라이언트는 수신 버퍼가 거의 다 참
3. 클라이언트는 WINDOW_UPDATE(streamId=X)를 보내면서 "앞으로 16000 바이트 더 보내도 돼"라고 알림
4. 서버는 그만큼 추가로 데이터를 전송 가능

스트림 ID가 0이면 연결 전체에 적용하게 되고, 스트림 ID가 N이면 해당 스트림에만 적용하게 된다.

### PRIORITY

PRIORITY 프레임은 스트림 간의 우선순위와 의존 관계를 정의해, 리소스 처리 순서에 힌트를 주는 역할을 한다.

해당 프레임의 플로우는 다음과 같다.

1. 클라이언트가 CSS, JS, Image를 병렬로 요청하려 함
2. 렌더링에 중요한 CSS, JS를 먼저 처리하기 위해 PRIORITY 프레임 사용
  - Stream ID: 3
    - Stream Dependency: 0 (의존 없음)
    - Weight: 220
  - Stream ID: 5
    - Stream Dependency: 3
    - Weight: 180
  - Stream ID: 7
    - Stream Dependency: 0
    - Weight: 20
3. 서버는 위 정보를 보고 가중치와 의존성을 맞춰서 보냄
  - 단, 이 순서를 지키지 않아도 무방함. 단지 힌트로만 활용

### DATA

DATA 프레임은 스트림을 통해 전송되는 실제 HTTP 메시지 본문(payload)을 담는 프레임이다.

해당 프레임의 플로우는 다음과 같다.

1. 클라이언트가 :method = POST, :path = /upload 헤더를 HEADERS 프레임으로 전송
2. 이어서 본문 데이터를 DATA 프레임으로 전송
  - HEADERS
    - Stream ID: 1
    - :method = POST
    - :path = /upload
  - DATA
    - Stream ID: 1
    - Payload: 파일의 일부 바이트
  - DATA
    - Stream ID: 1
    - Payload: 파일의 일부 바이트
    - Flags: END_STREAM
3. 마지막 DATA 프레임에 END_STREAM 플래그가 설정되어 있어 스트림 종료를 알림

즉, DATA 프레임은 클라이언트가 서버로 POST, PUT 등의 요청을 보낼 때 사용하고, 서버가 클라이언트가 그에 대한 데이터 본문을 전송할 때 사용된다. 또한, JSON으로 데이터를 보낼 경우, 한 번에 다 보내지 않고, 여러 개의 DATA 프레임으로 나눠서 보낼 수 있다.

플로우 제어(Flow Control) 대상이므로, WINDOW_UPDATE로 허용된 범위만큼만 전송 가능하며, 스트림이 종료되지 않았다는 것은 END_STREAM 플래그가 없다는 뜻이다.
