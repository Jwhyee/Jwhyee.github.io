---
title: "[Spring] - Kakao Maps Api로 현재 도로명 주소 받아오기"
last_modified_at: 2023-01-18T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - KakaoMapsApi
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 💨 요청 흐름

1. JS로 현재 위도, 경도 받아오기
2. 받아온 값을 BackEnd 서버로 전달
3. Kakao Maps Api에 요청 보내기
4. 도로명 주소 출력하기

## 🗺️ 현재 위도, 경도 받아오기

> `JavaScript`에서 제공해주는 기능 중 `geolocation`을 사용

### geolocation

우선 `geolocation`의 함수 모양부터 살펴보자!

```javascript
navigator.geolocation.getCurrentPosition(successFn, failedFn);

function successFn(position) {
    // 위도
    const lat = position.coords.latitude;
    // 경도
    const lng = position.coords.longitude;
    // 사용자 정의
}

function failedFn(positionError) {
    // 사용자 정의
}
```

위 코드처럼 성공했을 때는 `position`을 받아와 사용이 가능하고, 실패할 경우 `positionError`를 매개변수로 사용할 수 있게 된다. 

### 🛠️ 코드 구현

```javascript
function setLocation() {
    navigator.geolocation.getCurrentPosition(function (position){
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        $('#location').attr('value', lat + "," + lng);
    }, function (){
        Swal.fire({
            icon: 'question',
            html: '위치 정보를 가져올 수 없습니다.<br>위치 정보 허용을 해주세요.',
        })
    });
}
```

`form`에 위도, 경도에 대한 데이터를 담아서 보낼 예정이기 때문에 위와 같이 `input`에 값을 추가해주었다.

## 🕹️ 받아온 데이터 사용하기

### Controller

```java
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TestController{

    private final KakaoMapsApiRestTemplate template;
    
    @PostMapping("/location")
    public String getLocation(@RequestBody Map<String, Object> datum) {
        String inputLocation = (String) datum.get("location");
        String locationAddressName = template.getLocationAddressName(inputLocation);
        return "...";
    }
}
```

사용자가 입력한 `form`의 값을 `json` 형태로 받아오기 위해 `Map<String, Object>` 형태로 받아온다.
다른 데이터는 제외하고 `location`만 사용할 예정이기 때문에 `Mapper`를 사용하지 않고 바로 가져와 문자열 형태로 변환해준다!

### RestTemplate

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class KakaoMapsApiRestTemplate {

    // properties에 등록해놓은 Kakao Rest Api Key
    @Value("${kakao.api.key}")
    private String REST_API_KEY;

    /**
     * 현재 위치에 대한 정보를 받아오기 위한 메소드
     * @param currentLat JS를 통해 받아온 위도
     * @param currentLng JS를 통해 받아온 경도
     * @return RestTemplate을 통해 받아온 JSON(Map) 결과 반환
     * */
    public Map<String, Object> getCurrentPosInfo(String currentLat, String currentLng) {
        // 받아온 위도, 경도를 가지고 KakaoMapsApi에 조회 
        String url = "https://dapi.kakao.com/v2/local/geo/coord2address.json?x={currentLng}&y={currentLat}";
        return getRestTemplateResult(url, currentLat, currentLng);
    }

    /**
     * Kakao Maps Api에 요청을 보내기 위한 함수
     * @param currentLat 사용자의 위도
     * @param currentLng 사용자의 경도
     * @return 조회를 통해 받아온 JSON(Map) 결과 반환
     * */
    public Map<String, Object> getRestTemplateResult(String url, String currentLat, String currentLng) {
        // Kakao Maps Api에 요청을 보내기 위한 RestTemplate
        RestTemplate restTemplate = new RestTemplate();
        
        // Authorization에 secret key를 담아 요청
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + REST_API_KEY);

        // 요청을 보낸 뒤, 받아온 값을 response에 저장
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class, currentLng, currentLat);
        return response.getBody();
    }

    /**
     * JSONObject 형식으로 반환된 데이터 중에서 address_name만 받아오는 함수
     * @param json RestTemplate 요청을 통해 받아와 변환한 데이터
     * @return 사용자의 address_name을 반환
     * */
    public String getAddressName(JSONObject json) {
        JSONObject address = (JSONObject) json.get("address");
        return (String) address.get("address_name");
    }
}
```

> 코드의 길이가 너무 길어 `JSONObject`로 변환하는 과정과 일부 함수는 담지 못했습니다.

위 코드의 흐름대로 진행되며, 현재 사용자의 위치의 도로명 주소를 구할 수 있다.

현재 좌표에 대한 주소 말고도 더 다양한 기능이 있으니 자세한 내용은 [공식문서](https://developers.kakao.com/docs/latest/ko/local/dev-guide)를 참고하는게 좋을 것 같다!

### 🤔 회고

이전에 `Kakao Maps Api`를 사용할 때는 어렵다고 느껴졌는데, 시간이 지나 다시 사용해보니 생각보다 어렵지 않은 느낌이 들었다.
아직은 `JSON` 형태를 받아와 변환하는 과정이 익숙하진 않지만, 금방 감을 익힐 수 있을 것 같다!