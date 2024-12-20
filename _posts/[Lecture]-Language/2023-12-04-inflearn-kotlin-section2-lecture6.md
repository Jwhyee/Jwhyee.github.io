---
title: "[Kotlin] - 코틀린에서 반복문을 다루는 방법"
last_modified_at: 2023-12-04T22:10:37-23:30
categories: [Lecture]-Language
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture6"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## for-each(향상된 for문)

`java`에서 향상된 for문을 사용하는 것과 같이 `kotlin`에서도 동일하게 사용한다.

```java
public static void main(String[] args) {
    List<Long> numbers = Arrays.asList(1L, 2L, 3L);
    for (long number : numbers) {
        System.out.println(number);
    }
}
```

```kotlin
fun main() {
    val numbers = listOf(1L, 2L, 3L)
    for (number in numbers) {
        println(number)
    }
}
```

위 코드의 차이는 `java`에서 `:`을 사용했다면, `kotlin`에서는 `in`을 사용했다.

## 전통적인 for문

### 1씩 올라가는 경우

`java`에서는 1부터 3까지의 반복문을 만들 때 아래와 같이 작성한다.

```java
public static void main(String[] args) {
    for (int i = 1; i <= 3; i++) {
        System.out.println(i);
    }
}
```

`kotlin`에서는 `java`와 맥락은 비슷하지만, 코드가 전혀 다르게 생겼다.

```kotlin
fun main() {
    for (i in 1..3) {
        println(i)
    }
}
```

`..`은 범위를 나타내기 때문에 `1 <= i <= 3`을 표현하게 되는 것이다.

### 1씩 내려가는 경우

그러면 반대로 내려가는 경우는 어떻게 작성할까?

```java
public static void main(String[] args) {
    for (int i = 3; i >= 0; i--) {
        System.out.println(i);
    }
}
```

`java`에서는 시작하는 값을 3으로 잡은 다음 0까지 반복하며 `i--`가 되도록 작성한다.

```kotlin
fun main() {
    for (i in 3 downTo 1) {
        println(i)
    }
}
```

`kotlin`에서는 `downTo` 키워드를 통해서 3 ~ 1까지 내려가도록 작성한다.

### n씩 올라가는 경우

`java`에서는 복합 대입 연산자를 통해 2씩 증가시키게 작성한다.

```java
public static void main(String[] args) {
    for (int i = 1; i <= 5; i += 2) {
        System.out.println(i);
    }
}
```

`kotlin`에서는 `step` 키워드를 통해서 조절할 수 있다.

```kotlin
fun main() {
    for (i in 1 .. 5 step 2) {
        println(i)
    }
}
```

## Range & Progression

### Range

위 코드에서 봤듯이 `..` 키워드는 범위, 즉 `Range`를 나타낸다.
예를 들어, `1..3`을 작성할 경우 1 ~ 3까지라는 의미를 갖게 된다.

<center>

<img src="https://github.com/Jwhyee/Jwhyee/assets/82663161/945fc2fc-701f-4b54-873b-6b3112ad530e">

</center>

위 그림과 같이 `Range`라는 실제 클래스가 존재하기 때문에 이러한 기능을 사용할 수 있는 것이다.

### Progression

> Progression은 등차수열을 의미한다.<br>
> 시작 값, 끝 값, 공차(몇 칸씩 움직일지)를 통해 생성할 수 있다.

`IntRange` 클래스를 살펴보면 `IntProgression`을 상속 받고 있다.

```kotlin
public class IntRange(start: Int, endInclusive: Int) : IntProgression(start, endInclusive, 1), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int get() = first
    override val endInclusive: Int get() = last
    ...
}
```

위와 같이 시작과 끝에 대한 값을 입력 받고, `IntProgression`에 넘겨주는 값 중 1은 `step`을 의미한다.
즉, `1..3`의 의미는 **1에서 시작하고, 3으로 끝나는 등차수열**을 의미하는 것이다.

```kotlin
// 시작값 3, 끝값 1, 공차 -1인 등차수열
3 downTo 1

// 시작값 1, 끝값 5, 공차 2인 등차수열
1 .. 5 step 2
```

여기서 나오는 `downTo`와 `step`은 함수이다.

```kotlin
public infix fun Int.downTo(to: Int): IntProgression {
    return IntProgression.fromClosedRange(this, to, -1)
}

public infix fun IntProgression.step(step: Int): IntProgression {
  checkStepIsPositive(step > 0, step)
  return IntProgression.fromClosedRange(first, last, if (this.step > 0) step else -step)
}
```

함수는 보통 `variable.functionName(arg)`를 통해 사용한다고 선언하지만,
`kotlin`에서는 위와 같이 `variable functionName arg` 형태로 사용할 있는 중위 함수가 존재한다.

### 동작 원리

아래 코드에 대한 동작 원리를 한 번 살펴보자.

```kotlin
1 .. 5 step 2
```

- `1 .. 5` : 1 ~ 5까지 공차가 1인 등차수열을 생성
- `step 2` : 등차수열에 대한 함수 호출
  - `등차수열.step(2)`과 같은 맥락
- 결과 : 1 ~ 5까지 공차가 2인 등차수열

```kotlin
val intRange: IntRange = 1..5
val intProgression: IntProgression = intRange.step(2)
```

즉, 최종적으로 위 코드와 동일하게 작동되는 것이다.

## 정리

- for-each에서 java는 `:` kotlin은 `in`을 사용한다.
- 전통적인 for문에서 kotlin은 등차수열과 in을 사용한다.
- kotlin에서의 while은 java와 동일하다.
