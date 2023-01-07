---
title: "[PRG] - JadenCase 문자열 만들기(Java)"
last_modified_at: 2023-01-07T21:00:37-21:30
categories: PS
tags:
  - Programmers
  - Java
  - LV2
toc: true
toc_sticky: true
toc_label: "Programmers"
toc_icon: "file"
---
## 프로그래머스

✅ 문제 제목 : JadenCase 문자열 만들기 - LV2

🔔 문제 유형 : 연습문제

💬 풀이 언어 : `JAVA`

⏱️ 풀이 시간 : 10분

🖇️ 문제 링크 : [프로그래머스 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/12951)

---

### 💬 문제 정리

문제는 링크를 통해 읽고 오시는 것을 추천드립니다!

> JadenCase란 모든 단어의 첫 문자가 대문자이며, 나머지는 소문자인 문자열을 의미<br>
> "for the last week"라는 문장이 주어졌을 때, "For The Last Week"로 변환되어야 함 

### ⛔️ 주의 사항
- 숫자는 단어의 첫 문자로만 등장한다.
- 숫자로만 이루어진 단어는 없다.
- **(중요)** 공백 문자가 연속해서 나올 수 있다.

### ✏️ 문제 풀이

총 2번의 풀이를 진행했고, 코드 실행 결과 모두 정답이었지만, 제출할 경우 런타임 에러가 등장했다.<br>
아래 코드를 보면서 어떤 차이가 있는지 확인해보도록 하자!

#### 풀이1 : 공백을 제거한 뒤 변환

```java
public class Solution{
    /** 
     * @param s JardenCase로 변경할 문자열
     * @return JardenCase로 변경된 문자열
     * */
    public String solution(String s) {
        // 문자열을 합치기 위한 StringBuilder
        StringBuilder sb = new StringBuilder();
        
        // 주어진 문장을 모두 소문자로 변경한 뒤 공백을 기준으로 배열 생성
        String[] sArr = s.toLowerCase().split(" ");
        
        // 각 배열을 돌면서 문자열 합치는 과정
        for (String str : sArr) {
            // 문자열에 공백이 포함되어 있을 경우 모두 제거한 뒤 빈 문자열인지 확인
            if(!str.replaceAll(" ", "").equals("")) 
                // 첫 글자를 대문자로 만든 뒤 붙이고, 나머지 글자는 그대로 붙이기 + 단어 구분을 위한 공백 추가
                sb.append(str.substring(0, 1).toUpperCase()).append(str.substring(1)).append(" ");
        }
        return sb.toString().trim();
    }
}
```

#### 풀이 2 : 공백을 유지한채로 변환

```java
public class Solution{
    /** 
     * @param s JardenCase로 변경할 문자열
     * @return JardenCase로 변경된 문자열
     * */
    public String solution(String s) {
        // 문자열을 붙이기 위한 StringBuilder
        StringBuilder sb = new StringBuilder();
        
        // 기존 문자열을 모두 소문자로 변환
        s = s.toLowerCase();
        
        // 첫 글자를 대문자로 변환 뒤 추가
        sb.append(Character.toUpperCase(s.charAt(0)));
        
        // 문자열을 돌면서 추가
        for (int i = 1; i < s.length(); i++) {
            // 문자열의 i번째 요소가 공백이면 그대로 추가
            if (s.charAt(i) == ' ') sb.append(" ");
            // 현재 문자 앞에 공백이 있다면 단어 시작이므로 대문자로 만든 뒤 추가
            else if (s.charAt(i - 1) == ' ') sb.append(Character.toUpperCase(s.charAt(i)));
            // 이 외에는 모두 소문자로 추가
            else sb.append(s.charAt(i));
        }
        
        return sb.toString();
    }
}
```

### 🤔 회고

처음 풀이할 때 제한 조건의 "**공백 문자가 연속해서 나올 수 있습니다.**"라는 문구를 보고, 두 가지 생각이 들었다.

- 공백 문자를 제거해서 온전한 문자열을 만들라는건가?
- 공백 문자를 유지한 문자열을 만들라는건가?

우선 연속되는 공백 문자를 제거해서 만드는게 이상적일 것 같아 1번 방식처럼 풀이하였다.<br>
하지만 런타임 에러와 정확성 `44.0`이 나온 것을 보고 **설마**...하는 마음으로 코드를 수정해봤다.<br>
역시나 기존 공백은 유지하고, 문자만 수정하는게 맞았던 것이다..

> 역시 PS는 문제를 이해하는게 가장 어려운 것 같다.<br>
> 간단한 문제라 다행이지만, 실제 코딩테스트에서 이런 혼동을 겪지 않도록 더 연습해야겠다.<br>
> 문제에서 주어지지 않은 내용으로 풀이하지 않도록 주의해야겠다!