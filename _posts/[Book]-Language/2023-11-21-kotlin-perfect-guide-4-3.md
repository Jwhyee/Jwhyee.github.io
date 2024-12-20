---
title: "[Kotlin] - property"
last_modified_at: 2023-11-20T22:10:37-23:30
categories: "[Book]-Language"
tags:
   - 코틀린 완벽 가이드
toc: true
toc_sticky: true
toc_label: "Chapter4"
toc_icon: "file"
---

**코틀린 완벽 가이드**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 최상위 프로퍼티

클래스나 함수와 마찬가지로 최상위 수준에 프로퍼티를 정의할 수 있다.

```kotlin
val prefix = "Hello, "

fun main() {
    val name = readlnOrNull()  ?: return
    println("$prefix $name")
}
```

만약 읽어온 값에 `null`이 들어오면 프로그램을 종료하고, 그렇지 않으면 환영 메시지를 출력해주는 코드이다.

이런 최상위 프로퍼티에는 가시성(public/internal/private)을 지정할 수 있다.

```kotlin
package example.util

val prefix = "Hello, "
```

```kotlin
import example.util.prefix

fun main() {
    val name = readlnOrNull()  ?: return
    println("$prefix $name")
}
```

또한, 위 코드와 같이 다른 파일에 있는 최상위 프로퍼티를 임포트할 수도 있다.

## 늦은 초기화

특정 프로퍼티는 클래스 인스턴스가 생성된 뒤, 프로퍼티가 사용되기 전 시점에 초기화해야할 때가 있다.
이런 경우 생성자에서는 초기화되지 않은 상태라는 사실을 의미하는 디폴트 값을 대입하고, 실제 값을 필요할 때 대입할 수 있다.

```kotlin
class Content {
    var text: String? = null

    fun loadFile(file: File) {
        text = file.readText()
    }
}

fun getContentSize(content: Content) = content.text?.length ?: 0
```

위 코드는 실제 파일을 가져와 값을 읽은 다음 `text` 변수에 저장하는 코드이다.
`text`에는 항상 값이 들어오게 되지만, 첫 값을 어쩔 수 없이 `null`로 지정해 이를 사용하는 함수에서는 꼭 `null`에 대한 처리를 해줘야 한다.

즉, 실제 값이 항상 사용 전에 초기화되므로, 절대 `null`이 될 수 없는 값임을 알면서도, 늘 `null` 가능성을 처리해야 한다는 것이다.
이런 상황에서 `lateinit`을 적용하면 더 유연한 설계가 가능해진다.

```kotlin
class Content {
    lateinit var text: String

    fun loadFile(file: File) {
        text = file.readText()
    }
}

fun getContentSize(content: Content) = content.text.length
```

프로퍼티를 `lateinit`으로 만들기 위해서는 몇 가지 조건을 만족해야 한다.

1. 프로퍼티가 변경될 수 있는 지점이 여러 곳일 수 있으므로 가변(var)으로 정의
2. 프로퍼티의 타입은 `null`이 아니고, `Int`, `Boolean` 같은 원시 타입이 아니어야 함
3. `lateinit`를 정의하면서 초기화 식을 지정해 바로 값을 대입할 수 없다.
    - `lateinit`을 사용하는 의미가 없기 때문

## 커스텀 접근자 사용하기

`java`에서 밥먹듯이 사용하던 `getter`, `setter`를 `kotlin`에서도 동일하게 적용할 수 있다.

### Getter

```kotlin
class Person(val firstName: String, val familyName: String) {
    val fullName
        // 식이 본문인 형태로도 작성 가능
        // get() = "$firstName $familyName"
        get(): String {
            return "$firstName $familyName"
        }

}

fun main() {
    val p = Person("Matin", "Kim")
    println(p.fullName)
}
```

`java`처럼 `p.getFullName()`으로 가져오는 것이 아닌, 프로퍼티에 접근해 값을 가져오는 과정을 `get()`으로 정의한다.
즉, `p.fullName`으로 접근하면 자동으로 `get()` 함수를 호출하게 되는 것이다.

만약 변수가 호출될 때마다 로깅을 하고 싶다면 아래와 같이 작성하면 된다.

```kotlin
class Person(val firstName: String, val familyName: String, age: Int) {
    val age = age
        get() {
            println("age = $age")
            return field
        }
    val fullName
        get() = "$firstName $familyName"

}
```

위와 같이 `return feild`를 사용할 경우 `age`의 값을 그대로 반환한다는 뜻이다.

