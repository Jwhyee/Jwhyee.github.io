---
title: "[Chapter10] - 애노테이션과 리플렉션"
last_modified_at: 2024-03-02T22:10:37-23:30
categories: "[Book]-Language"
tags:
   - Kotlin in action
   - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter10"
toc_icon: "file"
---

**코틀린 인 액션**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 1. 애노테이션 선언과 적용

스프링과 같은 프레임워크만 봐도 애노테이션을 많이 사용한다. 코틀린 애노테이션도 자바와 개념은 동일하다. 메타 데이터 선언에 추가하면, 애노테이션을 처리하는 도구가 컴파일 시점 혹은 런타임 시점에 적절한 처리를 해준다.

### 1-1. 애노테이션 적용

테스트 라이브러리인 JUnit을 보면, 테스트 메소드 앞에 `@Test`를 붙여 사용한다.

```kotlin
class JunitTest {  
    @Test fun testTrue() {  
        Assert.assertTrue(true)  
    }  
}
```

이처럼 자바와 동일한 방법으로 사용하며, 함수나 클래스 등 여러 다른 코드 구성 요소에 붙여 사용할 수 있다. 다른 예시로, `@Deprecated`를 살펴보자.

`Deprecated` 애노테이션은 자바와 동일한 의미를 갖고 있으며, 보통 지원이 종료되어, 다른 새 버전을 사용하도록 유도하거나, 해당 기능을 사용하지 말라는 의미로 사용된다. 우선 해당 애노테이션이 붙은 함수를 사용하면 다음과 같이 취소선이 그어진 것을 볼 수 있다.

```kotlin
fun main(args: Array<String>) {  
    args[0][0].toInt()  
}
```

![[deprecated-image.png]]

해당 함수를 들어가보면 다음과 같이 정의되어있는 것을 볼 수 있는데, 사용 금지를 설명하는 매시지와 대체할 패턴, 몇 버전부터 사용하지 않게 되었는지 등을 볼 수 있다.

```kotlin
@Deprecated("
   Conversion of Char to Number is deprecated. Use Char.code property instead.
", ReplaceWith("this.code"))  
@DeprecatedSinceKotlin(warningSince = "1.5")  
@kotlin.internal.IntrinsicConstEvaluation  
public fun toInt(): Int
```

`ReplaceWith`와 같이 애노테이션에 인자를 넘길 때는 일반 함수와 마찬가지로 괄호 안에 인자를 넣는다. 이를 작성할 경우, 위 사진에 보이는 것처럼 `Replace with 'this.code()'`라는 문구가 뜨게 되며, 새로운 API 버전에 맞는 코드로 바꿔즈는 퀵 픽스(quick fix)도 제시해 준다.

애노테이션의 인자로는 원시 타입의 값, 문자열, enum, 클래스 참조, 다른 애노테이션 클래스 그리고 이에 대한 요소들로 이루어진 배열이 들어갈 수 있다.

- 클래스를 인자로 지정할 경우
   - `@MyAnnotation(MyClass::class)`
- 다른 애노테이션을 인자로 지정할 경우
   - `@`를 제외한 클래스 이름만 작성한다.
   - `@MyAnnotation(MyAnnotation2(...))`
- 배열 인자를 지정할 경우
   - `arrayOf` 함수를 사용해 값을 넣어준다.
      - `@RequestMapping(path = arrayOf("/foo", "/bar"))`
   - 자바에서 선언한 애노테이션이 필요할 경우 가변인자로 넣어줄 수 있다.
      - `@JavaAnnotationWithArrayValue("abc", "foo", "bar")`

애노테이션 인자는 컴파일 시점에 알 수 있어야 하며, 프로퍼티를 인자로 사용할 경우 `const` 변경자가 붙은 상수 필드만 사용이 가능하다. 또한, 해당 프로퍼티는 `object` 혹은 파일의 최상단에 위치해야 하며, 그렇지 않을 경우 컴파일 에러가 발생한다.

```kotlin
const val TEST_TIMEOUT = 100L
@Test(timeout = TEST_TIMEOUT) fun testMethod() { ... }
```

### 1-2. 애노테이션 대상

자바의 경우 필드를 선언하더라도, `getter`와 `setter` 함수를 따로 만들어서 값을 가져와 사용하게 된다. 때문에 원하는 함수에 애노테이션을 붙여서 사용할 수 있다. 하지만 코틀린의 프로퍼티는 기본적으로 `getter`와 `setter`를 컴파일러가 자동으로 생성해주기 때문에 어떤 요소에 애노테이션을 붙일지 표시할 필요가 있다.

이를 사용 지점 대상(user-site target) 선언이라 부르며, 애노테이션을 붙일 요소를 지정한 뒤, 특정 어노테이션의 이름을 작성하면 된다. 아래와 같이 작성할 경우 `a`라는 프로퍼티에 애노테이션이 적용되는 것이 아닌, `a` 프로퍼티의 `getter`에 적용되는 것이다.

```kotlin
private class TestClass(  
    @get: Rule(...)  
    val a: String = ""  
)
```

