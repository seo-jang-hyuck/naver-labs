# 설치 방법

`naverlabs-slides`는 Claude Code 플러그인입니다. 설치 방법은 세 가지이며, **방법 A(마켓플레이스)**를 권장합니다.

## 사전 준비

- **Claude Code** 설치 및 로그인 — [설치 가이드](https://code.claude.com/docs/en/quickstart)
  - `/plugin` 명령이 보이지 않으면 최신 버전으로 업데이트하세요.
    - Homebrew: `brew upgrade claude-code`
    - npm: `npm install -g @anthropic-ai/claude-code@latest`
- 압축 해제 도구 (OS 기본 도구로 충분)

---

## 방법 A — 마켓플레이스로 설치 (권장 · 영구)

1. 배포 파일 `naverlabs-slides-1.0.0.zip`를 내려받아 압축을 풉니다. `naverlabs-slides/` 폴더가 생깁니다.
2. 그 상위 폴더에서 Claude Code를 실행한 뒤, 다음을 차례로 입력합니다:

   ```
   /plugin marketplace add ./naverlabs-slides
   /plugin install naverlabs-slides@naverlabs-slides-marketplace
   /reload-plugins
   ```

   - **1번째 줄** — 폴더 안의 `.claude-plugin/marketplace.json`을 로컬 마켓플레이스로 등록
   - **2번째 줄** — 마켓플레이스에서 플러그인 설치 (`플러그인이름@마켓플레이스이름` 형식)
   - **3번째 줄** — 재시작 없이 즉시 활성화

> 경로는 절대경로도 됩니다: `/plugin marketplace add /Users/you/naverlabs-slides`
> 단축키: `/plugin market` = `/plugin marketplace`

## 방법 B — zip 직접 로드 (빠른 시험 · 압축 해제 불필요)

Claude Code **v2.1.128 이상**은 zip을 그대로 로드합니다. 해당 세션에서만 로드됩니다.

```
claude --plugin-dir ./naverlabs-slides-1.0.0.zip
```

## 방법 C — 폴더 직접 로드 (개발 · 시험)

압축을 푼 폴더를 세션 단위로 로드합니다.

```
claude --plugin-dir ./naverlabs-slides
```

---

## 설치 확인

Claude Code 대화에서 요청해 봅니다:

> 네이버랩스 스타일로 발표자료 만들어줘

스킬이 동작해 슬라이드 구성안을 제안하면 정상입니다. `/plugin`의 **Installed** 탭에서도 설치 상태를 볼 수 있습니다.

- 스킬을 직접 호출하려면: `/naverlabs-slides:naverlabs-slides`
- 플러그인 스킬은 항상 `플러그인명:스킬명` 형식으로 네임스페이스가 붙습니다.

## 업데이트

새 zip을 받아 폴더를 교체한 뒤:

```
/plugin marketplace update naverlabs-slides-marketplace
/reload-plugins
```

## 제거

```
/plugin uninstall naverlabs-slides@naverlabs-slides-marketplace
/plugin marketplace remove naverlabs-slides-marketplace
```

> ⚠️ 마켓플레이스를 제거하면 거기서 설치한 플러그인도 함께 제거됩니다.

## 문제 해결

| 증상 | 해결 |
|---|---|
| `/plugin` 명령이 없음 | Claude Code를 최신 버전으로 업데이트 후 재시작 |
| 스킬이 목록에 안 보임 | `/reload-plugins` → 그래도 안 되면 `rm -rf ~/.claude/plugins/cache` 후 재시작·재설치 |
| 마켓플레이스 로드 실패 | 경로에 `.claude-plugin/marketplace.json`이 있는지 확인 |
| 설치 후 파일을 못 찾음 | 플러그인은 캐시로 복사됩니다. 플러그인 폴더 밖을 참조하는 경로는 동작하지 않습니다 |
