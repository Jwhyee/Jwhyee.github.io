---
title: "[최종] 피어리뷰"
last_modified_at: 2022-10-20T17:10:37-17:30
categories: LIKE-LION
tags:
  - Like-Lion
  - 피어리뷰
  - 회고
toc: true
toc_sticky: true
toc_label: "Peer Review"
toc_icon: "file"
---
## 🦁 최종 프로젝트

어느덧 교육 중 마지막 프로젝트를 진행한다.<br>
단순히 포트폴리오용 프로젝트가 아닌 나의 **Code Convention**을 확인할 수 있는 좋은 기회라고 생각한다.

### 📝 Rules

온보딩을 통해 본인의 코드리뷰 스타일을 공유하였고, 아래와 같이 팀내의 규칙을 정하였다.

1️⃣ : Commit은 기능 구현마다 한 번씩 나누어서 진행하기!<br>
2️⃣ : 정답 코드 대신 참고 자료 올려주기!<br>
3️⃣ : 명령조가 아닌 의견 제시형으로 리뷰하기!<br>
4️⃣ : 코드 컨벤션 고려하여 리뷰하기!<br>
5️⃣ : 자신의 코드와 비교하여 리뷰하기!<br>
6️⃣ : 누구나 봐도 이해하기 쉬운 클린코드 리뷰하기!

### 🛠 Develop

1. Member
- 회원가입 / 로그인 및 로그아웃
- 회원 정보 수정 (필명, 이메일)
- 회원 정보 수정 (비밀번호)
- 아이디 찾기
- 비밀번호 찾기, 회원가입 이메일 발송

2. Post
- 게시글 작성, 게시글 리스트
- 게시글 조회, 게시글 삭제
- 게시글 수정

3. Product
- 상품 작성, 상품 리스트
- 상품 조회, 상품 삭제
- 상품 수정

## 😎 Review

1차 개발 기간이 끝나고 아래와 같은 리뷰를 받았다.

### `유효성 검증`
- [x] 회원가입 시 `Email` 중복 체크
- [x] `Email`을 이용한 아이디 찾기 -> 올바르지 않거나 `null`값 체킹

유효성 검증에 최대한 집중해서 개발을 진행하였지만, 나도 모르게 진행하지 못한 부분이 있었다.<br>
아이디 찾기와 회원가입에서 모두 사용이 가능하도록 독립적인 `existByEmail()` 메소드를 추가하였다.

### `Bug`
- [x] `@CreatedDate`, `@LastModifiedDate` 미작동

개발을 완료하고, `DB`에 잘 들어가는지 체킹을 했지만, `@CreateDate`가 작동하지 않는 것을 확인했다.<br>
당시에는 무엇이 문제인지 제대로 인지하지 못하고, 결국 `@Builder`를 통해 `Date`를 직접 주입해주었다.<br>
리뷰를 진행하면서 이런 오류가 있다는걸 알고 `@EnableJpaAuditing` 어노테이션을 추가해주었다.

### `Code`
- [x] `WildCard` 수정

IntelliJ의 설정 때문에 `import`가 되면서 자동으로 `wildcard`로 선언되는게 많아졌다.<br>
`wildcard`를 사용할 때의 문제점은 다른 패키지에 동일한 클래스가 존재할 경우 충돌이 발생할 수 있다.<br>
때문에 명확한 `import`를 통해 실수를 줄이는 습관이 필요하다!<br>
> [참고 블로그](https://blog.marcnuri.com/intellij-idea-how-to-disable-wildcard-imports)

```java
// BaseEntity
import lombok.*;
import javax.persistence.*;
```

---

## 🤔 Retrospect
미션을 진행하면서 가장 신경을 많이 쓴 것은 유효성 검증이라 생각한다.<br>
`DB`에 가능하면 `null`이 들어가지 않도록 신경을 썼고, 대부분의 `PostMapping`에는 `@Valid`, `BindingResult`를 활용해 검증 처리를 진행했다.

모든 개발이 끝나고 피어리뷰를 통해 많은 것을 배웠다.<br>
내가 발견하지 못한 버그 및 유효성 검증 등을 알 수 있었고, 팀원들이 공유해준 레퍼런스를 통해 새로운 지식들을 배울 수 있었다.<br>
가장 좋은 점은 나의 코드와 팀원의 코드를 비교하면서 개발 안목을 넓힐 수 있다는 것이었다.