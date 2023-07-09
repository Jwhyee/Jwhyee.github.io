---
title: "[Spring] - record DTO"
last_modified_at: 2023-07-10T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - record
  - Java
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

`EFFECTIVE JAVA`를 공부하며 테스트 코드를 작성하던 중,
잘 작성한 코드에 주황줄이 떠서 확인해보니 `record`로 변환할 수 있다는 문구가 떴다.

이전에 들어본적은 있지만 프로젝트에 적용해보거나 사용해본 경험은 없어 이번 기회에 적용겸 포스팅을 해보려고 한다!

## record란?

우리는 보통 `DTO` 클래스를 작성할 때 아래와 같이 사용하며, `DTO`가 불변일 경우 `final`을 붙이기도 한다.
이 중에서도 크게 사용하지 않는 어노테이션이 있을 수 있다!

```java
@Getter @Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long id;
    private String title;
    private String content;
}
```

`record`는 우리가 사용하는 어노테이션을 자동적으로 생성해주는 정말 간단한 타입이다!

```java
public record PostRecordDto(Long id, String title, String content) { }
```

위 코드 하나로 아래와 같은 기능이 자동으로 생성되는 것이다!

```java
@Getter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
```

## 특징

`record` 타입의 특징은 아래와 같다.

1. 불변 객체
2. 생성자를 통한 값 지정

불변 객체라는 말은 생성자를 통해 값을 지정해야한다는 것과 동일하다.
자세한 내용은 아래 프로젝트에 적용하면서 살펴보도록 하자!

## 프로젝트 적용

> 아래 코드는 기본적인 CRUD에 대한 이해하기 쉽게 작성한 테스트 코드이며, 일부 어노테이션만 적용한 점 양해 부탁드립니다.

우선 아래와 같은 `record` 타입이 있다.

```java
public record PostDto(String title, String content) { }
```

아래는 `REST API`를 통해 프론트로부터 제목과 내용을 아래와 같이 받았다고 가정하자.

```json
{
  "title": "냉면 먹을 사람(1/5)",
  "content": "ㅈㄱㄴ"
}
```

그럼 아래 코드와 같이 dto 객체에 전체 생성자를 통해 자동으로 매핑이 될 것이다.

```java
@RestController
@RequestMapping("/api/post")
public class PostRestController {

    private final PostService ps;

    @PostMapping("/new")
    public HttpStatus createPost(@RequestBody PostDto dto) {
        Post savedPost = ps.savePost(dto);
        return HttpStatus.OK;
    }
    
}
```

`record` 타입의 멤버 필드는 기본적으로 `final`이 붙게된다.
때문에 `createPost()` 메소드가 호출되면
Spring 기능을 통해 아래와 같이 생성자를 통해 `dto`에 자동으로 매핑이 되는 것이다.

```java
new PostDto("냉면 먹을 사람(1/5)", "ㅈㄱㄴ")
```

데이터가 저장되는 과정에서 DTO가 가공될 일은 많이 없기 때문에 위와 같이 사용해도 무난하다.

## 특징

### 장점

1. 코드 다이어트

초반에 설명했던 내용과 같이 어노테이션이 줄어들어 코드 다이어트가 가능하다는 점이다!

```java
@Getter @Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long id;
    private String title;
    private String content;
}
```

```java
public record PostDto(Long id, String title, String content) { }
```

한 눈에 봐도 정말 간결해진 것을 확인할 수 있다.

2. 불변 객체

데이터가 오가는 중에 수정될 일이 절대 없다.
그 말은 즉 데이터의 일관성을 보장한다는 것으로 큰 장점이라고 볼 수 있다!

### 단점

1. 적은 필드에서만 유용

`record` 타입은 불변 객체이므로 생성자를 통해서만 값을 지정할 수 있다.
앞서 예시로 들은 `PostDto`와 같이 필드가 몇 없는 도메인에는 유용할 수 있으나,
`MemberSignUpDto`와 같이 많은 필드가 들어있으면 생성자를 통해 객체를 만드는 것은 어려울 것이다.

```java
public record SignUpDto(String username, String password, String phone,
                        String email, String sex, String name,
                        String role, String memberStatus) {
    
}
```

이를 인스턴스화 시키기 위해서는 아래와 같이 작성해야한다.

```java
new SignUpDto("abc123", "1234", "01012341234",
        "email@email.com", "male", "Tanziro",
        "member", "active");
```

인자의 순서가 하나라도 바뀐다면 잘못된 객체가 생성되어 저장될 수 있다는 부담이 있다.
때문에 필드가 많이 있을 경우에는 `class`를 이용해 `@Builder` 어노테이션을 통해 만드는 것이 더 효율적이다!

2. 불변 객체

장점으로 보일 수 있지만, `DTO`의 데이터가 수정되는 일은 간간히 존재한다.
데이터가 가공되어야 한다면, `record`가 아닌 `class`로 변환하여 `@Setter`를 추가하는 것이 좋을 것 같다!

3. 상속 불가

기본적으로 모든 필드가 `final`이며, 불변 객체이므로 상속할 수 없다.
사실 `DTO` 클래스 자체를 상속할 일은 없지만, 간혹 사용할 때도 있다고 생각한다.

## 🤔 회고

확실히 적은 필드를 담고 있는 `DTO` 클래스를 `record`로 변환하면 많은 이점을 볼 수 있을 것이라고 생각한다.
하지만 변경 가능성과 상속 등을 고려해서 적재적소에 적용하는 것이 가장 좋은 방법이라고 생각한다!

## 레퍼런스

- [Record VS Lombok](https://www.baeldung.com/java-record-vs-lombok)
- [Java 14 Record Keyword](https://www.baeldung.com/java-record-keyword)