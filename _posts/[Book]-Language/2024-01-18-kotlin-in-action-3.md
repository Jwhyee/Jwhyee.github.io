---
title: "[Chapter3] - 함수 정의와 호출"
last_modified_at: 2024-01-18T22:10:37-23:30
categories: "[Book]-Language"
tags:
   - Kotlin in action
   - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter3"
toc_icon: "file"
---

**코틀린 인 액션**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 1. 코틀린에서 컬렉션 만들기

자바에서 `List.of()`, `Set.of()`와 같이 컬렉션을 바로 생성하는 것처럼 코틀린에서도 쉽게 컬렉션을 만들 수 있다.

```kotlin  
val set = hashSetOf(1, 7, 53)  
val list = arrayListOf(1, 7, 53)  
val map = hashMapOf(1 to "one", 7 to "seven", 53 to "fifty-three")  
```  

`hashMap`을 생성할 때 사용한 `to` 키워드는 하나의 `Pair`를 만들 때 주로 사용한다.  
`hashMapOf()` 메소드 내부를 살펴보면 다음과 같이 되어있다.

```kotlin  
public fun <K, V> hashMapOf(vararg pairs: Pair<K, V>): HashMap<K, V> =
	HashMap<K, V>(mapCapacity(pairs.size)).apply { putAll(pairs) }  
  
public fun <K, V> MutableMap<in K, in V>.putAll(pairs: Array<out Pair<K, V>>): Unit {  
	for ((key, value) in pairs) {  
		put(key, value)  
	}  
}  
```  

`vararg`를 통해 여러 개의 `pairs`를 받고, `putAll` 함수를 통해 맵에 추가해준다.

```kotlin  
println(set.javaClass)  
println(list.javaClass)  
println(map.javaClass)  
```  

또한, 위에서 만든 컬렉션의 클래스를 찍어보면, 코틀린만의 컬렉션이 아닌, 기존 자바 컬렉션을 활용하고 있는 것을 볼 수 있다.

## 2. 함수를 호출하기 쉽게 만들기

`list` 하나를 출력하는 코드를 살펴보자.

```kotlin  
val list = arrayListOf(1, 7, 53)  
  
// 출력 : [1, 7, 53]println(list)  
```  

출력 결과와 같이 디폴트 구현이 되어있는 `toString()`을 호출하는 것을 볼 수 있다.  
자바에서 이 형식을 바꾸려면 `list` 내부 원소들을 이터레이션 하면서 출력하겠지만,  
코틀린에서는 이런 요구 사항을 처리할 수 있는 함수가 표준 라이브러리에 이미 존재한다.

```kotlin  
fun <T> joinToString(  
	collection: Collection<T>,  
	separator: String,  
	prefix: String,  
	postfix: String  
): String {  
	val result = StringBuilder(prefix)  
	for ((idx, element) in collection.withIndex()) {  
		if (idx > 0) result.append(separator)  
			result.append(element)  
	}  
	result.append(postfix)  
	return result.toString()  
}  
```  

위 함수는 원소 사이에 넣을 구분자(separator)를 받고, 맨 앞에 넣을 접두사(prefix)와 맨 뒤에 넣을 접미사(postfix)를 받는다.  
또한, 위 함수는 제네릭하기 때문에 어떤 타입의 값을 원소로 하는 컬렉션이든 처리할 수 있다.

```kotlin  
// 출력 : [1, 7, 53]println(list)  
// 출력 : {1 - 7 - 53}println(joinToString(list, " - ", "{", "}"))  
```  

의도한대로 잘 나오는 것을 볼 수 있다.

### 이름 붙인 인자

호출부를 보면 인자를 넣는 부분이 번잡하게 보여 가독성이 떨어진다.

```kotlin  
println(joinToString(list, " ", " ", "."))  
```  

만약 위처럼 함수를 호출한다고 하면, 어떤 인자가 무엇을 의미하는지 알기 어렵다.  
자바의 경우 주석을 이용해 특정 파라미터의 위치임을 알려줄 수 있다.

```java  
joinToString (collection, /* separator */ " ", /* prefix */ " ", /* postfix */ " ")  
```  

파라미터 이름을 주석을 통해 넣는 작업은 번거로우면서, 귀찮기만 하다.  
코틀린에서는 다음과 같이 파라미터 이름을 그대로 넣어서 사용이 가능하다.

