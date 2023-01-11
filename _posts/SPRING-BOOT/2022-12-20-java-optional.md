---
title: "[Spring] - Optional"
last_modified_at: 2022-12-20T21:00:37-21:30
categories: SPRING-BOOT
tags:
  - SpringBoot
  - Optional
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---
## 💭 Opiotnal이란?
`Spring` 예시 코드를 통해 간단하게 이해해보자!
```java
public class PostController{
    @GetMapping("/post/{id}")
    public String postDetail(@PathVariable long id, Model model) {
        Post currentPost = postService.findPostById(id);
        model.addAttribute("post", currentPost);
        return "post/detail";
    }
}

public class PostService{
    public Post findPostById(long id) {
        // findById의 반환타입이 Post라고 가정
        return postRepository.findById(id);
    }
}
```
만약 존재하지 않는 `id`가 들어왔을 경우 `currentPost`에는 `null`값이 저장된다.<br>
이런 상황에서 방어 로직 없이 코드가 돌아가면 `detail.html`에서 에러 구문을 보게 될 것이다.<br>
즉, 이런 상황에서 `Optional`을 이용하면 `null-safety`한 코드를 짤 수 있다.

### 💸 Optional의 비용

`Optional`에 대한 설명을 볼 때마다 비용이 비싸다는 것을 확인할 수 있다.<br>
우선 `Optional`을 이용한 코드가 어떤 것이 있는지 간단하게 확인해보자!

```java
public class BoardService{
    public Post findByPostId(long id) {
        // findById의 반환타입이 Post라고 가정
        Post currentPost = postRepository.findById(id);
        Optional<Post> optPost = Optional.of(currentPost);
        
        // 예시를 위한 .get() 사용
        return optPost.get();
    }
}
```
#### 공간적 비용
```java
Optional<Post> optPost = Optional.of(currentPost);
```

- 위 코드처럼 `Optional`은 객체를 감싸는 형태를 하고 있다.
- 즉, 기존 객체에 대한 메모리는 물론이고, `Optional` 객체를 저장하기 위한 추가 공간이 필요하다.

#### 시간적 비용
```java
return postRepository.findById(id);
```

가장 이상적인 방식은 위 코드처럼 `Repository`를 통해 찾은 객체를 바로 반환하는 것이다.<br>
하지만 값이 100% 들어있다고 가정할 수 없다. 그렇기 때문에 `Optional`로 감싸서 사용하는 것이다.

```java
// 들어있는 값이 null이면 NoSuchElementException 발생
return optPost.get();
```

- 위 코드처럼 `optPost`에 들어있는 객체가 `null`인지 비교하고, 꺼내오는 과정을 거친다.
- 즉, `Post` 객체를 얻기 위해서 `.get()` 메소드를 거쳐 반환받기 때문에 시간적 비용이 든다. 
  - `.get()`의 경우 다른 메소드에 비해 오래 걸리는 편은 아니다. 

## 🛠 Optional 사용하기

### 🚨 주의 사항

- 되도록이면 **박싱된 기본 타입**을 담은 옵셔널을 반환하는 일은 없도록 하자!
- `Optional`을 **반환**해야한다면 절대 `null`을 반환하지 말자!
  - `Optional`을 도입한 취지를 완전히 무시하는 행위이다.

### ⚙️ Default Value

> `null`이 반환되지 않도록 기본값을 정해 사용하자.

```java
/* 아래 코드는 단순히 설명을 위한 예시 코드입니다. */
public class PostService{
    public Post findPostById(long id) {
        Optional<Post> findPost = postRepository.findById(id);
        return findPost.orElse(findRandomPost());
    }
    
    public Post findRandomPost(){
        Post randomPost = ...;
        return randomPost;
    }
}
```

위 코드를 보면 `orElse(Object)`라는 메소드를 사용한 것을 볼 수 있다.
- `findPost`에서 꺼내온 값이 `null`일 때, 기본 값을 정해 반환한다.
  - 즉, 위 코드에서는 **랜덤 게시글**을 **기본 값**으로 지정해 사용한 것이다.

### ☄️ Throw Exception

> 상황에 맞는 예외를 던져 `null`을 대비하자.

```java
public class PostService{
    public Post findPostById(long id) {
        Optional<Post> findPost = postRepository.findById(id);
        return findPost.orElseThrow(RuntimeException::new);
    }
}
```

`orElse()`가 기본 값을 지정하는 것이라면, `orElseThrow()`는 예외를 발생시키는 것이다.
- `findPost`에서 꺼내온 값이 `null`일 때, `RuntimeException`을 발생시킨다.

여기서 `Spring`의 핸들링을 이용하면 더 좋은 구조를 만들 수 있다.

