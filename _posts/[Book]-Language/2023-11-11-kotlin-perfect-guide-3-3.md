---
title: "[Kotlin] - 제어문"
last_modified_at: 2023-11-11T22:10:37-23:30
categories: "[Book]-Language"
tags:
  - 코틀린 완벽 가이드
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter3"
toc_icon: "file"
---

**코틀린 완벽 가이드**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

# 제어문

`kotlin`의 제어문은 `java`와 꽤나 다른 모습을 보인다. 차이점을 하나씩 보면서 공부해보도록 하자!

## 조건문

`kotlin`에서의 조건문은 `if`, `when`으로 나뉜다.

### if

`if`문은 불(boolean) 식의 결과에 따라 두가지 대안 중 하나를 선택할 수 있다.

```kotlin
fun main() {
    println(max(20, 30))
}

fun max(a: Int, b: Int): Int {
    if(a > b) return a
    return b
}
```

이렇게만 보면 `java`와 별 차이가 없는 것처럼 보이지만, 유연하게 활용할 수 있는 방법이 있다.

`java`에서는 `if`문을 사용해 변수에 값을 할당하려면 아래와 같이 작성해야 한다.

```java
public class Test {
    public static void main(String[] args) {
        int num;

        if (args.length == 0) num = 0;
        else num = args.length;

        System.out.println(num);
    }
}
```

코드 블록으로 감싸면 굉장히 길고, 불필요한 느낌이 든다.
하지만 `kotlin`의 경우 변수에 바로 값을 할당 할 수 있다.

```kotlin
fun main(args: Array<String>) {
    val num = if (args.isEmpty()) { 0 } else args.size
}
```

이러한 유연함 덕분에 코드 다이어트는 물론이고, 보다 더 명확하게 어떠한 값이 저장되는지 쉽게 알 수 있다.
`if`문을 위 코드처럼 식으로 사용할 경우 `null`을 방지하기 위한 `else`문도 필요하다.

이러한 방식을 지원하는 이유는 `kotlin`에는 삼항연산자 기능이 없기 때문이다.
`java`에서의 삼항연산자는 여러 줄의 연산을 할 수 없지만, `kotlin`에서는 식으로 사용할 경우 여러 줄로 작성이 가능하다.

```kotlin
fun main() {
    // 10/3 입력
    val str = readln()
    val idx = str.indexOf("/")

    val result = if (idx >= 0) {
        val a = str.substring(0, idx).toInt()
        val b = str.substring(idx + 1).toInt()
        (a/b).toString()
    } else ""

    // 출력 : 3
    println("result = $result")
}
```

### 범위, 진행, 연산

`when`절을 보기 전에 위 내용에 대해 먼저 짚고 넘어가자.

`java`를 이용해 코딩 테스트 문제를 풀 때, 가장 불편했던 것은 범위를 지정하는 것이다.

`0 <= nx < W`, `0 <= ny < H`를 표현하기 위해서는 아래와 같이 작성해야 한다.

```java
if(nx >= 0 && nx < W && ny >= 0 && ny < H) { doSomething }
```

`kotlin`은 순서가 정해진 값 사이의 수열(interval)을 표현하는 몇 가지 타입을 제공해 훨씬 수월하게 코드를 작성할 수 있다.

```kotlin
if (nx in 0..(W - 1) && ny in 0..(H - 1)) { doSomething() }
```

우선 코드에서 보이는 `..`은 범위를 지정하는 연산자이다.

`0..2`라고 지정할 경우 0에서 2까지의 범위를 지정하는 것이며, 0, 1, 2를 의미한다.
여기서 `in` 연산을 사용하면, 어떤 값이 범위 안에 들어있는지 확인할 수 있다.

즉, 위 코드는 nx가 0에서 W까지 속해있고, ny가 0에서 H까지 속해있을 경우를 의미하는 것이다.

이와 같이 숫자를 제외하고 문자열 혹은 문자 타입에서도 사용이 가능하다.

```kotlin
fun main() {
    val c = 'c'
    // false
    println(c in 'a' .. 'b')
    // true
    println(c in 'a' .. 'c')

    val str = "xyy"
    // false
    println(str in "aaa" .. "xyx")
    // true
    println(str in "aaa" .. "xyz")
}
```

정리해보면, `..` 연산자는 시작 값과 끝 값을 모두 포함하는 범위를 나타낸다.
만약 끝 값을 포함하고 싶지 않다면 `until` 연산을 사용하면 된다.

```kotlin
if (nx in 0 until W && ny in 0 until H) { doSomething() }
```

위 처럼 작성하면 `0 <= nx < W`, `0 <= ny < H `식을 완벽히 나타낸 코드가 된다.

### when

