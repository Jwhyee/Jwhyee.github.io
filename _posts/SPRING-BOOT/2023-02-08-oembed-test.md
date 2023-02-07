---
title: "[Spring] - oEmbed를 통해 데이터 가져오기"
last_modified_at: 2023-02-08T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - oEmbed
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---
## oEmbed란?

> [공식문서](https://oembed.com/)<br>
> oEmbed is a format for allowing an embedded representation of a URL on third party sites. The simple API allows a website to display embedded content (such as photos or videos) when a user posts a link to that resource, without having to parse the resource directly. 

> oEmbed는 서드파티 사이트에서 URL을 삽입하여 표시할 수 있는 형식입니다.심플한 API를 사용하면 웹 사이트에서 해당 리소스에 대한 링크를 게시할 때 리소스를 직접 구문 분석할 필요 없이 내장된 콘텐츠(사진이나 비디오 등)를 표시할 수 있습니다.

즉, URL만을 가지고 영상이나 SNS 게시글의 상세 정보를 조회할 수 있다!

## 💨 요청 흐름

1. 사용자가 URL 입력
2. 받아온 URL 값을 BackEnd 서버로 전달
3. 각 플랫폼에 RestTemplate으로 요청 보내기
4. View에 출력하기

## 구현 과정

### 🪟 View Setting

![image](https://user-images.githubusercontent.com/82663161/217284477-602f686f-c041-4b30-b3c4-acb9215c16e7.png)

화면은 위와 같이 구성하였고, 사용자가 URL을 입력한 뒤 확인 버튼을 누르면 요청을 보내는 형태이다.

```javascript
$('#searchBtn').on("click", function (){
    let data = $('#searchForm').serialize();
    $.ajax({
        type: 'get',
        url: '/search',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: data,
        success: function(data) {
            viewSetting(data);
        },
        error: function(xhr, status, error) {
            $("#content span").text("");
            Swal.fire({
                icon: 'error',
                text: '오류가 발생했습니다.',
            });
        }
    });
});
```

사용자가 확인 버튼을 눌렀을 때 `form.serialize()`를 통해 하나의 `data`로 만들어 준다.

요청을 보내는 방식은 `ajax`를 활용하였고, 데이터를 불러오는 방식이기 때문에 `GET` 메소드를 활용하였다.

### 데이터 분석

```java
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
public class EmbedRestController {

    private final EmbedService embedService;

    @GetMapping("/search")
    public JSONObject doSearch(HttpServletRequest rq) {
        String url = rq.getParameter("url");
        JSONObject data = embedService.urlParser(url);
        return data;
    }
}
```

form에 대한 데이터를 보냈기 때문에 `HttpServletRequest`를 통해 `url`에 대한 값을 받아온다.

```java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmbedService {

    private final JsonService jsonService;

    public static final String YOUTUBE = "youtube";
    public static final String TWITTER = "twitter";
    public static final String VIMEO = "vimeo";

    public JSONObject urlParser(String url) {
        StringBuilder sb = new StringBuilder();

        if (url.contains(YOUTUBE)) {
            sb.append("https://www.youtube.com/oembed?url=https://youtube.com/watch?v=");
            sb.append(url.split("watch\\?v=")[1]);
            sb.append("&format=json");
        } else if (url.contains(TWITTER)) {
            sb.append("https://publish.twitter.com/oembed?url=https://twitter.com/");
            sb.append(url.split("twitter.com/")[1]);
            sb.append("&format=json");
        } else if (url.contains(VIMEO)) {
            sb.append("https://vimeo.com/api/oembed.json?url=");
            sb.append(url);
        } else {
            log.warn("URL Error={}", "잘못된 URL이 입력되었습니다.");
            return null;
        }

        return jsonService.getJsonObj(sb.toString());
    }

}
```

각 플랫폼에 대한 정보를 상수로 선언하였고, 요청이 들어온 URL이 어느 플랫폼인지 분석한다.<br>
플랫폼마다 `oembed`를 요청하는 `API`가 다르기 때문에 주의해야한다!

`.split()`은 `regex`이므로 `?`를 그대로 문자열로 나타내기 위해서는 `백슬래쉬(\)`로 구분해준다.

`oEmbed` 요청을 보낼 `URL`이 완성되면, 이를 `getJsonObj` 함수로 전달해준다.

```java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
@RequiredArgsConstructor
@Slf4j
public class JsonService {

    public JSONObject getJsonObj(String oEmbedUrl) {
        JSONObject object;
        try {
            URL url = new URL(oEmbedUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");

            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder sb = new StringBuilder();
            while ((inputLine = br.readLine()) != null) {
                sb.append(inputLine);
            }
            br.close();

            String result = sb.toString();

            JSONParser parser = new JSONParser();
            object = (JSONObject) parser.parse(result);
        } catch (IOException | ParseException e) {
            log.warn("Parsing Error={}", e.toString());
            e.printStackTrace();
            return null;
        }
        return object;
    }

}
```

`HttpURLConnection` 혹은 `RestTemplate` 둘 다 가능하지만, `RestTemplate`은 이전에 써본 경험이 있어 전자로 테스트를 해보겠다!

`connection`에 필요한 정보를 받아오기 위해 `RequestMethod`와 어느 타입으로 받아올지에 대한 `RequestProperty`를 기입해준다.

`connection.getInputStream()`을 통해 `oEmbedUrl`에 대한 요청을 받아오고, 이를 가져오기 위해 `BufferedReader`를 활용했다.

받아온 값들을 합치기 위해 `StringBuilder`를 이용해 문자열 형태의 JSON 데이터를 완성시켜준 뒤, `JSONParser`를 이용해 `JSONObject`로 변환해준다.

`URL`은 `IOException`, `JSONParser`는 `ParseException`이 발생할 수 있기 때문에
`try-catch` 문을 활용해 예외 상황에 대한 처리를 해준다.

> 필자는 View 단에서 `null`이 반환될 경우 사용자가 새로운 요청을 보내도록 처리해놓았다.

### Postman을 활용한 테스트

`MockMvc`를 통한 테스트도 가능하지만, 빠르게 데이터를 확인해보기 위해 `Postman`을 활용하였다.

우선 요청 링크가 맞는지 확인하기 위해 `Youtube`의 `oEmbed` 요청을 넣어보았다.

![PostmanPic1](https://user-images.githubusercontent.com/82663161/217293549-36922e3f-2db0-4fef-a233-3cdfac19420f.png)

사진과 동일하게 정상적인 데이터를 가져오는 것을 확인할 수 있다.

이번에는 내가 만든 기능이 잘 동작하는지 확인하기 위해 백엔드 서버에 요청을 보내보았다.

![PostmanPic2](https://user-images.githubusercontent.com/82663161/217293163-6a73a8f7-7e4d-4ab5-9f20-dfe0ce24ae6b.png)

데이터의 순서는 변하였지만, 빠진 내용 없이 모두 잘 들어온 것을 확인할 수 있다.

## 🤔 회고

처음으로 `HttpURLConnection`을 사용해봤는데, `RestTemplate`을 사용했다면 `JSONObject`로 더 간단하게 변환할 수 있었을 것 같다.

`RestTemplate`의 구현을 보기 위해 들어갔더니 이러한 문구를 볼 수 있었다.

> NOTE: As of 5.0 this class is in maintenance mode, with only minor requests for changes and bugs to be accepted going forward. Please, consider using the org.springframework.web.reactive.client.WebClient which has a more modern API and supports sync, async, and streaming scenarios.

> 참고: 5.0부터 이 클래스는 유지 보수 모드에 있으며, 변경 사항 및 버그에 대한 사소한 요청만 계속됩니다. org.springframework.web.reactive.client를 사용하는 것을 고려해 보십시오.최신 API를 지원하고 동기화, 비동기 및 스트리밍 시나리오를 지원하는 WebClient입니다.

앞으로 `RestTemplate`이 아닌 `WebClient`를 사용하라고 권고하고 있다.<br>
`reactive`라는 단어를 요새 많이 듣고 있는 것 같아 이에 대해서도 한 번 정리해보는 시간을 가지는게 좋을 것 같다!

추가적으로 리팩터링을 해보며 `WebClient`를 적용해보도록 해야겠다!