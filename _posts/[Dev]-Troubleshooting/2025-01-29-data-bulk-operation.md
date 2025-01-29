---
title: "[Spring] - 벌크 조회를 이용한 성능 최적화"
last_modified_at: 2025-01-17T13:12:37-13:30
categories: "[Dev]-Troubleshooting"
tags:
  - Spring Boot
toc: true
toc_sticky: true
toc_label: "NoSuchMethod"
toc_icon: "file"
---

## 🛠️ 개발 환경

- kotlin : 2.1.0
- Spring Boot : 3.3.0

## 💬상황 설명

현재 재직 중인 회사는 여러 도메인 엔티티를 하나로 묶어 관리하는 에그리게이트(Aggregate) 단위로 모듈이 나누어져있고, 각 에그리게이트 내부에 있는 엔티티 기반의 API를 개발한다.

한 페이지에서 여러 엔티티에 대한 정보가 필요할 경우, 프론트에서 각 API를 호출하여, 데이터를 뿌려준다.  하지만, 특정 뷰에서는 A 데이터를 기반으로 B 데이터를 합친 결과를 보여준다. 예를 들어, C에 대한 리스트를 보여주기 위해서는 A를 먼저 조회하고, A가 속한 B를 찾은 뒤, 결과를 합쳐서 C를 보여주는 것이다.

B는 여러 개의 A를 가질 수 있기 때문에, 정규화에 의해 AB라는 중간 테이블을 두어 관리를 하고 있다. 즉, A가 속한 B를 보여주기 위해선, A -> AB -> B 형태로 조회가 되어야하는 것이다.

이전에는 다음과 같이 A 리스트를 먼저 조회하고, 각 A가 속한 B를 찾기 위해 리스트를 순회하면서 B에 대한 결과를 가져오는 방식으로 동작하고 있었다.

```kotlin
val resAList = netApiA(pagenation)
resAList.forEach { resA ->
	netApiB(resA.rowid) { resB ->
		// resC는 조회 결과가 없을 수 있음
		val resC: ResponseC? = netApiC(resB.rowid)
		
		val resAC = combine(resA, resC)
		...
	}
}
```

여기서 `netApiA`는 페이지네이션이 되어있어 최대 20개까지 조회하는데, A와 B는 각각 300 라인이 넘는 JSON을 갖게 된다. 즉, 무거운 데이터에 대해서 많은 요청을 서버에 보내는 것이다.

실제 웹에서 Network 탭에서 확인해보면, 서버에 요청을 보내고, 응답을 받는 데까지 **3.1s**까지 걸린다. 이를, 서버 조회 API로 그대로 만들 경우, 응답까지 **2.49s ~ 2.72s** 정도 소요하게 된다. 즉, 페이지네이션임에도 많은 네트워크 비용이 든다는 것을 알 수 있다.

