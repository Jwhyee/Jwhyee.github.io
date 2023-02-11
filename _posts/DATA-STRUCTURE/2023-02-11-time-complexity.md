---
title: "[알고리즘] - 시간복잡도"
last_modified_at: 2023-02-11T21:00:37-21:30
categories: DATA-STRUCTURE
use_math: true
tags:
  - Java
  - Big-O
  - DataStructure
toc: true
toc_sticky: true
toc_label: "Data Structure"
toc_icon: "file"
---
## 시간 복잡도란?

알고리즘을 프로그램으로 실행하여 완료하는데 걸리는 시간이며, 컴파일 시간 + 실행 시간의 합으로 표현된다.

컴파일 시간은 거의 고정되어 있는 시간이기 때문에 프로그램을 수정하지 않는 한 컴파일 작업이 없으므로 중요한 요소로 뽑히지 않는다.

즉, 우리가 실질적으로 구하는 시간 복잡도는 실제 실행 시간이 아닌 명령문(각 라인)의 실행 빈도수를 계산하여 실행 시간을 구하는 것이다.

오늘은 `Big-O Notation`에 대해 살펴보도록 하겠다!

### 🤔 표기법의 종류

표기법에는 빅오(Big-O), 빅오메가(big-Ω), 빅세타(big-Θ) 총 3가지로 나눌 수 있다.
그런데 왜 우리는 `Big-O` 표기법을 가장 많이 사용하는걸까?

Big-O 표기법은 알고리즘의 효율성을 상한선 기준으로 표기하기 때문이다.

![image](https://user-images.githubusercontent.com/82663161/218238541-b47cf189-85c2-415e-b159-a83931536d64.png)

위 그래프에서 위쪽을 향할수록 시간이 오래 걸린다고 생각하면 된다.

< 최악 ----------------------------------------------------------------------------------- 최선 >

$O(2^n)$ ➡️ $O(n^2)$ ➡️ $O(n log n)$ ➡️ $O(n)$ ➡️ $O(log n)$ ➡️ $O(1)$

백엔드 기준으로 사용자가 요청을 보냈을 때, 우리가 작성한 비즈니스 로직의 실행 시간이 오래 걸린다면 사용자 또한 그 시간동안 빈 화면을 보고 기다려야한다.

## 😎 코드로 살펴보기

### O(1)

> 주어진 수를 모두 더하는 알고리즘

```java
public class BigOTest{

        public static int numSum(int num1, int num2){
                return num1 + num2;
        }
        
        public static void main(String[] args){
                System.out.println(numSum(1, 2));
        }
}
```

입력되는 양과 수가 커진다고 하더라도, 모든 수행문은 한 번씩 실행되기 때문에 O(1)이라고 볼 수 있다.

### O(n)

> 피보나치 수열의 항을 구하는 알고리즘

```java
public class BigOTest {

    public static int fibonacci(int n) {
        int result = 0;

        if (n < 0) {
            return 0;
        } else if (n <= 1) {
            return n;
        }

        int f1 = 0, f2 = 1, fn = 1;
        for (int i = 2; i <= n; i++) { // n
            fn = f1 + f2; // n-1
            f1 = f2; // n-1
            f2 = fn; // n-1
        }

        return fn;
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(5));
    }
}
```

`for statement`가 끝나는지 확인해야하기 때문에 `n`번을 반복하고, 이 때문에 포함된 명령문들은 `n-1`번을 반복하게 된다.

즉, $4n-3$이라는 식이 나오게 되며, n의 붙은 계수(4)와 상수항(-3)은 크게 영향을 주지 않기 때문에 $n$이라고 표현할 수 있다.
이를 빅오 표기법으로 변경하면 $O(n)$으로 표현할 수 있다.