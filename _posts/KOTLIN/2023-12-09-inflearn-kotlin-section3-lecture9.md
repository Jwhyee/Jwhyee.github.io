---
title: "[Kotlin] - 코틀린에서 클래스를 다루는 방법"
last_modified_at: 2023-12-09T22:10:37-23:30
categories: KOTLIN
tags:
  - KOTLIN
toc: true
toc_sticky: true
toc_label: "Retrospect"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 클래스와 프로퍼티

`Person` 클래스를 통해 코드를 확인해보자.

```java
public class JavaPerson {
    // 컴파일 에러 발생 : Variable 'name' might not have been initialized
    private final String name;
    private int age;
}
```

위 코드를 보면 `name` 필드를 `final`로 지정했기 때문에 값을 할당해주기 전까지는 컴파일 에러가 발생하게 된다.

```java
public class JavaPerson {
    private final String name;
    private int age;

    public JavaPerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

위와 같이 생성자를 만들어주면 컴파일 에러가 사라지게 되고, 각 필드를 가져올 수 있는 프로퍼티인 getter, setter를 생성했다.
여기서 주의해서 봐야할 점은 `name` 필드가 불변이기 때문에 `setName()` 함수가 없다는 것이다.

> 프로퍼티(Property)란, 필드 + getter + setter를 의미한다.

위 코드를 한 번 `kotlin`에 적용해보자.

```kotlin
class Person constructor(name: String, age: Int) {
    val name = name
    var age = age
}
```

위 코드는 `java`에서 작성한 `JavaPerson` 클래스와 100% 동일한 클래스이다.
차이점이 있다면 `kotlin`에서는 생성자를 클래스 이름 옆에 작성하며, 필드만 만들면 getter, setter를 자동으로 만들어준다.

또한 클래스 옆에 있는 `constructor`는 생략할 수 있다.

```kotlin
class Person (name: String, age: Int) {
    val name = name
    var age = age
}
```

게다가 `kotlin`에서는 생성자 안에 작성한 매개변수를 프로퍼티로 만들 수도 있다.

```kotlin
class Person (val name: String, var age: Int)
```

그럼 `getter`와 `setter`는 어디에 있는걸까?

```kotlin
fun main() {
    val p = Person("John Cena", 8)
    println(p.name)
    p.age = 13
    println(p.age)
}
```

또한, `java` 클래스를 `kotlin`에 가져와 사용할 때에도 동일하게 사용한다.

```kotlin
val jp = JavaPerson("John Cinema", 7)
println(jp.name)
jp.age = 12
println(jp.age)
```

<center>

<img width="662" alt="스크린샷 2023-12-09 오후 4 00 11" src="https://github.com/Jwhyee/Jwhyee/assets/82663161/f2805b08-52be-41ee-8d16-1bfd5ddd3266">

</center>

위 사진을 보면 알 수 있듯, 필드 자체를 호출하는 것이 아닌, `getter`, `setter`를 호출하는 것을 알 수 있다.

`java`에서도 위와 같이 접근을 할 수 있긴하다.

```java
Person p = new Person("John Cinema", 7);
System.out.println(p.getName());
System.out.println(p.name);
p.age = 13;
p.setAge(13);
System.out.println(p.getAge());
System.out.println(p.age);
```

하지만, 위 방식은 `getter`, `setter`를 사용하는 것이 아닌 필드에 바로 접근하는 것이다.

## 생성자와 init

`java`에서 생성자에 들어온 값을 검증할 때 다음과 같이 코드를 작성할 수 있다.

```java
public JavaPerson(String name, int age) {
    this.name = name;
    if (age <= 0) {
        throw new IllegalArgumentException(String.format("나이는 %s일 수 없습니다.", age));
    }
    this.age = age;
}
```

하지만 `kotlin` 코드를 보면 코드를 작성하기 너무 애매하게 선언이 되어있다.

```kotlin
class Person(
    val name: String,
    var age: Int,
)
```

그렇기 때문에 `kotlin`에서는 `init` 블럭을 통해 사용한다.

> init 블록은 클래스가 초기화되는 시점에 한 번 호출되는 블록이다.

```kotlin
class Person(
    val name: String,
    var age: Int,
) {
    init {
        if(age <= 0) throw IllegalArgumentException("나이는 ${age}일 수 없습니다.")
    }
}
```

이러한 `init` 블록은 값을 적절히 만들어주거나, `validation`을 하는 로직으로 많이 사용된다.

그렇다면 생성자 오버로딩은 어떻게 할까?

```java
public JavaPerson(String name) {
    this(name, 1);
}
```

`java`에서는 **코틀린에서 함수를 다루는 방법**에서 언급한 것과 같이 앞서 만든 생성자를 `this()`를 통해 호출하고, 값을 넣어줄 수 있다.

`kotlin`에서는 주생성자는 클래스 가장 윗 부분에 작성하고, 그 외의 생성자는 클래스 내부 블록 안에 `constructor` 키워드와 함께 만들어져야 한다.

```kotlin
class Person(val name: String, var age: Int) {
    constructor(name: String) : this(name, 1)
    constructor(): this("홍길동")
}
```

```kotlin
fun main() {
    val p1 = Person("John Cena", 8)
    val p2 = Person("Ronnie Coleman")
    val p3 = Person()
}
```

여기서 주의할 점은 부생성자는 **주생성자가 반드시 존재**해야지 다른 생성자를 만들 수 있으며, 최종적으로 주생성자를 `this`로 호출해야 한다.

> 주생성자(primary constructor)란, 클래스 이름 옆에 작성하는 기본적인 생성자를 의미한다.

또한, 부생성자는 `java`와 같이 블록을 가질 수 있다.

```kotlin
constructor(name: String) : this(name, 1) {
    println("첫 번째 부생성자")
}
constructor(): this("홍길동") {
    println("두 번째 부생성자")
}
```

그러면 아래와 같은 코드 상태에서 두 번째 부생성자를 호출하면 결과가 어떤 순서로 출력될까?

```kotlin
class Person(
    val name: String,
    var age: Int,
) {
    init {
        if(age <= 0) throw IllegalArgumentException("나이는 ${age}일 수 없습니다.")
        println("초기화 블록")
    }

    constructor(name: String) : this(name, 1) {
        println("첫 번째 부생성자")
    }
    constructor(): this("홍길동") {
        println("두 번째 부생성자")
    }

}
```

```bash
초기화 블록
첫 번째 부생성자
두 번째 부생성자
```

보는 것과 같이 역순으로 출력된다.

두 번째를 실행하더라도, `println()`이 실행되기 전에 `this()`가 있기 때문에 타고 타고 가장 최상위 주생성자로 올라간 뒤에, `print()`가 출력되게 된다.

하지만, 부생성자는 권장되지 않으며, 이전 장에 소개한 `default parameter`를 권장하고 있다.
부생성자를 생성하면, 코드가 더 복잡해지기 때문에, 파라미터에 기본값을 넣어 놓으면 부생성자의 역할을 그대로 할 수 있기 때문이다.

어떤 객체를 다른 객체로 변환해야할 경우 부생성자를 사용할 수 있지만, 그보다는 [정적 팩토리 메소드](https://jwhyee.github.io/effective-java/effective-java-item-1/)를 사용하는 것을 권한다.

> 사실상 부생성자를 쓸 일이 거의 없다.

## 커스텀 getter, setter

이번에는 값을 가져와서 해당 객체가 성인인지 확인하는 기능을 추가해보자.

```java
public boolean isAdult() {
    return this.age >= 20;
}
```

```kotlin
fun isAdult(): Boolean {
    return age >= 20
}
```

`kotlin`에서도 `java`와 같이 동일하게 작성할 수 있다.

```kotlin
// Custom getter 방식 1 : Expression
val isAdult:Boolean
    get() = this.age >= 20
