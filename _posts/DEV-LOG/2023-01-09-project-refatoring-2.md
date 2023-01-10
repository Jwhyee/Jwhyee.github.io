---
title: "[Spring] - 리팩터링 일지 2일차"
last_modified_at: 2023-01-09T21:00:37-21:30
categories: DEV-LOG
tags:
  - Refactoring
  - SpringBoot
toc: true
toc_sticky: true
toc_label: "Refactoring"
toc_icon: "file"
---
## 🛠 수정 2일차

이번 리팩터링에는 게시글과 관련된 비즈니스 로직에 대한 내용이 일부 담겨있다.<br>
가장 주된 수정 사항은 `Exception Handling`에 대한 내용일 것 같다..!

## ✅ 문제 해결

![](https://golden-goblin.com/content-thief/wp-content/uploads/sites/5/kboard_attached/1/202006/5ed8e0d37033f5013918.gif){: .center}

우선 게시글 추가는 `ajax`를 이용한 `REST API` 통신을 이용하고 있다.<br>
당시에 `ajax`에 빠져있던 상태라 수정, 삭제에 대한 기능을 비동기 통신으로 변경했었다...<br>
게다가 가장 큰 문제점은 `input` 태그의 `name` 값들이 `DTO`와 다른 점이다...

우선 `HTML`에 들어간 값들을 변경하는 작업을 한 뒤, 이후 작업을 진행했다.<br>
처음 개발을 진행할 때 각 필드명을 이상하게 지어놔서 간단하게 작성해놓도록 하겠다!

```java
public class Board extends BaseEntity {
    //post_sort : 게시글 카테고리(자유, 정보, 질문)
    private String boardTitle;

    //post_sub_sort : 게시글 세부 카테고리(정보, 질문에 대한 세부 분야)
    private String subBoardTitle;

    //post_title : 게시글 제목
    private String title;

    //post_sub_title : 게시글 부제목
    private String subTitle;

    //content : 게시글 내용
    private String content;
}

```

### 📅 날짜 구하기

<center>
  <img width="654" alt="스크린샷 2023-01-10 15 20 28" src="https://user-images.githubusercontent.com/82663161/211476421-128da64b-610c-4d53-85e3-6ca666075487.png">
</center>

사진과 같이 작성일에 대한 처리는 현재 시간으로 부터 `~전`이라는 표현식을 사용하고 있다.<br>
당시에는 확장성에 대한 고려를 하지 않고 `BoardService`에 기능을 구현해놨다.<br>
때문에 다른 곳에서 사용하기 위해서는 꼭 해당 서비스를 모델에 담아 보내는 불상사가 생겼다.

이러한 불편함을 줄이고자 당시에 `Account`는 모든 페이지에 `Model`에 담아 보내니 도메인에 로직을 옮기자는 의견이 나왔다.<br>
아무런 고민없이 `Account`로 옮겼고, 해당 `Entity`는 관련성도 없는 비즈니스 로직을 가진 상태가 되어버렸다.

이를 수정하기 위해 `Ut.class`를 새로 추가해 도입하였다.

```java
@Component
public class Ut {
    public static String setDateTime(LocalDateTime localDateTime){
        final int SEC = 60;
        final int MIN = 60;
        final int HOUR = 24;
        final int DAY = 30;
        final int MONTH = 12;
        Instant instant = localDateTime.atZone(ZoneId.systemDefault()).toInstant();
        Date date = Date.from(instant);

        long curTime = System.currentTimeMillis();
        long regTime = date.getTime();
        long diffTime = (curTime - regTime) / 1000;
        String msg = null;
        if (diffTime < SEC) {
            msg = diffTime + "초 전";
        } else if ((diffTime /= SEC) < MIN) {
            msg = diffTime + "분 전";
        } else if ((diffTime /= MIN) < HOUR) {
            msg = (diffTime) + "시간 전";
        } else if ((diffTime /= HOUR) < DAY) {
            msg = (diffTime) + "일 전";
        } else if ((diffTime /= DAY) < MONTH) {
            msg = (diffTime) + "달 전";
        } else {
            msg = (diffTime) + "년 전";
        }
        return msg;
    }
}
```

해당 클래스를 `Thymeleaf`에 불러와 사용하기 위해 `@Component`로 등록해주었다.<br>
사용할 메소드를 `static`으로 지정해주었고, 기존 기능을 옮겨주었다.

```html
<!-- 기존 방식 --> 
<p class="text-xs" th:text="${account.dateTime(board.getCreateDate())}"></p>
<p class="text-xs" th:text="${boardService.dateTime(board.getCreateDate())}"></p>

<!-- 변경된 방식 -->
<p class="text-xs" th:text="${@ut.setDateTime(board.getCreateDate())}"></p>
```

이렇게 수정한 이유는 아래와 같다.

- 회원과 비회원 모두 조회는 가능해야한다.
  - 로그인이 필수였던 상황에서 비회원에 대한 권한도 부여했기 때문에 `Account`가 항상 존재할 수 없다.
- 비즈니스 로직이 담긴 서비스 클래스를 View에 보내기엔 위험 부담이 크다.
  - 애초에 `Service` 자체를 `Model`에 담아서 사용하는 것은 비정상적이라고 생각한다.
  - 또한, 필요한 곳마다 `service`를 담아 보낼 수 없기에 이와 같이 구성했다.

> 즉, 여러 곳에서 담당하지 않고, 한 곳에서만 시간 계산을 담당할 수 있도록 구성한 것이다.

### 📝 게시글 추가

우선 `Controller`의 게시글 추가 로직을 보도록하자!

```java
/* 변경하기 전 코드 */
public class BoardController{
    @ResponseBody
    @RequestMapping(value = "/board-new", method = RequestMethod.POST)
    public Long boardFormSubmit(@CurrentUser Account account,
                                @RequestParam(value = "article_file", required = false) List<MultipartFile> multipartFile,
                                @RequestParam(value = "boardTitle", required = false) String boardTitle,
                                @RequestParam(value = "subBoardTitle", required = false) String subBoardTitle,
                                @RequestParam(value = "title", required = false ) String title,
                                @RequestParam(value = "subTitle", required = false) String subTitle,
                                @RequestParam(value = "content", required = false) String content) {
        Board newBoard = boardService.saveNewBoard(multipartFile, account, 
                boardTitle, subBoardTitle, title, subTitle, content);

        return newBoard.getId();
    }
}
```

```java
/* 변경된 코드 */
public class BoardController{
    @ResponseBody
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/board-new", method = RequestMethod.POST)
    public Long addNewBoard(@AuthenticationPrincipal SecurityUser securityUser,
                                @RequestParam Map<String, Object> params,
                                @RequestParam(value = "article_file", required = false) List<MultipartFile> multipartFile) {

        BoardForm dto = modelMapper.map(params, BoardForm.class);
        Board savedBoard = boardService.saveNewBoard(multipartFile, dto, securityUser.getAccount());

        return savedBoard.getId();
    }
}
```

어떤 점이 변화되었는지 한 줄씩 살펴보자!

#### 게시글 작성 권한 부여
```java
@PreAuthorize("isAuthenticated()")
```

- 게시글 작성은 회원에 대한 권한이기 때문에 해당 코드를 추가했다.

#### 데이터를 받아오는 방식 
```java
// 기존 코드
@RequestParam(value = "article_file", required = false) List<MultipartFile> multipartFile,
@RequestParam(value = "boardTitle", required = false) String boardTitle,
@RequestParam(value = "subBoardTitle", required = false) String subBoardTitle,
@RequestParam(value = "title", required = false ) String title,
@RequestParam(value = "subTitle", required = false) String subTitle,
@RequestParam(value = "content", required = false) String content

// 변경 후 코드
@RequestParam Map<String, Object> params
```

- 기본적으로 `ajax`는 설정을 따로 하지 않으면, `json(key, value)` 타입으로 데이터를 전달 받는다.
- 때문에 `Java`에서는 json과 같이 key, value를 사용하는 `Map`으로 받을 수 있다!
- `List<MultipartFile>`은 따로 파싱해서 사용하는 것보단 그대로 받아오는게 나을 것 같아 그대로 사용했다.

#### ModelMapper 적용

우선 Map 형태로 ModelMapper에 잘 들어가는지 간단한 테스트를 해보았다.

```java
@SpringBootTest
class BoardControllerTest {

    @Autowired
    ModelMapper mapper;

    @Test
    @DisplayName("HashMap이 ModelMapper에 잘 들어오는지 확인")
    void modelMapperTest() {
        // given
        Map<String, Object> testMap = new HashMap<>();
        testMap.put("title", "제목테스트");
        testMap.put("content", "내용테스트");
        
        // when
        BoardForm dto = mapper.map(testMap, BoardForm.class);

        Board savedBoard = mapper.map(dto, Board.class);

        // then
        assertThat(dto.getTitle()).isEqualTo("제목테스트");
        assertThat(dto.getContent()).isEqualTo("내용테스트");

        assertThat(savedBoard.getTitle()).isEqualTo("제목테스트");
        assertThat(savedBoard.getContent()).isEqualTo("내용테스트");
    }
}
```

- `Controller Test`이기 때문에 `Mock`을 활용해서 진행하는게 가장 이상적이었을텐데,<br>
나의 목적은 단순히 **잘 매핑되는지** 확인하기 위한 간단한 테스트이기 때문에 위와 같이 진행했다.

![스크린샷 2023-01-10 13 34 43](https://user-images.githubusercontent.com/82663161/211462865-fce7972e-4c54-4e65-aa7d-d75ea83a3347.png){ .center}

정상적으로 매핑이 되는 것을 확인했고, 실제 코드에 적용해보도록 하자!

```java
public class BoardController{
    public Long addNewBoard(...) {

        // 기존 코드
        Board newBoard = boardService.saveNewBoard(multipartFile, account,
                boardTitle, subBoardTitle, title, subTitle, content);

        // 변경 후 코드
        BoardFormDto dto = modelMapper.map(params, BoardFormDto.class);
        Board savedBoard = boardService.saveNewBoard(multipartFile, dto, securityUser);

    }
}
```

- 기존에는 모든 값들에 대한 매개변수를 지정하여 그에 맞게 인자로 넘겨주었다.
  - 가독성이 떨어지고, 필드 수정에 대해 폐쇄적인 형태를 갖고 있다.
  - 가장 **고질적인 문제**로 필드명을 보고 무엇을 위한 변수인지 확인이 어렵다.
- 변경된 코드를 확인해보면 `ModelMapper`를 활용해 매핑해주었다.
  - `Map`으로 받아온 `params`를 `DTO`로 매핑해 인자로 넘겨주었다.

이 과정에서 서칭을 하다가 찾은 [블로그](https://baek.dev/post/15/)에서 아래와 같은 댓글을 확인했다.

> ModelMapper는 런타임시점에 리플렉션이 발생하므로 성능 저하가 매우 심합니다. 컴파일 시점에 코드가 생성되는 mapstruct 사용하는 것을 권장드립니다.

해당 내용에 대해서 공부를 한 뒤 `MapStruct`로 리팩터링할지 정해봐야겠다!

#### 저장 로직 간소화
```java
public class BoardService{
    // 기존 코드
    public Board saveNewBoard(List<MultipartFile> multipartFile, Account account,
                              String post_sort, String post_sub_sort,
                              String post_title, String post_sub_title, String post_content) {

        Board board = Board.builder()
                .writer(account)
                .boardTitle(post_sort)
                .subBoardTitle(post_sub_sort)
                .title(post_title)
                .subTitle(post_sub_title)
                .content(post_content)
                // 기타 필드...
                .build();

        uploadImage(multipartFile, board);

        return boardRepository.save(board);
    }
    
    // 변경 후 코드
    public Board saveNewBoard(List<MultipartFile> multipartFile, BoardForm dto, SecurityUser securityUser) {
        Board newBoard = setBasicInfo(mapper.map(dto, Board.class), securityUser.getAccount());
        uploadImage(multipartFile, newBoard);

        return boardRepository.save(newBoard);
    }
}
```

- 기존에는 `@Builder`를 활용해 데이터를 매핑하였지만, 앞서 사용한 `ModelMapper`를 또 적용했다.
  - `ModelMapper`의 가장 큰 단점은 `Entity`에 `@Setter`를 지정해야하는 것이다.
  - 이런 문제 때문에 매핑 룰을 지정해 사용하기도 한다.
- 매핑된 `Board` 객체와 작성자를 매핑하기 위해 `setBasicInfo()`라는 메소드를 만들어 진행했다.

### ⚡️ Exception Handling

`detail` 페이지는 해당 게시글의 `id`를 통해 로직을 처리하게 된다.<br>
때문에 존재하지 않는 `id`가 들어왔을 때의 예외 처리가 무조건적으로 필요하다.

#### 예외 발생 시 처리 방식
```java
public class BoardController{
    public String showDetailPage() {
        // 기존 코드
        boolean hasBoardError = boardService.findBoardReportedOrNull(boardId);
        if (hasBoardError) {
            return "error-page";
        }
        
        // 변경 후 코드
        Board currentBoard = boardService.findBoardById(boardId);
    }
}
```

- 기존 방식을 확인해보면 신고되거나, 없는 `id`라면 에러페이지로 가도록 지정해주었다.
  - 이 문제의 가장 큰 문제점은 모든 `Controller` 메소드에 작성을 해줘야하는 것이다.
  - 즉, 많은 부분에서 사용해야하지만, 중복으로 인해 `DRY` 원칙에 위배되는 코드이다.
- 결론적으로 `id`를 통해 `Board` 객체를 찾아야하는 것이라면, 하나의 메소드로 만들어 활용하는 것이 낫다.
  - 아래 코드를 통해 더 자세하게 확인해보자!

#### 예외 처리 로직
```java
public class BoardService{
    // 기존 코드
    public boolean findBoardReportedOrNull(long bid) {
      boolean errorBoard = false;
        Optional<Board> currentBoard = Optional.ofNullable(boardRepository.findById(bid));
        if (currentBoard.isEmpty() || currentBoard.get().getIsReported()) {
            errorBoard = true;
        }
        return errorBoard;
    }
    
    // 변경 후 코드
    public Board findBoardById(Long boardId) {
      Optional<Board> optBoard = boardRepository.findById(boardId);
      optBoard.ifPresent( b -> {
          if (b.getIsReported()) {
              throw new IsReportedException(boardId + "신고된 게시글입니다.");
          }
      });
      return optBoard.orElseThrow( () -> new IdNotFoundException(boardId + "번 게시물은 존재하지 않습니다."));
    }
}
```

- 기존에는 없는 `id`이거나 신고된 게시글이라면 `boolean` 타입을 반환하도록 했다.
- 변경한 코드에서는 해당 게시글이 존재할 때와 존재하지 않을 때를 분리해서 적용했다.
  - 게시글이 존재할 경우 신고 누적으로 블락되었는지 확인 후 `IsReportedException` 처리
  - 게시글이 존재하지 않을 경우 `IdNotFoundException` 처리

위와 같이 `Custom Exception`을 만들어 구성하였고, 아래 코드로 `Handler`를 추가로 구성하였다.

#### 핸들러 구현
```java
@ControllerAdvice
@Slf4j
public class ExceptionHandlerController {
    @ExceptionHandler(value = IdNotFoundException.class)
    public @ResponseBody String notExistId(IdNotFoundException e) {
        log.error("IdNotFoundException={}", e);
        return Script.href("/", e.getMessage());
    }

    @ExceptionHandler(value = IsReportedException.class)
    public @ResponseBody String isReportedContent(IsReportedException e) {
        log.error("IsReportedException={}", e);
        return Script.href("/", e.getMessage());
    }
}
```

`@ControllerAdvice`를 통해 `Runtime Exception`에 대한 핸들링을 하도록 작성했다.<br>
앞으로는 모든 `Controller` 메소드에서 예외처리를 하지 않아도 된다!

## 🤔 2일차 회고

정말 코드를 볼 때마다 경악스럽고, 그 때의 나로 돌아가 제발 공부하고 코드를 짜라고 전해주고 싶다.

그래도 그 때의 내가 이렇게 작성했으니 리팩터링을 하면서 공부를 할 수 있기도 한 것 같다.<br>
이전 포스팅에서 목표로 한 비즈니스 로직 모듈화와 핸들러는 진행하였고, 카테고리 수정은 아직 진행하지 못했다.

다음 리팩터링에는 아래와 같은 내용을 수정해보고자 한다.

- 카테고리 `ENUM` 타입으로 변경
- 게시글 수정 및 삭제