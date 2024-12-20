---
title: "[Kotlin] - 함수"
last_modified_at: 2023-11-10T22:10:37-23:30
categories: [Book]-Language
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

## 함수

`kotlin`의 함수는 `java`와 일반적으로 비슷하면서 다른 부분이 많다.

### Unit

함수의 반환 타입에는 `Unit`을 사용할 수 있다. `Unit`은 `java`에서의 `void`와 동일하다고 보면 된다.
함수가 의미있는 반환값을 돌려주지 않는다는 뜻이다.

아래 두 코드를 확인해보자.

```kotlin
fun main(args: Array<String>) {
    var arr = intArrayOf(1, 2, 3)
    increaseArr(arr, 1)
    println(arr[1])
}

fun increaseArr(arr : IntArray, idx : Int) {
    ++arr[idx]
}

fun increaseArr(arr : IntArray, idx : Int): Unit {
    ++arr[idx]
}
```

위 코드는 반환 값 없이 작업만 처리하는 함수이다.
코드에서 보이는대로 `Unit`이라는 상수를 사용하거나, 명시하지 않을 경우 `kotlin`은 알아서 `Unit` 함수로 파악한다.

`java`와 같이 중간에 탈출하기 위해서는 아래와 같이 사용한다.

```kotlin
fun increaseArr(arr : IntArray, idx : Int) {
    ++arr[idx]
    if(arr[idx] == 1)
        return Unit;
    arr[idx] += 5
}
```

### 함수식

어떤 함수가 단일 식으로만 구현될 수 있다면 `return` 키워드와 중괄호를 생략할 수 있다.

```kotlin
// 리턴 타입 추론
fun circleArea(radius: Double) = PI * radius * radius

// 리턴 타입 명시
fun circleArea(radius: Double) : Double = PI * radius * radius
```

위와 같이 간단한 식은 단일 식으로 표현하기 좋지만,
복잡하게 표현된 식이 본문인 함수는 블록 구문을 사용해 가독성을 높여주는 것이 좋다.

블록이 본문인 함수를 식으로 표현한 경우 원하는 결과가 나오지 않는다.

```kotlin
fun main() {
    println(circleArea(10.0))
}

fun circleArea(radius: Double) = {Math.PI * radius * radius}
```

```bash
Function0<java.lang.Double>
```

위와 같이 작성하는 것은 익명 함수를 기술하는 람다로 해석되기 때문에 `Function<>` 형태로 출력된다.

```kotlin
fun circleArea(radius: Double) = {return Math.PI * radius * radius}
```

만약 위 코드와 같이 값을 반환하도록 `return`을 추가할 경우 타입 불일치로 인해 컴파일 에러가 발생한다.

> 즉, 간단한 식은 블록 없이 사용하는 것이 좋으며, 식이 길어질 경우 함수식이 아닌 일반 함수를 통해 가독성을 증가시키자.

### 위치 기반 인자, 이름 붙은 인자

`kotlin`에서는 함수를 호출할 때, 인자를 순서에 상관없이 보내줄 수 있다.

우선 `java`의 예시를 확인해보자.

```java
public static void main(String[] args) {
    System.out.println(sum(10, 20));
}

private static int sum(int a, int b) {
    return a + b;
}
```

`java`는 위와 같이 함수의 매개변수 위치에 맞게 인자를 넣어야한다.

`kotlin`의 경우에는 위 방식도 가능하며, 인자에 파라미터 이름을 지정해 순서에 상관없이 보내줄 수 있다.

```kotlin
fun main() {
    println(sum(b = 20, a = 40))
}

fun sum(a: Int, b: Int): Int {
    return a + b
}
```

### 오버로딩

`java`와 마찬가지로 `kotlin`에서도 메소드 오버로딩이 가능하다.

> 오버로딩이란, 같은 이름의 함수를 여러 개 작성하는 것을 의미한다.

