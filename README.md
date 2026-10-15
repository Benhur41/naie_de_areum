# NAIL DE AREUM (네일드아름) 공식 홈페이지

대구 프리미엄 웨딩네일 · 손톱연장 네일샵 **네일드아름**의 정적 원페이지 웹사이트입니다.
HTML5 + CSS3 + Vanilla JS로 만들었고, 빌드 과정이 없어 파일 그대로 배포합니다.
핵심 콘텐츠는 모두 `public/index.html`에 들어 있어 검색 로봇이 JS 실행 없이 읽을 수 있습니다.

```
/
├── public/                   # ← 홈페이지 파일 (이 폴더만 Cloudflare에 배포됨)
│   ├── index.html            # 전체 콘텐츠 + 메타데이터 + JSON-LD
│   ├── css/style.css         # 디자인 (색상/폰트 토큰은 파일 상단 :root)
│   ├── js/main.js            # 모바일 메뉴, 포트폴리오 필터, 사진 확대 보기만 담당
│   ├── images/
│   │   ├── hero/             # 메인 대표 사진
│   │   ├── extension/        # 손톱연장 사진
│   │   ├── wedding/          # 웨딩네일 사진
│   │   ├── monthly-art/      # 이달의 아트 사진
│   │   ├── gallery/          # 기타 포트폴리오
│   │   ├── og-image.jpg      # 카카오톡/SNS 공유 썸네일 (1200×630)
│   │   └── apple-touch-icon.png
│   ├── 404.html              # 없는 주소용 페이지 (Cloudflare Pages SPA 모드 방지, 삭제 금지)
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── _headers              # Cloudflare Pages 캐시 설정
├── tools/optimize_images.py  # 사진 → WebP 3종 변환 스크립트
├── CHECKLIST.md              # 앞으로 준비할 자료 목록 (운영자용)
├── TODO.md                   # 개발 작업 목록 + 완료 기록
├── ARCHITECTURE.md           # 현재 사이트 구조 (Claude 참고용)
├── CLAUDE.md                 # Claude 작업 지침
└── README.md                 # 이 문서
```

> 아래 설명의 `index.html`, `images/`, `sitemap.xml` 등은 모두 **`public/` 폴더 안**의 파일입니다.
> `public/` 밖의 문서들은 GitHub에만 있고 홈페이지에는 올라가지 않습니다.

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

### 위도·경도 (JSON-LD `geo`)
```json
"geo": { "@type": "GeoCoordinates", "latitude": 35.8552293, "longitude": 128.6058499 }
```
네이버 플레이스에 등록된 매장 좌표입니다(2026-10-12 확인). 매장을 옮기면 주소와 함께 이 값도 바꾸세요 — 네이버/구글 지도에서 확인한 실제 값만 넣습니다.
고객 리뷰 별점(`AggregateRating`)은 자사 사이트 리뷰 정책상 넣지 않습니다.

---

## 2. 사진 교체 / 추가

> 원본 사진은 프로젝트 폴더의 `네일사진/` 에 넣으면 됩니다(Git 제외). 변환본만 `public/images/` 에 올라갑니다.
> 사진을 Claude에게 주면 분류·변환·설명 작성·배치를 모두 처리합니다. 아래는 직접 할 때의 방법입니다.

1. 변환: `python tools/optimize_images.py <원본> public/images/<폴더>/<설명형-파일명>` → WebP 3종(-480/-800/-1170)
   - 폴더: `portfolio/`(포트폴리오·웨딩), `before-after/`(전후), `monthly-art/YYYY-MM/`(이달의 아트)
   - 파일명 예: `daegu-nail-almond-white-glitter-long`
2. 출력된 width/height 를 `<img>` 에 넣고, srcset 에는 **실제 폭**(원본이 좁으면 1125w 등)을 씁니다.
3. **alt 텍스트**는 사진을 못 보는 사람에게 설명하듯 구체적으로:
   `"아몬드 쉐입 롱 손톱연장, 화이트 펄 글리터 그라데이션"` ✅ / `"네일"` ❌
4. 첫 화면(Hero) 사진만 `loading="lazy"` 없이, 나머지는 모두 `loading="lazy"`
5. `public/sitemap.xml` 에 1170 이미지 주소를 `<image:image>` 로 추가

### 포트폴리오 추가 (`#portfolio`)
`<li data-category="...">` 하나를 복사해 수정합니다.
- `data-category`: `extension` / `wedding` / `art` (여러 개면 공백 구분)
- 처음엔 **앞 12장만** 보이고 나머지는 "포트폴리오 더 보기" 버튼으로 펼쳐집니다. 보여주고 싶은 사진을 앞에 두세요.

### 웨딩 추천 사진 (`#bridal .bridal-grid`)
포트폴리오 중 웨딩 무드 사진 6장을 골라 둔 곳입니다. `<li>` 를 복사해 바꾸면 됩니다(포트폴리오와 같은 이미지 파일 사용).

