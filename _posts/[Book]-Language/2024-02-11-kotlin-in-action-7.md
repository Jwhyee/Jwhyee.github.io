---
title: "[Chapter7] - 연산자 오버로딩과 기타 관계"
last_modified_at: 2024-02-11T22:10:37-23:30
categories: "[Book]-Language"
tags:
   - Kotlin in action
   - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter7"
toc_icon: "file"
---

**코틀린 인 액션**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

어떤 클래스 안에 plus라는 이름의 특별한 메소드를 정의하면, 그 클래스의 인스턴스에 대해 + 연산자를 사용할 수 있다. 이렇게 어떤 언어 기능과 미리 정해진 이름의 함수를 연결해주는 기법을 관례(convention)이라고 부른다.

## 1. 산술 연산자 오버로딩

자바에서는 String 값에 대해 + 혹은 += 연산을 사용할 수 있었다. 이처럼 코틀린에서도 관례를 사용하는 가장 단순한 예는 산술 연산자이다.

### 1-1. 이항 산술 연산과 오버로딩

아래 코드는 plus에 대한 산술 연산을 구현한 코드이다.

```kotlin
data class Point(val x: Int, val y: Int) {  
    operator fun plus(other: Point): Point {  
        return Point(x + other.x, y + other.y)  
    }  
}  
  
fun main() {  
    val p1 = Point(10, 20)  
    val p2 = Point(30, 40)  
    println(p1 + p2)  
}
```

이처럼 연산자를 오버로딩하는 함수 정의 앞에 operator를 붙여야 한다. 만약 operator를 정의하지 않을 경우 해당 연산을 사용하는 부분에서 다음과 같은 에러가 발생한다.

```kotlin
// 'operator' modifier is required on 'plus' in 'part1.Point'
println(p1 + p2)
```

연산자를 기준으로 좌측에 있는 인스턴스가 수신 객체처럼 활용되고, 우측에 있는 인스턴스가 매개변수로 활용된다.

plus 외에도 사용할 수 있는 연산은 다음과 같다.

| 식 | 함수 이름 |
| ---- | ---- |
| a * b | times |
| a / b | div |
| a % b | mod -> rem |
| a + b | plus |
| a - b | minus |
만약 a + b `*` c와 같은 식이 있다면, 연산자 우선 순위에 따라 `*`를 먼저 진행하고, +를 진행한다. 또한, 이런 연산자 오버로딩은 클래스 내부가 아닌 외부에서도 확장 함수로 정의할 수 있다.

```kotlin
operator fun Point.times(scale: Double): Point {  
    return Point((x * scale).toInt(), (y * scale).toInt())  
}
```

코틀린은 연산자가 자동으로 교환 법칙(commutativity)을 지원하지 않는다.

```kotlin
p * 1.5 == 1.5 * p
```

위 교환 법칙을 준수하려면, 같은 식에 대응하는 연산자 함수인 Double.times에 대한 확장 함수를 추가적으로 정의해야 한다.

### 1-2. 복합 대입 연산자 오버로딩

코틀린은 +와 같은 일반 연산자 뿐만 아니라 +=과 같은 복합 대입(compound assignment) 연산자도 지원한다. 대표적으로 List, Map, Set과 같은 컬렉션에서 사용이 가능하다.

```kotlin
operator fun <T> MutableCollection<T>.plusAssign(element: T) {
	this.add(element)
}
```

plusAssign을 사용하려면, val이 아닌 var로 정의되어 있어야 하며, 가능한 plus와 plusAssign 연산을 동시에 정의하지 않는 것이 좋다. 코틀린 컬렉션은 두 가지를 함께 제공한다. +, - 연산은 항상 새로운 컬렉션을 반환하고, +=과 -= 연산자는 항상 변경 가능한 컬렉션에 작용해 메모리에 있는 객체 상태를 변화시킨다. 만약 읽기 전용 컬렉션일 경우 변경을 적용한 복사본을 반환한다.

```kotlin
fun main() {  
    val list = arrayListOf(1, 2)  
    list += 3  
    val newList = list + listOf(4, 5)  
    // [1, 2, 3]
    println(list)
	// [1, 2, 3, 4, 5]  
    println(newList)  
}
```

