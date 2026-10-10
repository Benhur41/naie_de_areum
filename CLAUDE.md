# CLAUDE.md — 네일드아름(NAIL DE AREUM) 홈페이지

대구 중구 대봉교역 앞 프리미엄 네일샵 **네일드아름**의 공식 홈페이지.
정적 원페이지(HTML/CSS/Vanilla JS) → Cloudflare Pages(`main` push 시 자동 배포) → https://nail-de-areum.pages.dev/

> **📁 사이트 파일은 전부 `public/` 안에 있다** (Cloudflare 출력 디렉터리 = `public`). `public/` 밖의 문서(`*.md`)·`tools/` 는 GitHub에만 있고 사이트에는 배포되지 않는다.
> 이 문서에서 `index.html`, `css/style.css` 등은 모두 `public/` 기준 경로다.

---

## 0. 세션 시작 시 반드시 할 것

1. **[`TODO.md`](TODO.md)** 를 읽는다 — 진행 중 / 다음 할 일 / 자료 대기 / 완료 로그
2. **[`ARCHITECTURE.md`](ARCHITECTURE.md)** 를 읽는다 — 현재 파일·섹션·CSS·JS·SEO 구조, 이미지 목록, 환경 제약
3. 매장 정보나 자료가 걸린 작업이면 **[`CHECKLIST.md`](CHECKLIST.md)** 를 읽는다 — "✅ 반영 완료"가 **매장 사실 정보의 기준(source of truth)**
4. `git fetch origin` 후 `origin/main` 이 최신인지 확인하고 그 위에서 작업한다 (워크트리 세션이면 특히)
5. TODO.md 완료 로그에 `(이번 커밋)` 으로 남은 항목이 있으면 `git log` 로 해시를 채운다

## 1. 작업을 마칠 때 반드시 할 것

1. **검증** (아래 6번 체크리스트)
2. **TODO.md 갱신** — 끝낸 항목을 완료 로그로(날짜·내용·커밋), 새로 생긴 할 일 추가, "마지막 갱신" 날짜 수정
3. **ARCHITECTURE.md 갱신** — 파일·섹션·JSON-LD·이미지·측정값 중 바뀐 부분 반영, "마지막 갱신" 날짜 수정
4. **CHECKLIST.md 갱신** — 받은 자료는 ✅ 반영 완료로 옮기기
5. **README.md 갱신** — 운영자 절차(사진·리뷰·가격 교체 방법 등)가 바뀐 경우만
6. **커밋 → `main` 에 바로 push** (브랜치·PR 사용 안 함 — 사용자 요청)
   - `git fetch origin && git merge-base --is-ancestor origin/main HEAD && git push origin HEAD:main`
   - 커밋 메시지는 영어 요약 + 본문 목록, 끝에 Co-Authored-By 줄

## 2. 프로젝트 목적 — 모든 기능 추가의 기준

**최우선 목표는 SEO.** 구글·네이버 검색과 AI 검색이 다음을 정확히 이해하게 만드는 것:
> "네일드아름은 대구 중구(대봉교역)에 위치한 프리미엄 웨딩네일 및 손톱연장 전문 네일샵이다."

- 주요 키워드: 대구 네일샵 · 대구 손톱연장 · 대구 연장네일 · 대구 젤연장 · 대구 웨딩네일(추천) · 대구 프리미엄 네일샵 · 대구 네일아트 · 대구 이달의 아트
- 키워드는 **고객에게 유용한 문장 안에 자연스럽게**. 반복 나열·숨김 텍스트 금지
- 브랜드 포지션: 저가·할인이 아니라 **전문성·완성도·섬세함·고급스러운 경험**. 핵심 전문 분야는 ① 손톱연장 ② 웨딩네일, 그다음 네일아트·이달의 아트

## 3. 절대 원칙

