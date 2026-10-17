# ARCHITECTURE — 네일드아름 홈페이지 현재 구조

> **이 문서는 "지금 상태"의 스냅샷입니다.** 구조가 바뀌는 작업을 마칠 때마다 갱신합니다.
> 마지막 갱신: 2026-10-17 · 배포 사이트 접근 진단 기록(8번), AI 크롤러·외부 가져오기 점검 방법(9번)

---

## 1. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 형태 | 정적 원페이지 (HTML5 + CSS3 + Vanilla JS), 빌드 과정 없음 |
| 목적 | SEO — "대구 손톱연장 / 웨딩네일 / 네일샵" 검색과 AI 검색에서 매장을 정확히 이해시키기 |
| 공개 주소 | https://nail-de-areum.pages.dev/ (커스텀 도메인 미정) |
| 호스팅 | Cloudflare Pages, GitHub `Benhur41/nail_de_areum` 연동, `main` push 시 자동 배포 |
| 로컬 폴더 | `C:/Users/user/naie_de_areum` — 저장소 이름 변경 전 이름 그대로. **폴더 이름 변경 금지** (Claude 앱 프로젝트·워크트리·메모리 경로가 묶여 있음) |
| Pages 프로젝트 | **`nail-de-areum`** (2026-10-12 재생성. 처음 만든 `naie-de-areum` 프로젝트는 삭제됨 — Pages 프로젝트 이름은 변경 불가) |
| Pages 설정 | Framework: None · Build command: 없음 · **Build output directory: `public`** |
| 외부 의존 | Google Fonts(Cormorant Garamond), jsDelivr(Pretendard) — 둘 다 비동기 로드 |

## 2. 파일 구조

**배포되는 것은 `public/` 폴더뿐.** 문서·도구는 저장소 루트에 있고 사이트에는 올라가지 않는다.

```
/
├── public/                   # ← Cloudflare Pages 출력 디렉터리 (사이트 전체)
│   ├── index.html            # 사이트 전체 (콘텐츠 + 메타 + JSON-LD). 약 2,500줄 · 180KB (Brotli 전송 시 약 20KB)
│   ├── 404.html              # 없는 주소용. ⚠ 삭제 금지 (없으면 Pages가 SPA 모드로 모든 주소에 200 응답)
│   ├── css/style.css         # 디자인 전체. 상단 :root 토큰 → 섹션 순서대로 작성
│   ├── js/main.js            # 메뉴 · 헤더 스크롤 · 포트폴리오 필터/더 보기 · 사진 확대(<dialog>) · 이달의 아트 연도·월 선택 · 연도
│   ├── images/
│   │   ├── hero/             # 히어로 사진 (LCP 이미지) — 1장
│   │   ├── extension/        # 손톱연장 섹션 대표 사진 — 1장
│   │   ├── wedding/          # 웨딩 섹션 대표 사진 — 1장
│   │   ├── gallery/          # 초기 포트폴리오 — 1장
│   │   ├── portfolio/        # 포트폴리오·웨딩 추천 — 29장 (daegu-nail-<쉐입>-<컬러>-<특징>)
│   │   ├── before-after/     # 손톱연장 전후 — 7장 (사례 2개)
│   │   ├── monthly-art/YYYY-MM/  # 이달의 아트 — 88장 / 26개월 (2024-09 ~ 2026-10)
│   │   ├── og-image.jpg      # SNS 공유 썸네일 1200×630
│   │   └── apple-touch-icon.png
│   ├── favicon.ico
│   ├── robots.txt            # 전체 허용 + Sitemap 주소
│   ├── sitemap.xml           # URL 1개 + image:image 128개
│   └── _headers              # Cloudflare 캐시: images 30일, css/js 매번 재검증(max-age=0, must-revalidate)
├── tools/
│   └── optimize_images.py    # 원본 → WebP 480/800/1170 변환 (출력은 public/images/...)
├── CLAUDE.md                 # Claude 작업 지침 (세션 시작 시 자동 로드)
├── ARCHITECTURE.md           # 이 문서
├── TODO.md                   # 개발 작업 목록 + 완료 로그
├── CHECKLIST.md              # 운영자가 줄 자료 목록 + 반영 완료된 매장 정보(사실 기준)
└── README.md                 # 운영자용 사용 설명서 (사진·리뷰·가격 교체, 배포, 검색 등록)
```

