# NAIL DE AREUM (네일드아름) 공식 홈페이지

대구 프리미엄 웨딩네일 · 손톱연장 네일샵 **네일드아름**의 정적 원페이지 웹사이트입니다.
HTML5 + CSS3 + Vanilla JS로 만들었고, 빌드 과정이 없어 파일 그대로 배포합니다.
핵심 콘텐츠는 모두 `index.html`에 들어 있어 검색 로봇이 JS 실행 없이 읽을 수 있습니다.

```
/
├── index.html            # 전체 콘텐츠 + 메타데이터 + JSON-LD
├── css/style.css         # 디자인 (색상/폰트 토큰은 파일 상단 :root)
├── js/main.js            # 모바일 메뉴, 포트폴리오 필터, 사진 확대 보기만 담당
├── images/
│   ├── hero/             # 메인 대표 사진
│   ├── extension/        # 손톱연장 사진
│   ├── wedding/          # 웨딩네일 사진
│   ├── monthly-art/      # 이달의 아트 사진
│   ├── gallery/          # 기타 포트폴리오
│   ├── og-image.jpg      # 카카오톡/SNS 공유 썸네일 (1200×630)
│   └── apple-touch-icon.png
├── 404.html              # 없는 주소용 페이지 (Cloudflare Pages SPA 모드 방지, 삭제 금지)
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── _headers              # Cloudflare Pages 캐시 설정
├── tools/optimize_images.py  # 사진 → WebP 3종 변환 스크립트
├── CHECKLIST.md          # 앞으로 준비할 자료 목록 (운영자용)
├── TODO.md               # 개발 작업 목록 + 완료 기록
├── ARCHITECTURE.md       # 현재 사이트 구조 (Claude 참고용)
└── CLAUDE.md             # Claude 작업 지침
```

---

## 1. 매장 정보 · 준비 자료

**앞으로 준비할 자료(사진·디자이너·시술 정보 등)는 [`CHECKLIST.md`](CHECKLIST.md) 에 정리되어 있습니다.**
확인되지 않은 정보는 사이트에 사실처럼 표시하지 않습니다.

### 매장 정보를 바꿀 때 함께 수정할 곳
| 정보 | 수정 위치 |
|---|---|
| 주소 (대구 중구 명덕로 327, 3층 · 우 41953) | `#location` Address, FAQ "어디에 위치하나요", 푸터 `.footer-address`, JSON-LD `address` |
| 전화 (0507-1426-9612) | `#location`, FAQ, 푸터, 모바일 하단 바, JSON-LD `telephone` |
| 영업시간 (월–토 10:00–20:00, 일 휴무) | `#location` Hours, FAQ "예약은 어떻게", 푸터, JSON-LD `openingHoursSpecification` |
| 네이버 플레이스·예약 | `class="js-booking"` / `class="js-place"` 링크 전체, 리뷰 버튼, JSON-LD `sameAs` |
| 인스타그램 · 카카오톡 채널 | `#location`, 푸터, FAQ, 이달의 아트·포트폴리오 링크, JSON-LD `sameAs` |
| 공식 도메인 (현재 `https://nail-de-areum.pages.dev/`) | `index.html`, `robots.txt`, `sitemap.xml` 전체 검색-치환 |

> 주소·전화·영업시간은 네이버 플레이스, 인스타그램, 구글 비즈니스 프로필과 **똑같이** 맞춰 주세요.

### 위도·경도를 추가할 때 (JSON-LD)
```json
"geo": { "@type": "GeoCoordinates", "latitude": 35.0000, "longitude": 128.0000 }
```
네이버/구글 지도에서 확인한 실제 값만 넣으세요. 고객 리뷰 별점(`AggregateRating`)은 자사 사이트 리뷰 정책상 넣지 않습니다.

---

## 2. 사진 교체 / 추가

