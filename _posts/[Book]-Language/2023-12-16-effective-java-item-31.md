---
title: "[Item31] - 한정적 와일드카드를 사용해 API 유연성을 높이라."
last_modified_at: 2023-12-16T21:00:37-21:30
categories: "[Book]-Language"
tags:
  - Effective Java 3/E
  - Java
toc: true
toc_sticky: true
toc_label: "Effective Java"
toc_icon: "file"
---

Effective Java 3/E를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 상위 타입과 하위 타입의 호환

매개변수화 타입은 불공변(invariant)이다. 서로 다른 `Type1`, `Type2`가 있다고 가정해보자. `List<Type1>`은 `List<Type2>`의 하위 타입도, 상위 타입도 아니다.
이 말은 즉, `List<Stirng>`은 `List<Object>`의 하위 타입이 아니라는 뜻과 동일한 것이다.

```java
public class ListTest {
    @Test
    void listTest() {
        List<Object> objList = new ArrayList<>();
        List<String> strList = new ArrayList<>();

        objList.add(strList);
    }
}
```

위 코드를 보면 `objList`는 어떤 객체든 넣을 수 있지만, `List<String>`에는 문자열만 넣을 수 있다.
즉, `List<String>`은 `objList`가 하는 일을 제대로 수행하지 못하니 하위 타입이 될 수 없으며, 이는 리스코프 치환 원칙에 어긋난다.

> 리스코프 치환 원칙(Liskov substiution principle)이란, 어떤 타입에 있어 중요한 속성이라면 그 하위 타입에서도 마찬가지로 중요하다.
> 따라서 그 타입의 모든 메소드가 하위 타입에서도 똑같이 잘 작동해야 한다.
> **서브 타입은 언제나 기반 타입으로 교체할 수 있어야 한다.**

## 한정적 와일드카드 타입

아이템29에서 구현한 `Stack` 클래스에 일련의 원소를 스택에 넣는 메소드를 추가한다고 가정해보자.

```java
public void pushAll(Iterable<E> src) {
    for (E e : src) {
        push(e);
    }
}
```

위 코드는 컴파일에 문제는 없지만, 완벽하지는 않다. `src`의 원소 타입이 스택의 원소 타입과 일치하면 잘 작동한다. 만약 `Stack<Number>`로 선언한 후, 위 메소드를 선언하면 어떻게 될까?

```java
@Test
void stackTest() {
    Stack<Number> numberStack = new Stack<>();
    Iterable<Integer> integers = List.of(1, 2, 3, 4);
    // 컴파일 에러 발생
    numberStack.pushAll(integers);
}
```

```bash
Iterable<Integer> cannot be converted to Iterable<Number>
```

```java
public final class Integer extends Number implements ...
```

`Integer` 클래스 내부를 보면 `Number`를 상속 받고 있는데, 에러가 발생하는 이유는 매개변수화 타입이 불공변이기 때문이다.
즉, 불공변이라는 것은 서로 다른 매개변수화 타입 간의 서브타입 관계가 유지되지 않는다는 것이다.

이를 해결하기 위해서는 아래와 같이 코드를 변경하면 된다.

```java
@Test
void stackTest() {
    Stack<Number> numberStack = new Stack<>();
    Iterable<Integer> integers = List.of(1, 2, 3, 4);
    numberStack.pushAll(integers);
}
```

```java
// Stack<Number>
public void pushAll(Iterable<? extends E> src) {
    for (E e : src) {
        push(e);
    }
}
```

코드의 흐름을 보자면, `pushAll(integers)`를 통해 `Iterable<?>`의 와일드카드에 `Integer`를 넘겨주었고,
`Stack<E>`의 제네릭에는 이미 `Integer`가 들어가있기 때문에 `<? extends E>`라는 코드는 `Integer extends Number`로 바뀌어 에러가 발생하지 않게 되는 것이다.

이번에는 `pushAll`과 짝을 이루는 `popAll`을 통해 살펴보자.

