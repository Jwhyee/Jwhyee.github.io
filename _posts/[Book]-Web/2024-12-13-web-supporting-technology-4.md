---
title: "[Chapter4] URI의 스펙"
last_modified_at: 2024-12-13T21:00:37-21:30
categories: "[Book]-Web"
tags:
  - "웹을 지탱하는 기술"
toc: true
toc_sticky: true
toc_label: "Chapter4"
toc_icon: "file"
---

웹을 지탱하는 기술을 공부하며 정리한 글입니다.<br>
틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## URI(Uniform Resource Identifier)

> URI란, 직역하자면, 유니폼 리소스 식별자이며, 웹 상에 존재하는 리소스를 표현하는 방식으로, 리소스를 통일적으로 식별하는 ID이다. 즉, 리소스를 통일적으로 식별하는 ID를 의미한다.

URI의 스펙은 [RFC 3986 - Uniform Resource Identifier (URI): Generic Syntax](https://datatracker.ietf.org/doc/html/rfc3986)에서 확인할 수 있다.

### URI의 구문

```
http://blog.example.com/entries/1
```

**스키마 (Scheme)**
- 프로토콜을 나타낸다.
- 위 주소에서 `http`를 의미하며, `://`를 기준으로 구분된다.

**호스트명 (Host Name)**
- DNS(Domain Name Service)에서 이름을 해석할 수 있는 도메인명 혹은 IP 주소를 나타낸다.
- 위 주소에서 `blog.exmaple.com`를 의미하며, 인터넷에서 반드시 일의성을 가진다.

**경로 (Path)**
- 경로는 호스트 안에서 오로지 하나의 리소스를 가리킨다.
- 위 코드에서 `/entries/1`를 의미한다.

### 절대 URI와 상대 URI

URI의 경로는, 파일 시스템과 같은 계층 구조를 가진다. `/`를 루트로 두고, 디렉토리 명을 `/`로 구분하고, 파일 이름이 필요할 경우 마지막에 연결한다. 즉, **루트로부터 전체 경로를 기술**한 것을 **절대 경로(Absolute Path)**라 칭하고, **현재 디렉터리에서 부터 경로를 기술**한 것을 **상대 경로(Relative Path)**라고 한다.

상대 경로를 사용할 경우, 현재 디렉터리를 기준으로 움직이기 때문에, 다른 디렉터리에 있는 파일을 탐색할 경우, 현재 디렉터리는 `.`, 그 상위 디렉터리는 `..`으로 나타내 표현한다.

```
http://example.com/foo/bar
```

| 상대 경로        | 절대 경로              |
| :----------- | :----------------- |
| hoge         | /foo/bar/hoge      |
| hoge/fuga    | /foo/bar/hoge/fuga |
| ./hoge       | /foo/bar/hoge      |
| ../hoge      | /foo/hoge          |
| ../hoge/fuga | /foo/hoge/fuga     |
| ../../hoge   | /hoge              |

### Base URI

> 상대 URI의 기준이 되는 URI가 어디인지 알 수 없기 때문에, 그에 대한 기점이 되는 URI를 지정하는 것이 Base URI(기본 URI)라고 부른다.

상대 URI를 절대 URI로 변환하기 위해서는 Base URI가 꼭 필요하다. 만약,  `http://example.com/foo/bar`에서 상대 URI인 `/hoge`에 접근할 경우, `/hoge`라는 URI로 이동할 수 없기 때문에 해당 페이지의 Base URI는 `http://example.com/foo/bar`가 되는 것이다.

### URI와 문자

URI에 한글이 들어간 곳을 실제로 접근하면, `%`가 붙은 이상한 문자를 볼 수 있다. 그 이유는, URI에서 ASCII만 사용할 수 있기 때문이다.

> ASCII가 해석할 수 있는 문자 : A-Za-z0-9-.~:@!&'()

실제로 `http://ko.wikipedia.org/wiki/가`에 접근하면 브라우저에서는 정상적으로 보이지만, 브라우저와 서버 사이에서는 `http://ko.wikipedia.org/wiki/%EA%B0%80` 형태로 전송된다. 이는 UTF-8에서 0xEA, 0xB0, 0x80의 3바이트로 이루어지는 것에서 기인된다.

### URI, URL, URN의 차이

URL(Uniform Resource Locator)
- 리소스의 위치(Locator)를 나타내며, 흔히 웹 주소를 의미한다.
- `https://www.example.com/page?query=123`
- `ftp://ftp.example.com/file.txt`
- `file:///C:/Users/username/file.txt`

URN(Uniform Resource Name)
- 리소스의 이름(Name)을 나타내며, 위치 정보를 포함하지 않고, 이름만 제공한다.
- `urn:isbn:978-3-16-148410-0` (특정 ISBN 책)
- `urn:uuid:123e4567-e89b-12d3-a456-426614174000` (UUID로 식별된 리소스)

URI(Uniform Resource Identifier)
- 리소스를 식별(Identifier)하기 위한 전체적인 개념이다.
- URI는 URL과 URN을 포함하는 상위 개념이다.