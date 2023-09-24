---
title: "[Item13] - clone 재정의는 주의해서 진행하라."
last_modified_at: 2023-09-17T21:00:37-21:30
categories: EFFECTIVE-JAVA
tags:
  - Effective Java
  - Java
  - Study
toc: true
toc_sticky: true
toc_label: "Effective Java"
toc_icon: "file"
---

Effective Java 3/E를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

간혹 우리는 기존 객체의 값을 그대로 가진 새로운 객체를 생성해 사용해야할 경우가 있다.

이럴 때, `clone()` 메소드를 이용하면 효율적으로 생성할 수 있지만,
해당 메소드는 `Object` 클래스 내부에 선언되어 있다.

```java
public class Object {
    @IntrinsicCandidate
    protected native Object clone() throws CloneNotSupportedException;
}
```

`@IntrinsicCandidate`란, 구현을 JVM 상에서 해주는 부분을 명시하는 어노테이션이다.
즉, JVM 종류에 따라 구현이 달라지게 되고, `native` 키워드도 있기 때문에 자바가 아닌 타언어로 구현된다는 것이다.

만약 이 `clone` 메소드를 리플렉션을 통해 접근할 경우 `IllegalAccessException` 에러가 발생한다.

```java
public class CloneTest {
    @Test
    void objectCloneTest() {
        try {
            Method objectCloneMethod = Object.class.getDeclaredMethod("clone");
            // objectCloneMethod.setAccessible(true);

            Object originalObject = new Object();
            Object cloneObject = objectCloneMethod.invoke(originalObject);
            long originHash = System.identityHashCode(originalObject);
            long cloneHash = System.identityHashCode(cloneObject);

            assertTrue(originHash == cloneHash);

        } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }
}
```

```bash
java.lang.IllegalAccessException: class ka.chapter3.item13.clone.CloneTest cannot access a member of class java.lang.Object (in module java.base) with modifiers "protected native"
```

에러 로그를 살펴보면, '`protected native`가 붙은 멤버에 액세스할 수 없다.'라고 나와있다.
즉, `Object` 클래스의 `clone` 메소드를 리플렉션을 통해 호출하려고 하면, `protected`라는 접근 제한이 있어 접근할 수 없다는 것이다.

이러한 문제점 때문에 `Cloneable` 방식이 널리 사용되고 있다.

## Cloneable

`Cloneable` 인터페이스를 살펴보면 아무 기능도 없다.

```java
public interface Cloneable {
}
```

하지만 `implements`를 하는 순간 IDE에서 **highlight** 처리를 해주면서 `clone()` 메소드를 구현하라고 한다.

```java
public class Member implements Cloneable {
    int id;
    String name;

    public Member(int id, String name) {
        this.id = id;
        this.name = name;
    }
}
```

해당 인터페이스의 javadoc을 살펴보면 아래와 같은 내용이 있다.

> 클래스는 Cloneable 인터페이스를 구현하여 Object.clone() 메서드에 해당 메서드가 해당 클래스의 인스턴스의 필드별 복사본을 만드는 것이 합법임을 나타냅니다.

즉, 합법적으로 `Object.clone()`을 호출할 수 있도록 하는 것이다.

**`Cloneable`을 구현한 클래스는 `clone` 메소드를 `public`으로 제공하며, 사용자는 복제가 제대로 이뤄지리라 기대한다.**
하지만 이 기대를 만족하기 위해서는 아래에서 소개할 규약을 잘 지켜야한다.

## 일반 규약

`clone` 메소드의 일반 규약은 허술하다. 아래 내용은 `Object` 명세에 작성된 내용이다.

> 복사의 정확한 뜻은, 그 객체를 구현한 클래스에 따라 다를 수 있다.
> 다음은 일반적인 의도이다.

```java
// True
x.clone() != x
// True
x.clone().getClass() == x.getClass()
// True -> 필수 아님
x.clone().equals(x)
```

- 관례상, `x.clone()` 메소드를 통해 반환하는 객체는 `super.clone()`을 호출해 얻어야 한다.
- 관례상, 반환된 객체와 원본 객체는 독립적이어야 한다.
  - 이를 만족하려면 `super.clone()`으로 얻은 객체의 필드 중 하나 이상을 반환 전에 수정해야할 수도 있다.

---

이와 같이 모호한 부분이 있어 강제성이 없다.

