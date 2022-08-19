---
title: Lombok을 활용한 이상적인 패턴
date: 2022-08-19 21:08:02
category: PROJECT
thumbnail: { thumbnailSrc }
draft: false
---

## 회고 과정

멋쟁이 사자처럼 백엔드 스쿨 1기 해커톤을 진행하면서 `Spring Boot` 를 이용해 협업을 진행하며 알게된 내용을 정리해보고자 한다.

> 지극히 주관적인 내용이 포함되어 있습니다.

## Lombok이란 무엇일까?

필자가 생각하는 Lombok은 **코드 다이어트**를 위한 아주 편리한 `Java Library` 라고만 생각한다. 밑에서 설명할 예시 코드를 통해 확인해보자.

## Lombok에서 제공하는 유용한 Annotation

Lombok에서 제공하는 몇가지 간단한 어노테이션을 살펴보자 !

### @Getter, @Setter
```java
/* -- 작성한 코드 -- */
@Getter @Setter
public class Person{
    private String name;
    private int age;
    private int height;
    private boolean isSolo;
}

/* -- 컴파일 시점 -- */
public class Person{ 
    private String name;
    private int age;
    private int height;
    private boolean isSolo;
		
    public int getName(){return this.name;}
    public int getAge(){return this.age;}
    public int getHeight(){return this.height;}
    public int getIsSolo(){return this.isSolo;}
    
    public int setName(Stirng name){this.name = name;}
    public int setAge(int age){this.age = age;}
    public int setHeight(int height){this.height = nameheight}
    public int setIsSolo(boolean isSolo){this.isSolo = isSolo;}
}

public Main{
    psvm(String[] args){
        Person newPerson = new Person();
        sout(newPerson.getName());
    }
}
```
> 앞서 말했던 내용과 같이 `@Getter`, `@Setter`만 작성해주면 항상 귀찮게 작성했던 `getField()` , `setField()` 메소드들을 자동으로 생성해주면서 코드 다이어트가 가능해진다. 

### @ArgsConstructor 3형제
> `@AllArgsConstructor` <br>
> → 모든 필드를 인자로 받는 생성자를 만듦 <br> 
> `@NoArgsConstructor `<br>
> → 아무 인자가 없는 기본 생성자를 만듦 <br>
> `@RequiredArgsConstructor` <br>
> → `final` 혹은 `@NonNull`이 붙은 필드만 인자로 받는 생성자를 만듦

```java
/* -- 작성한 코드 -- */
@AllArgsConstructor
@NoArgsConstructor
public class Person{
    private String name;
    private int age;
}

/* -- 컴파일 시점 -- */
public class Person(){
    private String name;
    private int age;

    // @NoArgsConstructor
    public Person(){}

    // @AllArgsConstructor
    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }
}
```

```java
/* -- 작성한 코드 -- */
@RequiredArgsConstructor
public class Person{
    private final String 성별;

    @NonNull
    private String name;

    private int age;
}

/* -- 컴파일 시점 -- */
public class Person(){
    private final String 성별;

    @NonNull
    private String name;

    private int age;

    // @RequiredArgsConstructor
    public Person(String 성별, @NonNull String name){
        if(name == null) {
            throw new NullPointerException("name is marked non-null but is null");
        } else {
            this.성별 = 성별;
            this.name = name;
        }
    }
}
```
> 위에 작성한 내용과 같이 클래스에 있는 `Field`들을 이용해 자동으로 생성자를 만들어주는 역할을 한다.

## 그럼 앞으로 어떤 전략으로 사용해야할까?

### @Setter 사용 자제

> `@Setter` 대신 의미있는 메소드를 사용하자!
```java
@Entity @Getter
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // 로그인 아이디
    @Column(unique = true)
    private String username;

    private String password;

    private String introduce;

    @Column(unique = true)
    private String email;
    
    public void changeAccountBasicInfo(Stirng password, String introduce){
        this.password = password;
        this.introduce = introduce;
    }
}
```
> 위 코드와 같이 `Setter` 대신 **수정 가능**한 **부분**에 대한 **의미있는 메소드**를 생성하여 사용!<br>

### @AllArgsConstructor 사용 제한 지정
> @AllArgsConstructor의 access를 지정하자!
```java
/* -- 작성한 코드 -- */
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // 로그인 아이디
    @Column(unique = true)
    private String username;

    private String password;

    private String introduce;

    @Column(unique = true)
    private String email;
}

/* -- 컴파일 시점 -- */
public class Account {
    private Long id;

    private String username;

    private String password;

    private String introduce;

    private String email;
    
    protected Account(){}

    private Account(Long id, String username, int password, int introduce, String email){
        this.id = id;
        this.username = username;
        this.password = password;
        this.introduce = introduce;
        this.email = email;
    }
}
```
> 위와 같이 `AccessLevel`을 사용하면 생성자를 접근 제어자를 `protected`, `private` 등으로 지정이 가능하다. <br>
> 즉, 현재 패키지, 혹은 현재 클래스 이외에서는 해당 생성자를 만들지 못하도록 막는 것이다.
### 객체를 생성할 때는 @Builder를 사용하자!
```java
// 방식1
Account newAccount = Account.builder()
        .username(...)
        .password(...)
        .introduce(...)
        .email(...)
        .build();
Account createAccount = accountRepository.save(newAccount);

// 방식2 - 인라인
Account createAccount = accountRepository.save(Account.builder()
        .username(...)
        .password(...)
        .introduce(...)
        .email(...)
        .build());
```
> 위에서 설명한대로 진행하면 앞으로는 객체 생성을 할 때 `Builder` 이용해서만 객체를 생성할 수 있을 것이다.
> 이와 같은 패턴으로 작성하면 해당 객체를 새로 생성한 사람이 어떤 의도로 생성했는지 분명히 파악할 수 있다.

## 마무리

1. 객체를 새로 생성할 때는 `@AllArgsConstructor`를 다른 곳에서 사용하지 못하도록 `AccessLevel.PRIVATE`로 지정해주고, 객체를 새로 생성할 때는 `Builder`를 이용해 만들어준다.
2. 객체를 수정할 때는 **수정 가능**한 **필드**들만 속해있으며, **의미있는 메소드**를 만들어 계속 재사용한다.


```java
@Entity @Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post{
		private Long id;
		private String title;
		private String content;
		private LocalDateTime createPostTime;
		private List<Reply> replies = new ArrayList<>();

		public void updatePostTitleAndContent(String title, String content){
				this.title = title;
				this.content = content;
		}
}
// Controller는 Repository를 몰라야하기 때문에 Service 단에서 로직을 처리
public class PostService{
		public void createNewPost(PostDto postDto){
				Person newPerson = Person.builder()
					.title(postDto.getTitle())
					.content(postDto.getContent())
					.createPostTime(LocalDateTime.now())
					.build();
				personRepository.save(newPerson);
		}

		public void updatePost(Post post, PersonDto personDto){
				post.updatePostTitleAndContent(postDto.getTitle(), postDto.getContent());
				// 이미 영속화된 상태기 때문에 save는 하지 않음
		}
}
```

> 아직 배우는 단계라 리팩터링을 해야할 부분이 많이 보인다. <br>
> 그래도 이전에 했던 프로젝트에 비해 성장한 모습이 보이는 것 같아 뿌듯하다.

### 참고 블로그

https://velog.io/@frankle97/Lombok을-활용한-코드-다이어트 <br>
https://velog.io/@kay019/Lombok을-사용해야-할까 <br>
https://erjuer.tistory.com/106 <br>
https://velog.io/@psjw/Lombok