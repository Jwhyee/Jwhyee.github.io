---
title: "[Spring] - Optional의 사용"
last_modified_at: 2022-12-20T21:00:37-21:30
categories: Spring-Boot
tags:
  - SpringBoot
  - Optional
toc: true
toc_sticky: true
toc_label: "Spring Boot"
toc_icon: "file"
---
## Opiotnal이란?
아래 코드를 통해 간단하게 이해해보자!
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
        return postRepository.findById(id);
    }
}
```
만약 존재하지 않는 `id`가 들어왔을 경우 `Post`에는 `null`값이 저장된다.<br>
이런 상황에서 방어 로직 없이 코드가 돌아가면 `detail.html`에서 난잡한 에러 구문을 보게 될 것이다.<br>
이와 같이 사용할 객체에 `null`이 들어올 경우를 대비해 사용하기 위한 것이라고 생각하면 된다.

## 사용 예시

### 1️⃣ orElse(), orElseThrow()
> 해당 객체가 `null`이 아니면 꺼내오고, 그게 아니면 `Else(...)`를 실행한다.

```java
public class PostService{
    public Post findPostById(long id) {
        Optional<Post> findPost = postRepository.findById(id);
        return findPost.orElse(null);
    }
}
```

위 코드는 `Optional`을 사용했지만, 이전에 작성했던 코드와 다를게 없다.<br>
`orElse()`를 이상적으로 사용하기 위해서는 아래 코드와 같이 `Exception`을 곁들여 사용하는게 좋다고 생각한다.

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
public class ExceptionHandler {
    @ExceptionHandler(value = PostIdException.class)
    public @ResponseBody String notExistId(PostIdException e){
        log.error("PostIdException={}", e);
        return Script.href("/",e.getMessage());
    }
}

public class PostService{
    public Post findPostById(long id) {
        Optional<Post> findPost = postRepository.findById(id);
        return findPost.orElseThrow(() -> new PostIdException(id + "번 게시물은 존재하지 않습니다."));
    }
}
```
Controller에서 없는 id를 가져와 Service에 전달했다고 가정하자.<br>
전달할 객체가 null이 아니면 DB에서 찾은 Post 객체를 전달하겠지만, 존재하지 않으면 `PostIdException`을 발생시킨다.<br>
이렇게 발생한 `Exception`은 `@ControllerAdvice`가 붙은 `Handler`를 통해 관리된다.

> 이전 코드보다 훨씬 복잡하지만, 가장 안정적인 구조를 하고 있다.<br>
> 이렇게 없는 `id`를 반환할 때 말고도 정말 다양하게 사용할 수 있는 구조이다.

### 2️⃣ get()
> `Optional`에서 객체를 바로 꺼내는 방식

`get()`은 사실 많이 사용하지 않는다. 이 방식을 사용하는 것보단 `isPresent()`를 더 많이 사용한다.<br>
아래 두 코드를 비교해서 보면, **1번**은 값이 없으면 `null`을 반환하고, **2번**은 값이 없으면 `NoSuchElementException`을 반환한다.

```java
public class PostService{
    public Post findPostById1(long id) {
        return postRepository.findById(id).orElse(null);
    }

    public Post findPostById2(long id) {
        return postRepository.findById(id).get();
    }
}
```
즉, 위 코드를 사용하기 위해서는 값이 존재하는지 먼저 확인한 뒤 `.get()`을 통해 값을 전달해야 한다.
```java
public class PostService{
    public Post findPostById(long id) {
        Optional<Post> optPost = Optional.of(postRepository.findById(id).get());
        Post findPost = optPost.get();
        return findPost;
    }
}
```
JPA에서 `findById()` 메소드는 기본적으로 `Optional<T>` 형태로 반환한다.<br>
때문에 `postRepository.findById(id)`는 Optional 형태로 반환된 상태이고, `.get()`을 통해 `Post` 형태로 반환시킨다.<br>
이렇게 `Post` 객체가 `null`인지 확인한 뒤, `null`이 아니면 `optPost.get()`을 사용하는데, 방어하는 코드를 추가적으로 더 작성해주어야 한다.
> 하지만 이 방식은 Optional을 사용하는 목표와 맞지 않기 때문에 잘 사용하지 않는다.

### 3️⃣ isPresent(), isEmpty(), ifPresent()
> 메소드 이름 앞에 `is`가 붙으면 대부분 `true || false`로 **반환**되는 메소드이다.<br>
> 즉, 이름과 동일하게 값이 존재하는지, 비어있는지 확인하는 메소드이다.

```java
public class PostService{
    public Post findPostById(long id) {
        Optional<Post> optPost = Optional.of(postRepository.findById(id).get());
        if (optPost.isPresent()) {
            return optPost.get();
        } else {
            throw new NoSuchElementException("아이디가 존재하지 않습니다.");
        }
    }
}
```
위 코드처럼 `.get()`과 함께 사용하여 방어하는 로직을 구성할 수 있다.<br>
개인마다 다르겠지만, 필자는 코드 길이나 유지보수를 하기에는 `orElseThrow()`가 더 편하다고 생각한다.<br>
`isEmpty()`는 `isPresent()`와 비슷하기 때문에 설명은 생략하도록 하겠다.

아래는 `ifPresent()`에 대한 예시 코드이다.<br>
여기서 등장하는 `Member member`는 `Security`를 통해 로그인된 `Member` 객체를 의미한다.

```java
public class PostService{
    public boolean isPostOwner(String ownerName, String loginName) {
        return ownerName.equals(loginName);
    }
    public void updatePost(long id, PostDto postDto, Member member) {
        Optional<Post> optPost = Optional.of(postRepository.findById(id).get());
        optPost.ifPresent(post -> {
            if (isPostOwner(post.getMember.getUsername(), member.getUsername())) {
                post = modelMapper.map(postDto, Post.class);
                postRepository.save(post);
            }
        });
        if (optPost.isEmpty()) {
            throw new NoSuchElementException("이이디가 존재하지 않습니다.");
        }
    }
}
```
해당 `id`를 가진 `Post`가 존재하는지 확인하기 위해 `Optional`로 감싸주었다.<br>
만약 해당 **객체**가 `null`이 아니라면 익명 함수를 통해 로직을 구성해줄 수 있다.<br>
이를 통해서 `Post` 작성자가 현재 로그인한 `Member`와 동일한지 확인한 뒤, 수정을 진행한다.

이렇게 `Optional`을 이용하면 다양한 방식으로 `null`에 대한 방어 로직을 구성할 수 있다.<br>
하지만 결론적으로 방어 로직을 구성하다보면, `Exception`을 던져줘야하는 상황이 발생하게 된다.<br>
그럴 경우 `orElseThrow()`로 변경해주는 것도 좋은 방법이라고 생각한다.

`Optional`을 더 깊게 공부하고 싶다면 해당 [링크](https://www.latera.kr/blog/2019-07-02-effective-optional/#4-%EA%B0%92%EC%9D%B4-%EC%97%86%EB%8A%94-%EA%B2%BD%EC%9A%B0-optional-orelseget-%EC%9D%84-%ED%86%B5%ED%95%B4-%EC%9D%B4%EB%A5%BC-%EB%82%98%ED%83%80%EB%82%B4%EB%8A%94-%EA%B0%9D%EC%B2%B4%EB%A5%BC-%EC%A0%9C%EA%B3%B5%ED%95%A0-%EA%B2%83)를 참고하면 좋을 것 같다!