### 손톱연장 전후 사진 (`#before-after`)
`.ba-case` 블록 하나가 사례 1개입니다. 각 사진의 `<span class="ba-step ba-before|ba-process|ba-after">` 로 Before / Process / After 표시가 붙습니다.

---

## 3. 이달의 아트 추가 (매월)

이달의 아트는 **연도 → 월** 을 골라 보는 아카이브입니다(2024년 9월~). JS가 꺼져 있으면 모든 달이 최신순으로 펼쳐집니다.

1. 사진 변환: `public/images/monthly-art/YYYY-MM/daegu-monthly-art-YYYY-MM-NN-{480,800,1170}.webp`
2. `public/index.html` 의 `06 MONTHLY ART` 주석을 찾습니다.
3. **월 버튼 추가**: `.archive-nav` 에서 해당 연도 `<ul class="archive-months">` 끝에
   `<li><a href="#art-YYYY-MM" data-month="YYYY-MM">M월</a></li>` 추가
   - 새 연도면 연도 버튼(`.archive-year`)과 `.archive-month-group` 블록도 추가
4. **사진 블록 추가**: `.archive` 맨 위에 기존 `<section class="art-month" ...>` 하나를 복사해
   id·data-month·data-label-en(영문 월)·제목·사진을 바꿉니다.
5. **최신 달 표시**: `is-active` 를 새 달로 옮깁니다 — 월 링크(+`aria-current="true"`), 연도 버튼(+`aria-pressed="true"`), 월 그룹, section 네 곳.
   위쪽 `.monthly-month` 의 영문 월·숫자도 바꿉니다.
6. `public/sitemap.xml` 에 이미지 추가, `<lastmod>` 갱신

디자인별 가격은 확정되면 각 사진 설명(`figcaption`)에 적을 수 있습니다. 지금은 "카카오톡 문의" 안내로 되어 있습니다.

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
python -m http.server 8080 -d public
```
브라우저에서 http://localhost:8080 접속.

## 7. Cloudflare Pages 배포

### 방법 A — 직접 업로드 (가장 간단)
1. Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. 프로젝트 이름 입력(예: `nail-de-areum`) 후 **`public` 폴더**를 드래그 업로드
3. 배포 후 `https://프로젝트명.pages.dev` 로 확인

또는 CLI:
```bash
npx wrangler pages deploy public --project-name nail-de-areum
```

### 방법 B — GitHub 연동 (현재 사용 중)
1. **Connect to Git** → 이 저장소 선택
2. Framework preset: **None**, Build command: *(비움)*, Build output directory: **`public`**
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

### Bing 웹마스터 도구 (5분 · ChatGPT 검색·Copilot 등 AI 검색 대비)
1. https://www.bing.com/webmasters → 로그인 시 **Google** 선택 (서치콘솔과 같은 계정)
2. "Add your site" 화면에서 왼쪽 **Import your sites from GSC** → **Import** → 구글 계정 선택 → 권한 **허용** (Bing이 서치콘솔 정보를 읽기만 함)
3. 목록에서 `https://nail-de-areum.pages.dev/` 체크 → **Import** — 소유확인·사이트맵이 함께 넘어옵니다
4. 왼쪽 **Sitemaps** 메뉴에 `sitemap.xml` 이 있는지 확인. 없으면 **Submit sitemap** → `https://nail-de-areum.pages.dev/sitemap.xml`

### 구글 비즈니스 프로필 (구글 지도 매장 등록, 무료)
1. https://business.google.com → **지금 관리하기** → 구글 계정 로그인
2. **비즈니스 이름**: `네일드아름` — 이름만. "대구 웨딩네일" 같은 키워드를 붙이면 구글 정책 위반으로 정지될 수 있습니다
   - 입력 중 아래에 "네일드아름"이 이미 뜨면 그것을 골라 **소유권 요청**, 안 뜨면 새로 만들기
   - ⚠ **매장 하나에 프로필은 하나만.** 같은 매장을 두 번 만들면 중복으로 정지됩니다 (2026-10-12 실제로 2개 만들어져 둘 다 정지됨)
3. 업종 유형은 **오프라인 매장**, 카테고리는 **네일샵**(Nail salon) 하나
4. 고객이 방문하는 위치 **예** → 주소: 대구광역시 중구 명덕로 327, 상세 주소 `3층`, 우편번호 41953 → 지도 핀을 대봉교역 1번 출구 앞 건물에 맞춤
   - 주소에 "킹콩쥬스건물" 같은 건물명·랜드마크는 넣지 않기 (구글 정책: 공식 주소로 위치가 정확하면 랜드마크 금지)
