---
title: "[Java] - 함수형 인터페이스"
last_modified_at: 2023-09-25T21:00:37-21:30
categories: "[Dev]-Theory"
tags:
  - Java
toc: true
toc_sticky: true
toc_label: "Java"
toc_icon: "file"
---

## 서론

Effective Java 3/E를 공부하면서 Item5에 `Supplier`라는 것을 처음 보았다.
이 부분에 대해 이해가 가지 않는 부분이 있어, 늦게나마 스터디하는 팀원분들께 여쭤보았는데 내용이 흥미로워서 정리해본다!

## 함수형 프로그래밍

> 자료 처리를 수학적 함수의 계산으로 취급하고 상태와 가변 데이터를 멀리하는 프로그래밍 패러다임의 하나이다.

Java 8부터 이러한 방식으로 개발할 수 있도록 **함수형 인터페이스**를 지원한다.

```java
package java.util.function;

@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

위 코드와 같이 함수형 인터페이스는 `@FunctionalInterface` 어노테이션을 지니고 있으며, 패키지를 들여다보면 정말 많은 인터페이스가 존재하는 것을 확인할 수 있다.

### 람다식

우선, 함수형 인터페이스를 사용하기 위해서는 **람다식**에 대한 이해도가 필요하다.

> 람다식이란, 함수를 하나의 식으로 표현한 것이며, 메소드의 이름이 없어 익명 함수에 포함된다.

이렇게 글로 작성하면 잘 이해가 가지 않기 때문에 코드로 보면서 이해하는 것이 좋을 것 같다!
우리는 보통 아래와 같이 함수를 작성하고, 이를 계속해서 재사용한다.

```java
public String concat(String s1, String s2) {
    return s1 + s2;
}
```

하지만 람다식을 이용하면 아래와 같이 표현할 수 있다.

```java
((s1, s2) -> s1 + s2);
```

기존 함수에 비해 불필요한 코드도 줄어들고, 함수의 이름도 없이 사용할 수 있다.

### 일급 객체

사용하긴 편해보이지만, 함수명도 없고, 어떤 방식으로 호출해야하는지 감도 안 잡히는데 그냥 함수 쓰면 되지 않을까? 이런 생각을 하겠지만, 우리가 계속 [명령형 프로그래밍](https://mangkyu.tistory.com/111)을 공부하고, 사용했기 때문에 함수형 프로그래밍 방식이 많이 생소한 것이다.

함수형 인터페이스를 사용하는 가장 큰 이유는 일급 객체이기 때문이다.

- 변수 혹은 다른 자료구조 안에 담을 수 있다.
- 파라미터로 전달할 수 있다.
- 반환값으로 사용할 수 있다.
- 할당에 사용된 이름과 무관하게 고유한 구별이 가능하다.

일반 함수라면 아래와 같이 사용할 것이다.

```java
public String print(String s) {
    System.out.println(s);
}
```

하지만 함수형 인터페이스를 사용하면 아래와 같이 변환이 가능하다.

```java
@FunctionalInterface
public interface Functional<T> {

