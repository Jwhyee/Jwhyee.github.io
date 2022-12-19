---
title: "[Spring] - ModelMapper"
date: 2022-10-13 14:10:42
category: SPRING-BOOT
thumbnail: { thumbnailSrc }
draft: false
---

## Model Mapper
Entity를 DTO로 혹은 DTO를 Entity로 변환하기 위해 사용한다. (Entity 🔄 DTO)

### ⚙️ Setting
```bash
# build.gradle
dependencies {
    implementation 'org.modelmapper:modelmapper:3.1.1'
}
```

```java
@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
```

### 🛠 Entity & DTO

```java
@Entity
@SuperBuilder
@Getter @Setter
...
public class Post extends BaseEntity {
    private String title;
    private String content;
}
```

```java
@Getter @Setter
public class PostDto {
    private String title;
    private String content;
}
```

`ModelMapper`를 사용하기 위해서는 `@Getter`, `@Setter`를 넣어주어야 한다.<br>
모든 클래스에 `@Getter`, `@Setter`를 넣는 것이 부담된다면, 아래 예시처럼 넣어주면 된다.
> `DTO`를 `Entity`로 **매핑**하고 싶으면, `Entity`에 `@Setter`, `DTO`에 `@Getter`를 넣어주면 된다.

### ✅ 사용 예시
`ModelMapper`를 사용하지 않는 상태에서는 보통 `Builder`를 이용해 매핑한다.
```java
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Post savePost(PostDto dto) {
        Post n = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .build();
        return postRepository.save(newPost);
    }
}
```

예시로 사용한 `Entity`와 `DTO`는 필드가 적지만, 실제 `Entity`에는 더 많은 필드가 존재한다.<br>
이럴 경우 필드가 추가될 때마다 그에 맞도록 매핑을 해줘야하는 불편함이 있다.<br>
하지만 `ModelMapper`를 사용하면 이런 불편함 없이 코드 한 줄로 매핑을 해줄 수 있다.

```java
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final ModelMapper modelMapper;

    public Post savePost(PostDto dto) {
        Post newPost = modelMapper.map(dto, Post.class);
        return postRepository.save(newPost);
    }
}
```
`DTO` ➡️ `Entity`
```java
DTO dto = modelMapper.map(entity, DTO.class);
```
`Entity` ➡️ `DTO`
```java
Entity entity = modelMapper.map(dto, Entity.class);
```

> 위 코드처럼 `map(객체, 클래스)`로 넣어주면 된다.<br>
> '나는 해당 **객체**를 **클래스**로 **매핑**할 것이다.'