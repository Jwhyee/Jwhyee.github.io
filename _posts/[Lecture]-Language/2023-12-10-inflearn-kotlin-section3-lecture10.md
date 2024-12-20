---
title: "[Kotlin] - 코틀린에서 상속을 다루는 방법"
last_modified_at: 2023-12-10T22:10:37-23:30
categories: [Lecture]-Language
tags:
  - 자바 개발자를 위한 코틀린 입문
  - Kotlin
toc: true
toc_sticky: true
toc_label: "Lecture10"
toc_icon: "file"
---

**자바 개발자를 위한 코틀린 입문**을 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 추상 클래스

`Animal` 추상 클래스를 구현한 Cat, Penguin 코드를 살펴보자.

<center>

<img src="https://github.com/Jwhyee/Jwhyee/assets/82663161/3c6500aa-2b45-4e7a-aee4-9d2051b66b52">

</center>

```java
public abstract class JavaAnimal {
    protected final String species;
    protected final int legCount;

    public JavaAnimal(String species, int legCount) {
        this.species = species;
        this.legCount = legCount;
    }

    abstract public void move();

    public String getSpecies() {
        return species;
    }

    public int getLegCount() {
        return legCount;
    }
}
```

`Animal`의 필드로는 어떤 종인지 의미하는 `species`와 다리가 몇 개인지를 의미하는 `legCount`, 그리고 추상 메소드로 동물이 움직이는 `move` 메소드가 존재한다.

```kotlin
abstract class Animal(
    protected val species: String,
    protected val legCount: Int
) {
    abstract fun move()
}
```

이전 강의에서 다룬 것과 같이 주생성자를 통해 프로퍼티(field, getter)를 정의해주고, `java`와 동일하게 `abstract` 함수를 정의했다.

```java
public class JavaCat extends JavaAnimal {
    public JavaCat(String species) {
        super(species, 4);
    }
    
    @Override
    public void move() {
        System.out.println("고양이가 사뿐 사뿐 걸어가 ~");
    }
}
```

`Cat`은 `JavaAnimal`을 상속 받고 있으며, 고양이의 다리는 4개이기 때문에 생성자로 `species`만 받고, `move()`를 구현해준 것 이외에는 특별한 코드는 없다.

```kotlin
class Cat(
    species: String,
) : Animal(species, 4) {
    override fun move() {
        println("고양이가 사뿐 사뿐 걸어가 ~")
    }
}
```

`java`에서는 상위 클래스의 생성자를 호출하기 위해 `super(species, 4)`를 사용했지만, `kotlin`에서는 `Animal(species, 4)`와 같이 상속 받은 클래스에 바로 괄호를 열어 상위 클래스의 생성자를 호출한다.
또한, `java`에서는 상속 받은 메소드를 구현할 때, `@Override` 어노테이션을 통해 상위 클래스에 있는 메소드에 접근했지만, `kotlin`에서는 `override`라는 고정된 키워드를 사용했다.

> 코드 컨벤션<br>
> 메소드의 반환 타입이나, 변수의 타입을 지정할 때에는 `variable: Type`과 같이 콜론을 변수명에 붙여주지만, 상속을 지정할 때에는 `Class() : SuperClass`와 같이 콜론을 띄어서 작성한다.

이번에는 날개까지 추가된 `Penguin` 클래스를 살펴보자.

```java
public class JavaPenguin extends JavaAnimal {
    private final int wingCount;

    public JavaPenguin(String species) {
        super(species, 2);
        this.wingCount = 2;
    }
    
    @Override
    public void move() {
        System.out.println("펭귄이 움직입니다~ 꿱꿱");
    }

    @Override
    public int getLegCount() {
        return super.legCount + this.wingCount;
    }
}
```

특별한 것은 없고, 펭귄에게는 날개가 있기 때문에 `wingCount`가 추가되었고, `getLegCount()`를 호출할 때, 날개의 수까지 추가되어 반환하도록 수정되었다.

```kotlin
class Penguin(
    species: String,
) : Animal(species, 2) {
    private val wingCount = 2

    override fun move() {
        println("펭귄이 움직인다~ 꿱꿱")
    }
    
    // 에러 발생 : 'legCount' in 'Animal' is final and cannot be overridden
    override val legCount: Int
        get() = super.legCount + this.wingCount
}
```

