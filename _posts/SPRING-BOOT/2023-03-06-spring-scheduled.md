---
title: "[Spring] - Spring Scheduler"
last_modified_at: 2023-03-06T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - Opinet
  - Spring Scheduling
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 개발 환경

🍃 Spring : Spring Boot 2.7.7 + Spring Security

🛠️ Java : Amazon corretto 17

설명하기 앞서 해당 포스트는 개발 과정을 기록하기 위한 글입니다. 필요한 부분은 본인 프로젝트에 맞춰서 수정해주시면 감사하겠습니다!
{: .notice--warning}

## Spring Scheduler란?

스프링에서 제공하는 스케쥴링 기능으로, 원하는 주기로 작업을 실행하거나, 특정 시간에 작업을 실행하도록 설정할 수 있다.

## 프로젝트 적용

> Opinet을 통해 하루 평균 유가 정보를 주기적으로 받아오기 위해 사용

### Application Setting

프로젝트 어플리케이션 클래스단에 `@EnableScheduling` 어노테이션을 추가해준다. 
또한, 로컬에서는 잘 작동할 수 있지만, 배포 환경에서는 다를 수 있기 때문에 
`JVM`의 기본 시간대를 설정하기 위해 `TimeZone`을 설정해준다.

해당 어노테이션 없이 아래 내용을 진행하면 스케쥴이 정상적으로 진행되지 않을 수 있다.

```java
@SpringBootApplication
@EnableScheduling
public class TestApplication {
  
    @PostConstruct
	void started() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}

	public static void main(String[] args) {
		SpringApplication.run(TestApplication.class, args);
	}

}
```

### Schedule 클래스 생성

`@Component` 어노테이션을 통해 `Bean`에 등록해주어 사용한다.