![이미지](https://private-user-images.githubusercontent.com/82663161/406649443-e9fbb410-ebd8-4246-a98e-78d1a7a39b41.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzc3OTQ2MDUsIm5iZiI6MTczNzc5NDMwNSwicGF0aCI6Ii84MjY2MzE2MS80MDY2NDk0NDMtZTlmYmI0MTAtZWJkOC00MjQ2LWE5OGUtNzhkMWE3YTM5YjQxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAxMjUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTI1VDA4MzgyNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTA1NmJhYjQ5YTEyMWE3NWYzYjE4MzQzMmZjNjhkMTM5ZWE1ZjE2NDllNzAzZGY0MDAzMGFlYzFiNmVmYWU4N2UmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.i9grs3nQqkhFzCT2UROo1PmTK6sgwcPuHDj93J7xO5w)

## ✅ 해결 과정

현재 프론트에서는 20개의 A 객체를 얻기 위해 1번을 조회하고, 리스트를 순회하면서 B를 조회하기 때문에, 총 `1 + 20(AB 테이블 조회) + 20(B 테이블 조회) = 41` 번의 쿼리 연산을 수행하게 된다. 이를 조금 더 효율적으로 변경하려면 다음과 같이 2가지 방식으로 변경할 수 있다.

### 방법1

```kotlin
val resAList = netApiA(pagenation)
val resBList = netApiB(resAList.map { it.rowid })
val combineList = resAList.responseCombine(resBList)
```

첫 번째 방법은 A를 조회한 결과를 가지고, B에 요청을 보내, 벌크 조회를 하고 C를 만들어내는 것이다. 이 코드는 여전히 큰 문제점을 가지고 있다.

`resAList`를 조회한 후 `resBList`를 조회하는 사이에 서버의 데이터가 변경될 가능성이 있다. 예를 들어, `netApiA` 호출 이후 데이터가 갱신되거나 삭제되면 `netApiB`에서 조회하는 `rowid`가 더 이상 유효하지 않을 수 있다. 이로 인해 `netApiB`의 결과가 일관되지 않거나 일부 데이터가 누락될 수 있다.

즉, 일반적인 RDBMS의 트랜잭션처럼 `netApiA`와 `netApiB`가 자적으로 실행되는 것이 아니라 개별 API 호출로 동작하기 때문에 정합성이 깨질 수 있는 것이다.

예를 들어, `netApiA`를 실행한 후 `netApiB`를 실행하기 전에 조회된 A 중 일부 데이터 삭제될 경우, `netApiB`에서 일부 rowid가 존재하지 않아 DB 에러가 발생할 수 있는 것이다.

### 방법2

이를 해결하기 가장 좋은 방법은, 에그리게이트를 위한 API가 아닌, 해당 뷰를 위한 API를 개발하여, 필요한 데이터를 모두 서버에서 처리하여 클라이언트로 내려주는 것이다.

> 아래 코드는 간단하게 설명하기 위한 수도 코드입니다.

```kotlin
@Transactional
suspend fun findViewList(
	pagination: Pagination
): Flow<CDto> {
	val aList = aRepository.findByRowIdList(pagination)
	
	val bRowIdList = abRepository
		.findByARowIdList(aList.map { it.rowId })
		.map { it.bRowId }

	val bList = bRepository.findByRowIdList(bRowIdList)
	
	return combine(aList, bList)
}
```

위와 같이 서버에서 모두 처리하도록 변경한 결과, 프론트는 총 1번만 서버에 요청하게 되었고, 서버에서는 페이지네이션을 통해 얻어온 결과를 기반으로 한 트랜잭션 내에서 모든 연산을 진행할 수 있게 되어, 데이터 정합성도 보장할 수 있게 되었고, 각 테이블의 rowid를 기반으로 벌크 조회를 하기 때문에 인덱싱을 통해 성능면에서도 개선할 수 있었다.

![이미지2](https://private-user-images.githubusercontent.com/82663161/407633533-706800f9-4307-4b51-879f-87ad2cddddb3.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzgxMzQzMTAsIm5iZiI6MTczODEzNDAxMCwicGF0aCI6Ii84MjY2MzE2MS80MDc2MzM1MzMtNzA2ODAwZjktNDMwNy00YjUxLTg3OWYtODdhZDJjZGRkZGIzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAxMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMTI5VDA3MDAxMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTQ2OWMyODVhOGUyZTY2OTc1YjczYjU3ZWNmMTRkODVmYWE1YWUyMDNlZTQ2NTdmNjFiZmMwOGM1NGMzODVjYTkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.UKDRv-LoKHyESGovL3u0lSk-NmvMgj5ImQXGKdm8KfI)

총 10번 가량의 요청 결과 **206ms ~ 370ms** 정도로 성능적으로 개선된 것을 볼 수 있다.

## 🤔 회고

벌크 조회는 항상 좋은 것만은 아니다. IN 절(WHERE rowid IN (...)) 사용 시 개수가 너무 많으면 **풀 테이블 스캔 가능성**이 있어, 오히려 성능이 저하될 수 있다. 때문에 여러 방식을 비교하면서 사용하는 것이 좋을 것 같다.

JOIN으로도 깔끔하게 풀 수 있을 것 같은데, 현재 회사에서 사용하는 DSL로는 한계가 있을 것 같다. 팀원들과 함께 더 좋은 성능을 낼 수 있게 더 고민하고, 수정해봐야할 것 같다.

|           | 기존 방식              | 개선 방식         |
| --------- | ------------------ | ------------- |
| API 요청 횟수 | 41회                | 1회            |
| 쿼리 조회 횟수  | 41회                | 3회            |
| 평균 응답 속도  | 2.49s ~ 2.72s      | 206ms ~ 370ms |
| 데이터 정합성   | API 호출 간 변경 가능성 존재 | 트랜잭션 내에서 처리   |