### 1-3. 단항 연산자 오버로딩

앞서 본 연산은 모두 두 값에 대해 작용하는 이항(binary) 연산에 대한 내용이었다. 단항 연산자는 함수에 파라미터 없이 사용하는 함수이다.

```kotlin
operator fun Point.unaryMinus(): Point {  
    return Point(-x, -y)  
}

fun main() {
	val p = Point(10, 20)
	// Point(x=-10, y=-20)
	println(-p)
}
```

| 식 | 함수 이름 |
| ---- | ---- |
| +a | unaryPlus |
| -a | unaryMinus |
| !a | not |
| ++a, a++ | inc |
| --a, a-- | dec |

BigDecimal과 같은 클래스를 살펴보면 ++ 연산을 오버로딩한 것을 볼 수 있다.

```kotlin
operator fun BigDecimal.inc() = this + BigDecimal.ONE
```

## 2. 비교 연산자 오버로딩

equals나 compareTo를 호출해야할 경우 자바와 달리 == 비교 연산자를 직접 사용할 수 있어, 코드가 더 간결하며, 이해하기 쉬워진다.
### 2-1. 동등성 연산자: equals

4장에서 나온 것과 같이 코틀린에서는 `==` 연산을 사용하면 equals 메소드 호출로 컴파일한다. 즉, != 연산은 equals의 부정 연산을 하는 것이다. 식별자 비교(identity equals) 연산자인 `===`를 사용해 파라미터가 수신 객체와 같은지 비교할 수 있다. 즉, 자바의 `==` 연산자와 동일한 것이다.

equals는 Any에 정의된 메소드이므로, override가 붙어있다. 해당 메소드를 살펴보면 다음과 같이 되어있다.

```kotlin
public open operator fun equals(other: Any?): Boolean
```

하지만 하위 클래스에서 해당 메소드를 오버라이드를 하면, 다음과 같이 operator를 붙이지 않는 것을 볼 수 있다.

```kotlin
override fun equals(other: Any?): Boolean {  
	if (other === this) return true  
	if (other !is Point) return false  
	return other.x == x && other.y == y  
}
```

상위 클래스에서 operator를 선언했을 경우 하위 클래스에서 이를 override할 때, operator 변경자를 붙이지 않아도, 자동으로 적용된다. 또한, Any에서 상속 받은 equlas가 확장 함수보다 우선순위가 높기 때문에 equals는 확장 함수로 정의할 수 없다.

### 2-2. 순서 연산자 : compareTo

자바에서 정렬이나 최댓값, 최솟값 등을 비교해야하는 경우 Comparable 인터페이스의 compareTo를 구현해야 한다. 자바에서는 o1.compareTo(o2)를 명시적으로 사용해야 한다. 하지만 코틀린에서는 o1 > o2와 같이 비교 연산자를 사용할 수 있다.

```kotlin
private class Person(  
	val firstName: String,  
	val lastName: String  
) : Comparable<Person> {  
	override fun compareTo(other: Person): Int {  
		return compareValuesBy(this, other, Person::lastName, Person::firstName)  
	}  
}  
  
fun main() {  
	val p1 = Person("Alice", "Smith")  
	val p2 = Person("Bob", "Johnson")
	// 출력 : false  
	println(p1 < p2)  
}
```

compareTo 메소드 또한 operator가 붙어있으므로, 오버라이딩 함수에 해당 변경자를 붙일 필요가 없다. 위 코드에서 사용한 compareValuesBy 함수를 이용해 비교에 사용할 두 객체를 넘기고, 비교할 함수를 인자로 넘겨주면 쉽고 간결하게 compareTo 함수를 정의할 수 있다. 필드를 직접 비교하는게 복잡하긴 하지만, 비교 속도는 훨신 더 빨라진다.

## 3. 컬렉션과 범위에 대해 쓸 수 있는 관례

컬렉션을 다룰 때 가장 많이 쓰는 연산은 인덱스를 사용해 원소를 읽거나 쓰는 연산과 값이 속해있는지 검사하는 연산이다. 코틀린에서는 이 모든 연산을 연산자 구문으로 사용할 수 있다.

