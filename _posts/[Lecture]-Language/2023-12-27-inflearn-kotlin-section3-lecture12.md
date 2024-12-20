---
title: "[Kotlin] - 코틀린에서 object 키워드를 다루는 방법"
last_modified_at: 2023-12-27T22:10:37-23:30
categories: "[Lecture]-Language"
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture12"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## static 함수와 변수

자바에서 정적 함수를 사용하려면 아래 코드와 같이 `static` 키워드를 사용한다.

```java
public class JavaPerson {
    private static final int MIN_AGE = 1;
    private String name;
    private int age;

    private JavaPerson(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public static JavaPerson newBaby(String name) {
        return new JavaPerson(name, MIN_AGE);
    }
}
```

하지만 코틀린에는 `static`이 없기 때문에 다음과 같이 `companion object`라는 동행 객체를 사용한다.

```kotlin
class Person private constructor(
    var name: String,
    var age: Int,
) {
    companion object {
        val MIN_AGE = 1
        fun newBaby(name: String): Person = Person(name, MIN_AGE)
    }
}
```

> `static`이란, 클래스가 인스턴스화 될 때, 새로운 값이 복제되는 것이 아닌, 정적으로 인스턴스끼리의 값을 공유하는 것이다.

> `companion object`란, 클래스와 동행하는 유일한 오브젝트이다. 즉, 인스턴스가 여러 개 생기더라도 클래스라는 설계도와 동행하는 유일한 `object`이다.

위 코드를 실제로 작성해보면 `MIN_AGE`에 경고가 발생하는데 `const` 키워드를 붙이면 해결이 된다.
`const`를 붙이지 않으면, 런타임 시에 0이라는 값이 할당되는데, 만약 해당 키워드를 붙일 경우 컴파일 시에 변수가 할당된다.
때문에 이 키워드는 진짜 상수에 붙이기 위한 용도로 사용되며, 기본 타입과 `String`에만 붙일 수 있다.

companion object, 즉 동반 객체도 하나의 객체로 간주되므로, 이름을 붙일 수 있고, `interface`를 구현할 수도 있다.

```kotlin
class Person private constructor(
    var name: String,
    var age: Int,
) {
    companion object Factory : Log {
        private const val MIN_AGE = 1
        
        override fun log() {
            println("Person class's companion object")
        }

        fun newBaby(name: String): Person = Person(name, MIN_AGE)
    }
}
```

동반 객체에 유틸성 함수들을 넣어도 되지만, 최상단 파일을 활용하는 것을 추천한다.
만약 자바에서 이 동반 객체를 사용할 경우 다음과 같이 사용하면 된다.

```java
Person p = Person.Factory.newBaby("Bobby");
System.out.println(p.getName());
```

위와 같이 `companion object`의 이름을 호출하면 되고, 만약 이름을 지정해주지 않았을 경우에는 `Person.Companion`으로 호출하면 된다.
만약 자바에서 사용하는 `static`처럼 바로 사용하고 싶다면 `@JvmStatic`을 사용하면 된다.

```kotlin
@JvmStatic
fun newBaby(name: String): Person = Person(name, MIN_AGE)
```

```java
Person.newBaby("Dmitry");
```

## 싱글톤

> 싱글톤이란, 단 하나의 인스턴스만을 갖는 클래스

자바에서의 싱글톤은 다음과 같은 구조로 만들 수 있다.

```java
public class JavaSingleton {
    private static final JavaSingleton INSTANCE = new JavaSingleton();

    private JavaSingleton() { }

    public static JavaSingleton getInstance() {
        return INSTANCE;
    }
}
```

`private` 생성자를 통해 인스턴스화를 방지([참고 게시글](https://jwhy-study.tistory.com/33))하며, `getInstance` 함수를 통해서만 객체를 가져올 수 있다.
코틀린에서의 싱글톤은 다음과 같다.

```kotlin
object Singleton
```

자바와 다르게 아주 간단하며, 다음과 같이 사용할 수 있다.

```kotlin
fun main() {
    println(Singleton.a)
    Singleton.a += 10
    println(Singleton.a)
}
```

## 익명 클래스

> 익명 클래스란, 특정 인터페이스나 클래스를 상속 받은 구현체를 일회성으로 사용할 때 쓰는 클래스이다.

인터페이스는 구현체 없이 절대 혼자서 인스턴스화할 수 없다.
하지만 아래 코드와 같이 필요한 시점에 추상 메소드를 직접 구현하기만 하면, 클래스로서 활용을 할 수 있다.
이렇게 생긴 인스턴스는 따로 지정된 클래스에 의해 생성된 것이 아니기 때문에 익명 클래스라고 불린다.

```java
public class JavaAnonymousClass {
    public static void main(String[] args) {
        moveSomething(new Movable() {
            @Override
            public void move() {
                System.out.println("Move");
            }

            @Override
            public void fly() {
                System.out.println("Fly");
            }
        });
    }

    private static void moveSomething(Movable movable) {
        movable.move();
        movable.fly();
    }
}
```

코틀린에서도 비슷하게 만들 수 있지만, 접근 방식이 살짝 다르다.

```kotlin
fun main() {
    moveSomething(object : Movable {
        override fun move() {
            println("Move")
        }

        override fun fly() {
            println("Fly")
        }
    })
}

private fun moveSomething(movable: Movable) {
    movable.move()
    movable.fly()
}
```

위 코드를 보면 알 수 있듯, `object` 키워드를 통해서 `Movable`을 구현하는 싱글톤을 만들었다.

## 정리

- 자바의 static 변수와 함수를 만드려면 companion object를 사용해야 한다.
- companion object도 하나의 객체로 간주되기 때문에 이름을 붙일 수 있고, 다른 타입을 상속 받을 수도 있다.
- 싱글톤을 만들 때, object 키워드를 사용한다.
- 익명 클래스를 만들 때, `object : Type`을 사용한다.
