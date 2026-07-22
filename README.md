# naver-labs

서장혁 · **NAVER LABS 자기소개 발표 사이트**와, 그 발표자료를 만든 **Claude Code 플러그인** 소스입니다.

## 🎤 발표 사이트

- **[index.html](index.html)** — NAVER LABS 지원 자기소개 발표 (자립형 단일 HTML · 30 슬라이드 · 반응형)
- **GitHub Pages** — https://seo-jang-hyuck.github.io/naver-labs/
- 조작 — 우측 상단에서 발표/스크롤·테마 토글
  - 데스크톱 — 방향키·Space로 진행, 숫자+Enter로 페이지 점프
  - 모바일 — 이전/다음 버튼·좌우 스와이프·페이지 번호 입력으로 이동
  - PDF — 브라우저 인쇄(⌘P)

## 🧩 naverlabs-slides 플러그인

이 발표자료를 생성한 **Claude Code 스킬 플러그인**입니다. NAVER LABS CI 스타일의 자립형 HTML 덱을 한 문장으로 만들어 줍니다.

- 소스 — **[plugin/](plugin/)**
- 배포 파일 — **[Google Drive에서 다운로드](https://drive.google.com/file/d/1ky-Ucv8kkuD1azXfzazY9XWQNYxMzoap/view?usp=drive_link)** · [repo 내 zip](downloads/naverlabs-slides-1.0.0.zip)
- 설치 — [plugin/INSTALL.md](plugin/INSTALL.md) · 사용법 — [plugin/USAGE.md](plugin/USAGE.md)

빠른 설치:

```
/plugin marketplace add ./naverlabs-slides
/plugin install naverlabs-slides@naverlabs-slides-marketplace
/reload-plugins
```

## 구조

```
naver-labs/
├─ index.html                       # 발표 사이트 (배포 대상)
├─ assets/
│  └─ og-cover.png                  # 소셜 공유 OG 이미지 (커버 슬라이드)
├─ plugin/                          # naverlabs-slides 플러그인 소스
├─ downloads/
│  └─ naverlabs-slides-1.0.0.zip    # 플러그인 배포 파일
└─ README.md
```

---

작성자: **서장혁** · Frontend Developer · sjh938606@naver.com
