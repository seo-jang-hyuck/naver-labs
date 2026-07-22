# 슬라이드 아키타입 레퍼런스

공통 골격 — 모든 슬라이드는 아래 구조를 따른다:

    <div class="slide-wrap"><section class="slide" data-type="{TYPE}">
      ...
    </section></div>

- `data-theme-lock`: cover, diagram에 기본 부착(테마 토글 불변). 사용자가 해제를 요청하면 속성만 제거.
- 텍스트가 캔버스(1280×720)를 넘치면 안 된다. 카드 본문은 3줄 이내, 불릿은 4개 이내 권장.
- `{{LOGO_SVG}}` 표기는 `assets/logo.svg` 파일 내용(한 줄 SVG)으로 치환한다.
- `data-section="대분류명"`: 각 `<section>`에 붙이면 deck.js가 슬라이드 하단에 **NAVER LABS 로고 + 대분류 라벨** 푸터를 자동 생성한다. **cover·toc·closing은 구조 슬라이드라 자동 제외**. toc의 대분류(그룹명)와 일치시키면 청중이 현재 위치를 알 수 있다. 값이 없으면 로고만 표시.
- 인라인 `style`은 아래 예시에 등장하는 수준(여백 미세조정)만 허용. 색상은 반드시 토큰/클래스로.

## 1. cover — 표지 (테마 잠금)

용도: 첫 슬라이드. 그라디언트 풀블리드 + 로고 + 발표 제목/발표자.

    <div class="slide-wrap"><section class="slide" data-type="cover" data-theme-lock>
      <div class="logo" style="width:360px">{{LOGO_SVG}}</div>
      <h1 class="title">발표 제목 첫 줄<br>둘째 줄</h1>
      <p class="subtitle">부제 — 발표자</p>
    </section></div>

## 2. toc — 목차

용도: 발표 개요. 좌측 대형 타이틀, 우측 정렬 리스트(그룹 + 페이지 번호).

    <div class="slide-wrap"><section class="slide" data-type="toc">
      <h2 class="title">Table of Contents</h2>
      <div class="toc-list">
        <div class="toc-group">
          <h3>그룹명</h3>
          <div class="toc-item"><span>항목명</span><span class="pg">03</span></div>
          <div class="toc-item"><span>항목명</span><span class="pg">04</span></div>
        </div>
      </div>
    </section></div>

## 3. divider — 섹션 디바이더

용도: 챕터 전환. 챕터 번호(블루) + 대형 타이틀 + 한 줄 서브카피.

    <div class="slide-wrap"><section class="slide" data-type="divider">
      <p class="divider-no">01</p>
      <h2 class="title">Section Title</h2>
      <p class="subtitle">섹션을 요약하는 한 문장</p>
    </section></div>

## 4. content — 본문 (범용)

용도: 일반 본문. 킥커(카테고리 라벨+블랙 바) + 타이틀 + 카드 그리드(grid-2 또는 grid-3).

    <div class="slide-wrap"><section class="slide" data-type="content">
      <p class="kicker">CATEGORY</p>
      <h2 class="title" style="margin-top:20px">슬라이드 제목</h2>
      <div class="grid-2">
        <div class="card">
          <p class="tag">Label</p>
          <h3>카드 제목</h3>
          <p>카드 본문 (3줄 이내).</p>
        </div>
        <div class="card">
          <p class="tag">Label</p>
          <h3>카드 제목</h3>
          <p>카드 본문 (3줄 이내).</p>
        </div>
      </div>
    </section></div>

변형: 카드 없이 `.body` 문단 + `.spacer`로 여백 구성 가능. 3개 항목이면 `grid-3`.

## 5. diagram — 개념 다이어그램 (테마 잠금)

용도: 개념 간 관계·융합·아키텍처. 블랙 배경 + 블루 글로우 노드.

    <div class="slide-wrap"><section class="slide" data-type="diagram" data-theme-lock>
      <h2 class="title">Concept Title</h2>
      <p class="subtitle" style="margin-top:12px">한 줄 설명</p>
      <div class="diagram-stage">
        <div class="node">개념 A</div>
        <div class="node">개념 B</div>
        <div class="node">개념 C</div>
      </div>
    </section></div>

노드는 2~4개 권장. 노드 안 텍스트는 2줄 이내.

## 6. stat — 키 넘버

용도: 수치 성과 강조 (%, 배수, 연차, 개수). 숫자는 블루 900 웨이트.

    <div class="slide-wrap"><section class="slide" data-type="stat">
      <p class="kicker">IMPACT</p>
      <h2 class="title" style="margin-top:20px">슬라이드 제목</h2>
      <div class="stat-row">
        <div class="stat"><p class="num">7<small>년</small></p><p class="label">설명 라벨</p></div>
        <div class="stat"><p class="num">64<small>%</small></p><p class="label">설명 라벨</p></div>
        <div class="stat"><p class="num">30<small>K</small></p><p class="label">설명 라벨</p></div>
      </div>
    </section></div>

스탯은 2~4개. 단위는 `<small>`로.

## 7. timeline — 타임라인

용도: 시간 순 이력(경력, 프로젝트 연혁). 좌측 기간(블루) + 도트 라인 + 내용.

    <div class="slide-wrap"><section class="slide" data-type="timeline">
      <p class="kicker">CAREER</p>
      <h2 class="title" style="margin-top:20px">슬라이드 제목</h2>
      <div class="timeline">
        <div class="tl-item"><p class="when">2019 – 2022</p><div class="dot"></div>
          <div><h3>항목 제목</h3><p>설명 한두 문장.</p></div></div>
        <div class="tl-item"><p class="when">2022 – 현재</p><div class="dot"></div>
          <div><h3>항목 제목</h3><p>설명 한두 문장.</p></div></div>
      </div>
    </section></div>

항목은 3~5개 권장 (많으면 캔버스 오버플로).

## 8. closing — 클로징

용도: 마지막 슬라이드. 감사 인사 + 연락처 + 로고.

    <div class="slide-wrap"><section class="slide" data-type="closing">
      <h2 class="title">Thank you</h2>
      <p class="contact">이름 · 직함<br>email@example.com</p>
      <div class="logo">{{LOGO_SVG}}</div>
    </section></div>
