---
title: "[Spring] - Ajax JSON parse error"
last_modified_at: 2023-12-03T13:12:37-13:30
categories: ERROR
tags:
  - Spring Boot
  - Ajax
  - Error
toc: true
toc_sticky: true
toc_label: "Upload Error"
toc_icon: "file"
---

**Kotlin / Spring Boot**의 프로젝트이지만, **Java / Spring Boot**와 동일하게 해결이 가능합니다 😀
{: .notice--info}

## 개발 환경

🍃 Spring : Spring Boot 2.7.17

📺️ View : Thymeleaf / jQuery 3.4.1

🛠️ Kotlin / Java : Amazon corretto 17

## 💬 상황 설명

타임리프를 이용한 SSR로 뷰를 구성한 뒤, `Ajax`를 이용해 `form-data`를 서버에 보내 `@RequestBody`로 받는 과정에서 아래와 같은 에러가 발생했다.

```
WARN 19911 --- [nio-8080-exec-3] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.http.converter.HttpMessageNotReadableException: JSON parse error: Instantiation of [simple type, class com.example.demo.entity.product.data.ProductDto] value failed for JSON property title due to missing (therefore NULL) value for creator parameter title which is a non-nullable type; nested exception is com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException: Instantiation of [simple type, class product.data.ProductDto] value failed for JSON property title due to missing (therefore NULL) value for creator parameter title which is a non-nullable type<EOL> at [Source: (org.springframework.util.StreamUtils$NonClosingInputStream); line: 1, column: 2] (through reference chain: product.data.ProductDto["title"])]
```

## 🔎 원인 분석

우선 에러 로그를 한 번 분석해보자.

```
JSON parse error: 
    Instantiation of [simple type, ProductDto] value failed for JSON property title due to missing (therefore NULL) value for creator parameter title which is a non-nullable type; 
    Instantiation of [simple type, ProductDto] value failed for JSON property title due to missing (therefore NULL) value for creator parameter title which is a non-nullable type
    (through reference chain: product.data.ProductDto["title"])]
```

- `ProductDto` 클래스의 인스턴스를 생성하는 과정에서 `JSON` 프로퍼티에 있는 `title` 속성에 대한 값을 파싱하지 못했다.
- `non-nullable` 타입의 매개 변수에 대한 값을 찾을 수 없어서 실패했다.

위 내용으로 보아 View -> Server로 데이터가 전송되는 과정에서 데이터가 직렬화(serialize) 되지 않은 것 같다.

## 🐞 에러가 발생한 코드

```kotlin
@RestController
class ProductRestController {
    @PostMapping("/product")
    fun productAdd(@Valid @RequestBody dto: ProductDto): ResponseEntity<ProductVo> {
        return ResponseEntity.ok(ProductVo.fromEntity(service.save(dto)))
    }
}
```

```javascript
$(document).ready(function() {
    $('#submitBtn').click(function(){
        $.ajax({
            url: "/product",
            data: JSON.stringify($('#productForm').serialize()),
            dataType : "JSON",
            contentType : 'application/json;charset=UTF-8',
            type: 'POST',
        }).done(function (data, status, xhr) {
            ...
        }).fail(function (e) {
            ...
        });
    })
})
```

## ✅ 해결 과정

### 코드 요청 확인

위 코드로 작성해 요청을 보낼 경우 Network Payload에 다음과 같이 뜬다.

<center>

<img width="537" alt="스크린샷 2023-12-03 오후 12 00 52" src="https://github.com/Jwhyee/Jwhyee/assets/82663161/53ad71cb-1952-4ad9-b7a2-483a331ecfc4">

</center>

```
title=sdf&price=312&content=asdf&category=CLOTH
```

요청 내용을 보면 알 수 있듯, Body에 값을 담아서 보내는 것이 아닌 Header 요청으로 보내진다.

### serialize

우선, `serialize()`가 무엇인지 알아야할 것 같다.

> serialize란, URL-encoded 문자열로 직렬화(serialize)해주는 메소드

