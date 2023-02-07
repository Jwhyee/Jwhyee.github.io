---
title: "[PRG] - 개인정보 수집 유효기간(Java)"
last_modified_at: 2023-01-02T21:00:37-21:30
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

✅ 문제 제목 : 개인정보 수집 유효기간 - LV1

🔔 문제 유형 : 2023 KAKAO BLIND RECRUITMENT

💬 풀이 언어 : `JAVA`

⏱️ 풀이 시간 : 15분

🖇️ 문제 링크 : [프로그래머스 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/150370)

---

### 💬 문제 정리

문제는 링크를 통해 읽고 오시는 것을 추천드립니다!

> 약관 종류마다 유효 기간이 정해져있으며, 주어진 날짜를 기준으로 유효 기간이 지난 개인 정보는 파기가 된다.

### ⛔️ 주의 사항
- today는 `"YYYY.MM.DD"` 형태로 오늘 날짜를 나타낸다.

### ✏️ 문제 풀이
```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public static Map<String, Integer> termsMap = new HashMap<>();
    public static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    public boolean isPassedDay(String today, LocalDate accessDay, String sort) {
        LocalDate parseToday = LocalDate.parse(today, formatter);
        return parseToday.isAfter(accessDay.plusMonths(termsMap.get(sort))) || parseToday.isEqual(accessDay.plusMonths(termsMap.get(sort)));
    }

    public int[] solution(String today, String[] terms, String[] privacies) {
        List<Integer> answerList = new ArrayList<>();
        for (String term : terms) {
            String termSort = term.split(" ")[0];
            int termMonth = Integer.parseInt(term.split(" ")[1]);
            termsMap.put(termSort, termMonth);
        }
        for (int i = 0; i < privacies.length; i++) {
            LocalDate accessDay = LocalDate.parse(privacies[i].split(" ")[0], formatter);
            System.out.println(accessDay);
            String termSort = privacies[i].split(" ")[1];
            if (isPassedDay(today, accessDay, termSort)) {
                answerList.add(i + 1);
            }
        }
        int[] answer = new int[answerList.size()];
        for (int i = 0; i < answerList.size(); i++) {
            answer[i] = answerList.get(i);
        }
        return answer;
    }
}
```

### 🤔 회고
실제로 카카오 코딩테스트를 보면서 마주친 문제이다.<br>
조금 더 줄이고, 가독성 좋게 풀 수 있을 것 같은 문제라 코드를 수정해보는 시간을 갖는게 좋을 것 같다.