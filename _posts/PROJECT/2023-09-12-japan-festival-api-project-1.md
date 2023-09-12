---
title: "[Spring] - Jsoup을 이용한 크롤링"
last_modified_at: 2023-09-12T21:00:37-21:30
categories: PROJECT
tags:
  - Java
  - SpringBoot
  - Jsoup
toc: true
toc_sticky: true
toc_label: "Effective Java"
toc_icon: "file"
---

## 🛠️ 개발 환경

🍃 Spring : Spring Boot 3.1.3

🛠️ Java : Amazon corretto 17

## 🛠️ 구현

### Jsoup 적용

우선 `Jsoup` [공식 문서](https://jsoup.org/)에 적힌 글을 확인해보자!

> jsoup is a Java library for working with real-world HTML. It provides a very convenient API for fetching URLs and extracting and manipulating data, using the best of HTML5 DOM methods and CSS selectors.

> Jsoup이란, 실세계 HTML과 연동하기 위한 자바 라이브러리로, HTML5 DOM method와 CSS selector 등을 사용하여 URL 가져오기와 데이터 추출 및 조작에 매우 편리한 API를 제공합니다.

소개와 같이 특정 `URL`에 있는 `HTML` 데이터를 가져오는 것이다.

`Spring`에서 이를 사용하기 위해서는 아래와 같이 `build.gradle`에 추가해주면 된다.

```bash
# build.gradle
implementation 'org.jsoup:jsoup:1.15.3'
```

`maven` 사용자는 아래와 같이 추가해주면 된다.

```bash
# pom.xml
<dependency>
    <groupId>org.jsoup</groupId>
    <artifactId>jsoup</artifactId>
    <version>1.15.3</version>
</dependency>
```

### 크롤링 테스트

```java
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class JsoupTest {
    // 테스트를 진행할 URL
    private final String URL = "https://jwhy-study.tistory.com/38";

    @Test
    void getHtmlTest() {
        try {
            Document document = Jsoup.connect(URL).get();
            System.out.println(document);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
```

위 코드와 같이 `Jsoup`에서 제공하는 `Document`에 `URL`을 연결한 뒤, 출력하면 해당 페이지의 렌더링된 `HTML` 코드가 뜬다.

이제 내가 가져오고 싶은 부분을 가져와보자!

```java
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class JsoupTest {
    
    private final String URL = "https://jwhy-study.tistory.com/38";

    @Test
    void getHtmlTest() {
        try {
            int cnt = 0;
            Document document = Jsoup.connect(URL).get();
            // blockquote 태그 내부의 p 태그에 있는 모든 정보를 선택해 content에 저장한다.
            // Elements content = document.select("blockquote p");
          
            // blockquote 태그에 있는 모든 문자열을 가져온다.
            Elements content = document.select("blockquote");

            for (Element e  : content) {
                // 해당 태그에 있는 문장 출력
                String text = e.text();
                
                cnt++;
            }
            
            assertTrue(cnt == 10);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
```

확인해보니 총 10개의 인용문이 존재하는데, 테스트 결과 정상적으로 가져오는 것을 확인했다!

`Element e`에서 더 구체적으로 데이터를 가져오려면 아래와 같은 기능을 사용하면 된다.

```java
// 첫 td 태그 안에 있는 첫 p 태그의 내용
element.select("td:eq(0) p:eq(0)").text();

// 첫 td 태그 안에 있는 img 태그의 src 속성 내용
element.select("td:eq(0) img").attr("src")
```

위 코드와 같이 다양한 CSS 선택자 쿼리를 지원하니 잘 확인해보면 좋을 것 같다!

## 🤔 회고

크롤링에 대한 내용은 [LISTLY](https://www.listly.io/help/ko/guide/%EC%9B%B9-%ED%81%AC%EB%A1%A4%EB%A7%81%EC%9D%80-%ED%95%A9%EB%B2%95%EC%9D%BC%EA%B9%8C-%EB%B6%88%EB%B2%95%EC%9D%BC%EA%B9%8C/)에 잘 정리되어있다.

요약해보자면 다음과 같다.

- 자료의 출처, DB, 저작권, 개인 신상에 관한 자료 접근 등에 대해서 신중하게 잘 살펴본 뒤 사용하자. 
- `Robots.txs` 파일을 통해 크롤링할 수 있는 범위를 확인하고, 그 범위 내에서만 진행하자.
- 너무 많은 요청을 보내 해당 서버에 부하를 주지 말자.
