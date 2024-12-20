---
title: "[Study] - Peer Review"
last_modified_at: 2023-12-31T22:10:37-23:30
categories: "[Dev]-Review"
tags:
  - Spring Boot
toc: true
toc_sticky: true
toc_label: "Review"
toc_icon: "file"
---

Spring Boot를 이용해 특정 요구사항을 정해 API를 개발하는 스터디를 시작했다.
첫 주에 진행한 사항에 대한 리뷰를 정리하고자 한다.
{: .notice--info}

## 💬 리뷰 정리

### EOL(End Of Line) 이슈

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/2e7d10c7-802b-4419-afad-a81e15247729)

```yaml
.idea/**
.gradle/**
build/**
application.yaml
⊖
```

위와 같이 파일 가장 끝 부분에 공백을 추가하지 않으면, Github에서 코드를 볼 때 ⊖ 기호가 생긴다.
이러한 기호가 발생하는 이유는 `POSIX` 표준을 지키지 않았기 때문이다.

[IEEE 3.206 Line](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_206)을 살펴보면 아래와 같은 내용이 적혀있는 것을 볼 수 있다.

> A sequence of zero or more non- <newline> characters plus a terminating <newline> character.

[IEEE 3.195 Incomplete Line](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_206)에도 아래와 같은 내용이 있다.

> A sequence of one or more non- <newline> characters at the end of the file.

즉, 끝나지 않은 행은 파일 끝에 `non-newline` 문자가 하나 더 있어야한다는 것이다.
이러한 문제는 엔터 한 번이면 해결할 수 있지만, 표준에서는 `newline`이 아닌 문자를 넣으라고 한다.
그럼에도 새로운 라인만 추가하는 이유는 `git`에서 자동으로 `EOL` 값을 넣어주기 때문이다.

### 데이터 삭제 처리 이슈

```java
@Transactional
public void deleteMenu(Long id){
    menuRepository.delete(findById(id));
}
```

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/6401d5f8-0403-484a-8091-45bd2fcded87)

프로젝트를 진행할 때마다 실제 데이터를 DB에서 삭제하는 방식으로 개발했다.
하지만, 실무에서는 실제로 데이터를 삭제하는 것이 아닌 논리 삭제(Soft Delete)를 한다고 한다.

사용자가 실수로 삭제했거나, 이용 약관에 따라 정보를 보호해야하는 경우를 대비해
`useYn`과 같이 사용 필드를 추가해서 데이터를 관리한다고 한다.

```java
@Transactional
public void deleteMenu(Long id) {
    findEntityById(id).remove();
}
```

```java
...
public class Menu {
    
    private String useYN;

    public void remove() {
        this.useYN = "N";
    }
    
}
```

위 코드와 같이 사용자가 삭제 요청을 보낼 경우 해당 필드에 `N` 혹은 `false`의 값을 넣고,
데이터를 불러올 때, 해당 필드가 `N`이 아닐 경우에만 조회되도록 하면 될 것 같다!

### 행위 처리 후 반환

보통 `Controller`에서 프론트로 값을 반환하기 전에 DTO로 변환하는 습관이 있었다.

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/383a28ee-0ea8-401f-a20d-25977dcf4f7e)

하지만 아래 사진처럼 가능한 `Repository`에서 DTO로 변환하는 것이 좋다고 한다.

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/368a2a58-44cc-48cb-8953-6dfe877e647b)

자세한 내용은 [짱민님 블로그](https://leezzangmin.tistory.com/47)에서 확인할 수 있다.

간략하게 설명하자면, `Entity`에는 많은 정보를 담고 있지만, 실제 `View`에 반환하는 필드는 절반 정도기 때문이다.
많은 필드를 DB에서 불러오는 것보단, 그 중에서 사용하는 일부 필드만 `Repository`에서 받아오는 것이 효율적이기 때문이다.
즉, 모든 정보를 불러와 `Entity`에 매핑하는 것은 불필요한 행위가 되는 것이다.

이와 같이 가능한 행위 처리 후에 필요한 내용만 보낼 수 있도록 DTO를 전달해주는 것이 더 좋은 것이다.

### RFC7807 규약

보통 `ResponseEntity`를 사용하지 않고, 성공과 실패에 대한 템플릿을 만들어 반환했다.

```java
public class ResponseData {
    public static <T> ApiResult <T> success(T data, String msg) {
        return new ApiResult<>(data, msg);
    }
    public static <T> ApiResult <T> success(String msg) {
        return new ApiResult<>(msg);
    }

    public static ApiResult<?> fail(String message) {
        return new ApiResult<>(message);
    }

    @Getter
    public static class ApiResult<T> {
        T data;
        String msg;

        public ApiResult(T data, String msg) {
            this.data = data;
            this.msg = msg;
        }

        public ApiResult(String msg) {
            this.msg = msg;
        }
    }
}
```

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/3c7b3879-2f9c-4125-862a-f7e49682a5aa)

