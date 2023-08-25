---
title: "[Item5] - 자원을 직접 명시하지 말고 의존 객체 주입을 사용하라."
last_modified_at: 2023-08-10T21:00:37-21:30
categories: STUDY/EFFECTIVE-JAVA
tags:
  - Effective Java
  - Java
  - Study
toc: true
toc_sticky: true
toc_label: "Effective Java"
toc_icon: "file"
---

Effective Java 3/E를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 의존(dependency)이란?

> 클래스 혹은 라이브러리 등과 같이 다른 요소에 의존하여 작동하거나 사용되는 것

```java
public class SpellChecker {
    
    private static final Lexicon dictionary = Lexicon.INSTANCE;
    ...

    public static boolean isValid(String word) {
        return dictionary.isContainsWord(word);
    }
    
}
```

위 코드와 같이 `SpellChecker` 클래스는 `Lexicon` 이라는 클래스에 의존해 사용하고 있는 것을 볼 수 있다.
이처럼 현재 클래스에서 다른 요소(클래스)를 이용해 기능을 사용하는 것을 의존이라 한다.

## 의존 방식

### 잘못된 의존성 주입 방식

```java
public enum Lexicon {
    
    INSTANCE;

    private final List<String> words = new ArrayList<>();

    // 생성과 동시에 단어 추가
    Lexicon() {
        words.add("apple");
        words.add("banana");
        words.add("cherry");
    }

    public boolean isContainsWord(String word) {
        return words.contains(word);
    }
    
}
```

위와 같이 `enum` 타입의 `Lexicon`이 있다.

```java
// 정적 유틸리티 예시
public class SpellChecker {
    
    private static final Lexicon dictionary = Lexicon.INSTANCE;

    private SpellChecker() {}

    public static boolean isValid(String word) {
        return dictionary.isContainsWord(word);
    }
    
}
```

```java
// 싱글톤 예시
public class SpellChecker {
    
    private static final Lexicon dictionary = Lexicon.INSTANCE;

    private SpellChecker() {}
    public static SpellChecker INSTANCE = new SpellChecker();

    public boolean isValid(String word) {
        return dictionary.isContainsWord(word);
    }
    
}
```

위 두 코드는 현재 하나의 언어에 대해서만 구현이 되어 있다.

```java
public class LexiconTest {
    @Test
    void lexiconTest1() {
        assertTrue(SpellChecker.INSTANCE.isValid("apple"));
    }
}
```

만약 여러 유저가 영어가 아닌 다른 언어를 사용할 경우 기존 코드를 싹 갈아 엎어야한다.
즉, 사용하는 자원에 따라 동작이 달라져야하는 맞춤법 검사기에는 적합하지 않다.


### 팩터리 메소드 패턴 방식

> 팩토리란, 호출할 때마다 특정 타입의 인스턴스를 반복해서 만들어주는 객체를 의미

앞서 봤던 문제를 해결할 수 있도록 위 코드를 유연하게 바꿔보자!

```java
public class SpellChecker {
    
    // 사용하는 자원에 따라 동작이 달라져야하기 때문에 static 제거
    private final Lexicon dictionary;

    // 사용자가 원하는 자원을 받아 dictionary에 의존성 주입
    public SpellChecker(Lexicon dictionary) {
        this.dictionary = Objects.requireNonNull(dictionary);
    }

    public boolean isValid(String word) {
        return dictionary.isContainsWord(word);
    }
    
}
```

위와 같이 인스턴스를 생성할 때,
생성자에 필요한 자원 `Lexicon`에 대한 자원 팩터리를 넘겨주는 방식을 이용하면,
보다 더 유연하게 맞춤법 검사기를 사용할 수 있게 된다.

```java
// 자원을 유동적으로 받아 사용할 수 있도록 사전을 interface로 변경
public interface Lexicon {
    boolean isContainsWord(String word);
}
```

```java
// 한국어 사전
public class KoreanLexicon implements Lexicon {
    
    // 단어 리스트를 불변으로 선언
    private final List<String> words = new ArrayList<>();

    // 생성자를 통해 단어 주입
    public KoreanLexicon() {
        words.add("사과");
        words.add("바나나");
        words.add("체리");
    }

    @Override
    public boolean isContainsWord(String word) {
        return words.contains(word);
    }
    
}
```

