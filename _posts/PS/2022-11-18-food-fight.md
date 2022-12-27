---
title: "[PRG] - 푸드 파이트 대회(JAVA)"
last_modified_at: 2022-11-18T16:11:37-16:30
categories: PS
tags:
  - Programmers
  - Java
  - LV1
toc: true
toc_sticky: true
toc_label: "Programmers"
toc_icon: "file"
---
## 프로그래머스

✅ 문제 제목 : 푸드 파이트 대회 - LV1

🔔 문제 유형 : 연습문제

💬 풀이 언어 : `JAVA`

⏱️ 풀이 시간 : 10분

🖇️ 문제 링크 : [프로그래머스 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/134240)

---

### 💬 문제 정리

문제는 링크를 통해 읽고 오시는 것을 추천드립니다!

> 2명의 선수가 1:1로 푸드 파이트 대회를 한다.<br>
> 총 `food` 만큼의 음식이 준비되며, `food[i]`는 음식의 개수를 의미한다.<br>
> 긴 테이블에서 대회를 진행하며 각 선수는 양 끝에서 음식을 먹으며 중앙으로 도달한다.<br>
> 즉, 중앙을 기점으로 대칭수(팰린드롬)가 이뤄지면 된다고 생각하면 편하다!<br>

### ⛔️ 주의 사항
- `food[0]`은 물을 의미하며 항상 1임

### ✏️ 문제 풀이
```java
class Solution {
    /**
     * @param food 적은 칼로리로 정렬된 음식
     * */
    public String solution(int[] food) {
        String answer = "";
        StringBuilder temp = new StringBuilder();
        for (int i = 0; i < food.length; i++) {
            if(i == 0) continue;
            for (int j = 0; j < food[i] / 2; j++) {
                answer += i;
                temp.append(i);
            }
        }
        answer += "0" + temp.reverse();
        return answer;
    }
}
```

### 🤔 회고
문자를 뒤집기 위해 `StringBuilder`를 사용하였다.<br>
뭔가 더 간단하게 풀 수 있을 것 같아 찾아보니 아래와 같은 코드를 봤다.<br>
반만 완성해서 뒤에 붙이는 방식이 아니라 하나씩 증가시키는 풀이가 인상적이었다!!

```java
String answer = "0";
for (int i = food.length - 1; i > 0; i--) {
    for (int j = 0; j < food[i] / 2; j++) {
        answer = i + answer + i; 
    }
}
```