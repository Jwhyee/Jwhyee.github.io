---
title: "[Kotlin] - 코틀린에서 null을 다루는 방법"
last_modified_at: 2023-11-29T22:10:37-23:30
categories: [Lecture]-Language
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture2"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## null 체크

`java`에서 아래 코드는 안전한 코드일까?

```java
public boolean startsWithA(String str) {
    return str.startsWith("A");
}
```

`java`에서는 `String` 타입에 `null`이 들어갈 수 있다.
만약 `str` 변수에 `null`이 들어올 경우 NPE(NullPointerException)이 발생하게 된다.

이를 수정하기 위해서는 다음과 같이 변경할 수 있다.

```java
public class A {
    public boolean startsWithA1(String str) {
        if (str == null) throw new IllegalArgumentException("null이 들어왔습니다.");
        return str.startsWith("A");
    }
    
    public Boolean startsWithA2(String str) {
        if (str == null) return null;
        return str.startsWith("A");
    }
    
    public boolean startsWithA3(String str) {
        if (str == null) return false;
        return str.startsWith("A");
    }
    
}
```

위와 같이 다양한 방법으로 체킹할 수 있다.

만약 위의 기반이 되는 코드를 `kotlin`에서 작성하면 어떨까?

```kotlin
fun startsWithA1(str: String?): Boolean {
    // 에러 발생 : Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String?
    return str.startsWith("A")
}
```

위 코드와 같이 `str` 변수에 `null`이 들어올 수 있다는 가능성을 열어둔 뒤, null-check 없이 반환을 하려고 하면 에러가 발생한다.

그 이유는 `String`과 `String?`을 아예 다른 타입으로 간주하기 때문이다.

그럼 `kotlin`에서는 어떤 방식으로 null-check를 진행하면 될까?

```kotlin
fun startsWithA1(str: String?): Boolean {
    if (str == null) throw IllegalArgumentException("null이 들어왔습니다.")
    return str.startsWith("A")
}

fun startsWithA2(str: String?): Boolean? {
    if (str == null) return null
    return str.startsWith("A")
}

fun startsWithA3(str: String?): Boolean {
    if (str == null) return false
    return str.startsWith("A")
}
```

위와 같이 작성할 수 있으며, 가장 큰 차이는 다음과 같다.

- 매개변수에 `null`이 들어올 수 있다면 타입 뒤에 `?`를 붙여준다.
- 반환값이 `null`이 될 수 있을 경우 반환 타입 뒤에 `?`를 붙여준다.

> `kotlin`에서는 `null`이 가능한 타입을 완전히 다르게 취급한다.

## nullable 변수 사용

### Safe call

> `null`이 아니면 실행하고, `null`이면 실행하지 않는다.

아래 코드를 통해 확인해보자.

```kotlin
val str: String? = "ABC"
str.length // 불가능
str?.length // 가능
```

`str` 변수는 `null`이 들어올 수 있는 문자열 타입이다.
이 변수는 null-check를 하지 않는 이상 바로 접근이 불가능하다.

만약 Safe call을 사용한다면, 앞에 있는 변수가 `null`이 아닐 경우 뒤에 딸려오는 함수나 프로퍼티 등을 실행시키고,
그렇지 않으면 해당 값 그대로가 `null`이 된다.

```kotlin
val str: String? = null
// 출력 : null
println(str?.length)
```

즉, 위 코드를 실행하게 되면 `str?.length` 자체가 `null`이 되면서 출력하게 된다.

만약 `java`에서 해당 코드를 실행하면 `str`이 `null`이 되면서 `length`에 접근할 수 없어 NPE가 발생하게 된다.

```java
// 에러 발생 : Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "str" is null
String str = null;
System.out.println(str.length());
```

### Elvis 연산자

> Safe call 기능과 함께 사용되며, 앞의 연산 결과가 `null`이면 뒤의 값을 사용한다.

```kotlin
val str: String? = "ABC"
str?.length ?: 0
```

위와 같이 작성할 경우 Safe call이 되면서 `str?.length` 자체가 `null`이 된다.
하지만 뒤에 있는 Elvis 연산자 때문에 0이라는 값으로 치환되어 나오게 된다.

```kotlin
val str: String? = null
// 출력 : 0
println(str?.length ?: 0)
```

### 응용

앞서 `java` 코드를 `kotlin`으로 변환한 코드를 위에서 소개한 기능을 적용해 변경해보자!

```kotlin
fun startsWithA1(str: String?): Boolean {
    return str?.startsWith("A")
        ?: throw IllegalArgumentException("null이 들어왔습니다.")
}

fun startsWithA2(str: String?): Boolean? {
    // str이 null이면 전체가 null로 변환된다.
    return str?.startsWith("A")
}

fun startsWithA3(str: String?): Boolean { 
    return str?.startsWith("A") ?: false
}
```

