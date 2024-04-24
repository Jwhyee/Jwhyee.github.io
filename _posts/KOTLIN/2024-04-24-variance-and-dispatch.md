---
title: "[Kotlin] - 변성과 디스패치"
last_modified_at: 2024-04-24T22:10:37-23:30
categories: KOTLIN
tags:
  - KOTLIN
toc: true
toc_sticky: true
toc_label: "Retrospect"
toc_icon: "file"
---

작성된 코드는 모두 이해를 돕기위한 간단한 예시일 뿐입니다.<br>
틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 변성과 디스패치

> 작성된 코드는 모두 이해를 돕기위한, 간단한 예시일 뿐입니다.

### 변성(variance)이란?

변성이란 타입간의 상관 타입의 관계를 의미한다.

```kotlin
private interface List<T>
private class ArrayList<T>: List<T>
private fun <T> arrayListOf(vararg values: T) = ArrayList<T>()

fun main() {
   val list: List<Number> = ArrayList<Int>()
}
```

위 코드는 정상적으로 동작할까?

실제로 위 코드를 작성하면 `Type mismatch` 에러가 발생한다.
`ArrayList`는 `List`의 구현체이고, `Int` 또한 `Number`의 하위 타입인데 왜 에러가 발생할까?

```kotlin
fun main() {
   val intList: List<Int> = arrayListOf(1, 2, 3)
   // Type mismatch.
   val numberList: List<Number> = intList
   numberList[0] = 1.0
}
```

위에서 정의한 `List`를 자바의 `List`처럼 읽기, 쓰기가 모두 가능한 리스트라고 생각해보자.
`intList`, `numberList`의 타입 파라미터는 모두 `Number` 혹은 그의 하위 타입이지만 에러가 발생한다.

그 이유는 마지막 줄에서 알 수 있다.
우선, `numberList`는 `intList`를 얕은 복사로 갖게 된다.
때문에 `numberList`의 0번 인덱스에 접근해 값을 수정할 경우 `intList`에도 직접적으로 영향을 끼치게 되는 것이다.
즉, 제네릭의 상하위 타입을 그대로 받아들인다면, 이를 꺼내서 사용할 때, 문제가 발생할 수 있게 되는 것이다.

때문에, 제네릭은 타입 불변성을 가지게 되었고, 제네릭 타입의 상위 및 하위 타입 관계를 유지할 수 있도록 해주는 것이 바로 변성(variance)이다.

> A가 B를 상속 받아도, Class<A>는 Class<B>를 상속받지 않는다.

#### 공변(covariance)

공변이란, 하위 타입의 관계를 유지하는 것이다.

```kotlin
private interface List<out T>
private class ArrayList<T>: List<T>
private fun <T> arrayListOf(vararg values: T) = ArrayList<T>()

fun main() {
   val intList: List<Int> = arrayListOf(1, 2, 3)
   val numberList: List<Number> = intList
}
```

`List`의 타입 파라미터 앞에 `out` 키워드를 사용하면, 해당 제네릭은 공변성을 갖게 된다.

대표적인 예시로 `List` 인터페이스 코드를 보면 알 수 있다.

```kotlin
public interface List<out E> : Collection<E> { ... }
```

만약 함수의 반환 타입에 T가 사용될 경우, 이는 항상 생산(produce)에 위치한다.

```kotlin
public operator fun <T> Collection<T>.plus(elements: Array<out T>): List<T> {
    val result = ArrayList<T>(this.size + elements.size)
    result.addAll(this)
    result.addAll(elements)
    return result
}
```

위 코드를 보면, 2개의 리스트를 합쳐서 새로운 `ArrayList`를 생산해 반환한다.

### 반공변(contravariance)

반공변이란, 상위 타입 관계가 유지되는 것이다.

```kotlin
private interface List<in T>
private class ArrayList<T>: List<T>
private fun <T> arrayListOf(vararg values: T) = ArrayList<T>()

fun main() {
   val numberList: List<Number> = arrayListOf(1, 2, 3)
   val intList: List<Int> = numberList
}
```

`List`의 타입 파라미터 앞에 `in` 키워드를 사용하면, 해당 제네릭은 반공변성을 갖게 된다.

대표적인 예시로 `Comparator` 인터페이스를 보면 알 수 있다.

```kotlin
interface Comparator<in T> {
	fun compare(e1: T, e2: T): Int {...}
}
```

만약 함수 파라미터에서 T가 사용될 경우, 이는 항상 소비(consume)에 위치한다.

```kotlin
public fun <T> Iterable<T>.sortedWith(comparator: Comparator<in T>): List<T> {  
	if (this is Collection) {  
		if (size <= 1) return this.toList()  
		@Suppress("UNCHECKED_CAST")  
		return (toTypedArray<Any?>() as Array<T>).apply { sortWith(comparator) }.asList()  
	}  
	return toMutableList().apply { sortWith(comparator) }  
}
```

`sortedWith` 함수를 보면, 주어진 `comparator`를 메소드 안으로 전달(passed in)되어 해당 메소드에 의해 소비(consume)된다.

### 디스패치란?

`dispatch`는 특정 시점을 의미한다.

#### 동적 디스패치(Dynamic dispatch)

> 프로그래밍 언어 용어에서 동적이라는 말은 실행 시점(run time)을 의미한다.

동적 디스패치는 실행 시점에 객체 타입에 따라 동적으로 호출될 대상 메소드를 결정하는 방식을 의미한다.

대표적인 동적 디스패치 함수로는 멤버 함수를 예로 들 수 있다.

```kotlin
public interface List<out E> : Collection<E> {
   override val size: Int
   override fun isEmpty(): Boolean
   override fun contains(element: @UnsafeVariance E): Boolean
}
```

`isEmpty()`를 예시로 보면, 실행 시점에 객체가 생성이되고, 호출 시점에는 실제 객체의 타입에 동적으로 결정되므로 동적 디스패치 함수이다.

#### 정적 디스패치(Static dispatch)

> 프로그래밍 언어 용어에서 정적이라는 말은 컴파일 시점(compile time)을 의미한다.

정적 디스패치는 컴파일 시점에 알려진 변수 타입에 따라 정해진 메소드를 호출하는 방식을 의미한다.

대표적인 정적 디스패치 함수로는 확장 함수를 예로 들 수 있다.

```kotlin
public inline fun <reified R> Iterable<*>.filterIsInstance(): List<@kotlin.internal.NoInfer R> {
   return filterIsInstanceTo(ArrayList<R>())
}
```

컴파일 시점에 호출될 때 컬렉션의 타입에 따라 적절한 동작을 수행하므로 정적 디스패치 함수이다.