---
title: "[Item10] - equals는 일반 규약을 지켜 재정의하라."
last_modified_at: 2023-09-03T21:00:37-21:30
categories: [Book]-Language
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

`.equals()` 메소드는 함정이 많아 자칫하면 끔찍한 결과를 초래한다.
문제를 회피하는 가장 쉬운 방법은 아예 재정의하지 않는 것이다.
그냥 두면 그 클래스의 인스턴스는 오직 자기 자신과만 같게 되는 것이다.
아래 중 하나라도 해당된다면 재정의하지 않는 것이 최선이다.

- 각 인스턴스가 본질적으로 고유하다.
- 인스턴스의 '논리적 동치성'을 검사할 일이 없다.
- 상위 클래스에서 재정의한 equals가 하위 클래스에도 딱 들어맞는다.
- 클래스가 private이거나 package-private이고, equals 메소드를 호출할 일이 없다.

## 재정의하는 경우

객체 식별성(object identity;두 객체가 물리적으로 같은가)가 아니라, 논리적 동치성을 확인해야하는데,
상위 클래스의 `equals`가 논리적 동치성을 비교하도록 재정의되지 않았을 때다.

> 논리적 동치성(logical equality)이란, 두 개 이상의 논리식이 서로 같은 논리적 의미를 가지는 상태

주로 값 클래스인 `String`, `Integer`와 같은 클래스가 여기에 해당한다.
두 값 객체를 `equals`로 비교하는 프로그래머는 객체가 같은지가 아닌, 값이 같은지를 알고 싶어 할 것이다.

```java
public final class Integer {
    public boolean equals(Object obj) {
        if (obj instanceof Integer) {
            return value == ((Integer)obj).intValue();
        }
        return false;
    }
}
```

위 코드를 보면 `Integer`에 있는 값을 `intValue()`를 통해 꺼내와 기본형 값을 비교하는 `==`을 사용해 비교했다.
이와 같이 논리적 동치성을 확인하도록 재정의해두면, `Map`과 `Set`의 원소로도 사용할 수 있게 된다.

## 일반 규약

`equals` 메소드를 재정의할 때는 반드시 `Object` 클래스 내부에 적혀있는 일반 규약을 따라야한다.

```java
The equals method implements an equivalence relation on non-null object references:
It is reflexive(반사성): for any non-null reference value x, x.equals(x) should return true.
It is symmetric(대칭성): for any non-null reference values x and y, x.equals(y) should return true if and only if y.equals(x) returns true.
It is transitive(추이성): for any non-null reference values x, y, and z, if x.equals(y) returns true and y.equals(z) returns true, then x.equals(z) should return true.
It is consistent(일관성): for any non-null reference values x and y, multiple invocations of x.equals(y) consistently return true or consistently return false, provided no information used in equals comparisons on the objects is modified.
null-아님 : For any non-null reference value x, x.equals(null) should return false.
```

이 규약을 어기면 프로그램이 이상하게 동작하거나 종료될 것이고, 원인이 되는 코드를 찾기도 굉장히 어려울 것이다.

동치관계란, 집합을 서로 같은 원소들로 이뤄진 부분집합으로 나누는 연산이다.
이 부분집합을 동치류(equivalence class; 동치 클래스)라 한다.

모든 원소가 같은 동치류에 속한 어떤 원소와도 서로 교환할 수 있어야 한다.

### 반사성(reflexivity)

> `null`이 아닌 모든 참조 값 x에 대해, `x.equals(x)`는 **true**다.

너무도 당연한 이야기지만, 객체는 자기 자신과 같아야 한다는 뜻이다.

이 요건을 어긴 클래스의 인스턴스를 컬렉션에 넣은 다음 contains 메소드를 호출하면 방금 넣은 인스턴스가 없다고 답할 것이다.

```java
public class BreakReflexivity {
    private int id;

    public BreakReflexivity(int id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return false;
        return true;
    }
}
```