```java
// Custom Exception
public class PostIdException extends RuntimeException{
    public PostIdException(String msg){
        super(msg);
    }
}

// Exception Handler
@ControllerAdvice
@Slf4j
public class ExceptionHandlerController { 
    @ExceptionHandler(value = PostIdException.class) 
    public @ResponseBody String notExistId(PostIdException e){
        log.error("PostIdException={}", e);
        return Script.href("/",e.getMessage());
    }
}

public class PostService{
    public Post findPostById(long id) {
        Optional<Post> findPost = postRepository.findById(id);
        return findPost.orElseThrow( () -> new IdNotFoundException(id + "번 게시물은 존재하지 않습니다."));
    }
}
```

위와 같이 `IdNotFoundException`이라는 `Custom Exception`을 만들었다.<br>
만약 `findPost`가 `null`일 경우 `IdNotFoundException`이 발생되고, `ExceptionHandlerController`를 통해 `notExistId()` 메소드가 실행된다.

> 예외를 던지기만 하는 것보단, 해당 예외가 발생했을 때 처리를 해주는 것이 훨씬 안정적이다.

### 🤨 Exist..?

> `Optional`은 대부분 위에 소개한 기능들로 충분히 객체를 꺼내거나 처리할 수 있다.<br>
> 하지만 적합한 메소드를 찾지 못했다면 아래 메소드를 사용해보는 것도 좋다.<br>
> 단, 앞서 소개한 메소드로 대부분 대체할 수 있으니 최대한 피하도록 하자!

#### isPresent(), isEmpty()

이름과 같이 `Optional` 객체에 값이 들어있는지, 비어있는지(null) 확인하는 메소드이다.

```java
public class PostService{
    public Post findPostById(long id) {
        Optional<Post> findPost = postRepository.findById(id);
        
        // 각 메소드의 사용 예시를 위해 if, else-if 형태로 작성
        if (findPost.isPresent()) {
            return findPost.get();
        } else if(findPost.isEmpty()) {
            throw new IdNotFoundException("id" + "번 게시물은 존재하지 않습니다.");
        }
        
        return null;
    }
}
```

우리는 이 코드를 아래로 바꿔 사용할 수 있다.

```java
public class PostService{
    public Post findPostById(long id) {
        Optional<Post> findPost = postRepository.findById(id);
        return findPost.orElseThrow( () -> new IdNotFoundException(id + "번 게시물은 존재하지 않습니다."));
    }
}
```

이렇게 `isEmpty()`, `isPresent()`는 다른 메소드로 충분히 대체해 사용할 수 있다.

#### ifPresent(), ifPresentOrElse()

객체를 반환받지 않고, 값이 존재할 때 로직을 실행해야할 때도 있다.<br>
아래 예시는 들어온 `id`를 가진 `Post` 객체가 저장소에 존재한다면 해당 객체를 수정하고, 그렇지 않으면 예외를 발생시키는 코드이다.

```java
public class PostService{
    
    public boolean isPostOwner(String ownerName, String loginName) {
        return ownerName.equals(loginName);
    }
    
    public void updatePost(long id, PostDto postDto, Member member) {
        Optional<Post> optPost = Optional.of(postRepository.findById(id));
        optPost.ifPresentOrElse(post -> {
            if (isPostOwner(post.getMember().getUsername(), member.getUsername())) {
                post = modelMapper.map(postDto, Post.class);
                postRepository.save(post);
            }}, () -> {
                throw new IdNotFoundException(id + "번 게시물은 존재하지 않습니다.");
        });
    }
}
```

코드를 조금 더 짤라서 확인해보도록 하자!

```java
optPost.ifPresentOrElse(post -> {
    if (isPostOwner(post.getMember().getUsername(), member.getUsername())) {
        post = modelMapper.map(postDto, Post.class);
        postRepository.save(post);
    }
}, // comma를 기준으로 값이 있을 때와 없을 때로 나뉜다.
    () -> {
        throw new IdNotFoundException(id + "번 게시물은 존재하지 않습니다.");
});
```

`optPost`에 값이 존재한다면 `post -> { if(...) }` 부분이 실행되고, `null`이라면 `() -> {throw ...}`이 실행된다.

## 🤔 회고

`Optional`이 제공하는 메소드에 대해 알기 전까지는 항상 `.get()`을 이용해 값을 꺼내오곤했다.

이번 정리를 통해서 `Optional`을 앞으로 어떻게 활용해야 좋을지 고민할 수 있는 좋은 계기가 되었다.

### 레퍼런스
- Effective Java 3/E Item. 55 - 옵셔널 반환은 신중히 하라
- [신진우님 블로그](https://www.latera.kr/blog/2019-07-02-effective-optional/)
- [김태완님 블로그](https://madplay.github.io/post/how-to-return-value-from-optional-in-java)