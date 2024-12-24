---
title: "[Chapter16] 쓰기 가능한 웹 서비스의 설계"
last_modified_at: 2024-12-24T21:00:37-21:30
categories: "[Book]-Web"
tags:
  - "웹을 지탱하는 기술"
toc: true
toc_sticky: true
toc_label: "Chapter16"
toc_icon: "file"
---

웹을 지탱하는 기술을 공부하며 정리한 글입니다.<br>
틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

읽기 전용 웹 서비스에 비해 쓰기 처리가 있는 웹 서비스는 고려할게 많다. 어떤 점을 주의해야할지 하나씩 살펴보자.

## 리소스의 작성

### 팩토리 리소스에 의한 작성

> 팩토리 리소스란, 리소스를 작성하기 위한 특별한 리소스를 의미한다.

```
POST / HTTP/1.1
Host: epost.go.kr
Content-Type: application/json

{
  "zipcode": "9999999",
  "adderss": {
	  "city": "경기도",
	  "state": "수원시 장안구",
	  "streetAddr": "정자천로",
	  "address2": "리소스"
  }
}
```

위 요청 메세지를 보면 알 수 있듯, `epost.go.kr`의 `/`로 `POST` 요청을 보냈다. 그러면 응답 메세지에 `epost.go.kr/{zipcode}`와 같은 상태로 응답이 오게 된다. 즉, 톱 레벨 리소스(`epost.go.kr`)를 팩토리 리소스로 지정한 것이다.

### PUT으로 직접 작성

Chapter7의 내용에서 정리했듯, PUT 또한 새로운 리소스를 만들 때 사용한다. 단, POST와 다른 점은, 리소스의 URI가 클라이언트 단에서 미리 정해서 요청을 보낸다는 것이다.

```
PUT /9999999 HTTP/1.1
Host: epost.go.kr
Content-Type: application/json

{
  "zipcode": "9999999",
  "adderss": {
	  "city": "경기도",
	  "state": "수원시 장안구",
	  "streetAddr": "정자천로",
	  "address2": "리소스"
  }
}
```

## 리소스의 갱신

리소스를 업데이트할 때에는 **벌크 업데이트**와 **파셜 업데이트** 총 2가지가 존재한다.

### 벌크 업데이트

PUT의 가장 기본적인 사용 방법 중에 하나이며, 갱신하고자하는 리소스 전체를 그대로 메세지 바디에 넣는 것이다. 아래 요청 메시지는 기존 리소스의 *수원시*를 *수원특례시*로 수정한 예이다.

```
PUT /9999999 HTTP/1.1
Host: epost.go.kr
Content-Type: application/json

{
  "zipcode": "9999999",
  "adderss": {
	  "city": "경기도",
	  "state": "수원특례시 장안구",
	  "streetAddr": "정자천로",
	  "address2": "리소스"
  }
}
```

이렇게 하나의 데이터만 수정한다고 하더라도, 갱신할 리소스 전체를 전송하는 것이 바로 벌크 업데이트이다. 이는, 클라이언트의 구현이 간단해지는 반면, 전송할 데이터가 커진다는 단점이 존재한다.

### 파셜 업데이트

위에서 본 벌크 업데이트는 네트워크 대역을 많이 소비한다. 이런 경우에는 부분적(partial)으로 요청을 보내면 네트워크 대역을 아낄 수 있다.

```
PUT /9999999 HTTP/1.1
Host: epost.go.kr
Content-Type: application/json

{
  "adderss": {
	  "state": "수원특례시 장안구",
  }
}
```

파셜 업데이트는 송수신할 데이터는 적지만, 서버에서 어떤 방식으로 처리하느냐에 따라 효율성이 낮아질 수도 있다.

## 리소스의 삭제

삭제를 설계할 때 주의해야할 것은, 삭제 대상 리소스 아래에 자식 리소스가 존재하는 경우이다. 예를 들어, 읽기 전용 웹 서비스를 설계할 때, `https://www.epost.go.kr/경기도/성남시/분당구`와 같이 계층 구조를 가질 수 있다고 했다.

만약 여기서, 경기도를 삭제한다면, 성남시 분당구는 어떻게 될까? 일반적으로 부모 리소스에 소속된 자식 리소스는 부모가 삭제되면 함께 따라서 삭제가 되어야 한다.

## 일괄처리

만약, 대량의 우편번호를 작성하거나 갱신하는 경우, 1개씩 나누어서 서버에 요청하게 되면, 커넥션이 많이 발생해 서버 퍼포먼스에 문제가 생길 가능성이 있다. 이럴 때에는 리소스를 일괄적으로 송신(일괄처리)할 수 있도록 구현해야 한다.

```
POST / HTTP/1.1
Host: epost.go.kr
Content-Type: application/json

[
	{
	  "zipcode": "9999998",
	  "adderss": {
		  "city": "경기도",
		  "state": "수원시 장안구",
		  "streetAddr": "정자천로",
		  "address2": "리소스"
	  }
	},
	{
	  "zipcode": "9999999",
	  "adderss": {
		  "city": "경기도",
		  "state": "수원시 장안구",
		  "streetAddr": "정자천로",
		  "address2": "리소스2"
	  }
	}
]
```

