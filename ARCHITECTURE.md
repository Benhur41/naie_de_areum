# ARCHITECTURE — 네일드아름 홈페이지 현재 구조

> **이 문서는 "지금 상태"의 스냅샷입니다.** 구조가 바뀌는 작업을 마칠 때마다 갱신합니다.
> 마지막 갱신: 2026-10-12 · GitHub 저장소 이름 변경(`naie_de_areum` → `nail_de_areum`) 반영

---

## 1. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 형태 | 정적 원페이지 (HTML5 + CSS3 + Vanilla JS), 빌드 과정 없음 |
| 목적 | SEO — "대구 손톱연장 / 웨딩네일 / 네일샵" 검색과 AI 검색에서 매장을 정확히 이해시키기 |
| 공개 주소 | https://nail-de-areum.pages.dev/ (커스텀 도메인 미정) |
| 호스팅 | Cloudflare Pages, GitHub `Benhur41/nail_de_areum` 연동, `main` push 시 자동 배포 |
| 로컬 폴더 | `C:/Users/user/naie_de_areum` — 저장소 이름 변경 전 이름 그대로. **폴더 이름 변경 금지** (Claude 앱 프로젝트·워크트리·메모리 경로가 묶여 있음) |
| Pages 설정 | Framework: None · Build command: 없음 · **Build output directory: `public`** |
| 외부 의존 | Google Fonts(Cormorant Garamond), jsDelivr(Pretendard) — 둘 다 비동기 로드 |

## 2. 파일 구조

**배포되는 것은 `public/` 폴더뿐.** 문서·도구는 저장소 루트에 있고 사이트에는 올라가지 않는다.

```
/
├── public/                   # ← Cloudflare Pages 출력 디렉터리 (사이트 전체)
│   ├── index.html            # 사이트 전체 (콘텐츠 + 메타 + JSON-LD). 약 750줄
│   ├── 404.html              # 없는 주소용. ⚠ 삭제 금지 (없으면 Pages가 SPA 모드로 모든 주소에 200 응답)
│   ├── css/style.css         # 디자인 전체. 상단 :root 토큰 → 섹션 순서대로 작성
│   ├── js/main.js            # 메뉴 토글 · 헤더 스크롤 · 포트폴리오 필터 · 사진 확대(<dialog>) · 연도
│   ├── images/
│   │   ├── hero/             # 히어로 사진 (LCP 이미지)
│   │   ├── extension/        # 손톱연장 섹션 사진
│   │   ├── wedding/          # 웨딩 섹션 사진
│   │   ├── monthly-art/      # (비어 있음 — git에 없음. 이달의 아트 사진 받으면 생성)
│   │   ├── gallery/          # 기타 포트폴리오
│   │   ├── og-image.jpg      # SNS 공유 썸네일 1200×630
│   │   └── apple-touch-icon.png
│   ├── favicon.ico
│   ├── robots.txt            # 전체 허용 + Sitemap 주소
│   ├── sitemap.xml           # URL 1개 + image:image 4개
│   └── _headers              # Cloudflare 캐시: images 30일, css/js 1일
├── tools/
│   └── optimize_images.py    # 원본 → WebP 480/800/1170 변환 (출력은 public/images/...)
├── CLAUDE.md                 # Claude 작업 지침 (세션 시작 시 자동 로드)
├── ARCHITECTURE.md           # 이 문서
├── TODO.md                   # 개발 작업 목록 + 완료 로그
├── CHECKLIST.md              # 운영자가 줄 자료 목록 + 반영 완료된 매장 정보(사실 기준)
└── README.md                 # 운영자용 사용 설명서 (사진·리뷰·가격 교체, 배포, 검색 등록)
```

`.gitignore`: `.claude/` 만 제외 (Claude 작업 폴더·워크트리). 이미지 원본은 저장소에 넣지 않음.
아래 3~7번의 파일 경로는 모두 `public/` 기준.

## 3. 페이지 구조 (index.html 순서)

