---
title: "[Kotlin] - 코틀린에서 조건문을 다루는 방법"
last_modified_at: 2023-12-02T22:10:37-23:30
categories: "[Lecture]-Language"
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture5"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## if

`java` 코드와 `kotlin` 코드를 통해 한 번 확인해보자.

```java
private void validateScoreIsNotNegative(int score) {
    if (score < 0) {
        throw new IllegalArgumentException(String.format("%s는 0보다 작을 수 없습니다.", score));
    }
}
```

```kotlin
fun validateScoreIsNotNegative(score: Int) {
    if (score < 0) {
        throw IllegalArgumentException("${score}는 0보다 작을 수 없습니다.")
    }
}
```

`Type` 편에서 본 것과 같이 `kotlin`에서는 `Unit(void)`를 생략할 수 있으며, 객체 생성을 할 때 `new` 키워드를 사용하지 않은 것 말고는 크게 다른 것은 없다.

`else`의 경우도 살펴보자

```java
private String getPassOrFail(int scroe) {
    if (scroe >= 50) {
        return "P";
    } else {
        return "F";
    }
}
```

```kotlin
fun getPassOrFail(score: Int): String {
    if (score >= 50) {
        return "P"
    } else {
        return "F"
    }
}
```

위 두 코드도 문법이 동일한 것을 볼 수 있다.

하지만 사실 한 가지 다른 점이 존재한다.
`java`에서의 `if-else`는 **statement**이지만, `kotlin`에서는 **expression**이다.

## Expression / Statement

> Statement : 프로그램의 문장, 하나의 값으로 도출되지 않는다.<br>
> Expression : 하나의 값으로 도출되는 문장