### 사실만 쓴다
- 확인 안 된 정보는 **만들지 않는다**: 경력·자격증·사용 제품·연장 방식(젤/아크릴/팁)·가격·리뷰 수·평점·시술 시간·정책
- 확인 안 된 건 일반적인 안내 문구("상담 시 안내")로 두고 CHECKLIST.md 에 자료 요청으로 남긴다
- 사진에서 알 수 없는 것(웨딩 시술 여부, 연장 여부, 이달의 아트 월·가격)은 **추측하지 말고 사용자에게 묻는다**
- 가짜 리뷰·가짜 평점 금지. **`AggregateRating`·`Review` 구조화 데이터 추가 금지** (구글 자사 리뷰 정책)
- 리뷰 원문: 닉네임 비표시, 의미가 바뀌지 않게 `…` 로 발췌, "네이버 방문자 리뷰 · 방문일" 출처 표기, 작성자가 원하면 즉시 삭제
- 검색 순위·AI 추천 보장 표현 금지. **측정하지 않은 성능 점수를 주장하지 않는다** (Lighthouse 로컬 값은 "실험실 수치"로 명시)

### 기술 스택을 지킨다
- **HTML5 + CSS3 + Vanilla JS 만.** 프레임워크·빌드 도구·npm 런타임 의존·외부 JS 라이브러리 금지
- **SEO 콘텐츠는 처음부터 `index.html` 에 존재.** JS로 콘텐츠를 생성하지 않는다 (JS는 메뉴·필터·확대 같은 *향상* 기능만)
- JS가 꺼져도 모든 텍스트·메뉴·링크가 동작해야 한다
- **원페이지 유지.** 새 페이지가 꼭 필요하면 사용자와 상의 → sitemap.xml 추가
- 무거운 외부 SDK(지도 SDK 등) 대신 링크·정적 이미지

### 디자인 톤을 지킨다
- Quiet Luxury · Bridal Elegance · Editorial · Minimal. 고급 웨딩 브랜드와 럭셔리 뷰티 브랜드의 중간
- 색은 `:root` 토큰만 사용 (off-white/ivory 중심, sand는 포인트, charcoal은 텍스트·CTA). **핑크·골드·강한 그라데이션 금지**
- 둥근 모서리·그림자·카드 남발 금지. 1px 라인, 넓은 여백, 영문 이탤릭 세리프 포인트
- 영문 제목 `--serif`(Cormorant Garamond), 한글 본문 `--sans`(Pretendard)
- 모바일 우선. 360px에서 가로 스크롤 없이, 터치 영역 44px 이상

## 4. 새 기능을 추가하는 방법

### 새 섹션
기존 패턴을 그대로 따른다:
```html
<section class="section 이름" id="이름" aria-labelledby="이름-title">
  <div class="container">
    <p class="section-index">NN — English Label</p>
    <h2 id="이름-title" class="section-title">
      <span class="en">English Title</span>
      <span class="ko">키워드가 자연스럽게 들어간 한글 부제</span>
    </h2>
    ...
  </div>
</section>
```
- H1은 히어로 하나뿐. 섹션은 H2, 그 안은 H3
- 내비에 넣을 경우 `#site-nav` 링크 추가, 이후 `.section-index` 번호 재정렬
- CSS는 style.css 의 섹션 순서 위치에 추가, 모바일 기본 → `@media (min-width: 700/900/1080px)`
- 영문·한글 `<span>` 을 붙여 쓸 땐 **사이에 공백**을 둔다 (텍스트 추출 시 "Hand핸드"처럼 붙는 문제)

### 사진
1. `python tools/optimize_images.py <원본> public/images/<폴더>/<설명형-파일명>` → WebP 480/800/1170 (HTML에서는 `images/...`)
2. 파일명: `daegu-<분야>-nail-<특징>` (영문 소문자-하이픈)
3. alt: 쉐입·길이·컬러·아트를 구체적으로 ("아몬드 쉐입 손톱연장, 누드 핑크 펄 그라데이션")
4. `<img>` 에 width/height, srcset, 실제 레이아웃 폭에 맞는 sizes, 히어로 외 `loading="lazy"`
5. 포트폴리오는 `<li data-category="extension|wedding|art">` (복수는 공백 구분), 썸네일은 1170 원본으로 가는 `<a class="gallery-open">`
6. sitemap.xml 에 대표 이미지 `<image:image>` 추가
7. 플레이스홀더 교체 시 `.ph`(role="img"는 `<li>`가 아닌 내부 `<div>`에) 를 `<img>` 로 바꾼다
8. 원본 사진은 저장소에 넣지 않는다 (프로젝트 폴더에 받으면 `.gitignore` 에 추가)

