---
title: "[Kotlin] - 코틀린에서 Type을 다루는 방법"
last_modified_at: 2023-11-30T22:10:37-23:30
categories: [Lecture]-Language
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture3"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 기본 타입

`java`에서 사용하는 기본 타입을 `kotlin`에서도 동일하게 사용할 수 있다.
또한, `kotlin`에서는 타입을 지정해주지 않아도 선언된 기본값을 보고 타입을 추론한다.

```kotlin
val num1 = 3        // Int
val num2 = 3L       // Long

val num3 = 3.0f     // Float
val num4 = 3.0      // Double
```

### 기본 타입 변환

위와 같이 수 뒤에 어떠한 리터럴이 오느냐에 따라 타입이 바뀌게 된다.

`java`에서의 기본 타입간의 변환은 **암시적**으로 이루어질 수 있다.

```java
int num1 = 10;
long num2 = num1;
System.out.println(num2);
```

하지만 `kotlin`에서 기본 타입간의 변환은 **명시적**으로 이루어져야 한다.

```kotlin
val num1 = 3
// 컴파일 에러 발생 : Type mismatch
val num2: Long = num1
```

위와 같이 `Int` 타입을 더 큰 바이트를 가진 `Long` 타입에 넣을 경우 컴파일 에러가 발생한다.

```kotlin
val num1 = 3
// 컴파일 에러 발생 : Type mismatch
val num2: Long = num1
```

이러한 문제를 해결하기 위해서는 `to변환타입()`을 사용해야 한다.

```kotlin
val num1 = 3
val num2: Long = num1.toLong()
println(num2)
```

`nullable`일 경우에도 동일하다.

```kotlin
val num1: Int? = 3
val num2: Long = num1?.toLong() ?: 0L
println(num2)
```

## 타입 캐스팅

`java`에서는 기본 타입이 아닌 일반 타입에 대한 캐스팅은 보통 아래와 같이 진행한다.

```java
public static void printNameIfPerson(Object obj) {
    if (obj instanceof Person) {
        Person person = (Person) obj;
        System.out.println(person.getName());
    }
}
```

이 코드를 `kotlin`으로 변환하면 다음과 같다.

```kotlin
fun printNameIfPerson(obj: Any) {
    // is == instanceof
    if (obj is Person) {
        // as Person == (Person) obj
        val p = obj as Person
        println(p.name)
    }
}
```

사실 위 코드에서 타입 검사를 마쳤을 경우 `as`를 통한 캐스팅 없이 바로 **스마트 캐스트**가 가능하다.

```kotlin
fun printNameIfPerson(obj: Any) {
    if (obj is Person) {
        println(obj.name)
    }
}
```

이러한 기능은 `Java 16`에서 부터도 사용할 수 있다.

```java
public static void printNameIfPerson(Object obj) {
    if (obj instanceof Person p) {
        System.out.println(p.getName());
    }
}
```

반대로 `is`의 부정은 `!is`로 사용하면 된다.

### nullable

다음 코드를 한 번 살펴보자.

```kotlin
fun printNameIfPerson(obj: Any?) {
    val p = obj as Person
    println(p.name)
}
```

만약 `obj`에 `null`이 들어올 경우 NPE가 발생하게 된다.
이는 간단하게 `as?`로 해결할 수 있다.

```kotlin
fun printNameIfPerson(obj: Any?) {
    val p = obj as? Person
    println(p.name)
}
```

## 특이한 타입

### Any

- `Object` 클래스 역할(모든 객체의 최상위 타입)
- 모든 Primitive Type의 최상위 타입
  - `java`의 경우 Primitive의 최상위 타입이 존재하지 않음
- `Any` 자체로는 `null`을 표현할 수 없음
  - 표현해야할 경우 `Any?`로 표현
- `Any`에 `equals` / `hashCode` / `toString`이 존재

### Unit

- `void`와 동일한 역할
- `void`와 다르게 그 자체로 타입 인자로 사용이 가능
- 함수형 프로그래밍에서 `Unit`은 단 하나의 인스턴스만 갖는 타입을 의미
  - `kotlin`에서의 `Unit`은 실제 존재하는 타입이라는 것을 표현

### Nothing

- 함수가 정상적으로 끝나지 않았다는 사실을 표현하는 역할
- 무조건 예외를 반환하는 함수 / 무한 루프 함수 등
- 자주 사용되진 않음

```kotlin
fun fail(msg: String): Nothing {
    // 무조건 예외를 던짐
    throw IllegalArgumentException(msg)
}
```

## String

`kotlin`에서의 문자열 처리에 대해 알아보자.

### interpolation

문자열에 값을 추가하는 방식은 굉장히 다양하다.

```java
Person p = new Person("Jwhy", 20);
String log = String.format("사람의 이름은 %s이고, 나이는 %s세 입니다.", p.name, p.age);
```

위 코드와 같이 `format`을 사용할 수도 있고, `StringBuilder`를 사용하는 등 여러 방법이 존재한다.
하지만 `kotlin`에서는 `javascript`의 백틱을 이용한 문자열 표현과 비슷하게 값을 표현할 수 있다.

```kotlin
val p = Person("Jwhy", 20)
val log = "사람의 이름은 ${p.name}이고, 나이는 ${p.age}세 입니다."
```

만약 특정 변수에서 `method call`을 사용하지 않을 경우에는 중괄호를 생략할 수 있다.

```kotlin
val p = Person("Jwhy", 20)
val name = p.name
val age = p.age
val log = "사람의 이름은 $name이고, 나이는 $age세 입니다."
```

변수 이름만 사용하더라도 중괄호를 사용하는 것이 **가독성** / **일괄 변환** / **정규식 활용** 측면에서 더 좋다.

### indexing

`java`에서 문자열의 특정 문자를 가져올 때에 다음과 같이 사용한다.

```java
String str = "ABCDE";
char ch = str.charAt(2);
```

`kotlin`에서는 배열처럼 대괄호를 통해서 가져올 수 있다.

```kotlin
val str = "ABCDE"
val ch = str[2]
```

## 정리

- kotlin의 변수는 초기값을 보고 타입을 추론한다.
  - 기본 타입들 간의 변환은 명시적으로 이루어진다.
- is, !is, as, as?를 이용해 타입을 확인하고 캐스팅한다.
- Any는 Object와 같은 최상위 타입이다.
- Unit은 void와 동일하다.
- Nothing은 정상적으로 끝나지 않는 함수의 반환을 의미한다.
- 문자열을 가공할 때, ${변수}를 사용하면 깔끔한 코딩이 가능하다.