`.gitignore`: `.claude/`(Claude 작업 폴더·워크트리), `/네일사진/`(원본 사진 — 원래 폴더에 사용자가 넣음). 각 사진은 WebP -480/-800/-1170 3종.
아래 3~7번의 파일 경로는 모두 `public/` 기준.

## 3. 페이지 구조 (index.html 순서)

| # | 요소 | id | 핵심 내용 | 비고 |
|---|---|---|---|---|
| — | `<header>` | `top` | 텍스트 로고, 내비 7개, 네이버 예약 버튼 | 모바일: 햄버거 → 전체화면 패널. JS 없으면 가로 목록 |
| 01 | Hero | (없음) | **H1 "대구 프리미엄 웨딩 · 손톱연장 전문 네일드아름"**, 슬로건, 예약/포트폴리오 버튼, 히어로 사진 | 페이지 유일한 H1. 사진은 preload + fetchpriority=high |
| 02 | Brand Story | `story` | 개업 시기(2024년 9월, `<time>`), 브랜드 철학, 3 pillars | 경력·자격 등 미확인 → 일반 문구만 |
| 03 | Signature Extension | `extension` | 연장 설명, 쉐입 3종, 시술 과정, 연장 가격, **카톡 상담 버튼** + **Before & After**(`#before-after`, 사례 2개 · 사진 7장, Before/Process/After 표시) | 상담 버튼은 `js-kakao` |
| 04 | Bridal Collection | `bridal` | 웨딩 설명, White/Nude/Pearl, 대표 사진 1장, **카톡 상담 버튼**, **Bridal Picks 6장**(포트폴리오 중 웨딩 무드 추천) | "웨딩네일 추천 디자인"으로 표현 (실제 웨딩 시술 여부는 미확인) |
| 05 | Portfolio | `portfolio` | 필터(All/Extension/Wedding/Nail Art) + 사진 33장(앞 12장 + "더 보기") | 분류: extension 20·wedding 11·art 19(중복 포함). 필터 선택 시 접힘 해제 |
| 06 | Monthly Art | `monthly` | **연도(2026/2025/2024) → 월 아카이브**, 26개월 88장. 기본 표시 2026-10(팁 샘플 8종을 담은 사진 1장 — 원본이 채팅 이미지라 폭 778px). 라벨 `.monthly-month` 는 선택 달로 바뀜. 카톡 문의·네이버 예약 버튼 | 각 달 `<section class="art-month" id="art-YYYY-MM">` + h3. `#art-2025-07` 주소로 바로 열림. JS 없으면 전체가 최신순 |
| 07 | Services & Price | `price` | 6개 블록(Hand/Extension/Foot/Removal/Bridal/Monthly) + 멤버십 | 가격은 JSON-LD `hasOfferCatalog` 와 이중 관리 |
| 08 | Client Reviews | `reviews` | 키워드 순위 5개, 네이버 방문자 리뷰 발췌 6개, 리뷰 탭 링크 | 닉네임 비표시, 별점·평점 마크업 없음 |
| 09 | FAQ | `faq` | `<details>` 9개 (연장·가격·짧은 손톱·시간·웨딩·이달의 아트·위치·반려동물·예약) | |
| 10 | Location | `location` | `<address>` dl(주소·구글 지도·시간·전화·인스타·카톡·편의), 주차 안내, 지도 카드(링크) | 지도 SDK 없음 |
| — | `<footer>` | — | 로고, NAP 한 줄(이름·주소·전화·시간), 링크 6개 | |
| — | `.mobile-cta` | — | 하단 고정 바: 전화 / **카톡 상담** / 네이버 예약 | 900px 이상 숨김, 버튼 줄바꿈 금지 |
| — | `<dialog class="lightbox">` | — | 모든 `.gallery-open` 사진 확대(웨딩·전후·포트폴리오·이달의 아트) | img는 JS가 생성 |

섹션 공통 패턴: `<section class="section X" id="X" aria-labelledby="X-title">` → `.section-index`(번호) → `h2.section-title > span.en + span.ko`

## 4. CSS 구조 (css/style.css)

