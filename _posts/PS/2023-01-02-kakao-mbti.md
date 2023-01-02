---
title: "[PRG] - 성격 유형 검사하기(Java)"
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

✅ 문제 제목 : 성격 유형 검사하기 - LV1

🔔 문제 유형 : 2022 KAKAO TECH INTERNSHIP

💬 풀이 언어 : `JAVA`

⏱️ 풀이 시간 : 20분

🖇️ 문제 링크 : [프로그래머스 문제 링크](https://school.programmers.co.kr/learn/courses/30/lessons/118666)

---

### 💬 문제 정리

문제는 링크를 통해 읽고 오시는 것을 추천드립니다!

> 카카오 성격 유형 검사에는 총 4가지 지표가 존재한다.
> 
> 1. R / T
> 2. C / F
> 3. J / M
> 4. A / N
>
> 각 번호의 지표(`survey`)와 사용자의 선택지(`choices`)를 통해 성격 유형을 검사하는 문제

### ⛔️ 주의 사항
- 각 지표에서 동일한 점수가 나올 경우 사전 순으로 빠른 유형을 선택(이미 정렬되어 있음)<br>
  - 사전순으로 정리되어 있지 않다면 각 유형의 `ASKII`로 비교하면 될 것 같다!
- `choices` 배열에서 4번을 선택할 경우 점수를 주지 않음

### ✏️ 문제 풀이
```java
import java.util.HashMap;
import java.util.Map;

class Solution {
  // 점수를 얻은 유형을 저장하기 위한 Map
  Map<Character, Integer> scoreMap = new HashMap<>();

  // 각 지표를 사전 순으로 정리해놓은 mbti 배열
  String[] mbti = {"RT", "CF", "JM", "AN"};

  /** 선택한 번호를 통해 점수를 계산하기 위한 메소드
   * @param choice 사용자의 지표 선택지
   * @return 선택지의 4를 뺀 절대값 반환
   */
  public int getScore(int choice) {
    // 들어온 값이 몇이든 4를 뺀 절대값을 해주면 1 ~ 3사이의 점수 획득
    return Math.abs(choice - 4);
  }

  /** scoreMap에 선택된 지표의 점수를 넣기 위한 메소드
   * @param c 제시된 성격 유형의 배열 예)R, T
   * @param choice 사용자의 선택지 번호
   */
  public void putScoreMap(char[] c, int choice) {
    // 사용자가 4번을 선택하면 점수를 받지 않기 때문에 4가 아닐 때만 진행!
    if (choice != 4) {
      // 선택한 번호를 토대로 얻은 점수
      int score = getScore(choice);

      // 선택한 번호를 통해 앞 유형인지, 뒷 유형인지 정하기 위한 idx
      int idx = (choice < 4) ? 0 : 1;

      // 위에서 선택된 idx를 통해 값을 넣어주고, 이미 있다면 누적합을 위해 getOrDefault 사용
      scoreMap.put(c[idx], scoreMap.getOrDefault(c[idx], 0) + score);
    }
  }

  /** 최종적인 성격 유형을 정해주는 메소드
   * @return 최종 성격 유형 반환
   */
  public String getMbti() {
    // 문자를 붙이기 위한 StringBuilder
    StringBuilder sb = new StringBuilder();

    // 주어진 지표 중 어떤 유형인지 선택하기 위한 for-each
    for (String s : mbti) {

      // 첫 지표 예시) "RT" -> typeOne = R, typeTwo = T
      char typeOne = s.charAt(0);
      char typeTwo = s.charAt(1);

      // scoreMap에 저장된 각 유형의 점수를 꺼냄, 없다면 0으로 지정
      int typeOneScore = scoreMap.getOrDefault(typeOne, 0);
      int typeTwoScore = scoreMap.getOrDefault(typeTwo, 0);

      // 각 지표에 대한 점수를 비교해서 성격 유형 지정
      if(typeOneScore > typeTwoScore) sb.append(typeOne);
      else if(typeOneScore < typeTwoScore) sb.append(typeTwo);
      else sb.append(typeOne);
    }

    // 최종적으로 만들어진 성격 유형 결과 반환
    return sb.toString();
  }

  /** 주어진 지표와 선택지를 통해 MBTI를 구하는 메소드
   * @param survey 주어진 지표
   * @param choices 주어진 지표의 사용자 선택지
   * @return 최종 성격 유형 반환
   * */
  public String solution(String[] survey, int[] choices) {

    // choices 배열을 조정하기 위한 i
    int i = 0;

    // for-each를 통해 scoreMap에 각 유형에 대한 점수를 저장
    for (String s : survey) putScoreMap(s.toCharArray(), choices[i++]);

    // 최종적으로 만들어진 성격 유형 반환
    return getMbti();
  }
}
```

### 🤔 회고
사실 이전에 풀었다가 정확성이 `20.0`으로 나와 잠시 접어두었던 문제이다.<br>
당시에 카페 마감 시간이 다가와서 급하게 풀이하다보니 코드가 정말 난해하다!

우선 그 때 작성했던 코드를 통해 어떤 점에서 문제가 있었는지 확인해보는게 좋을 것 같아 코드를 가져왔다.

```java
public class Solution {
    
    // 점수를 얻은 유형을 저장하기 위한 map
    Map<String, Integer> resultMap = new HashMap<>();
    String[] result = {"RT", "CF", "JM", "AN"};

    /** 최종적인 성격 유형을 정해주는 메소드
     * @param surveyType 문제로 주어진 지표
     * @param selectScore 선택지에서 4를 뺀 값
    */
    public void chooseType(String surveyType, int selectScore){
        // 총 몇 점을 획득했는지 구함
        int currentScore = Math.abs(selectScore);
        
        // 지표를 문자열 배열로 변경 예) RT -> {R, T}
        String[] surveyArr = surveyType.split("");
        
        // 선택지에서 4를 뺀 값이 음수일 때 앞 유형에 점수 추가
        if(selectScore < 0){
            resultMap.put(surveyArr[0], resultMap.getOrDefault(surveyArr[0], 0) + currentScore);
        }

        // 선택지에서 4를 뺀 값이 양수일 때 뒷 유형에 점수 추가
        else if(selectScore > 0){
            resultMap.put(surveyArr[1], resultMap.getOrDefault(surveyArr[1], 0) + currentScore);
        }
    }
    
    public String solution(String[] survey, int[] choices) {
        String answer = "";

        // 각 지표와 선택지를 통해 어떤 타입인지 정함
        for(int i = 0; i < survey.length; i++){
            chooseType(survey[i], choices[i] - 4);
        }

        // 문제에서 정해져있는 각 지표를 돌면서 점수 비교
        for(String resultType : result){
            // 예) 첫 지표 = "RT" | typeOne = R, typeTwo = T
            String typeOne = String.valueOf(resultType.charAt(0));
            String typeTwo = String.valueOf(resultType.charAt(1));
            
            // score를 지정하기 위한 변수 지정과 초기화
            int scoreOne = 0;
            int scoreTwo = 0;
            
            // chooseType 메소드를 통해 정해진 Map에서 각 유형의 값을 꺼내와서 비교
            // 만약 앞 유형이 존재하면 scoreOne에 해당 점수 지정
            if(resultMap.containsKey(typeOne)){
                scoreOne = resultMap.get(typeOne);
            }
            
            // 만약 뒷 유형이 존재하면 scoreTwo에 해당 점수 지정
            else if(resultMap.containsKey(typeTwo)){
                scoreTwo = resultMap.get(typeTwo);
            }
            
            // 최종 성격 유형을 정하기 위한 과정
            // 각 점수를 비교해서 큰 쪽의 유형을 지정
            if(scoreOne > scoreTwo){
                answer += typeOne;
            } else if(scoreOne < scoreTwo){
                answer += typeTwo;
            }
            
            // 점수가 같을 때 사전순으로 빠른 순서대로 유형 지정
            else {
                int num1 = typeOne.charAt(0);
                int num2 = typeTwo.charAt(0);
                if(num1 > num2) answer += typeTwo;
                else if(num1 < num2) answer += typeOne;
            }
        }
        
        return answer;
    }
}
```

🔎 **발견한 문제점**

- 변수명이 정확히 무엇을 가리키는지 이해하는데 오래 걸림

```java
Map<String, Integer> resultMap = new HashMap<>();
String[] result = {"RT", "CF", "JM", "AN"};
```

오랜만에 확인해보니 `resultMap`이라는 곳에 최종 성격 유형이 저장되는 줄 알았다..<br>
조급하게 푼 문제인 만큼 나의 습관이 나도 모르게 나온 것 같다. 앞으로 용도에 맞게 네이밍하는 습관을 들여야할 것 같다.

- `chooseType()`에서 각 유형을 `String`으로 다시 묶은 것

```java
String typeOne = String.valueOf(resultType.charAt(0));
```

위 코드에서 왜 `String`으로 다시 변환해서 사용했는지 의문이다.<br>
`char` 형태로 사용했다면 조금 더 유연하게 생각할 수 있었을 것 같다.

결론적으로 무엇이 문제인지 분석하지 못했다.<br>
**테스트 케이스**도 **10가지** 정도 넣어서 실험해봤지만, 정답을 찾을 수 없었다.<br>
이번 과정을 통해 한 가지 방식에 구애 받지 않고, 여러 방면으로 코드를 짤 수 있어야겠다는 생각이 들었다!
{: .notice--warning}