우선 틀린 방식의 오버로딩을 살펴보자.

```kotlin
fun main() {
    val result = plus("10", "20")
    println(result)
}

fun plus(a: String, b: String) = a + b
fun plus(a: String, b: String) = a.toInt() + b.toInt()
```

위 코드를 보면 `plus`라는 이름의 함수가 2개 존재한다.
하지만, 두 함수의 파라미터는 동일한 타입을 갖고 있다.

`main()`에서 해당 `plus` 함수를 사용한다고 가정하면, 어떤 함수를 사용해야할까?
이러한 문제 때문에 동일한 매개변수로는 오버로딩할 수 없다.

아래 코드로 변환하면 정상적으로 작동하는 것을 볼 수 있다.

```kotlin
fun main() {
    println(plus("10", "20"))
    println(plus(10, 20))
}

fun plus(a: String, b: String) = a + b
fun plus(a: Int, b: Int) = a + b
```

오버로딩의 조건은 다음과 같다.

1. 파라미터의 개수가 다르다.
2. 파라미터의 개수가 같으면, 타입이 달라야한다.

주어진 호출 식에 대해 실제 호출할 함수를 결정할 때, 컴파일러는 아래와 같은 `java` 오버로딩 해소 규칙과 비슷한 규칙을 따른다.

1. 파라미터의 개수와 타입을 기준으로 호출할 수 있는 모든 함수를 찾는다.
2. 덜 구체적인 함수는 제외시킨다.
    - 1번에서 찾은 목록 중에서 파라미터의 상위 타입인 경우 덜 구체적이므로 제외된다.
    - 덜 구체적인 함수가 제외될 때까지 반복한다.
3. 후보가 하나로 압축될 경우 해당 함수를 호출한다.
    - 후보가 둘 이상일 경우 컴파일 에러가 발생한다.

아래 코드를 살펴보자.

```kotlin
fun main() {
    // 1번 코드
    println(mul(1, 2))
    // 2번 코드
    println(mul(1, 2, 3))
    // 3번 코드
    println(mul("abc", 3))
    // 4번 코드
    println(mul(1L, 2))
}
// 1번 함수
fun mul(a: Int, b: Int) = a * b
// 2번 함수
fun mul(a: Int, b: Int, c: Int) = a * b * c
// 3번 함수
fun mul(s: String, n: Int) = s.repeat(n)
// 4번 함수
fun mul(o:Any, n:Int) = Array(n) {o}
```

2번 코드
- 규칙 1번에서 2번 함수로 바로 추려진다.

3번 코드
- 규칙 1번에서 3, 4번 함수를 추린다.
- 규칙 2번에서 `String` 상위 타입인 `Any`가 있기 때문에 제외하고, 3번 함수로 추려진다.

4번 코드
- 규칙 1번에서 `Long` 타입에 맞는 함수가 없으므로 상위 타입인 4번 함수로 추려진다.

> `Any`는 Java의 `Object` 클래스와 같이 가장 최상위 클래스에 해당한다.

만약 3번 코드에서 `mul("abc" as Any, 3)`로 변경하면 4번 함수로 변경된다.

> `as`는 타입 캐스팅을 의미한다.

### 디폴트 값

`kotlin`에서는 경우에 따라 함수 오버로딩 대신 더 우아한 해법인 디폴트 파라미터를 사용한다.

```kotlin
fun main() {
    val readInt = readInt()
    println("readInt = ${readInt}")
}

fun readInt(radix: Int = 10) = radix * 10
```

위 코드와 같이 디폴트 값을 지정해줄 수 있다.
그러면 `readInt()` 함수를 호출할 때, 인자를 넣지 않으면 기본값인 10을 사용해 연산을 해준다.
만약 인자를 넣을 경우 해당 값으로 연산을 해준다.

만약 함수의 파라미터가 여러 개일 경우 디폴트 값이 있는 매개변수를 뒤쪽으로 몰아두는 것이 좋은 코드 컨벤션이다.