### 3-1. 인덱스로 원소에 접근 : get, set

자바나 코틀린 모두 배열에 접근할 때, 인덱스 연산자인 대괄호(`[]`)를 사용한다. 자바에서는 이러한 연산을 배열에서만 사용할 수 있지만, 코틀린에서는 모든 컬렉션에서 사용이 가능하다.

```kotlin
operator fun Point.get(index: Int): Int {  
	return when(index) {  
		0 -> x  
		1 -> y  
		else -> throw IndexOutOfBoundsException("Invalid coordinate $index")  
	}  
}

operator fun Point.set(index: Int, value: Int) {  
	when(index) {  
		0 -> x = value  
		1 -> y = value  
		else -> throw IndexOutOfBoundsException("Invalid coordinate $index")  
	}  
}

fun main() {
	val p = Point(10, 20)
	// 출력 : get = 20
	println("get = ${p[1]}")
	
	p1[0] = 20
	// 출력 : set = 20
	println("set = ${p[1]}")
}
```

get이라는 operator 변경자 메소드를 생성하면, 인덱스 연산자를 사용할 수 있게 된다. 반대로 set 메소드를 정의할 때에는, 인덱스와 값을 모두 받아서 구현해야 한다.

### 3-2. in 관례

in은 객체가 컬렉션에 들어있는지 멤버십 검사(membership test)한다. 해당 연산자와 대응하는 함수는 contains이다.

```kotlin
data class Rectangle(val upperLeft: Point, val lowerRight: Point)

operator fun Rectangle.contains(p: Point): Boolean {  
	return p.x in upperLeft.x until lowerRight.x && 
		   p.y in upperLeft.y until lowerRight.y  
}

fun main() {  
	val rect = Rectangle(Point(10, 20), Point(50, 50))  
	// 출력 : true
	println(Point(20, 30) in rect)
	// 출력 : false
	println(Point(5, 5) in rect)
}
```

in 우항에 있는 객체는 contains 메소드의 수신 객체가 되고, 좌항에 있는 객체를 contains 메소드에 인자로 전달된다. 위 함수에서는 until을 사용해 열린 범위(끝 값을 포함하지 않음)를 사용했다. 만약 끝 값을 포함하려면 `..` 연산을 사용해야 한다.

### 3-3. rangeTo 관례

범위를 만드려면 `..` 구문을 사용해야 한다. 해당 구문은 rangeTo에 대한 함수이다.

```kotlin
fun main() {  
	val now = LocalDate.now()  
	val vacation = now..now.plusDays(10)
	// 출력 : true
	println(now.plusWeeks(1) in vacation)  
}
```

`now..now.plusDays(10)`은 컴파일러에 의해 `now.rangeTo(now.plusDays(10))`로 변환된다. 이 rangeTo 연산자는 다른 산술 연산자보다 우선 순위가 낮다. 때문에 괄호로 인자를 감싸주는게 가독성에 좋다.

```kotlin
val n = 9
// 출력 : 0..10
println(0..(n + 1))
```

### 3-4. for 루프를 위한 iterator 관례

for 루프에서도 똑같이 in 연산자를 사용한다. 하지만 여기서 사용하는 in의 의미는 다르다. `for(x in list)`와 같은 문장은 `list.iterator`를 호출한 뒤, hasNext와 next 호출을 반복하는 식으로 변환된다.

```kotlin
operator fun ClosedRange<LocalDate>.iterator(): Iterator<LocalDate> =  
	object : Iterator<LocalDate> {  
		var current = start  
		override fun hasNext(): Boolean = current <= endInclusive  
		override fun next(): LocalDate = current.apply {  
			current = plusDays(1)  
		}  
	}

fun main() {  
	val newYear = LocalDate.ofYearDay(2023, 1)  
	val daysOff = newYear.minusDays(1)..newYear  
	// 출력 : 2022-12-31
	// 출력 : 2023-01-01
	for (dayOff in daysOff) println(dayOff)  
}
```

## 4. 구조 분해 선언과 component 함수

구조 분해(destructuring declaration)를 사용하면 복합적인 값을 분해해서 여러 다른 변수를 한꺼번에 초기화할 수 있다.

