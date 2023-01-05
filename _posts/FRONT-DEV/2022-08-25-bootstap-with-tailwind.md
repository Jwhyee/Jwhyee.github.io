---
title: "[CSS] - bootstrap과 tailwind 함께 사용하기"
last_modified_at: 2022-08-25T21:00:37-21:30
categories: FRONT-DEV
tags:
  - SpringBoot
  - Bootstrap
  - Tailwind
toc: true
toc_sticky: true
toc_label: "Front"
toc_icon: "file"
---
## 사건 발달
해커톤 프로젝트 진행을 위해 팀원들과 함께 템플릿을 구매하여 개발을 진행하고 있었다.
해당 템플릿은 `bootstrap` 기반이라 사용하다보니 `width`와 `background-color` 등의 문제로 결국 `tailwind`를 함께 사용해야겠다는 생각이 들어 진행했다.

## 프로젝트 상태
> intelliJ IDEA 사용<br>
> SpringBoot + bootstrap 기반의 5인 개발 프로젝트

현재 아래와 같이 `cdn` 방식으로 `bootstrap`을 가져와 사용 중이다.
```html
<head>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.0/css/bootstrap.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.0/js/bootstrap.min.js"></script>
</head>
```

## 적용 방법
적용 방법은 정말 친절하게도 [tailwind](https://tailwindcss.com/docs/installation) 공식 문서에 잘 나와있다.<br>
> 현재 프로젝트에서는 `.gitignore` 에 `node_modules`를 추가해놨기 때문에, 모든 팀원이 아래 방식을 같이 진행했다.

### 1. tawindcss 설치
우선 아래 순서대로 프로젝트 터미널에서 명령어를 입력해준다.<br>

```shell
npm install -D tailwindcss
npx tailwindcss init
```

<center><img src="https://user-images.githubusercontent.com/82663161/210811782-5417b437-08d3-4f83-9a30-6bcda2baa8ae.png"></center>

설치가 완료되면 프로젝트에 `node_modules` 폴더와 `tailwind.config.js`가 추가된 것을 볼 수 있을 것이다.

### 2. tailwind.config.js 수정
config 파일 내용을 아래와 같이 수정해준다.
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './src/main/**/*.{html,js}',
    './src/main/**/*'
  ],
  /*theme: {
    extend: {},
  },
  plugins: [],*/
}
```

### 3. base CSS 파일 수정
프로젝트에 가장 기본이 되는 `CSS` 파일이 하나씩은 존재할것이다.<br>
만약 그런 `CSS` 파일이 없다면 아래와 같은 경로에 비어있는 `style.css` 파일을 생성해준다.
> 사실 어떤 CSS 파일이어도 상관 없지만, 애매하면 새로 만드는 것이 좋다.<br>

```bash
./src/main/resources/static/style.css
```

다음으로 기존에 있던 CSS 파일에 아래와 같은 `at-rules(어노테이션)` 을 추가해준다.

```css
@tailwind components;
@tailwind utilities;
```

> 아마 `intelliJ` 에서는 빨간색 줄이 뜰텐데 아무 문제 없으니 걱정말자!

### 4. build
위 과정을 그대로 새로 style.css를 추가했다면 아래와 같은 명령어를 입력해주면 되고,
그게 아니라면 본인이 해당 어노테이션을 추가한 파일의 이름과 경로를 맞게 입력해주면 된다.

```shell
npx tailwindcss -i ./src/main/resources/static/style.css -o ./src/main/resources/static/dist/output.css --watch
```

<center><img src="https://user-images.githubusercontent.com/82663161/210811968-e2e3c251-ee6f-4489-b92e-4c2b37f8523f.png"></center>

> ❌  주의할 점 ❌ <br>
> 위 과정을 마치면 아래 와 같은 코드가 나올 것이다. 여기서 `controll + c` 로 나가지 않고 그대로 둔다.

```shell
Rebuilding...
Done in 191ms.
```

이와같이 진행하면 아래와 같이 `dist` 폴더 안에 `output.css` 가 생겼을 것이다.

<center><img src="https://user-images.githubusercontent.com/82663161/210811528-82d50709-a0d5-4bc4-822c-6a00ed99b6cd.png"></center>

### 5. 바꿔 넣기
마지막으로 `layout` 혹은 `fragments` 에 넣어놨던 코드를 `output.css` 로 바꿔준다.

```html
<head>
    ...
    <!-- 기존에 사용하던 CSS -->
    <!-- <link rel="stylesheet" type="text/css" th:href="@{/style.css}">  -->

    <!-- 새로 output된 CSS -->
    <link href="/dist/output.css" rel="stylesheet">
</head>
```

> 만약 `layout` 혹은 `fragments`를 사용하지 않고 모든 페이지마다 `head`를 넣어줬다면
> 유감스럽게도 모든 `html` 파일에 적용해줘야한다.

### 6. 사용
아까 `tailwind.config.js`를 수정할 때 미리 눈치챘을 수 있겠지만, `prefix: 'tw-'`를 넣어준 이유는 이미 `bootstrap`이 프로젝트의 주된 라이브러리로 자리를 잡고 있기 때문에 `tailwind`의 `class` 명과 헷갈리지 않기 위해 넣어줬다.

```html
<form class="input-group tw-bg-blue-500">
    <select class="form-select" name="sortCode">
        <option value="NEWEST" th:selected="${sortCode} == 'NEWEST'">최신순</option>
        <option value="OLDEST" th:selected="${sortCode} == 'OLDEST'">오래된순</option>
    </select>
</form>
```

위와 같이 `tailwind`의 클래스 문법 앞에 `tw-` 를 붙여서 사용해주고 저장(cmd + s)을 해주면 `output.css` 에 해당 구문에 대한 `tailwind CSS` 가 추가된다.

> ❌  주의할 점 ❌ <br>
> 아까 build 과정에서 `controll + c` 로 빠져나갔으면 적용이 안 될수 있다.