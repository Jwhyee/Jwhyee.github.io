---
title: "[Kotlin] - null"
last_modified_at: 2023-11-20T22:10:37-23:30
categories: "[Book]-Language"
tags:
  - 코틀린 완벽 가이드
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter4"
toc_icon: "file"
---

**코틀린 완벽 가이드**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

`java`와 마찬가지로 `kotlin`에도 `null`이 존재한다.

> `null`이란, 그 어떤 할당된 객체도 가리키지 않는 참조를 뜻한다.

`java`에서는 모든 **참조 타입**의 변수에 `null`을 대입할 수 있지만, 해당 참조의 프로퍼티에 접근할 경우 NPE(Null Pointer Exception)이 발생한다.
이 오류가 잡기 어려운 이유는 컴파일 타임에 정적인 타입 정보만으로는 오류를 잡을 수 없어, 런타임이 되서야 오류를 찾을 수 있기 때문이다.

`kotlin` 타입 시스템에는 `null` 값이 될 수 있는 참조 타입과 `null` 값이 될 수 없는 참조 타입을 확실히 구분해주는 큰 장점이 있어, NPE 예외를 상당 부분 막을 수 있다.

## null이 될 수 있는 타입

`kotlin`에서는 기본적으로 모든 참조 타입은 `null`이 될 수 없는 타입이다.
따라서 `String` 같은 타입에 `null` 값을 대입할 수 없다.

```kotlin
fun main() {
    println(isLetterString("abc"))
    // Null can not be a value of a non-null type String
    println(isLetterString(null))
}

fun isLetterString(s: String): Boolean {
    if(s.isEmpty()) return false

    for (ch in s) {
        if(!ch.isLetter()) return false
    }

    return true
}
```

위 코드에서 볼 수 있듯, 인자로 `null`을 넘겨줄 경우 앞서 말한 것과 같이 참조타입인 파라미터 `s`는 값을 받지 못한다.
이런 식으로 함수에 `null`이 전달되지 않는다는 사실을 보장하므로, 함수 자체에서는 `null` 검사를 추가로 수행할 필요가 없다.

`kotlin`에서는 `String?`과 같이 `null`이 될 수 있는 타입을 정의할 수 있다.

```kotlin
fun isLetterString(s: String?): Boolean {
    
    if(s.isNullOrBlank()) return false
    
    for (ch in s) {
        if(!ch.isLetter()) return false
    }

    return true
}
```

위 코드를 보면 `s`가 `null`이 될 수 있는 타입으로 선언을 해줬기 때문에, 필수적으로 함수 내부에 `null`에 대한 처리를 해줘야 한다.
만약 `null` 처리를 해주지 않을 경우 컴파일 에러가 발생한다.

> `java`에서의 `null`처리는 개발자에겐 필수이지만, 컴파일러 입장에서는 자유기 때문에 에러를 띄워주지 않는다.

함수식에서는 조금 다르게 사용될 수 있다.

```kotlin
fun isBooleanString(s: String?) = s == "false" || s == "true"
```

간단하게 검사만하는 함수 식에서는 `null`에 대한 처리를 해주지 않아도 된다.
이런 상황에선 `NPE`를 발생시키는 것이 아닌 조건에 맞지 않으니 `false`를 반환해준다.

또한, `null`이 될 수 있는 타입을 기본 타입에 넣을 수 없다.

```kotlin
fun main() {
    val s: String? = "abc"
    // error : Type mismatch
    val ss: String = s
}
```

런타임에 `null`이 될 수 없는 값은 실제로 `null`이 될 수 있는 값과 차이가 없다. 둘 사이의 구분은 컴파일 수준에서만 존재한다.

코틀린 컴파일러는 `null`이 될 수 없는 값을 표현하기 위해 `java`의 `Optional`과 같은 래퍼 클래스를 사용하지 않는다.
그렇기에 값을 박싱하거나 언박싱에 대한 부가 비용이 들지 않는다.

가장 작은 `null`이 될 수 있는 타입은 `Nothing?`이다.
이 타입은 `null` 상수 이외의 어떠한 값도 포함하지 않으며, `null` 값 자체의 타입이며, 다른 모든 `null`이 될 수 있는 타입의 하위 타입이다.

