---
title: "[Chapter7] HTTP 메소드"
last_modified_at: 2024-12-18T21:00:37-21:30
categories: [Book]-Web
tags:
  - "웹을 지탱하는 기술"
toc: true
toc_sticky: true
toc_label: "Chapter7"
toc_icon: "file"
---

웹을 지탱하는 기술을 공부하며 정리한 글입니다.<br>
틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

HTTP 메소드는 GET, POST, PUT, DELETE, HEAD, OPTION, TRACE, CONNECT 총 8개의 메소드가 존재한다. 적게 느껴질 수 있지만, 이렇게 한정적인 메소드 덕분에 HTTP와 웹이 성공할 수 있었다.

## HTTP와 CRUD

Create, Read, Update, Delete를 줄여 CRUD라고 하는데, HTTP 메소드의 POST, GET, PUT, DELETE를 이용해 충분히 커버하고 있다.

### GET - 리소스의 취득

GET은 지정한 URI의 정보를 가져오고, 가장 이용 빈도가 높은 메소드 중에 하나이다.

```
GET /list HTTP/1.1
Host: example.com
```

```
HTTP/1.1 200 OK
Content-Type: application/json

[
	{"uri": "http://example.com/list/item1"},
	{"uri": "http://example.com/list/item2"}
]
```

위와 같이 리스트에 요청을 했을 때, 서버는 지정된 URI에 대응하는 데이터를 응답으로 반환한다.

### POST - 리소스의 작성, 추가

POST는 어떤 리소스에 대한 서브 리소스의 작성할 때 사용된다.

```
POST /list HTTP/1.1
Host: example.com
Content-Type: text/plain; charset=utf-8

안녕하세요!
```

```
HTTP/1.1 201 Created
Content-Type: text/plain; charset=utf-8
Location: http://example.com/list/item5

안녕하세요!
```

위 응답 메시지에서 볼 수 있듯이, 새로운 리소스가 Created 된 것을 알 수 있다. `/list`라는 URI에서 서브 리소스를 작성하여 `/list/item5`라는 새로운 리소스가 나오게 되었다.

### PUT - 리소스의 갱신, 작성

PUT은 주로 업데이트할 때 사용한다.

```
PUT /list/item5 HTTP/1.1
Host: example.com
Content-Type: text/plain; charset=utf-8

좋은 밤이네요!
```

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

좋은 밤이네요!
```

위와 같이 요청 메시지에는 수정할 내용을 담아서 PUT으로 요청을 보내면, 서버에서는 해당 요청을 통해 수정된 결과를 응답한다.

### DELETE - 리소스의 삭제

DELETE는 이름 그대로 리소스를 삭제할 때 사용하는 메소드이다.

```
DELETE /list/item2 HTTP/1.1
Host: example.com
```

```
HTTP/1.1 200 OK
```

DELETE 요청은 따로 바디를 가지지 않는다. 때문에 204 No Content라는 응답을 사용하기도 한다.

## 멱등성과 안전성

멱등성이란, 어떤 조작을 몇 번 반복해도 결과가 동일한 것을 의미하고, 안전성이란, 조작 대상 리소스의 상태를 변화시키지 않는 것을 의미한다.

대부분의 사람들이 흔하게 착각하는 것은 바로, 상태에 대한 변화이다. 즉, 멱등성이 아닌, 안전성을 고려해 PUT과 DELETE가 멱등하지 않다라고 착각할 수 있다. 리소스에 대한 멱등성 기준으로만 보면 각 요청은 다음과 같다.

**POST**
- `/list`에서 POST 요청을 보낸다.
- `/list/item1`이라는 리소스가 나온다.
- `/list`에서 POST 요청을 보낸다.
- `/list/item2`이라는 리소스가 나온다.
- 즉, 요청을 보낼 때마다 새로운 리소스가 나오기 때문에 멱등하지 않다.

**GET**
- `/list/item1`에 GET 요청을 보낸다.
- `/list/item1`이라는 리소스가 나온다.
- `/list/item1`에 GET 요청을 보낸다.
- `/list/item1`이라는 리소스가 나온다.
- 즉, 요청을 보낼 때마다 동일한 리소스가 나오기 때문에 멱등하다.

**PUT**
- `/list/item1`에 PUT 요청을 보낸다.
- `/list/item1`이라는 리소스가 나온다.
- `/list/item1`에 PUT 요청을 보낸다.
- `/list/item1`이라는 리소스가 나온다.
- 즉, 내용을 수정하더라도, 리소스 자체는 동일하기 때문에 멱등하다.
- 하지만, 내용이 수정되었기 때문에 안전성은 없다.

**DELETE**
- `/list/item1`에 DELETE 요청을 보낸다.
- `/list/item1`가 삭제 되어있다는 결과가 나온다.
- `/list/item1`에 DELETE 요청을 보낸다.
- `/list/item1`가 삭제 되어있다는 결과가 나온다.
- 즉, 몇 번을 요청해도 `/list/item1`이라는 리소스는 삭제된 상태기 때문에 멱등하다.

서버 내부 구현에 따라 POST 또한, 멱등성을 띌 수 있는 것이다. 예를 들어, 이미 있는 리소스를 생성하려고 했을 때, 동일한 리소스를 반환한다거나, 동작을 수행했다라는 의미로만 사용하고, 실제 데이터 변경이나 추가가 없을 경우 멱등하다고 볼 수 있는 것이다.

## 정리

위 내용에 정리하지는 않았지만, PUT은 새로운 리소스를 작성할 때 사용하기도 한다. 즉, POST와 역할이 겹치는 것이다. 이는 다음과 같이 구분하면 쉽게 구분할 수 있다.

POST로 리소스를 작성할 경우, 클라이언트는 리소스의 URI를 지정할 수 없다. 위 예시에서 본 것과 같이 `/list`라는 URI에서 새로운 리소스를 생성하는 POST 요청을 서버에게 보내 `/list/item5`라는 결과가 나왔다. 이렇듯, 클라이언트가 아닌 서버에서 URI를 생성할 때 POST 요청을 사용한다.

반대로, PUT은 `/list/item5`라는 URI가 없는 상태라고 가정했을 때, `/list/item5`에 PUT 요청을 보낸다면, 서버는 해당 URI가 없는 것을 알고 새로 만들어서 201 Created 응답을 반환한다. 예를 들어, 위키와 같이, 클라이언트가 결정한 타이틀이 그대로 URI가 되는 경우가 많다. 이럴 때는 PUT 요청을 통해 리소스를 작성하는 편이 좋다.