`java`를 공부한 사람에게 가장 헷갈리는 부분은 바로 `age`의 사용이다.
`Person()` 생성자 내부에 있는 `age`는 클래스 내부 프로퍼티를 초기화할 때만 사용할 수 있다.
즉, 생성자에 `val`, `var`을 사용해 변수를 초기화하면 클래스 내부에 정의가 되는 변수이고, 그렇지 않을 경우 클래스 내부 프로퍼티에서만 접근이 가능하다.

```kotlin
class Test(val param1: Int, val param2: Int, param3: Int) {
    fun printParam1() {
        println("param1 : $param1")
    }
    fun printParam2() {
        println("param1 : $param1")
    }
   
    val param4 = param3
    fun printParam3() {
        // 함수 내부에서 param3에 접근 불가
        println("param1 : ${this.param4}")
    }
} 
```

위 코드와 같이 `param1`, `param2`는 클래스 변수이기에 내부 어디서든 접근이 가능하지만,
`param3`은 단순히 생성자 변수기 때문에 클래스 내부 함수에서는 접근하지 못하고, 클래스 내부 프로퍼티를 정의하는 용도로만 사용이 가능하다.

### Setter

프로퍼티의 `Setter`의 파라미터는 무조건 단 하나이며, `value`라는 네이밍을 많이 사용한다.

```kotlin
class Person(val firstName: String, val familyName: String, age: Int) {
    val fullName
        get() = "$firstName $familyName"

    var age = age
        set(value) {
            if (value != null && value <= 0)
                throw IllegalArgumentException("Invalid age: $value")
            field = value
        }

}

fun main() {
    val p = Person("Matin", "Kim", 50)
    println(p.fullName)
    p.age = -1
}
```

`Getter`와 동일하게 클래스 프로퍼티에 접근해 값을 수정하는 행위를 하면 `set()` 함수를 호출하게 된다.
위 코드를 기준으로 `-1`이라는 값이 `set`함수의 파라미터인 `value`에 들어가게 되는 것이다.

### 가시성 변경자

`java`에서의 `Setter`는 위험하기에 `private`로 지정하고, 의미있는 메소드 이름을 통해 수정하는 방식을 사용했다.
이처럼 `get()`, `set()` 함수에도 가시성을 추가할 수 있다.

```kotlin
class Person(val firstName: String, val familyName: String, age: Int) {
    var lastChanged: Date? = null
        private set
   
    var age = age
        set(value) {
            if (value != null && value <= 0)
                throw IllegalArgumentException("Invalid age: $value")
            lastChanged = Date()
            field = value
        }
}
```

```kotlin
fun main() {
    val p = Person("Matin", "Kim", 50)
    println(p.fullName)
    p.age = -1
    // 에러 발생 : Cannot assign to 'lastChanged': the setter is private in 'Person'
    p.lastChanged = Date()
}
```

위와 같이 `private set`으로 지정할 경우 클래스 내부에서만 접근(수정)이 가능하고, 외부에서 접근해서 수정할 경우 컴파일 에러가 발생한다.

## 지연 계산 프로퍼티와 위임

`lateinit`은 변수의 값을 나중에 지정해주기 위한 변경자였다면,
`by lazy`는 어떤 프로퍼티를 처음 읽을 때까지 그 값에 대한 계산을 미뤄두는 것이다.

```kotlin
import java.io.File

val text by lazy {
   File("data.txt").readText()
}

fun printFile() {
   println(File("data.txt").readText())
}

fun write(content: String) {
   File("data.txt").writeText(content)
}

fun main() {
   while (true) { 
      print("input : ")
      when (val cmd = readlnOrNull() ?: return) {
         "p1" -> println(text)
         "p2" -> println(text)
         "w" -> write(readln())
         "e" -> return
      }
   }
}
```

`w`를 통해 값을 수정하기 전의 `p1`, `p2`는 동일한 값을 출력하지만, 값을 수정한 후 `p1`, `p2`를 출력하면 `p2`만 변경된 값으로 출력하는 것을 볼 수 있다.

```
input : p1
abc
input : p2
abc
input : w
abc123
input : p1
abc
input : p2
abc123
input : e
```

즉, `by lazy`로 정의할 경우 값을 읽기 전까지 `lazy` 프로퍼티의 값을 계산하지 않으며, 초기화가 된 이후 프로퍼티의 값은 필드에 저장된다.
그 이후로는 값을 읽을 때마다 저장된 값을 읽게 된다.

이러한 이유로 `by lazy`를 사용할 경우 한 번 저장된 값이 변하지 않는다.
