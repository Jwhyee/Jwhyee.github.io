---
title: "[Kotlin] - 코틀린에서 예외를 다루는 방법"
last_modified_at: 2023-12-06T22:10:37-23:30
categories: "[Lecture]-Language"
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture7"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## try-catch

`try-catch`는 특정한 구문을 실행할 때 발생하는 예외를 잡아서 처리를 해준다.
`java`에서 흔히 사용되는 `Integer.parseInt()`를 예시로 살펴보자.

```java
public final class Integer {
    public static int parseInt(String s) throws NumberFormatException {
        return parseInt(s,10);
    }

    public static int parseInt(String s, int radix) throws NumberFormatException {
        ...
    }
}
```

위 코드를 보면 `parseInt()`는 문자열을 숫자로 변환하는 과정에서 `NumberFormatException`을 던지는 것을 확인할 수 있다.
우리가 `parseInt()`를 사용할 때, 잘못된 문자열을 넣을 경우 위와 같은 예외가 발생하는데, 이를 처리할 수 있는 기능이 바로 `try-catch`이다.

```java
private int parseIntOrThrow(@NotNull String str) {
    try {
        return Integer.parseInt(str);
    } catch (NumberFormatException e) {
        throw new IllegalArgumentException(String.format("주어진 %s는 숫자가 아닙니다.", str));
    }
}
```

위 코드를 `kotlin`으로 변경해보자.

```kotlin
fun parseIntOrThrow(str: String): Int {
    try {
        return str.toInt()
    } catch (e: NumberFormatException) {
        throw IllegalArgumentException("주어진 ${str}은 숫자가 아닙니다.")
    }
}
```

문자열을 정수형으로 변환하는 과정인 `str.toInt()`를 제외하고는 큰 차이가 없다.
그렇다면 이번에는 예외가 발생했을 때, `null`을 반환하는 코드를 작성해보자.

```java
private Integer parseIntOrThrowV2(String str) {
    try {
        return Integer.parseInt(str);
    } catch (NumberFormatException e) {
        return null;
    }
}
```

위와 같이 `java`에서는 `null`을 반환하려면 반환 타입을 `Integer`와 같은 래퍼 클래스(Wrapper Class)로 반환을 해야한다.

```kotlin
fun parseIntOrThrowV2(str: String): Int? {
    return try {
        str.toInt()
    } catch (e: NumberFormatException) {
        null
    }
}
```

`kotlin`에서는 `try-catch`를 조건문과 같이 하나의 **Expression**으로써 사용할 수 있다.

## Checked / Unchecked Exception

우선 `java`에서 파일에 있는 내용물을 읽어드리는 코드를 통해 확인해보자.

```java
public void readFile() throws IOException {
    File currentFile = new File(".");
    File file = new File(currentFile.getAbsolutePath() + "/a.txt");
    BufferedReader reader = new BufferedReader(new FileReader(file));
    System.out.println(reader.readLine());
    reader.close();
}
```

위 코드를 보면 `try-catch`를 통해 예외를 잡은 것이 아닌 메소드단에서 `IOException`을 던져주는 것을 볼 수 있다.
즉, 다른 곳에서 `readFile()`이라는 함수를 사용할 경우 체크 예외가 날 수 있다고 표시를 해주는 것이다.

```kotlin
fun readFile() {
    val currentFile = File(".")
    val file = File(currentFile.absolutePath + "/a.txt")
    val reader = BufferedReader(FileReader(file))
    println(reader.readLine())
    reader.close()
}
```

`java`에서 위 코드를 작성할 때는 컴파일 에러가 발생하면서 `IOException`을 처리하라고 했다.
하지만 `kotlin`에서 위 코드를 작성할 때에는 `IOException`을 던지지 않아도 컴파일 에러도 나지 않는다.

그 이유는 `kotlin`에서는 **Checked**과 **Unchecked**을 따로 구분하지 않고, 모두 **Unchecked Exception**이기 때문이다.

## try-with-resources

> try-with-resources란, try 내에서만 사용할 객체를 정의한 후, 자동으로 해당 리소스를 닫아주는 기능을 의미한다.
> 자세한 내용은 [링크](https://jwhyee.github.io/effective-java/effective-java-item-9/)에서 확인 가능

우선, `java`에서 어떻게 사용하는지 확인해보자.

```java
public void readFile(String path) throws IOException {
    try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
        System.out.println(reader.readLine());
    }
}
```

위 코드를 보면 `try`에 괄호가 생겨서 안에 외부 자원을 넣어서 만들어주고, `try`가 끝나면 자동으로 해당 외부 자원을 닫아주게 된다.
즉, `reader` 객체의 스코프 범위는 `try` 내부로 한정되며, 블록 밖을 나가게 되면 자동으로 `close()`를 호출하게 되는 것이다.

```kotlin
fun readFile(path: String) {
    BufferedReader(FileReader(path)).use { reader ->
        println(reader.readLine())
    }
}
```

이번 `kotlin` 코드는 `java`와 아주 다른 모습을 하고 있다.
`kotlin`에는 `try-with-resources`라는 개념이 없기 때문에 `.use { }`라는 확장 함수를 통해 자원을 사용하고, 해당 블록을 나가게 되면 자동으로 `close()`가 실행된다.

```kotlin
@InlineOnly
public inline fun <T : Closeable?, R> T.use(block: (T) -> R): R {
    ...
    try {
        return block(this)
    } catch (e: Throwable) {
        exception = e
        throw e
    } finally {
        when {
            apiVersionIsAtLeast(1, 1, 0) -> this.closeFinally(exception)
            this == null -> {}
            exception == null -> close()
            else ->
                try {
                    close()
                } catch (closeException: Throwable) {
                    // cause.addSuppressed(closeException) // ignored here
                }
        }
    }
}
```

내부 구현을 살펴보면 `try` 내부에서 `block(this)`를 통해, 사용자가 `use { }` 내부에 작성한 코드를 실행해주고, 최종적으로 `close()`까지 실행해주는 모습을 볼 수 있다.
`java`에서는 `Closeable`을 구현해야지 `try-with-resources`를 사용할 수 있다.
`kotlin`에서도 `.use`가 정의된 곳을 확인해보면 `Closeable` 파일 내부에 있는 것을 확인할 수 있다.

## 정리

- try-catch-finally 구문은 문법적으로 완전히 동일하다.
  - kotlin에서는 expression으로 사용이 가능하다.
- 모든 예외는 Unchecked Exception이다.
- try-with-resources 구문은 없지만, use라는 확장 함수를 통해 close를 자동 호출할 수 있다.
