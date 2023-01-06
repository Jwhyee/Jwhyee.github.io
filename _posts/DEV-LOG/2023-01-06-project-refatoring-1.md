---
title: "[Spring] - 리팩터링 일지 1일차"
last_modified_at: 2023-01-04T21:00:37-21:30
categories: DEV-LOG
tags:
  - Refactoring
  - SpringBoot
toc: true
toc_sticky: true
toc_label: "Refactoring"
toc_icon: "file"
---
## 🛠 수정 1일차

현재 수정하고자 하는 프로젝트의 가장 큰 문제점은 다음과 같다.

- 다이소와 같은 관심사 상태
  - `Entity`에 비즈니스 로직이 들어있음
  - `Controller`에 비즈니스 로직이 들어있음
  - `Service`에 다양한 `Entity`에 대한 비즈니스 로직이 들어있음 
- 대가족 형태의 `fragment` 파일
  - 한 `fragment` 파일에 **3000줄**이 넘는 다양한 내용이 들어있음

`Spring`을 공부한지 1~2달 만에 시작한 프로젝트라 정말 얕은 지식을 갖고 개발을 했다.<br>
`Java`에 대한 지식도 부족했고, 잘 나오기만하면 성공인 마음으로 개발해 많은 문제를 갖고 있다.

이 모든 내용을 하루 안에 수정하기에는 어려움이 있어 하나하나 수정을 해보고자 한다.<br>
하나하나 수정하면서 앞으로 어떤 방식을 사용하는게 좋은지 공부해보도록 하자!

## 🛠 문제 해결

우선 오늘 해결할 문제는 `Security`를 다시 구현하는 것이다!<br>
`deprecated`된 `WebSecurityConfigurerAdapter`대신 `SecurityFilterChain`을 적용하고,
`Thymeleaf`에서도 `Security`를 정상적으로 사용가능하도록 변경해보자!

### 1️⃣ AccountService의 관심사 분리

`Security` 수정에 들어가기 앞서 기존 `UserDetailsService`가 회원 관리 `Service`에 포함되어 있었다.

```java
public class AccountService implements UserDetailsService {
    
    ...
    
    @Override
    public UserDetails loadUserByUsername(String emailOrNickname) throws UsernameNotFoundException {
        log.info("UserDetail : mainOrNickname ={}", emailOrNickname);

        Account account = accountRepository.findByEmail(emailOrNickname);

        if (account == null) {
            throw new UsernameNotFoundException(emailOrNickname);
        }
        return new SecurityUser(account);
    }
}
```

위 코드와 같이 회원 관리 로직을 담당하는 `AccountService`에 `loadUserByUsername`를 구현한 상태이다.<br>
또한, 코드를 보면 알 수 있듯이 권한에 대한 부분을 찾을 수 없다. 이 부분을 한 번 수정해보도록 하자!

```java
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrNickname) throws UsernameNotFoundException {
        Account account = accountRepository.findByEmail(emailOrNickname);
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (account.getUsername().contains("test")) {
            authorities.add(new SimpleGrantedAuthority("ADMIN"));
        }
        
        authorities.add(new SimpleGrantedAuthority("MEMBER"));

        return new SecurityUser(account, authorities);
    }
}
```

기존 `AccountService`에서 `CustomUserDetailsService`를 새로 생성해 기존 로직을 옮겼다.<br>
또한, 권한을 주는 부분이 빠져있어 `List<GrantedAuthority>`를 통해 여러 권한을 가질 수 있도록 구현했다.<br>
`List`를 사용한 이유는 단순하다. 한 유저가 `MEMBER`이면서 `ADMIN`일 수 있기 때문에 위와 같이 구현했다.

위 코드에서는 임시로 아이디에 test가 포함되어 있으면 `ADMIN` 권한을 주도록 해놓았지만, 추후에 수정할 예정이다.

### 2️⃣ SecurityConfig 리팩터링

앞서 언급했던 것과 같이 `SecurityConfig`를 구성하기 위한 `WebSecurityConfigurerAdapter`이 `deprecated`되었다.

