---
title: "[Chapter2] - 함수로 HTTP 다루기(2)"
last_modified_at: 2025-02-09T22:10:37-23:30
categories: "[Book]-Language"
tags:
   - 객체에서 함수로
   - Kotlin
toc: true
toc_sticky: true
toc_label: "Chapter2"
toc_icon: "file"
---

**객체에서 함수로**를 공부하며 작성한 글입니다.<br>
혼자 공부하고 정리한 내용이며, 틀린 부분은 지적해주시면 감사드리겠습니다 😀
{: .notice--info}

## 제타이 시작하기

위에서 작성했던 코드는 이 라이브러리가 개발 환경에서 잘 돌아가는지 확인하기 위한 스파이크 코드기 때문에, 이를 모두 버리고 실제 함수를 작성해보자.

```kotlin
fun showList(req: Request) : Response {  
    val user: String? = req.path("user")  
    val list: String? = req.path("list")  
  
    // language=HTML  
    val htmlPage = """  
    <html>  
        <body>  
            <h1>Zettai</h1>  
            <p>Here is the list <b>$list</b> of user <b>$user</b></p>  
        </body>  
    </html>      
    """.trimIndent()  
    return Response(Status.OK).body(htmlPage)  
}  
  
fun main() {  
    val app: HttpHandler = routes(  
        "/todo/{user}/{list}" bind Method.GET to ::showList  
    )
    app.asServer(Jetty(8080)).start()  
}
```

코드는 단순하다. `/todo/{user}/{list}` 형태의 URL에 접근하면, `showList` 함수가 실행되는 것이다. 이는 Path Parameter를 사용하기 때문에 user, list에 오는 값들을 HTML에 그대로 바인딩해준다.

### 첫 번째 인수 테스트

위 코드에서 우리가 작성할 수 있는 테스트는 다음과 같다.
1. URL에 접근을 정상적으로 하는지
2. HTML에 뿌려진 데이터가 의도한 바와 동일한지

우선 이 항목이 잘 동작하는지 틀을 작성해보자.

```kotlin
class SeeATodoListAt {  
    private fun getTodoList(  
	    user: String,  
	    listName: String  
	): ToDoList {  
	    val client = JettyClient()  
	  
	    val req = Request(
		    Method.GET, 
		    "http://localhost:8081/todo/$user/$listName"
		)  
	    val res = client(req)  
	  
	    return if (res.status == Status.OK) 
		    parseResponse(res.bodyString())  
	    else fail(res.toMessage())
	}
    
    private fun parseResponse(
	    html: String
    ): ToDoList = TODO("parse the response") 
     
    private fun startTheApplication(  
        user: String,  
        listName: String,  
        items: List<String>  
    ) {  
        val server = Zettai().asServer(Jetty(8081))  
    }  
  
    @Test  
    fun `List owners can see their lists`() {  
        // Given  
        val user = "frank"  
        val listName = "shipping"  
        val foodToBuy = listOf("carrots", "apples", "milk")  
  
        // When  
        startTheApplication(user, listName, foodToBuy)  
        val list = getTodoList(user, listName)  
          
        // Then  
        expectThat(list.name).isEqualTo(listName)  
        expectThat(list.items).isEqualTo(foodToBuy)  
    }  
}
```

위 코드는 제대로 컴파일 되지 않는다. 하지만, 이런 테스트를 작성하는 것만으로도 애플리케이션 디자인에 대해 좋은 방향을 잡을 수 있다. 우리는 이 컴파일도 되지 않는 코드로 필요한 엔티티나 클래스를 예측할 수 있게 되었다.

우선 `Zettai` 클래스에 대해 정의를 해보자.

```kotlin
class Zettai(): HttpHandler {  
    val routes = routes(  
        "/todo/{user}/{list}" bind Method.GET to ::showList  
    )  
  
    override fun invoke(req: Request): Response = routes(req)  
  
    private fun showList(req: Request): Response {  
        val user = req.path("user").orEmpty()  
        val list = req.path("list").orEmpty()  
        
        // language=HTML
        val htmlPage = """  
            <html>               
	            <body>                    
		            <h1>Zettai</h1>                    
		            <p>
			            Here is the list <b>$list</b> of user <b>$user</b>
					</p>
	            </body>
			</html>
		""".trimIndent()  
  
        return Response(Status.OK).body(htmlPage)  
    }  
}
```

기존에 `main` 함수에 작성했던 코드가 그대로 들어왔기 때문에 별도의 설명은 생략하도록 하겠다.

### 유비쿼터스 언어

> 유비쿼터스 언어란, 에릭 에반스가 도메인 주도 디자인에서 사용한 언어이다. 유비쿼터스 언어는 개발자와 사용자 사이에 공통의 엄격한 언어를 구축하는 관행이다.

