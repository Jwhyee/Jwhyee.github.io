---
title: "[Spring] - Entity Manager Factory 에러"
last_modified_at: 2022-12-21T12:12:37-12:30
categories: "[Dev]-Troubleshooting"
tags:
  - Spring Boot
  - Error
  - Entity Manager Factory
toc: true
toc_sticky: true
toc_label: "Entity Manager Error"
toc_icon: "file"
---
## 💬 상황 설명

> 레거시 프로젝트를 리팩토링하기 위해 실행시키니 아래와 같은 에러 구문 확인

```bash
Error creating bean with name 'entityManagerFactory' defined in class path resource 
[org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]: Invocation of init method failed; 
nested exception is org.hibernate.service.spi.ServiceException: Unable to create requested service [org.hibernate.engine.jdbc.env.spi.JdbcEnvironment]
```

## 🔎 원인 분석

해당 에러의 대부분은 `application.yml`에서 발생하는 것으로 보인다.<br>
우선 오랜만에 사용하는 프로젝트이기에 처음부터 다시 천천히 살펴보았다.

### ✅ 해결 과정

#### 1. DB 확인

우선, 최근에 맥북을 초기화해서 DB 존재 여부부터 확인했다.
역시나, 프로젝트를 실행할 일이 없다보니 DB가 생성되어 있지 않았다.

```sql
create database dbname;
use dbname;
create user username@'%' identified by '1234';
grant all privileges on dbname.* to username@'%' with grant option;
flush privileges;
```

모든 정상적으로 생성한 뒤에도 결과는 그대로였다.

#### 2. 에러 구문 확인

에러 구문을 더 자세히 확인해보니 `dialect`라는 내용이 있었다.
`properties` 파일을 확인해보니 버전에 맞지 않는 내용을 적어놓았다.
현재 버전에 맞게 수정하니 정상적으로 작동하는 것을 확인할 수 있었다.

해당 구문을 지워도 정상적으로 작동되니 나중에 필요하다 싶을 때 넣어도 될 것 같다.

```yaml
# 변경 전
spring:
  jpa:
    database-platform : org.hibernate.dialect.MySQL5InnoDBDialect
```

```yaml
# 변경 후
spring:
  jpa:
    database-platform : org.hibernate.dialect.MySQL8InnoDBDialect
```