지금까지 눈치채지 못했지만, 이전에 작성했던 코드들도 모두 `success`와 `fail`에 대한 반환 값이 동일했다.
또한, 실패에 대한 반환은 `ExceptionHandler`에서만 사용하기에 적절하지 않았다.

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/ecbd92f8-383b-49e0-9ba2-efd8ebeca2a8)

추가적으로 실패에 대한 요청을 보낼 때, `RFC_7807` 규약이 있다는 것을 새로 알았다.

[RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) 문서를 보면 아래와 같은 규약이 있다는 것을 알 수 있다.

```json
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json
Content-Language: en
        
{
    "type": "https://example.com/probs/out-of-credit",
    "title": "You do not have enough credit.",
    "detail": "Your current balance is 30, but that costs 50.",
    "instance": "/account/12345/msgs/abc",
    "balance": 30,
    "accounts": ["/account/12345",
                 "/account/67890"]
}
```

위와 같이 에러에 대해서 어떤 정보들을 반환해줘야하는지 규약 같은 것이 정해져있다.
다음 요구사항에서는 조금 더 고민해서 반환 정보를 추가해줘야할 것 같다!

### SoftAssertions

`assertThat`을 이용한 테스트가 여러 개 있을 경우, 테스트 실패할 경우 바로 중단이 된다.

```java
@Test
@DisplayName("메뉴 저장 테스트")
void saveMenuTest() {
    // given
    String menuName = "따뜻한 아이스 아메리라떼";
    MenuDto dto = new MenuDto(1L, menuName);
    Menu menu = Menu.builder()
            .id(1L)
            .menuName(menuName)
            .build();

    // when
    when(menuRepository.save(any(Menu.class))).thenReturn(menu);
    Menu savedMenu = menuService.saveMenu(dto);

    // then
    assertThat(savedMenu).isNotNull();
    assertThat(savedMenu.getMenuName()).isEqualTo(menuName);
}
```

즉, 첫 `assert`에서 실패할 경우 뒷 테스트는 진행되지 않아 순서를 변경하거나, 성공하는 테스트로 다시 수정 후 테스트를 진행해야 한다.

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/47e13f89-d7c7-4845-9a5f-b871215d55aa)

하지만 `SoftAssertions`를 이용하면 모든 `assertions`를 실행한 후, 실패 내역에 대해서 확인할 수 있게 된다.

작은 단위부터 실패하는 테스트를 만들어보고, 성공하는 테스트로 넘어가는 방식으로 작성해보면 좋을 것 같다!

### 반환 타입의 와일드 카드

아래 코드와 같이 반환 타입을 정해주지 않고, `?`로 사용해서 반환했었다.

```java
public ResponseData.ApiResult<?> saveMenuApi(@RequestBody MenuDto dto){
    ...
}
```

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/bb9a7ccb-d7d1-4b57-ba4c-b28edb86261b)

하지만 `ApiResult<?>`에 들어가는 타입은 `Dto`가 명백하기 때문에 `ApiResult<MenuDto>` 이렇게 자료형을 제한하는 것이 올바르다고 한다.
리뷰에 있는 그대로, 와일드카드 타입을 쓰게될 경우, 타입의 안정성을 해치게 된다.
반환 타입이 명백할 경우에는 가능한 명확한 타입을 작성하는 것이 좋을 것 같다.

### Custom Exception

현재 코드에서 `IdNotFoundException`, `DuplicationMenuException`이 동일한 구조를 띄고있다.

```java
public class IdNotFoundException extends RuntimeException {
    public IdNotFoundException(String message) {
        super(message);
    }
}
```

```java
public class DuplicationMenuException extends RuntimeException {
    public DuplicationMenuException(String message) {
        super(message);
    }
}
```

![image](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/1a936918-0d1b-49e9-8e2a-5e1ed5af7d39)

`CustomException`을 만들어서 좋은 것은 메시지를 구체화할 수 있는 것인데, 내부가 중복되는 불상사가 생긴다.

이를 해결하기 위해 `abstract` 클래스로 `RuntimeException`에 대한 `BaseException`을 구성하였고,
해당 클래스를 상속 받는 `CustomException`을 구성하였다. 사실 이 구조도 더 줄이거나, 효율적으로 작성할 수 있을 것 같아 더 고민해봐야할 것 같다!

```java
public abstract class RuntimeBaseException extends RuntimeException {
    public abstract String getMessage();

    public abstract HttpStatus getStatus();
}
```

```java
public class NotFoundExceptionRuntime extends RuntimeBaseException {

    @Override
    public String getMessage() {
        return "조회된 데이터가 없습니다.";
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.NOT_FOUND;
    }

}
```

```java
public class DuplicationExceptionRuntime extends RuntimeBaseException {

    @Override
    public String getMessage() {
        return "이미 등록된 메뉴입니다.";
    }

    @Override
    public HttpStatus getStatus() {
        return HttpStatus.BAD_REQUEST;
    }

}
```

## 🤔 회고

이번 리뷰를 통해 내가 자주 실수하는 부분이나, 모르는 내용에 대해 많이 알 수 있었다.
스터디는 잠시 중단되었지만, 추후에 다시 진행한다면 더 신경써서 개발해야겠다!