![image](https://github.com/Jwhyee/Jwhyee/assets/82663161/b3d605bc-24b1-4b15-bf08-ecc2af7e486d)

코드 예시를 통해 확인해보면, 30 + 40은 70이라는 하나의 결과가 때문에 이 식은 **Expression**이면서 **Statement**이다.

```java
int score = 30 + 40;
```

그렇다면 아래 코드는 어떨까?

```java
String grade = if(score >= 50) {
    "P";
} else {
    "F";
}
```

위 코드는 `if`문을 하나의 값으로 취급하지 않기 때문에 **Statement**이며, 위와 같이 작성할 경우 에러가 발생한다.
`java`에서는 이러한 상황을 지원하기 위해 삼항 연산자를 제공한다.

```java
String grade = score >= 50 ? "P" : "F";
```

이러한 삼항 연산자는 하나의 값으로 취급하므로 에러가 발생하지 않고, **Expression**이면서 **Statement**라고 볼 수 있다.

그렇다면 `kotlin`의 `if-else`가 왜 **Expression**인지 살펴보자.

```kotlin
fun getPassOrFail(score: Int): String {
    return if (score >= 50) {
        "P"
    } else {
        "F"
    }
}
```

위 코드를 보면 `if-else`를 사용해 값을 반환하고 있다.
이러한 형식은 **Expression**이기 때문에 가능한 것이며, 이미 이 자체로 **Expression**이기에 `java`에서 사용되는 삼항 연산자가 없다.

### Range

어떠한 값이 특정 범위에 포함되어 있는지, 그렇지 않은지 확인할 때, `java`에서는 다음과 같이 표기한다.

```java
// 0 <= score <= 100
if (0 <= score && score <= 100) { ... }
```

`kotlin`에서도 동일하게 사용할 수 있지만, 더 간단하게 표현할 수 있다.

```kotlin
if (score in 0 .. 100) { ... }
```

`score` 값이 0 이상 100 이하에 포함되는지 확인하는 코드이다.

```kotlin
fun validateScoreIsNotNegative(score: Int) {
    if (score !in 0 .. 100) {
        throw IllegalArgumentException("score의 범위는 0부터 100사이 입니다.")
    }
}
```

## switch / when

`java`에서 사용하던 `switch`가 `kotlin`에서 어떤 방식으로 사용되는지 확인해보자.

```java
private String getGradeWithSwitch (int score) {
    switch (score / 10) {
        case 9:
            return "A";
        case 8:
            return "B";
        case 7:
            return "C";
        default:
            return "D";
    }
}
```

```kotlin
private fun getGradeWithSwitch(score: Int): String {
    return when (score / 10) {
        9 -> "A"
        8 -> "B"
        7 -> "C"
        else -> "D"
    }
}
```

`kotlin`에서의 `when`은 하나의 **Expression**으로 취급하기 때문에 위 코드와 같이 작성이 가능하다.
사실 이러한 기능은 `Java 14`에서도 `switch`문을 **Expression**으로 사용이 가능하다.

```java
private String getGradeWithSwitchExpression (int score) {
    String result = switch (score / 10) {
        case 9 -> "A";
        case 8 -> "B";
        case 7 -> "C";
        default -> "D";
    };

    return result;
}
```

`kotlin`에서의 `when`절은 내부 조건부에 어떠한 **Expression** 오더라도 실행할 수 있다.
아래 예시들을 통해 더 확인해보자.

### 범위 검사

`kotlin`에서 `when`절 조건부에 범위에 대한 검사를 할 수 있다.

```kotlin
fun getGradeWithSwitchVer2(score: Int): String {
    return when (score) {
        in 90 .. 99 -> "A"
        in 80 .. 89 -> "B"
        in 70 .. 79 -> "C"
        else -> "D"
    }
}
```

### 타입 검사

`is`를 통한 타입 검사도 `when`절 내부에서 사용이 가능하다.

```java
private boolean startsWithA(Object obj) {
    if (obj instanceof String o) {
        return o.startsWith("A");
    } else {
        return false;
    } 
}
```

```kotlin
fun startsWithA(obj: Any): Boolean {
    return when (obj) {
        is String -> obj.startsWith("A")
        else -> false
    }
}
```

### 여러 조건 검사

```java
// Java 14 이전
private void judgeNumber(int number) {
    // if 버전
    if (number == 1 || number == 0 || number == -1) {
        System.out.println("어디서 많이 본 숫자입니다.");
    } else {
        System.out.println("1, 0, -1이 아닙니다.");
    }
    // switch 버전
    switch (number) {
        case 1:
        case 0:
        case -1:
            System.out.println("어디서 많이 본 숫자입니다.");
        default:
            System.out.println("1, 0, -1이 아닙니다.");
    }
}

// Java 14 이후
private void judgeNumberSwitch(int number) {
    switch (number) {
        case 1, 0, -1 -> System.out.println("어디서 많이 본 숫자입니다.");
        default -> System.out.println("1, 0, -1이 아닙니다.");
    }
}
```

```kotlin
fun judgeNumber(number: Int) {
    when (number) {
        1, 0, -1 -> println("어디서 많이 본 숫자입니다.")
        else -> println("1, 0, -1이 아닙니다.")
    }
}
```

확실히 `Java 14`이후로 **Expression**을 지원해주기 때문에 간결하게 작성할 수 있게 됐다.

### 값 생략

`when(value)` 부분의 `value`를 생략해 `early return`처럼 동작하게 할 수 있다.

```java
private void judgeNumber2(int number) {
    if (number == 0) {
        System.out.println("주어진 숫자는 0입니다.");
        return; 
    }

    if (number % 2 == 0) {
        System.out.println("주어진 숫자는 짝수입니다.");
        return;
    }

    System.out.println("주어진 숫자는 홀수 입니다.");
}
```

```kotlin
fun judgeNumber2(number: Int) {
    when {
        number == 0 -> println("주어진 숫자는 0입니다.")
        number % 2 == 0 -> println("주어진 숫자는 짝수입니다.")
        else -> println("주어진 숫자는 홀수입니다.")
    }
}
```

이와 같이 `java`의 `switch-case`보다 훨씬 유연하게 코드를 작성할 수 있다.

## 정리

- if / if-else / if-else if-else 모두 java와 문법이 동일하다.
  - 단, kotlin에서는 Expression으로 취급된다.
  - 때문에 kotlin에는 삼항 연산자가 없다.
- java-switch -> kotlin-when으로 대체 되었다.
  - when은 더 강력한 기능을 갖는다.
