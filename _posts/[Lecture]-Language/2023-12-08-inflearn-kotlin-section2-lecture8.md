---
title: "[Kotlin] - 코틀린에서 함수를 다루는 방법"
last_modified_at: 2023-12-08T22:10:37-23:30
categories: [Lecture]-Language
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture8"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 함수 선언 문법

두 정수를 받아 더 큰 정수를 반환하는 예제를 통해 살펴보자.

```java
public int max(int a, int b) {
    if(a > b) return a;
    return b;
}
```

```kotlin
fun max(a: Int, b: Int): Int {
    if(a > b) return a
    return b
}
```

`java`, `kotlin` 모두 크게 다를 것이 없다.
하지만 `kotlin`에서의 조건문은 하나의 식(Expression)으로 표현할 수 있다고 배웠다.
그렇기 때문에 아래와 같이 변경이 가능하다.

```kotlin
fun max(a: Int, b: Int): Int {
    return if (a > b) a
    else b
}
```

이렇게 식으로 표현할 수 있는 함수는 다음과 같이 수정할 수도 있다.

```kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

달라진 점은 아래와 같다.

- 중괄호가 아닌 `=` 연산자 사용
  - 함수가 하나의 결과값이면 `block` 대신 `=` 연산자를 사용 가능하다.
- 반환 타입을 명시하지 않음
  - `=`을 사용하는 경우 매개변수의 타입이 모두 `Int`로 동일하기 때문에 타입 추론이 가능하다.

`java`에서 접근지시어를 지정하지 않을 경우 `default`가 되지만, `kotlin`에서는 따로 명시하지 않을 경우 `public`이 기본 제어자가 된다.

## default parameter

주어진 문자열을 N번 반복해서 출력하는 코드를 통해 확인해보자.

```java
public void repeat(String str, int num, boolean useNewLine) {
    for (int i = 1; i <= num; i++) {
        if (useNewLine) {
            System.out.println(str);
        } else {
            System.out.print(str);
        } 
    }
}

// println을 더 많이 활용해서 생긴 오버로딩
public void repeat(String str, int num) {
    repeat(str, num, true);
}

// 3을 자주 사용해서 생긴 오버로딩
public void repeat(String str) {
    repeat(str, 3, true);
}
```

위 주석과 같이 사용자가 무엇을 더 많이 사용하는냐에 따라 메소드 오버로딩을 제공할 수 있다.
하지만 가장 불편한 것은 '함수를 굳이 3개를 만들어서 사용해야하느냐'이다.

```kotlin
fun repaet(
    str: String,
    num: Int = 3,
    useNewLine: Boolean = true
) {
    for (i in 1..num) {
        if (useNewLine) {
            println(str)
        } else {
            print(str)
        }
    }
}
```

`kotlin`의 함수를 살펴보면 파라미터 뒤에 기본 값을 넣어준 것을 볼 수 있다.

```kotlin
fun main() {
    repaet("Hello")
    repaet("Hello", 3)
    repaet("Hello", 3, false)
}
```

위와 같이 하나의 함수로 3가지 방식으로 작성할 수 있게 된다.

> 함수의 매개변수에 기본값을 지정해줄 경우 매개 변수에 값이 들어오지 않으면 기본값을 사용한다.
> 또한, `kotlin`에도 메소드 오버로딩 기능이 있다.

## named argument(parameter)

위에서 봤던 코드에서 num은 그대로 사용하고 싶고, `useNewLine`만 바꿔서 사용하고 싶을 때가 있을 수 있다.

```kotlin
fun main() {
    repaet("Hello", 3, false)
}
```

가장 기본적인 방법으로는 위와 같이 모든 인자를 입력하는 방식이 있다.
하지만 우리는 `repeat()`에 기본값(default)을 지정해놓았기에 다소 불편하게 보인다.
이럴 때 `named argument`를 사용하면 편하게 코드를 작성할 수 있게 된다.

```kotlin
fun main() { 
    repaet("Hello", useNewLine = false)
}
```

위처럼 함수를 호출하는 부분에서 원하는 매개변수의 이름을 통해 값을 넣어줄 수 있다.
이렇게 사용할 수 있는 이유는 다른 값에 기본값을 지정해주었기 때문이다.

이러한 `named argument`는 동일한 타입의 매개변수가 많은 경우에도 유용하게 사용할 수 있다.

```kotlin
fun main() {
    printNameAndGender("Female", "최홍만")
}

