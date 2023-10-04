---
title: "[Item15] - 클래스와 멤버의 접근 권한을 최소화하라."
last_modified_at: 2023-09-24T21:00:37-21:30
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

잘 설계된 컴포넌트란, 클래스 내부 데이터와 구현 정보를 외부로부터 얼마나 잘 숨겼느냐로 따질 수 있다.
이렇게 모든 내부 구현을 완벽히 숨겨, 구현과 API를 깔끔하게 분리하는 것을 정보 은닉, 혹은 캡슐화라고 부른다.

## 정보 은닉

정보 은닉은 시스템을 구성하는 컴포넌트들을 서로 독립시켜서 개발, 테스트, 최적화, 적용, 분석, 수정을 개별적으로 할 수 있게 해주는 것과 연관이 있다.

### 정보 은닉의 장점

1. 시스템 개발 속도를 높인다.
    - 여러 컴포넌트를 병렬로 개발할 수 있다.
2. 시스템 관리 비용을 낮춘다.
    - 각 컴포넌트를 더 빨리 파악하여 디버깅할 수 있다.
    - 다른 컴포넌트로 교체하는 부담이 적다.
3. 정보 은닉 자체가 성능을 높여주진 않지만, 성능 최적화에 도움을 준다.
    - 완성된 시스템을 프로파일링해 최적화할 컴포넌트를 정한 다음 다른 컴포넌트에 영향을 주지 않고, 해당 컴포넌트만 최적화할 수 있다.
4. 소프트웨어 재사용성을 높인다.
    - 외부에 거의 의존하지 않고, 독자적으로 동작할 수 있는 컴포넌트라면 그 컴포넌트와 함께 개발되지 않은 낯선 환경에서도 유용하게 쓰일 가능성이 크다.
5. 큰 시스템을 제작하는 난이도를 낮춘다.
    - 시스템 전체가 아직 완성되지 않은 상태에서도 개별 컴포넌트의 동작을 검증할 수 있다.

### 기본 원칙

> 모든 클래스와 멤버의 접근성을 가능한 한 좁혀야 한다.

#### 탑레벨 클래스의 접근 수준

가장 바깥인 톱레벨 클래스와 인터페이스에 부여할 수 있는 접근 수준은 `package-private`와 `public` 두 가지가 있다.
만약 톱레벨 클래스나 인터페이스를 `public`으로 둔다면 공개 API가 되며, `package-private`로 선언할 경우 해당 패키지 안에서만 이용할 수 있다.

즉, 패키지 외부에서 쓸 이유가 없다면 `package-private`로 선언하는 것이 좋다. 그러면 이들은 API가 아닌 내부 구현으로 처리가 되어 클라이언트로부터 큰 제약 없이 언제든 편하게 수정할 수 있다.
반면 `public`으로 선언할 경우 API가 되므로 하위 호환을 위해 영원히 관리해줘야한다.

**package-private**

테스트 클래스의 경우 외부에서 사용하는 경우가 드물다. 만약 사용한다 하더라도, 같은 패키지에 있는 클래스에서 접근하는 것 말고는 쓰임이 없다. 이러한 경우 `package-private`로 선언하는 것이 좋다.

```java
@WebMvcTest(MenuRestController.class)
@MockBean(JpaMetamodelMappingContext.class)
class MenuRestControllerTest {
    ...
    @Test
    @DisplayName("메뉴 저장 컨트롤러 로직 확인 테스트")
    void postMenuTest() throws Exception {
       ...
    }
}
```

**public**

Dto와 같은 경우 외부에서 접근해야하는 요소가 많다. `Controller` 측에서 사용하기도 하며, `Service`, `Repository` 등에서 접근하기도 한다. 때문에 이러한 클래스는 `public`으로 두고, 공개 API로 사용하는 것이 바람직하다.

```java
@Getter @Setter
public class MenuDto {
   private Long id;
   private String menuName;
}
```

#### 한 클래스에서만 사용하는 클래스

한 클래스 내부에서만 사용하는 클래스는 `private static`으로 중첩시키는 것이 좋다.

