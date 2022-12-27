---
title: "[Spring] - SimpleMailMessage 에러"
last_modified_at: 2022-10-26T09:10:37-09:30
categories: ERROR
tags:
  - Spring Boot
  - Error
  - Simple Mail Message
toc: true
toc_sticky: true
toc_label: "SimpleMail Error"
toc_icon: "file"
---
## 💬 상황 설명
> 회원가입 시 이메일 발송을 구현하던 중 발송 과정에서 아래와 같은 에러 구문 확인

```bash
534-5.7.9 application-specific password required.
learn more at 534 5.7.9 https://support.google.com/mail/?p=invalidsecondfactor h5-20020a63c005000000b004639c772878sm6868282pgg.48 - gsmtp
```

## 🛠 구현 코드

```java
public class MemberService {
    @Value("${spring.mail.username}")
    private String FROM;

    public Member join(SignUpDto signUpDto) {
        ...
        MailDto mailDto = MailDto.builder()
                .title("제목")
                .message("내용")
                .email(signUpDto.getEmail())
                .build();
        sendMail(mailDto);
    }

    public void sendMail(MailDto mailDto) {
        SimpleMailMessage sm = new SimpleMailMessage();
        try {
            sm.setTo(mailDto.getEmail());
            sm.setFrom(FROM);
            sm.setSubject(mailDto.getTitle());
            sm.setText(mailDto.getMessage());
            javaMailSender.send(sm);
        } catch (MailException e) {
            e.printStackTrace();
        }
    }
}
```

```yaml
# application.yml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${email}
    password: ${password}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

## 🔎 원인 분석
위와 같은 형태로 추가해놓았고, 코드적으로 문제되는 부분은 없어보였다.<br>
`${password}` 부분은 실제 비밀번호로 입력하였고, `application.yml` 파일에서 `username`도 제대로 불러와지는지 확인도 했다.<br>
에러 코드에 나와있는 주소에 들어가보니 힌트를 얻어 해결할 수 있었다.<br>
[https://support.google.com/mail/?p=invalidsecondfactor](https://support.google.com/mail/?p=invalidsecondfactor)

### ✅ 해결 과정
> 에러코드에서 보이는 링크를 들어가 확인해보니 Gmail 고객센터에 연결이 되었고, 에러 코드인 `534-5.7.9`를 검색해보니 다양한 포럼을 확인할 수 있었다.<br>
> 대부분의 답변은 2차 인증 비밀번호를 설정하면 된다해서 [링크](https://support.google.com/accounts/answer/185833)를 통해 해결했다.<br>
> [참고 블로그](https://dev-monkey-dugi.tistory.com/m/51)