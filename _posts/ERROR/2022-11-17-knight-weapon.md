---
title: "[PRG] - 기사단원의 무기(Java)"
last_modified_at: 2022-11-17T21:11:37-21:30
categories: ERROR
tags:
- Spring Boot
- Error
- SpringBootTest
---
## 프로그래머스

✅ 문제 제목 : 기사단원의 무기 - LV1

🔔 문제 유형 : 연습문제

💬 풀이 언어 : `JAVA`

⏱️ 풀이 시간 : 15분

🖇️ 문제 링크 : [프로그래머스 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/136798)

---

### 💬 문제 정리

문제는 링크를 통해 읽고 오시는 것을 추천드립니다!

> 총 `number` 만큼의 기사가 존재하며, 각 기사는 `1 ~ number`까지의 번호를 부여받는다.<br>
> 기사단원이 부여받은 번호의 약수 개수 == 무기의 공격력을 의미한다.

### ⛔️ 주의 사항
- 공격력이 `limit`을 초과할 경우 `power`의 공격력을 가진 무기를 구매한다.

### ✏️ 문제 풀이
```java
class Solution {
    /**
     * @param number 기사단원의 수
     * @param limit 공격력 제한 수치
     * @param power 제한 수치 초과할 경우 공격력
     * */
    public int solution(int number, int limit, int power) {
        int answer = 0;
        // 각 기사단원의 공격력을 구하기 위한 for문
        for (int i = 1; i <= number; i++) {
            // cnt = 약수의 개수를 의미
            int cnt = 0;
            // 약수를 구하기 위한 for문
            for (int j = 1; j <= (int) Math.sqrt(i); j++) {
                if (i == 1) {
                    cnt++;
                    continue;
                }
                if (i % j == 0) {
                    // 9와 같이 j*j의 경우를 위한 조건문
                    if (j * j == i) cnt++;
                    else cnt+=2;
                }
            }
            if (cnt > limit) answer+=power;
            else answer+=cnt;
        }
        return answer;
    }
}
```

### 🤔 회고
초반에 문제를 풀 때는 아무 생각 없이 모든 수의 약수를 구해서 시간초과가 발생했다.<br>
이전에 약수와 관련된 많은 문제를 풀어봐서 `Math.sqrt()`를 생각해 수정해서 풀었다.<br>
문제 자체는 쉬웠지만, 한국어가 어렵게 느껴지는 문제였다 😦