`LinkedList`와 같은 클래스를 확인해보면, 우리가 직접 `Node`라는 클래스에 접근하지 않아도, `add()`, `remove()`와 같은 메소드를 통해서 `Node`를 동작하게 한다.
한 클래스만을 위해 필요한 클래스를 톱레벨로 둘 경우, 같은 패키지에서 모두 접근할 수 있게 되므로, 클래스 내부에 중첩시키는 것이 좋다.

```java
public class LinkedList<E> ... {
    
   ...

   private static class Node<E> {
      E item;
      Node<E> next;
      Node<E> prev;

      Node(Node<E> prev, E element, Node<E> next) {
         this.item = element;
         this.next = next;
         this.prev = prev;
      }
   }
    
}
```

#### 멤버 필드의 접근 수준

멤버에 부여할 수 있는 접근 수준은 네 가지이다.

- private
    - 멤버를 선언한 톱레벨 클래스에서만 접근 가능
- package-private
    - 멤버가 소속된 패키지 안의 모든 클래스에서 접근 가능
    - 접근 제한자를 명시하지 않았을 때, 적용되는 패키지 접근 수준임
    - 인터페이스의 멤버는 기본적으로 public이 적용된다.
- protected
    - 이 멤버를 선언한 클래스의 하위 클래스에서도 접근 가능
    - package-private의 접근 범위를 포함한다.
- public
    - 모든 곳에서 접근할 수 있다.


클래스의 공개 API를 세심히 설계한 후, 그 외의 모든 멤버는 `private`로 만들자.

아래와 같이 x, y 좌표에 대해 저장하는 `package-private` 타입의 `Node` 클래스가 있다고 가정하자.

```java
package ka.chapter3.item15.search;

class Node {
    private int x;
    private int y;
}
```

해당 클래스는 DFS, BFS와 같이 현재 지도의 좌표를 저장하는 알고리즘에서 사용될 수 있다.

```java
package ka.chapter3.item15.search;

public class DepthFirstSearch {
    public void stackDfs(int y, int x) {
        Stack<Node> stack = new Stack<>();
        stack.push(new Node(x, y));

        while (!stack.isEmpty()) {
            Node cur = stack.pop();

            visited[cur.y][cur.x] = true;

            for (int i = 0; i < maxDir; i++) {
                int nx = cur.x + dx[i];
                int ny = cur.y + dy[i];

                if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                    if (!visited[ny][nx] && map[ny][nx] == 1) {
                        stack.push(new Node(nx, ny));
                    }
                }
            }
        }
    }
}
```

```java
package ka.chapter3.item15.search;

public class BreadthFirstSearch {
    public void queueBfs(int y, int x) {
        Queue<Node> queue = new LinkedList<>();
        queue.offer(new Node(x, y));

        while (!queue.isEmpty()) {
            Node cur = queue.poll();

            visited[cur.y][cur.x] = true;

            for (int i = 0; i < maxDir; i++) {
                int nx = cur.x + dx[i];
                int ny = cur.y + dy[i];

                if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                    if (!visited[ny][nx] && map[ny][nx] == 1) {
                        queue.offer(new Node(nx, ny));
                    }
                }
            }
        }
    }
}
```

이러한 알고리즘이 한 패키지에 정의되어있을 경우, 알고리즘 클래스에서 `node.getX()`로 접근하는 것보단, `node.x`로 접근할 수 있도록 하는 것이 편리할 것이다.
이렇게 같은 패키지의 다른 클래스가 접근해야 하는 멤버에 한하여 (private 제한자를 제거해) `package-private`로 풀어주자.

권한을 풀어주는 일을 자주하게 된다면, 여러분의 시스템에서 컴포넌트를 더 분해해야하는 것은 아닌지 다시 고민해보자.
`private`와 `package-private` 멤버는 모두 해당 클래스의 구현에 해당하므로, 공개 API에 영향을 주지 않는다.

단, `Serializable`을 구현한 클래스에서는 그 필드들도 의도치 않게 공개 API가 될 수 있다.
만약 직렬화 과정에서도 값이 공개되는 것을 원하지 않는다면, 해당 필드에 `transient` 키워드를 추가해주자.

```java
public class Node implements Serializable {
    transient int x;
    transient int y;
}
```