```java
public class ReflexivityTest {
    @Test
    void reflexivityTest() {
        List<BreakReflexivity> list = new ArrayList<>();
        BreakReflexivity br = new BreakReflexivity(1);
        list.add(br);

        // 테스트 실패!
        assertTrue(list.contains(br));
    }
}
```

방금 생성한 객체를 컬렉션에 넣고, 포함되어 있는지 테스트를 해봤더니 실패했다.
이와 같이 어이없는 상황이 발생할 수 있으니, 반사성은 최대한 건들이지 않는 것이 좋다.

### 대칭성(symmetry)

> `null`이 아닌 모든 참조 값 x, y에 대해, `x.equals(y)`가 **true**면, `y.equals(x)`도 **true**다.

두 객체는 서로에 대한 동치 여부에 똑같이 답해야한다는 것이다.

아래와 같이 메세지를 저장하는 클래스가 있다.

```java
public class Message {
    private final String msg;

    public Message(String msg) {
        this.msg = msg;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o instanceof Message) {
            return msg.equalsIgnoreCase(((Message) o).msg);
        }
        if (o instanceof String) {
            return msg.equalsIgnoreCase((String) o);
        }
        return false;
    }
}
```

```java
public class MessageTest {
    @Test
    void msgEqStrTest() {
        Message msg = new Message("Hello");
        String str = "hello";

        // 테스트 성공!
        assertTrue(msg.equals(str));
    }
}
```

`str`과 `msg`가 같고 있는 문자열은 동일하기 때문에 테스트를 성공하는 모습을 볼 수 있다.
그렇다면, 반대의 경우는 어떨까?

```java
public class MessageTest {
    @Test
    void strEqMsgTest() {
        Message msg = new Message("Hello");
        String str = "hello";

        // 테스트 실패!
        assertTrue(str.equals(msg));
    }
}
```

`String.equals(Message)`는 당연히 `false`가 나오게 된다.

**이렇게 `equals` 규약을 어기면 그 객체를 사용하는 다른 객체들이 어떻게 반응할지 알 수 없다.**

이를 해결하려면 아래와 같이 `String`과 연동하는 부분을 제거해주기만 하면 된다.

```java
public class Message {
    private final String msg;

    public Message(String msg) {
        this.msg = msg;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Message &&
                ((Message) o).msg.equalsIgnoreCase(msg);
    }
}
```

### 추이성(transitivity)

> `null`이 아닌 모든 참조 값 x, y, z에 대해, `x.equals(y)`는 **true**이고, `y.equals(z)`도 **true**면, `x.equals(z)`도 **true**다.

아래 사진과 같이 1번 객체 == 2번 객체가 true, 2번 객체 == 3번 객체가 true면, 1번 객체 == 3번 객체도 ture여야 한다.

