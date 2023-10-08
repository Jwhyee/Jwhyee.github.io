---
title: "[JUnit5] - @Nested 테스트 순서 지정"
last_modified_at: 2023-10-07T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - Order
  - Nested
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 🛠️ 개발 환경

🍃 Spring : Spring Boot 2.7.8

🛠️ Java : Amazon corretto 17

## @Nested

> @Nested is used to signal that the annotated class is a nested, non-static test class (i.e., an inner class) that can share setup and state with an instance of its enclosing class. 
> The enclosing class may be a top-level test class or another @Nested test class, and nesting can be arbitrarily deep.

> non-static 클래스(내부 클래스)임을 시그널링하기 위해 사용되며, 최상위 테스트 클래스를 사용할 때 선언한다.

즉, 한 테스트에 내부 클래스를 생성해 여러 테스트를 묶기 위해 사용하는 것이다.

```java
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class ControllerTest {
    
    ...
    
    @Test
    @DisplayName("저장 실패 - 제목 데이터 누락")
    void saveTest1(){
        ...
    }

    @Test
    @DisplayName("저장 실패 - 내용 데이터 누락")
    void saveTest2(){
        ...
    }

    @Test
    @DisplayName("저장 성공")
    void saveTest3(){
        ...
    }

    @Test
    @DisplayName("수정 실패 - 제목 데이터 누락")
    void updateTest1(){
        ...
    }
}
```

![스크린샷1](https://github.com/Jwhyee/effective-java-study/assets/82663161/d5c632b1-baad-4a78-ab8f-6a4f2da5b9d6)

위 코드와 한 테스트 클래스에 여러 테스트가 들어가게 된다.
이럴 경우 위 사진과 같이 테스트 순서도 보장되지 않으며, 같은 관심사끼리 묶이지도 않는다.
이러한 상황을 방지하고자, 같은 관심사의 테스트를 묶도록 도와주는 기능이 `@Nested`이다.

```java
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class ControllerTest {
    
    @Nested
    @DisplayName("저장 테스트")
    class SaveTest {
        @Test
        @DisplayName("저장 실패 - 제목 데이터 누락")
        void saveTest1(){
            ...
        }

        @Test
        @DisplayName("저장 실패 - 내용 데이터 누락")
        void saveTest2(){
            ...
        }

        @Test
        @DisplayName("저장 성공")
        void saveTest3(){
            ...
        }
    }
    
    @Nested
    @DisplayName("수정 테스트")
    class UpdateTest {
        @Test
        @DisplayName("수정 실패 테스트 - 제목 데이터 누락")
        void updateTest1(){
            ...
        }
    }
}
```

![스크린샷2](https://github.com/Jwhyee/effective-java-study/assets/82663161/bfd78941-3c87-42b1-8eff-a93e84c400f1)

위와 같이 `@Nested`를 사용하면 각 관심사를 한 클래스로 묶어 테스트할 수 있다.

## @Order()

`@Order` 어노테이션을 사용하면 테스트의 순서를 정할 수 있다. 해당 어노테이션의 API 문서를 살펴보면 아래와 같은 내용이 있다.

> @Order is an annotation that is used to configure the order in which the annotated element (i.e., field, method, or class) should be evaluated or executed relative to other elements of the same category.
> When used with @RegisterExtension or @ExtendWith, the category applies to extension fields.<br> 
> When used with MethodOrderer.OrderAnnotation, the category applies to test methods.<br>
> When used with ClassOrderer.OrderAnnotation, the category applies to test classes.

> @Order 어노테이션이 붙은 요소(필드, 메소드, 클래스)의 실행 순서를 구성하는데 사용된다.
> MethodOrderer를 사용하면 메소드에 적용되며, ClassOrderer를 사용하면 테스트 클래스에 적용된다.

위 내용으로 추측해보면 필드, 메소드, 클래스에 적용할 수 있지만, 기본적으로는 필드 혹은 메소드에만 적용이 되는 것 같다.

```java
@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class ControllerTest {
    
    @Nested
    @Order(1)
    @DisplayName("저장 테스트")
    class SaveTest {
        ...
    }
    
    @Nested
    @Order(2)
    @DisplayName("수정 테스트")
    class UpdateTest {
        ...
    }
}
```

실제로 `@Nested` 어노테이션이 붙은 클래스에 `@Order`를 붙일 경우 동작하지 않는다.
API 설명에 나와있듯이 `@Order`의 범위를 `ClassOrderer`로 지정해줘야지 `@Nested`에도 적용할 수 있게 된다.

```java
@AutoConfigureMockMvc
@TestClassOrder(ClassOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
class ControllerTest {
    
    @Nested
    @Order(1)
    @DisplayName("저장 테스트")
    class SaveTest {
        ...
    }
    
    @Nested
    @Order(2)
    @DisplayName("수정 테스트")
    class UpdateTest {
        ...
    }
}
```

위 코드처럼 최상단 테스트 클래스에 `@TestClassOrder` 어노테이션을 붙여 `ClassOrderer`로 지정해주면 된다.
이럴 경우 클래스에 대한 순서도 지정할 수 있으며, 메소드의 순서도 기존처럼 지정할 수 있게 된다.