`@Bean`과 `@Component`의 차이는 [향로님 블로그](https://jojoldu.tistory.com/27)에 잘 정리되어 있으니 확인해보면 좋겠다!

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class TestScheduler {
    
    @Scheduled(cron = "0 0 3 * * ?")
    public void testSchedule() {

    }

}

```

#### cron 속성 값

```bash
┌───────────── 초 (0 - 59)
│ ┌───────────── 분 (0 - 59)
│ │ ┌───────────── 시간 (0 - 23)
│ │ │ ┌───────────── 일 (1 - 31)
│ │ │ │ ┌───────────── 월 (1 - 12 or JAN-DEC)
│ │ │ │ │ ┌───────────── 요일 (0 - 7 or SUN-SAT)(일요일을 나타내는 0과 일요일의 별명인 7 둘 다 허용)
│ │ │ │ │ │
│ │ │ │ │ │
* * * * * *
0 0 3 * * ? -> 매일 오전 3시
0 0 0 ? * MON#2 -> 매월 두 번째 주 월요일 자정에 실행
```

- `*` : 해당 필드의 모든 값
- `?` : 해당 필드 값을 사용하지 않음

### 유가 정보

> 전국적으로 하루 평균 유가 정보를 받아오기 위해 Opinet의 유가정보 API 사용

- 유가 정보를 받아오기 위해서는 [공식 사이트](https://www.opinet.co.kr/user/custapi/custApiInfo.do)에 들어가서 Email로 신청해야한다.
- 신청 후 최대 3일 이내에 Api Key를 발급 받을 수 있으며, `applicaion.yml`에 저장해둔다.

```yaml
spring:
  profiles:
    active: dev
    include:
      - base-addi
opinet:
  api:
    key: 0123456789
```

사이트에 있는 무료 API 이용가이드에 나와있듯이 업데이트 시각은 아래와 같다.

| 구분         | 시각                         |
|------------|----------------------------|
| 현재 판매가격    | 1시, 2시, 9시, 12시, 16시, 19시  |
| 일일 평균가격    | 24시                        |
| 주간 평균가격    | 금요일 10시                    |
| 요소수 판매가격   | 7시, 13시, 18시, 24시          |

필자는 업데이트가 된 이후 시간인 오전 3시로 지정하였고, `RestTemplate`을 통해 받아오는 방식으로 구현

<center>
    <img src="https://user-images.githubusercontent.com/82663161/223020521-0cf7b263-f823-4a17-9b80-04589ee3947c.png">
</center>

기본적으로 데이터를 `xml` 타입으로 받아오면 `pretty`로 잘 정렬되서 나오지만, `JSON`은 사진과 같이 조금 이상한 모양으로 나오게 된다.
때문에 바로 `JSONObject`로 받아오는 것이 아닌 `String`으로 받아와 `JSONObject`로 만들어주는 방식을 택했다.

```java
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestScheduler {

    @Value("${opinet.api.key}")
    private String REST_API_KEY;
    private final int GASOLINE_NUM = 1;
    private final int DIESEL_NUM = 2;
    private final FuelCostRepository fcRepository;

    @Scheduled(cron = "0 0 3 * * ?")
    public void initTodayAvgFuelCost() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        
        // 하루 평균 가격을 받아오는 url 지정 + code는 필수 사항이며, 이메일 신청을 통해 발급 가능
        String url = "http://www.opinet.co.kr/api/avgAllPrice.do?code=%s&out=json".formatted(REST_API_KEY);
        
        // 요청을 보낸 뒤, String 타입으로 받아옴
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), String.class);

        // 받아온 String을 토대로 Json 형태로 변환
        JSONObject jsonObject = convertToJson(response.getBody());

        int gasolinePriceAvg = getFuelCost(jsonObject, GASOLINE_NUM);
        int dieselPriceAvg = getFuelCost(jsonObject, DIESEL_NUM);

        fcRepository.save(FuelCost.builder()
                .gasolinePrice(gasolinePriceAvg)
                .dieselPrice(dieselPriceAvg)
                .baseDate(LocalDate.now())
                .build());

    }

    /**
     * Json 형태의 문자열을 JSONObject로 변환하는 함수
     * @param jsonString REST API를 통해 받아온 유가 정보 문자열
     * @return String to JSONObject
     * */
    public static JSONObject convertToJson(String jsonString) {
        JSONObject jsonObject = null;
        try {
            // JSON 데이터를 파싱하여 JSONObject로 변환
            JSONParser jsonParser = new JSONParser();
            jsonObject = (JSONObject) jsonParser.parse(jsonString);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    /**
     * JSON 객체에서 유가 정보를 받아오는 함수
     * @param jsonObject 유가 정보가 담긴 JSONObject
     * @param sort 휘발유와 경유를 나누기 위한 변수(1 : 휘발유, 2 : 경유)
     * @return 구분에 맞는 평균 리터 가격
     * */
    public int getFuelCost(JSONObject jsonObject, int sort) {
        // RESULT > OIL > FUEL INFO로 나뉘기 때문에 RESULT 내부 정보를 꺼내옴
        JSONObject result = (JSONObject) jsonObject.get("RESULT");
        
        // OIL 내부에는 여러개의 유가 정보가 담겨 있기 때문에 JSONArray로 변환
        // 0번 : 고급 휘발유, 1번 : 휘발유, 2번 : 경유 ...
        JSONObject gasoline = ((JSONObject) ((JSONArray) result.get("OIL")).get(sort));
        
        // 해당 정보에서 가격 부분의 소수점을 제외한 천원 단위만 가져옴
        // 필요 시 subString을 하지 않고, 실수 타입으로 변환해도 상관 없음
        String price = gasoline.get("PRICE").toString().substring(0, 4);
        return Integer.parseInt(price);
    }

}
```

```json
{"RESULT":
    {"OIL":[
      {
        "TRADE_DT":"20230306",
        "PRODCD":"...",
        "PRODNM":"고급휘발유",
        "PRICE":"1851.79",
        "DIFF":"+0.0"
      },
      {
        ...
      }
    ]}
}
```

## 🤔 회고

예전에 기존 부트와 다른 프로젝트에서 `Scheduling`을 통해 디비 연동을 하는 방법에 대해 공부한 적이 있는데 당시에는 너무 어렵게 느껴지기도 했고, 정리를 제대로 못한 것이 후회스럽다.

이번에 새로 스케쥴링을 적용하면서 흐름에 대해 이해할 수 있었고, 이전에 만들어놓은 코드를 보며 복기를 하는 시간을 가져야겠다!

## 레퍼런스

- [Spring Docs](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#scheduling)