가장 큰 `null`이 될 수 있는 타입은 `Any?`이다.
`Any?`는 타입 시스템 전체에서 가장 큰 타입으로, `null`이 될 수 있는 모든 타입과 될 수 없는 모든 타입의 상위 타입이다.

## null 가능성과 스마트 캐스트

아래 코드를 실제로 작성해보면 컴파일 에러가 발생한다.

```kotlin
fun isLetterString(s: String?): Boolean {
    // 에러 발생 : Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String?
    if(s.isEmpty()) return false

    for(ch in s) {
        if(!ch.isLetter()) return false
    }

    return true
}
```

`s`가 `null`에 대한 가능성이 열려있는 상태에서 `s`에 대한 프로퍼티에 접근할 경우 `NPE`가 발생할 위험이 있다.
때문에 `kotlin`에서는 `null`에 대한 가능성이 있는 상태에서 해당 변수(객체)를 사용할 경우 컴파일 에러가 발생한다.

`null`이 될 수 있는 값을 처리하는 가장 직접적인 방법은 조건문을 사용해 비교하는 것이다.

```kotlin
fun isLetterString(s: String?): Boolean {
    if(s == null) return false
    
    if(s.isEmpty()) return false
    
    for(ch in s) {
        if(!ch.isLetter()) return false
    }
    
    return true;
}
```

이와 같이 `null`에 대한 검사를 진행해주면 스마트 캐스트(smart cast)라는 기능을 통해 컴파일이 가능하도록 한다.

기본적으로 `null`에 대한 동등성 검사를 수행하면, 컴파일러는 코드 흐름의 가지 중 한 쪽에는 대상 값이 확실히 `null`이고, 다른 가지에는 확실히 `null`이 아니라는 사실을 알 수 있다.
그 후 컴파일러는 이 정보를 사용해 값 타입을 세분화함으로써 `null`이 될 수 있는 값을 타입 변환(cast)한다.

```kotlin
fun describeNumber(n: Int?) = when(n) {
    null -> "null"
    in 0 .. 10 -> "small"
    in 11 .. 100 -> "large"
    else -> "out of range"
}
```

위 코드와 같이 `when` 절에서도 `null`에 대한 체크를 통해 **스마트 캐스트**가 가능하다.

## null 아님 단언 연산자

`!!` 연산자는 `null` 아님 단언(not- null assertion)이라고 부른다.

```kotlin
fun main() {
    var name: String? = null

    fun sayHello() {
        println(name!!.uppercase())
    }

    sayHello()
}
```

즉, 위와 같이 코드를 작성할 경우 `name`의 값에는 실제로 `null`이 들어가있는 상태이지만,
`sayHello()`에서 `name!!`으로 `null`이 아니라고 단정지었기 때문에 실행할 수 있다.

이는 `KotlinNullPointerException` 예외를 발생시킬 수 있는 연산자이다.
그렇기 때문에 가능한 이 연산자를 사용하지 않는 것이 좋다.

## 엘비스 연산자

`null`이 될 수 있는 값을 다룰 때, 유용한 연산자로 `null` 복합 연산자(null coalescing operator)인 `?:`이 있다.

이 연산자를 사용하면 `null`을 대신할 디폴트 값을 지정할 수 있다.

> 엘비스 프레슬리(Elvis Persley)를 닮았기 때문에 엘비스 연산자라 부른다.

```kotlin
fun main() {
    sayHello(null)
}

fun sayHello(name: String?) {
    // 출력 : Hello, Unknown
    println("Hello, " + (name ?: "Unknown"))
}
```

왼쪽 피연산자가 `null`이 아닐 경우에는 왼쪽 피연산자의 값을 사용하며, 그게 아닐 경우 오른쪽 피연산자의 값을 사용한다.

```kotlin
class Name(val firstName: String, val familyName: String?)
class Person(val name: Name?) {
    fun introduce(): String {
        val currentName = name ?: return "Unknown"
        return "${currentName.firstName} ${currentName.familyName}"
    }
}

fun main() {
    println(Person(Name("John", "Doe")).introduce())
    println(Person(null).introduce())
}
```

위 코드 중 `introduce()` 함수를 보면 `name`이 `null`일 경우 `Unknown`을 반환하도록 했다.
때문에 아래에서 반환하는 `currentName.firstName`에 영향을 주지 않을 수 있다.