// Custom getter 방식 2 : Function
val isAdult:Boolean
    get() {
        return this.age >= 20
    }
```

하지만 `kotlin`에서는 위 코드처럼 함수 대신 `custom getter`를 사용해 프로퍼티처럼 보이게 할 수 있다.
해당 코드를 `java` 코드로 디컴파일 해보면 다음과 같이 `isAdult`라는 함수로 변환되는 것을 알 수 있다.

```java
public final boolean isAdult() {
    return this.age >= 20;
}
```

> 그럼 어떤 방법을 사용하는 것이 좋을까?<br>
> 객체의 속성이라면 custom getter, 그렇지 않다면 함수로 작성하는 것이 보기 좋다.

예를 들어, `person.isAdult`는 '이 사람(객체)가 성인인가'라는 속성을 확인하는 것처럼 보이기 때문에 `custom getter`가 어울린다.
하지만, `person.speakWord("Hello")`는 누가봐도 객체에게 무언가의 일을 시키는 것이기 때문에 함수가 어울리는 것이다.

## backing field

또한, `custom getter`는 자신 변형해 반환할 수도 있다.

```kotlin
class Person(
    name: String = "홍길동",
    var age: Int = 1,
) {
    val name = name
        get() = field.uppercase()
}
```

위 코드에서 `name`에 대한 `custom getter`를 만들기 위해 생성자에서 클래스 바디로 위치를 옮긴 뒤, 생성자에서 받은 값을 대입 받았다.

`get()` 내부를 보면 `field`라는 키워드가 등장하는데, `name`이 아닌 `field`를 사용하는 이유는 다음과 같다.

```kotlin
val name = name
    get() = name.uppercase()
