---
name: naverlabs-slides
description: NAVER LABS CI 스타일의 자립형(오프라인) HTML 발표자료를 생성한다. "네이버랩스 스타일 발표자료/슬라이드/덱 만들어줘", "발표자료를 네이버랩스 CI로" 같은 요청, 또는 기존 naverlabs-slides 덱의 수정 요청 시 사용.
---

# naverlabs-slides — NAVER LABS 스타일 발표자료 생성

## 산출물

- **단일 HTML 파일 1개** (모든 CSS/JS/폰트/로고 인라인, 외부 네트워크 요청 0건)
- 저장 위치: 사용자가 지정하지 않으면 현재 작업 디렉토리에 `<주제>-deck.html`

## 생성 절차

1. **내용 수집**: 대화·첨부 파일에서 발표 내용을 수집한다. 부족하면 발표 시간, 청중, 핵심 메시지를 질문한다.
2. **아키타입 매핑**: 아래 규칙으로 슬라이드 구성안을 만들고, 슬라이드 수가 10장을 넘으면 목차(toc)를 넣는다. **toc는 커버(cover) 바로 다음, 2번째 슬라이드에 배치한다**(청중이 전체 흐름을 먼저 잡도록). 프로필·타임라인 등 도입부 슬라이드는 toc 다음에 온다. 구성안(제목 + 아키타입 목록)을 사용자에게 먼저 보여주고 승인받는다.
3. **조립**: `assets/template.html`의 플레이스홀더를 아래와 같이 치환한다.
   - `{{TITLE}}` → 발표 제목
   - `/* {{FONTS_CSS}} */` → `assets/fonts.css` 내용 그대로 (템플릿에서 CSS 주석으로 감싸 IDE 거짓 경고 방지 — 주석째로 치환)
   - `/* {{THEME_CSS}} */` → `assets/theme.css` 내용 그대로 (동일)
   - `{{SLIDES}}` → `references/archetypes.md`의 마크업 패턴으로 작성한 슬라이드들. 로고 자리(`{{LOGO_SVG}}`)는 `assets/logo.svg` 내용으로 치환
   - `{{DECK_JS}}` → `assets/deck.js` 내용 그대로
   - 조립은 스크립트로 처리한다 (fonts.css가 731KB라 직접 읽지 말 것). 예:
     `node -e "const fs=require('fs');const a=p=>fs.readFileSync('<assets경로>/'+p,'utf8');let h=a('template.html');h=h.split('{{TITLE}}').join('제목');h=h.split('/* {{FONTS_CSS}} */').join(a('fonts.css'));h=h.split('/* {{THEME_CSS}} */').join(a('theme.css'));h=h.split('{{SLIDES}}').join(fs.readFileSync('<슬라이드마크업파일>','utf8').split('{{LOGO_SVG}}').join(a('logo.svg')));h=h.split('{{DECK_JS}}').join(a('deck.js'));fs.writeFileSync('<출력파일>',h)"`
     (슬라이드 마크업은 임시 파일에 먼저 작성한 뒤 위 스크립트로 조립)
4. **검증**: 생성 후 아래를 확인하고 결과를 보고한다.
   - 리소스 외부 URL 0건(이미지·폰트·스크립트는 인라인): `grep -oE '(src|url\()="?https?://[^\" )<>]+' <파일>` 출력 없음. 단, `<a href>`·`mailto:` 등 **클릭 시 이동하는 내비게이션 링크는 허용**(로드 시 네트워크 요청 없음 → 오프라인 자립성 유지)
   - 플레이스홀더 잔존 0건: `grep -c "{{" <파일>` → 0
5. **안내**: 조작법과 배포법을 짧게 안내한다.
   - 우측 상단: 모드 토글(스크롤↔발표) / 테마 토글(라이트↔다크) / 페이지 인디케이터(클릭→번호 입력)
   - 발표 모드: 방향키·Space 진행, 숫자+Enter 점프, Esc로 스크롤 복귀, 모바일 스와이프
   - URL: `#5`(페이지), `?mode=present`, `?theme=dark` 지원
   - PDF: 브라우저 인쇄(⌘P) → 슬라이드당 1페이지
   - GitHub Pages: 저장소 push 후 Settings → Pages에서 배포

## 아키타입 매핑 규칙

| 내용 신호 | 아키타입 |
|---|---|
| 첫 슬라이드, 제목/발표자 | `cover` (data-theme-lock) |
| 발표 개요, 목차 | `toc` |
| 챕터 전환("다음으로", 주제 변경) | `divider` |
| 개념 간 관계, 융합, 아키텍처 | `diagram` (data-theme-lock) |
| 수치 성과(%, 배수, 연차, 개수) | `stat` |
| 시간 순 이력(경력, 프로젝트 연혁) | `timeline` |
| 마지막 슬라이드, 감사 인사 | `closing` |
| 그 외 모든 본문 | `content` (+ grid-2/grid-3/card) |

## 브랜드 규칙 (필수 준수)

`references/brand.md`를 반드시 읽고 따른다. 특히:
- 포인트 컬러는 `#006EFF` 파랑. 그린은 커버 그라디언트 전용
- 시맨틱 토큰만 사용, 색상 하드코딩 금지
- 헤드라인 영문 우선, 캔버스(1280×720) 오버플로 금지(카드 본문 3줄, 불릿 4개 이내)
- **기본 테마는 라이트**(콘텐츠=화이트). 브라우저 인쇄(PDF 제출)·밝은 회의실 투사에 유리하며, 다크는 우측 상단 토글로 opt-in. 제출·인쇄용 덱은 라이트 유지 권장. `deck.js`가 기본값을 처리하므로 출력 HTML에 테마 강제 스크립트를 주입하지 않는다.
- **각 슬라이드에 `data-section="대분류명"`을 부여**한다(cover·toc·closing은 구조 슬라이드라 자동 제외). deck.js가 하단에 NAVER LABS 로고 + 대분류 라벨 푸터를 자동으로 넣어, 청중이 현재 어느 목차 대분류에 있는지 알 수 있게 한다. 값은 toc 그룹명과 일치시킨다.

## 수정 요청 처리

- "N번을 <아키타입>으로" → 해당 `<section>`의 `data-type`과 내부 마크업을 교체
- "N번 테마 잠금 해제" → `data-theme-lock` 속성 제거
- "슬라이드 추가/삭제/순서 변경" → `.slide-wrap` 블록 단위로 조작 (toc가 있으면 페이지 번호 갱신)
- 기존 덱 수정 시에는 전체 재생성 대신 해당 `.slide-wrap` 블록만 Edit로 교체

## 제약

- 외부 URL(이미지·폰트·스크립트) 삽입 금지. 이미지가 필요하면 사용자에게 base64 인라인 여부를 확인
- `assets/` 파일을 수정하지 않는다 (읽기 전용 템플릿)
- fonts.css / 생성된 덱 HTML은 크므로 Read 툴로 통째로 읽지 않는다 (조립·수정은 스크립트/Edit로)
