---
title: "[Spring] - Naver Api로 상품 검색 목록 받아오기"
last_modified_at: 2023-08-23T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - OpenApi
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 💨 요청 흐름

1. 사용자가 게시글 작성
2. 해당 게시글의 제목과 관련된 상품 목록 받아오기

## Naver Developers 등록

[링크](https://developers.naver.com/apps/#/register)에 들어가 사진과 같이 작성한다.

![스크린샷](https://github.com/Jwhyee/effective-java-study/assets/82663161/15509652-09a0-48bd-ad15-c794d2650bd2)

현재 포스팅에서 진행할 내용은 `검색` API이며, 이 외에 필요한 API는 추가로 넣어도 무관하다.

## Spring Boot 적용

모든 자세한 설명은 [공식 문서](https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md#%EC%87%BC%ED%95%91-%EA%B2%80%EC%83%89-%EA%B2%B0%EA%B3%BC-%EC%A1%B0%ED%9A%8C)에 잘 나와있습니다!<br>
공식 문서를 한 번 읽어보신 후 제 글을 봐주시면 감사하겠습니다! 😃

### application.yml

Developers에서 어플리케이션을 등록하면, **Client ID**, **Client Secret**을 발급해준다.
이를 `application.yml` 설정 파일에 복사해서 넣어주면 된다.

> 단, 테스트라도 Secret 키는 외부에 공개되면 좋지 않기 때문에 설정 파일은 가능한 `.gitignore`에 등록해준다.

```yaml
naver:
  client-id : ...
  client-secret : ...
```

만약 `application.properties`를 사용 중이라면, 아래와 같이 만들면 된다.

```bash
naver.client-id : ...
naver.client-secret : ...
```

### Template 생성

```java
@Component
public class NaverSearchApi {

    @Value("${naver.client-id}")
    private String CLIENT_ID;

    @Value("${naver.client-secret}")
    private String CLIENT_SECRET;

    private static final String REQUEST_URL = "https://openapi.naver.com/v1/search/shop.json?";
    private static final String PARAMETER_INFO = "query=%s&display=%d&start=1&sort=%s";
}
```

`@Component`를 통해 빈 등록을 해주고, `@Value()`를 통해 설정 파일에 있는 값을 가져온다.
`REQUEST_URL`은 변경될 일이 없고, 호출 빈도가 잦기 때문에 `static final` 키워드를 붙여 정적 변수로 저장해둔다.

```java
@Component
@Slf4j
public class NaverSearchApi {
    
    // 기존 코드 생략
    ...

    // 요청을 보낼 때 함께 보낼 파라미터
    // 자세한 내용은 공식 문서 확인
    private final int DISPLAY = 5;
    private final String SORT = "sim";

    /**
     * @apiNote 네이버에 요청을 보내는 메소드
     * @param keyword 네이버 쇼핑에 검색할 키워드
     * */
    public List<Map<String, String>> getResult(String keyword) {
        // 키워드를 UTF-8 인코딩
        String encodedKeyword = keyword;
        try {
            encodedKeyword = URLEncoder.encode(keyword, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

        // 요청 URL에 파라미터와 그에 맞는 값 매핑
        String requestUrl = REQUEST_URL + PARAMETER_INFO.formatted(encodedKeyword, DISPLAY, SORT);

        // 요청을 보내기 위한 RestTemplate
        RestTemplate restTemplate = new RestTemplate();
        
        // 공식 문서에 나와 있듯이, 요청 헤더에 클라이언트 아이디 및 시크릿 추가
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", CLIENT_ID);
        headers.set("X-Naver-Client-Secret", CLIENT_SECRET);

        // RestTemplate을 이용해 필요한 정보를 담아 요청을 보내 값을 String 타입으로 반환(exchange) 받음
        ResponseEntity<String> responseEntity = restTemplate.exchange(requestUrl, HttpMethod.GET, new HttpEntity<>(headers), String.class);
        
        // RestTemplate을 통해 반환 받은 Map을 JSON 형식으로 변환 후 가공한 다음 Controller에 반환
        return getJsonObject(responseEntity.getBody());
    }
}
```

위와 같이 요청을 보내면 아래와 같은 결과가 나오게 된다.

```json
{
    "lastBuildDate": "Wed, 23 Aug 2023 19:49:07 +0900",
    "total": 8448,
    "start": 1,
    "display": 2,
    "items": [
        {
            "title": "<b>2021 맥북 프로 M2</b> M1 Pro Max 16인치 A2780",
            "link": "...",
            "image": "...",
            "lprice": "21210",
            "hprice": "",
            "mallName": "...",
            "productId": "...",
            "productType": "2",
            "brand": "",
            "maker": "",
            "category1": "디지털/가전",
            "category2": "노트북",
            "category3": "",
            "category4": ""
        },
        {
            "title": "<b>2021 맥북 프로 M2</b> M1 Pro Max 14인치 A",
            "link": "...",
            "image": "...",
            "lprice": "22380",
            "hprice": "",
            "mallName": "...",
            "productId": "...",
            "productType": "2",
            "brand": "",
            "maker": "",
            "category1": "디지털/가전",
            "category2": "노트북",
            "category3": "",
            "category4": ""
        }
    ]
}
```

이제 우리에게 필요한 `items`에 있는 내용만 빼면 된다.
이후 코드에서 `List<Map<String, String>>` 형태가 나오는데 해당 코드는 아래와 같이 이해하면 된다.

하나의 검색 결과가 Key : Value 형태로 합쳐져 하나의 Map을 이룸

```json
{
    "title": "<b>2021 맥북 프로 M2</b> M1 Pro Max 16인치 A2780",
    "link": "...",
    "image": "...",
    "lprice": "21210",
    "hprice": "",
    "mallName": "...",
    "productId": "...",
    "productType": "2",
    "brand": "",
    "maker": "",
    "category1": "디지털/가전",
    "category2": "노트북",
    "category3": "",
    "category4": ""
}
```

즉, `List` 자체에는 검색 결과의 개수가 담기는 것이고,
`Map` 자체에는 한 검색 결과에 대한 상세 값들이 담기는 것이다.

아래 코드에서 사용할 JSON은 json-simple 라이브러리이다.

```bash
implementation 'com.googlecode.json-simple:json-simple:1.1.1'
```

그럼 위 검색 결과에서 필요한 정보만 가져와 가공하는 코드를 작성해보자!

```java
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

public class NaverSearchApi {
    
    // 기존 코드 생략
    ...

    /**
     * @apiNote RestTemplate을 통해 받아온 데이터를 가공하는 메소드
     * @param resultData RestTemplate을 통해 받아온 JSON 형태의 문자열 데이터
     * */
    private List<Map<String, String>> getJsonObject(String resultData) {
        // Key : Value 짝으로 된 하나의 검색 결과
        List<Map<String, String>> extractedItems = new ArrayList<>();
        
        // 앞서 RestTemplate을 통해 반환 받은 문자열을 JSONObject(Json 객체)로 변환
        JSONObject json = (JSONObject) JSONValue.parse(resultData);
        
        // 변환한 JSON 객체에서 키 값이 item인 부분만 가져옴
        JSONArray documents = (JSONArray) json.get("items");
        
        // item에 담긴 검색 결과를 탐색하며, 필요한 데이터만 가공
        for (Object item : documents) {
            
            // 필요한 데이터만 저장하기 위해 Map 생성 
            Map<String, String> map = new LinkedHashMap<>();

            // JSONArray에서 꺼내온 객체가 Object 타입이기 때문에 JSONObject로 변환
            JSONObject obj = (JSONObject) item;
            
            // 필요한 값들만 가져와 map에 추가
            map.put("title", (String) obj.get("title"));
            map.put("link", (String) obj.get("link"));
            map.put("brand", (String) obj.get("brand"));
            map.put("lprice", (String) obj.get("lprice"));
            
            // 완성된 map을 최종 결과물 List에 추가
            extractedItems.add(map);
        }
        return extractedItems;
    }
}
```

이렇게 구성하면, 내가 원하는 데이터만 가져올 수 있게된다.

```json
{
    "title": "Apple <b>맥북</b> <b>프로</b> 14 2023년 <b>M2 Pro</b> 10코어 실버 (MPHH3KH/A)",
    "link": "...",
    "brand": "Apple",
    "lprice": "2600000"
},
{
    "title": "MNW93KH/A Apple <b>맥북</b><b>프로</b><b>m2</b> <b>맥북</b>16인치 2023 <b>M2 Pro</b> 1tb 그레이",
    "link": "...",
    "brand": "Apple",
    "lprice": "3189000"
},
{
    "title": "Apple <b>맥북</b> <b>프로</b> 16 2023년 <b>M2 Pro</b> 12코어 스페이스 그레이 (MNW93KH/A)",
    "link": "...",
    "brand": "Apple",
    "lprice": "3250000"
},
{
    "title": "Apple <b>맥북</b> <b>프로</b> 14 2023년 <b>M2 Pro</b> 10코어 스페이스 그레이 (MPHE3KH/A)",
    "link": "...",
    "brand": "Apple",
    "lprice": "2542000"
},
{
    "title": "Apple 2022 <b>맥북</b> <b>프로</b> 13 <b>M2</b>  스페이스 그레이  GPU 10코어  256GB  24GB  Z16R0001M",
    "link": "...",
    "brand": "Apple",
    "lprice": "2200000"
}
```

전체 코드는 [Github](https://github.com/Jwhyee/spring-boot-labs/blob/master/src/main/java/com/spring/labs/domain/web/controller/api/NaverSearchApi.java)를 참고해주세요!

### 🤔 회고

조금 더 효율적으로 데이터를 가져오고, 가공할 수 있도록 공부해야할 것 같다!