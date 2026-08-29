# Hanbum Ko — 개인 홈페이지

`natureyoo.github.io` / `jonbarron.info` 와 같은 구조입니다. 빌드 도구 없이
**index.html + stylesheet.css** 만으로 동작합니다.

## 1. 미리보기

    cd ~/Desktop/homepage
    python3 -m http.server 8000
    # 브라우저에서 http://localhost:8000

또는 index.html 을 그냥 더블클릭해도 됩니다. (PDF/이미지 경로까지 정확히
확인하려면 위의 서버 방식을 권장)

## 2. 이미지 / 링크 추가하기

- 논문 티저: 가로로 긴 그림이어도 흰 배경 정사각형으로 패딩해서 `images/` 에 넣으면
  썸네일 크기가 균일하게 맞습니다. 파일명은 `index.html` 의 `<img src=...>` 와 맞추면 됩니다.
- 논문 추가/삭제: Publications 표의 `<tr> ... </tr>` 블록 단위로 복사·삭제
- 원본 이미지와 CV 원본은 `_source/` 에 보관되며 `.gitignore` 처리되어
  GitHub 에는 올라가지 않습니다.

## 3. GitHub Pages 배포

기존 `HanbumKo.github.io` 저장소에는 예전 Jekyll 블로그가 올라가 있으므로,
이 사이트는 **별도 저장소(project page)** 로 배포한다.

1. GitHub 에서 **`homepage`** 이름의 public 저장소 생성
   (README / .gitignore 추가 옵션은 모두 끌 것)
2. 푸시:

        cd ~/Desktop/homepage
        git remote add origin https://github.com/HanbumKo/homepage.git
        git push -u origin main

3. 저장소 → Settings → Pages → Source `Deploy from a branch`,
   Branch `main` / `/ (root)` → Save

주소: **https://hanbumko.github.io/homepage/**

이후 수정은:

    git add -A && git commit -m "update" && git push

### 나중에 이 사이트를 메인 주소로 옮기려면

`HanbumKo.github.io` 저장소의 내용을 이 사이트로 교체하면
`https://hanbumko.github.io` 가 이 사이트가 된다. 예전 블로그를 남기고 싶으면
먼저 백업 브랜치를 만들어 둘 것.

## 4. (선택) 개인 도메인

도메인이 있으면 `CNAME` 파일에 도메인 한 줄만 적고 push,
DNS 에서 A 레코드를 185.199.108.153 / .109.153 / .110.153 / .111.153 로 지정.

## 5. (선택) 방문자 통계

Google Analytics 태그를 `<head>` 안에 붙이면 됩니다.