아래 코드와 같이 일반 생성자를 통해 반환해도 컴파일러는 이 규약을 지켰는지 알 수 없다는 것이다.

```java
public class Member implements Cloneable {
    int id;
    String name;

    public Member(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public Member clone() {
        return new Member(id, name);
    }
}
```

또한, 위와 같이 구현한 상태에서 하위 클래스를 만들었다고 가정하자.

```java
public class Character extends Member {
    String nickname;
    String job;

    public Character(String name, String job) {
        super(name);
        this.nickname = name;
        this.job = job;
    }
}
```

그리고, `Character`에서 `clone` 메소드를 호출하면 어떻게 될까?

```java
public class CloneTest {
    @Test
    void customCloneTest() {
        Character warrior = new Character("타락파워전사", "전사");
        Member clone = warrior.clone();
    }
}
```

위와 같이 하위 클래스에서 `clone` 메소드를 호출하면 잘못된 클래스의 객체가 만들어진다.
즉, 하위 클래스의 `clone` 메소드가 제대로 동작하지 않게 되는 것이다.

## 규약에 따른 올바른 방법

`clone` 메소드가 올바르게 동작하게 하려면, `Cloneable`을 구현해야한다.
이후, `super.clone`을 통해 `Object` 객체로 반환하면 된다.

```java
public class Member implements Cloneable {
    @Override
    public Member clone() {
        try {
            return (Member) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

자바가 공변 반환 타이핑(covariant return typing)을 지원하니 `Member`로 반환하는 것이 가능하고, 권장하는 방식이다.

> 공변 반환 타이핑이란, 상위 클래스에 정위된 메소드를 하위 클래스에서 오버라이딩할 때,
> 상위 클래스에 정의된 반환 타입을 하위 클래스의 타입으로 변경할 수 있는 것.

여기서 `super.clone`을 `try-catch` 블록으로 감싼 이유는, `Object`의 `clone` 메소드가 검사 예외를 던지기 때문이다.

```java
public class Object {
    @IntrinsicCandidate
    protected native Object clone() throws CloneNotSupportedException;
}
```

사실 우리는 `Cloneable`을 구현했기 때문에 `super.clone`이 무조건 성공할 것임을 안다.
즉, 해당 예외는 비검사 예외(필요없는 검사 예외)였어야 했다는 것이다.

### 배열이 포함된 클래스 복제

메모리 누수를 공부할 때 사용한 `Stack` 클래스를 예시로 확인해보자.

```java
public class Stack {
    private Object[] elements;
    private int size = 0;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public Stack() {
        this.elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
        ensureCapacity();
        elements[size++] = e;
    }

    public Object pop() {
        if(size == 0) throw new EmptyStackException();
        Object result = elements[--size];
        elements[size] = null;
        return result;
    }