```kotlin
fun main() {  
	val p = Point(10, 20)  
	val (x, y) = p  
	println("x = $x, y = $y")  
}
```

data class의 주 생성자에 들어있는 프로퍼티에 대해서는 컴파일러가 자동으로 componentN 함수를 만들어준다. 만약 데이터 클래스가 아닐 경우 다음과 같이 정의해서 구조 분해를 정의할 수 있다.

```kotlin
private class Point(val x: Int, val y: Int) {  
	operator fun component1() = x  
	operator fun component2() = y  
}
```

구조 분해 선언 구문을 사용하면 함수가 반환하는 값을 쉽게 풀어서 여러 변수에 넣을 수 있다.

```kotlin
data class NameComponents(val name: String, val extension: String)

fun splitFilename(fullName: String): NameComponents { 
	val result = fullName.split(".", limit = 2)  
	return NameComponents(result[0], result[1])  
}  

fun main() {
	val (name, ext) = splitFilename("example.kt)
	// 출력 : example
	println(name)
	// 출력 : kt
	println(ext)
}
```

위와 같이 NameComponents를 선언하고, 함수에서 이를 반환하도록 하면, 꼭 데이터 클래스로 정의하지 않아도 함수에서 해당 클래스를 반환해 구조 분해를 사용할 수 있다. 표준 라이브러리의 Pair, Triple 클래스를 사용하면 함수에 여러 값을 더 간단하게 반환할 수 있다.

### 4-1. 구조 분해 선언과 루프

Map을 사용할 경우 for 루프 안에서도 구조 분해를 사용할 수 있다.

```kotlin
fun printEntries(map: Map<String, String>) {  
	for ((key, value) in map) {  
		println("$key -> $value")  
	}  
}
```

## 5. 프로퍼티 접근자 로직 재활용 : 위임 프로퍼티

위임 프로퍼티(delegated property)를 사용하면 값을 뒷받침하는 필드에 단순히 저장하는 것보다 더 복잡한 방식으로 작동하는 프로퍼티를 쉽게 구현할 수 있다.

### 5-1. 위임 프로퍼티 소개

위임 프로퍼티의 일반적인 문법은 다음과 같다.

```kotlin
private class Foo {  
	var p: Type by Delegate()  
}
```

p 프로퍼티는 접근자 로직을 Delegate 객체에게 위임한다. 즉, by 뒤에 있는 식을 계산해서 위임에 쓰일 객체를 얻는 것이다.

```kotlin
class Foo {
	// 컴파일러가 생성한 도우미 프로퍼티
	private val delegate = Delegate()

	// 해당 프로퍼티를 위해 컴파일러가 생성한 접근자는 delegate의 getValue와 setValue 메소드를 호출한다.
	var p: Type
		set(value: Type) = delegate.setValue(..., value)
		get() = delegate.getValue(...)
}
```

컴파일러는 숨겨진 도우미 프로퍼티를 만들고, 그 프로퍼티를 위임 객체의 인스턴스로 초기화한다.

```kotlin
class Delegate {  
	operator fun getValue() {...}  
	operator fun setValue(..., value: Type) {...}  
}
class Foo {
	var p: Type by Delegate()
}

fun main() {
	val foo = Foo()
	val oldValue = foo.p
	foo.p = newValue
}
```

foo.p는 일반 프로퍼티처럼 사용할 수 있지만, 실제로 p의 게터 및 세터는 Delegate 타입의 위임 프로퍼티 객체에 있는 메소드를 호출한다.

### 5-2. 위임 프로퍼티 사용 : by lazy()를 사용한 프로퍼티 초기화 지연

지연 초기화(lazy initialization)는 객체의 일부분을 초기화하지 않고, 남겨뒀다가 실제로 그 부분의 값이 필요한 경우 초기화할 때 사용하는 패턴이다. 초기화 과정에서 자원을 많이 사용하거나, 객체를 사용할 때마다 초기화하지 않아도 되는 프로퍼티에 대해 주로 사용한다.

```kotlin
fun loadEmails(person: Person): List<Email> {  
	println("${person.name}의 이메일을 가져옴")  
	return findAllEmailByPerson(person)  
}
```