```java
// 영어 사전
public class EnglishLexicon implements Lexicon {

    private final List<String> words = new ArrayList<>();

    public EnglishLexicon() {
        words.add("apple");
        words.add("banana");
        words.add("cherry");
    }

    @Override
    public boolean isContainsWord(String word) {
        return words.contains(word.toLowerCase());
    }
    
}
```

위와 같이 각 언어에 대한 사전을 따로 생성한 뒤, `Lexicon`에 대한 구현체로 사용하면 된다.
이러면 사용하는 자원에 따라 동작이 달라지게 구현할 수 있다.

```java
public class LexiconTest {

    @Test
    void koreanLexiconTest() {
        SpellChecker checker = new SpellChecker(new KoreanLexicon());
        
        // 테스트 통과
        assertTrue(checker.isValid("사과"));
    }

    @Test
    void englishLexiconTest() {
        SpellChecker checker = new SpellChecker(new EnglishLexicon());

        // 테스트 통과
        assertTrue(checker.isValid("Apple"));
    }
    
}
```

이렇게 인스턴스를 생성할 때, 생성자에 필요한 자원을 넘겨주면 된다.

### Supplier

> `Supplier<T>`란, 매개변수 없이 어떤 값을 제공하는 함수형 인터페이스이다.

```java
public class SupplierTest {
    @Test
    void supplierTest() {
        Supplier<Integer> randomSupplier = () -> {
            int num = 100;
            return new Random().nextInt(num + 1);
        };

        for (int i = 0; i < 3; i++) {
            int random = randomSupplier.get();
            System.out.println("random = " + random);
        }
    }
}
```

한 마디로 정의하자면 `Supplier<T>`는 익명 함수를 저장하는 것이라고 봐도 되는 것이다.
즉, `randomSupplier`는 랜덤한 값을 생성하는 함수가 되는 것이다.

```java
public class SupplierTest {
    @Test
    void randomTest() {
        Random random = new Random();

        for (int i = 0; i < 3; i++) {
            int num = random.nextInt(100);
            System.out.println("num = " + num);
        }
    }
}
```

그럼 위 코드는 `Supplier`를 사용한 것과 어떤 차이가 있을까?

`Random`은 현재 시간 등을 `seed`로 사용해 난수를 생성한다.
떄문에 어떠한 이유로 루프가 정말 빠르게 돌 경우 같은 값이 나올 수 있다.

하지만, `Supplier`를 사용하면, `randomSupplier`을 정의한 시점에 값을 생성하지 않고,
값을 꺼내오는 `.get()`의 시점에서 계산이 이루어지기 때문에 약간의 지연 로딩이 발생한다.
때문에 안정적으로 모두 다른 랜덤한 값을 가져올 수 있으며,
**실제로 계산이 필요한 시점에 수행**되기 때문에 자원을 낭비하지도 않는다.

#### 결론

```java
public class SpellChecker {
    
    private final Lexicon dictionary;
    
    public SpellChecker(Lexicon dictionary) {
        this.dictionary = Objects.requireNonNull(dictionary);
    }
    
    ...
}
```

```java
public class LexiconTest {
    @Test
    void koreanLexiconTest() {
        SpellChecker koreanSpellChecker = new SpellChecker(new KoreanLexicon());
        assertTrue(koreanSpellChecker.isValid("사과"));
    }
}
```

위 코드와 같이 클라이언트가 자신이 명시한 타입(SpellChecker)의 하위 타입(KoreanLexicon)이라면 무엇이든 생성할 수 있는 팩터리를 넘길 수 있다.

### Autowired VS RequiredArgsConstructor

우리가 `Spring`을 사용하면서 위 두 어노테이션을 사용한 경험이 있을 것이다.
클래스 단에 `@Service`, `@RestController` 등을 통해 클래스에 대한 빈 등록을 해주고,
해당 클래스에서 의존해서 사용할 클래스에 대해 의존성 주입을 해주어야 사용이 가능하다.

하지만 `Autowired` 보단 `RequiredArgsConstructor`을 사용하라는 말을 주로 하곤 한다.
그 이유에 대해 자세히 살펴보자!

#### 의존성 주입

```java
@Service
public class PostService {
    @Autowired
    private ImageService imageService;
}
```

기본적으로 `Autowired`는 필드 주입(Field Injection) 방식이다.
코드가 워낙 짧아 사용이 간편하다는 장점이 있다.
하지만, IntelliJ에서 `@Autowired`를 사용하면 아래와 같은 추천 문구가 뜬다.