![image](https://github.com/likelion-backendschool/matdongsan/assets/82663161/88988879-425d-41c3-b3dc-877ad335da97)

상위 클래스에는 없는 새로운 필드를 하위 클래스에 추가하는 상황을 통해 확인해보자!

```java
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if(!(o instanceof Point)) return false;

        Point p = (Point) o;
        return p.x == x && p.y == y;
    }
}
```

```java
public class ColorPoint extends Point {
    private final Color color;

    public ColorPoint(int x, int y, Color color) {
        super(x, y);
        this.color = color;
    }

    // equals를 구현하지 않으면, Point의 equals를 사용함
    // 즉, color를 포함하지 않고 비교를 진행하게 된다.
    @Override public boolean equals(Object o) {
        if(!(o instanceof ColorPoint)) return false;
        return super.equals(o) && ((ColorPoint) o).color == color;
    }
}
```

```java
public class ColorTest {
    @Test
    void test() {
        Point p = new Point(1, 1);
        ColorPoint cp1 = new ColorPoint(1, 1, Color.BLACK);

        // 테스트 성공!
        assertTrue(p.equals(cp1));
        
        // 테스트 실패!
        assertTrue(cp1.equals(p));
    }
}
```

`p.equals(cp1)` 테스트가 성공하는 이유는 `Point` 클래스에서 색상 정보를 제외하고, 좌표값만 비교하기 때문이다.
`cp1.equals(p)` 테스트가 실패하는 이유는 `p` 객체가 `ColorPoint` 클래스의 객체가 아니기 때문이다.
즉, 위 코드는 대칭성을 위배하고 있는 것이다.

그럼 이러한 대칭성을 위배하지 않도록 코드를 작성해보자!

```java
public class ColorPoint extends Point {
    @Override
    public boolean equals(Object o) {
        if(!(o instanceof Point)) return false;
        if(!(o instanceof ColorPoint)) return o.equals(this);
        
        return super.equals(o) && ((ColorPoint) o).color == color;
    }
}
```

위와 같이 `ColorPoint`에 대한 객체가 아닐 경우 해당 객체의 `equals`를 통해 비교를 해준다.

```java
public class ColorTest {
    @Test
    void test() {
        Point p = new Point(1, 1);
        ColorPoint cp1 = new ColorPoint(1, 1, Color.BLACK);

        // 테스트 성공!
        assertTrue(p.equals(cp1));
    }
}
```

테스트는 통과할 수 있지만, 이는 색상 정보를 아예 무시하고 비교를 하고 있다.

```java
public class ColorTest {
    @Test
    void transitivityTest() {
        ColorPoint cp1 = new ColorPoint(1, 1, Color.BLACK);
        Point p = new Point(1, 1);
        ColorPoint cp3 = new ColorPoint(1, 1, Color.BLUE);
        
        // 테스트 통과!
        assertTrue(cp1.equals(p));

        // 테스트 통과!
        assertTrue(p.equals(cp3));

        // 테스트 실패!
        assertTrue(cp1.equals(cp3));
    }
}
```

`cp1`이 `p`와 동일하고, `p`가 `cp3`와 동일하다면, `cp1`과 `cp3`도 동일해야 한다.
하지만, 테스트를 실패했기 때문에 추이성을 위배하는 코드가 되는 것이다.

그럼 어떤 방식을 통해 해결해야할까?

객체 지향적 추상화의 이점을 포기하지 않는 한 **구체 클래스를 확장해 새로운 값을 추가하면서 `equals` 규약을 만족시킬 방법은 존재하지 않는다.**

```java
public class Point {
    @Override
    public boolean equals(Object o) {
        if (o == null || o.getClass() != getClass()) return false;
        Point p = (Point) o;
        return p.x == x && p.y == y;
    }
}
```

```java
public class ColorPoint extends Point {
    @Override
    public boolean equals(Object o) {

        if(!(o instanceof Point)) return false;
        if(!(o instanceof ColorPoint)) return o.equals(this);

        return super.equals(o) && ((ColorPoint) o).color == color;
    }
}
```

이와 같이 `instanceof` 대신 `getClass()`를 통해 상속을 고려하지 않고,
비교한다면 값도 추가하면서 구체 클래스를 상속할 수 있다는 뜻으로 보이기도 한다.

하지만 이 코드는 객체지향 5원칙 중 리스코프 치환 원칙을 위배한다.
`Point`의 하위 클래스도 `Point`로써 활용할 수 있어야한다.

```java
public class CounterPoint extends Point {
    private static final AtomicInteger counter = new AtomicInteger();

    public CounterPoint(int x, int y) {
        super(x, y);
        counter.incrementAndGet();
    }

    public static int numberCreated() {
        return counter.get();
    }
}
```

```java
public class ColorTest {
    private static final Set<Point> unitCircle = Set.of(
            new Point(1, 0), new Point(0, 1),
            new Point(-1, 0), new Point(0, -1)
    );

    private static boolean onUnitCircle(Point point) {
        return unitCircle.contains(point);
    }

    @Test
    void unitCircleTest() {
        // 테스트 실패!
        assertTrue(onUnitCircle(new CounterPoint(1, 0)));
    }
}
```

`CounterPoint`는 `Point`를 상속 받았고, 좌표도 동일하게 들어있는데 테스트를 실패한다.
그 이유는 대부분의 컬렉션 구현체에서 `contains` 기능에 `equals`를 사용하기 때문이다.

`getClass()`가 아닌 `instanceof`를 사용했으면 이런 일이 발생하지 않았을 것이다.



#### 리스코프 치환 원칙(LSP)

> 리스코프 치환 원칙(Liskov substiution principle)이란,
> 어떤 타입에 있어 중요한 속성이라면 그 하위 타입에서도 마찬가지로 중요하다.
> 따라서 그 타입의 모든 메소드가 하위 타입에서도 똑같이 잘 작동해야 한다.
> > **서브 타입은 언제나 기반 타입으로 교체할 수 있어야 한다.**

<!--

```java
public class Animal {
    int speed = 100;

    int move(int distance) {
        return speed * distance;
    }
}
```

```java
public class Cat extends Animal {
    String move(int distance, boolean flying) {
        if (flying) {
            return distance + "만큼 날아서 이동했습니다.";
        }
        return distance + "만큼 뛰어서 이동했습니다.";
    }
}
```

부모 클래스에서 반환 타입이 `int`로 정의된 `move` 메소드를 자식 클래스에서 마음대로 `String`으로 바꾸고, 매개변수 개수도 변경했다.

즉, 특정 메소드의 오버로딩을 부모가 아닌 자식 클래스에서 해버렸기 때문에 LSP 원칙을 위배한 것이다.

```java
abstract class Animal {
}

interface Speakable {
    void speak();
}

class Cat extends Animal implements Speakable {
    public void speak() {
        System.out.println("냐옹");
    }
}

class dog extends Animal implements Speakable  {
    public void speak() {
        System.out.println("멍멍");
    }
}

class Fish extends Animal {
}
```

위 코드와 같이 다형성의 특징을 이용하기 위해 상위 클래스 타입으로 선언하여,
하위 클래스의 인스턴스를 받으면 업캐스팅된 상태에서 부모의 메소드를 사용해도 동작이 의도대로만 흘러가도록 구성하면 되는 것이다.

LSP 원칙의 핵심은 상속이며, 기반 클래스와 서브 클래스 사이에 IS-A 관계가 있을 경우로만 제한 되어야 한다.

-->

### 일관성(consistency)

> `null`이 아닌 모든 참조 값 x, y에 대해, x.equals(y)를 반복해서 호출하면 **true**이거나 **false**를 반환한다.

두 객체가 같다면 어느 하나 혹은 두 객체 모두가 수정되지 않는 한 앞으로도 영원히 같아야 한다.

그렇기 때문에, `equals`의 판단에 신뢰할 수 없는 자원이 끼어들게 해서는 안 된다.
이 제약을 어기면 일관성 조건을 만족시키기가 아주 어렵다.

`java.net.URL`의 `equals`를 살펴보자.

```java
public final class URL {
    transient URLStreamHandler handler;
    public boolean equals(Object obj) {
        if (!(obj instanceof URL u2))
            return false;

        return handler.equals(this, u2);
    }
}

public abstract class URLStreamHandler {
    protected boolean equals(URL u1, URL u2) {
        // 두 객체의 레퍼런스가 동일하고,
        // sameFile을 통해 프로토콜, 파일, 포트가 모두 동일한지 확인하고,
        // 마지막으로 hostsEqual를 통해 두 URL의 아이피 주소를 비교한다.
        return Objects.equals(u1.getRef(), u2.getRef()) && sameFile(u1, u2);
    }
}
```

```java
public abstract class URLStreamHandler {
    protected boolean sameFile(URL u1, URL u2) {
        // Compare the protocols.
        if (...) return false;

        // Compare the files.
        if (...) return false;

        // Compare the ports.
        if (...) return false;

        // Compare the hosts.
        if (!hostsEqual(u1, u2))
            return false;

        return true;
    }

    protected boolean hostsEqual(URL u1, URL u2) {
        InetAddress a1 = getHostAddress(u1);
        InetAddress a2 = getHostAddress(u2);
        // if we have internet address for both, compare them
        if (a1 != null && a2 != null) {
            return a1.equals(a2);
            // else, if both have host names, compare them
        } else if (u1.getHost() != null && u2.getHost() != null)
            return u1.getHost().equalsIgnoreCase(u2.getHost());
        else
            return u1.getHost() == null && u2.getHost() == null;
    }
}
```

위와 같이 주어진 `URL`과 매핑된 호스트의 IP 주소를 이용해 비교한다.
호스트의 이름을 IP 주소로 바꾸려면 네트워크를 통해야 하는데, 그 결과가 항상 같다고 보장할 수 없다.

예를 들어, 네이버의 아이피는 `223.130.200.107`, `223.130.200.104` 총 두 가지가 존재한다.

```bash
> nslookup www.naver.com
Server:		61.41.153.2
Address:	61.41.153.2#53

Non-authoritative answer:
www.naver.com	canonical name = www.naver.com.nheos.com.
Name:	www.naver.com.nheos.com
Address: 223.130.200.107
Name:	www.naver.com.nheos.com
Address: 223.130.200.104
```

어떤 아이피를 사용해도 동일한 네이버 페이지에 접근할 수 있다.
아래와 같이 비교를 하면 테스트를 성공하는 것을 볼 수 있다.

```java
public class URLTest {

    @Test
    void urlTest() {
        String urlStr1 = "https://www.naver.com";
        String urlStr2 = "https://223.130.200.107";
        String urlStr3 = "https://223.130.200.104";

        try {
            URL url1 = new URL(urlStr1);
            URL url2 = new URL(urlStr2);

            InetAddress address1 = InetAddress.getByName(url1.getHost());
            InetAddress address2 = InetAddress.getByName(url2.getHost());

            // Host 1 IP: 223.130.200.107
            System.out.println("Host 1 IP: " + address1.getHostAddress());
            
            // Host 2 IP: 223.130.200.107
            System.out.println("Host 2 IP: " + address2.getHostAddress());

            // 테스트 성공!
            assertTrue(url1.equals(url2));

            // 테스트 실패!
            URL url3 = new URL(urlStr3);
            assertTrue(url1.equals(url3));

        } catch (MalformedURLException | UnknownHostException e) {
            e.printStackTrace();
        }
    }

}
```

그럼 만약 네트워크를 없이 테스트하면 어떻게 될까?
대충 호스트 이름을 IP 주소로 변환하는 과정에서 찾을 수 없다는 에러가 뜬다.

```bash
java.net.UnknownHostException: www.naver.com: nodename nor servname provided, or not known
	at java.base/java.net.Inet6AddressImpl.lookupAllHostAddr(Native Method)
	at java.base/java.net.InetAddress$PlatformNameService.lookupAllHostAddr(InetAddress.java:933)
	at java.base/java.net.InetAddress.getAddressesFromNameService(InetAddress.java:1534)
	at java.base/java.net.InetAddress$NameServiceAddresses.get(InetAddress.java:852)
	at java.base/java.net.InetAddress.getAllByName0(InetAddress.java:1524)
	at java.base/java.net.InetAddress.getAllByName(InetAddress.java:1381)
	at java.base/java.net.InetAddress.getAllByName(InetAddress.java:1305)
	at java.base/java.net.InetAddress.getByName(InetAddress.java:1255)
	at ka.chapter3.item10.consistency.URLTest.urlTest(URLTest.java:23)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.base/java.lang.reflect.Method.invoke(Method.java:568)
	...
Process finished with exit code 0
```

즉, 한 번 같다고 나온 결과라 `false`가 나와 일관성을 위배한다는 것이다.
이런 문제를 피하려면, `equals`는 네트워크를 사용하는 것이 아닌,
항시 메모리에 존재하는 객체만을 사용한 결정적(deterministic) 계산만 수행해야 한다.

#### transient

앞서 URL 클래스 내부에 `transient` 키워드를 봤는데, 무엇인지 함께 살펴보자!

> `transient`란, 직렬화 과정에서 멤버 변수를 제외시키는 데 사용되는 키워드이다.

```java
public class Post implements Serializable {
    private int id;
    private String title, content;
    
    // writer 필드는 직렬화 시 무시되도록 지정
    private transient Member writer;

    public Post(String title, String content, Member writer) {
        this.title = title;
        this.content = content;
        this.writer = writer;
    }
}
```

```java
public class Member {

    private String nickname;

    public Member(String nickname) {
        this.nickname = nickname;
    }

    @Override
    public String toString() {
        return "Member(nickname : " + nickname + " )";
    }
}
```

`wirter` 필드에 `transient` 키워드를 지정했기 때문에,
직렬화 과정에서 해당 필드를 제외한 나머지 필드만 파일에 직렬화한다.
즉, 역직렬화 과정을 거칠 경우 `writer` 필드는 `null`이 나오게 된다.

```java
public class TransientTest {
    @Test
    void serializationTest() {
        Member member = new Member("tester");
        Post p = new Post("title", "content", member);

        // Post 객체 -> post.ser 파일 직렬화
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("post.ser"))) {
            out.writeObject(p);
            // Member( nickname : tester ) 출력
            System.out.println(p.getWriter());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // post.ser 파일 -> Post 객체 역직렬화
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("post.ser"))){
            Post restoredPost = (Post) in.readObject();

            // null 출력
            System.out.println(restoredPost.getWriter());
            
            // 테스트 성공!
            assertTrue(restoredPost.getWriter() == null);
        } catch (ClassNotFoundException | IOException e) {
            e.printStackTrace();
        }
    }
}
```

위와 같이 `transient`를 사용하면, 해당 필드를 제외하고, 역직렬화를 할 수 있다.
코드는 단순하게 들었지만, 보통 중요하지 않거나, 다시 생성 가능한 것들에 `transient` 키워드를 붙여 사용한다고 한다.

### null-아님

> `null`이 아닌 모든 참조 값 x에 대해, x.equals(null)은 `false`다.

모든 객체가 `null`과 같지 않아야 한다는 것이다.

```java
public class NullTest {
    
    @Test
    void objectArrayNullTest() {
        Post[] arr = new Post[5];
        
        // 테스트 실패!
        assertTrue(arr[0].equals(null));
    }
    
}
```

해당 배열을 초기화 했지만, 내부에 있는 `Post`는 모두 `null`인 상태이다.
즉, `arr[0]`에 접근하는 것에서 이미 `NPE`가 발생한 것이다.

이와 같이 `obj.equals(null)`이 `true`를 반환한다는 것은 생각보다 어려운 일이다.

이를 방어하기 위해서는 두 가지 방법이 존재한다.

#### 명시적 검사

비교 대상 객체가 `null`인지 직접 명시해 결과를 반환하는 것이다.

```java
public class Post {
    @Override public boolean equals(Object o) {
        if(o == null) return false;
    }
}
```

#### 묵시적 검사

비교 대상 객체를 형변한한 뒤, 필수 필드들의 값을 알아낸다.
그러기 위해서는 `instanceof` 연산자를 사용하게 되는데,
이 부분에서 자동으로 해당 객체가 올바른 타입인지 검사할 수 있게 된다.

```java
public class Post {
    @Override public boolean equals(Object o) {
        if(!(o instanceof Post)) return false;
        Post p = (Post) o;
        ...
    }
}
```

`equals`가 타입을 확인하지 않으면 잘못된 타입이 인수로 주어졌을 때,
`ClassCastException`을 던져서 일반 규약을 위배하게 된다.
그렇기 때문에 명시적 검사보단 묵시적 검사를 통해 `instanceof`로 타입 검사도 하고,
`null`이 들어와도 알아서 거를 수 있게 만드는 것이 더 유용하다.

## 양질의 equals 메소드 구현 방법

아래 `Book` 클래스를 통해 하나씩 추가해보자!

```java
public class Book {
    private String title;
    private int pageCount;

    public Book(String title, int pageCount) {
        this.title = title;
        this.pageCount = pageCount;
    }
}
```

### 반사성 검사

**== 연산자를 통해 자기 자신의 참조인지 확인한다.**

자기 자신과 비교하는 것은 `true`가 나와야한다.
단순한 성능 최적화용이며, 비교 작업이 복잡해질 경우 빛을 볼 것이다.

```java
public class Book {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        ...
    }
}
```

```java
public class BookTest {
    
    @Test
    @DisplayName("반사성 테스트")
    void reflexiveTest() {
        Book b = new Book("Effective Java 3/E", 500);
        
        // 테스트 성공!
        assertTrue(b.equals(b));
    }
    
}
```

### 타입 검사 및 올바른 형변환

`instanceof` 연산자로 비교 대상 객체가 올바른 타입인지 확인한다.
이 과정을 통해 올바른 타입으로 형변환을 할 수 있게 되며, `null`과 비교하는 것도 막을 수 있다.

```java
public class Book {
    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Book)) return false;
        Book obj = (Book) o;
        ...
    }
}
```

```java
public class BookTest {
    
    @Test
    @DisplayName("타입 검사 테스트1")
    void checkTypeTest1() {
        Book b1 = new Book("Effective Java 3/E", 500);
        Book b2 = new Book("Effective Java 3/E", 500);
        assertTrue(b1.equals(b2));
    }
    
}
```

### 핵심 필드가 모두 일치하는지 검사

모든 필드가 일치하면 `true`를 반환하고, 하나라도 다를 경우 `false`를 반환하게 한다.

```java
public class Book {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book)) return false;
        Book obj = (Book) o;
        return pageCount == obj.pageCount &&
                Objects.equals(title, obj.title);
    }
}
```

#### Objects.equals()

아래 두 코드의 차이는 뭘까?

```java
title.equals(obj.title);
Objects.equals(title, obj.title);
```

우리가 보통 문자열을 비교할 때, `String` 클래스에 있는 `.equals()`를 사용한다.
하지만, 객체를 비교하는 과정에서 현재 변수와 비교 대상 변수에 `null`이 하나라도 존재할 경우 `NPE`를 던지게 된다.

때문에 `Objects.equals()`를 통해서 두 값이 모두 `null`이면 `true`를 반환하고,
둘 중 하나라도 `null`이면 `false`를 반환해 `Exception`을 발생시키지 않고, 안전하게 객체의 동등성을 비교할 수 있게 된다.

## 주의사항

### 자문하며 테스트해라.

위 방식으로 `equals`를 구현했다면, **대칭성, 추이성, 일관성**에 대해 테스트를 하며 자문해보자.

세 요건 중 하나라도 실패한다면, 원인을 찾아서 고쳐야한다.
물론 나머지 요건인 반사성과 null-아님도 만족해야 하지만, 이 둘은 문제되는 경우가 거의 없다.

### equals와 hashCode는 함께 재정의해라.

아이템 11에서 진행할 예정

### 너무 복잡하게 해결하려 들지 말자.

필드의 동치성만 검사해도 `equals` 규약을 쉽게 지킬 수 있다.

일반적으로 별칭(alias)은 비교하지 않는 것이 좋다.
`File` 클래스라면, `심볼릭 링크`를 비교해 같은 파일을 가리키는지 확인하려 들면 안 된다.

> 심볼릭 링크란 원본 파일을 가리키는 가상의 링크이다. 윈도우의 바로가기 기능과 비슷한 것이라고 생각하면 된다!

### Object 외의 타입을 매개변수로 받는 equals 메소드는 선언하지 말자.

```java
public class Book {
    @Override
    public boolean equals(Book o) {
        ...
    }
}
```

이 메소드는 `Object.equals`를 재정의한게 아니다. 때문에 `@Override` 어노테이션에 에러가 뜨는 것을 알 수 있다.
이는 `Object.equals`와 비교하는 타입이 다르기 때문에 다중 정의에 속한다.

이러한 실수를 막기 위해 `@Override` 어노테이션은 가능한 써주는 것이 좋다.

## 정리

- 꼭 필요한 경우가 아니라면 `equals`를 재정의하지 말자.
- `Object.equals`로도 충분하다.
- 재정의할 경우 핵심 필드를 모두 빠짐없이 다섯 가지 규약을 지켜 비교하자.