```java
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final AccountService accountService;
    private final DataSource dataSource;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.authorizeRequests()
                .mvcMatchers("/login", "/sign-up", "/check-email", "/check-email-token",
                        "/email-login", "/check-email-login", "/login-link", "/email-login-view").permitAll()
                .antMatchers("/study/*", "/board/*", "/council/*", "/", "/logout").authenticated()
                .mvcMatchers(HttpMethod.GET, "/profile/*").permitAll()
                .antMatchers("/manager/*").hasAnyRole("ADMIN")
                .anyRequest().authenticated();
        http.logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/");

        http.formLogin().loginPage("/login").defaultSuccessUrl("/", true);
        http.formLogin().loginProcessingUrl("/login").defaultSuccessUrl("/", true);
        http.exceptionHandling().accessDeniedPage("/");

        http.userDetailsService(accountService);

        http.rememberMe()
                .userDetailsService(accountService)
                .tokenRepository(tokenRepository());
    }
}
```

[공식문서](https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter)에 나와있듯이 `Spring Security 5.7.0-M2`부터 해당 클래스의 사용을 권장하지 않고 있다.<br>
이를 대체하기 위해 `SecurityFilterChain`을 `Bean`으로 등록해 사용하는 것을 권장하고 있다.

위 내용을 담을 수 있는 `filterChain`을 구현해보자.

```java
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .formLogin(
                        formLogin -> formLogin
                                .loginPage("/login")
                                .loginProcessingUrl("/login")
                )
                .logout(
                        logout -> logout
                                .logoutUrl("/logout")
                )
                .authorizeRequests(
                        request -> request
                                .antMatchers("/study/**", "/council/**", "/").authenticated()
                                .antMatchers("/manager/**").hasAnyRole("ADMIN")
                                .anyRequest().permitAll()
                )
                .csrf(
                        csrf -> csrf
                                .ignoringAntMatchers("/h2-console/**")
                );
        return http.build();
    }
}
```


새롭게 구현하면서 `lambda`을 통해 `SecurityFilterChain`의 필요 내용을 구현했다.<br>
람다식을 사용하는 것은 유연성을 높이기 위한 것이지만, 필수가 아닌 선택적인 사항이라고 [공식문서](https://spring.io/blog/2019/11/21/spring-security-lambda-dsl)에도 잘 나와있다.<br>

이전에는 모든 페이지에 로그인이 필요하도록 구현해놓았다.<br>
이번에 수정하면서 비회원도 어느정도 서비스를 사용할 수 있도록 일부 `URL`을 제외하고는 모두 오픈해놓았다.

해당 부분을 제대로 활용하기 위해서는 우선 `layout`과 `Thymeleaf Security`를 적용해야한다.

### 3️⃣ Thymeleaf Security 적용

바로 위에서 설명했듯이 모든 페이지에 로그인을 필요하는 방식을 적용해서 아래와 같이 구현이 되어있다.

```java
public class AccountController{
    @GetMapping("/profile/{username}")
    public String showProfilePage(@CurrentUser Account account) {
        ...
        return "account/profile";
    }
}
```

여기서 `@CurrentUser`는 `Custom Annotation`으로 현재 로그인한 `Account`를 의미한다.<br>
비회원도 접근이 가능하게 하기 위해서는 위 어노테이션 대신 아래와 같은 코드로 바꿀 필요가 있었다.

```java
public class AccountController{
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profile/{username}")
    public String showProfilePage(@AuthenticationPrincipal SecurityUser securityUser) {
        ...
        return "account/profile";
    }
}
```

위와 같이 해당 API 요청에는 권한이 필요하도록 `@PreAuthorize`를 사용해주고,<br>
기존 `@CurrentUser`대신 `Security`에서 제공하는 `@AuthenticationPrincipal`을 사용하는 것으로 변경했다.

이런 방식으로 변경한다면 `Thymeleaf`에서도 추가적인 권한을 지정할 필요가 없다.<br>
단, 회원, 비회원이 모두 접근이 가능한 곳에는 아래와 같이 `Thymeleaf` 문법을 추가해주었다.

```html
<div sec:authorize="isAnonymous()">
    <p>로그인이 필요한 서비스입니다.</p>
</div>
<div sec:authorize="isAuthenticated()">
    <div th:each="reply : ${reply}">
        ...
    </div>
</div>
```

## 🤔 1일차 회고

해당 프로젝트를 개발할 당시에는 에러 로그도 하나하나 검색하면서 수정했지만,<br>
이제는 로그를 확인하고 무엇이 문제인지 어느정도 감을 잡고 해결할 수 있는 능력을 갖게 되었다.

다음 리팩터링 때는 실질적인 비즈니스 로직을 수정하는 시간을 가져볼까 한다!

- 비즈니스 로직 모듈화
- 카테고리 `ENUM` 타입으로 변경
- 에러를 잡기 위한 `Handler` 추가

우선 이렇게 작성을 해놓고 필요한 내용은 추가적으로 진행하도록 하겠다!