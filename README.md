# 백년건강소 양배추 스틱 랜딩

처음 제공한 tennis0915.com에서 내려받은 common.css, main.css, blog.css와 게시글 구조를 기반으로 만든 정적 페이지입니다. 원본 서버 소스는 공개되지 않아 포함하지 않았습니다. 원본 사진·후기·댓글·반응 수치와 추적 ID는 포함하지 않았습니다.

## 실행

프로젝트 폴더에서 다음 명령을 실행합니다. 별도 npm 설치나 빌드는 없습니다.

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

- 페이지: http://127.0.0.1:8080/
- 편집실: http://127.0.0.1:8080/editor.html
- 종료: 터미널에서 Ctrl+C

더블클릭으로도 열 수 있지만 미리보기·저장·클립보드 동작은 위 서버에서 확인하세요.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| index.html | 원본 형태의 게시글 화면 |
| content.js | 브랜드·원고·이미지·링크·GA4 설정 |
| editor.html | 글 편집과 UTM 생성 도구 |
| css/common.css, main.css, blog.css | 원본에서 받은 스타일 |
| css/brand.css | 브랜드용 추가 스타일 |
| assets/images/ | 직접 넣는 이미지 |
| js/core.js | URL 검증·UTM 처리 |
| js/app.js | 본문·공유·구매 버튼 |

## 글 넣는 방법

1. 편집실에서 제목·작성자·날짜를 입력합니다.
2. **글 한번에 넣기**에 작성한 글을 붙여 넣습니다. 빈 줄로 문단을 구분합니다. 기존 이미지 블록도 교체되므로 글을 먼저 넣으세요.
3. 소제목·인용문·이미지를 추가하고 ↑↓로 순서를 바꿉니다.
4. **content.js 다운로드**를 누르고 프로젝트의 기존 content.js를 덮어씁니다.
5. 페이지를 새로고침해 확인한 뒤 배포합니다.

초안 저장은 현재 브라우저에만 저장합니다. 서버 저장·GitHub 업로드·공개 페이지 변경이 아닙니다. 편집실은 관리자 로그인 화면이 아닙니다. 지정한 네이버 카페에서는 외곽 화면만 확인됐고 본문은 확보하지 못했으므로 현재 원고는 명확한 편집용 자리표시자입니다.

## 이미지 넣는 방법

1. 사진을 assets/images/ 폴더에 복사합니다. 예: product-01.jpg.
2. 편집실에서 이미지 블록을 추가합니다.
3. 이미지 주소에 `assets/images/product-01.jpg`를 적습니다.
4. 이미지 설명과 사진 아래 문구를 넣습니다.

**내 PC 이미지 선택**은 영문 파일명의 사본을 다운로드하고 경로를 채웁니다. 내려받은 이미지를 반드시 assets/images 폴더에 옮겨 주세요. 프로젝트에 자동 저장되지는 않습니다.

공개 HTTPS 이미지 주소를 직접 넣어도 됩니다. 웹페이지 URL이 아니라 이미지 자체의 URL이어야 합니다. 로그인 필요 URL·내 PC의 C: 경로·외부 참조를 막는 이미지 서버는 배포 후 작동하지 않습니다. JPG/PNG/WebP/GIF를 사용할 수 있습니다. 폭 1000~1400px 정도로 준비하고 용량을 줄이면 좋습니다.

## 랜딩 URL과 구매 URL

```text
광고 → 이 사이트의 랜딩 URL → 글 아래 버튼 → 상품 판매 페이지(구매 URL)
```

- 랜딩 URL: 이 소스를 호스팅해서 받은 주소. 설정 키는 landingUrl.
- 구매 URL: 스마트스토어·자사몰 등 실제 상품 페이지. 설정 키는 purchaseUrl.
- 랜딩 URL을 입력하는 것만으로 도메인이나 웹페이지가 생성되지는 않습니다.
- 구매 URL이 없으면 버튼은 비활성화됩니다.
- https://로 시작하는 완전한 주소를 넣으세요.

## 배포해서 랜딩 URL 얻기

이번 작업은 소스만 만들며 공개 배포하지 않았습니다. Cloudflare Pages를 쓰는 경우:

1. Cloudflare Pages 프로젝트를 만들고 GitHub 저장소 hlchoyrcompany-max/-를 연결합니다.
2. 브랜치 main, 프레임워크 없음, 빌드가 필요하면 명령 `exit 0`, 출력 폴더는 파일이 있는 루트 `.`를 지정합니다.
3. 배포 후 표시되는 실제 pages.dev 주소가 랜딩 URL입니다.
4. 편집실에 그 주소를 넣고 content.js를 저장·업로드합니다.
5. 보유 도메인은 Pages의 Custom domains에서 추가하고 DNS 안내를 따릅니다.

