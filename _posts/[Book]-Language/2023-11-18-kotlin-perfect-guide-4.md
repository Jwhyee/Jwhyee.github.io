---
title: "[Kotlin] - Pair"
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

## Pair란

> `Pair`란, 한 쌍;두 부분이 함께 붙어 하나를 이루는 것을 의미한다.

`kotlin`에서도 동일하게 쌍을 의미하는 클래스이며, 클래스 구조는 아래와 같이 생겼다.

```kotlin
public data class Pair<out A, out B>(
    public val first: A,
    public val second: B
) : Serializable
```

자세한 내용은 [공식 문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/)를 참고하면 좋을 것 같다.

## Pair의 사용

앞서 설명한 것과 같이 2개의 변수를 묶어서 사용할 수 있으며, 어떠한 타입이든 넣을 수 있다.

### 데이터 저장

아래 코드와 같이 다양한 방법으로 정의가 가능하다.

```kotlin
var a = Pair(1, "짱구")
val b = Pair<Int, String>(second = "철수", first = 2)
val (c1, c2) = Pair(3, "유리")
val (d1, d2) = 4 to "훈발롬"
```

약간 생소한 코드가 있다면 `c1`, `c2` 변수를 괄호로 묶어 사용하는 것이다.
`Pair`가 한 쌍을 의미하는 것처럼 한 쌍의 변수로 묶어서 사용하는 것이다.

### 데이터 출력

출력은 `Pair`의 첫 부분을 사용하고 싶다면 `first`를 호출하고, 두 번째 부분을 사용하고 싶다면 `second`를 호출하면 된다.

```kotlin
println("a.first = ${a.first} \t a.second = ${a.second}")

println("a = $a")

println("c.first = $c1 \t c.second = $c2")

// a.first = 1 	 a.second = 짱구
println("a.first = ${a.first} \t a.second = ${a.second}")
// a = (1, 짱구)
println("a = $a")

// b.first = 2 	 b.second = 철수
println("b.first = ${b.first} \t b.second = ${b.second}")
// b = (2, 철수)
println("b = $b")

// c.first = 3   	 c.second = 유리
println("c.first = $c1 \t c.second = $c2")

// d.first = 4 	     d.second = 훈발롬
println("d.first = $d1 \t d.second = $d2")
```

### 데이터 수정

앞서 클래스 구조를 보면 알듯이 `val`로 되어 있어서 데이터를 수정할 수 없다.
그럼에도 꼭 수정이 필요한 경우 `copy`를 통해 다시 할당하는 방식으로 할 수 있다.

```kotlin
a = a.copy(first = 5, second = "돌")
```

### 데이터 정렬

`Pair`는 다른 클래스와 다르게 `PriorityQueue`를 통해 정렬할 수 없다.

```kotlin
fun main() {
    val pq = PriorityQueue<Pair<Int, Int>>()
    pq.offer(1 to 1)
    pq.offer(2 to 2)

    while (!pq.isEmpty()) {
        val cur = pq.poll()

        println(cur.first)
    }
}
```

위와 같이 작성하면 컴파일 타임에는 에러나 나지 않지만, 런타임에서 아래와 같은 에러가 발생한다.

```
Exception in thread "main" java.lang.ClassCastException: 
class kotlin.Pair cannot be cast to class java.lang.Comparable 
(kotlin.Pair is in unnamed module of loader 'app'; java.lang.Comparable is in module java.base of loader 'bootstrap')
```

에러 내용을 살펴보면 `Pair` 클래스는 `Comparable`로 캐스트할 수 없다는 내용이다.
즉, `Comparable`을 구현하지 않아 무엇과 비교를 해서 정렬할지 정의되어 있지 않다는 것이다.

이를 해결하는 방법은 생각보다 간단하다.

```kotlin
// 방식 1
val pq = PriorityQueue<Pair<Int, Int>>(Comparator() { a, b -> a.first - b.first })

// 방식 2
val pq = PriorityQueue<Pair<Int, Int>> { a, b -> a.first - b.first }
```

위와 같이 `Comparator`를 제공해 정렬을 해주면 된다.