```kotlin  
println(joinToString(list, separator = " ", prefix = " ", postfix = "."))  
```  

자바에 비해 훨씬 깔끔하고, 보기 좋아진 것을 알 수 있다.

> 파라미터 이름을 변경해야할 경우, 인텔리제이에서 제공하는 Refactor 기능을 통해 Rename하는 것을 권장한다.

> 자바로 작성한 코드를 호출할 때에는 이름 붙인 인자를 사용할 수 없다.

```java  
public class UtilClass {  
	private UtilClass() { }  
	public static <T> String joinToString(Collection<T> collection, String separator, String prefix, String postfix) {  
		final StringBuilder result = new StringBuilder(prefix);  
		int idx = 0;  
		for (T t : collection) {  
			if(idx > 0) result.append(separator);  
			result.append(t);  
			idx++;  
		}  
		result.append(postfix);  
		return result.toString();  
	}  
}  
```  

```kotlin  
// 컴파일 에러 발생 : Named arguments are not allowed for non-Kotlin functionsprintln(UtilClass.joinToString(list, separator = " - ", "{", "}"))  
```  

위와 같이 자바에서 작성한 코드를 호출할 때에는 이름 붙인 인자를 사용할 수 없다.

### 디폴트 파라미터 값

자바에서는 일부 클래스에서 오버로딩(overloading)한 메소드가 너무 많아진다는 문제가 있다.

오버로딩 메소드들은 하위 호환성을 유지하거나, API 사용자에게 편의를 더하는 등의 여러 가지 이유로 만들어진다.  
코틀린에서는 함수 선언에서 파라미터의 디폴트 값을 지정할 수 있으므로 이런 오버로드 중 상당수를 피할 수 있다.

```kotlin  
fun main() {  
	println(joinToString(list))  
}  
  
fun <T> joinToString(  
	collection: Collection<T>,  
	separator: String = ", ",  
	prefix: String = "",  
	postfix: String = ""  
): String { ... }  
```  

디폴트로 지정하지 않은 매개변수는 무조건 인자로 받아야하지만, 이 외에는 넘겨주지 않을 시 디폴트값을 사용하게 된다.  
또한, 이름 붙인 인자를 사용하는 경우 인자 목록의 중간에 있는 인자를 생략하고, 지정하고 싶은 인자를 이름을 붙여서 순서와 관계없이 지정할 수 있다.

```kotlin  
// separator 생략  
println(joinToString(list, prefix = "{", postfix = "}"))  
```  

> 자바에는 디폴트 파라미터 값이라는 개념이 없다.  
> 때문에 자바에서 코틀린 함수를 호출하는 경우에는 디폴트 파라미터 값을 제공하더라도 모든 인자를 입력해야 한다.  
> 하지만 `@JvmOverloads`를 함수에 추가하면, 코틀린 컴파일러가 자동으로 자바 메소드를 추가해준다.

```kotlin  
@JvmOverloads  
fun <T> joinToString(  
collection: Collection<T>,  
separator: String = ", ",  
prefix: String = "",  
postfix: String = ""  
): String { ... }  
```  

```java  
// 코틀린 코드를 바이트 코드로 변환 후 디컴파일된 자바 파일  
@JvmOverloads  
@NotNull  
public static final String joinToString(@NotNull Collection collection, @NotNull String separator, @NotNull String prefix, @NotNull String postfix) { ... }  
  
// $FF: synthetic method  
public static String joinToString$default(Collection var0, String var1, String var2, String var3, int var4, Object var5) {  
	if ((var4 & 2) != 0) {var1 = ", ";}  
	if ((var4 & 4) != 0) {var2 = "";}  
	if ((var4 & 8) != 0) {var3 = "";}  
	return joinToString(var0, var1, var2, var3);  
}  
  
@JvmOverloads  
@NotNull  
public static final String joinToString(@NotNull Collection collection, @NotNull String separator, @NotNull String prefix) {  
	return joinToString$default(collection, separator, prefix, (String)null, 8, (Object)null);  
}  
  
@JvmOverloads  
@NotNull  
public static final String joinToString(@NotNull Collection collection, @NotNull String separator) {  
	return joinToString$default(collection, separator, (String)null, (String)null, 12, (Object)null);  
}  
  
@JvmOverloads  
@NotNull  
public static final String joinToString(@NotNull Collection collection) {  
	return joinToString$default(collection, (String)null, (String)null, (String)null, 14, (Object)null);  
}  
```  

