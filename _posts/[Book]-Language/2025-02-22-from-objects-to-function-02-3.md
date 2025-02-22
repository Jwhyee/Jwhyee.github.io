---
title: "[Chapter2] - 연습 문제 풀이"
last_modified_at: 2025-02-22T22:10:37-23:30
categories: "[Book]-Language"
tags:
   - 객체에서 함수로
   - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter2"
toc_icon: "file"
---

**객체에서 함수로**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## FunStack 테스트

FunStack(Funtional Stack)은 다음과 같은 방식으로 동작한다.
- 원소를 `push`하면 새 스택이 반환된다.
- `pop`을 하면 `pop`한 원소와 새 스택이 반환된다.

위 동작 방식을 토대로 아래 테스트를 통과해야 한다.

```kotlin
class FunStackTest {  
    @Test  
	fun `push into the stack`() {  
	    val stack1 = FunStack<Char>()  
	    val stack2 = stack1.push('A')  
	  
	    expectThat(stack1.size()).isEqualTo(0)  
	    expectThat(stack2.size()).isEqualTo(1)  
	}  
	  
	@Test  
	fun `push and pop`() {  
	    val (q, stack) = FunStack<Char>().push('Q').pop()  
	  
	    expectThat(stack.size()).isEqualTo(0)  
	    expectThat(q).isEqualTo('Q')  
	}  
	  
	@Test  
	fun `push push pop`() {  
	    val (b, stack) = FunStack<Char>()  
	        .push('A')  
	        .push('B')  
	        .pop()  
	  
	    expectThat(stack.size()).isEqualTo(1)  
	    expectThat(b).isEqualTo('B')  
	} 
}
```

## FunStack 구현

위 테스트 코드에서 사용되는 `FunStack`을 구현하기 위해 여러 방식을 사용해봤다.

### 1차 구현

1차 구현은 이전에 공부를 하면서 `Stack`을 배열로 구현했던게 생각나서 배열 형태로 빠르게 만들어봤다. 빠르게 만드려고 작성한 코드다 보니, 조잡한 느낌이 남아있다.

```kotlin
data class FunStack<TYPE>(  
    private val elements: Array<Any?> = Array(1) { null },  
    private val index: Int = 0  
) {  
    fun size() = index

	fun push(value: TYPE): FunStack<TYPE> {  
        val nextSize = elements.size + 1  
        val nextElements = elements.copyOf(nextSize)  
  
        nextElements[index] = value  
  
        return FunStack(nextElements, index + 1)  
    }  
  
	@Suppress("UNCHECKED_CAST")  
    fun pop(): Pair<TYPE, FunStack<TYPE>> {  
        val nextIndex = index - 1  
        val v = elements[nextIndex]  
  
        val copy = elements.copyOf(elements.size - 1)  
  
        return (v as TYPE) to FunStack(copy, nextIndex)  
    }  
}
```

확실히 직접 모든 것을 구현하려다 보니 타입 안정성이나, 캐스팅에 관해서 불안한 요소가 많다.

### 2차 구현

2차 구현은 리스트를 사용해봤다. 내가 만든 불안전한 함수를 사용할 바에 완제품을 사용하는게 나을 것 같았다. 그 결과 배열을 사용한 것에 비해 훨씬 간결해졌다.

```kotlin
data class FunStack<TYPE>(  
    private val elements: List<TYPE> = emptyList()  
) {  
    fun size() = elements.size  
  
    fun push(value: TYPE) = FunStack(listOf(value) + elements)  
  
    fun pop() = elements.firstOrNull()?.let {  
        it to FunStack(elements.drop(1))  
    } ?: throw IllegalStateException("스택이 비어있습니다.")  
}
```

### 원본 코드