- **토큰 (`:root`)**: `--off-white #FAF9F6` · `--ivory #F2EDE5` · `--sand #D8C9B8` · `--taupe #A99784` · `--taupe-text #73634F`(보조 텍스트, 대비 4.5:1 확보) · `--charcoal #292723` · `--line #E4DCD0`
- **폰트**: `--serif` Cormorant Garamond(영문 제목) · `--sans` Pretendard(본문). 로고는 Times New Roman 계열
- **브레이크포인트**: 700px(2열) · 900px(데스크톱 레이아웃, 모바일 바 숨김) · 1080px(내비 가로 전환). 모바일 우선
- **작성 순서**: Reset → Typography → Buttons → Header(+no-js) → Hero → Story → Split(Extension) → Before & After → Bridal(+Bridal Picks) → Portfolio(+더 보기)/Lightbox → Monthly(+아카이브) → Price → Reviews → FAQ → Location → Footer → Mobile CTA → 404 → Motion
- **초기 표시 상태는 CSS로**: `html:not(.no-js) .gallery.is-collapsed > li:nth-child(n+13)`, `html:not(.no-js) .art-month:not(.is-active)` 등 — JS 실행 전에도 첫 화면이 확정돼 CLS 없음. `.no-js` 일 때는 전부 표시
- **스타일 원칙**: 둥근 모서리·그림자·그라데이션 없음, 얇은 1px 라인, 넓은 여백, 이탤릭 세리프 포인트

## 5. JavaScript

| 위치 | 역할 |
|---|---|
| `<head>` 인라인 1줄 | `no-js` 클래스를 첫 렌더 전에 제거 → JS 비활성 레이아웃과 CLS 방지. **위치 이동·삭제 금지** |
| `<head>` 폰트 `<link rel=preload onload>` | 폰트 CSS 비동기 로드 + `<noscript>` 대체 |
| CSS·JS 주소 `?v=YYYYMMDDx` | 캐시 무효화 버전. CSS·JS 수정 시 index.html(2곳)·404.html(1곳) 함께 올림 |
| `js/main.js` (defer) | ① 모바일 메뉴(aria-expanded, Esc, 1080px↑ 자동 닫힘) ② 헤더 `.is-scrolled`(첫 측정은 rAF — 강제 리플로우 방지) ③ 포트폴리오 필터(`hidden`, aria-pressed) + 더 보기(`is-collapsed`) ④ 라이트박스(링크 기본동작 막고 `<dialog>`, 닫으면 포커스 복귀) ⑤ 이달의 아트 연도 버튼→그 해 최신 달, 월 링크→해당 달만 표시·라벨 갱신·`history.replaceState('#art-YYYY-MM')`, 주소 해시로 진입 시 해당 달 열기 ⑥ 푸터 연도 |

콘텐츠는 JS로 만들지 않음. JS가 꺼져도 모든 텍스트·메뉴·사진 링크가 동작.

## 6. SEO 구성

- **메타**: title, description, canonical, robots(`max-image-preview:large`), theme-color, OG(1200×630), Twitter `summary_large_image`, favicon, `lang="ko"`
- **검색엔진 소유확인**: `google-site-verification`(서치콘솔, URL 접두어 속성 `https://nail-de-areum.pages.dev/`) · `naver-site-verification`(서치어드바이저). 삭제 금지
- **JSON-LD `@graph`**: `NailSalon` + `WebSite`
  - NailSalon: name/alternateName, description, url, **foundingDate**(2024-09-30 — 사용자 확인, Brand Story 첫 문장 `<time>` 과 일치), logo, image[3], **address**(명덕로 327 3층 · 중구 · 대구광역시 · 41953 · KR), **geo**(35.8552293, 128.6058499 — 네이버 플레이스 등록 좌표, OpenStreetMap 역지오코딩으로 명덕로·대봉1동·대봉교 약 50m 확인), **telephone**(+82-507-1426-9612), **openingHoursSpecification**(월–토 10:00–20:00), **hasMap**(구글 지도 `maps.google.com/?cid=16868830461172683848` — 구글 비즈니스 프로필, 공유 링크 리디렉션으로 상호·좌표 일치 확인), **sameAs**(인스타·틱톡·네이버 플레이스·카카오 채널·구글 지도), amenityFeature(주차·반려동물), areaServed, priceRange, knowsAbout(젤 연장 포함 — 포트폴리오13 사진의 "Gel extension" 표기 근거), hasOfferCatalog(가격 12항목)
  - 없음(의도적): `AggregateRating`/`Review`(자사 리뷰 정책상 금지)
- **sitemap.xml**: `https://nail-de-areum.pages.dev/` 1개 + 1170px 이미지 128개(웨딩·포트폴리오·전후·이달의 아트 전부), lastmod 2026-10-15
- **robots.txt**: 전체 허용, Sitemap 명시
- **이미지**: 내용 설명형 파일명, 구체적 alt, width/height, srcset+sizes, 히어로 외 lazy
- **404.html**: noindex