| # | 요소 | id | 핵심 내용 | 비고 |
|---|---|---|---|---|
| — | `<header>` | `top` | 텍스트 로고, 내비 7개, 네이버 예약 버튼 | 모바일: 햄버거 → 전체화면 패널. JS 없으면 가로 목록 |
| 01 | Hero | (없음) | **H1 "대구 프리미엄 웨딩 · 손톱연장 전문 네일드아름"**, 슬로건, 예약/포트폴리오 버튼, 히어로 사진 | 페이지 유일한 H1. 사진은 preload + fetchpriority=high |
| 02 | Brand Story | `story` | 브랜드 철학, 3 pillars | 경력·자격 등 미확인 → 일반 문구만 |
| 03 | Signature Extension | `extension` | 연장 설명, 쉐입 3종(사진에 있는 것만), 시술 과정, 연장 가격 안내 | |
| 04 | Bridal Collection | `bridal` | 웨딩 설명, White/Nude/Pearl, 사진 1장 + **플레이스홀더 3칸** | 웨딩 사진 받으면 `.ph` 교체 |
| 05 | Portfolio | `portfolio` | 필터(All/Extension/Wedding/Nail Art) + 사진 4장 | `<li data-category="...">`, 썸네일은 원본 이미지 `<a href>` |
| 06 | Monthly Art | `monthly` | 월 표기(**October 2026**), **플레이스홀더 3칸**, 인스타·예약 버튼 | 매월 갱신 필요 |
| 07 | Services & Price | `price` | 6개 블록(Hand/Extension/Foot/Removal/Bridal/Monthly) + 멤버십 | 가격은 JSON-LD `hasOfferCatalog` 와 이중 관리 |
| 08 | Client Reviews | `reviews` | 키워드 순위 5개, 네이버 방문자 리뷰 발췌 6개, 리뷰 탭 링크 | 닉네임 비표시, 별점·평점 마크업 없음 |
| 09 | FAQ | `faq` | `<details>` 9개 (연장·가격·짧은 손톱·시간·웨딩·이달의 아트·위치·반려동물·예약) | |
| 10 | Location | `location` | `<address>` dl(주소·시간·전화·인스타·카톡·편의), 주차 안내, 지도 카드(링크) | 지도 SDK 없음 |
| — | `<footer>` | — | 로고, NAP 한 줄(이름·주소·전화·시간), 링크 6개 | |
| — | `.mobile-cta` | — | 하단 고정 바: 전화 / 길찾기 / 네이버 예약 | 900px 이상 숨김 |
| — | `<dialog class="lightbox">` | — | 포트폴리오 확대 | img는 JS가 생성 |

섹션 공통 패턴: `<section class="section X" id="X" aria-labelledby="X-title">` → `.section-index`(번호) → `h2.section-title > span.en + span.ko`

## 4. CSS 구조 (css/style.css)

- **토큰 (`:root`)**: `--off-white #FAF9F6` · `--ivory #F2EDE5` · `--sand #D8C9B8` · `--taupe #A99784` · `--taupe-text #73634F`(보조 텍스트, 대비 4.5:1 확보) · `--charcoal #292723` · `--line #E4DCD0`
- **폰트**: `--serif` Cormorant Garamond(영문 제목) · `--sans` Pretendard(본문). 로고는 Times New Roman 계열
- **브레이크포인트**: 700px(2열) · 900px(데스크톱 레이아웃, 모바일 바 숨김) · 1080px(내비 가로 전환). 모바일 우선
- **작성 순서**: Reset → Typography → Buttons → Header(+no-js) → Hero → Story → Split → Bridal → `.ph` 플레이스홀더 → Portfolio/Lightbox → Monthly → Price → Reviews → FAQ → Location → Footer → Mobile CTA → 404 → Motion
- **스타일 원칙**: 둥근 모서리·그림자·그라데이션 없음, 얇은 1px 라인, 넓은 여백, 이탤릭 세리프 포인트

## 5. JavaScript