개발자가 아니더라도 비즈니스에 대해 잘 아는 사람이라면, 누구나 코드가 무엇을 하려고 하는지 알아볼 수 있는 용어로 사용하고 싶을 것이다. 이럴 때, 유비쿼터스 언어를 사용하면 **비즈니스의 개념을 직접적으로 나타낼 수 있어 유용**하다.

```kotlin
data class ToDoList(  
    val listName: ListName, val items: List<ToDoItem>  
)  
  
data class ListName(val name: String)
```

코틀린의 데이터 클래스는 불변 클래스이다. 이러한 불변 타입은 함수형 프로그래밍에 유용하다. 이는 자바의 레코드와 비슷한데, 기본적으로 비교와 동등성을 위한 세 가지 메소드(equals, toString, hashCode)를 생성해준다.

데이터 클래스의 필드는 기본적으로 불변이지만, 자바의 레코드와는 다르게 `var` 키워드를 통해 가변으로 만들 수 있다. 하지만 가변을 이용한 데이터 클래스는 그리 좋지 않다. 예를 들어보자.

```kotlin
data class User(var name: String, val surname: String)

fun main() {
	val fred = User("Fred", "Flintstone")
	val wilma = fred.copy("Wilma")
	fred.name = "Wilma"
}
```

불변을 사용할 때 가장 좋은 점은 **예측 가능한 동작을 보장**한다. 하지만, **가변 필드를 갖게 되는 순간, 예측 불가능**하게 된다. 위와 같이 `fred`를 생성하고, `wilma`를 카피로 만들었을 때, `fred.name`을 Wilma로 수정하게 되면, 두 객체는 같아진다. 또한, `hashCode`, `equals`의 동작에서 `hashCode`의 값이 변경될 수 있다.

각설하고 다시 본 코드로 돌아와보자. 우리는 지금 테스트만 작성하면 되기 때문에 가능한 적게 정의하고, 더 자세한 내용은 구현을 하면서 채워나갈 것이다.

```kotlin
data class User(val name: String)

data class ToDoItem(val description: String)  
  
enum class ToDoStatus(  
    val status: String  
) {  
    TODO("ToDo"),  
    IN_PROGRESS("In Progress"),  
    DONE("Done"),  
    BLOCKED("Blocked")  
}
```

이제 정의한 불변 클래스를 바탕으로 테스트 코드를 수정해보자.

```kotlin
// Then  
expectThat(list.listName.name).isEqualTo(listName)  
expectThat(list.items.map { it.description }).isEqualTo(foodToBuy)
```

이제 컴파일은 완료가 될테지만, `parseResponse` 함수에 대해 정의하지 않았기 때문에, parse the response 에러가 발생할 것이다. 이는, 아직 우리가 정확한 응답을 확정하지 않았기 때문에 지금 응답을 파싱하는 것은 무의미하기 때문에 보류하도록 하자.

## 화살표로 디자인하기

우리가 정의한 `getToDoList` 함수는 현재 별다른 기능을 하지 않기 때문에, 핵심 로직을 구현해보자. **함수형 디자인에서 중요한 원칙**은 **크고 뚱뚱한 함수를 하나 사용하는 것보단, 작은 함수 여러 개를 합성해 사용하는 것이 더 낫다는 것**이다. 우선 우리가 해야하는 것을 정의해보자.

1. HTTP 요청에서 사용자와 목록 이름을 가져와야 한다.
2. 목록 콘텐츠를 가져와야 한다.
3. 가져온 콘텐츠를 HTML로 렌더링해야 한다.
4. 마지막으로 HTML이 포함된 응답을 반환해야 한다.

이제 이 목록을 화살표가 있는 다이어그램으로 변환해보자.

> Request -> {User, ListName} -> ToDoList -> HTML -> Response

여기서 화살표는 왼쪽 항을 입력으로 받아 오른쪽 항을 출력으로 생성하는 함수를 의미한다. 지금은 단숨함을 유지하기 위해 발생할 수 있는 오류들을 무시하기로 하고 구현해보자.

```kotlin
/** 요청에서 사용자 이름과 목록을 뽑아낸다. */
fun extractListData(request: Request): Pair<User, ListName> = TODO()  

/** 실제 사용자 이름과 목록 이름을 키로 사용해 저장소에서 목록 데이터를 가져옴 */
fun fetchListContent(listId: Pair<User, ListName>): ToDoList = TODO()  

/** 목록을 모든 콘텐츠가 포함된 HTML 페이지로 변환하는 역할 */
fun renderHtml(list: ToDoList): HtmlPage = TODO() 

/** 생성된 HTML 페이지를 본문으로 하는 HTTP 응답 생성 */
fun createResponse(html: HtmlPage): Response = TODO()
```

함수를 디자인할 때, 좋은 방법 중 하나는, 다이어그램에 맞는 시그니처(입력과 출력 타입)를 먼저 설정하고, `TODO()`를 반환해 구현을 미루는 것이다. 그러면 `getToDoList` 함수는 다음과 같은 형태가 될 것이다.

