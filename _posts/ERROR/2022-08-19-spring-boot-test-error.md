---
title: "[Spring] - @SpringBootTest 에러"
last_modified_at: 2022-08-19T21:08:37-21:30
categories: ERROR
tags:
  - Spring Boot
  - Error
  - SpringBootTest
toc: true
toc_sticky: true
toc_label: "SpringBootTest Error"
toc_icon: "file"
---
## 문제 발단
기본적인 코드를 작성한 뒤 Test를 해야할 일이 생겨 간단한 코드를 작성 후 돌려봤는데 아래와 같은 에러를 마주치게 되었다.<br>

```bash
java.lang.IllegalStateException: Failed to load ApplicationContext
```

![test-error](https://user-images.githubusercontent.com/82663161/209671183-ab2344be-71fb-41c9-8585-2e3583fc7fd9.png)

## 문제 분석
테스트로 작성한 코드는 아래와 같다.<br>
컴파일 시점으로 봐도 문제될게 없는 코드였고, Application도 정상적으로 작동했다.
![test-code-example](https://user-images.githubusercontent.com/82663161/209671155-96323e72-06bd-439b-8253-d564f2488cdc.png)

에러 구문을 분석해보니 아래와 같은 내용도 포함되어 있었다.

```bash
Caused by: java.lang.ClassNotFoundException: org.springframework.jdbc.support.JdbcTransactionManager
```

## 문제 해결 과정

처음에는 에러의 가장 윗 단을 보는게 익숙해서 아래 구문을 구글링해서 찾아보았다.

```bash
java.lang.IllegalStateException: Failed to load ApplicationContext
```

여러 커뮤니티에서는 아래 어노테이션을 붙이면 말끔히 해결된다고 나와있어 큰 기대감을 가지고 추가해봤지만, 아무 소용이 없었다.

```java
@RunWith(SpringRunner.class)
@WebAppConfiguration
```

때문에 에러 구문의 중간에 있는 `Caused by:`로 시작하는 부분을 찾아 다시 검색해보았다.

```bash
Caused by: java.lang.ClassNotFoundException: org.springframework.jdbc.support.JdbcTransactionManager
```

아쉽게도 이 문제를 국내에서 다루는 곳은 없었고, 이 구문과 정확한 문장을 다루고 있는 곳은 중국의 어느 커뮤니티 사이트 밖에 없었다.
확인해보니 해당 커뮤니티에서는 `build.gradle`에 있는 `dependencies` 중 `spring-jdbc` 버전에 대한 문제라고 했다.

### 해결 코드

```java
// 변경 전 build.gradle
dependencies {
    ...
    implementation group: 'org.springframework', name: 'spring-jdbc', version: '5.2.3.RELEASE'
    ...
}
```

```java
// 변경 후 build.gradle
dependencies {
    ...
    implementation group: 'org.springframework', name: 'spring-jdbc', version: '5.3.4'
    ...
}
```

실제로 커뮤니티에서 다루는 `spring-jdbc` 버전과 나의 버전은 비슷했고, 상위 버전으로 올려주니 말끔히 해결되었다 !

> 앞으로 에러가 발생하면 가장 위에 있는 구문을 검색해보는 것도 좋지만 중간에 발생한 문제부터 해결해보는 습관을 가져야할 것 같다.

### 참고 블로그
https://blog.csdn.net/weixin_43549350/article/details/115050847