fun printNameAndGender(name: String, gender: String) { 
    println(name)
    println(gender)
}
```

위와 같이 동일한 타입의 매개변수가 있을 때, 헷갈려서 반대로 넣는 경우가 있다.
이는 타입이 같기 때문에 컴파일단에서 확인할 수 없고, 실행을 해야 결과를 확인할 수 있다.

```kotlin
fun main() {
    printNameAndGender(gender = "Female", name = "최홍만")
}
```

이렇게 함수 파라미터의 위치와 동일하지 않더라도 매개변수의 이름을 통해 정확한 전달이 가능하다.

### 자바 함수 가져오기

> 단, `java` 코드로 작성한 함수를 가져와 사용할 때에는 named argument를 사용할 수 없다.

```java
public repeat(Ljava/lang/String;I)V
 L0
  LINENUMBER 24 L0
  ALOAD 0
  ALOAD 1
  ILOAD 2
  ICONST_1
  INVOKEVIRTUAL example/inflearn_starter/chap2/lect8/FunctionTest.repeat (Ljava/lang/String;IZ)V
 L1
  LINENUMBER 25 L1
  RETURN
 L2
  LOCALVARIABLE this Lexample/inflearn_starter/chap2/lect8/FunctionTest; L0 L2 0
  LOCALVARIABLE str Ljava/lang/String; L0 L2 1
  LOCALVARIABLE num I L0 L2 2
  MAXSTACK = 4
  MAXLOCALS = 3
```

앞서 위에서 작성한 `java` 코드로 작성한 `repeat` 함수의 바이트 코드이다.
위를 보면 `str`, `num`, `useNewLine`에 대한 이름을 찾을 수 없다.
`java` 코드가 바이트 코드로 변환되면서, 변수 이름을 보존하고 있지 않기 때문에 `kotlin`에서 해당 변수의 이름을 사용할 수 없다.

```kotlin
// 에러 발생 : Named arguments are not allowed for non-Kotlin functions
FunctionTest.repeat(str = "Hello", 1, false)
```

## 같은 타입의 여러 파라미터 받기(가변인자)

`java`에서 같은 타입의 여러 파라미터를 받을 경우 다음과 같이 작성할 수 있다.

```java
public static void main(String[] args) {
    // 호출 방법 1
    printAll("Hello", "World", "!");
    
    // 호출 방법 2
    String[] arr = new String[]{"Hello", "World", "!"}
    printAll(arr);
}

public static void printAll(String... strings) {
    for (String string : strings) {
        System.out.println(string);
    }
}
```

이렇게 `...`을 사용할 경우 배열로 인식해 사용할 수 있게 된다.

```kotlin
fun main() {
    // 호출 방법 1
    printAll("Hello", "World", "!")

    // 호출 방법 2
    val arr = arrayOf("Hello", "World", "!")
    printAll(*arr)
}

fun printAll(vararg strings: String) {
    for (str in strings) {
        println(str)
    }
}
```

`kotlin`의 경우에는 `...` 대신 `vararg`를 사용한 것을 볼 수 있고, 호출 방법 2와 같이 배열을 보내줄 때 `*`과 함께 사용한 것을 볼 수 있다.
이는 `spread` 연산자라고 불리며, 배열 안에 있는 것들을 마치 `,`를 쓰는 것처럼 꺼내주게 된다.

## 정리

- body가 하나의 값으로 간주되는 경우 block을 없앨 수도 있고, block이 없다면 반환 타입을 없앨 수도 있다.
- 함수 파라미터에 기본값을 설정해줄 수 있다.
- 함수를 호출할 때, 특정 파라미터를 지정해 넣어줄 수 있다.
- 가변인자에는 vararg 키워드를 사용하며, 가변인자 함수를 배열과 호출할 때는 *(spread) 연산자를 붙어주어야 한다.
