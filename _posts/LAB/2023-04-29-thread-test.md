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

```java
@RestController
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    Map<Long, RequestDto> repo = new HashMap<>();
    private Long requestId = 1L;

    @Getter @Setter
    public static class RequestDto {
        private String requestTitle;
        private LocalDateTime savedDate;
    }

    @PostMapping("/")
    public Object doRequest(RequestDto dto) {
        dto.setSavedDate(LocalDateTime.now());
        repo.put(requestId++, dto);
        requestService.pooh(requestId);
        return repo;
    }
}

@Service
public class RequestService {

    public void pooh(long id) {
        long sum = id;
        for (int i = 0; i < 100; i++) {
            for (int j = 0; j < 100; j++) {
                sum += i * j;
            }
        }
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
- Iterations : 400
- Delay : 0

<center>
    <img width="920" alt="스크린샷 2023-04-29 오후 8 00 03" src="https://user-images.githubusercontent.com/82663161/235299198-2ba133e9-7cd2-4f5b-8cd0-80f775290434.png">
</center>

#### 활성 쓰레드 1개

<center>
    <img width="686" alt="스크린샷 2023-04-29 오후 6 50 49" src="https://user-images.githubusercontent.com/82663161/235296522-297ecff5-8d4f-4f31-a57a-405c783ad97c.png">
</center>

- ⏰ 소요 시간 : 5s 738ms

#### 활성 쓰레드 100개

<center>
    <img width="670" alt="스크린샷 2023-04-29 오후 6 49 24" src="https://user-images.githubusercontent.com/82663161/235296467-60763f5f-5cd6-41a5-8a86-13be6dad13b0.png">
</center>

- ⏰ 소요 시간 : 5s 640ms

### 2차 테스트(CURL)

<center>
    <img width="323" alt="스크린샷 2023-04-29 오후 9 13 55" src="https://user-images.githubusercontent.com/82663161/235301958-b07a9acf-2763-46df-8932-51f6585782c3.png">
</center>

CURL을 통해 요청 로그 기준으로 시작 시간과 종료 시간의 차로 비교

#### 활성 쓰레드 1개

1차 시도
- 시작 : 19:12:16.219
- 종료 : 19:12:17.162
- ⏰ 소요 시간 : 0s 943ms
- 💾 저장 개수 : 400

2차 시도
- 시작 : 19:14:45.725
- 종료 : 19:14:46.519
- ⏰ 소요 시간 : 0s 794ms
- 💾 저장 개수 : 400

#### 활성 쓰레드 100개

1차 시도
- 시작 : 19:26:44.614
- 종료 : 19:26:45.577
- ⏰ 소요 시간 : 0s 963ms
- 💾 저장 개수 : 376

2차 시도
- 시작 : 19:28:26.715
- 종료 : 19:28:27.603
- ⏰ 소요 시간 : 0s 888ms
- 💾 저장 개수 : 362

## 🤔 회고

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
    <th colspan="2" align="center">
        <p>POSTMAN</p>
    </th>
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
원하던 결과는 아니지만, `Non-blocking I/O` 방식의 총 10개의 쓰레드를 사용한 것을 로그를 통해 알 수 있었다.

### CURL 결과

<table style="margin: 0 auto">
    <th colspan="2" align="center">
        <p>CURL</p>
    </th>
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

사실상 메모리에 중요한 아이디 정보를 보관하는 일은 없기 때문에, 아래와 같이 프로젝트 구조를 변경하고 다시 테스트를 진행해봤다.

- Entity 추가 (ID 자동 증가)
- JPA Repository 도입

시간은 비슷하게 걸렸지만, 400개의 데이터 모두 정상적으로 저장된 것을 확인할 수 있었다.

## 레퍼런스

- [오리엔탈킴님 블로그](https://kim-oriental.tistory.com/47)
- [코드 연구소님 블로그](https://jhyeok.com/api-parallel-request/)