```

위처럼 코드를 작성하면 밖에서 `person.name`을 호출하게 되면 `get()`을 호출하게 된다.
그렇다면, `get() = name.uppercase()`를 호출하는 순간 `name`이라는 필드가 또 호출되기에 다시 `name` 필드에 대한 `get()`이 호출된다.

즉, 특정 필드에 대한 `get()` 내부에 같은 필드의 이름을 사용하면 무한 루프가 발생하게 되어 `StackOverFlow`가 발생하게 된다.
이러한 상황을 막기 위해서 `field`라는 예약어를 사용해 자기 자신을 가리키도록 한다.

> '자기 자신을 가리키는 보이지 않는 `field`다.'라고 해서 `backing field`라고 부른다.

사실 이렇게 get() 내부에서 자기 자신을 호출하는 방식보다는 프로퍼티로 지정해 사용하는 것이 더 효율적이다.

```kotlin
class Person(
    val name: String = "홍길동",
    var age: Int = 1,
) {
    val uppercaseName: String
        get() = this.name.uppercase()
}
```

`setter`의 경우에는 `backing field`를 사용할 수 밖에 없다.

```kotlin
class Person(
    name: String = "홍길동",
    var age: Int = 1,
) {
    var name = name
        set(value) {
            field = value.uppercase()
        }

    val uppercaseName: String
        get() = this.name.uppercase()
}
```

하지만, `setter` 자체를 지양하기 때문에 `custom setter`도 잘 사용하지 않는다.
무분별한 `setter`를 사용하는 것보단 `update` 같은 함수를 만들어서 그 안에서 값을 업데이트 시켜주는 게 훨씬 더 깔끔한 코드를 작성할 수 있다.

## 정리

- 필드를 만들면 getter와 setter가 자동으로 생긴다.
  - 이를 프로퍼티(property)라고 부른다.
  - setter는 필드가 var이어야 생성된다.
- 주생성자가 필수이다.
- constructor 키워드를 사용해 부생성자를 추가로 만들 수 있다.
  - 단, default parameter나 정적 팩토리 메소드를 추천한다.
- 실제 메모리에 존재하는 것과 무관하게 custom getter, setter를 만들 수 있다.
  - 함수로도 만들 수 있지만, 프로퍼티인 것처럼 만들 수 있다는 말이다.
  - 실제 JVM 바이트코드로 변환해 java 코드로 디컴파일 하게 되면 함수로 나오게 된다.
- custom getter, setter에서 무한루프를 막기 위해 field 키워드를 사용한다.
  - 이를 backing field라고 부른다.