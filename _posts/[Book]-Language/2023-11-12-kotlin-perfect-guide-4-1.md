---
title: "[Kotlin] - 클래스"
last_modified_at: 2023-11-12T22:10:37-23:30
categories: [Book]-Language
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

# 클래스

`kotlin`의 클래스도 `java`와 비슷한 양상을 보인다.

## 클래스 내부 구조

어떤 사람에 대한 정보를 저장하는 클래스를 정의해보자.

```kotlin
class Person {
    var firstName: String = ""
    var familyName: String = ""
    var age: Int = 0
    
    fun fullName() = "$firstName $familyName"
    
    fun showInfo() = println("${fullName()} : $age")
}
```

`Person` 인스턴스를 생성해 활용해보도록 하자.

```kotlin
fun main() {
    val person = Person()

    readAge(person)
    showAge(person)
}

fun readAge(p: Person) {
    p.age = readln().toInt()
}

fun showAge(p: Person) = println(p.age)
```

클래스 인스턴스 내부의 프로퍼티에 접근하는 참조 구문을 사용한 것을 볼 수 있다.
이런 인스턴스를 수신 객체(receiver)라 부르며, 수신 개체는 프로퍼티에 접근할 때 사용해야 하는 객체를 지정한다.

수신 객체를 모든 클래스 멤버에게 암시적으로 제공되는 사용 가능한 추가 변수라고 생각해도 된다.

> `kotlin`에서는 클라이언트 코드를 바꾸지 않아도, 원하는 대로 프로퍼티의 구현을 바꿀 수 있기 때문에 캡슐화에 위배되지 않는다.
> 예를 들어, Getter, Setter를 추가해도 클라이언트 소스 코드를 바꿀 필요가 없다는 것이다.

위에서 본 코드와 같이 생성자를 호출하면, 프로그램이 새 인스턴스에 대한 힙 메모리를 할당한 다음, 인스턴스의 상태를 초기화해주는 생성자 코드를 호출해준다.

```kotlin
class Person {
    var firstName: String = "John"
}
```

만약 앞선 코드에서 위와 같이 기본값(default)을 설정해줬다면, 모든 인스턴스는 생성하고, 초기화 될 때 `firstName`이 John으로 초기화 된다.

## 생성자

생성자는 `java`와 같이 클래스 인스턴스를 초기화 시켜주고, 인스턴스를 생성 시 호출되는 특별한 함수이다.

```kotlin
class Person(firstName: String, familyName: String){
    val fullName = "$firstName $familyName"
}
```

이와 같이 클래스 헤더의 파라미터 목록을 주생성자(primary constructor) 선언이라 부른다.

`kotlin`에서 생성자를 호출할 때, `new`와 같은 키워드를 사용하지 않는다.

```kotlin
fun main() {
    val p = Person("John", "Doe")
    println(p.fullName)
}
```

JDK 14 버전을 사용해 보았다면, `record`와 비슷하게 생긴 것을 알 수 있다.
단, `record`는 내부에 정적 변수만 생성할 수 있기 때문에 생성자 매개변수에 접근하지 못한다.

```java
public record Person(String firstName, String familyName) {
    static String fullName = "";
}
```

### 초기화 블록

주생성자는 클래스 정의 내에서 프로퍼티 초기화와 초기화 블록이 등장하는 순서대로 구성된다.
초기화 블록이란 `init`이라는 키워드가 앞에 붙은 블록이다.

```kotlin
class Person(firstName: String, familyName: String){
    val fullName = "$firstName $familyName"

    init {
        println("Created new Person instance : $fullName")
    }
}
```

즉, 인스턴스 초기화 시 필요한 부가적인 로직을 작성할 수 있게 되는 것이다.
객체가 인스턴스화 되는 과정은 생성자를 통해 인스턴스가 힙 메모리에 저장되고, `init` 블록이 실행되게 된다.

`java`의 `static` 블록과 어느정도 비슷한 점이 있긴하지만, 정적인 범위에서만 실행되기에 같다고 볼 수는 없다.

```java
public class Person {
    String firstName;
    String familyName;
    static String fullName;

    static {
        // 정적 영역만 초기화 가능
        fullName = "John Doe";
    }
}
```

`kotlin`에서는 정적인 영역이 아닌 일반 프로퍼티에 접근해 값을 초기화할 수 있다.

```kotlin
class Person(fullName: String){
    var firstName: String = ""
    var familyName: String = ""

    init {
        val st = StringTokenizer(fullName)
        firstName = st.nextToken()
        familyName = st.nextToken()
    }

    fun showInfo() = println("$firstName $familyName")
}
```