> Field injection is not recommended

![image](https://www.vojtechruzicka.com/7e3b053f8955cbdea02a12dd43868d94/indea-field-injection.gif)

#### 왜 생성자 주입 방식을 권장할까?

##### 순환 참조 방지

```java
@Service
public class PostService {
    
    @Autowired
    private ImageService imageService;
    
    public void savePost(PostDto dto) {
        List<Image> list = imageService.createImageUrl(dto.getImage());
        ...
    }
    
}
```

```java

@Service
public class ImageService {

    @Autowired
    private PostService postService;

    public List<Image> createImageUrl(List<MultipartFile> imageList) {
        List<Imgage> allPostImages = findAllPostImages();
        ...
    }

    public List<Imgage> findAllPostImages() {
        List<Post> postList = postService.findAll();
        ...
    }

}
```

위 코드는 `PostService` <=> `ImageService` 서로가 서로를 참조하고 있는 순환참조 형태이며,
필드 주입 방식을 사용하고 있다.

필드 주입(Field Injection) 방식은
빈(Bean)을 생성한 후에 `@Autowired` 어노테이션이 붙은 필드에 해당하는 빈을 찾아서 주입하는 방식이다.

즉, 빈이 생성이 된 시점에는 문제를 발견할 수 없고,
해당 메소드를 사용해 클래스 순환 참조가 이뤄지기 전까지 에러가 나는지 확인을 할 수 없다.
그러면 생성자 주입은 어떨까?

```java
@Service
public class PostService {
    
    private final ImageService imageService;

    public PostService(ImageService imageService) {
        this.imageService = imageService;
    }
    
    public void savePost(PostDto dto) {
        List<Image> list = imageService.createImageUrl(dto.getImage());
        ...
    }
    
}
```

```java
@Service
public class ImageService {
    
    private final PostService postService;

    public ImageService(PostService postService) {
        this.postService = postService;
    }
    
    public List<Image> getImage(List<MultipartFile> imageList) {
        ...
    }

    public List<Imgage> findAllPostImages() {
        List<Post> postList = postService.findAll();
        ...
    }
    
}
```

이와 같이 변경해서 사용하면 서로 순환참조가 되고 있는 것을 어플리케이션 구동을 하는 순간 알 수 있다.

```bash
Description:
The dependencies of some of the beans in the application context form a cycle:
┌─────┐
|  postService defined in file [../Service/PostService.class]
↑     ↓
|  imageService defined in file [../Service/ImageService.class]
└─────┘
```

반면 생성자 주입(Constructor Injection) 방식은
빈을 먼저 생성하지 않고, 생성자를 통해 객체를 생성하는 시점에서 필요한 빈을 주입한다.
때문에 어플리케이션을 실행해 빈이 등록되는 과정에서 객체를 생성하고, 빈을 등록한다.

즉, `postSerivce`라는 객체를 생성하면 내부에 있는 `imageService` 또한 빈이 등록되고,
`imageService` 내부에 있는 `postSerivce`가 호출되면서 빈 생성 순환 참조 에러를 발견할 수 있는 것이다.

#### RequiredArgsConstructor

> 해당 어노테이션은 현재 클래스에 있는 `final` 필드를 기반으로 생성자를 자동 생성해 의존성 주입을 해준다.

결론적으로 `@Autowired`를 사용하면 순환 참조를 포함한 다른 문제들을 식별하기 어렵다.
때문에 생성자 주입 방식을 권장하고 있으며,
해당 방식은 `Lombok`에서 제공하는 `@RequiredArgsConstructor`와 동일하기 때문에
이를 사용하는 것이다.

```java
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository repository;
}
```

```java
// 컴파일 시점
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository repository;

    public PostService(PostRepository repository) {
        this.repository = repository;
    }
}
```

## 정리

- 클래스가 내부적으로 하나 이상의 자원에 의존하고, 그 자원이 클래스 동작에 영향을 준다면 싱글톤과 정적 유틸리티 클래스는 사용하지 않는 것이 좋다.
- 필요한 자원이나 그 자원을 만들어주는 팩터리를 생성자에게 넘겨주는 방식을 사용하자.
- 의존 객체 주입이라 하는 이 기법은 클래스의 유연성, 재사용성, 테스트 용이성을 기가 막히게 개선해준다.