    void print(T t);

}
```

```java
@Test
void eachTest() {
    Functional<String> functional = (String t) -> {
        System.out.println(t);
    };

    functional.print("Hello World!");
}
```

이와 같은 코드로 실행하면 `Hello World!`가 출력될 것이다.

> 명령형 프로그래밍에서는 메소드를 호출하면 상황에 따라 내부의 값이 바뀔 수 있다. 즉, 우리가 개발한 함수 내에서 선언된 변수의 메모리에 할당된 값이 바뀌는 등의 변화가 발생할 수 있다. 하지만 함수형 프로그래밍에서는 대입문이 없기 때문에 메모리에 한 번 할당된 값은 새로운 값으로 변할 수 없다.
> <br> 출처 : [망나니 개발자님 - \[프로그래밍\] 함수형 프로그래밍(Functional Programming) 이란?](https://mangkyu.tistory.com/111)

## 함수형 인터페이스

자바에는 대표적으로 다음과 같은 인터페이스 네이밍이 존재한다.

|      인터페이스명       |  매개변수 여부   | 리턴타입 여부  |  설명   |
|:-----------------:|:----------:|:--------:|:-----:|
|    Supplier<T>    |     N      |    T     |  공급자  |
|    Consumer<T>    |     T      |    N     |  소비자  |
|   Predicate<T>    | T(boolean) |    T     |  단정   |
|  Function<T, R>   |     T      |    R     |  함수   |

### Supplier<T>

> **공급자**의 개념으로 특정 값을 만들어 반환해줌

`Set`의 경우 저장 순서를 보장하지 않는다. `Set` 내부에 데이터가 어디에 저장되어 있는지 찾는 일이 많지 않겠지만, `Supplier`를 통해 특정 데이터가 저장된 순서를 찾는 코드를 만들어보자!

```java
public class FunctionalTest {
    @Test
    void supplierTest() {
        // 문자열 Set 생성
        Set<String> stringSet = new HashSet<>();
        
        // Set에 string 1 ~ string 100까지 저장
        for (int i = 1; i <= 100; i++) {
            stringSet.add("string " + i);
        }
        
        // 함수 팩토리에 구현한 findIdx를 통해 "string 20"이 저장된 위치를 찾음
        // findIdx(set, data)
        final int idx = CustomFunctionalFactory.findIdx(stringSet, () -> "string 20");

        // 실제 저장된 위치가 맞는지 확인
        int i = 0;
        for (String s : stringSet) {
            if (i == idx) {
                assertTrue("string 20".equals(s));
            }
            i++;
        }
    }
}
```

```java
public class CustomFunctionalFactory {
    /** Set에 포함된 특정 값의 저장 순서를 반환하는 함수
     * @param set       특정 데이터가 포함되어 있는지 탐색할 Set
     * @param supplier  전달받은 "string 20"이 들어있음
     * @return          특정 데이터가 저장된 순서 반환, 데이터가 없을 경우 -1 반환
     * @param <T>       매개변수로 제네릭 타입을 받기 위함
     */
    public static <T> int findIdx(Set<T> set, Supplier<T> supplier) {
        int i = 0;
        // 넘겨 받은 set에 저장된 데이터를 순회하면서 "string 20"의 저장 순서 탐색
        for (T t : set) {
            if (t.equals(supplier.get())) {
                // 순서 반환
                return i;
            }
            i++;
        }
        return -1;
    }
}
```

**Supplier(공급자)**는 이름과 같이 값을 만들어서 반환해주는 역할을 한다.

### Consumer<T>

> **소비자**의 개념으로 주어진 값을 소비함

```java
public class FunctionalTest {
    @Test
    void consumerFunctionalTest() {
        // 문자열 리스트 생성
        List<String> stringList = new ArrayList<>();
        
        // string 1 ~ 100까지 리스트에 저장
        for (int i = 1; i <= 100; i++) {
            stringList.add("string " + i);
        }
        
        // 함수 팩토리에 리스트와 주어진 리스트로 처리할 기능을 넘겨줌 -> 1 ~ 100까지 출력
        CustomFunctionalFactory.forEachRemaining(stringList, (item) -> System.out.println(item));
    }
}
```

```java
public class CustomFunctionalFactory {
    /** List에 남아있는 값에 대해서 무언가를 처리하는 메소드
     * @param list      forEach를 돌 리스트
     * @param consumer  forEach를 돌면서 수행할 일
     * @param <T>       매개변수로 제네릭 타입을 받기 위함
    */ 
    public static <T> void forEachRemaining(List<T> list, Consumer<T> consumer) {
        for (T t : list) {
            consumer.accept(t);
        }
    }
}
```

**Consumer(소비자)**는 이름과 같이 특정 데이터를 가지고 무언가를 처리하는 역할을 한다.

### Predicate<T>

> **단정짓다**라는 개념으로 주어진 값을 토대로 옳고, 그름을 판단함

```java
public class FunctionalTest {
    @Test
    void predicateFunctionalTest() {
        // 문자열 리스트 생성
        List<String> stringList = new ArrayList<>();

        // string 1 ~ 100까지 리스트에 저장
        for (int i = 1; i <= 100; i++) {
            stringList.add("string " + i);
        }

        // 함수 팩토리에 리스트와 해당 리스트에서 걸러줄 조건식을 넘겨줌 -> 1이 포함된 데이터만 돌려 받음
        final List<String> filteredList = CustomFunctionalFactory
                .filter(stringList, (item) -> item.contains("1"));

        // 1이 포함된 데이터만 출력
        for (String s : filteredList) {
            System.out.println(s);
        }

    }
}
```

```java
public class CustomFunctionalFactory {
    /** 주어진 리스트에서 조건식에 맞는 데이터만 새로운 리스트에 담아서 반환하는 메소드
     * @param list          기존 데이터 리스트
     * @param predicate     리스트에서 검사할 조건식
     * @return              조건식을 통해 걸러진 데이터 리스트
     * @param <T>           매개변수로 제네릭 타입을 받기 위함
     */
    public static <T> List<T> filter(List<T> list, Predicate<T> predicate) {
        // 조건식에 해당되는 데이터를 담을 새로운 리스트
        List<T> result = new ArrayList<>();
        
        // 기존 데이터 리스트 순회
        for (T item : list) {
            // 주어진 조건식에 맞을 경우 결과 리스트에 추가
            if (predicate.test(item)) {
                result.add(item);
            }
        }
        
        // 결과 리스트 반환
        return result;
    }
}
```

**Predicate(단정짓다)**라는 이름과 같이 기존 데이터 중 조건식에 맞는 데이터만 추출하는 역할을 한다.
상황에 따라 어떤 조건식으로든 교체할 수 있어 굉장히 유연하다.

### Functional<T>

```java
public class FunctionalTest {
    @Test
    void functionFunctionalTest() {
        // 문자열 리스트 생성
        List<String> stringList = new ArrayList<>();

        // string 1 ~ 100까지 리스트에 저장
        for (int i = 1; i <= 100; i++) {
            stringList.add("string " + i);
        }

        // 함수 팩토리에 리스트와 mapping할 값을 넘겨줌 -> 모든 데이터 뒤에 "^_^"가 붙은 값을 반환함
        final List<String> filteredList = CustomFunctionalFactory
                .map(stringList, (item) -> item.concat("^_^"));

        // 기존 데이터에 "^_^"가 붙은 값들 출력
        for (String s : filteredList) {
            System.out.println(s);
        }
    }
}
```

```java
public class CustomFunctionalFactory {
    /** 주어진 리스트에서 특정 함수를 전달 받고, 해당 함수를 적용하는 함수
     * @param list          기존 데이터 리스트
     * @param function      리스트를 순회하면서 실행할 함수
     * @return              함수대로 진행한 결과 리스트 반환
     * @param <T>           기존 함수의 데이터 타입
     * @param <R>           반환할 리스트의 데이터 타입(주어진 함수의 반환타입 ex) item.concat() -> String 타입)
     */
    public static <T, R> List<R> map(List<T> list, Function<T, R> function) {
        // 조건식에 해당되는 데이터를 담을 새로운 리스트
        List<T> result = new ArrayList<>();

        // 기존 데이터 리스트 순회
        for (T item : list) {
            // 전달 받은 함수에 기존 데이터 요소를 넣고, 결과 배열에 추가
            result.add(function.apply(item));
        }
        
        // 결과 리스트 반환
        return result;
    }
}
```

**Function(함수)**라는 이름과 같이 기존 데이터를 순회하면서 각 요소를 전달 받은 함수를 적용하는 역할을 한다.

보통은 `Repository`에서 바로 `Dto`에 매핑하지만, 가끔 아래 코드처럼 전체 데이터를 뽑아서 `Dto`로 변환해 `list`로 적용하는 방식을 사용한다.
`Function<T, R>`에 대입해서 보면, `<T>`는 `Post.class`를 의미하고, `<R>`은 `Post::of`의 반환 타입인 `PostDto.class`를 의미한다.

```java
public class Post {
    ...

    public PostDto of() {
        return new PostDto(...);
    }
}

public class PostService {
    public List<PostDto> findAllPostDto() {
        List<PostDto> postDtoList = postRepository.findAll().stream()
                .map(Post::of)
                .toList();
    }
}
```

## 정리

함수형에 대해서 더 공부해야겠지만, 각각의 네이밍이 무엇을 뜻하는지 정도는 확실히 감을 잡은 것 같다.
나중에 꼭 모던 자바 인 액션을 통해 더 깊게 공부해봐야겠다!

## Reference

- [망나니개발자님 블로그](https://mangkyu.tistory.com/113)
- [망나니개발자님 블로그](https://mangkyu.tistory.com/111)
- [주주님 블로그](https://m.blog.naver.com/PostView.naver?blogId=d_d_o_l_&logNo=223217461160&navType=by)