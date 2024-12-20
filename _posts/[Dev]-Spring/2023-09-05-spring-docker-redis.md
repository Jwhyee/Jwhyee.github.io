---
title: "[Docker] - SpringBoot + Redis 띄우기"
last_modified_at: 2023-09-05T21:00:37-21:30
categories: "[Dev]-Spring"
tags:
  - SpringBoot
  - Docker
  - Redis
toc: true
toc_sticky: true
toc_label: "Docker"
toc_icon: "file"
---

## 🛠️ 개발 환경

🎨 IDE : Intellij Ultimate

🍃 Spring : Spring Boot 3.1.3

🛠️ Java : Amazon corretto 17

🐳 Docker : 23.0.1

💻 OS : M1 macOS Ventura 13.5.1

## 📔 의존성

`SpringBoot` 내부에서 `Redis`를 사용해야하기 때문에 아래 라이브러리를 추가해준다.

```bash
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

## ⚙️ 설정

로컬 환경에서 `Redis`를 실행하려면, `host`를 `localhost`로 설정하면 된다.

> 단, `jar` 파일로 빌드할 때는 꼭 `redis`로 변경해줘야 한다!

```yaml
# application.yaml
spring:
  redis:
    data:
      host: redis
      port: 6379
```

아래 코드와 같이 `Spring`에서 사용할 `Redis` 정보를 설정해준다.

```java
@Configuration
public class RedisConfig {
    @Value("${spring.redis.data.host}")
    private String host;

    @Value("${spring.redis.data.port}")
    private int port;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }

    @Bean
    public RedisTemplate<?, ?> redisTemplate() {
        RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        return redisTemplate;
    }
}
```

만약 `Spring`에서 `JPA`와 같은 문법으로 `Redis`에 접근하려면 아래와 같이 구성해주면 된다.

`@RedisHash`의 속성을 이용하면 구분하기도 쉽고, 생명 주기도 관리할 수 있다.

```java
...
@RedisHash(value = "area", timeToLive = 30)
public class Area {

    @Id
    private Location location;

    private final List<Festival> festivalList;

}
```

`value`를 지정하면, `Redis`의 데이터가 들어갈 때, `keyspace`에 `prefix`를 지정할 수 있게 된다.
즉, `enum` 타입의 `location`의 값이 `OSAKA`일 경우 `area:OSAKA`라는 값으로 저장된다.

해당 데이터의 생명 주기를 지정하려면 `timeToLive` 속성을 추가로 주면 된다.

또한, 아래와 같이 `CrudRepository`를 상속 받으면,
`Redis`를 `JPA`와 동일하게 사용할 수 있다.

```java
public interface AreaRepository extends CrudRepository<Area, Location> {

}
```

이후에는 평소 JPA를 이용한 개발과 동일하게 하면 된다.

### 🐳 도커

#### Dockerfile

프로젝트 최상위에 `Dockerfile`을 생성하고, 아래와 같이 넣어준다.

```bash
# 자바 버전은 본인 프로젝트 자바 버전과 맞춰준다.
FROM openjdk:17-oracle
COPY build/libs/{project-name}-0.0.1-SNAPSHOT.jar {build-name}.jar
EXPOSE 8080
ENTRYPOINT exec java -jar {build-name}.jar
```

{project-name} : `build/libs/` 경로에 있는 `jar` 파일 이름

{build-name} : `docker`에 배포할 새로운 파일 이름

```bash
# 예시
FROM openjdk:17-oracle
COPY build/libs/test-project-0.0.1-SNAPSHOT.jar test.jar
EXPOSE 8080
ENTRYPOINT exec java -jar test.jar
```

#### docker-compose.yml

`Dockerfile`과 동일하게 프로젝트 최상위에 `docker-compose.yml`을 생성하고, 아래와 같이 넣어준다.

```yaml
version: '3.4'

services:
  redis:
    image: redis
    ports:
      - "6379:6379"
    container_name: redis

  festival-api:
    build:
      context: .
      dockerfile: ./Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - redis
    container_name: {build-name}
```

뭘 넣어도 상관은 없지만, 구분하기 쉽게 `Dockerfile`에서 작성한 `build-name`을 그대로 넣어주면 된다.

```yaml
# 예시
...
container_name: test
```

## 🎁 빌드

### Spring 빌드

`gradle`이 설치되어 있는 경우 아래 명령어를 통해서 `jar` 파일로 빌드해준다.

> `application.yaml`에 `host`를 `redis`로 설정 후 진행해야함

```bash
.\gradlew.bat build
```

만약, 설치가 되어 있지 않을 경우 `New UI` 기준 `IDE` 우측 `gradle` 아이콘을 통해 `build`를 진행해준다.

<center>
    <img width="344" alt="image" src="https://github.com/Jwhyee/japan-festival-api/assets/82663161/6e3201fb-3bb4-410c-81b2-870c12676a16">
</center>

### Docker 빌드

`IntelliJ` 터미널을 이용해서 아래 명령어를 입력해준다.

```bash
docker-compose -f "docker-compose.yml" up -d --build  
```

빌드에 성공했다면 아래 명령어를 통해 잘 실행이 되고 있는지 확인해보면 된다.

```bash
docker ps
```

![image](https://github.com/Jwhyee/japan-festival-api/assets/82663161/5adbc1f4-e7d2-4363-a243-44428c9917d5)

혹은 `Docker` 어플리케이션을 통해 확인해도 된다.

![image](https://github.com/Jwhyee/japan-festival-api/assets/82663161/34340e26-a819-4e83-9325-3a064d22fac8)

## 🧩 테스트

`Postman`을 이용해서 로컬에 요청을 보내거나 `localhost:8080`에 접속해서 상태를 확인하면 된다.

