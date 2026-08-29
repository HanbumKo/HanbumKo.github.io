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

저장소 이름이 **`HanbumKo.github.io`** 여야 `https://hanbumko.github.io` 주소가 됩니다.
(다른 이름이면 `https://hanbumko.github.io/저장소이름`)

    cd ~/Desktop/homepage
    git init -b main
    git add .
    git commit -m "Initial homepage"
    git remote add origin https://github.com/HanbumKo/HanbumKo.github.io.git
    git push -u origin main

그 다음 GitHub 저장소 → Settings → Pages → Source `Deploy from a branch`,
Branch `main` / `/ (root)` → Save. 1~2분 뒤 사이트가 뜹니다.

이후 수정은:

    git add . && git commit -m "update" && git push

## 4. (선택) 개인 도메인

도메인이 있으면 `CNAME` 파일에 도메인 한 줄만 적고 push,
DNS 에서 A 레코드를 185.199.108.153 / .109.153 / .110.153 / .111.153 로 지정.

## 5. (선택) 방문자 통계

Google Analytics 태그를 `<head>` 안에 붙이면 됩니다.
