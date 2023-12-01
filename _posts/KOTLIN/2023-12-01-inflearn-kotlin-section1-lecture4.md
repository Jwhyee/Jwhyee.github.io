---
title: "[Kotlin] - 코틀린에서 연산자를 다루는 방법"
last_modified_at: 2023-12-01T22:10:37-23:30
categories: KOTLIN
tags:
  - KOTLIN
toc: true
toc_sticky: true
toc_label: "Retrospect"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 비교 연산자와

> `kotlin`에서 사용하는 비교 연산자는 `java`와 동일하다.

하지만 `java`와 다르게 객체를 비교할 때, 비교 연산자를 사용하면 자동으로 `compareTo`를 호출해준다.

우선 아래 `java` 코드를 먼저 확인해보자.

```java
public class JavaMoney implements Comparable<JavaMoney> {

    private final long amount;

    public JavaMoney(long amount) {
        this.amount = amount;
    }

    @Override
    public int compareTo(@NotNull JavaMoney o) {
        // o가 더 작으면 양수
        // o와 같으면 0
        // o가 더 크면 음수
        return Long.compare(this.amount, o.amount);
    }
}
```

```java
public class Lect4Main {
    public static void main(String[] args) {
        JavaMoney m1 = new JavaMoney(2_000L);
        JavaMoney m2 = new JavaMoney(1_000L);

        if (m1.compareTo(m2) > 0) {
            System.out.println("m1이 m2보다 크다.");
        }
    }
}
```

`JavaMoney` 클래스에서 `Comparable`의 `compareTo`를 구현해 객체끼리 비교할 수 있도록 했다.

위 `main` 함수의 코드를 `kotlin` 코드로 변경하면 다음과 같다.

```kotlin
fun main() {
    val m1 = JavaMoney(2_000L)
    val m2 = JavaMoney(1_000L)

    if (m1 > m2) {
        println("m1이 m2보다 크다.")
    }
}
```

객체의 Method Call을 하는 것이 아닌 비교 연산자를 `compareTo`를 자동으로 호출해준다.

### 동등성, 동일성

> 동등성(Equality) : 두 객체의 값이 같은가<br>
> 동일성(Identity) : 주소값이 완전히 동일한 객체인가?

`java`에서는 동등성에 `equals`를 사용하였고, 동일성 비교에는 `==` 연산자를 사용했다.

하지만 `kotlin`에서는 동일성에 `===`을 사용하고, 동등성에 `==` 연산자를 사용한다.
`==`을 사용하면 간접적으로 `equals`를 호출해준다.

`JavaMoney` 클래스에 `equals`를 추가한 뒤 다시 확인해보자.

```java
public class JavaMoney implements Comparable<JavaMoney> {
    ...
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JavaMoney javaMoney = (JavaMoney) o;
        return amount == javaMoney.amount;
    }
}
```

```kotlin
fun main() {
    val m1 = JavaMoney(1_000L)
    val m2 = m1
    val m3 = JavaMoney(1_000L)

    // 동일성 비교 : true 출력
    println(m1 === m2)
    // 동등성 비교 : true 출력
    println(m1 == m3)
}
```

## 논리 연산자

`java`와 완전히 동일하게 `&&`, `||`, `!` 연산자가 있으며 Lazy 연산을 한다.

Lazy 연산이란, 아래 코드를 통해 확인해보자.

```kotlin
fun main() {
    // Lazy 연산
    if (function1() || function2()) {
        println("본문")
    }
}

fun function1(): Boolean {
    println("fun 1")
    return true
}

fun function2(): Boolean {
    println("fun 2")
    return true
}
```

위 코드를 실행하면 아래와 같은 결과가 나온다.

```
fun 1
본문
```

이와 같이 앞 조건에서 만족할 경우 뒤 내용은 보지않고 바로 본문으로 들어가는 것을 Lazy 연산이라고 한다.
만약 `&&` 연산일 경우 한 조건이 거짓일 경우 뒤 코드는 보지도 않고 바로 조건문을 탈출하게 된다.

## 연산자 오버로딩

`java`에서 객체끼리 연산을 해야할 경우 아래와 같은 방식으로 구현한다.

```java
public class JavaMoney {
    private final long amount;

    public JavaMoney plus(JavaMoney other) {
        return new JavaMoney(amount + other.amount);
    }

    @Override
    public String toString() {
        return "JavaMoney{amount=" + amount + '}';
    }
}
```

```java
public class Lect4Main {
    public static void main(String[] args) {
        JavaMoney m1 = new JavaMoney(2_000L);
        JavaMoney m2 = new JavaMoney(1_000L);
        // 출력 : JavaMoney{amount=3000}
        JavaMoney m3 = m1.plus(m2);
    }
}
```

`kotlin`에서는 객체마다 연산자를 직접 정의할 수 있다.

```kotlin
data class Money(
    val amount: Long
) {
    operator fun plus(other: Money): Money {
        return Money(this.amount + other.amount)
    }
}
```

```kotlin
fun main() {
    val m1 = Money(1_000L)
    val m2 = Money(2_000L)
    val m3 = m1 + m2
    // 출력 : Money(amount=3000)
    println(m3)
}
```

## 정리

- 단항, 산술, 산술 대입, 비교 연산자 모두 java와 같다.
  - 단, 객체끼리도 자동 호출되는 compareTo를 이용해 비교 연산자를 사용할 수 있다.
- 객체끼리의 연산자를 직접 정의할 수 있다.