```kotlin
class Person(val name: String, var age: Int) {  
	private var _emails: List<Email>? = null  
	val emails: List<Email>  
		get() {  
			if(_emails == null) {  
				_emails = loadEmails(this)  
			}  
			return _emails!!  
		}  
}
```

`_emails`라는 프로퍼티는 값을 저장하고, `emails` 프로퍼티는 `_emails`라는 프로퍼티에 대한 읽기 연산을 제공한다. 하지만 지연 초기화하는 프로퍼티가 많아질 경우 가독성이 떨어지고, 스레드 안전하지 않아 제대로 작동한다는 보장도 없다. 이럴 때 위임 프로퍼티를 사용하면 훨씬 간단해진다.

```kotlin
class Person(val name: String, var age: Int) {  
	val emails by lazy { loadEmails(this) }  
}
```

lazy 함수는 getValue 메소드가 들어있는 객체를 반환한다. 따라서 lazy를 by 키워드와 함께 사용해 위임 프로퍼티를 만들 수 있다. 해당 함수는 기본적으로 스레드 안전하다.

### 5-3. 위임 프로퍼티 구현

어떤 객체의 프로퍼티가 바뀔 때마다 리스너에게 변경 통지를 보내는 코드를 만들어보자. 보통 자바에서는 PropertyChangeSupport 혹은 PropertyChangeEvent 클래스를 사용해 처리한다. 모든 클래스에 추가하기는 어려우므로 도우미 클래스를 생성해보자.

```kotlin
class PropertyChangeAware {  
	protected val changeSupport = PropertyChangeSupport(this)  
	  
	fun addPropertyChangeListener(listener: PropertyChangeListener) {  
		changeSupport.addPropertyChangeListener(listener)  
	}  
	  
	fun removePropertyChangeListener(listener: PropertyChangeListener) {
		changeSupport.removePropertyChangeListener(listener)  
	}  
}
```

```kotlin
class Person(val name: String, age: Int, salary: Int) : PropertyChangeAware() {  
	var age: Int = age  
		set(newValue) {  
			val oldValue = field  
			field = newValue  
			changeSupport.firePropertyChange("age", oldValue, newValue)  
		}  
	var salary: Int = salary  
		set(newValue) {  
			val oldValue = field  
			field = newValue  
			changeSupport.firePropertyChange("salary", oldValue, newValue)  
		}  
}
```

```kotlin
fun main() {  
	val p = Person("Dmitry", 34, 2000)  
	p.addPropertyChangeListener(  
		PropertyChangeListener { event ->  
			println("""  
			Property ${event.propertyName} changedfrom ${event.oldValue} to ${event.newValue}  
			""".trimIndent())  
		}  
	)  
	// 출력 : Property age changed from 34 to 35
	p.age = 35  
	// 출력 : Property age changed from 2000 to 2100
	p.salary = 2100  
}
```

뒷받침하는 field 키워드를 사용해 age와 salary 프로퍼티를 뒷받침하는 필드에 접근하는 방법을 보여준다. 하지만 위 코드에서 세터 코드를 보면 중복이 많은 것을 알 수 있다. 해당 프로퍼티의 값을 저장하고, 필요에 따라 통지를 보내주는 클래스를 추출해보자.

```kotlin
class ObservableProperty(  
	val propName: String, var propValue: Int,  
	val changeSupport: PropertyChangeSupport  
) {  
	fun getValue(): Int = propValue  
	fun setValue(newValue: Int) {  
		val oldValue = propValue  
		propValue = newValue  
		changeSupport.firePropertyChange(propName, oldValue, newValue)  
	}  
}
```

```kotlin
private class Person(val name: String, age: Int, salary: Int) : PropertyChangeAware() {  
	val _age = ObservableProperty("age", age, changeSupport)  
	var age: Int  
		get() = _age.getValue()  
		set(value) { _age.setValue(value) }  
	val _salary = ObservableProperty("salary", salary, changeSupport)  
	var salary: Int  
		get() = _salary.getValue()  
		set(value) { _salary.setValue(value) }  
}
```

