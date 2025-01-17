---
title: "[Spring] - NoSuchMethod"
last_modified_at: 2025-01-17T13:12:37-13:30
categories: "[Dev]-Troubleshooting"
tags:
  - Spring Boot
toc: true
toc_sticky: true
toc_label: "NoSuchMethod"
toc_icon: "file"
---

## 🛠️ 개발 환경

- kotlin : 2.1.0
- Spring Boot : 3.3.0

## 💬 상황 설명

회사 프로젝트에서 서비스 로직을 개발하던 중, 서버를 실행하니 다음과 같은 에러 메시지가 발생했다.

```
java.lang.NoSuchMethodError: 'java.lang.Object server.temperature.TemperatureService.findTemperature(int, kotlin.coroutines.Continuation)'
```

```kotlin
@Service
class TemperatureService(
	...
) {
	suspend fun findTemperature(
		temperatureCatRowid: Int
	): Flow<Temperature> = ...
}
```

에러 메시지에 보이는 것과 같이 `NoSuchMehtod`에러가 발생했지만, 분명 서비스에는 해당 메소드가 존재한다.

## ✅ 해결 과정

회사 프로젝트는 애그리게이트(Aggregate) 단위로 멀티 모듈로 구성되어 있다. 파일 검색을 통해 확인해보니 다른 애그리게이트 모듈에서 동일한 이름의 서비스를 가지고 있던 것이다. 그렇다면 왜 스프링은 동일한 이름의 클래스가 있다고 에러를 잡지 않아주었을까?

우선, JVM은 패키지와 클래스 이름(정확히는 FQCN: Fully Qualified Class Name)을 기준으로 클래스를 구분한다. 멀티 모듈 프로젝트에서는 각 모듈이 서로 다른 패키지 구조를 가지므로, 동일한 이름의 클래스가 있어도 JVM은 이를 독립적으로 인식한다.

Spring은 클래스 이름(소문자로 시작)을 기본적인 Bean 이름으로 사용한다. 동일한 이름의 Bean이 등록될 경우, 기본적으로 덮어씌워진다.

런타임에 발생한 `java.lang.NoSuchMethodError`는 JVM이 잘못된 클래스를 참조하면서 발생한 문제다. 멀티 모듈 환경에서는 동일한 이름의 클래스나 메서드를 가진 Bean이 충돌하면서 클래스 로딩 과정에서 의도치 않은 동작이 발생할 가능성이 높다.

결론적으로, 멀티 모듈 환경에서 Spring은 먼저 스캔된 Bean을 덮어씌우는 방식으로 동작하며, 이는 애플리케이션 설정과 설계 방식에 따라 예기치 않은 문제를 유발할 수 있다.

## 🤔 회고

정말 간단한 문제였지만, 실제로 저 상황에서 근본적인 원인을 찾기보단, 빌드 캐시가 쌓여서 발생한 에러로 판단하고, `clean build`, `invalidation cache`를 먼저 시도했다.

해당 문제가 아닌게 알았으면, 먼저 같은 클래스가 있는지 확인했어야 했는데, 스프링은 구동이 되기 때문에 머리 속에 그런 생각이 들지 않았다.

이 에러를 해결하면서 스프링과 JVM에 대해 잘 모르는게 많은 것 같다고 느껴졌다. 조금 더 근본적인 문제를 찾기 위해 먼저 생각하는 습관을 가져야할 것 같다.