```java
public class SerializableTest {
    @Test
    void serializeTest() {
        // 직렬화할 파일 경로
        String filePath = "src/main/java/ka/chapter3/item15/search/node.ser";

        // 객체 생성
        Node original = new Node(2, 1);
        System.out.println("Original Node = " + original);

        // 객체를 파일에 직렬화
        serializeToFile(original, filePath);

        // 파일로부터 객체 역직렬화
        Node deserialized = deserializeFromFile(filePath);

        // 역직렬화된 객체 사용
        System.out.println("Deserialized Node = " + deserialized);

        // 테스트 실패!
        assertTrue(original.x == deserialized.x);
    }
}
```

```bash
Original Node = Node{x=2, y=1}
Deserialized Node = Node{x=0, y=0}
```

이와 같이 `transient` 키워드를 추가할 경우 직렬화하는 대상에서 제외된다.

### 주의 사항

#### 멤버 접근성의 방해 제약

위에서 살펴본 내용과 다르게, 멤버 접근성을 좁히지 못하게 방해하는 제약이 하나 있다.

> 상위 클래스의 메소드를 재정의할 때는 그 접근 수준을 상위 클래스에서보다 좁게 설정할 수 없다

아래와 같이 자식이 부모 클래스를 상속 받은 형태의 클래스가 존재한다.

```java
public class ParentClass {
    public void print() {
        System.out.println("Parent");
    }
}
```

```java
public class ChildClass extends ParentClass {
    @Override public void print() {
        System.out.println("Child");
    }
}
```

```java
public class LspTest {
    @Test
    void castingTest() {
        ParentClass p = new ChildClass();
        // Child 출력
        p.print();
    }
}
```

이처럼 상위 클래스의 인스턴스는 하위 클래스의 인스턴스로 대체해서 사용할 수 있어야하는 규칙을 **리스코프 치환 원칙(LSP)**이라고 한다.
만약 이 규칙을 어기면 하위 클래스를 컴파일할 때, 컴파일 오류가 난다.

즉, 클래스를 대체할 수 있어야하기 때문에 부모로부터 받은 필드의 접근 제어자가 동일해야한다는 것이다.

#### 테스트 클래스

아래와 같이 굉장히 중요하고 민감한 정보가 들은 테스트가 실제 개발 패키지와 동일한 레벨에 있다고 가정하자.

```java
package ka.chapter3.item15.com.project;

public class MostImportantTest {
    public String veryVeryImportantAndSensitiveInfo = "hello world";
    @Test
    void importantTest() {
        System.out.println(veryVeryImportantAndSensitiveInfo);
    }
}
```

이럴경우 아래와 같이 접근이 가능해져 버린다.

```java
public class Controller {
    public static void main(String[] args) {
        MostImportantTest mit = new MostImportantTest();
        String str = mit.veryVeryImportantInfo;
        System.out.println(str);
    }
}
```

![test-package](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/8c7be928-dea9-4906-9e89-024b3a1ca27a)

즉, 테스트 클래스가 다른 요소에 접근이 가능해지면서 공개 API가 되어버리는 것이다.

이와 같이 테스트만을 위한 클래스, 인터페이스, 멤버를 공개 API로 만드는 것은 위험한 일이기 때문에 실제 개발과 테스트에 대한 패키지는 가능한 멀리 떨어뜨려 놓는것이 좋다.
예를 들어 Spring 같은 경우에는 아래 사진처럼 뿌리부터 아예 다른 패키지로 되어있다.

