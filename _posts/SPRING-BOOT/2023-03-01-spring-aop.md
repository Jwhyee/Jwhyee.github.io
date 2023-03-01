---
title: "[Spring] - AOP를 활용한 권한 재부여"
last_modified_at: 2023-02-07T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - Spring AOP
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 개발 환경

🍃 Spring : Spring Boot 2.7.7 + Spring Security

🛠️ Java : Amazon corretto 17

설명하기 앞서 해당 포스트는 개발 과정을 기록하기 위한 글입니다. 필요한 부분은 본인 프로젝트에 맞춰서 수정해주시면 감사하겠습니다!
{: .notice--warning}

## Spring AOP란?

> AOP(Aspect Oriented Programming)는 흩어진 관심사를 모듈화할 수 있는 프로그래밍 기법 중 하나이다.

<center>
    <img src="https://user-images.githubusercontent.com/82663161/222071827-73d74b3f-886b-4e6b-a7ed-ba7b8ef59108.png">
</center>

예시로 `Member`, `Post`, `Reply`라는 `Entity`가 존재한다고 가정하자.

> Class A : MemberController<br>
> Class B : PostController<br>
> Class C : ReplyController

> 빨간색 블럭 : @GetMapping<br>
> 주황색 블럭 : @PostMapping<br>
> 파란색 블럭 : @PutMapping

위와 같은 상황이며, 비효율적인 방식이지만 특정 계정으로 `@GetMapping` 요청을 받았을 때, 매니저 페이지로 보내주는 코드가 중복적으로 들어있다고 가정하자.

그렇다면 보통 `@GetMapping`이 붙은 메소드마다 매니저인지 확인하고, 리다이렉트 시키는 코드를 작성할 것이다.
만약 매니저가 아닌 다른 회원도 매니저 페이지로 갈 수 있도록 권한 정책이 변경된다면 정말 귀찮은 일이 발생할 것이다.

이런 상황에서 AOP를 사용해 Aspect 클래스에서 여기저기에 흩어져있는 관심사들을 하나로 모듈화시켜 한 곳에서 관리한다면 전보다 훨씬 쉽게 관리를 할 수 있게 된다.

## 프로젝트 적용

> 우선 현재 프로젝트 특성상 하루 단위로 `Member`의 `Authority`가 변경되는 일이 잦다. 
> 때문에 `GetMapping`이 일어날 때마다, 회원의 권한을 재부여하는 로직을 구성했다.

### Gradle 적용

Maven은 [링크](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-aop/3.0.2)를 통해 확인 가능합니다.

```bash
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-aop:3.0.2'
}
```

### Aspect 클래스 생성

```java
@Aspect
@Component
public class AuthenticationAspect {
    
    @Pointcut("@annotation(org.springframework.web.bind.annotation.GetMapping)")
    public void getMapping() {}

    @Pointcut("!execution(* com.package.MemberController.showLoginPage())")
    public void excludeLoginPage() {}

    @Pointcut("!execution(* com.package.MemberController.showSignUpPage())")
    public void excludeSignUpPage() {}

    @Around("getMapping() && excludeLoginPage() && excludeSignUpPage()")
    public Object authenticationReset(ProceedingJoinPoint joinPoint) throws Throwable {
        
        System.out.println("메소드가 실행되기 전에 실행");

        Object result = joinPoint.proceed();

        System.out.println("메소드가 실행된 후 실행");

        return result;
    }

}

```

- Aspect 클래스는 위와 같이 구성했으며 각 어노테이션은 아래와 같다.

#### @Aspect

> 흩어진 관심사를 모듈화 시킨 곳

- 위에서 봤던 사진과 같이 하나의 `Aspect`를 정의하는 어노테이션이다.

#### @Pointcut

> 어떤 join point에서 `Advice`를 적용할 것인지 지정하는 것<br>
> * Advice : 실질적으로 어떤 일을 해야할 지에 대한 것

```java
@Pointcut("@annotation(org.springframework.web.bind.annotation.GetMapping)")
public void getMapping() {}
```

위와 같이 코드를 적용하면 `@GetMapping`이 적용된 메소드를 intercept할 수 있게 되는 것이다.

#### @Around

> 메소드의 실행 전/후에 대한 처리를 지정해주는 것

```java
@Around("getMapping() && excludeLoginPage() && excludeSignUpPage()")
public Object authenticationReset(ProceedingJoinPoint joinPoint) throws Throwable {
        
    System.out.println("메소드가 실행되기 전에 실행");
    
    Object result = joinPoint.proceed();
    
    System.out.println("메소드가 실행된 후 실행");
    
    return result;
}
```

위 코드와 같이 괄호 안에 앞서 정의한 Pointcut에 대한 메소드를 넣어주면 Advice를 적용할 조건을 사용할 수 있다.

즉, `MemberController`의 `showLoginPage()`와 `showSignUpPage()` 메소드를 제외한 
`@GetMapping`이 붙은 메소드가 실행될 때, `authenticationReset()` 메소드가 실행되는 것이다.

## 🤔 회고

이전에 AOP에 대해 잠깐 공부했던 기억이 있지만, 이번에 보니 뭔가 새로운 느낌이 들었다.<br>
기회가 된다면 AOP가 어떤 방식으로 실행되고, 어떻게 구현이 되어있는지 파헤쳐보도록 해야겠다.

가끔 특정 메소드의 실행 시간이 궁금할 때가 있었는데, 참고 블로그를 통해 적용해봐야겠다!

## 레퍼런스

- [Spring Docs](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop)
- [코드 연구소님 블로그](https://code-lab1.tistory.com/193)
