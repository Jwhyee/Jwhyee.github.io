---
title: "[Kotlin] - 코틀린에서 변수를 다루는 방법"
last_modified_at: 2023-11-28T22:10:37-23:30
categories: "[Lecture]-Language"
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture1"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## var VS val

> 모든 변수는 우선 `val`로 만들고, 꼭 필요한 경우 `var`로 변경한다.

```java
long number1 = 10L;
final long number2 = 10L;
```

`long`과 `final long`의 차이는 가변 / 불변의 차이를 나타낸다.

| 구분           | 설명                                  |
|--------------|-------------------------------------|
| `long`       | 처음 값을 할당 받고 나서, 다시 한 번 값을 바꿔줄 수 있다. |
| `final long` | 한 번 값을 지정해주면 더 이상 바꿀 수 없다.          |


위 코드를 코틀린으로 변환하면 다음과 같다.

```kotlin
// variable
var number1 = 10L

// value
val number2 = 10L
```

코틀린에서는 모든 변수에 수정 가능 여부를 명시해주어야 하며, 타입은 컴파일러가 추론해주기 때문에 의무적으로 작성하지 않아도 된다.

### 늦은 초기화

```kotlin
var number1: Long
val number2: Long

// 에러 발생 : Variable 'number1' must be initialized
// print(number1)
// print(number2)

number1 = 5
number2 = 5

print(number1)
print(number2)
```

`var`과 `val` 모두 값이 초기화되지 않은 상태에서 출력을 하려고 하면 에러가 발생한다.
`val`은 최초 한 번에 한해서 값을 초기화할 수 있다.

> 초기값을 지정해주지 않을 경우 타입을 무조건 명시해줘야 하며, 값을 초기화한 후 사용해야한다.

## Primitive Type

`java`에는 `Reference`와 `Primitive` 타입이 모두 존재한다.

```java
long number1 = 10L
Long number3 = 1_000L;
```

Effective Java, Item6을 보면 다음과 같은 내용이 존재한다.

> 연산을 할 때에는, 박싱된 기본 타입보다는 기본 타입을 사용하고, 의도치 않은 오토 박싱이 숨어들지 않도록 주의하자.

```java
private static long sum() {
    Long sum = 0L;
    for (long i = 0; i <= Integer.MAX_VALUE; i++) {
        sum += i;
    } 
    return sum;
}
```

위 코드의 경우 `Long` 타입이 `long`과 연산을 하는 과정에서 박싱과 언박싱이 계속해서 일어나 불필요한 객체가 생성이 되면서 성능이 저하된다.

하지만, 코틀린의 경우 동일하게 사용한다.

```kotlin
var number1 = 10L
var number3 = 1_000L
```

공식 문서를 보면 다음과 같은 내용이 있는 것을 볼 수 있다.

> Some types can have a special internal representation
> - for example, numbers, characters and booleans
> - can be represented as primitive values at runtime
> - but to the user they look like ordinary classes.

> 코드에서는 평범한 클래스처럼 보이지만, 실행 시에는 코틀린이 알아서 최적화를 해준다.

실제로 작성한 코드를 디컴파일 해보면 다음과 같다.

```kotlin
fun main() {
    var result: Long = 0L

    for (i in 0L .. 10L) {
        result += (i + 1L)
    }

    println(result)
}
```

```java
public final class KotlinVariableKt {
   public static final void main() {
      long number1 = 0L;
      long result = 0L;
      long i = 0L;

      for(long var6 = 10L; i <= var6; ++i) {
         result += i + 1L;
      }

      System.out.println(result);
   }

   public static void main(String[] var0) {
      main();
   }
}
```

분명 `kotlin`에서는 `Long` 타입으로 작성했지만, 실제 디컴파일된 코드를 보면 `primitive long`으로 작성된 것을 볼 수 있다.

이처럼 프로그래머가 boxing / unboxing을 고려하지 않아도 되도록 `kotlin`이 알아서 처리해준다.

## nullable

`java`에서 `Reference` 타입으로 작성하면 `null`을 허용할 수 있게 된다.

```java
Long nubmer = null;
```

하지만 `kotlin`에서는 'null이 들어갈 수 있는'을 아예 다르게 간주한다.

```kotlin
var number = 1_000L
// 에러 발생 : Null can not be a value of a non-null type Long
number = null
```

기본적으로 모든 변수는 `null`이 들어갈 수 없게끔 설계되었기 때문에 에러가 발생하는 것이다.

그렇기 때문에 `null`을 허용할 수 있도록 타입에 `?`를 명시해주어야 한다.

```kotlin
var number: Long? = 1_000L
number = null
```

## Instance

`java`에서 객체를 생성하기 위해서는 아래와 같이 `new` 키워드를 사용해야 한다.

```java
Person p = new Person("Jwhy")
```

`kotlin`의 경우 해당 키워드 없이 바로 사용이 가능하다.

```kotlin
var person = Person("Jwhy")
```

위와 같이 객체 인스턴스화를 할 때에는 `new`를 붙이지 않는다.

## 정리

- 모든 변수는 var / val을 붙어주어야 한다.
   - var : 변경 가능
   - val : 변경 불가능 (read-only)
- 타입을 명시하지 않아도, 추론이 가능하다.
- `Primitive`와 `Reference` 타입을 구분하지 않아도 된다.
- `null`이 들어갈 수 있는 변수는 타입 뒤에 `?`를 붙어주어야 한다.
   - 아예 다른 타입으로 간주한다.(Long != Long?)
- 객체를 인스턴스화 할 때, `new`를 붙이지 않아야 한다.