```java  
public class KtJoinToStringTest {  
	public static void main(String[] args) {  
		final List<Integer> list = List.of(1, 7, 53);  
		System.out.println(CollectionTestKt.joinToString(list));  
	}  
}  
```  

### 정적인 유틸리티 클래스 없애기

#### 최상위 함수

객체지향 언어인 자바에서는 모든 코드를 클래스 내부에 작성해야 한다.  
어느 한 클래스에 포함시키기 어렵고, 비슷하게 중요한 역할을 하는 클래스가 둘 이상 있을 수 있다.  
때문에 다양한 정적 메소드를 모아두는 역할만 담당하며, 특별한 상태나 인스턴스 메소드는 없는 유틸리티 클래스가 생겨난다.

코틀린에서는 이런 무의미한 클래스를 만들 필요가 없다.  
함수를 직접 소스 파일의 최상위 수준, 모든 다른 클래스의 밖에 위치시키면 된다.

```java  
import action.chapter03.part1.CollectionTestKt;  
  
System.out.println(CollectionTestKt.joinToString(list));  
```  

자바에서는 위 코드와 같이 클래스 파일을 부른 뒤, 내부 함수를 호출하면 된다.

이렇게 사용할 수 있는 이유는, 컴파일러가 `kt` 파일을 컴파일 할 때, 새로운 클래스를 정의해주기 때문이다.  
때문에 위 코드와 같이 `CollectionTest.kt` 파일이 그 이름에 대응하는 `CollectionTestKt` 클래스로 바뀌게 된다.

> 만약 파일의 이름과 다른 이름으로 호출하고 싶을 경우, `@file:JvmName` 어노테이션을 활용해 파일 최상단에 위치시키면 된다.

```kotlin  
// CollectionTest.kt 파일  
@file:JvmName("StringFunctions")  
  
package action.chapter03.part1  
  
import java.lang.StringBuilder  
  
@JvmOverloads  
fun <T> joinToString(  
	collection: Collection<T>,  
	separator: String = ", ",  
	prefix: String = "",  
	postfix: String = ""  
): String { ... }  
```  

```java  
import action.chapter03.part1.StringFunctions;  
System.out.println(StringFunctions.joinToString(list));  
```  

#### 최상위 프로퍼티

함수와 마찬가지로 프로퍼티 또한 파일의 최상위 수준에 놓을 수 있다.

```kotlin  
var opCount = 0  
val UNIX_LINE_SEPARATOR = "\n"  
  
fun performOperation() {  
	opCount++  
}  
  
fun reportOperationCount() {  
	println("Operation performed $opCount times")  
}  
```  

이런 최상위 프로퍼티를 활용하면 정적 필드에 저장되며, 최상위 프로퍼티를 활용해 코드에 상수를 추가할 수 있다.  
기본적으로 최상위 프로퍼티도 다른 모든 프로퍼티처럼 접근자 메소드를 통해 자바 코드에 노출된다.

- val : getter
- var : getter, setter

이 상수를 더 자연스럽게 사용하려면 `public static final` 필드로 컴파일해야 한다.  
이럴 경우 `const`를 사용하면 위 필드로 컴파일하게 만들 수 있다.  
단, 원시 타입과 String 타입의 프로퍼티만 지정할 수 있다.

```kotlin  
const val UNIX_LINE_SEPARATOR = "\n"  
```  

```java  
@NotNull  
public static final String UNIX_LINE_SEPARATOR = "\n";  
```  

> `const`를 붙이지 않을 경우 `private static final`로 선언된다.

## 3. 메소드를 다른 클래스에 추가

기존 코드와 코틀린 코드를 자연스럽게 통합하는 것은 코틀린의 핵심 목표 중 하나이다.

### 확장 함수(Extension function)

확장 함수는 어떤 클래스의 멤버 메소드인 것처럼 호출할 수 있지만, 그 클래스의 밖에 선언된 함수다.