```kotlin
fun getToDoList(request: Request): Response = 
	createResponse(
		renderHtml(
			fetchListContent(
				extractListData(request)
			)
		)
	)
```

정말 읽기도 싫게 생겼다. 그리고 우리가 설정한 화살표와 순서가 정반대로 뒤바뀌어 더 헷갈리게 생겼다. 여기서 `let` 함수를 사용하면, 원하는 데이터에 대해 함수를 호출할 수 있다.

```kotlin
fun getToDoList(request: Request): Response = 
	request
		.let(::extractListData)
		.let(::fetchListContent)
		.let(::renderHtml)
		.let(::createResponse)
```

훨씬 가독성도 좋고, 읽기 편해졌다. 모든 함수가 입력 파라미터를 하나씩만 받기 때문에 메소드 체이닝이 잘 동작한다. 이런 이유 때문에 `fetchListContent`가 `Pair` 타입으로 데이터를 받는 것이다.

## 맵으로부터 목록 제공하기

이제 `Zettai` 클래스에 위 4개의 함수를 넣어서 구현해보자.

```kotlin
class Zettai(  
    val lists: Map<User, List<ToDoList>>  
): HttpHandler {  
    val routes = routes(  
        "/todo/{user}/{list}" bind Method.GET to ::showList  
    )  
  
    override fun invoke(req: Request): Response = routes(req)  
  
    private fun showList(req: Request): Response = req  
        .let(::extractListData)  
        .let(::fetchListContent)  
        .let(::renderHtml)  
        .let(::createResponse)  
  
    /** 요청에서 사용자 이름과 목록을 뽑아낸다. */  
    fun extractListData(request: Request): Pair<User, ListName> {  
        val user = request.path("user").orEmpty()  
        val list = request.path("list").orEmpty()  
        return Pair(User(user), ListName(list))  
    }  
  
    /** 실제 사용자 이름과 목록 이름을 키로 사용해 저장소에서 목록 데이터를 가져옴 */ 
    fun fetchListContent(
	    listId: Pair<User, ListName>
    ): ToDoList =  
        lists[listId.first]?.firstOrNull { 
	        it.listName == listId.second 
		} ?: error("List unknown")  
  
    /** 목록을 모든 콘텐츠가 포함된 HTML 페이지로 변환하는 역할 */    
    // language=HTML    
    fun renderHtml(todoList: ToDoList): HtmlPage = HtmlPage("""  
        <html>  
            <body>  
                <h1>Zettai</h1>  
                <h2>${todoList.listName.name}</h2>  
                <table>  
                    <tbody>  
				        ${renderItems(todoList.items)}  
                    </tbody>  
                </table>  
            </body>  
        </html>  
    """.trimIndent())  
  
    // language=HTML  
    fun renderItems(items: List<ToDoItem>) = items.map {  
        """  
        <tr><td>${it.description}</td></tr>  
        """.trimIndent()  
    }.joinToString("")  
  
    /** 생성된 HTML 페이지를 본문으로 하는 HTTP 응답 생성 */    
    fun createResponse(html: HtmlPage): Response =   
        Response(Status.OK).body(html.raw)  
}
```

이제는 테스트 코드를 수정해보자.

```kotlin
private fun getToDoList(  
    user: String,  
    listName: String  
): ToDoList {  
    val client = JettyClient()  
  
    val req = Request(
	    Method.GET, 
	    "http://localhost:8081/todo/$user/$listName"
	)  
    val res = client(req)  
  
    return if (res.status == Status.OK) parseResponse(res.bodyString())  
    else fail(res.toMessage())  
}  
  
private fun parseResponse(html: String): ToDoList {  
    val nameRegex = "<h2>.*<".toRegex()  
    val listName = ListName(extractListName(nameRegex, html))  
    val itemsRegex = "<td>.*?<".toRegex()  
    val items = itemsRegex.findAll(html)  
        .map { ToDoItem(extractItemDesc(it)) }.toList()  
    return ToDoList(listName, items)  
}  
  
private fun extractListName(nameRegex: Regex, html: String): String =  
    nameRegex.find(html)?.value  
        ?.substringAfter("<h2>")  
        ?.dropLast(1)  
        .orEmpty()  
  
private fun extractItemDesc(matchResult: MatchResult): String =  
    matchResult.value.substringAfter("<td>").dropLast(1)  
  
private fun startTheApplication(  
    user: String,  
    listName: String,  
    items: List<String>  
) {  
    val toDoList = ToDoList(  
        ListName(listName),  
        items.map(::ToDoItem)  
    )  
    val lists = mapOf(User(user) to listOf(toDoList))  
    val server = Zettai(lists).asServer(Jetty(8081))  
    server.start()  
}
```

이제 테스트 코드가 제대로 동작할 것이다. 