| 대상 | 설명 |
| :--: | :--: |
| property | 프로퍼티 전체, 자바에서 선언된 애노테이션에는 사용 불가 |
| field | 프로퍼티에 의해 생성되는 뒷받침하는 필드 |
| get | 프로퍼티 게터 |
| set | 프로퍼티 세터 |
| receiver | 확장 함수 혹은 프로퍼티의 수신 객체 파라미터 |
| param | 생성자 파라미터 |
| setparam | 세터 파라미터 |
| delegate | 위임 프로퍼티의 위임 인스턴스를 담아둔 필드 |
| file | 파일 안에 선언된 최상위 함수와 프로퍼티를 담아두는 클래스  |

file을 대상으로 사용하는 애노테이션은 package 선언 앞에서 파일의 최상위 수준에만 적용할 수 있다. 파일에 흔히 적용하는 애노테이션으로는 파일에 있는 최상위 선언을 담는 클래스의 이름을 바꿔주는 `@JvmName`이 있다.

```kotlin
@file:JvmName("FooFunctions")  
  
package action.junyoung.chapter10.part1  
  
fun foo() {  
   println("foo")  
}
```

```java
public class KotlinAnnotationCallTest {  
	public static void main(String[] args) {  
		FooFunctions.foo();  
	}  
}
```

### 1-3. 애노테이션을 활용한 JSON 직렬화 제어

프론트에서 백엔드로 데이터를 보내줄 때 보통 JSON 형태로 데이터를 전송하고, 스프링에서는 `@RequestBody`를 통해 전달 받은 JSON 데이터를 그에 해당하는 객체로 역직렬화를 시켜 준다.

```json
{
	"name" : "Alice",
	"age" : 29
}
```

```kotlin
fun foo(@ReqeustBody person: Person) {
   // 출력 : Alice : 29
   println("${person.name} : ${person.age}")
}
```

위처럼 JSON 데이터가 객체로 변환하는 것을 역직렬화, 객체를 JSON 데이터로 변환하는 것을 직렬화라고 한다. 만약 `Person` 클래스의 `name` 필드가 `_name`으로 정의되어 있을 경우 JSON 데이터의 키 값과 달라 다음과 같은 에러가 발생한다.

```
Field error in object 'person' on field '_name': rejected value [null]
```

이런 경우에는 `Person` 클래스를 다음과 같이 정의해주면 된다.

```kotlin
class Person(
	@JsonProperty("name")  
	private val _name: String?,
) {
	val name: String
		get() = _name!!
}

```

### 1-4. 애노테이션 선언

자바의 경우 어노테이션을 정의할 때, 대부분 `value()`가 들어간다.

```java
public @interface JsonName {
	String value();
}
```

만약 위 어노테이션을 코틀린에서 사용할 경우 다음과 같이 사용이 가능하다.

```kotlin
@JsonName("foooo")  
val foo = 10  
```

하지만 어노테이션에서 받는 값이 2개 이상으로 넘어갈 경우 `@JsonName("foooo", "foo")`처럼 작성할 수 없고, 어느 필드에 해당하는지 작성을 해줘야 한다.

```java
public @interface JsonName {  
	String name();  
	String value();  
}
```

```kotlin  
@JsonName("Hello", name = "hello")  
val t = 10  
```

아무리 `name()`을 먼저 정의했더라도, `value()`에 대한 값은 이름을 명시하지 않아도 들어가지는 것을 볼 수 있다. 하지만 `value()`가 아닌 다른 `Attribute`에는 그에 대한 이름을 직접 명시해주어야 한다.

코틀린의 경우 일반 클래스의 생성자와 같이 작성하기 때문에  프로퍼티의 이름이 `value`가 아니더라도 생성자 순서에 따라 작성할 수 있다.

```kotlin
private annotation class JsonNaming(val name: String, val value: String)  
```

```kotlin
@JsonNaming("Hello", "hello")  
val t = 10  
```

만약 코틀린 어노테이션을 자바에서 사용하려면 다음과 같이 모든 `Attribute`의 이름을 명시해주어야 한다.

```java
@JsonNaming(value = "hello", name = "20")  
int foo = 150;
```

### 1-5. 메타 애노테이션 : 애노테이션을 처리하는 방법 제어

메타 애노테이션이란, 애노테이션을 정의하는 클래스에 적용할 수 있는 것을 메타 애노테이션이라 부른다. 이러한 메타 애노테이션에는 `@Target`, `@Retention` 등이 있다. `@Target`은 해당 애노테이션을 사용할 수 있는 대상 범위를 지정할 수 있으며, 여러 개를 한 번에 작성할 수도 있다.

```kotlin
public enum class AnnotationTarget {  
	CLASS,  
	ANNOTATION_CLASS,  
	TYPE_PARAMETER,  
	PROPERTY,  
	FIELD,  
	LOCAL_VARIABLE,  
	VALUE_PARAMETER,  
	CONSTRUCTOR,  
	FUNCTION,  
	PROPERTY_GETTER,  
	PROPERTY_SETTER,  
	TYPE,  
	EXPRESSION,  
	FILE,  
	TYPEALIAS  
}
```