이러한 기능은 `early return`에서도 사용할 수 있다.

```java
public long calculate(Long number) {
    if(number == null) return 0;
    ...
}
```

```kotlin
fun calculate(number: Long?): Long { 
    number ?: return 0 
    ...
}
```

`java`에 비해 훨씬 간결하고 쉽게 사용할 수 있다.

## 널 아님 단언!!

> `nullable` 타입이지만, 아무리 생각해도 `null`이 될 수 없는 경우에 사용한다.

예를 들어서 `Entity`를 설계할 때, `id` 값은 초기에 `null`로 지정한 뒤,
사용자가 값을 입력해서 DB에 저장이 된 후에야 `id` 값이 들어가게 된다.

```kotlin
@Entity
class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
    var title: String = ""
    ...
}
```

즉, 초기에는 `null`로 지정을 해야하니 `nullable` 타입으로 둘 수 밖에 없고,
데이터를 꺼내올 때에는 분명히 값이 존재하기에 불편함이 따르게 된다.

이러한 상황에서 널 아님 단언 연산을 사용하면 된다.

```kotlin
fun startsWith(str: String?): Boolean {
    return str!!.startsWith("A")
}
```

위 코드와 같이 `!!`를 사용하면 컴파일러에게 절대 `null`이 아니라고 알려주는 것이다.

만약 이러한 상황에서 `null`이 입력될 경우 NPE가 발생하게 된다.
그렇기 때문에 정말 `null`이 아닌게 확실한 경우에만 사용해야 한다.

## 플랫폼 타입

> `kotlin`이 `null` 관련 정보를 알 수 없는 타입으로, 런타임 시 `Exception`이 날 수 있다.

`kotlin`은 `java`와 100% 호환이 가능하다 보니 한 프로젝트 내에서 두 언어를 함께 사용하는 경우가 있다.

만약 `java` 코드를 가져다 쓴다고 가정했을 때, 어떤 타입이 `null`이 될 수 없는지, 있는지를 어떻게 처리해야할지 애매할 것이다.
이런 상황에서 플랫폼 타입을 사용하면 된다.

아래 상황을 통해 확인해보자.

```java
public class Person {
    private final String name;

    public Person(String name) {
        this.name = name;
    }

    @Nullable
    public String getName() {
        return name;
    }
}
```

```kotlin
fun main() {
    val p = Person("공부하는 개발자")
    // p.name == p.getName()과 동일
    // 에러 발생 : Type mismatch
    // Required: String
    // Found: String?
    println(startsWithA(p.name))
}

fun startsWithA(str: String): Boolean { 
    return str.startsWith("A")
}
```

현재 `getName`을 보면 `@Nullable` 어노테이션이 붙어있는 것을 볼 수 있다.
그렇기 때문에 `kotlin`에서 `startsWithA(p.name)`을 사용할 경우 에러가 발생한다.
만약 `java` 코드에서 `@Nullable`이 아닌 `@NotNull`이라고 단언할 경우 에러가 사라지게 된다.

이와 같이 `kotlin`은 `java`에 작성된 어노테이션을 기반으로 이해를 하게 된다.

아래 패키지와 같이 `null`과 관련된 어노테이션을 활용하면 `kotlin`에서 이를 인식하고 활용할 수 있다.

- javax.annotation
- android.support.annotation
- org.jetbrains.annotation

하지만 `@Nullable`이 없다면 `kotlin`에서는 이 값이 nullable인지 non-nullable인지 알 수 없다.

아래와 같이 어노테이션을 제거하고 `str` 변수에 `null` 값을 넣은 뒤 `kotlin` 코드를 실행시키면 NPE가 발생하게 된다.

```java
public String getName() {
    return name;
}
```

```kotlin
fun main() {
    val p = Person(null)
    println(startsWithA(p.name))
}
```

```
Exception in thread "main" java.lang.NullPointerException: p.name must not be null
```

위와 같이 두 언어를 함께 사용할 때에는 `null` 관련 정보를 꼼꼼하게 작성하거나,
라이브러리를 가져와 사용할 경우에는 해당 코드를 충분히 분석한 후 사용하는 것이 좋다.

## 정리

- 코틀린은 null이 들어갈 수 있는 타입은 완전히 다르게 간주된다.
  - 한 번 null 검사를 하면 non-null임을 컴파일러가 알 수 있다.
- null이 아닌 경우에만 호출되는 Safe call (?.)이 있다.
- null인 경우에만 호출되는 Elvis 연산자 (?:)가 있다.
- null이 절대 아닐 때 사용할 수 있는 널 아님 단언 (!!)이 있다.
- kotlin에서 java 코드를 사용할 때, 플랫폼 타입 사용에 유의해야 한다.
  - java 코드를 읽으며 null 가능성 확인 / kotlin으로 wrapping