다른 정적 호스팅에도 같은 폴더 구조로 배포할 수 있습니다. /cabbage/ 같은 주소가 필요하면 해당 폴더에 파일을 배치하거나 호스팅 경로를 별도로 설정해야 합니다.

배포에서 제외해도 되는 파일: editor.html, css/editor.css, js/editor.js, tests/, README. 공개 페이지에 필요한 content.js는 제외하지 마세요. 비밀 키는 어떤 프런트엔드 파일에도 넣지 마세요.

## 랜딩 URL UTM 설정

편집실의 UTM 링크 생성기를 사용합니다.

| 키 | 예시 | 의미 |
| --- | --- | --- |
| utm_source | instagram | 유입 플랫폼 |
| utm_medium | paid_social | 유입 매체 |
| utm_campaign | cabbage_stick_202611 | 캠페인 |
| utm_content | story_01 | 소재 구분 |
| utm_term | cabbage | 키워드, 선택 |
| utm_id | campaign_01 | 캠페인 ID, 선택 |

예시 주소이며 실제 배포 주소가 아닙니다:

```text
https://your-domain.example/?utm_source=instagram&utm_medium=paid_social&utm_campaign=cabbage_stick_202611&utm_content=story_01
```

생성된 전체 주소를 광고의 도착 URL/웹사이트 URL에 넣습니다. 광고 플랫폼에 URL 매개변수 입력란이 따로 있으면 해당 플랫폼 안내를 따르고 같은 값을 중복 입력하지 마세요. 영문 소문자·숫자·밑줄로 이름을 통일하면 관리하기 쉽습니다.

UTM은 통계 저장 도구가 아닙니다. UTM만 붙여도 자동으로 보고서가 생기는 것은 아닙니다.

## 구매 링크로 UTM 전달

기본 forwardUtm=true 설정은 방문 URL의 위 UTM 6종을 구매 링크에 전달합니다. 구매 URL에 이미 있는 UTM은 덮어쓰지 않고 상품 코드·기존 쿼리·앵커도 유지합니다. gclid/fbclid는 전달하지 않습니다.

이것은 문자열 전달 기능입니다. 구매 완료 추적이나 GA4 사용자 세션 연결까지 구현한 것은 아닙니다. 같은 GA4 속성에서 도메인 간 측정을 구성하는 경우에는 forwardUtm을 끄고 도메인 간 측정을 별도 설정하세요. 내부 이동에 UTM을 붙이면 보고서 해석에 영향을 줄 수 있습니다. 판매 플랫폼에서 UTM을 보존·수집하는지도 확인해야 합니다.

## GA4 선택 설정

본인 GA4 웹 데이터 스트림의 G-... 측정 ID를 편집실에 넣으면 공개 페이지가 Google 태그를 불러옵니다. 편집실 안 미리보기는 추적하지 않습니다. 구매 링크 클릭 시 purchase_link_click 이벤트를 전송합니다. 구매 완료가 아니며 광고 차단·브라우저 정책·페이지 이동 타이밍에 따라 전송되지 않을 수 있습니다.

실시간/DebugView에서 이벤트를 확인하고 트래픽 획득 보고서에서 소스·매체·캠페인을 확인하세요. 실제 분석 계정·동의 관리·결제 추적은 아직 연결하지 않았습니다.

공유 플랫폼 중에는 초기 HTML만 읽는 경우가 있습니다. 캠페인 배포 시 index.html의 title·description·og 태그도 최종 제목으로 바꾸고, 대표 사진 절대 URL의 og:image 메타 태그를 추가하세요. JavaScript로 메타 태그를 바꾸는 것만으로 모든 공유 로봇에 반영되지는 않습니다.

## 구현 범위와 출처

글·이미지 편집, 미리보기, 설정 다운로드, 공유, 구매 링크, UTM 생성·전달을 구현했습니다. 회원가입·서버 댓글·관리자 인증·이미지 업로드 서버·결제·실시간 반응 수는 포함하지 않았습니다.

원본 CSS와 게시글 틀은 요청한 공개 페이지에서 가져왔습니다. 별도의 사용 허락 조건은 확인되지 않았습니다.

## 검증

```powershell
node --test tests/core.test.cjs
node --check js/app.js
node --check js/editor.js
```

공식 참고: [Cloudflare 정적 HTML 배포](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [Google Analytics UTM](https://support.google.com/analytics/answer/10917952?hl=ko)