5. 다른 지역에도 서비스(출장) → **아니요**
6. 전화 `0507-1426-9612`, 웹사이트 `https://nail-de-areum.pages.dev/`
7. **인증**: 구글이 보여주는 방법 중 선택. 동영상이면 끊지 않고 한 번에 — 주변 거리·건물 → 간판·입구 → 매장 내부 → 운영자임을 보여주는 것(열쇠로 문 열기, 계산대, 사업자등록증 등). 검토에 며칠 걸릴 수 있음. 0507 번호는 문자를 못 받을 수 있으니 문자 인증은 피하기
8. 인증 후 채우기: 영업시간(월–토 10:00–20:00, 일요일 휴무), 아래 소개 문구, 사진(외관·입구·내부·시술 사진)
9. 등록이 끝나면 구글 지도에서 매장 → **공유 → 링크 복사** 해서 Claude에게 주기 → 홈페이지 구조화 데이터·오시는 길에 연결

**같은 매장이 다른 구글 계정에 이미 등록돼 있을 때** (2026-10-15 실제로 발견됨)
- 구글 서치콘솔·사이트맵·Bing은 비즈니스 프로필과 **별개**입니다. 계정이 달라도 다시 할 필요 없습니다
- 원래 프로필이 있는 계정으로 로그인 → 프로필 상태(인증·정지 여부)와 상호·주소·전화·웹사이트가 맞는지 확인
- 한 계정에서 관리하고 싶으면: 원래 계정의 프로필에서 **⋮ → 비즈니스 프로필 설정 → 사용자 및 액세스 → 추가** → 지금 쓰는 계정 이메일을 **소유자**로 초대 → 그 계정 메일에서 수락
- 원래 계정에 로그인할 수 없으면: 지금 계정에서 같은 매장을 검색해 고르면 나오는 **액세스 권한 요청**을 사용 (새로 만들지 않기)
- 그 뒤 실수로 새로 만든 프로필은 원래 프로필과 **중복**이므로 이의신청하지 말고 **모두 삭제** (아래 2번 방법)

**프로필이 "정지됨"일 때** ([구글 도움말](https://support.google.com/business/answer/4569145?hl=ko))
1. 새 프로필을 또 만들지 않기 (중복이 늘어 더 나빠짐)
2. 실수로 만든 중복 프로필은 **프로필 관리 → 비즈니스 프로필 설정 → 비즈니스 프로필 삭제** 로 지우고 하나만 남기기 (삭제는 되돌릴 수 없음)
3. 남긴 프로필을 **이의신청 도구**에서 선택 → 정지 사유 확인 → 이의신청. 증빙(사업자등록증, 간판·입구 사진 등)은 **미리 준비** — 증빙 양식은 연 뒤 60분 안에 내야 첨부됨. 문서의 상호·주소가 프로필과 같아야 함
4. 결과는 이메일로 옴(영업일 최대 5일 정도). 그사이 같은 이의신청을 반복하지 않기

소개 문구 (750자 이내 · 링크·가격·할인 문구·이모지는 넣지 않기 · 첫 문장에 "누가·어디서·무엇을 전문으로"):
```
네일드아름은 대구 중구 대봉교역 1번 출구 앞, 킹콩쥬스 건물 3층(명덕로 327)에 있는 손톱연장·웨딩네일 전문 네일샵입니다.

젤 연장은 두껍지 않고 얇고 자연스러운 라인을 목표로, 손 모양에 맞춰 길이와 쉐입의 균형을 잡습니다. 웨딩네일은 드레스 소재와 부케 색감, 반지 디자인을 함께 보며 충분히 상담한 뒤 디자인을 정합니다.

원톤·그라데이션·프렌치, 시럽·자석 네일, 매달 새로 준비하는 이달의 아트와 손·발 케어도 받으실 수 있습니다. 주차와 반려동물 동반이 가능합니다. 예약은 네이버 예약, 디자인 상담은 카카오톡 채널로 문의해 주세요.

NAIL DE AREUM is a nail salon in Jung-gu, Daegu, on the 3rd floor right in front of Daebonggyo Station Exit 1. We specialize in clean, slim and natural-looking gel extensions, bridal nails and delicate Korean nail art. For appointments, send us a DM on Instagram or a message on KakaoTalk.
```
(599자 · 2026-10-15. 영어 문단은 외국인 고객용 — 기존 프로필 영문 소개의 내용을 살림)

프로필 나머지 칸 (사실인 것만 채우기):
- **연락처**: 전화 `0507-1426-9612`(홈페이지·네이버와 같게), 웹사이트 `https://nail-de-areum.pages.dev/`, 소셜 프로필에 인스타그램
- **서비스**: 손톱연장(젤 연장) · 웨딩네일 · 젤네일(원톤·그라데이션·프렌치) · 이달의 아트 · 손 케어 · 발 케어/발 네일 — 가격을 넣으면 홈페이지 가격표와 같게
- **속성(더보기)**: 주차·반려동물 등 실제로 맞는 것만
- **개업일**: 실제 오픈 연월을 알면 입력 (홈페이지에도 반영 가능)
- **게시물**: 매달 이달의 아트를 올릴 때 사진 + 짧은 글로 같이 올리기

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