이렇게, 여러 개의 리소스를 새로 작성한다면 배열 형태로 묶어 서버로 전달하면, 서버에서도 대량의 데이터를 저장하도록 구현하면 된다. 수정의 경우에도 PUT을 사용하면 갱신 대상 리소스를 URI로 지정해야하기 때문에, POST를 이용해, 각각의 zipcode를 기반으로 수정을 하면 된다.

## 트랜잭션

만약, 100개 중에 97개만 성공했다면 어떻게 응답하는게 바람직할까? 바로 트랜잭션을 이용해, 모두 성공하거나, 모두 실패했다고 응답하는게 좋다. 간단한 예시를 확인해보자.

- 은행 계좌에서 5만원을 이체한다.
- 출금 계좌에서 5만원이 빠져나간다.
- 입금 계좌에 5만원을 늘린다.

만약 입금 계좌에 5만원을 늘리다가 모종의 이유로 에러가 발생해 실패한다면 어떻게 응답해야할까? 바로 아무런 처리도 하지 않는 것이다. 즉, 모두 성공하거나, 실패 시 원래 상태로 돌아간다는 것을 보증하는 것을 트랜잭션이라고 한다.

## 배타제어

> 배타제어란, 복수의 클라이언트가 동시에 하나의 리소스를 편집해 경합(Conflict)이 일어나지 않도록 하나의 클라이언트만 편집하도록 제어하는 처리를 의미한다.

배타제어의 설명대로 A, B라는 클라이언트 모두가 동시에 리소스를 갱신하면 경합 상황이 발생한다. 이 상황에서 비관적 잠금과 낙관적 잠금으로 해결해야 한다.

### 비관적 잠금

비관적이라는 말이 '앞으로의 일이 잘 안될 것이라고 보는 것'이라는 의미를 가진 것과 같이 **사용자를 신용하지 못하고, 경합이 발생하지 않도록** 하는 제어 방법 중 하나이다.

![image](https://private-user-images.githubusercontent.com/82663161/398357926-fe22d8e3-36ac-4841-8e2e-e455a241fb42.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzUwMjgwMTcsIm5iZiI6MTczNTAyNzcxNywicGF0aCI6Ii84MjY2MzE2MS8zOTgzNTc5MjYtZmUyMmQ4ZTMtMzZhYy00ODQxLThlMmUtZTQ1NWEyNDFmYjQyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDEyMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMjI0VDA4MDgzN1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTE4NmEwYjFhOWMzN2I5ZjNjYWRmMTcyM2EyYzA2ZmVmNTk5MTNiNmY0YmY5ZGFlMDdhOTY3NWU3NmU2MjE1YWQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.vmIk_1A6PGi7z1r5WAXKNGJaVYIXupQhzlQeAv6SZbg)

이 방법은 WebDAV를 사용한 것인데, 사진을 보는 것과 같이 먼저 접근한 쪽에서 해당 리소스에 대한 LOCK을 걸고, 수정을 진행한다. 만약 그 과정에서 B가 접근할 경우에는 423 Locked라는 에러를 보내, 해당 리소스가 잠겨있다는 것을 나타낼 수 있다.

### 낙관적 잠금

낙관적이라는 말이 '미래를 밝고 희망적으로 보는 것'이라는 의미를 가진 것과 같이 **경합 상황은 발생하지 않을 것이라고 판단하고 있다가, 실제로 경합이 발생했을 때, 처리**하는 것을 의미한다.

**조건부 PUT**

만약, 클라이언트 A가 먼저 수정하고 있는 상황에서 B가 수정 요청을 했다고 가정하자. 그렇다면, A가 수정 요청을 보냈을 때, B의 데이터를 어떻게 해야할지 확인을 해야한다.

즉, 클라이언트가 갱신 요청할 때, 자신이 갱신하고자 하는 리소스의 변경 여부를 확인하는 구조가 필요한 것이다. ETag 혹은 Last-Modified를 사용하는 방법이 있다.

![image2](https://private-user-images.githubusercontent.com/82663161/398360117-97a79224-0054-4753-9313-72b9d49b7519.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzUwMjgwMTcsIm5iZiI6MTczNTAyNzcxNywicGF0aCI6Ii84MjY2MzE2MS8zOTgzNjAxMTctOTdhNzkyMjQtMDA1NC00NzUzLTkzMTMtNzJiOWQ0OWI3NTE5LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDEyMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMjI0VDA4MDgzN1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTZlZDc1OWJhMmJiOTZiZmZkZDdkYzU0YWVkNjkxNzkxNTQwNjQ3ZDYzYmViZDcxYTM3OGM5NGExMWEwNGI3YTkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.WTqRW3kFROE1eDOr3orYl3AxHRq3svnO0BHplG3LkeU)

이렇게, 경합을 일으킨 사용자에게 확인한 후, 갱신 또는 삭제를 한다. 이전 갱신을 무시한 채 갑자기 변경하거나 삭제하는 것은 문제가 될 수 있으므로, 방법을 써서 클라이언트에게 경합을 확인해야 한다.