옵저버를 통해 코드 양이 많이 줄었지만, 작업을 위임하는 준비 코드가 아직 상당 부분 필요한 수준이다. 이런 상황에서 위임 프로퍼티를 사용하면 준비 코드마저 없앨 수 있다.

```kotlin
class ObservableProperty(  
	var propValue: Int, val changeSupport: PropertyChangeSupport  
) {  
	operator fun getValue(p: Person, prop: KProperty<*>): Int = propValue  
	operator fun setValue(p: Person, prop: KProperty<*>, newValue: Int) {  
		val oldValue = propValue  
		propValue = newValue  
		changeSupport.firePropertyChange(prop.name, oldValue, newValue)  
	}  
}
```

```kotlin
class Person(val name: String, age: Int, salary: Int) : PropertyChangeAware() {  
	val age: Int by ObservableProperty(age, changeSupport)  
	var salary: Int by ObservableProperty(salary, changeSupport)  
}
```

by 키워드로 위임 객체를 지정하면 직접 짜야했던 여러 작업을 코틀린 컴파일러가 자동으로 처리해준다. 코틀린 컴파일러가 만들어주는 코드는 이전에 작성했던 코드와 비슷하다.

### 5-4. 위임 프로퍼티 컴파일 규칙

```kotlin
class C {
	var prop: Type by MyDelegate()
}

val c = C()
```

위 클래스가 있다고 가정할 때, 컴파일러는 MyDelegate 클래스의 인스턴스를 감춰진 프로퍼티에 저장하며, 해당 프로퍼티를 `<delegate>`라는 이름으로 부른다. 또한, 이를 표현하기 위해 KProperty 타입의 객체를 사용하고, 이 객체를 `<property>`라고 부른다. 해당 코드를 컴파일하면 다음과 같은 코드가 생긴다.

```kotlin
class C {
	private val <delegate> = MyDelegate()
	var prop: Type
		get() = <delegate>.getValue(this, <property>)
		set(value: Type) = <delegate>.setValue(this, <property>, value)
}
```

### 5-5. 프로퍼티 값을 맵에 저장

자신의 프로퍼티를 동적으로 정의할 수 있는 객체를 만들 때, 위임 프로퍼티를 활용하는 객체를 확장 가능한 객체(expando object)라고 부르기도 한다.

```kotlin
private class Person {  
	private val _attributes = hashMapOf<String, String>()  
	fun setAttribute(attrName: String, value: String) {  
		_attributes[attrName] = value  
	}  
	val name: String  
		get() = _attributes["name"]!!  
}  
  
fun main() {  
	val p = Person()  
	val data = mapOf("name" to "Dmitry", "company" to "JetBrains")  
	for ((attrName, value) in data) {  
		p.setAttribute(attrName, value)  
	}  
	println(p.name)  
}
```

이를 위임 프로퍼티를 사용한 코드로 변환하면 다음과 같다.

```kotlin
private class Person2 {  
	private val _attributes = hashMapOf<String, String>()  
	fun setAttribute(attrName: String, value: String) {  
		_attributes[attrName] = value  
	}  
	val name: String by _attributes  
}
```


Map과 MutableMap 인터페이스가 getValue와 setValue 확장 함수를 제공하기 때문에 가능하다.

### 5-6. 프레임워크에서 위임 프로퍼티 활용

DB에 User라는 테이블이 있고, 그 테이블에 name이라는 문자열 타입의 칼럼과 age라는 정수 타입의 열이 있다고 가정하자.

```kotlin
object Users : IdTable() {  
	val name = varchar("name", length = 50).index()  
	val age = integer("age")  
}  
  
class User(id: EntityId) : Entity(id) {  
	var name: String by Users.name
	var age: Int by Users.age
}
```

Users 객체는 데이터 베이스 테이블을 표현하고, 싱글톤 객체로 선언했다. User의 상위 클래스인 Entity 클래스는 DB 칼럼을 엔티티의 속성(attribute) 값으로 연결해주는 매핑이 있다.

이 프레임워크를 사용하면 User의 프로퍼티에 접근할 때 자동으로 Entity 클래스에 정의된 DB 매핑으로부터 필요한 값을 가져오므로 편하다.
