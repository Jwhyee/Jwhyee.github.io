---
title: "[Chapter2] - 함수로 HTTP 다루기(1)"
last_modified_at: 2025-02-07T22:10:37-23:30
categories: "[Book]-Language"
tags:
   - 객체에서 함수로
   - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter2"
toc_icon: "file"
---

**객체에서 함수로**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 프로젝트 시작하기

우리는 구현을 하기 전에 소프트웨어가 고객의 인수 조건을 만족하는지 결정하는 인수 테스트를 작성해야 한다. 하지만, 어떻게 작동할지에 대한 명확한 개념이 서 있지 않아, 잘못된 테스트를 작성해 시간을 허비할 수 있다.

> 먼저 '작동하는 골격'을 만들고, 배포하고, 테스트하는 방법을 생각해낸다. 그 후 만든 인프라를 가지고 첫 번째 의미 있는 특성에 대한 인수 테스트를 작성한다. - 테스트 주도 개발로 배우는 객체 지향 설계와 실천

### 작동하는 골격(walking skeleton)

작동하는 골격은 처음부터 끝까지 작은 기능을 한 가지 수행하는 아주 작은 시스템 구현이다. 애플리케이션의 모든 로직과 의존관계들이 붙어 있을 때보다 거의 **빈 껍데기뿐(골격 수준)일 때 문제를 해결하기 더 쉽다.**

즉, 단순히 비즈니스 로직을 짜는 것이 아니라, **서비스가 동작할 기반을 먼저 준비해야 한다**는 뜻이다.
애플리케이션의 인프라를 준비하는 것은 데이터베이스, 캐시, API Gateway 등 필요한 시스템을 설정하는 것과 같고, 인프라를 배포할 준비가 되어 있어야 한다는 것은 CI/CD, 컨테이너 환경 등을 구성하여 쉽게 배포 가능하게 하는 것을 의미한다.

## HTML 페이지를 함수적으로 제공하기

이전 장에서 우리는 사용자 스토리를 정의했지만, 어떻게 진행할지 막막할 것이다. 그렇다면, 우리가 가장 확실히 알고 있는 것부터 진행을 해보자.

- 사용자 브라우저는 우리에게 HTTP 요청을 보낼 것이다.
- 브라우저는 할 일 목록이 들어 있는 HTML 응답을 기대한다.
  - 무언가 잘못됐다면 오류에 대한 정보가 포함된 HTML 응답을 기대한다.

### 함수로서의 웹 서버

문제를 '함수형 시각'으로 바라보면, 애플리케이션은 입력을 출력으로 변환하는 '엔진'으로 작동한다. HttpHandler는 Request(입력)가 오면 Response(출력)를 반환한다. 즉, 우리는 구체적인 입력과 출력이 무엇인지만 고려하면 되는 것이다.

### Http4k

Http4k는 코틀린으로 작성한 HTTP 라이브러리이다. 함수형 방식으로 HTTP 서비스를 제공하고, 사용할 수 있게 해준다. 내부적으로는 HTTP 클라이언트 라이브러리를 감싸는 역할을 한다.

### 스파이크: 첫 번째 웹 페이지

새로운 라이브러리 사용을 구려할 때마다 '스파이크'. 즉, 이 라이브러리가 효과가 있을 것이라고 확신을 줄 수 있는 가장 간단한 일이 무엇일지 생각해보면서, 라이브러리에 대한 확신을 얻는 것이 좋다.

> 스파이크는 워드 커닝햄이 보드에 스파이크를 빠르게 박는 것에 비유한 데서 유래

우리는 Http4k를 사용해 인사말을 반환하는 웹 페이지를 작성할 것이다. 그러기 위해서는 다음과 같은 것들이 필요하다.

- HTML 인사말 문자열을 정의한다.
- HTML을 무조건 반환하는 메인 함수를 작성한다.
- 이 메인 함수로 Http4k를 시작한다.

```kotlin
val htmlPage = """  
    <html>  
        <body>  
            <h1 style="text-align: center; font-size: 3em">
	            Hello Functional World!
			</h1>  
        </body>  
    </html>  
""".trimIndent()  
  
val handler: HttpHandler = { Response(Status.OK).body(htmlPage) }  
  
fun main() {  
    handler.asServer(Jetty(8080)).start()  
}
```

위 코드만으로 SpringMVC를 사용하는 것보다 훨씬 빠르고 가볍게 서버를 띄워서 웹 페이지를 제공할 수 있다.

### Http4k DSL(도메인 특화 언어)

Http4k는 DSL을 제공하기 때문에 읽기 쉽고, 쓰기 쉬운 방식으로 빠르게 URL 경로를 정의할 수 있다. HTTP 메소드와 각 경로를 다음과 같이 바인딩하면 된다.

```kotlin
val app: HttpHandler = routes(  
    "/greetings" bind Method.GET to ::greetings,  
    "/data" bind Method.POST to ::receiveData  
)
 
fun greetings(req: Request) = Response(Status.OK).body(htmlPage)  
  
fun receiveData(req: Request) = Response(Status.CREATED)  
    .body("Received: ${req.bodyString()}")

fun main() {  
    app.asServer(Jetty(8080)).start()  
}
```

위 코드는 우리가 읽는대로 바로 해석할 수 있다. `/greetings`이라는 URL을 `HttpMethod.GET`로 바인딩하고, `::greetings`를 실행해라 정도로 쉽게 이해가 가능하다. 위에서 사용되는 `to`는 Pair 혹은 Map으로서 사용하는 것이 아닌, `PathMethod`에 정의되어 있는 `infix` 함수이다.

```kotlin
public final infix fun to(action: HttpHandler): RoutingHttpHandler {
	...
} 
```

그렇다면, `::greetings`의 타입이 `HttpHandler` 타입이어야 하는데, 이를 정의한 코드를 살펴보면 다음과 같이 되어있는 것을 볼 수 있다.

```kotlin
public typealias HttpHandler = (org.http4k.core.Request) -> org.http4k.core.Response
```

우리가 정의한 `greetings`라는 함수 또한, `Request`를 받고, `Response`를 반환하기 때문에 **바운드 멤버 참조** 형태로 사용이 가능하다.

### 위험 관리

작동하는 골격은 특별한 로직을 포함하지 않기 때문에 시스템을 올바르게 배포할 수 있다는 확인을 주고, 스파이크는 특정 기술 솔루션이 건전하며, 우리의 요구를 충족시킬 것이라는 확신을 준다.