### 함께 고쳐야 하는 곳 (이중 관리)
| 바꾸는 것 | 같이 바꿀 곳 |
|---|---|
| 가격 | `#price` + JSON-LD `hasOfferCatalog` (+ 연장 가격은 `#extension`·FAQ) |
| 주소·전화·영업시간 | `#location`, FAQ, 푸터 `.footer-address`, 모바일 바(전화), JSON-LD |
| 외부 링크(네이버·인스타·카톡) | `.js-booking`·`.js-place` 전체, `#location`, 푸터, FAQ, JSON-LD `sameAs` |
| 사이트 주소(도메인) | `index.html`(canonical·OG·JSON-LD), `robots.txt`, `sitemap.xml` |
| 섹션 추가·삭제 | 내비, `.section-index` 번호, ARCHITECTURE.md 3번 표 |

### 건드리면 안 되는 것
- `404.html` — 없으면 Cloudflare Pages가 모든 없는 주소에 홈을 200으로 응답 (soft 404)
- `<head>` 의 `no-js` 제거 인라인 스크립트 — 옮기면 JS 비활성 레이아웃이 깜빡이며 CLS 발생 (실측 0.114)
- 폰트 `preload + onload` + `<noscript>` 구조 — 되돌리면 렌더링 차단 재발
- `robots.txt` 에 `Disallow: /` 를 넣지 말 것
- 사이트 파일을 `public/` 밖으로 꺼내지 말 것 — 밖에 두면 배포되지 않는다. 반대로 문서·스크립트·원본 사진은 `public/` 에 넣지 말 것(공개됨)

## 5. 사용자와 일하는 방식

- **항상 한국어로 답한다.** 사용자는 비개발자에 가까우므로 쉬운 말로, Cloudflare·검색 등록 같은 외부 작업은 화면 단위로 안내
- 완료 보고는: 무엇을 바꿨는지 → 확인한 것/못 한 것 → 사용자가 할 일 순서
- Claude 환경에서 `*.pages.dev`·네이버 플레이스는 열리지 않음 → 실서버 확인은 사용자에게 요청
- 외부로 나가는 작업(메시지 발송, 외부 서비스 등록 등)과 되돌리기 어려운 작업은 먼저 확인

## 6. 검증 체크리스트

- [ ] 로컬 미리보기: `python -m http.server 8080 -d public` (앱에서는 `.claude/launch.json` 에 같은 명령으로 `site` 설정을 만들어 사용)
- [ ] 360 / 375 / 1440px 화면 확인, `document.documentElement.scrollWidth` 로 가로 넘침 없음
- [ ] JS 비활성 확인: `sandbox="allow-same-origin"` iframe 으로 페이지를 띄워 메뉴·콘텐츠 확인
- [ ] JS 기능: 메뉴 열고 닫기, 필터, 확대 보기, 콘솔 오류 없음
- [ ] JSON-LD 파싱: `python -c "import re,json;s=open('public/index.html',encoding='utf-8').read();json.loads(re.search(r'<script type=\"application/ld\+json\">(.*?)</script>',s,re.S).group(1))"`
- [ ] `npx -y html-validate@8 public/index.html` — 알려진 무해 경고: `doctype-style`, `tel-non-breaking`, `<dialog>`의 `aria-label-misuse`
- [ ] 큰 변경 후 Lighthouse(모바일): `CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" npx -y lighthouse@12 http://localhost:8080/ --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new"` → 결과를 ARCHITECTURE.md 8번에 기록. 압축·캐시 경고는 로컬 서버 탓(Cloudflare에서 해결)

## 7. 문서 지도

| 문서 | 대상 | 내용 |
|---|---|---|
| `CLAUDE.md` | Claude | 이 지침 (원칙·절차) |
| `ARCHITECTURE.md` | Claude | 현재 구조 스냅샷 — 작업 끝날 때마다 갱신 |
| `TODO.md` | Claude·사용자 | 개발 작업 목록 + 완료 로그 — 작업마다 갱신 |
| `CHECKLIST.md` | 사용자 | 운영자가 줄 자료 목록 + 확인된 매장 정보 |
| `README.md` | 사용자 | 사진·리뷰·가격 교체, 배포, 검색 등록 방법 |