![spring-package](https://github.com/Back-Mo/java-spring-api-study/assets/82663161/449329f7-14a5-4a9a-9a06-89a8e6468837)

#### public 클래스의 인스턴스 필드

> `public` 클래스의 인스턴스 필드는 되도록 `public`이 아니어야 한다.

필드가 가변 객체를 참조하거나, `final`이 아닌 인스턴스 필드를 `public`으로 선언하면, 그 필드에 담을 수 있는 값을 제한할 힘을 잃게 된다.

`item1`에서 공부했던 `singleton` 클래스가 이에 해당된다.

```java
public class Singleton {
    private static Singleton s = new Singleton();
    public int instanceId = 1;

    private Singleton() {

    }

    public static Singleton getInstance() {
        return s;
    }
}
```

```java
public class SingletonTest {
    @Test
    void firstSingletonTest() {
        Singleton s = Singleton.getInstance();
        // 테스트 성공!
        assertTrue(s.instanceId == 1);

        s.instanceId = 10;

    }

    @Test
    void secondSingletonTest() {
        Singleton s = Singleton.getInstance();
        // 테스트 실패!
        assertTrue(s.instanceId == 1);
    }
}
```

이와 같이 싱글톤 객체가 `final`이 아니라면, 필드에 담을 수 있는 값을 제한할 수 없게된다.
또한, `public` 가변 필드를 갖는 클래스는 일반적으로 스레드 안전하지 않다.

즉, 아래와 같이 `instanceId`와 `Instance` 모두 `final`로 두어야 스레드 안전하게 작동할 수 있다.

```java
public class Singleton {
    private static final Singleton s = new Singleton();
    public final int instanceId = 1;

    private Singleton() {

    }

    public static Singleton getInstance() {
        return s;
    }
}
```

이러한 문제는 정적 필드에서도 마찬가지이나, 예외 사항이 있다.

해당 클래스가 표현하는 추상 개념을 완성하는데 꼭 필요한 구성요소로써의 상수라면 `public static final` 필드로 공개해도 좋다.

```java
public final class Integer ... {
    @Native public static final int   MIN_VALUE = 0x80000000;
    @Native public static final int   MAX_VALUE = 0x7fffffff;
}
```

`Integer`가 갖고있는 `MIN_VALUE`와 `MAX_VALUE`는 꽤나 자주 사용된다. 이러한 상수 필드는 관례상 대문자 알파벳으로 쓰이며, 각 단어 사이에 밑줄(_)을 넣는다. 이런 필드는 반드시 기본 타입 값이나, 불변 객체를 참조해야한다.

아래와 같이 가변 객체를 참조할 경우 사용자가 기대한 `MAX_VALUE`와 다른 결과를 뿜어내서 혼란을 초래할 수 있다. 그렇기 때문에 꼭, `final`이 붙은 불변 객체 혹은 기본 타입 값을 참조하도록 해야한다.

```java
public final class Integer {
    public static final int   MAX_VALUE = maxValue;
    
    private int maxValue;
    
    public Integer(int maxValue) {
        this.maxValue = maxValue;
    }
}
```

#### 배열 요소 변경

길이가 0이 아닌 배열은 모두 변경 가능하니 조심해야한다.
클래스에서 `public static final` 배열 필드를 두거나, 이 필드를 반환하는 접근자 메소드를 같이 제공해서는 안 된다.

아래 코드는 `item13`에서 구현한 `Stack` 클래스이다.

```java
public class Stack {
    public static final Object[] elements;

    public Stack() {
        this.elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }
    
}
```

위 코드와 같이 `element`에 접근할 수 있도록 만들 경우 클라이언트에서 이 배열의 내용을 수정할 수 있게 된다. 이를 해결하기 위해서는 다음과 같이 수정하면 된다.

```java
// 방법 1
public class Stack {
    private static final Object[] elements;

    public static final List<Object> VALUES =
            Collections.unmodifiableList(Arrays.asList(elements));
    
}
```

```java
// 방법 2
public class Stack {
    private static final Object[] elements;
    
    public static final Object[] values() {
        return elements.clone();
    }

}
```

방법1과 방법2 모두 접근 제어자를 `private`로 수정한 것은 동일하다.

- 방법1 : `public`으로 된 불변 리스트를 추가해 반환하도록 하는 것
- 방법2 : item13에서 공부한 `clone`을 통해 새로운 배열을 반환하는 것

클라이언트가 무엇을 원하느냐를 잘 파악에서 두 선택지 중에 하나를 골라서 사용하면 된다.

## 정리

- 프로그램 요소의 접근성은 가능한 한 최소한으로 하라.
- 꼭 필요한 것만 골라 최소한의 public API를 설계하라.
- 그 외에는 클래스, 인터페이스, 멤버가 의도치 않게 공개 API로 되는 일이 없도록 해야한다.
- public 클래스는 상수용 public static final 필드 외에는 어떠한 public 필드도 가져서는 안 된다.
    - public static final 필드가 참조하는 객체가 불변인지 확인하라.