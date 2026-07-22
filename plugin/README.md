# naverlabs-slides

**NAVER LABS CI 스타일의 자립형(오프라인) 단일 HTML 발표자료**를 생성하는 Claude Code 스킬 플러그인입니다.

> "네이버랩스 스타일로 발표자료 만들어줘" 한마디면, 공식 CI를 따른 발표 덱이 **파일 하나**로 완성됩니다.

## 특징

- 🎨 **NAVER LABS 공식 CI** — 블루 `#006EFF`, 연두 → 그린 → 시안 그라디언트
- 📦 **네트워크 요청 0건** — 이미지·폰트·스크립트까지 전부 인라인. 파일 하나로 배포·오프라인 발표
- 🖨️ **PDF 내보내기** — 브라우저 인쇄(⌘P)로 슬라이드당 1페이지
- 🌗 **발표/스크롤 모드 · 라이트/다크 테마** 토글
- 🔤 **NanumHuman 폰트 임베드** — 전체 한글 커버리지

## 빠른 시작

1. `naverlabs-slides-1.0.0.zip`를 내려받아 압축을 풉니다 → `naverlabs-slides/` 폴더가 생성됩니다.
2. Claude Code에서 마켓플레이스로 등록하고 설치합니다:
   ```
   /plugin marketplace add ./naverlabs-slides
   /plugin install naverlabs-slides@naverlabs-slides-marketplace
   /reload-plugins
   ```
3. 대화에서 요청합니다:
   > 네이버랩스 스타일로 발표자료 만들어줘

> 💡 압축 해제 없이 한 번만 써보려면, zip을 그대로 로드할 수도 있습니다 (Claude Code v2.1.128+):
> ```
> claude --plugin-dir ./naverlabs-slides-1.0.0.zip
> ```

## 문서

- **[INSTALL.md](INSTALL.md)** — 설치 방법 상세 (마켓플레이스 등록 · 대안 로드 · 확인 · 업데이트 · 제거 · 문제 해결)
- **[USAGE.md](USAGE.md)** — 사용 가이드 (스킬 호출 · 아키타입 · 슬라이드 조작 · PDF · 브랜드 규칙)

## 구성

```
naverlabs-slides/
├─ .claude-plugin/
│  ├─ plugin.json          # 플러그인 매니페스트 (v1.0.0)
│  └─ marketplace.json     # 로컬 마켓플레이스 정의
├─ skills/naverlabs-slides/
│  ├─ SKILL.md             # 스킬 본체 (생성 절차 · 아키타입 규칙)
│  ├─ assets/              # template.html · theme.css · fonts.css · deck.js · logo.svg
│  └─ references/          # archetypes.md · brand.md
├─ samples/
│  └─ sample-deck.html     # 생성 결과 예시
├─ README.md
├─ INSTALL.md
└─ USAGE.md
```

## 라이선스 / 크레딧

- 폰트: **NanumHuman** (SIL Open Font License)
- 테마: NAVER LABS CI Simple Guidelines · Company Profile 기반
- 작성자: **서장혁**