`kotlin`의 경우 크게 달라진 것은 없지만, `legCount`에 대한 `getter`를 이전 강의에서 소개한 것과 같이 프로퍼티처럼 보이도록 구현했다.
하지만 이렇게 작성할 경우 상위 클래스에 있는 `legCount` 필드가 `final`로 되어있기 때문에 `override val legCount`에서 컴파일 에러가 발생하게 된다.

이 때, 상위 클래스 `legCount` 필드에 `open` 키워드를 붙여주면 에러가 해결된다.

```kotlin
abstract class Animal(
    protected val species: String,
    protected open val legCount: Int
) {
    abstract fun move()
}
```

`java`에서는 바로 `getLegCount()`를 `override`한 뒤에 재정의할 수 있었지만, `kotlin`에서는 프로퍼티를 `override`할 때 무조건 `open` 키워드를 붙여줘야 한다.

프로퍼티에 대한 `override`를 할 때에는 추상 프로퍼티가 아닌 이상, `open` 키워드를 붙여주어야 한다.

> `java`와 동일하게 `kotlin`에서도 추상 클래스는 인스턴스화할 수 없다.

## 인터페이스

앞서 정의한 `Penguin`을 가지고 아래 도식화한 것과 같이 `Flyable`과 `Swimmable`을 구현한 코드를 확인해보자.

<center>

<img src="https://github.com/Jwhyee/Jwhyee/assets/82663161/d0332444-ccdc-4110-9018-ceb2c7a37ef5">

</center>

```java
public interface JavaSwimmable {
    default void act() {
        System.out.println("어푸 어푸");
    }
}
```

```java
public interface JavaFlyable {
    default void act() {
        System.out.println("파닥 파닥");
    }
}
```

위와 같이 `act`라는 동일한 시그니처를 가진 `default` 메소드를 갖고 있다.

> `JDK 8`부터 `default` 메소드를 인터페이스에 넣을 수 있게 되었다.
> `default` 메소드가 있을 경우, 따로 하위 클래스에서 구현하지 않아도 된다.

```kotlin
interface Swimmable {
    fun act() {
        println("어푸 어푸")
    }
}
```

```kotlin
interface Flyable {
    fun act() {
        println("파닥 파닥")
    }
}
```

`java`와 다르게 `default`를 명시하지 않아도 `default` 함수를 만들 수 있다.

이제 **동일한 시그니처**를 가진 두 인터페이스를 구현한 `Penguin` 코드를 살펴보도록 하자.

```java
public class JavaPenguin extends JavaAnimal implements JavaFlyable, JavaSwimmable {
    @Override
    public void act() {
        JavaSwimmable.super.act();
        JavaFlyable.super.act();
    }
}
```

```kotlin
class Penguin(
    species: String,
) : Animal(species, 2), Swimmable, Flyable {
    override fun act() {
        super<Swimmable>.act()
        super<Flyable>.act()
    }
}
```

`java`에서는 상속을 받을 때 `extends` 키워드를 사용하고, 구현할 때에는 `implements`를 사용한다.
그리고, 동일한 시그니처를 사용하고 있기 때문에 `InterfaceName.super.method()`처럼 `implements`한 인터페이스 이름을 가져온 뒤 `.super`를 통해 `default` 메소드를 가져온다.

하지만 `kotlin`에서는 상속과 구현 모두 콜론으로 나타내기 때문에 쉼표로만 구분해주면 되고,
제네릭을 사용하는 것처럼 `super<Type>`을 통해 인터페이스 지정해준 뒤, 메소드를 호출하게 된다.

> `java`와 동일하게 `kotlin`에서도 인터페이스는 인스턴스화할 수 없다.

또한, `kotlin`에서는 `backing field`가 없는 프로퍼티를 인터페이스에 만들 수 있다.

```kotlin
interface Swimmable {

    val swimAbility: Int
    fun act() {
        println("어푸 어푸")
    }
}
```

위와 같이 수영 능력치를 나타내는 `swimAbility`를 `val`로 추가해준다.
`val`은 수정할 수 없기 때문에 하위 클래스에서 `getter`에 대한 코드를 구현해주길 기대하는 코드인 것이다.

```kotlin
class Penguin(
    species: String,
) : Animal(species, 2), Swimmable, Flyable {
    override val swimAbility: Int
        get() = 3
}
```

이렇게 하면 무조건 하위 클래스에서 구현을 해야하는 구조가 되며, 인터페이스에서는 자유롭게 `swimAbility`를 사용할 수 있게 된다.