```kotlin  
fun String.lastChar(): Char = this[this.length - 1]  
```  

확장 함수를 만들려면 추가하려는 함수 이름 앞에 그 함수가 확장할 클래스의 이름을 덧붙이기만 하면 된다.  
클래스 이름을 수신 객체 타입(receiver type)이라 부르며, 확장 함수가 호출되는 대상이 되는 값(객체)을 수신 객체(receiver object)라고 부른다.

```kotlin  
// String : 수신 객체 타입  
// this : 수신 객체  
fun String.lastChar(): Char = this[this.length - 1]  
// fun String.lastChar(): Char = get(length - 1)  
  
fun main() {  
	val ch = "Hello".lastChar()  
	  
	// 출력 : oprintln(ch)  
}  
```  

이 함수를 호출하는 구문은 다른 일반 클래스 멤버를 호출하는 구문과 동일하며, `this`를 생략해서 사용할 수도 있다.

> 클래스 내부 함수로 정의되어 있지 않아도, 확장 함수로 정의할 경우 내부 함수에 정의된 것처럼 사용할 수 있다.

#### 임포트와 확장 함수

확장 함수를 정의하더라도 모든 소스 코드에서 그 함수를 사용할 수 있지는 않다.  
어디서든 그 함수를 사용할 수 있다면, 이름이 충돌하는 경우가 자주 생길 수 있기 때문이다.

```kotlin  
// 특정 함수 importimport action.chapter03.part3.lastChar  
// 특정 함수 import에 대한 별칭 지정  
import action.chapter03.part3.lastChar as last  
// 전체 임포트  
import action.chapter03.part3.*  
  
val c = "Kotlin".lastChar()  
val c = "Kotlin".last()  
```  

위 코드와 같이 `import`를 통해 다른 패키지에서 정의한 확장 함수를 가져올 수 있다.  
만약 다른 여러 패키지에 속해있는 이름이 같은 함수를 가져와 사용해야 하는 경우 `as`를 통해 이름을 바꿔서 `import`하면 이름 충돌을 막을 수 있다.

> 코틀린 문법상 확장 함수는 반드시 짧은 이름을 써야한다.

#### 확장 함수로 유틸리티 함수 정의

앞서 정의했던 `joinToString()`을 확장 함수로 변경해보자.

```kotlin  
fun <T> Collection<T>.joinToString(  
separator: String = ", ",  
prefix: String = "",  
postfix: String = ""  
): String {  
	val result = StringBuilder(prefix)  
	for ((idx, element) in this.withIndex()) {  
		if (idx > 0) result.append(separator)  
		result.append(element)  
	}  
	result.append(postfix)  
	return result.toString()  
}  
```  

매개변수로 받던 `Collection` 정보를 수신 객체 타입으로 변경해주고, 수신 객체는 `this`로 변경해주자.

```kotlin  
// 출력 : 1, 7, 53val list = arrayListOf(1, 7, 53)  
println(list.joinToString(", "))  
```  

확장 함수는 단지 정적 메소드 호출에 대한 문법적인 편의(syntatic sugar)일 뿐이다.  
그래서 클래스가 아닌 더 구체적인 타입을 수신 객체 타입으로 지정할 수도 있다.

```kotlin  
fun Collection<String>.join(  
	separator: String = ", ",  
	prefix: String = "",  
	postfix: String = ""  
) = joinToString(separator, prefix, postfix)  
  
// 출력 : One, Two, Eightval strList = arrayListOf("One", "Two", "Eight")  
println("join = ${strList.join()}")  
```  

위와 같이 작성하면 문자열 컬렉션에 대해서만 호출할 수 있게 된다.

#### 확장 함수는 오버라이드할 수 없다.

확장 함수가 정적 메소드와 같은 특징을 가지므로, 확장 함수를 하위 클래스에서 오버라이드할 수는 없다.  
아래 `View`와 그 하위 클래스인 `Button`에 대한 예시를 통해 확인해보자.

```kotlin  
open class View {  
	open fun click() = println("View clicked")  
}  
  
class Button : View() {  
	override fun click() = println("Button clicked")  
}  
  
fun main() {  
	// 출력 : Button clickedval view: View = Button()  
	view.click()  
}  
```  