| 위치 | 역할 |
|---|---|
| `<head>` 인라인 1줄 | `no-js` 클래스를 첫 렌더 전에 제거 → JS 비활성 레이아웃과 CLS 방지. **위치 이동·삭제 금지** |
| `<head>` 폰트 `<link rel=preload onload>` | 폰트 CSS 비동기 로드 + `<noscript>` 대체 |
| `js/main.js` (defer) | ① 모바일 메뉴(aria-expanded, Esc, 1080px↑ 자동 닫힘) ② 헤더 `.is-scrolled` ③ 포트폴리오 필터(`hidden` 토글, aria-pressed) ④ 라이트박스(링크 기본동작 막고 `<dialog>`, 닫으면 포커스 복귀) ⑤ 푸터 연도 |

콘텐츠는 JS로 만들지 않음. JS가 꺼져도 모든 텍스트·메뉴·사진 링크가 동작.

## 6. SEO 구성

- **메타**: title, description, canonical, robots(`max-image-preview:large`), theme-color, OG(1200×630), Twitter `summary_large_image`, favicon, `lang="ko"`
- **검색엔진 소유확인**: `google-site-verification`(서치콘솔, URL 접두어 속성 `https://nail-de-areum.pages.dev/`) · `naver-site-verification`(서치어드바이저). 삭제 금지
- **JSON-LD `@graph`**: `NailSalon` + `WebSite`
  - NailSalon: name/alternateName, description, url, logo, image[3], **address**(명덕로 327 3층 · 중구 · 대구광역시 · 41953 · KR), **telephone**(+82-507-1426-9612), **openingHoursSpecification**(월–토 10:00–20:00), **sameAs**(인스타·네이버 플레이스·카카오 채널), amenityFeature(주차·반려동물), areaServed, priceRange, knowsAbout, hasOfferCatalog(가격 12항목)
  - 없음(의도적): `geo`(좌표 미확인), `AggregateRating`/`Review`(자사 리뷰 정책상 금지)
- **sitemap.xml**: `https://nail-de-areum.pages.dev/` 1개 + 1170px 이미지 4개, lastmod 2026-10-10
- **robots.txt**: 전체 허용, Sitemap 명시
- **이미지**: 내용 설명형 파일명, 구체적 alt, width/height, srcset+sizes, 히어로 외 lazy
- **404.html**: noindex

## 7. 이미지 목록

| 파일(크기 3종) | 원본 | 사용 위치 | 분류 |
|---|---|---|---|
| `hero/daegu-nail-extension-almond-nude` | main.jpg | 히어로 + 포트폴리오 1 | extension |
| `extension/daegu-nail-extension-coffin-nude-10` | art_3.jpg (10손 연장) | 연장 섹션 + 포트폴리오 2 | extension |
| `wedding/daegu-wedding-nail-pearl-gradient-almond` | art_1.jpg (펄 그라데이션) | 웨딩 섹션 + 포트폴리오 3 | art wedding |
| `gallery/daegu-nail-short-square-nude-onetone` | art_2.jpg (숏 원톤) | 포트폴리오 4 | art |

원본 1170×1560(3:4). 원본 파일은 저장소에 없음(삭제됨).

## 8. 측정 기록 (실험실 수치 — 실제 사용자 수치 아님)

| 날짜 | 조건 | 성능 | 접근성 | 권장 | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|
| 2026-10-10 | 로컬, Lighthouse 12 모바일, 감사 전 | 72 | 92 | 100 | 100 | 4.6s | 0.002 |
| 2026-10-10 | 로컬, 감사 수정 후 5회 | 94–98 | 100 | 100 | 100 | 2.0–2.6s | 0.001 |

배포 사이트(PageSpeed Insights) 측정은 아직 안 함.

## 9. 환경 제약 (Claude 작업 시)

- Claude 세션의 터미널·앱 브라우저에서 `*.pages.dev`, `m.place.naver.com` 접속 불가 → 실서버 확인은 사용자에게 요청
- `gh` CLI 미설치 → PR 생성 불가(필요 없음: main 직접 push 방식)
- 원격 브랜치 삭제 등 되돌리기 어려운 git 명령은 자동 권한 검사에서 차단될 수 있음
- 로컬 미리보기: `python -m http.server 8080 -d public` (Claude 앱에서는 `.claude/launch.json`의 `site` 설정 — `.claude/`는 git 제외라 새 워크트리에선 다시 만들어야 함)