```java
// Stack 클래스
public boolean isEmpty() {
    return size == 0;
}

public void popAll(Collection<E> dst) {
    while (!isEmpty()) {
        dst.add(pop());
    }
}
```

```java
@Test
void stackPopAllTest() {
    Stack<Number> numberStack = new Stack<>();
    Collection<Object> objects = List.of(1, 2, 3, 4, 5);
    // 컴파일 에러 발생
    numberStack.popAll(objects);
}
```

```bash
incompatible types: Collection<Object> cannot be converted to Collection<Number>
```

이번에도 앞서 봤던 에러와 비슷하게 발생한다.
하지만, 이번에는 `Object`가 `Number`를 상속 받는 것이 아닌, `Number`의 상위 타입이 `Object`이므로 다음과 같이 수정해야 한다.

```java
public void popAll(Collection<? super E> dst) {
    while (!isEmpty()) {
        dst.add(pop());
    }
}
```

> 유연성을 극대화하려면 원소의 생산자나 소비자용 입력 매개변수에 와일드카드 타입을 사용하라.

### PECS 공식

입력 매개변수가 생산자와 소비자 역할을 동시에 한다면 와일드카드 타입을 써도 좋을게 없다.
아래 공식을 외워두면 어떤 와일드카드 타입을 써야하는지 기억하는 데 도움이 될 수 있다.

> PECS 공식은 와일드 카드 타입을 사용하는 기본 원칙이다.
> 나프탈린(Naftalin)과 와들러(Wadler)는 이를 겟풋 원칙(Get and Put Principle)으로 부른다.
> 펙스(PECS) : Producer-extends / Consumer-super

즉, 매개변수화 타입 `T`가 생산자라면, `<? extends T>`를 사용하고, 소비자라면 `<? super T>`를 사용하면 된다.
`pushAll()`의 매개변수인 `src`는 `Stack`이 사용할 `E` 인스턴스를 생산하므로 생산자 규칙을 적용하고,
`popAll()`의 매개변수인 `dst`는 `Stack`이 사용할 `E` 인스턴스를 소비하므로 소비자 규칙을 적용하면 된다.

#### PE 규칙

위 공식을 토대로 아이템28에서 생성한 `Choose` 클래스를 다시 살펴보자

```java
public class Chooser<T> {
    private final List<T> choiceList;

    public Chooser(Collection<T> choices) {
        choiceList = new ArrayList<>(choices);
    }

    public T choose() {
        Random rnd = ThreadLocalRandom.current();
        return choiceList.get(rnd.nextInt(choiceList.size()));
    }
}
```

위 코드를 보면 생성자로 넘겨지는 `choices` 컬렉션은 `T` 타입의 값을 **생산**하기만 하니까 다음과 같이 수정할 수 있다.

```java
public Chooser(Collection<? extends T> choices) {
    choiceList = new ArrayList<>(choices);
}
```

```java
@Test
void chooseGenericTest() {
    List<Integer> list = new ArrayList<>();
    ChooserGeneric<Number> cg = new ChooserGeneric<>(list);
}
```

수정 전 코드로는 컴파일 되지 않지만, 위와 같이 수정을 하고 나면 문제가 사라지게 된다.

이번에는 **아이템30**에서 작성한 `Union` 메소드를 확인해보자.

```java
public static <E> Set<E> union2(Set<E> s1, Set<E> s2) {
    Set<E> result = new HashSet<>(s1);
    result.addAll(s2);
    return result;
}
```

`s1`, `s2`는 주어진 `E` 인스턴스에 대한 생산자이니 다음과 같이 수정할 수 있다.

```java
public static <E> Set<E> union2(Set<? extends E> s1, Set<? extends E> s2)
```

> 매개변수에는 PECS 공식을 적용해야하지만, 반환 타입에는 한정적 와일드카드 타입을 사용하면 안 된다.
> 만약, 반환 타입에도 적용하게 될 경우 영향력이 클라이언트 코드까지 퍼지기 때문에 유연성이 떨어지게 된다.

