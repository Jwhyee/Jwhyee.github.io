---
title: "[Chapter9] HTTP 헤더"
last_modified_at: 2024-12-21T21:00:37-21:30
categories: "[Book]-Web"
tags:
  - "웹을 지탱하는 기술"
toc: true
toc_sticky: true
toc_label: "Chapter9"
toc_icon: "file"
---

웹을 지탱하는 기술을 공부하며 정리한 글입니다.<br>
틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

헤더는, 요청 및 응답 메시지의 바디에 대한 부가적인 정보, 즉, 메타 데이터를 표현한다.

## MIME 미디어 타입

메시지로 주고 받는 리소스 표현의 종류를 지정한 것을 MIME(Multipurpose Internet Mail Extensions) 미디어 타입이라고 한다.

### Content-Type - 미디어 타입 지정

클라이언트에서 서버로 요청을 보낼 때 타음과 같은 타입을 주로 사용한다.

```
# JSON 문서 형식
Content-Type: application/json
```

```
# HTML 폼 형식
Content-Type: application/x-www-form-urlencoded
```

이와 같이 바디의 내용이 어떠한 종류인가를 미디어 타입으로 나타내는 것이다. 실제로 클라이언트가 보낸 타입과 서버에서 받는 타입이 일치하지 않을 경우, `415 Unsupported Media Type`에러가 발생하게 된다.

여기서 보이는 `application`에 대한 부분을 타입이라 부르는데, 임의로 늘릴 수 없다. [RFC 2045](https://datatracker.ietf.org/doc/html/rfc2045)과 [RFC 2046](https://datatracker.ietf.org/doc/html/rfc2046)에 정의된 9가지만을 사용할 수 있다. 하지만 `/` 이후에 오는 서브 타입은 웹 사이트에서 형식으로 등록해 사용할 수 있다. 위 서브 타입의 `x-`를 붙인 것과 같이 독자적인 서브 타입도 만들 수 있다.

**charset 파라미터 - 문자 인코딩**

```
HTTP/1.1 200 OK
Content-Type: application/xml; charset=utf-8

<?xml version="1.0" encoding="utf-8">
	<test>한글 텍스트</test>
</xml>
```

클라이언트에서 위와 같은 요청을 할 때, 서버에서는 데이터가 깨져서 오는 경우가 있다. 이는, Content-Type과 관련이 있다. 기본적으로 charset을 지정하지 않을 경우 `ISO 8859-1`로 인코딩한다.

`ISO 8859-1`로 요청을 보낼 경우 한글이 깨질 우려가 있다. 또한, `text/plain`으로 데이터를 보낼 경우, Content-Type의 charset 파라미터를 우선한다. `xml`의 경우, Content-Type에 `charset` 파라미터를 지정하지 않고, xml 태그에 encoding을 지정하더라도, 결국 `ISO 8859-1`로 인코딩되는 것을 주의해야 한다.

## 청크(Chunk) 전송

```
Transfer-Encoding: chunked
```

해당 헤더를 사용하면, 사이즈를 모르는 바디를 전송할 수 있다. 예를 들어, 46바이트의 문자열을 16바이트의 청크 2개와 14바이트의 청크 1개로 분할하여 보낼 수 있는 것이다.

```
POST /test HTTP/1.1
Host: example.com
Transfer-Encoding: chunked
Content-Type: Text/plain; charset: utf-8

10
The brow fox ju

10
mps quickly over

e
the lazy dog.

0

```

이는 동작 방식과 구현 자체는 아예 다르지만, HTTP/2.0에서 사용되는 스트림(Stream)과 부분적으로 전송한다는 점이 유사하다.

## 인증

Postman에서 API 테스트를 할 때, 주로 사용하는 인증 방식 중, `Bearer`가 있다. 이를 사용하는 이유는 서버에서 인증된 사용자에 대해서만 응답을 주기 때문이다.

```
PUT /test HTTP/1.1
Host: example.com
Authorization: Baerer <access_token>
Content-Type: application/json
```

책에서 설명하는 Basic은 유저의 아이디, 비밀번호를 Base64 인코딩을 사용하여 나타낸다. 즉, Basic은 한 번 탈취 당하면, 유저의 아이디와 비밀번호 모두 노출될 수 있어 SSL, TSL를 사용한 HTTPS 통신을 사용해 통신선로 상에서 암호화할 것인지 잘 검토하고 사용해야 한다.

반면, Bearer 같은 경우, OAuth 2.0 인증 서버로 부터 발급 받은 엑세스 토큰을 사용하고, 탈취 당하더라도, 만료 시간이 존재해 Basic보다는 조금 더 안전하게 사용이 가능하다.

### HTTPS

HTTP와 SSL/TLS를 조합한 통신을 의미한다. 즉, 통신로를 암호화하고, 클라이언트와 서버 . 간주고받는 데이터를 보호하여, 도청을 방지할 목적으로 사용된다.

SSL/TLS의 특징은 다음과 같다.
- 암호화 : 공통 키(Common key) 암호에 기반한 암호화 기능
- 인증 : 공개 키(Publick key) 증명서에 기반한 인증 기능
- 변경 감지 : 해시 공통 키에 기반한 변경 감지 기능

### OAuth

통합 인증인 SSO(Single Sign-on)와 같이, 웹 서비스별로 계정을 만들어 로그인 하는 것이 아닌, 하나의 계정으로 여러 사이트를 사용하는 것과 같은 것이다. 이를 해결한 것이 바로 OpenID와 OAuth이다.

OAuth는 웹 서비스 간 데이터 교환을 위한 스펙이다. 예를 들어, 사진을 관리하고 제공하는 쪽을 Service Provider라고 부르고, 사진을 받아서 인쇄하는 쪽을 Consumer라 부를 경우, Service Provider로부터 Consumer로 데이터를 전송하는데 동의하면 데이터를 교환한다. 이를 **'인가 정보를 넘기는 기능'**이라 부른다.

## 캐시

캐시란, 서버로부터 가져온 리소스를 로컬 스토리지(하드 디스크 등)에 저장하여 재사용하는 방법을 의미한다. 로컬 스토리지에 캐싱한 데이터 자체를 '캐시'라고 부르기도 한다.

캐시를 사용하면, 유효 기간 내에 다시 접근할 때, 기존에 요청된 내용을 그대로 사용하게 된다. 이말은 곧, 업데이트 후 재접근 했을 때, 업데이트 사항을 확인할 수 없다는 내용이 되기도 한다. 때문에, 캐시를 억제하거나 유효기간을 나타내는 등의 헤더를 사용한다.

```
HTTP/1.1 200 OK
Pragma: no-cache
```

위 헤더를 사용할 경우, 서버에서 클라이언트에게 응답을 줄 때, 해당 리소스를 캐시하지 말 것을 나타낸다. 즉, 클라이언트가 해당 리소스를 다시 가져올 때, 반드시 서버를 통해 가져오는 것을 의미한다.

```
HTTP/1.1 200 OK
Expires: Thu, 11 May 2010 16:00:00 GMT
```

위 헤더를 사용할 경우, 서버는 클라이언트의 요청에 대해 2010년 5월 11일 목요일 16시(GMT)까지 캐싱을 사용하도록 하고, 그 이후에는 다시 서버에 요청해야 데이터를 주는 것을 의미한다.