```kotlin
fun mul(a: Int, b: Int, c: Int = 1) = a * b * c
fun mul(a: Int, b: Int = 1, c: Long = 1) = a * b * c
```

### vararg

`kotlin`의 배열에서 인자의 개수가 정해지지 않았을 경우 `arrayOf()`를 사용해 배열을 생성한다.

```kotlin
fun main() {
    val arr: Array<Int> = arrayOf(1, 2, 3)

    println("arr = ${arr.contentToString()}")
}
```

함수의 매개변수에도 이와 같이 인자의 개수가 정해지지 않았을 경우 파라미터를 적절한 배열 타입으로 사용할 수 있다.

```kotlin
fun main() {
    printSorted(6, 3, 7, 8, 2)
}

fun printSorted(vararg items: Int) {
    items.sort()
    println("items = ${items.contentToString()}")
}
```

사실 `java`에도 `varargs`가 존재한다.

```java
public class Test {
   public static void main(String[] args) {
      int[] arr = {6, 3, 7, 8, 2};
      System.out.println(arr);
      printSorted(arr);
   }

   private static void printSorted(int... args) {
      System.out.println(args);
      int[] sorted = Arrays.stream(args).sorted().toArray();
      System.out.println(Arrays.toString(sorted));
   }
}

```

`kotlin`에서는 조금 더 유연한 방식인 스프레드(spread)를 지원한다.

```kotlin
fun main() {
   val arr = intArrayOf(6, 3, 7, 8, 2)
   println(arr)
   printSorted(*arr)
}

fun printSorted(vararg items: Int) {
   println(items)
   items.sort()
   println("items = ${items.contentToString()}")
}
```

이러한 스프레드를 사용하면, 배열을 복사해 값을 넘겨주게 된다.
실제로 인자로 넘겨준 배열과, 매개변수로 받아온 배열의 주소값을 찍게 되면 다르게 나오는 것을 볼 수 있다.

```
[I@279f2327
[I@f6f4d33
```

> 즉, 스프레드를 사용해 배열을 넘기고 수정을 할 경우 원본 배열에 영향을 주지 않게 되는 것이다.

하지만 `java`의 경우 원본 배열의 주소값을 넘기기 때문에 원본 배열에 영향을 주게 된다.

```java
public class Test {
    public static void main(String[] args) {
        int[] arr = {6, 3, 7, 8, 2};
        printSorted(arr);
        // [6, 3, 9, 8, 2] 출력
        System.out.println(Arrays.toString(arr));
    }

    private static void printSorted(int... args) {
        args[2] = 9;
        int[] sorted = Arrays.stream(args).sorted().toArray();
        System.out.println(Arrays.toString(sorted));
    }
}
```

`kotlin`의 경우 깊은 복사가 아닌 얕은 복사만 이루어지기 때문에, 내부에 다른 참조가 있는 배열일 경우 결론적으로 영향을 받게 되니 주의해야한다.

### 함수의 가시성(접근 제한자)

`java`에서의 접근 제한자는 아래와 같다.

|     구분      | 설명               |
|:-----------:|------------------|
|   public    | 모든 곳             |
|  protected  | 같은 패키지 또는 자식 클래스 |
| default(기본) | 같은 패키지           |
|   private   | 클래스 내부           |

만약 접근 제한자를 선언하지 않을 경우 기본적으로 `default` 제한자를 가지게 된다.

`kotlin`의 경우 조금 다르다.
접근 제한자를 지정하지 않을 경우 기본적으로 `public`을 가지게 된다.

|     구분     | 설명                           |
|:----------:|------------------------------|
| public(기본) | 모든 곳                         |
| protected  | 해당 파일(.kt) 또는 클래스 내부와 자식 클래스 |
|  private   | 해당 파일(.kt) 또는 클래스 내부         |
|  internal  | 같은 모듈 내부                     |