```java
@Test
void union2Test() {
    Set<Integer> integers = Set.of(1, 3, 5);
    Set<Double> doubles = Set.of(2.0, 4.0, 6.0);
    Set<Number> numbers = union2(integers, doubles);

    System.out.println(numbers);
}
```

위와 같이 코드를 작성하면 컴파일 에러 없이 잘 동작하는 것을 확인할 수 있다.
이렇게 제대로만 사용한다면 클래스 사용자는 와일드카드 타입이 쓰였다는 사실조차 의식하지 못할 것이다.
**클래스 사용자가 와일드카드 타입을 신경 써야 한다면, 그 API에 무슨 문제가 있을 가능성이 크다.**

#### PE, CS 규칙 모두 적용

이번에는 **아이템30**에서 작성한 `max` 함수를 수정해보자.

```java
// Collection에서 List로 변경
public static <E extends Comparable<E>> E max(List<E> c) {
    if(c.isEmpty()) throw new IllegalArgumentException("빈 컬렉션");

    E result = null;
    for (E e : c) {
        if (result == null || e.compareTo(result) > 0) {
            result = Objects.requireNonNull(e);
        }
    }
    
    return result;
}
```

여기서 적용할 수 있는 PECS 규칙은 `Comparable`과 `List`에 대한 제네릭 부분이다.
우선 `c`부터 보자면, `E`에 대한 인스턴스를 생산하는데에만 사용하기 때문에 `PE` 규칙을 적용할 수 있고,
`Comparable`은 주어진 `E`에 대한 인스턴스를 소비해 정렬하는데에 목적을 두므로, `CS` 규칙을 적용할 수 있다.

```java
public static <E extends Comparable<? super E>> E max(List<? extends E> c)
```

복잡한 코드이지만, 이와 같이 코드를 작성할 경우 굉장한 유연성을 체험할 수 있게 된다.

### 타입 매개변수와 와일드카드 구분

타입 매개변수와 와일드카드에는 공통되는 부분이 있어서, 메소드를 정의할 때, 둘 중 어느 것을 사용해도 괜찮을 때가 많다.

```java
// 방식1
public static <E> void swap(List<E> list, int i, int j);
// 방식2
public static void swap(List<?> list, int i, int j);
```

위 두 코드는 동일하게 `List`의 타입을 받을 수 있는 코드지만, 사용할 수 있는 범위는 크게 달라진다.

```java
// 방식1 : 컴파일 성공
public static <E> void swap1(List<E> list, int i, int j) {
    list.set(i, list.set(j, list.get(i)));
}
// 방식2 : 컴파일 에러 발생 : incompatible types: Object cannot be converted to capture#1 of ?
public static void swap2(List<?> list, int i, int j) {
    list.set(i, list.set(j, list.get(i)));
}
```

에러의 원인은 `List<?>`에는 `null` 외에는 어떤 값도 넣을 수 없어 발생하는 것이다.
이를 해결하기 위해서는 다음과 같이 `private` 도우미 메소드로 따로 작성하여 활용하는 것이다.

```java
public static void swap(List<?> list, int i, int j) {
    swapHelper(list, i, j);
}

private static <E> void swapHelper(List<E> list, int i, int j) {
    list.set(i, list.set(j, list.get(i)));
}
```

`swapHelper` 코드를 보면 알겠지만, 기존 방식1 코드를 그대로 사용한 것과 다름이 없다.
이게 가능한 이유는, `?`로 받았더라도, `E`를 통해 실제 타입으로 바꿔주기 때문이다.
즉, `swapHelper`는 주어진 `list`가 `List<E>`임을 알고 있다는 것이다.

## 정리

- 조금 복잡하더라도 와일드카드 타입을 적용하면 API가 훨씬 유연해진다.
- 널리 쓰일 라이브러리를 작성하다면, 반드시 와일드카드 타입을 적절히 사용해줘야 한다.
- PECS 공식을 기억하자.
  - 생산자(producer)는 extends
  - 소비자(consumer)는 super
  - Comparable, Comparator는 생산자처럼 보일지라도, 모두 소비자이다.