## 7. 이미지 목록

| 폴더 | 장수 | 원본(사용자 제공, `네일사진/`) | 사용 위치 |
|---|---|---|---|
| `hero/daegu-nail-extension-almond-nude` | 1 | main.jpg | 히어로 + 포트폴리오 |
| `extension/daegu-nail-extension-coffin-nude-10` | 1 | art_3.jpg (사진에 "10손연장" 표기) | 연장 섹션 + 포트폴리오 |
| `wedding/daegu-wedding-nail-pearl-gradient-almond` | 1 | art_1.jpg | 웨딩 대표 + 포트폴리오 |
| `gallery/daegu-nail-short-square-nude-onetone` | 1 | art_2.jpg | 포트폴리오 |
| `portfolio/daegu-nail-*` | 29 | 포트폴리오1~30 (4번은 1번과 중복이라 제외) | 포트폴리오, 그중 6장은 웨딩 추천(3·29·26·23·17·2번) |
| `before-after/daegu-nail-extension-case1-*`, `case2-*` | 7 | 전후사진_1_1~1_4, 1_5, 2_1, 2_2 | Before & After |
| `monthly-art/YYYY-MM/daegu-monthly-art-YYYY-MM-NN` | 87 | `24년M월아트N`, `25년M월아트N`, `M월아트N`(연도 없음=2026) | 이달의 아트 아카이브 |

- 제외: `이달의아트8.jpg` — `24년12월아트1.jpg` 와 같은 사진(이미지 지문 비교)
- 사진 속 매장 표기로 확인된 사실: 포트폴리오13 "Gel extension"(→ 젤 연장 시술 근거), 포트폴리오5 "그라데이션 유리구슬 자석"
- 분류 근거: 사진으로 판단(롱·C커브 명확 → extension, 화이트·펄·실크 배경 등 → wedding 추천). 사용자 확인 대기 항목은 TODO.md
- 분류·설명 원본 데이터는 작업 세션 scratchpad 에서 생성 — 다시 만들 필요가 있으면 index.html 의 alt/figcaption 이 기준

## 8. 측정 기록 (실험실 수치 — 실제 사용자 수치 아님)

| 날짜 | 조건 | 성능 | 접근성 | 권장 | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|
| 2026-10-10 | 로컬, Lighthouse 12 모바일, 감사 전 | 72 | 92 | 100 | 100 | 4.6s | 0.002 |
| 2026-10-10 | 로컬, 감사 수정 후 5회 | 94–98 | 100 | 100 | 100 | 2.0–2.6s | 0.001 |
| 2026-10-12 | 로컬, 사진 123장 반영 후 3회 (HTML 180KB 비압축) | 90–95 | 100 | 100 | 100 | 2.5–3.0s | 0.001 |
| 2026-10-12 | **배포 사이트**(Brotli), Lighthouse 12 모바일 3회 | 95–99 (1회 68 — 네트워크 이상치, LCP 5.1s) | 100 | 100 | 100 | 1.9–2.5s | ≤0.001 |

배포 사이트(PageSpeed Insights) 측정은 아직 안 함.

**배포 사이트 응답 점검 (2026-10-12, curl)**: 홈·sitemap·robots·이미지·CSS·JS 200, 없는 주소 404, `/CLAUDE.md` 404(문서 비공개 확인), canonical·og:url·소유확인 메타 정상. HTML·CSS는 Brotli 압축, 캐시는 이미지 30일·CSS/JS 1일·HTML 매번 재검증 → 로컬 Lighthouse의 압축·캐시 경고는 배포 환경에서 해결됨

