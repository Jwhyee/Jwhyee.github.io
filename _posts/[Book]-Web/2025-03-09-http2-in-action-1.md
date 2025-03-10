---
title: "[Chapter1] 웹 기술과 HTTP"
last_modified_at: 2025-03-09T21:00:37-21:30
categories: "[Book]-Web"
tags:
  - "HTTP2 IN ACTION"
toc: true
toc_sticky: true
toc_label: "Chapter1"
toc_icon: "file"
---

HTTP/2 IN ACTION을 공부하며 정리한 글입니다.<br>
틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 웹 브라우저의 동작 방식

브라우저 URL에 `www.google.com`을 입력하면 다음과 같은 일이 일어난다.

1. DNS 서버에 `www.google.com`이라는 주소에 대한 IP 주소를 가져온다.
2. 가져온 IP 주소에 TCP 연결을 추가한다. 이를 TCP/IP라 통틀어 부르기도 한다.
    - 표준 웹 포트 : 80
    - 표준 보안 웹 포트 : 443
3. 브라우저가 웹 서버와 연결을 맺고 있다면, 주소에 대한 페이지를 요청한다.
4. 페이지를 그리기 위해 필요한 리소스를 받아온다.
    - 리소스; CSS, JS, 이미지, 폰트 등과 같은 정보
5. 페이지를 그리기 충분한 리소스를 받아오면, 브라우저는 화면에 페이지를 렌더링한다.
    - 페이지가 표시되어도, 다른 리소스를 계속 다운로드하고, 처리하는 대로 페이지를 업데이트
6. 페이지가 완전히 로드되면, 브라우저 탭에 로딩 아이콘이 사라진다.

## HTTP란 무엇인가?

HTTP는 Hypertext Transfer Protocol의 약자이다. 각 단어가 의미하는 그대로, 하이퍼 텍스트 문서를 전송하기 위한 프로토콜로 만들어졌지만, 이미지와 같은 다른 문서 유형도 전송할 수 있다. HTTP는 요청-응답 프로토콜이다. 웹 서버에 HTTP 요청을 보내면, 웹 서버 요청 받은 리소스를 포함한 메세지로 응답을 한다.

HTTP 요청 문법은 단순하다. HTTP 메소드와 요청할 리소스를 입력하면 된다. 실제로 리눅스 기반의 OS에서 테스트를 해보려면 다음과 같이 구글에 `netcat` 명령어로 요청을 보내면, 정상 응답을 하는 것을 볼 수 있다. (윈도우의 경우 PuTTY를 사용해야 함)

```bash
nc www.google.com 80
GET /
```

```http
HTTP/1.0 200 OK
...
```

위에서 설명한 것과 같이 HTTP는 요청-응답 프로토콜이므로, HTTP 요청을 보내면, 서버는 그에 맞는 응답을 응답 코드를 사용해 응답해준다.

| 코드  | 응답 상태    |
| --- | -------- |
| 1xx | 정보성      |
| 2xx | 성공       |
| 3xx | 리디렉션     |
| 4xx | 클라이언트 에러 |
| 5xx | 서버 에러    |

## HTTP의 역사

컴퓨터를 연결해서, 링크를 클릭하면 관련된 문서가 열리는 하이퍼 텍스트라는 발상은 오래 전부터 존재했지만, 1980년대부터 인터넷이 성장하면서, 이를 구현하는 것이 가능해졌다.

### HTTP/0.9

가장 첫 버전인 HTTP/0.9는 단순했다. HTTP 메소드도 GET 밖에 없었고, 서버에서 전달하는 응답 또한, HTML 문서만 전송했다. 때문에 텍스트 내용 외에는 오류인지, 성공인지 구별할 방법이 없었다.

### HTTP/1.0

HTTP/1.0은 공식 사양이 아니다. 새 옵션을 정의하는 것보다는, 문서화하기 위한 버전이다. RFC의 공식 상태와 관계 없음에도 현재 우리가 사용하는 HTTP/1.1과 유사한 형태의 주요 기능들이 추가되었다.

1. 요청 메소드 : HEAD, POST 추가
2. 선택적인 HTTP 버전 번호가 모든 메세지에 추가
    - HTTP/0.9와 호환성을 제공하기 위함
3. 요청 및 응답에 보낼 수 있는 HTTP 헤더
    - 응답에 대한 더 많은 정보를 제공하기 위함
4. 응답 성공 여부에 대한 응답 코드

> RFC의 [HTTP/1.0 문서](https://datatracker.ietf.org/doc/html/rfc1945)를 처음 보면 많이 혼란스러울 수 있다. 이 문서를 이해하는 방법에 대해 쉽게 설명한 [How to Read an RFC](https://www.mnot.net/blog/2018/07/31/read_rfc.html.brotli#where-to-start)라는 글이 있으니 참고하면 좋을 것 같다.

### HTTP/1.1

기존 HTTP/0.9에서 HTTP/1.0으로 버전이 올라가면서, 많은 변화가 있었지만, 그에 비해 HTTP/1.1은 급진적인 변경은 없었다.

1. 필수적인 호스트 헤더
    - 서버가 가상 호스팅을 더 많이 사용할 수 있도록 하기 위함
2. 지속적인 연결(Keep Alive)
    - HTTP는 단일 요청-응답 프로토콜이기 때문에, 리소스를 요청할 때마다, 연결을 열고, 닫으면, 불필요한 지연이 발생
    - 응답이 끝나도, 연결을 종료하지 않고, 계속해서 유지해, 동일한 연결에 다른 요청을 보낼 수 있도록 하기 위함
3. 요청 메소드 : PUT, DELETE 등 추가

## 정리

HTTP는 웹의 핵심 기술 중 하나이며, 단순한 텍스트 기반의 단일-요청 응답 프로토콜로 설계되었다. 브라우저는 웹 페이지 하나를 로드할 때, 여러 개의 HTTP 요청을 생성한다.
