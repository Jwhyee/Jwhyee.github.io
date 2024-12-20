---
title: "[Spring] - Spring Bean"
last_modified_at: 2023-09-04T21:00:37-21:30
categories: "[Dev]-Theory"
tags:
  - Spring
  - Bean
toc: true
toc_sticky: true
toc_label: "Spring"
toc_icon: "file"
---

## Bean

> 스프링 빈은 스프링 컨테이너에 의해 관리되는 자바 객체(POJO; Plain Old Java Object)를 의미한다.

IntelliJ로 스프링 개발을 하다보면 `@RestController`, `@Service` 등의 어노테이션을 붙여 사용한다.  
이러한 어노테이션을 붙인 클래스의 왼쪽을 보면 조그만한 콩(🫘) 같은걸 볼 수 있다. 즉, 해당 클래스를 스프링 빈에 추가했다는 것이다.

그러면 왜 빈을 등록해서 사용하는 것일까? 우리가 `@RestController` 어노테이션을 빼고 실행하면, 해당 컨트롤러에 있는 API는 사용이 불가능해진다. 스프링 애플리케이션 실행과 빈이 어떤 관계가 있는지 살펴보자!

## Spring Container

> 스프링 컨테이너의 주요 역할은 빈의 생명 주기 관리, 생성된 빈에게 추가적인 기능을 제공하는 등의 기능을 한다.

`Spring Bean`이 추가되는 공간은 바로 `Spring Container`라는 곳이다.  
어떤 과정을 거쳐 컨테이너에 빈이 등록되는지 컨테이너 생성 과정을 보면 이해할 수 있다.

### 0. 설정 파일 생성

우리가 흔히 `PasswordEncoder`를 사용하기 위해 아래 코드와 같이 등록한다.

```java
@Configuration
public class AppConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
}
```

이와 같이 구성하는 이유는, 해당 정보를 미리 등록하고 개발할 때 사용하기 위함이다. 즉, 어플리케이션이 실행되면서 스프링 컨테이너를 생성하게 되는 것이다.

```java
@Configuration
public class AppConfig {
    @Bean
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    @Bean
    public OrderService orderService() {
        return new OrderServiceImpl(
                memberRepository(), discountPolicy()
        );
    }

    @Bean
    public DiscountPolicy discountPolicy() {
        return new RateDiscountPolicy();
    }
}
```

위 코드를 예시로 이 설정 파일이 어떤 방식을 거쳐서 등록되는지 확인해보자!

### 1. 스프링 컨테이너 생성

`ApplicationContext`를 스프링 컨테이너라고 부른다.  
위에서 작성한 `AppConfig`에 대한 정보를 `AnnotationConfigApplicationContext`에게 넘겨준다.

> 우리가 실제로 이 코드를 작성하는 것이 아닌, 컴포넌트 스캔을 통해 @Configuration, @Component, @Service 등과 같은 어노테이션이 붙은 클래스를 컨테이너에 담는 것이다.

```java
// ApplicationContext 인터페이스
// AnnotationConfigApplicationContext 구현체
ApplicationContext applicationContext = 
                new AnnotationConfigApplicationContext(AppConfig.class);
```

위 코드를 통해 스프링 컨테이너가 생성된다.  
사진과 같이 스프링 빈 저장소에 스프링에서 사용할 객체를 등록해놓는 곳이라고 생각하면 된다!

<center>

![스크린샷 2023-09-13 오전 10 44 13](https://github.com/Jwhyee/Jwhyee.github.io/assets/82663161/831e3b52-2119-4e93-8b9c-f294f4639761)

</center>


### 2. 스프링 빈 등록

스프링 컨테이너가 생성될 때, 앞서 `AppConfig`에 작성했던 코드를 토대로 스프링 빈 저장소에 등록을 하게 된다.

<center>

![스크린샷 2023-09-13 오전 10 54 59](https://github.com/Jwhyee/Jwhyee.github.io/assets/82663161/3ce02815-6261-40e0-b57f-ab032023bb20)

</center>

이 때, 메소드의 이름을 빈 이름, 해당 메소드의 반환 객체를 빈 객체로 등록한다.  
빈의 이름을 메소드가 아닌 `@Bean(name="...")`을 통해서 직접 부여할 수 있지만, 절대! 중복되는 이름으로 부여하면 안 된다. 기존 빈을 덮어버리거나, 오류가 발생할 수 있다.

### 3. 스프링 빈 의존관계 설정

`memberService`에서 `memberRepository`를 의존하고, `orderService`에서 `memberRepository`와 `discountPolicy`를 의존한다.

<center>

![스크린샷 2023-09-13 오전 11 01 52](https://github.com/Jwhyee/Jwhyee.github.io/assets/82663161/75062b4a-febc-432b-973e-641c7c2ada47)![스크린샷 2023-09-13 오전 11 02 18](https://github.com/Jwhyee/Jwhyee.github.io/assets/82663161/695c6ad1-5ca0-4547-8177-05241747421e)

</center>

이렇게 컨테이너는 설정 정보를 참고해서 의존 관계를 주입하는데, 이를 DI(Dependency Injection)라고 한다.

## Reference

-   [제이온님 블로그](https://steady-coding.tistory.com/594)
-   [IT is True님 블로그](https://ittrue.tistory.com/211)
-   [김영한님 스프링 핵심 원리 - 기본편](https://www.inflearn.com/course/%EC%8A%A4%ED%94%84%EB%A7%81-%ED%95%B5%EC%8B%AC-%EC%9B%90%EB%A6%AC-%EA%B8%B0%EB%B3%B8%ED%8E%B8/dashboard)