**배포 사이트 접근 진단 (2026-10-17 10:12–10:18 UTC, "ChatGPT 접근 실패" 조사)** — 결과: 사이트 측 차단·결함 없음
| 단계 | 결과 |
|---|---|
| DNS | A 172.66.44.71·172.66.47.185 / AAAA 2606:4700:310c::ac42:2c47·…:2fb9 (로컬·8.8.8.8·1.1.1.1·Google DoH 동일). HTTPS 레코드 `alpn=h3,h2` |
| TLS | TLS 1.3, ALPN h2 협상, 인증서 `CN=nail-de-areum.pages.dev`(+와일드카드) Let's Encrypt YE2, 2026-10-11 ~ 2027-01-09. 체인 YE2 → Root YE → ISRG Root X2 → ISRG Root X1 교차서명 → 옛 X1 신뢰 저장소에서도 검증 OK |
| HTTP | https 200(IPv4·IPv6), http → https 301 1회, 리다이렉트 루프 없음, `alt-svc: h3` |
| Cloudflare | 응답에 챌린지·`cf-mitigated` 없음. pages.dev 는 Cloudflare 소유 zone → WAF·Bot Fight Mode·AI Crawl Control·Security Events 는 사용자가 설정·조회할 수 없음(커스텀 도메인 필요) |
| 크롤러 UA | 브라우저·Googlebot·Bingbot·OAI-SearchBot·GPTBot·ChatGPT-User·ClaudeBot·PerplexityBot·Yeti·python-requests·빈 UA 11종 모두 200, 같은 HTML(md5 동일). ⚠ UA만 바꾼 요청이라 실제 크롤러 IP 에서의 처리를 증명하지는 않음 |
| robots·meta | robots 전체 허용(배포본 = 저장소, Cloudflare 관리형 robots 주입 없음), meta `index, follow, max-image-preview:large`, X-Robots-Tag 없음 |
| HTML | 배포본 = `origin/main` index.html, `text/html; charset=utf-8`, br/gzip 지원. JS 없이 본문 약 10,700자, 네일드아름·손톱연장·웨딩네일·주소·전화 포함, img 137개 alt 누락 0, JSON-LD NailSalon·WebSite 파싱 OK |
| 외부 서버 | Claude WebFetch(미국 데이터센터)·W3C Nu 검사기·Jina Reader(AI용 리더) 모두 실제 본문 수신, 챌린지 없음 |
| 색인 | DuckDuckGo `site:` 0건. Bing 은 10/15 "Blocked" → **10/17 "Indexed successfully"**(사용자 스크린샷). 주소 생성 2026-10-12 → 진단 시점 5일 |
| ChatGPT | 실패 문구 "is not accessible via this tool"(사용자 전달) — 사이트 응답이 아닌 도구 측 제한 문구. 재시도는 TODO 참고 |

## 9. 환경 제약 (Claude 작업 시)

- 앱 브라우저에서는 `*.pages.dev`, `m.place.naver.com` 접속 불가. 터미널은 기본 샌드박스에서 외부 DNS 조회가 막혀 있지만, **샌드박스를 해제한 `curl`(읽기 전용 요청)로 `*.pages.dev` 응답 확인 가능** (2026-10-12 확인)
  - 같은 방법으로 `m.place.naver.com/nailshop/1450452988/home` 도 받아진다(모바일 UA). 페이지 안 JSON에 매장 `"coordinate":{"x":경도,"y":위도}`, `roadAddress`, 네이버 예약 디자이너 이름 등이 들어 있음
- `gh` CLI 미설치 → PR 생성 불가(필요 없음: main 직접 push 방식)
- 원격 브랜치 삭제 등 되돌리기 어려운 git 명령은 자동 권한 검사에서 차단될 수 있음
- **배포 사이트 접근 점검 도구** (2026-10-17 확인, 샌드박스 해제 필요)
  - 이 PC 의 curl(mingw·Windows 둘 다)은 HTTP/2·3 미지원 → ALPN·인증서 체인은 `openssl s_client -connect nail-de-areum.pages.dev:443 -servername nail-de-areum.pages.dev -alpn h2,http/1.1 -showcerts`
  - 외부 서버에서의 가져오기 확인: W3C `https://validator.w3.org/nu/?doc=<URL>&out=json`(메시지 0개 = 정상 수신), Jina Reader `https://r.jina.ai/<URL>`, Claude WebFetch
  - curl 로 Bing 검색을 하면 무관한 결과가 나옴(봇 대응) → 색인 판단에 쓰지 말 것. `https://html.duckduckgo.com/html/?q=site%3A...` 는 결과 0건 여부 확인 가능. 확정은 Bing 웹마스터 도구로
  - OpenAI 문서: `openai.com` 은 Cloudflare 챌린지(403)로 못 읽음 → 크롤러 문서는 `developers.openai.com/docs/bots`
- 로컬 미리보기: `python -m http.server 8080 -d public` (Claude 앱에서는 `.claude/launch.json`의 `site` 설정 — `.claude/`는 git 제외라 새 워크트리에선 다시 만들어야 함)
