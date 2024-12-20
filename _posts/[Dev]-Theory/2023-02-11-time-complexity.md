---
title: "[알고리즘] - 시간복잡도"
last_modified_at: 2023-02-11T21:00:37-21:30
categories: "[Dev]-Theory"
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
아래 식의 순서는 시간이 오래 걸리는 최악의 경우에서 가장 최선의 경우까지 나타낸 것이다.

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

입력되는 양과 수가 커진다고 하더라도, 모든 수행문은 한 번씩 실행되기 때문에 $O(1)$이라고 볼 수 있다.

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

### O(n^2)

> 이차원 정방형 배열을 출력하는 알고리즘

```java
public class BigOTest{

    public static void printCode(int[][] arr){
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                System.out.printf("%d\t", arr[i][j]);
            }
            System.out.println();
        }
    }

    public static void main(String[] args){
        int[][] arr = {
                {1, 2, 3, 4, 5},
                {6, 7, 8, 9, 10},
                {11, 12, 13, 14, 15},
                {16, 17, 18, 19, 20},
                {21, 22, 23, 24, 25}
        };
        printCode(arr);
    }
}
```

`arr.length == arr[0].length`와 같기 때문에 `n`으로 통용해 사용하였다.<br>
`outer loop`, `inner loop` 모두 $n$번 반복하기 때문에 $n^2$이라고 표현할 수 있다.

즉, 이를 빅오 표기법으로 변경하면 $O(n^2)$으로 표현할 수 있다.

$O(n^3)$은 3중으로 중첩된 반복문이 모두 n까지 반복하는 것이라고 이해하면 된다!

### O(log n)

코드를 보기 전에 우선 로그의 형태를 확인해보자!

$log_b(a) = c$ 해당 식을 $b^c = a$으로 표현할 수 있다

위 식을 알고 있다면 아래 내용은 쉽게 이해할 수 있을 것이다!

> 이진 탐색(이분 탐색)을 하기 위한 알고리즘

```java
public class BigOTest {
    public static int binarySearch(int findNum, int start, int end, int[] searchArr) {
        if (start > end) {
            return -1;
        }
        int mid = (start + end) / 2;
        if (searchArr[mid] == findNum) {
            return mid;
        } else if (searchArr[mid] > findNum) {
            return binarySearch(findNum, start, mid - 1, searchArr);
        } else {
            return binarySearch(findNum, mid - 1, end, searchArr);
        }
    }

    public static void main(String[] args) {
        int[] searchArr = {1, 2, 3, 4, 5, 6, 7, 8};
        int idx = binarySearch(5, 0, arr.length - 1, searchArr);
        System.out.print(idx);
    }
}
```

이진 탐색이란 오름차순으로 정렬된 탐색할 배열의 시작 지점에서 끝 지점의 중앙 값을 가져와 조건에 맞는 구간을 탐색하는 방식이다.

예를 들어 1 ~ 100까지 오름차순으로 정렬된 배열이 있고, 98이라는 수의 위치를 찾는다고 가정하자.
1. 98이라는 수를 찾기 위해 1~50, 50~100으로 탐색할 구간을 나눈다.
2. 현재 찾고 있는 수가 중앙값인 50과 비교를 해 탐색할 구간을 다시 정한다.
3. 50보다 크기 때문에 재귀호출을 통해 49 ~ 100까지 다시 탐색을 한다.
4. 현재 찾고 있는 수가 중앙값인 75와 비교를 해 탐색할 구간을 다시 정한다.
5. 75보다 크기 때문에 재귀 호출을 통해 74 ~ 100까지 다시 탐색을 한다.
6. ...

이를 식으로 표현하자면 아래와 같다.
- 첫 번째 루프 : $n$
- 두 번째 루프 : $\frac{n}{2}$
- 세 번째 루프 : $\frac{n}{4}$
- 네 번째 루프 : $\frac{n}{16}$
- ...
- x번째 루프 : $\frac{n}{2^x}$

가장 마지막의 경우를 식에서 `n`을 구하기 위한 식으로 나타내보면 $2^x = n$로 표현할 수 있다.

이 형태에서 `x`를 구하기 위해 `log` 공식을 대입하면 $log_2n = x$로 표현할 수 있다.<br>
상용 로그에서는 밑을 생략할 수 있기 때문에 $log n = x$로 표현하며, 
이를 빅오 표기법으로 변경하면 $O(log n)$이라고 표현할 수 있다!