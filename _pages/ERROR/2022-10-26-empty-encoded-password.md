---
title: "[Spring][ERROR] - PasswordEncoder 에러"
last_modified_at: 2022-10-26T09:10:70-10:00
categories: ERROR
tags:
 - Spring Boot
 - Error
 - PasswordEncoder
---

### 💬 상황 설명
> 비밀번호 변경 기능을 구현하던 중 아래와 같은 에러 구문 확인<br>
> `log`도 없이 단순히 아래 구문만 뜬게 이상하여 `Bean` 등록이 제대로 되어있는지, 로직에는 문제가 없는지 확인을 했지만 아무런 문제가 없었다.<br>
> 문제를 좁혀가며 로깅을 진행하였고, `MemberContext`의 `getPassword()`에서 `null`값이 찍히는 것을 확인하였다.

```bash
Empty encoded password
```

### 🛠 구현 코드

```java
public class MemberController {
    @PostMapping("...")
    public String doModifyPassword(ModifyPasswordDto dto, 
                                   @AuthenticationPrincipal MemberContext context){
        if(checkMatchPassword(context.getMember().getUsername(), dto.getOldPassword())){
            ...
        }
    }
}

public class MemberService{
    @Transactional(readOnly = true)
    public boolean checkMatchPassword(String username, String oldPassword) {
        return passwordEncoder.matches(oldPassword, member.getPassword());
    }
}
```

### 🔎 원인 분석

검색을 통해 확인해보니 아래와 같은 글귀를 확인할 수 있었다.

> `Spring Security`는 인증을 수행하면 `Authentication` 객체에서 암호를 지우는 과정을 수행한다.

즉, `@AuthenticationPrincipal` 어노테이션을 사용해 가져온 `getMember().getPassword()`가 `null`이 찍히는 이유는 
`Spring Security`에서 인증을 완료해서 `password`를 날려버린 것이다.

### ✅ 해결 과정
> `SecurityConfig`를 통해 해결하면 인증 후에도 `password`가 지워지지 않아 `JWT` 연동 시 보안에 취약해질 수 있다.<br>
> 때문에 `MemberContext`의 `username`을 활용해서 다시 찾아오는 방안으로 수정했다.

```java
public class MemberService {
    // 레거시 코드
    @Transactional(readOnly = true)
    public boolean checkMatchPassword(Member member, String oldPassword) {
        return passwordEncoder.matches(oldPassword, member.getPassword());
    }

    // 개선 코드
    @Transactional(readOnly = true)
    public boolean checkMatchPassword(String username, String oldPassword) {
        Member currentMember = memberRepository.findByUsername(username).orElse(null);
        if (currentMember != null) {
            return passwordEncoder.matches(oldPassword, currentMember.getPassword());
        }
        return false;
    }
}
```

> [참고 블로그1](https://java8.tistory.com/m/509)<br>
> [참고 블로그2](https://javachoi.tistory.com/421)