1. 사진은 **WebP**, 세로 3:4 비율 권장. 가로 480 / 800 / 1170px 세 가지로 저장합니다.
   (예: [squoosh.app](https://squoosh.app) 에서 변환)
2. 파일명은 내용을 설명하는 영문 소문자-하이픈 형식:
   `daegu-wedding-nail-white-pearl-french-800.webp`
3. 해당 폴더에 넣고, `index.html`의 `<img>` 에서 `src`, `srcset`, `alt` 를 바꿉니다.
4. **alt 텍스트**는 사진을 못 보는 사람에게 설명하듯 구체적으로:
   `"화이트 펄 프렌치 웨딩네일, 아몬드 쉐입 손톱연장"` ✅ / `"네일"` ❌
5. `width`/`height` 속성은 원본 비율과 맞게 유지합니다(레이아웃 흔들림 방지).
6. 첫 화면(Hero) 사진만 `loading="lazy"` 없이, 나머지는 `loading="lazy"` 를 유지합니다.

### 포트폴리오 추가
`#portfolio` 의 `<li data-category="...">` 하나를 복사해 수정합니다.
`data-category` 값: `extension` / `wedding` / `art` (여러 개면 공백 구분)

### 웨딩 사진 플레이스홀더 교체
`#bridal` 의 `<li class="ph" ...>` 를 아래처럼 바꿉니다.
```html
<li><img src="images/wedding/파일명-800.webp" width="800" height="1067" loading="lazy" alt="구체적인 설명"></li>
```

---

## 3. 이달의 아트 교체 (매월)

`index.html` 에서 `▼ 이달의 아트 교체 영역 ▼` 을 찾습니다.

1. 월 표기 수정: `<span class="m-en">October</span><span class="m-num">2026 · 10</span>`
2. 사진 교체: 각 `<li>` 의 `<div class="ph" ...>...</div>` 를 아래로 교체
   ```html
   <img src="images/monthly-art/2026-11-design-01-800.webp" width="800" height="1067" loading="lazy"
        alt="2026년 11월 이달의 아트, 버건디 자석젤 포인트 아트">
   ```
3. 디자인명(`<h3>`)과 가격(`<p class="price-tag">`)을 수정 — 확정 가격이 없으면 "가격 상담" 유지
4. 이전 달 사진은 `#portfolio` 의 Nail Art 로 옮기면 콘텐츠가 계속 쌓여 SEO에 도움이 됩니다.
5. `sitemap.xml` 의 `<lastmod>` 를 수정한 날짜로 바꿉니다.

## 4. 리뷰 갱신 (월 1회 권장)

`index.html` 의 `08 CLIENT REVIEWS` 영역을 수정합니다.

1. 네이버 플레이스 리뷰 탭에서 리뷰 텍스트를 복사해 원하는 리뷰를 고릅니다(연장·웨딩·케어 등 고르게).
2. `<li>` 하나를 복사해 본문(`<p>`), 시술명(`.review-tag`), 방문일을 바꿉니다.
   - 작성자 닉네임은 넣지 않습니다. 원문을 발췌할 때 의미가 바뀌지 않게 `…` 로 생략합니다.
   - 작성자가 게시 중단을 요청하면 바로 삭제하세요.
3. 키워드 순위(`.review-keywords`)와 기준 문구(리뷰 수·기간·확인일)를 함께 갱신합니다.
4. 별점/평점 구조화 데이터(`AggregateRating`, `Review`)는 넣지 않습니다(구글 자사 리뷰 정책).

## 5. 가격 수정

`#price` 섹션의 `<dd>` 숫자와 `<head>` JSON-LD의 `hasOfferCatalog` 의 `price` 를 **함께** 수정합니다.
현재 가격은 매장 메뉴판(운영자 제공 이미지) 기준입니다.

---

## 6. 로컬에서 미리보기

```bash
python -m http.server 8080
```
브라우저에서 http://localhost:8080 접속.

## 7. Cloudflare Pages 배포

### 방법 A — 직접 업로드 (가장 간단)
1. Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. 프로젝트 이름 입력(예: `nail-de-areum`) 후 이 폴더 전체를 드래그 업로드
3. 배포 후 `https://프로젝트명.pages.dev` 로 확인

또는 CLI:
```bash
npx wrangler pages deploy . --project-name nail-de-areum
```

### 방법 B — GitHub 연동
1. **Connect to Git** → 이 저장소 선택
2. Framework preset: **None**, Build command: *(비움)*, Build output directory: `/`
3. `main` 브랜치에 push 할 때마다 자동으로 재배포됩니다. 사진도 저장소에 포함되어 함께 배포됩니다.

### 커스텀 도메인
Pages 프로젝트 → **Custom domains** → 도메인 연결.
연결 후 1번 표의 **공식 도메인 치환**을 반드시 진행하고 재배포합니다.

---

## 8. SEO 체크리스트 (배포 직후)

- [ ] 도메인을 바꿨다면 이전 주소가 남아있지 않은지 확인 (`grep -r pages.dev .`)
- [ ] https://search.google.com/test/rich-results 에서 구조화 데이터 오류 확인
- [ ] https://pagespeed.web.dev 에서 모바일 LCP / CLS / INP 측정 (목표: 2.5s / 0.1 / 200ms — 실제 측정 필요)
- [ ] `https://도메인/robots.txt`, `https://도메인/sitemap.xml` 접속 확인
- [ ] `https://도메인/없는주소` 접속 시 **404 상태코드**가 나오는지 확인 (200이면 `404.html` 누락)
- [ ] 커스텀 도메인 연결 후 `프로젝트명.pages.dev` 주소를 Cloudflare **Bulk Redirects** 로 공식 도메인에 301 연결 (중복 주소 방지)

### 구글 서치콘솔
1. https://search.google.com/search-console → 속성 추가 → **도메인**(DNS TXT, Cloudflare DNS에 추가) 또는 **URL 접두어**(HTML 태그 → `index.html` 의 `google-site-verification` 주석 해제)
2. **Sitemaps** 메뉴 → `sitemap.xml` 제출
3. **URL 검사** → 홈 URL 입력 → **색인 생성 요청**

### 네이버 서치어드바이저
1. https://searchadvisor.naver.com → 웹마스터 도구 → 사이트 등록
2. HTML 태그 방식 선택 → `naver-site-verification` 메타태그 주석 해제 후 값 입력 → 재배포 → 소유확인
3. **요청 → 사이트맵 제출**: `https://도메인/sitemap.xml`
4. **요청 → 웹 페이지 수집**: 홈 URL 수집 요청
5. **검증 → robots.txt** 로 수집 허용 확인

### 매장 정보 일관성
네이버 플레이스, 카카오맵, 구글 비즈니스 프로필, 인스타그램, 홈페이지의
**상호 · 주소 · 전화번호 · 영업시간**을 똑같이 맞추세요. 검색엔진과 AI가 같은 업체로 인식하는 데 중요합니다.
홈페이지 URL도 네이버 플레이스 / 인스타그램 프로필에 등록하세요.

---

## 9. 기술 메모

- 폰트: Cormorant Garamond(Google Fonts), Pretendard(jsDelivr 동적 서브셋) — 둘 다 SIL OFL 1.1, 상업적 사용 가능
- 외부 JS 라이브러리 없음. 사진 확대는 네이티브 `<dialog>`, FAQ는 `<details>`
- 지도 SDK 미사용 — 네이버 지도 링크로 연결 (페이지 무게 절감)
- JS가 꺼져 있어도 모든 콘텐츠와 메뉴가 보입니다. `<head>`의 한 줄짜리 스크립트가 첫 렌더링 전에 `no-js` 클래스를 지워 레이아웃 이동을 막습니다(지우지 마세요)
- 웹폰트 CSS는 비동기로 불러와 첫 화면 렌더링을 막지 않습니다
- 포트폴리오 사진은 원본 이미지 링크(`<a href>`)라서 JS 없이도 크게 볼 수 있습니다