버튼은 뷰의 하위 타입이므로, 상위 클래스의 함수를 상속 받아 재구현할 수 있다.  
때문에 객체 타입이 `View`라고 하더라도, 실제 타입을 `Button`으로 생성할 경우 **Button clicked**가 출력되는 것을 볼 수 있다.

> 시행 시점에 객체 타입에 따라 동적으로 호출될 대상 메소드를 결정하는 방식을 동적 디스패치(dynamic dispatch)라고 부른다. 반대로 컴파일 시점에 알려진 변수 타입에 따라 정해진 메소드를 호출하는 방식은 정적 디스패치(static dispatch)라고 부른다.  
> 프로그래밍 언어 용어에서 **정적**이라는 말은 **컴파일 시점**을 의미하고, **동적**이라는 말은 **실행 시점**을 의미한다.

이번에는 확장 함수를 적용해보자.

```kotlin  
fun View.showOff() = println("I'm View!")  
fun Button.showOff() = println("I'm Button!")  
  
fun main() {  
	val view: View = Button()  
	  
	// 출력 : Button clickedview.click()  
	// 출력 : I'm View!view.showOff()  
}  
```  

실제 객체는 `Button`이지만 `View`에 대한 문구가 출력되는 것을 알 수 있다.  
이름과 파라미터가 완전이 같은 확장 함수를 기반 클래스와 하위 클래스에 대해 정의하더라도,  
**실제로는 확장 함수를 호출할 때, 수신 객체로 지정한 변수의 정적 타입에 의해 어떤 확장 함수가 호출될지 결정된다.  
즉, 그 변수에 저장된 객체의 동적인 타입에 의해 확장 함수가 결정되지 않는다.**

> 어떤 클래스를 확장한 함수와 그 클래스의 멤버 함수의 이름가 같을 경우 멤버 함수가 호출된다.(멤버 함수의 우선 순위가 더 높다.)

##### open 키워드

> `open` 키워드를 사용하지 않을 경우 기본적으로 `final class`로 디컴파일 되는 것을 볼 수 있다.  
> `final` 클래스는 상속이 불가능하므로, `open` 키워드를 붙여 일반적인 `class`로 디컴파일 되도록 만들어 준다.

```java  
// open을 붙이지 않았을 경우  
public final class View {  
	public final void click() {  
		String var1 = "View clicked";  
		System.out.println(var1);  
	}  
}  
  
// open을 붙일 경우  
public class View {  
	public void click() {  
		String var1 = "View clicked";  
		System.out.println(var1);  
	}  
}  
```  

##### 콜론(:) 컨벤션

