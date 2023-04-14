---
title: "[JPA] - @Transactional"
last_modified_at: 2023-03-06T21:00:37-21:30
categories: JPA
tags:
  - SpringBoot
  - Opinet
  - Spring Scheduling
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---

## 개발 환경

🍃 Spring : Spring Boot 2.7.7

🛠️ Java : Amazon corretto 17

## @Transactional이란?

> 여러 쿼리 요청을 하나의 커넥션으로 묶어 DB에 전송을 할 수 있는 어노테이션이다.
> 또한, 그 중에서 에러가 발생한다면 이전 상태로 Roll Back 된다.

## 어노테이션의 종류

간혹 Transactional 어노테이션을 사용해 `(readOnly = true)` 옵션을 사용하려고 보니 나오지 않을 때가 있다.

그 이유는 바로 `@Transactional` 어노테이션은 총 두 가지가 존재하기 때문이다. 하나하나 천천히 살펴보도록 하자!

```shell
1. org.springframework.transaction.annotation.Transactional 
2. javax.transaction.Transactional
```

### org.springframework.transaction



### javax.transaction

## 🤔 회고



## 레퍼런스

- 김영한 저자 - Spring Data JPA
- [주지민님 블로그](https://joojimin.tistory.com/25)