`when`절은 `switch`문과 비슷하다고 생각하면 된다.

특정 수를 입력하면 16진수로 변경해주는 프로그래밍을 예시로 코드를 확인해보자.

우선, `java` 13버전에서 릴리즈된 람다식을 이용한 `switch`문을 먼저 살펴보도록 하자.

```java
public class Test {
    public static void main(String[] args) {
        int n = 13;

        char c = switch (n) {
            case 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 -> '0';
            case 10, 11, 12, 13, 14, 15 -> (char)('A' + n - 10);
            default -> '?';
        };

        System.out.println(c);
    }
}
```

`java`에서는 `switch`를 사용해 변수에 바로 값을 넣을 수 있게 업데이트 되었지만,
`case`에 조건식을 사용할 수 없기 때문에 모든 수를 각각 입력해줘야하는 번거로움이 있다.

`kotlin`의 경우에는 `when`절 내부에 범위 연산자인 `..`을 사용할 수 있기 때문에 더욱 유연한 프로그래밍이 가능하다.

```kotlin
fun main() {
    println(hexDigit(13))
}

fun hexDigit(n: Int): Char {
    /*
    아래와 동일한 코드
    when {
        n in 0..9 -> return '0' + n
        n in 10..15 -> return 'A' + n - 10
        else -> return '?'
    }
    */
    when (n) {
        in 0..9 -> return '0' + n
        in 10..15 -> return 'A' + n - 10
        else -> return '?'
    }
}
```

`switch`와 여러 대안 중 하나를 선택한다는 것은 비슷하지만, 가장 큰 차이점은 조건식의 여부이다.
`when`에서는 임의의 조건을 검사할 수 있지만, `switch`문은 주어진 식의 여러 가지 값 중 하나만 선택할 수 있다는 점이다.

> `switch`는 fall-through라는 의미로, 어떤 조건을 만족할 때 프로그램이 해당 조건에 대응하는 문을 실행하고, 명시적으로 break를 만날 때까지 그 이후의 모든 가지를 실행한다.

`kotlin`의 경우 조건을 만족하는 가지만 실행하고, 절대 폴스루를 하지 않는다.

`kotlin` 1.3부터는 식의 대상을 변수에 연결(binding)할 수 있다.

```kotlin
fun readHexDigit() = when (val n = readLine()!!.toInt()) {
    in 0..9 -> '0' + n
    in 10..15 -> 'A' + n - 10
    else -> '?'
}
```

## 반복문

`java`에서의 `for-loop`는 아래 코드와 같이 생겼다.

```java
public class Test {
    public static void main(String[] args) {
        for (int i = 0; i <= 10; i++) {
            System.out.print(i + " ");
        }
    }
}
```

하지만, `kotlin`에서의 `for` 루프는 `java`의 `for-each`와 비슷한 형태를 띈다.

```kotlin
fun main() {
    for (i in 0 until 10) {
        print("$i ")
    }
}
```

만약 `i+=2`와 같이 값을 특정 수만큼 올려주고 싶으면 어떻게 작성해야할까?

바로 `step` 연산을 사용하여 `1..10 step 2`와 같이 원하는 정수를 작성해주면 끝이다.

```kotlin
fun main() {
    // 출력 : 0 2 4 6 8 10
    for (i in 0 .. 10 step 2) {
        print("$i ")
    }
}
```

`i--`와 같이 반대로 루프를 돌고 싶을 경우에는 `downTo` 키워드를 사용하면 된다.

```kotlin
fun main() {
    // 출력 : 10 8 6 4 2 0
    for (i in 10 downTo 0 step 2) {
        print("$i ")
    }
}
```

### 내포된 루프와 레이블

`java`에서의 레이블은 아래와 같이 사용된다.

```java
public class Solution {
    public static void main(String[] args) {
        outer: for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                if (i * j == 32) {
                    // i = 4, j = 8 출력
                    System.out.printf("i = %d, j = %d", i, j);
                    break outer;
                }
            }
        }
    }
}
```

`kotlin`도 크게 다르진 않지만, `@`를 사용해 레이블을 표현한다.

```kotlin
fun main() {
    outer@ for (i in 0 until 10) {
        for (j in 0 until 10) {
            if (i * j == 32) {
                println("i = $i, j = $j")
                break@outer
            }
        }
    }
}
```

간단한 Up&Down 게임을 만들어보면 아래와 같다.

```kotlin
import kotlin.random.Random

fun main() {
    val num = Random.nextInt(1, 101)
    outer@ while (true) {
        var guess = readln().toInt()

        val msg = when {
            guess < num -> "up"
            guess > num -> "down"
            else -> break@outer
        }
        println(msg)
    }
    println("answer : $num")
}
```