`<form>` 태그 내부에 있는 `input` 값들을 모아 `URL-encoded` 방식의 문자열로 직렬화하는 것이다.

```
title=sdf&price=312&content=asdf&category=CLOTH
```

때문에 값이 `JSON` 형식이 아닌 `@RequestParam`으로 받을 수 있는 형태로 변환이 된 것이다.

### stringify

그렇다면 `JSON.stringify()`는 무엇을 의미할까?

>  JavaScript 객체나 값을 JSON 문자열로 변환하는 메소드

때문에 아래와 같이 코드를 작성하면 나에게 전혀 필요없는 `URL-encoded` 방식의 문자열로 변환이 된다.

```javascript
JSON.stringify($('#productForm').serialize())
```

```
"title=abc&price=12&content=1&category=CLOTH"
```

### Header To Body - 수작업

`$('form').serialize()`를 사용할 경우 `URL-encoded` 문자열로 바뀌는 것을 확인했으니, Body로 요청을 보낼 수 있도록 바꿔보자.

가장 간단한 방법은 `form`에 있는 `input` 필드들을 `object` 형식으로 담아주는 것이다.

```javascript
$(document).ready(function() {
    $('#submitBtn').click(function(){
        const data = {
            "title" : $('[name=title]').val(),
            "price" : $('[name=price]').val(),
            "content" : $('[name=content]').val(),
            "category" : $('[name=category]').val(),
        }
        $.ajax({
            url: "/product",
            data: JSON.stringify(data),
            dataType : "JSON",
            contentType : 'application/json;charset=UTF-8',
            type: 'POST',
        }).done(function (data, status, xhr) {
            ...
        }).fail(function (e) {
            ...
        });
    })
})
```

### Header To Body - 자동화

위에서 본 방식으로 데이터를 보낼 경우 모든 페이지마다 위처럼 작성을 해줘야하는 번거로움이 생긴다.
그렇기 때문에 `<form>` 데이터를 알아서 `JSON`으로 파싱해주는 함수를 만들어주면 된다.

```javascript
jQuery.fn.serializeObject = function () {
    let obj = null;
    try {
        if (this[0].tagName.toUpperCase() === "FORM") {
            const arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function () {
                    obj[this.name] = this.value;
                });
            }
        } else {
            alert("form 태그가 아닙니다.")
        }
    } catch (e) {
        alert(e.message);
    }
    return obj;
};
```

- `serializeObject()`의 호출부가 `FORM` 태그가 맞는지 확인한다.
- 데이터를 배열 형태로 변환한 후 데이터가 존재하는지 확인한다.
- `forEach`를 통해 배열을 돌면서 `obj` 객체에 `key`, `value`에 대한 값들을 추가해준다.
- 조립이 완성된 `obj`를 반환한다.

위 코드를 적용하면 최종적으로 다음과 같은 코드가 된다.

```javascript
$(document).ready(function() {
    $('#submitBtn').click(function(){
        $.ajax({
            url: "/product",
            data: JSON.stringify($('#productForm').serializeObject()),
            contentType : 'application/json;charset=UTF-8',
            type: 'POST',
        }).done(function (data, status, xhr) {
            ...
        }).fail(function (e) {
            ...
        });
    })
})
```

## 정리

`serialize()`와 `JSON.stringify()`의 용도를 정확히 모르고 막 사용했기 때문에 발생한 해프닝 같다.

<center>

<img width="515" alt="스크린샷 2023-12-03 오후 4 48 09" src="https://github.com/Jwhyee/Jwhyee/assets/82663161/19f89db5-75d2-4d0a-9a5e-5ad1e1724226">

</center>

`serializeObject()`만으로 데이터를 보내도 되지만, 굳이 객체 타입이 아닌 문자열로 보내도 `Spring`에서는 그에 맞는 `DTO`로 **역직렬화** 해주기 때문에 그나마 덜 무거운 문자열로 보내는 것이 효율적이다.