[원본 리포지토리](https://github.com/uberto/fotf/blob/main/exercises/src/main/kotlin/com/ubertob/fotf/exercises/chapter2/FunStack.kt)의 코드를 보면 다음과 같다.

```kotlin
data class FunStack<T>(private val elements: List<T> = emptyList()) {

    fun push(element: T) = FunStack(listOf(element) + elements)

    fun pop() = elements.first() to FunStack(elements.drop(1))

    fun size() = elements.size
}
```

## RPNTest

RPN(Reverse Polish Notation;역 폴란드 표기법) 계산기는 연산자가 피연산자 뒤에 오는 수학 표기법을 의미한다. 연산자를 두 피연산자의 중간에 배치하고, 우선 순위를 표기하기 위해 괄호 대신 피연산자 뒤에 연산자를 배치하는 형태이다.

위 정보를 갖고, `FunStack`을 활용하여, `RpnCalc.calc` 함수를 구현해보자.

```kotlin
class RPNTest {  
    @Test  
    fun `a simple sum`() {  
        expectThat(RpnCalc.calc("4 5 +")).isEqualTo(9.0)  
    }  
  
    @Test  
    fun `a double operation`() {  
        expectThat(RpnCalc.calc("3 2 1 - +")).isEqualTo(4.0)  
    }  
  
    @Test  
    fun `a division`() {  
        expectThat(RpnCalc.calc("6 2 /")).isEqualTo(3.0)  
    }  
  
    @Test  
    fun `a more complicated operation`() {  
        expectThat(RpnCalc.calc("6 2 1 + /")).isEqualTo(2.0)  
        expectThat(RpnCalc.calc("5 6 2 1 + / *")).isEqualTo(10.0)  
    }  
  
    @Test  
    fun `a bit of everything`() {  
        expectThat(RpnCalc.calc("2 5 * 4 + 3 2 * 1 + /")).isEqualTo(2.0)  
    }  
}
```

### 1차 구현

이 기능을 보고 가장 먼저 든 생각은 `fold`를 활용하는 것이다. 만약, `fold`에서 나온 값이 숫자가 아니라면, 연산자이기 때문에 현재까지 나온 값들에 대해서 처리하는 방식으로 구현했다.

```kotlin
object RpnCalc {  
    fun calc(expression: String): Double {  
        val result = StringTokenizer(expression)  
            .toList()  
            .fold(FunStack<Double>()) { acc, v ->  
                val funStack = "$v".toDoubleOrNull()?.let { d ->  
                    acc.push(d)  
                } ?: run {  
                    val (v1, stack1) = acc.pop()  
                    val (v2, stack2) = stack1.pop()  
                    val result = when(v) {  
                        "+" -> { v2 + v1 }  
                        "-" -> { v2 - v1 }  
                        "/" -> { v2 / v1 }  
                        "*" -> { v2 * v1 }  
                        else -> {
	                        throw IllegalArgumentException("Invalid Operation")  
                        }
                    }  
                    stack2.push(result)  
                }  
                funStack  
            }  
        return result.pop().first  
    }  
}
```

`fold`는 이름 그대로 접는다고 생각하면 된다. 현재 `List<String>`에서 하나의 값(v)을 꺼내면서, 초기값으로 지정한 `FunStack<Double>()`이 acc에 들어오게 되는 것이다.

테스트 1번인 `["4", "5", "+"]`를 기준으로 확인해보자.

1. 첫 번째 루프의 acc는 빈 스택이고, v는 4이다.
    - 4는 `double`로 타입 변환이 가능하기 때문에, `acc.push(d)`를 실행된다.
    - 4가 들어있는 `funStack`이 다음 acc로 넘어간다.
2. 두 번째 루프의 acc는 4가 담긴 스택이고, v는 5이다.
    - 5는 `double`로 타입 변환이 가능하기 때문에, `acc.push(d)`를 실행된다.
    - 5가 들어있는 `funStack`이 다음 acc로 넘어간다.
3. 세 번째 루프의 acc는 4, 5가 담긴 스택이고, v는 +이다.
    - +는 `double`로 타입 변환이 불가능하기 때문에 `run` 블록으로 넘어간다.
    - `acc`에서 `pop`을 통해 값인 `v1`과 값이 빠진 스택인 `stack1`을 받아준다.
    - `stack1`에서 또 `pop`을 해주고 값인 `v2`와 값이 빠진 스택 `stack2`를 받아준다.
    - v의 연산자를 확인해서, 값을 처리해준 다음, 최종 스택인 `stack2`에 값을 넣어준다.

모든 테스트를 돌려보면 정확히 동작하는 것을 볼 수 있다.

### 원본 코드

```kotlin
object RpnCalc {
    val operationsMap = mapOf<String, (Double, Double) -> Double>(
        "+" to Double::plus,
        "-" to Double::minus,
        "*" to Double::times,
        "/" to Double::div
    )

    val funStack = FunStack<Double>()

    fun calc(expr: String): Double = expr.split(" ")
		.fold(funStack, ::reduce)
		.pop().first


    private fun reduce(
	    stack: FunStack<Double>, 
	    token: String
	): FunStack<Double> = if (operationsMap.containsKey(token)) {
		val (b, tempStack) = stack.pop()
		val (a, newStack) = tempStack.pop()
		newStack.push(operation(token, a, b))
	} else {
		stack.push(token.toDouble())
	}

    private fun operation(
	    token: String, 
	    a: Double, 
	    b: Double
    ) = operationsMap[token]?.invoke(a, b) 
	    ?: error("Unknown operation $token")

}
```

## 정리

`FunStack`의 실제 정답 코드와 크게 다른 것이 없어서 다행이다. 오히려 처음에 배열로 구현하지 않고, 바로 리스트로 구현했다면, 더 쉬웠을 것 같은데 너무 복잡하게 생각한 것 같다.

`RpnCalc`의 경우 너무 차이가 큰 것 같다. 처음에는, `fold`와 `?: run` 등을 사용해서 내 코드도 나름 함수형이라고 생각했는데, 블록을 남발한다고 함수형이 아니라는 것을 알았다.

> 어떤 식(Expression)을 그와 동등한 값으로 바꿔도 프로그램의 행동(Behavior)이 변하지 않으면, 그 코드는 참조 투명(Referential Transparency)하며, 함수형이다.

위 내용은 **0장. 왜 함수형 프로그래밍인가** 나온 것인데 여기서 말하는 참조 투명이라는 것은, 순수 함수이며, 사이드 이펙트가 없고, 불변성을 유지하는 것을 의미한다고 한다.

`calc` 함수와 `reduce` 함수에서 사용된 `FunStack` **모든 연산(push/pop)이 새로운 스택을 반환**하기 때문에, 기존 상태를 변경 않고, operation 함수 또한, 사이드 이펙트가 없기 때문에, 함수형이라고 설명할 수 있다.