---
title: "[Item22] - 인터페이스는 타입을 정의하는 용도로만 사용하라."
last_modified_at: 2023-10-23T21:00:37-21:30
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

클래스가 어떤 인터페이스를 구현한다는 것은 자신의 인스턴스로 무엇을 할 수 있는지를 클라이언트에 얘기해주는 것이다.

## 상수 인터페이스

> 상수 인터페이스란, 상수를 뜻하는 `static final` 필드로 가득찬 인터페이스를 의미한다.

이 상수들을 사용하려는 클래스에서는 정규화된 이름을 쓰는걸 피하고자 그 인터페이스를 구현하곤 한다.

```java
public interface PhysicalConstants {
    // 아보가드로 수 (1/몰)
    static final double AVOGADROS_NUMBER = ...;
    
    // 볼츠만 상수 (J/K)
    static final double BOLTZMANN_CONSTANT = ...;
    
    // 전자 질량(kg)
    static final double ELECTRON_MASS = ...;
}
```

클래스 내부에서 사용하는 상수는 외부 인터페이스가 아니라 내부 구현에 해당되기 때문에 상수 인터페이스 안티패턴은 인터페이스를 잘못 사용한 예이다.

> 안티패턴이란, 비효율적이거나 비생산적인 패턴을 의미

따라서 상수 인터페이스를 구현하는 것은 이 내부 구현을 클래스의 API로 노출하는 행위이다.
`java.io.ObjectStreamConstant`와 같이 자바 플랫폼 라이브러리에도 상수 인터페이스가 몇 개 있으나, 인터페이스를 잘못 활용한 예이다.

```java
public interface ObjectStreamConstants {
    static final short STREAM_MAGIC = (short) 0xaced;
    static final short STREAM_VERSION = 5;
    static final byte TC_BASE = 0x70;
    ...
}
```

특정 클래스나 인터페이스와 강하게 연관된 상수라면 그 클래스나 인터페이스 자체에 추가해야 한다.

```java
public final class Integer {
    @Native public static final int MIN_VALUE = 0x80000000;
}
```

`Integer` 클래스처럼 클래스 내부 상수로 사용하거나, `enum`을 사용해 공개하는 것도 좋다.
이렇게 사용하기 어렵다면, 인스턴스화 할 수 없는 유틸리티 클래스에 담아 공개하자.

```java
public class PhysicalConstants {
    private PhysicalConstants(){} // 인스턴스화 방지

    // 아보가드로 수 (1/몰)
    public static final double AVOGADROS_NUMBER = 6.022_140_857e23;

    // 볼츠만 상수 (J/K)
    public static final double BOLTZMANN_CONSTANT = 1.380_648_52e-23;

    // 전자 질량(kg)
    public static final double ELECTRON_MASS = 9.109_383_56e-31;
}
```

> 숫자 리터럴에 언더바는 값에 아무런 영향을 주지 않고, 보기 편하게 해준다.
> 총 5자리 이상일 경우 3자리마다 언더바를 추가해주면 가독성이 향상된다.

유틸리티 클래스에 정의된 상수를 클라이언트에서 사용하려면 클래스 이름까지 함께 명시해야한다.

```java
double atoms(double mols) {
    return PhysicalConstants.AVOGADROS_NUMBER * mols;
}
```

혹은 `static import`를 사용하자.

```java
import static src.chapter3.item22.PhysicalConstants.*;

double atoms(double mols) {
    return AVOGADROS_NUMBER * mols;
}
```

## 정리

- 인터페이스는 타입을 정의하는 용도로만 사용해야 한다.
- 상수 공개용 수단으로 사용하지 말자.