    private void ensureCapacity() {
        if (elements.length == size) {
            elements = Arrays.copyOf(elements, 2 * size + 1);
        }
    }
}
```

위 클래스를 그대로 복제한다면, 복제된 객체가 원본 객체의 `elements`를 그대로 참조할 것이다.
즉, 복제된 객체에서 값을 넣으면 원본 객체에 영향을 준다는 것이다.

아래 테스트를 통해 확인해보자.

```java
public class Stack { 
    @Override 
    protected Stack clone() {
        try {
            return (Stack) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

```java
public class StackTest {
    @Test
    void stackCloneTest() {
        Stack originalStack = new Stack();
        originalStack.push(20);
        originalStack.push(30);
        originalStack.push(40);

        Stack cloneStack = originalStack.clone();
        cloneStack.pop();

        // 테스트 실패! NPE 발생
        assertTrue((Integer) originalStack.pop() == 40);
    }
}
```

여기서 NPE가 뜨는 이유는 바로 `size` 때문이다.

`originalStack`에 총 3개의 데이터를 넣었기 때문에 `size`의 값은 3이다.
하지만, 이에 대한 복제본인 `cloneStack`이 생겼고, `pop()`을 진행했다.

위 상황에서 `cloneStack`이 갖고 있는 배열은 `originalStack.elements` 배열을 참조하기 때문에 원본 스택의 값도 하나 없어진 것과 마찬가지다.
즉, 원본 스택 배열의 값이 하나 빠졌기 때문에 `size`가 2여야하는데, 현재 3이라는 수를 갖고 있기 때문에 NPE가 발생한 것이다.

이는 elements 배열의 clone을 재귀적으로 호출하는 방식으로 간단하게 해결이 가능하다.

```java
public class Stack {
    @Override
    protected Stack clone() {
        try {
            Stack cloned = (Stack) super.clone();
            cloned.elements = elements.clone();
            return cloned;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

배열을 복제할 때는, `clone` 메소드를 사용하는 것을 권장한다.

### 해시 테이블용 클래스 복제

해시 테이블 내부는 버킷들의 배열이고, 각 버킷은 K-V 쌍을 담는 연결 리스트의 첫 번째 엔트리를 참조한다.

```java
public class HashTable implements Cloneable {
    private Entry[] buckets;
    private int size;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;

    public HashTable() {
        buckets = new Entry[DEFAULT_INITIAL_CAPACITY];
        size = 0;
    }

    private static class Entry {
        final Object key;
        Object value;
        Entry next;

        public Entry(Object key, Object value, Entry next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    public Object get(int idx) {
        return buckets[idx].value;
    }

    @Override
    public HashTable clone() {
        try {
            HashTable result = (HashTable) super.clone();
            result.buckets = buckets.clone();
            return result;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

위 코드를 보면 복제본은 자신만의 버킷 배열을 갖지만, 이 배열은 원본과 같은 연결 리스트(Entry)를 참조한다.
즉, 원본과 복제본 모두 예기치 않게 동작하게 된다.

테스트에 필요한 기능은 아래와 같이 간단하게 구현했다.

```java
public class HashTable implements Cloneable {

    public Object get(int idx) {
        return buckets[idx].value;
    }

    public void put(Object key, Object value) {
        boolean flag = false;
        for (Entry bucket : buckets) {
            if (bucket != null && bucket.key == key) {
                bucket.value = value;
                flag = true;
            }
        }
        if (!flag) {
            buckets[size++] = new Entry(key, value, null);
        }
    }
}
```

```java
public class HashTableTest {
    @Test
    void hashTestCloneTest() {
        HashTable original = new HashTable();
        original.put(1, "Effective");
        original.put(2, "Java");

        HashTable clone = original.clone();
        clone.put(2, "Kotlin");
        
        // 테스트 실패! Kotlin 출력
        assertTrue(original.get(1).equals("Java"));
    }
}
```

이와 같이 배열은 새로 복사했어도, 그 안에 있는 `Entry`는 `original`과 동일한 참조를 가지게 된다.
이를 해결하기 위해서는 각 버킷을 구성하는 연결 리스트를 복사해야한다.

```java
package ka.chapter3.item13.hash;

public class HashTable implements Cloneable {
    private static class Entry {
        final Object key;
        Object value;
        Entry next;

        public Entry(Object key, Object value, Entry next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }

        Entry deepCopy() {
            return new Entry(key, value,
                    next == null ? null : next.deepCopy());
        }
    }
    
    @Override
    public HashTable clone() {
        try {
            HashTable result = (HashTable) super.clone();
            // 아예 새로운 배열 생성
            result.buckets = new Entry[buckets.length];
            
            // 기존 값들의 새로운 참조를 만들도록 deepCopy 진행
            for (int i = 0; i < buckets.length; i++) {
                if (buckets[i] != null) {
                    result.buckets[i] = buckets[i].deepCopy();
                }
            }
            return result;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

`Entry`의 `deepCopy` 메소드는 자신이 가리키는 연결 리스트 전체를 복사하기 위해, 자신을 재귀적으로 호출한다.

하지만 버킷이 길 때, 이런 방식을 사용하면 `StackOverFlow`가 발생할 수 있다.
때문에, 재귀 호출 대신 반복자를 써서 순회하는 방향으로 사용하는 것이 좋다.

```java
Entry deepCopy() {
    Entry result = new Entry(key, value, next);
    for (Entry p = result; p.next != null; p = p.next) {
        p.next = new Entry(p.next.key, p.next.value, p.next.next);
    }
    return result;
}
```

즉, 순서로 정리하면 아래와 같다.

1. `super.clone`을 호출하여 얻은 객체의 모든 필드를 초기 상태로 설정
2. 원본 객체의 상태를 다시 생성하는 고수준 메소드들을 호출

이처럼 고수준 API를 활용해 복제하면 보통은 간단하고, 제법 우아한 코드를 얻게 되지만, 아무래도 저수준에서 바로 처리할 때보다는 현저히 느리다.

또한, `Cloneable` 아키텍처의 기초가 되는 필드 단위 객체 복사를 우회하기 때문에 전체 `Cloneable` 아키텍처와는 어울리지 않는 방식이기도 하다.

### 상속 클래스 복제

상속용 클래스는 `Cloneable`을 구현해서는 안 된다.

제대로 작동하는 `clone` 메소드를 구현해, `protected`로 두고, `CloneNotSupportedException`을 던질 수 있다고 선언하는 것이다.

```java
public class Member implements Cloneable {
    String name;

    public Member(String name) {
        this.name = name;
    }
    
    protected Member clone() throws CloneNotSupportedException {
        return new Member(name);
    }
}
```

```java
public class Character extends Member implements Cloneable {
    @Override
    public Character clone() {
        try {
            Character clone = (Character) super.clone();
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
```

`Character` 클래스에서 `super.clone()`을 호출하면, `Member` 클래스에서 오버라이드한 `clone()` 메서드가 아니라, `Object` 클래스의 `clone()` 메서드가 호출되는 것이다.

즉, `Character` 클래스가 `Member` 클래스를 상속받고 있더라도, `Cloneable`을 구현했기 때문에 `clone()` 메서드는 상속 구조와 무관하게 `Object` 클래스의 `clone()` 메서드를 사용하는 것이다.

또 다른 방법으로는 `clone`을 동작하지 않게 구현해놓고, 하위 클래스에서 재정의하지 못하게 퇴화시켜놓으면 된다.

```java
protected final Object clone() throws CloneNotSupportedException {
    throw new CloneNotSupportedException();
}
```

### Thread-Safe 클래스 복제

`Object`의 `clone` 메소드는 동기화를 전혀 신경 쓰지 않았다.
그러니 `super.clone` 호출 외에는 다른 할일이 없더라도 `clone`을 재정의하고, 동기화 해줘야한다.

이는 단순히 `clone` 메소드에 `synchronized` 키워드를 사용해 멀티 스레드 환경에서도 정상적으로 동작하도록 하면 된다.

## 요약

- `Cloneable`을 구현한 모든 클래스는 `clone`을 재정의해야 한다.
- 접근 제한자는 `public`, 반환 타입은 클래스 자신으로 변경한다.
- `super.clone`을 호출한 후, 필요한 필드를 전부 적절히 수정한다.
- 앞에서 본 예시와 같이 원본의 참조를 그대로 사용하는 것이 아닌, 복제본의 참조로 변경하자.
- 내부 복사를 재귀적으로 호출하는 것이 항상 최선은 아니다.
- 기본 타입 필드와 불변 객체 참조만 갖는 클래스라면 수정할 필요가 없다.
- 일련변호, 고유 ID는 비록 기본 타입이나 불변일지라도, 수정해줘야 한다.
  - 값이 같을 경우 예기치 않은 결과를 초래할 수 있기 때문이다.

이 모든 작업이 꼭 필요한 경우는 극히 드물다.

`Cloneable`을 이미 구현한 클래스를 확장한다면, 어쩔 수 없이 `clone`을 잘 작동하도록 구현해야 한다.
그렇지 않은 상황에서는 간단한 방식으로 사용할 수 있다.

```java
// 복사 생성자
public Yum(Yum yum) {
    ...
}
```

```java
// 복사 팩터리
public static Yum newInstance(Yum yum) {
    ...    
}
```

복사 생성자와 그 변형인 복사 팩터리는 `Cloneable/clone` 방식보다 나은 면이 많다.

- 언어 모순적이고, 위험천만한 객체 생성 메커니즘(생성자를 쓰지 않는 방식)을 사용하지 않는다.
- 엉성하게 문서화된 규약에 기대지 않고, 정상적인 final 필드 용법과도 충돌하지 않는다.
- 불필요한 검사 예외를 던지지 않는다.
- 형변환도 필요치 않다.

## 정리

- 새로운 인터페이스를 만들 때는 절대 `Cloneable`을 확장하지 말자.
- final 클래스라면 `Cloneable`을 구현해도 위험이 크지 않다.
  - 성능 최적화 관점에서 검토한 후 문제가 없을 경우 드물게 허용하자.
- 복제 기능은 생성자와 팩터리를 이용하는게 최고다.
- 단, 배열만은 `clone` 메소드 방식이 가장 깔끔하고, 이 규칙의 합당한 예외라 할 수 있다.