---
title: "[Spring][Refactoring] - 레거시 코드 리팩터링(0)"
date: 2022-12-20 17:12:48
category: PROJECT
thumbnail: { thumbnailSrc }
draft: false
---

## 💬 수정 사유
스프링 공부를 시작한지 한 달 만에 만든 프로젝트를 수정해보려고 한다.<br>
`DTO`, `REST API`, `Exception` 등에 대한 이해도가 많이 부족해서 제대로 사용하지 않았다.<br>
이번 기회에 **레거시 코드**를 걷어내고 새로 작성하면서 성능에 대한 차이도 살펴보고, 공부하는 시간을 가져야겠다는 생각을 했다.

## 🛠 수정할 사항
대략 1년 전에 개발한 프로젝트이기 때문에 천천히 진행해보고자 한다.

### 단방향 개발
현재 프로젝트의 서비스 로직이 대부분 `Controller` 에 들어가있는 상태이다.<br>
만약 Web에 대한 기술이 바뀌더라도 `Service` 는 건재해야하기 때문에 기존 서비스 로직을 옮길 것이다.

### 로그인 유저 관리
기존에는 `Security`를 사용할 줄 몰라 모든 `Controller`의 메소드에서 `Member` 객체를 전달해서 사용했다. 
때문에 `Thymeleaf`에서도 `sec:authorize="isAuthenticated()"`를 사용할 수 없는 상태였다.<br>
즉, 이러한 문제를 보완하기 위해 `UserDetailsService`를 다시 구현해보고자 한다.

### Thymeleaf Layout
당시에는 `layout`에 대한 존재조차 몰라 무엇이든 Fragment 하나에 다 때려넣고 사용했다. 
덕분에 `fragments.html`에는 **3,000줄**이 넘는 코드가 들어가게 되었다.<br>
이를 `layout`을 통해 필요한 부분만 렌더링하고, `fragments`도 세분화하는 작업을 진행하려고 한다.

### field 관리
`ModelMapper`를 적용하기 위해서는 `Entity`와 `DTO`의 `filed`를 동일하게 맞춰줄 필요가 있다.<br>
`Thymeleaf`와 동일하게 가장 오래 걸리는 작업이며, `View`에 적힌 `name` 또한 수정해야하기 때문에 가장 복잡할 것 같다.

## ✅ 마무리
위 사항 외에도 더 많은 작업을 진행할 것 같다.<br>
예전 코드를 보자니 부끄럽기도 하지만 공부하기엔 가장 최적의 프로젝트라고 생각한다.<br>
하나하나 수정해보면서 한 테마별로 포스팅을 진행하고, 이전 코드와 비교해보면서 공부할 생각이다.