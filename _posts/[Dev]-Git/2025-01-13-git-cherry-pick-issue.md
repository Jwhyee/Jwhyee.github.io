---
title: "[Git] cherry-pick을 통해 push된 커밋 되돌리기"
last_modified_at: 2024-01-13T21:00:37-21:30
categories: "[Dev]-Git"
tags:
  - cherry-pick
toc: true
toc_sticky: true
toc_label: "Git"
toc_icon: "file"
---

회사에서 업무를 진행하다가, 팀원이 A 브랜치에 올려야할 것을 B 브랜치에 올린 적이 있다. 도와주기 위해서 커밋을 되돌리고, 다른 브랜치에 옮기는 과정에서 꼬여버려서 도와주다 실패한 경험이 있다.

다음에는 이런 실수를 하지 않도록 다시 복습하면서 정리를 해보려고 한다. 상황은 다음과 같다.

> `feat/memo` 브랜치에 총 5개의 커밋이 올라가있다고 가정하자. 그 중, 최신 커밋 3개를 `feat/reply` 브랜치로 옮겨야하는 상황이다.

### 상태 확인

우선, 아래 명령어를 통해 어느 커밋까지 내가 옮겨야하는지 해시 값을 확인한다.

```
git log --oneline --graph
```

```
* f13e123 (HEAD -> feat/memo, origin/feat/memo) update error3
* 0574123 update error2
* bc97123 update error1
* c41c123 branch update5
* 0128123 branch update4
```

이렇게 있다고 가정할 때, 나는 `update error1`까지의 커밋을 `feat/reply`에 옮길 것이다. 미리 해시 값을 잘 저장해두도록 하자.

### 커밋 되돌리기

이제 `feat/memo`에 잘못 올라간 커밋을 지워볼건데, 과정은 단순하다.

1. 커밋을 되돌릴 브랜치로 이동한다.
2. 3개의 커밋 전의 상태로 브랜치를 되돌린다.
3. 되돌린 상태에서 강제 push를 한다.

```
git switch feat/memo
```

```
git reset --soft HEAD~3
```

위 명령어를 사용하면, 파일의 버전은 커밋 3개 전 상태로 돌아가지만, 변경한 파일의 내용은 스테이징 상태로 남게 된다. 만약 변경된 내용이 굳이 필요 없다면 다음 명령어를 사용하면 된다.

```
git reset --hard HEAD~3
```

만약 `soft`로 했는데, 굳이 변경된 내용이 필요 없을 경우에는 `stash`, `stash clear`를 하거나 롤백을 하면 된다.

다음으로, 브랜치의 최신 상태를 현재로 만들기 위해 `force push`를 진행한다.

```
git push origin feat/memo --force
```

이후, 그래프를 확인해보면, 다음과 같이 잘못된 커밋 3개가 사라진 것을 볼 수 있다.

```
* c41c123 (HEAD -> feat/memo, origin/feat/memo) branch update5
* 0128123 branch update4
```

### 커밋 가져오기

앞서 `feat/reply`에 잘못 올렸던 커밋들을 `cherry-pick`을 통해 해시 값을 입력해서 가져오자.

```
git cherry-pick f13e 0574 bc97
```

나는 총 3개의 커밋을 체리픽 했기 때문에, 각 커밋을 가져올 때, 이전 커밋의 상태와 비교를 하면서, 충돌이 나게 된다. 때문에 체리픽으로 가져온 각 커밋마다 다음 과정을 수행해야 한다.

1. 이전 커밋과 체리픽으로 가져온 커밋의 충돌 해결
2. `git commit -am "..."`
3. `git cherry-pick --continue`

모든 체리픽 과정이 끝나고 마지막 커밋을 하면, 다음과 같은 문구가 뜨게 된다.

```
현재 브랜치 feat/reply
브랜치가 'origin/master'보다 3개 커밋만큼 앞에 있습니다.
  (로컬에 있는 커밋을 제출하려면 "git push"를 사용하십시오)
```

이제 마지막으로 복구한 커밋을 다음 명령어로 올리면 된다.

```
git push origin feat/reply
```

### 정리

이 과정에서 `cherry-pick`을 하고, 충돌을 해결하는 과정에서 꼬였었는데, 파일이 간단해서 그런지 충돌 해결하는건 어렵지 않았다. 하지만 다시 이런 상황이 온다면, 충돌을 해결할 때 조금 애를 먹을 것 같지만 과정은 충분히 이해할 수 있었다.