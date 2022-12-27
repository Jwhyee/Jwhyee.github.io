---
title: "[Spring] - Entity Manager Factory 에러"
last_modified_at: 2022-12-21T12:12:37-12:30
categories: ERROR
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

가장 처음으로 확인한 것은 'DB는 존재하는가?'였다.<br>
역시나 맥북 초기화 이후 프로젝트를 실행한 적이 없어서 DB조차 생성이 되어있지 않았다.
```sql
create database dbname;
use dbname;
create user username@'%' identified by '1234';
grant all privileges on dbname.* to username@'%' with grant option;
flush privileges;
```

모든 정상적으로 생성한 뒤에도 결과는 그대로였다.<br>
에러 구문을 조금 더 자세히 보니 `dialect`라는 내용이 들어가있어 확인해보니 버전에 맞지 않은 `dialect`를 사용하고 있었다.<br>
버전을 변경해보니 정상적으로 프로젝트가 실행되는 것을 확인할 수 있었다.<br>
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