코틀린 [공식 문서](https://kotlinlang.org/docs/coding-conventions.html#colon)에 나와있듯,  
클래스의 상속, 구현은 ` : `를 사용하며, 변수 및 함수의 리턴 타입은 `: `를 사용한다.

```kotlin  
abstract class Foo<out T : Any> : IFoo {  
	abstract fun foo(a: Int): T  
}  
  
class FooImpl : Foo() {  
	constructor(x: String) : this(x) { /*...*/ }  
	val x = object : IFoo { /*...*/ }  
}  
  
val mutableCollection: MutableSet<String> = HashSet()  
```  

### 확장 프로퍼티

확장 프로퍼티를 사용하면, 기존 클래스 객체에 대한 프로퍼티 형식의 구문으로 사용할 수 있는 API를 추가할 수 있다.

```kotlin  
val String.lastChar: Char  
get() = get(length - 1)  
```  

> `get()`을 사용해 프로퍼티라는 이름으로 불리기는 하지만, 상태를 저장할 적절한 방법이 없다. (기존 클래스의 인스턴스 객체에 필드를 추가할 방법은 없다.)  때문에 실제로 확장 프로퍼티는 아무 상태도 가질 수 없다.

뒷받침하는 필드(backing field)가 없어서 기본 게터 구현을 제공할 수 없으므로, 최소한 게터는 꼭 정의를 해야 한다. 마찬가지로 계산한 값을 담을 장소가 없으므로, 초기화 코드도 쓸 수 없다.

```kotlin  
var StringBuilder.lastChar: Char  
	get() = get(length - 1)  
	set(value) {  
		this.setCharAt(length - 1, value)  
	}  
```  

```kotlin  
// 출력 : nprintln("Kotlin".lastChar)  
  
val sb = StringBuilder("Kotlin?")  
sb.lastChar = '!'  
  
// 출력 : Kotlin!println(sb.toString())  
// 출력 : !println(sb.lastChar)  
```  

자바에서 확장 프로퍼티를 사용하고 싶다면, 항상 `get`, `set`을 붙여 함수를 호출해야 한다.

## 4. 컬렉션 처리

이 주제에서는 다음과 같은 코틀린 언어 특성을 설명한다.

- `vararg` 키워드를 사용하면 호출 시 인자 개수가 달라질 수 있는 함수를 정의할 수 있다.
- 중위(infix) 함수 호출 구문을 사용하면, 인자가 하나뿐인 메소드를 간편하게 호출할 수 있다.
- 구조 분해 선언(destructuring declaration)을 사용하면 복합적인 값을 분해해서 여러 변수에 나눠 담을 수 있다.

### 자바 컬렉션 API 확장

코틀린 컬렉션은 자바와 같은 클래스를 사용하지만, 더 확장된 API를 제공한다.

```kotlin  
fun main() {  
	val strings = listOf("first", "second", "fourteenth")  
	println(strings.last())  
	  
	val numbers = setOf(1, 14, 2)  
	println(numbers.max())  
}  
```  

위에서 사용하는 함수들을 타고 들어가면, 자바 클래스가 아닌 코틀린 파일로 된 것을 볼 수 있다.  
그런데 어떻게 자바 라이브러리 클래스의 인스턴스인 컬렉션에 대해 코틀린이 새로운 기능을 추가할 수 있을까?

실제 구현 코드를 보면 답을 알 수 있다.

```kotlin  
public fun <T> List<T>.last(): T {  
	if (isEmpty())  
		throw NoSuchElementException("List is empty.")  
	return this[lastIndex]  
}  
  
@Deprecated("Use maxOrNull instead.", ReplaceWith("this.maxOrNull()"))  
@DeprecatedSinceKotlin(warningSince = "1.4", errorSince = "1.5", hiddenSince = "1.6")  
@Suppress("CONFLICTING_OVERLOADS")  
public fun <T : Comparable<T>> Iterable<T>.max(): T? {  
	return maxOrNull()  
}  
  
@SinceKotlin("1.4")  
public fun <T : Comparable<T>> Iterable<T>.maxOrNull(): T? {  
	val iterator = iterator()  
	if (!iterator.hasNext()) return null  
	var max = iterator.next()  
	while (iterator.hasNext()) {  
		val e = iterator.next()  
		if (max < e) max = e  
	}  
	return max  
}  
```  

> `max()`는 어노테이션으로 나와있는 것처럼 1.4 버전에서는 경고를 띄워주고, 1.5 버전에서는 에러가 발생하며, 1.6 버전부터 완전히 deprecated 되었다.  
> 때문에 해당 함수를 사용해야할 경우 `maxOrNull()`을 사용해야 한다.

두 함수 모두 확장 함수로 되어있기 때문에 가능한 것이다.

### 가변 인자 함수 : 인자의 개수가 달라질 수 있는 함수 정의

```kotlin  
val list = listOf(2, 3, 5, 7, 11)  
```  

위와 같이 여러 인자를 받는 `listOf()`는 내부 코드를 보면 알 수 있듯 가변 인자를 사용한다.

```kotlin  
public fun <T> listOf(vararg elements: T): List<T> = /*...*/  
```  

자바의 가변 길이 인자는 메소드를 호출할 때 원하는 개수만큼 값을 인자로 넘기면 자바 컴파일러가 배열에 그 값들을 넣어준다.  
코틀린의 경우 비슷하지만 자바에서 사용하는 `...`이 아닌 `vararg` 변경자를 붙인다.

이미 배열에 들어있는 원소를 가변 길이 인자로 넘길 때도 코틀린과 자바 구문이 다르다.

```kotlin  
fun main() {  
	val args = arrayOf("First", "Second", "Third")  
	val argList = listOf("args: ", *args)  
	  
	println(argList)  
}  
```  

위 코드에서 보이는 `*`은 스프레드(spread) 연산자라고 부르며, 데이터를 나열할 때 사용한다.

### 값의 쌍 다루기 : 중위 호출과 구조 분해 선언

```kotlin  
val map = mapOf(1 to "One", 7 to "Seven", 53 to "fifty-three")  
```  

위 코드를 보면 `to`라는 키워드를 사용했는데, 이는 중위 호출(infix call)을 통해 일반 메소드를 호출한 것이다.

```kotlin  
public infix fun <A, B> A.to(that: B): Pair<A, B> = Pair(this, that)  
```  

중위 호출 시에는 수신 객체와 유일한 메소드 인자 사이에 메소드 이름을 넣는다.  
이 때, 객체, 메소드 이름, 유일한 인자 사이에는 공백이 들어가야 한다.

```kotlin  
1.to("One")  
1 to "One"  
```  

위 두 코드는 동일한 `to` 메소드를 호출하고 있는 것이며, 두 값을 즉시 변수로 초기화할 수 있다.

```kotlin  
val (number, name) = 1 to "One"  
```  

이런 기능을 구조 분해 선언(destructuring declaration)이라고 부른다.

<img width="387" alt="스크린샷 2023-12-23 오후 6 53 08" src="https://github.com/Jaeeun1083/kotlin_in_action/assets/82663161/2329a4be-eb61-4f05-ae01-eee5db2e300b">  


`Pair` 인스턴스 외에도 구조 분해를 적용할 수 있다.

```kotlin  
val map = mapOf(1 to "One", 7 to "Seven", 53 to "fifty-three")  
for ((key, value) in map.entries) {  
	println("${key} = ${value}")  
}  
```  

```kotlin  
val list = listOf(2, 3, 5, 7, 11)  
  
for ((index, element) in list.withIndex()) {  
	println("${index} = ${element}")  
}  
  
list.forEachIndexed { index, element -> 
	println("${index} = ${element}")  
}  
```  

## 5. 문자열과 정규식 다루기

### 문자열 나누기

[스택 오버플로우](https://stackoverflow.com/questions/14833008/java-string-split-with-dot)을 보면 아래와 코드 질문을 볼 수 있다.

```java  
// Why does the second line of this code throw ArrayIndexOutOfBoundsException?  
String filename = "D:/some folder/001.docx";  
String extensionRemoved = filename.split(".")[0];  
```  

`split`의 구분 문자열은 실제로 정규식을 나타내는데, 표현식 중 마침표(.)는 모든 문자를 나타내는 식으로 해석된다.  
때문에 이를 잘 모르는 상태에서 사용하면 혼동이 생길 수 있다. 하지만 코틀린에서는 `split`의 확장 함수를 제공함으로써 혼동을 야기하는 메소드를 감춘다.

```kotlin  
fun main() {  
	val str = "12.345-6.A"  
	// .과 -을 기준으로 문자열을 분리하는 정규식을 명시적으로 만든다.  
	println(str.split("\\.|-".toRegex()))  
}  
```  

하지만 정규식을 잘 모르는 상태에서 위와 같이 사용하는 것은 어렵게 느껴진다.  
이를 위해, `split` 확장 함수를 오버로딩한 다른 버전을 사용하면 된다.

```kotlin  
println(str.split(".", "-"))  
```  

자바에서는 무조건 하나의 인자만 받을 수 있지만, 코틀린에서는 `vararg`를 사용해 여러 표현식을 쉽게 적용할 수 있다.

### 정규식과 3중 따옴표로 묶은 문자열

파일 경로 중, 디렉터리, 파일 이름, 확장자로 구분하는 코드를 작성해보자.

```kotlin  
fun main() {  
	val path = "/users/yole/kotlin-book/chapter.adoc"  
	parsePath(path)  
}  
  
fun parsePath(path: String) {  
	val directory = path.substringBeforeLast("/")  
	val fullName = path.substringAfterLast("/")  
	val fileName = fullName.substringBeforeLast(".")  
	val extension = fullName.substringAfterLast(".")  
	  
	// 출력 : dir : /users/yole/kotlin-book, name : chapter, ext : adocprintln("dir : ${directory}, name : ${fileName}, ext : ${extension}")  
}  
```  

- substringBeforeLast : 가장 마지막 `/` 전까지 문자열을 잘라서 가져옴
- substringAfterLast : 가장 마지막 `/` 이후의 문자열을 잘라서 가져옴

`MatchResult`를 사용하면 더 편하게 이용할 수 있다.

```kotlin  
fun parsePathVer2(path: String) {  
	val regex = """(.+)/(.+)\.(.+)""".toRegex()  
	val mathResult = regex.matchEntire(path)  
	if (mathResult != null) {  
	val (dir, name, ext) = mathResult.destructured  
		println("dir : ${dir}, name : ${name}, ext : ${ext}")  
	}  
}  
```  

3중 따옴표 문자열에서는 역슬래쉬(\)를 포함한 어떤 문자도 이스케이프할 필요도 없다.

<center>  

<img width="334" alt="image" src="https://github.com/Jwhyee/Jwhyee.github.io/assets/82663161/22b92a3c-e9ed-4417-a043-7087684bf09e">  

</center>  

#### 여러 줄 3중 따옴표 문자열

ASCII 아트를 이용한 코틀린 로고를 출력해보자.

```kotlin  
val kotlinLogo = """| //  
| //  
|/ \"""  
println(kotlinLogo)  
```  

```  
| //  
| //  
|/ \  
```  

3중 따옴표 문자열을 사용하면, 들여쓰기나, 줄 바꿈을 포함한 모든 문자가 들어간다.

```kotlin  
val kotlinLogo = """| //  
.| //  
.|/ \"""  
println(kotlinLogo.trimMargin("."))  
```  

의미없는 들여쓰기를 지우기 위해서는 들여쓰기 끝에 특별한 문자열로 표시하고, `trimMargin()`을 사용해 그 직전의 공백을 제거할 수 있다.

## 6. 코드 다듬기 : 로컬 함수와 확장

많은 개발자들이 좋은 코드의 중요한 특징 중 하나가 중복이 없는 것이라 믿는다.  
그래서 그 원칙에는 반복하지 말라(DRY; Don't Repeat Yourself)라는 이름도 있다.

많은 경우 메소드 추출(Extract Method) 리팩토링을 적용해서 긴 메소드를 부분부분 나눠 재활용하게 한다.  
하지만 이럴 경우 클래스 안에 작은 메소드가 많아지고, 메소드 사이의 관계를 파악하기 힘들어서 코드를 이해하기 더 어려워질 수 있다.

### 로컬 함수

코틀린에는 앞서 제기한 문제를 해결하기 위한 깔끔한 해법이 있다.

```kotlin  
class User(val id: Int, val name: String, val address: String)  
  
fun saveUser(user: User) {  
	if (user.name.isEmpty()) {  
		throw IllegalArgumentException("Can't save user ${user.id} : empty name")  
	}  
	if (user.address.isEmpty()) {  
		throw IllegalArgumentException("Can't save user ${user.id} : empty address")
	}  
	save(user)  
}  
```  

위 코드에서 중복이 많지는 않지만, 필드를 검증하는 메소드가 중복되고 있다.  
이런 경우 검증 코드를 로컬 함수로 분리하면 중복을 없애는 동시에 코드 구조를 깔끔하게 유지할 수 있다.

```kotlin  
fun saveUser(user: User) {  
	fun validate(value: String, fieldName: String) {  
	if (value.isEmpty()) {  
	// 바깥 함수 파라미터에 직접 접근할 수 있다.  
	throw IllegalArgumentException("Can't save user ${user.id} : empty $fieldName")  
	}  
	}  
	validate(user.name, "Name")  
	validate(user.address, "Address")  
	  
	save(user)  
}  
```  

이를 확장 함수로 만들면 다음과 같이 작성할 수 있다.

```kotlin  
fun User.validateBeforeSave() {  
fun validate(value: String, fieldName: String) {  
if (value.isEmpty()) {  
throw IllegalArgumentException(  
"Can't save user $id : empty $fieldName"  
)  
}  
}  
  
validate(name, "Name")  
validate(address, "Address")  
}  
```  

이미 수신 객체를 `User`로 정의했기 때문에 `this.id`가 아닌 `id`로 바로 필드에 접근이 가능하다.  
`Spring` 기준으로 `validate` 함수는 `UserService` 내부에 따로 정의할 수 있지만, 다른 곳에서는 쓰일 일이 없기 때문에 로컬 함수로 사용하면 좋다.