```kotlin
interface Swimmable {
    val swimAbility: Int
    
    fun act() {
        println("수영 능력치 : ${swimAbility}")
        println("어푸 어푸")
    }
}
```

반대로 `Swimmable`에서 `get() = 3`와 같이 직접 구현해줄 수도 있다.

## 클래스를 상속할 때 주의할 점

이번에는 Base, Derived(파생된) 클래스를 통해 `abstract`, `interface`가 아닌 상속에 대해서 보도록 하자.

<center>

<img src="https://github.com/Jwhyee/Jwhyee/assets/82663161/4e982c8f-9400-442c-80ca-565022c3d5e2">

</center>

```kotlin
open class Base(
    open val number: Int = 100
) {
    init {
        println("Base Class")
        println(number)
    }
}
```

```kotlin
class Derived(
    override val number: Int
) : Base(number) {
    init {
        println("Derived Class")
    }
}
```

`abstract`, `interface`와 다른 점이 있다면, `Base` 클래스 앞에 `open` 키워드를 통해 다른 키워드가 상속 받을 수 있도록 열어주었다.
또한, 앞서 `abstract` 클래스인 `Animal`을 상속 받은 뒤, `legCount`를 하위 클래스에서 상속 받아 구현할 수 있도록한 것과 같이 `number` 프로퍼티를 `open`으로 열어주었다.
그 덕분에 `Derived` 클래스에서 `number`를 `override`하고 있는 모습을 볼 수 있다.

그럼 `Derived`를 인스턴스화 시킨 뒤, 실행하면 어떤 순서로 출력될까?

```kotlin
fun main() {
    Derived(300)
}
```

```
Base Class
0
Derived Class
```

상위 클래스인 `Base` 클래스의 `init` 블록이 먼저 실행되고, 0이 출력된 후, `Derived` 클래스의 `init` 블록이 실행된다.
조금 이상한 부분은 `number`을 출력했을 때, 0이 나왔다는 점이다.
객체를 생헝할 때, 300을 넣어주기도 했고, `Base` 클래스 코드를 보면 기본값으로 100을 넣어주었다.

IDE를 보면 사진과 같이 경고를 띄워주고 있는 것을 볼 수 있다.

<center>

<img src="https://github.com/Jwhyee/Jwhyee/assets/82663161/5daa2413-c796-4c87-a4e0-426d4be31519">

</center>

```bash
Accessing non-final property number in constructor 
```

<center>

<img src="https://github.com/Jwhyee/Jwhyee/assets/82663161/fa951867-9005-4d67-bd5a-673a501d7ff7">

</center>

사진과 같이 `Derived.number`에 값이 초기화되지 않은 상태에서 `Base` 클래스에 `number`를 넘겨주었기 때문에 0이 출력된 것이다.

> 상위 클래스에 `constructor`와 `init` 블록에서는 하위 클래스의 값이 초기화되지 않았기 때문에 해당 `field`에 접근하면 안 된다는 것이다.
> 즉, 하위 클래스에서 `override`하고 있는 프로퍼티에 접근하지 말자.

그렇기 때문에 아래와 같이 코드를 변경하면, 100이 나오는 것을 볼 수 있다.

```kotlin
fun main() {
    Derived()
}

open class Base {
    val number: Int = 100
    init {
        println("Base Class")
        println(number)
    }
}

class Derived : Base() {
    init {
        println("Derived Class")
    }
}
```

> 상위 클래스를 설계할 때, 생성자 또는 초기화 블록에 사용되는 프로퍼티에는 `open`을 피해야 한다.

## 정리

### 키워드 정리

- final : default로 보이지 않게 존재하며, override를 할 수 없게 한다.
  - 다른 누군가가 상속 받게 하려면 `open`을 붙여줘야 `final` 키워드를 상쇄시킬 수 있다.
- open : override를 열어 준다.
- abstract : 반드시 override 해야 한다.
- override : 상위 타입을 오버라이드 하고 있다.

### 내용 정리

- 상속 또는 구현을 할 때에 콜론(:)을 사용해야 한다.
- 상위 클래스 상속을 구현할 때 생성자를 반드시 호출해야 한다.
- override를 필수로 붙여야 한다.
- 추상 멤버가 아니면 기본적으로 오버라이드가 불가능하다.
  - open을 사용해주어야 한다.
- 상위 클래스의 생성자 또는 초기화 블록에서 open 프로퍼티를 사용하면 예기치 못한 버그가 생길 수 있다.
