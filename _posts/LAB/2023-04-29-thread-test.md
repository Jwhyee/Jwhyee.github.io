---
title: "[Spring] - 쓰레드풀 테스트"
last_modified_at: 2023-04-29T21:00:37-21:30
categories: LAB
tags:
  - SpringBoot
  - Thread
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 개발 환경

🍃 Spring : Spring Boot 3.0.6

🛠️ Java : Amazon corretto 17

🖇️ URL : [Github Repository](https://github.com/Jwhyee/thread_test) 

## 👨‍🔬 실험 내용

Spring MVC를 공부하던 중, Thread Pool의 크기를 조정한 뒤에 여러 요청을 보내면 어떤 결과가 나올지 궁금해 진행!

## 🛠️ 프로젝트 생성

기본적으로 많은 기능은 필요 없기 때문에 최소한의 기능만 `dependencies`에 추가했다!

```shell
implementation 'org.springframework.boot:spring-boot-starter-aop:3.0.2'
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
implementation 'org.springframework.boot:spring-boot-starter-data-jdbc'
```

```java
@RestController
public class RequestController {
    
  private final Map<Long, Request> repo = new HashMap<>();
  private Long requestId = 1L;

  @PostMapping("/")
  public Request doMemoryRequest(RequestDto dto) {
    Request newReq = Request.builder()
            .id(requestId++)
            .title(dto.getRequestTitle())
            .savedDate(LocalDateTime.now())
            .build();
    repo.put(requestId, newReq);
    log.info("request = {}", newReq);
    return newReq;
  }

  @GetMapping("/data")
  public Object showMemoryData() {
    log.info("data_size={}", repo.size());
    return repo;
  }
}
```

## 📝 테스트

총 400개의 요청에 대한 시간 측정

```yaml
# 활성 쓰레드 1개 세팅
server:
  tomcat:
    threads:
      # 최대 실행 가능 Thread 수 (Default : 200)
      max : 1
      # 항상 대기 중인 최소 Thread 수 (Default : 10)
      min-spare : 1
    # 모든 쓰레드가 사용 중 일 때 들어온 요청이 대기하는 최대 큐의 길이 (Default: 100)
    accept-count : 5
```

```yaml
# 활성 쓰레드 100개 세팅
server:
  tomcat:
    threads:
      # 최대 실행 가능 Thread 수 (Default : 200)
      max : 100
      # 항상 대기 중인 최소 Thread 수 (Default : 10)
      min-spare : 10
    # 모든 쓰레드가 사용 중 일 때 들어온 요청이 대기하는 최대 큐의 길이 (Default: 100)
    accept-count : 100
```

### 1차 테스트(Postman)

Postman에서 제공하는 Runner를 이용해 테스트 진행

<center>
    <img width="920" alt="스크린샷 2023-04-29 오후 8 00 03" src="https://user-images.githubusercontent.com/82663161/235299198-2ba133e9-7cd2-4f5b-8cd0-80f775290434.png">
</center>

#### 활성 쓰레드 1개

<center>
    <img width="686" alt="스크린샷 2023-04-29 오후 6 50 49" src="https://user-images.githubusercontent.com/82663161/235296522-297ecff5-8d4f-4f31-a57a-405c783ad97c.png">
</center>

⏰ 소요 시간 : 5s 738ms

#### 활성 쓰레드 100개

<center>
    <img width="670" alt="스크린샷 2023-04-29 오후 6 49 24" src="https://user-images.githubusercontent.com/82663161/235296467-60763f5f-5cd6-41a5-8a86-13be6dad13b0.png">
</center>

⏰ 소요 시간 : 5s 640ms

### 2차 테스트(CURL)

<center>
    <img width="323" alt="스크린샷 2023-04-29 오후 9 13 55" src="https://user-images.githubusercontent.com/82663161/235301958-b07a9acf-2763-46df-8932-51f6585782c3.png">
</center>

CURL을 통해 요청 로그 기준으로 시작 시간과 종료 시간의 차로 비교

#### 활성 쓰레드 1개

<table align="center" style="text-align: center; margin: 0 auto">
  <thead style="font-weight: bold;">
    <td>구분</td>
    <td>1차 시도</td>
    <td>2차 시도</td>
  </thead>
  <tbody>
    <tr>
      <td>시작</td>
      <td>19:12:16.219</td>
      <td>19:14:45.725</td>
    </tr>
    <tr>
      <td>종료</td>
      <td>19:12:17.162</td>
      <td>19:14:46.519</td>
    </tr>
    <tr>
      <td>소요 시간</td>
      <td>0s 943ms</td>
      <td>0s 794ms</td>
    </tr>
    <tr>
      <td>저장 개수</td>
      <td>400</td>
      <td>400</td>
    </tr>
  </tbody>
</table>

#### 활성 쓰레드 100개

<table align="center" style="text-align: center; margin: 0 auto">
  <thead style="font-weight: bold;">
    <td>구분</td>
    <td>1차 시도</td>
    <td>2차 시도</td>
  </thead>
  <tbody>
    <tr>
      <td>시작</td>
      <td>19:26:44.614</td>
      <td>19:28:26.715</td>
    </tr>
    <tr>
      <td>종료</td>
      <td>19:26:45.577</td>
      <td>19:28:27.603</td>
    </tr>
    <tr>
      <td>소요 시간</td>
      <td>0s 963ms</td>
      <td>0s 888ms</td>
    </tr>
    <tr>
      <td>저장 개수</td>
      <td>376</td>
      <td>362</td>
    </tr>
  </tbody>
</table>

## 💡 결과

### 로그 메시지 분석

```shell
nio-8080-exec-1
io-8080-exec-7
```

#### Non-blocking I/O(nio)

- 비동기식 I/O 모델에서 사용
- 작업이 완료될 때까지 대기하지 않음
  - 다른 작업을 함께 수행 가능
  - 작업이 완료될 때까지 반복적으로 확인하고, 완료되면 결과 즉시 반환
- CPU 시간을 차지하지 않음 → 시스템의 전반적인 처리량 향상

#### Blocking I/O(io)

- 동기식 I/O 모델에서 사용
- 작업이 완료될 때까지 대기(블록)
  - 작업이 완료되면 결과 즉시 반환
- 대기하는 동안 CPU 시간 차지 → 시스템의 전반적인 처리량 저하

#### exec-n

- exec : Servlet 컨테이너에서 사용하는 스레드 풀(Executor)
- n : 해당 요청을 처리하는 스레드의 ID

### Postman 결과

<table style="margin: 0 auto">
    <tr>
        <td>
            <img width="450" alt="스크린샷 2023-04-29 오후 7 56 51" src="https://user-images.githubusercontent.com/82663161/235299040-bdb7832c-3d7f-4038-a5f6-71ae56e5a350.png">
        </td>
        <td>
            <img width="450" alt="스크린샷 2023-04-29 오후 7 55 40" src="https://user-images.githubusercontent.com/82663161/235298992-72fe5280-30b5-4898-b1d7-c688c656248a.png">
        </td>
    </tr>
    <tr>
        <td align="center">
            쓰레드 1개 
        </td>
        <td align="center">
            쓰레드 100개
        </td>
    </tr>
</table>
<br>

총 400개의 요청을 Delay가 없도록 보냈지만, 어느정도의 Delay가 존재하는 것을 로그 시간을 보면 알 수 있다.
원하던 결과는 아니지만, `Non-blocking I/O` 방식의 총 9개의 쓰레드를 사용한 것을 로그를 통해 알 수 있었다.

### CURL 결과

<table style="margin: 0 auto">
    <tr>
        <td>
            <img width="450" alt="스크린샷 2023-04-29 오후 7 52 47" src="https://user-images.githubusercontent.com/82663161/235298906-7c324644-4304-498c-8f4f-7ecd396f179a.png">
        </td>
        <td>
            <img width="450" alt="스크린샷 2023-04-29 오후 7 58 50" src="https://user-images.githubusercontent.com/82663161/235299116-8c63cfaf-d41c-467e-909e-ffbd3f17ffa2.png">
        </td>
    </tr>
    <tr>
        <td align="center">
            쓰레드 1개 
        </td>
        <td align="center">
            쓰레드 100개
        </td>
    </tr>
</table>
<br>

총 400개의 데이터 중에 일부만 저장되었고, `Non-blocking I/O`, `Blocking I/O` 두 방식 모두 사용한 것을 확인할 수 있다.
둘 이상의 스레드가 공유 자원에 동시에 접근하려고 할 때, 그 결과 값이 각 스레드의 수행 순서나 타이밍 등에 의해 달라져 **경합 상태**가 일어난 것이다.

## 📝 추가 테스트

사실상 메모리에 중요한 아이디 정보를 보관하는 일은 없기 때문에, 아래와 같이 프로젝트 구조를 변경하고 다시 테스트를 진행해봤다.

- Entity 추가 (ID 자동 증가)
- JPA Repository 도입

```java
@RestController
@Slf4j
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping("/")
    public Request doRequest(RequestDto dto) {
        Request request = requestService.saveRequest(dto);
        log.info("request = {}", request);
        return request;
    }

    @GetMapping("/data")
    public Object showData() {
        Map<Long, Request> requestMap = requestService.listToMap();
        log.info("data_size={}", requestMap.size());
        return requestMap;
    }
}
```

```java
@Service
@RequiredArgsConstructor
public class RequestService {

  private final RequestRepository repository;

  public Request saveRequest(RequestDto dto) {
    return repository.save(Request.builder()
            .title(dto.getRequestTitle())
            .savedDate(LocalDateTime.now())
            .build());
  }

  @Transactional(readOnly = true)
  public Map<Long, Request> listToMap() {
    return repository.findAll().stream()
            .collect(Collectors.toMap(Request::getId, Function.identity()));
  }
}

```

JPA를 사용해 데이터를 저장했지만, 요청에 대한 시간은 이전과 비슷했다. 하지만, 이전과 다르게 400개의 데이터가 모두 안정적으로 저장되는 것을 알 수 있었다.


## 🤔 회고

코드를 변경하기 전에는 DB와 ID를 모두 메모리에 저장했기 때문에, 여러 쓰레드에서 동시에 접근할 경우 ID가 동일할 수 있다.
예시로 `requestId`가 15일 때, 3번과 9번 쓰레드가 동시에 요청을 처리한다고 가정하면,
9번에서 저장을 했다면, 3번 데이터는 덮어쓰기가 되는 것이다.
또한, 두 쓰레드에서 값이 증가되기 때문에 `requestId`가 17이 되버릴 수 있다.

하지만, JPA를 도입한 후에는 데이터가 정상적으로 저장되는 것을 알 수 있었다. 그 이유는 각각의 요청이 Transaction을 통해 관리되기 때문이다.
여러 개의 트랜잭션에서 동시에 동일한 데이터를 수정하려 해도, 하나의 트랜잭션이 완료될 때까지 다른 트랜잭션은 접근할 수 없기 때문이다.
그러므로 JPA를 사용했을 때, 동시성 이슈가 발생하지 않았던 것이다. 

만약, 꼭 Memory를 이용해서 저장해야할 경우, 아래 코드와 같이 `synchronized`를 추가해주면 동시성 이슈를 해결할 수 있다.
이는, 멀티 쓰레드 환경에서 공유 자원을 동기화시켜 여러 쓰레드가 공유 자원에 동시에 접근하지 못하도록 제한하는 것이다.

```java
@RestController
@Slf4j
public class RequestController {
    
    private final Map<Long, Request> repo = new HashMap<>();
    private Long requestId = 1L;

    @PostMapping("/")
    public synchronized Request doMemoryRequest(RequestDto dto) {
        Request newReq = Request.builder()
                .id(requestId++)
                .title(dto.getRequestTitle())
                .savedDate(LocalDateTime.now())
                .build();
        repo.put(requestId, newReq);
        log.info("request = {}", newReq);
        return newReq;
    }

    @GetMapping("/data")
    public Object showMemoryData() {
        log.info("data_size={}", repo.size());
        return repo;
    }
}

```

## 레퍼런스

- [오리엔탈킴님 블로그](https://kim-oriental.tistory.com/47)
- [코드 연구소님 블로그](https://jhyeok.com/api-parallel-request/)