만약 모든 프로퍼티의 `default` 값을 작성하지 않은 상태로 `init` 블록에서 프로퍼티를 초기화하지 않을 경우 컴파일 에러가 발생한다.

```kotlin
class Person(fullName: String){
    var firstName: String
    var familyName: String
}
```

```
에러 발생 : Property must be initialized or be abstract
```

컴파일러는 모든 프로퍼티가 확실히 초기화되는지 확인한다.
컴파일러가 주생성자의 모든 실행 경로가 모든 멤버 프로퍼티를 초기화하거나, 예외를 발생시키는지 확인할 수 없다면 위와 같은 에러가 발생한다.

### 생성자의 파라미터

주생성자 파라미터를 프로퍼티 초기화나 `init` 블록 밖에서는 사용할 수 없다.

```kotlin
class Person(firstName: String, familyName: String) {
    val fullName = "$firstName $familyName"

    fun printFirstName() {
        // firstName에 접근할 수 없음.
        println(firstName)
    }
}
```

이에 대한 해법은 생성자 파라미터의 값을 저장할 멤버 프로퍼티로 정의하는 것이다.


```kotlin
class Person(val firstName: String, val familyName: String) {
    val fullName = "$firstName $familyName"

    fun printFirstName() {
        println(firstName)
    }

    fun printFamilyName() {
        println(familyName)
    }
}
```

아래는 위 코드를 바이트코드로 디컴파일 한 결과이다.

```java
public final class Person {
   @NotNull
   private final String fullName;
   @NotNull
   private final String firstName;
   @NotNull
   private final String familyName;
   
   ...
}
```

생성자에 있는 매개변수가 멤버 변수로 들어온 것을 볼 수 있다.

또한, 생성자에는 함수와 마찬가지로 `varargs`를 사용할 수 있다.

```kotlin
class Person(val firstName: String, val familyName: String) {
    fun fullName() = "$firstName $familyName"
}

class Room(vararg val persons: Person) {
    fun showNames() {
        for(p in persons) println(p.fullName())
    }
}

fun main() {
    val room = Room(Person("Joshua", "Bloch"), Person("Martin", "Kim"))
    room.showNames()
}
```

### 부생성자

`java`에서와 같이 여러 생성자를 사용해 클래스 인스턴스를 서로 다른 방법으로 초기화하고 싶을 떄도 있다.
아래 코드는 굉장히 비효율적이고, 쓸모없는 코드이지만 간단하게 확인해보자!

```java
public class Shape {
    final String status;

    Shape() {
        status = "Circle";
    }

    Shape(String status) {
        this.status = status;
    }
}
```

위처럼 생성자 오버로딩을 사용해 다양한 형태로 클래스 인스턴스를 초기화할 수 있도록 제공할 수 있다.

`kotlin`에서도 이처럼 사용할 수 있으며, 부생성자 문법은 클래스 이름 대신에 `constructor` 키워드를 사용한다.
이를 제외하면 일반적인 함수 정의 문법과 비슷하다.

```kotlin
class Person(val fullName: String) {
    constructor(firstName: String, familyName: String) :
            this("$firstName $familyName")
}

fun main() {
    val p = Person("Martin", "Kim")
    println(p.fullName)
}
```

생성자 파라미터 목록 뒤에 콜론(:)을 넣고 그 뒤에 일반 함수를 호출하는 것처럼 코드를 작성하되, 함수 이름 대신 `this`를 사용하면 생성자 위임 호출이 된다.

## 내포된 클래스

함수, 프로퍼티, 생성자 외에 `kotlin` 클래스는 다른 클래스도 멤버로 가질 수 있다.
이런 클래스를 내포된 클래스(nested class)라고 부른다.

```kotlin
class Person(val id: Id, val age: Int) {
    class Id(val firstName: String, val familyName: String)
    fun showMe() = println("${id.firstName} ${id.familyName}, $age")
}

fun main() {
    val p = Person(Person.Id("Martin", "Kim"), 25)
    p.showMe()
}
```

내포된 클래스는 클래스 이름 앞에 바깥쪽 클래스 이름을 덧붙여야만 내포된 클래스를 참조할 수 있다.

```kotlin
class Person(val id: Id, val age: Int) {
 
    // 컴파일 에러 발생 : Cannot access 'firstName, familyName': it is private in 'Id'
    class Id(private val firstName: String, private val familyName: String) {
        fun nameSake(person: Person) = person.id.firstName == firstName
    }
    
    fun showMe() = println("${id.firstName} ${id.familyName}, $age")
}
```