`@Retention`은 해당 애노테이션을 소스 수준에서만 유지할 것인지, 클래스 파일에 저장할지, 실행 시점에 리플렉션을 사용해 접근할 수 있게 할지 지정하는 메타 애노테이션이다.

```kotlin
public enum class AnnotationRetention {  
	SOURCE,  
	BINARY,  
	RUNTIME  
}
```

## 2. 리플렉션 : 실행 시점에 코틀린 객체 내부 관찰

리플렉션이란, 실행 시점에 동적으로 객체의 프로퍼티와 메소드에 접근할 수 있게 해주는 방법이다. 보통 객체의 메소드나 프로퍼티에 접근할 때에는 프로그램 소스코드 안에 구체적인 선언이 있는 메소드나 프로퍼티 이름을 사용하며, 컴파일러는 그런 이름이 실제로 가리키는 선언을 컴파일 시점에 정적으로 찾아내서 해당하는 선언이 실제 존재함을 보장한다.

### 2-1. 코틀린 리플렉션 API : KClass, KClallable, KFunction, KProperty

#### KClass

해당 클래스를 사용하면, 클래스 안에 있는 모든 선언을 열거하고, 각 선언에 접근하거나 클래스의 상위 클래스를 얻는 등 다양한 작업이 가능하다.

```kotlin
open class Animal(val height: Int)  
  
private class Person(
	val name: String, 
	val age: Int, 
	height: Int
) : Animal(height)
  
fun main() {  
	val p = Person("Alice", 29, 198)  
	val kClass = p.javaClass.kotlin  

	// 출력 : Person
	println(kClass.simpleName)  
}
```

이렇게 특정 객체를 코틀린 클래스로 받아오면, 런타임에 해당 클래스의 이름을 사용할 수 있다. 또한, 클래스 내부에 있는 프로퍼티를 조회하고 싶으면 다음과 같에 `memberProperties`를 사용하면 된다.

```kotlin
// 출력 : age name height
kClass.memberProperties.forEach { println(it.name) }
```

이를 사용할 경우 `Person` 클래스의 프로퍼티와 조상 클래스 내부에 정의된 비확장 프로퍼티를 모두 가져올 수 있다. `memberProperties`를 비롯해 `KClass`에 대해 사용할 수 있는 다양한 기능은 실제로 `kotlin-reflect` 라이브러리를 통해 제공되는 확장 함수이다.

#### KCallable, KFunction

`KClallable`은 함수와 프로퍼티를 아우르는 공통 상위 인터페이스이다. 해당 인터페이스 안에는 `call`이라는 함수가 들어있으며, 이를 사용하면 함수 혹은 프로퍼티의 게터를 호출할 수 있다.

`KFunction`은 특정 함수를 담을 수 있는 인터페이스이다. 해당 인터페이스 역시 `KCallable`을 상속 받고 있는 것을 볼 수 있다. `KFunction`은 함수의 매개 변수 수에 따라 `KFunction0`, `KFunction1` 등등 매개 변수 수에 상응하는 인터페이스를 활용한다.

```kotlin
fun foo(x: Int) = println(x)  
  
fun kCallableTest() {  
	val kFunction = ::foo  
	// 출력 : 42
	kFunction.call(42)  
}
```

이렇게 `KCallable`을 상속 받을 경우 함수를 `call`을 통해 호출할 수 있다. 하지만 `call`은 매개 변수를 전달해주지 않을 경우 컴파일러가 에러를 발생시키지 않는다. 만약 함수에 정의된 매개 변수보다 적거나 더 많은 인자를 넘길 경우 다음과 같은 에러가 발생한다.

```
IllegalArgumentException: Callable expects 1 arguments, but 0 were provided.
```

때문에 함수를 호출할 때에는 `invoke`를 사용하는 것이 좋다. `invoke`는 함수의 매개 변수 개수에 따라 정확한 인자를 넘길 수 있도록 컴파일러가 유도해준다. 또한, `invoke`를 사용하지 않고 `kFunction`에 바로 인자를 넘겨줄 수도 있다.

```kotlin
kFunction.invoke(10)  
kFunction(24)
```

> `KFunctionN` 타입은 `KFunction`을 확장하며, N과 파라미터 개수가 같은 `invoke`를 추가로 포함한다. 이런 함수 타입들은 컴파일러가 생성한 합성 타입(synthetic compiler-generated type)이라 부른다. 실제로는 `KFunction22`까지는 정의되어 있지만, 그 이상으로는 컴파일러가 생성한 합성 타입을 사용한다.

#### KPropery

`KProperty` 또한, `KCallable`을 확장한다. 때문에 `call` 메소드를 통해 특정 프로퍼티의 `getter`를 호출할 수 있다. 하지만 이 또한, 프로퍼티 인터페이스에서 제공하는 `get` 메소드를 활용하는 것이 더 좋다.

```kotlin
val p = Person("Alice", 29, 198)  
val memberProperty = Person::age  
// 출력 : 29
println(memberProperty.get(p))
```

만약 프로퍼티가 `var`로 선언되었을 경우 `KMutableProperty`로 바뀐다. `KMutableProperty`는 해당 프로퍼티의 게터와 세터를 함수처럼 다룰 수 있다.
