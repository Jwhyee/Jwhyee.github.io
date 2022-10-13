---
title: Spring Boot에서 Cache 사용
date: 2022-10-13 14:10:42
category: spring-boot
thumbnail: { thumbnailSrc }
draft: false
---

## SpringBoot Cache
아래에서 설명할 캐싱(Caching)은 `Redis`를 사용하지 않은 기본 캐싱 방식입니다.

### Cache란?
> `Spring Boot`는 외부 캐시를 지정하지 않으면 `Map`과 같은 내부 메모리 캐시를 사용한다.<br>
> 자료구조 `Map`과 동일하게 `Key : Value` 형태로 이루어져 있으며, 객체 또한 저장이 가능하다.<br>
> `Cache`의 장점은 불필요한 DB 호출을 줄여 필요한 데이터를 빠르게 불러올 수 있다.<br>
> 하지만 `Application`이 꺼지면 해당 `Cache`도 사라지게 된다.


### ⚙️ Setting

> `SpringBoot`에서 캐시를 사용하기 위해서는 `Application`에서 `@EnableCaching` 어노테이션을 사용한다.

```java
// build.gradle
implementation 'org.springframework.boot:spring-boot-starter-cache'
```
```java
// JwtExamApplication.java
@EnableCaching
@SpringBootApplication
public class JwtExamApplication {
  ...
}
```

### ✅ 캐시 생성 예제
캐시 생성은 `@Cacheable("keyName")` 어노테이션을 사용한다.
```java
// CacheService
@Cacheable("key1")
public int getCachedInt() {
    System.out.println("호출됨");
    return 5;
}
```

```java
// CacheTests
@Test
@DisplayName("캐시 사용")
void t1() {
    int rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(5);
    System.out.println("rs = " + rs);
    
    rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(5);
    System.out.println("rs = " + rs);
}
```
```bash
# 결과
호출됨
rs = 5
rs = 5
```
> 위와 같이 `@Cachable("keyName")`을 사용하면 처음 호출이 될 때 `keyName`에 `return` 값을 저장하고,<br>
> 다음 호출이 될 때부터는 함수를 다시 실행하는 것이 아닌 저장된 `keyName`의 `value`를 불러오게 된다.

### ❎ 캐시 삭제 예제
캐시 삭제는 `@CacheEvict("keyName")` 어노테이션을 사용한다.
```java
@CacheEvict("key1")
public void deleteCachedInt() {
    System.out.println("삭제됨");
}
```
```java
@Test
@DisplayName("캐시 사용, 삭제, 생성")
void t2() {
    // 캐시 생성
    int rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(5);
    System.out.println("rs = " + rs);

    // 캐시 사용
    rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(5);
    System.out.println("rs = " + rs);

    // 캐시 삭제
    cacheService.deleteCachedInt();

    // 캐시 생성
    rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(5);
    System.out.println("rs = " + rs);
}
```
```bash
# 결과
호출됨
rs = 5
rs = 5
삭제됨
호출됨
rs = 5
```
> `@CacheEvict("keyName")`을 사용하면 `keyName`으로 된 `Cache`를 삭제한다.<br>
> `Evict` : 퇴거

### ↩️ 캐시 수정 예제
캐시 수정은 `@CachePut("keyName")` 어노테이션을 사용한다.
```java
@CachePut("key1")
public int updateCachedInt() {
    System.out.println("수정됨");
    return 10;
}
```
```java
@Test
@DisplayName("캐시 사용, 삭제, 생성")
void t2() {
    // 캐시 생성
    int rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(5);
    System.out.println("rs = " + rs);
    
    // 캐시 사용
    rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(5);
    System.out.println("rs = " + rs);

    // 캐시 수정
    rs = cacheService.updateCachedInt();
    assertThat(rs).isEqualTo(10);
    System.out.println("rs = " + rs);

    // 캐시 사용
    rs = cacheService.getCachedInt();
    assertThat(rs).isEqualTo(10);
    System.out.println("rs = " + rs);
}
```
```bash
호출됨
rs = 5
rs = 5
수정됨
rs = 10
rs = 10
```