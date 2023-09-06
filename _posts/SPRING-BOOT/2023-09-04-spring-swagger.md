---
title: "[Spring] - SpringBoot 3.x 버전에서 Swagger 사용하기"
last_modified_at: 2023-09-04T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - Swagger
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 🛠️ 개발 환경

🍃 Spring : Spring Boot 3.1.3

🛠️ Java : Amazon corretto 17

## 📔 의존성

Spring 3.x 버전부터 `springfox` 라이브러리를 지원하지 않기 때문에 `springdoc-openapi` 라이브러리를 대신해 사용한다.

```bash
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2'
```

## 🛠️ 적용

`springfox` 라이브러리를 사용할 경우 여러 설정을 해줘야했지만,
`springdoc-openapi`은 설정 조차 필요없이 바로 사용할 수 있다.

```java
public class TestController {
    
    @Operation(
            summary = "테스트 요청",
            description = "테스트 요청에 대한 API"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "테스트 성공"),
            @ApiResponse(responseCode = "204", description = "조회 데이터 없음"),
            @ApiResponse(responseCode = "400", description = "쿼리 파라미터 오류")
    })
    @GetMapping("")
    public ResponseData.ApiResult<Area> testApi() {

        ...

        return ResponseData.success(area);
    }
}
```

위와 같이 `@Operation`를 이용해 API에 대한 설명을 작성할 수 있고,
`@ApiResponse`를 통해 반환 데이터나 코드를 정의할 수 있다.

## 🧩 테스트

서버를 실행하고, 아래 URL을 통해 접속하면 API 명세를 자세하게 볼 수 있다.

```bash
http://localhost:8080/swagger-ui/index.html
```

![image](https://github.com/Jwhyee/japan-festival-api/assets/82663161/fe2e0fa4-2daa-4e15-89ca-af11190375a4)


## Reference

[resilient님 블로그](https://resilient-923.tistory.com/414)