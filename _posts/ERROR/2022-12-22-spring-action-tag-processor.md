---
title: "[Spring] - SpringActionTagProcessor"
last_modified_at: 2022-12-22T13:12:37-13:30
categories: ERROR
tags:
  - Spring Boot
  - Error
  - Spring Action Tag Processor
toc: true
toc_sticky: true
toc_label: "ActionTag Error"
toc_icon: "file"
---
## 💬 상황 설명

간단하게 로그인 페이지를 매핑하기 위해 `@GetMapping`으로 연결해준 뒤,<br>
`LoginRequestDto`를 `model`에 담아 `View`에 보내준 상태에서 해당 에러가 발생했다.

```bash
[THYMELEAF][http-nio-8080-exec-1] Exception processing template "login-form": An error happened during template parsing (template: "class path resource [templates/login-form.html]")
org.thymeleaf.exceptions.TemplateInputException: An error happened during template parsing (template: "class path resource [templates/login-form.html]")
Caused by: org.attoparser.ParseException: Error during execution of processor 'org.thymeleaf.spring5.processor.SpringActionTagProcessor' (template: "login-form" - line 30, col 31)
Caused by: org.thymeleaf.exceptions.TemplateProcessingException: Error during execution of processor 'org.thymeleaf.spring5.processor.SpringActionTagProcessor' (template: "login-form" - line 30, col 31)
Caused by: java.lang.IllegalStateException: Cannot create a session after the response has been committed
Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is org.thymeleaf.exceptions.TemplateInputException: An error happened during template parsing (template: "class path resource [templates/login-form.html]")] with root cause
```

## 🛠 구현 코드
```java
public class AccountController{
    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("loginRequest", new LoginRequest());
        return "login-form";
    }
}
```

```html
<form class="..."
      th:action="@{/login}" th:object="${loginRequest}" method="POST">
```

## 🔎 원인 분석

우선 여러 가능성을 보기 위해 타임리프 구문을 지워보기도 했고, `form`에 있는 `Attribute`를 모두 지워보기도 했다.

총 2가지의 가능성을 확인했다.
1. `method="POST"`만 제거
2. `th:action="@{/login}"`만 제거

결론적으로 `th:action`을 통해 **POST** 요청이 되는 부분에서 에러가 발생한 것으로 보인다.

### ✅ 해결 과정

구글링을 통해 여러 방법을 찾아봤지만, 대부분의 글들은 `th:object`, `th:field`에 대한 오타 문제였다.<br>
국내 블로그나 커뮤니티에서는 답을 찾을 수 없어서 **StackOverFlow**로 향하였고, 답을 찾을 수 있었다.

```java
public class SecurityConfig{
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ...
                .sessionManagement(
                        session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
                );
        return http.build();
    }
}
```

로그인 과정을 확인하기 위해 임의로 `session`을 날린 적이 있는데, 해당 과정에서 문제가 생긴 것 같다.<br>
우선 위와 같이 세션이 없다면 세션을 생성해주는 방식으로 해결한 뒤 나중에 다른 방법을 찾으면 그 때 제거해도 될 것 같다.

### 참고 블로그
> [참고 블로그1](https://stackoverflow.com/questions/52982246/spring-thymeleaf-throws-cannot-create-a-session-after-the-response-has-been-com)<br>
> [참고 블로그2](https://stackoverflow.com/questions/63626289/when-i-use-thaction-and-method-attribute-together-in-form-tag-in-thymeleaf-it)