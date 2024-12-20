---
title: "[Spring] - Request Entity Too Large"
last_modified_at: 2023-03-06T13:12:37-13:30
categories: "[Dev]-Troubleshooting"
tags:
  - Spring Boot
  - Error
  - AWS EC2
  - AWS S3
toc: true
toc_sticky: true
toc_label: "Upload Error"
toc_icon: "file"
---

## 개발 환경

💻 OS : M1 Mac Ventura 13.1

🍃 Spring : Spring Boot 2.7.7

🛠️ Java : Amazon corretto 17

📦 Stack : AWS S3, EC2(Amazon Linux)

## 💬 상황 설명

로컬 환경에서 S3에 이미지를 업로드할 때에는 문제가 없었지만, EC2 배포 환경에서는 이미지를 업로드가 실패하는 에러가 발생했다.
View 단에서 로그를 찍어보니 아래와 같은 에러가 발생하였고, EC2에서 Spring 로그를 보니 `API` 요청도 가지 않는 상황이었다.

```shell
Request Entity Too Large
```

## 🔎 원인 분석

우선 크기에 문제가 있는지 확인하기 위해 업로드 되는 최대 용량을 확인해보았다.
왜인지 상황마다 다르긴했지만 1MB 이하는 모두 정상적으로 올라갔고, 1MB를 초과하면 업로드가 될 때도 있고, 실패할 때도 있었다.

검색을 통해 확인해보니 두 가지 경우에서 발생할 수 있는 것을 확인할 수 있었다.

1. 서버(Spring) 측에서 파일 업로드 크기를 제한
2. 클라이언트 측에서 지원하지 않는 파일 크기를 업로드 하려고 시도

1번 내용에 대해서는 `application.yml`에 아래와 같이 설정을 해놨기 때문에 제외했다.

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
```

결론적으로 2번 내용 때문에 발생한 것인데 로컬에서는 잘 작동하지만 배포 환경에서 문제인거면 결국 EC2와 관련이 있는 것으로 방향을 잡았다.

## ✅ 해결 과정

### nginx 옵션 추가

EC2 Console을 `SSH`로 접속한 뒤에 아래와 같은 명령어로 설정 파일 수정

```shell
sudo vi /etc/nginx/nginx.conf
```

위 명령어를 입력하면 nginx에 대한 설정을 확인 및 수정할 수 있다. 그 중 http 부분에 최대 바디 사이즈를 설정하는 코드를 추가해주면 된다.

아래 설정을 따로 해주지 않으면 1MB로 설정되며, 필자는 뷰, 서버 단에서 검증 로직을 해놓았기 때문에 우선 50M을 기준으로 잡아놓았다.
50M와 50MB는 모두 동일하게 작동하니 편한 방식으로 작성하면 된다!

```shell
client_max_body_size 50M;
```

```shell
http {
    ...

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;
    # 아래 부분 추가
    client_max_body_size 50M;
    
    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;
    ...
}
```

### nginx 서비스 재시작

```shell
# nginx에 문제가 없는지 테스트
sudo nginx -t

# nginx 서비스 재시작
sudo service nginx restart
```

만약 nginx 테스트를 하는 과정에서 아래와 같이 나올 경우 nginx 관련 프로세스를 모두 죽이고 다시 시작해주면 된다.

```shell
nginx   ...  root   14u  IPv6 ...      0t0  TCP *:https (LISTEN)
nginx   ...  root   15u  IPv4 ...      0t0  TCP *:https (LISTEN)
nginx   ... nginx   14u  IPv6 ...      0t0  TCP *:https (LISTEN)
nginx   ... nginx   15u  IPv4 ...      0t0  TCP *:https (LISTEN)
nginx   ... nginx   14u  IPv6 ...      0t0  TCP *:https (LISTEN)
nginx   ... nginx   15u  IPv4 ...      0t0  TCP *:https (LISTEN)
```

아래 명령어를 통해 Nginx에 대한 모든 프로세스를 종료한 뒤, Nginx 서비스를 재시작해주면 깔끔하게 해결된다.

```shell
sudo killall nginx
sudo service nginx restart
```

## 레퍼런스
- [도비호님 블로그](https://dobiho.com/57828/)