위 코드와 같이 내포된 클래스에 멤버를 `private`로 선언할 경우 바깥 클래스에서는 접근이 불가능하다.
하지만 내포된 클래스에서는 바깥쪽 클래스 멤버를 사용할 수 있다.

### inner

내포된 클래스에 `inner` 키워드를 사용하면, 자신을 둘러싼 외부 클래스의 현재 인스턴스에 접근할 수 있다.

```kotlin
class Person(val firstName: String, val familyName: String) {
    
    inner class Possession(val description: String) {
        fun showOwner() = println(fullName())
    }

    private fun fullName() = "$firstName $familyName"

}

fun main() {
    val p = Person("Martin", "Kim")
    val wallet = p.Possession("Wallet")
    wallet.showOwner()
}
```

여기서 내부(inner) 클래스 생성자를 호출할 때, `p.Possession()`과 같이 외부 클래스 인스턴스에서 지정해줘야 한다는 것을 조심해야 한다.

내부 클래스에서 바깥 클래스 객체를 반환해줘야할 경우 `this`를 사용할 수 있다.

```kotlin
class Person(val firstName: String, val familyName: String) {
    inner class Possession(val description: String) {
        fun getOwner() = this@Person
    }

    private fun fullName() = "$firstName $familyName"

}

fun main() {
    val p = Person("Martin", "Kim")
    val wallet = p.Possession("Wallet")
    // p의 주소값 출력
    println(wallet.getOwner())
}
```

> `kotlin`과 `java`의 내포된 클래스는 아주 비슷하다.

```kotlin
class Outer {
    inner class Inner
    
    class Nested
}
```

```java
class Outer {
    public class Inner {}
    public static class Nested {}
}
```

## 지역 클래스

`java`와 같이 `kotlin`에서도 함수 본문에서 클래스를 정의할 수 있다.
이러한 지역 클래스는 자신을 둘러싼 코드 블록 안에서만 사용이 가능하다.

```kotlin
fun main() {
    class Point(val x: Int, val y: Int) {
        fun shift(dx: Int, dy: Int): Point = Point(x + dx, y + dy)
        override fun toString() = "($x, $y)"
    }

    val p = Point(10, 10)
    println(p.shift(-1, 3))
}

// 컴파일 에러 발생 : Unresolved reference: Point
fun foo() = println(Point(0, 0))
```

`main()`에서 생성한 `Point`는 해당 블록 밖으로 나갈 수 없어 `foo()`에서 참조할 경우 에러가 발생하게 된다.

특히 지역 클래스는 클래스 본문 안에서 자신이 접근할 수 있는 값을 포획(capture)할 수 있고, 심지어 변경할 수도 있다.

```kotlin
fun main() {
    var x = 1

    class Counter {
        fun increment() = x++
    }

    Counter().increment()

    println(x)
}
```

> `kotlin`과 달리 `java`에서는 포획한 변수의 값을 변경할 수 없다.
> `kotlin`에서 제공하는 포획(capture) 변수를 변경하는 기능은 그에 따른 비용이 발생한다.
> 익명 객체와 이 객체를 둘러싸고 있는 코드 사이에 변수를 공유하기 위해 공유되는 값을 특별한 래퍼(wrapper) 객체로 둘러싼다.

```java
public final class PointKt {
   public static void main(String[] args) {
      // 래퍼 생성
      final Ref.IntRef x = new Ref.IntRef();
      x.element = 1;
      
      final class Counter {
         public final int increment() {
            // 공유된 데이터 변경
            Ref.IntRef var10000 = x;
            int var1;
            var10000.element = (var1 = var10000.element) + 1;
            return var1;
         }

         public Counter() {
         }
      }

      (new Counter()).increment();
      int var1 = x.element;
      // 공유된 데이터 읽기
      System.out.println(var1);
   }
}
```

내포된 클래스와 달리 지역 클래스에는 가시성 변경자를 붙일 수 없다.
어차피 지역 클래스의 영역은 항상 자신을 둘러싼 블록으로 제한되기 때문이다.
또한, 지역 클래스에도 내포된 클래스를 만들 수 있지만 반드시 `inner` 클래스여야 한다.

```kotlin
fun main(args: Array<String>) {
    class Foo {
        val length = args.size
        inner class Bar {
            val firstArg = args.firstOrNull()
        }
    }
}
```