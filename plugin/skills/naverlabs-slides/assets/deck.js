/* naverlabs-slides deck runtime — zero dependencies.
 * 구조: DeckCore(순수 로직, Node 테스트 가능) + DOM 런타임(브라우저 전용).
 * 이 파일은 생성되는 HTML의 <script>에 통째로 인라인된다. */
(function () {
  "use strict";

  var DeckCore = {
    clampPage: function (n, total) {
      if (typeof n !== "number" || !isFinite(n) || Math.floor(n) !== n) return null;
      if (n < 1) return 1;
      if (n > total) return total;
      return n;
    },

    parseHash: function (hash, total) {
      var m = /^#(\d+)$/.exec(hash || "");
      if (!m) return null;
      return DeckCore.clampPage(parseInt(m[1], 10), total);
    },

    keyAction: function (key, mode) {
      if (mode !== "present") return null;
      switch (key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          return "next";
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          return "prev";
        case "Home":
          return "first";
        case "End":
          return "last";
        case "Escape":
          return "exit";
        default:
          return null;
      }
    },

    pushDigit: function (buffer, key) {
      if (!/^\d$/.test(key)) return buffer;
      return (buffer + key).slice(0, 3);
    }
  };

  // Node(테스트) 환경에서는 코어만 노출하고 종료
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DeckCore;
    return;
  }

  // ---- DOM 런타임 ----
  var CANVAS_W = 1280;

  var state = { page: 1, mode: "scroll", theme: "light", buffer: "" };
  var wraps = [];
  var total = 0;
  var els = {};
  var scrollLockUntil = 0; // 이 시각(ms) 이전에는 스크롤 자동추적을 억제 (명시 이동 보호)

  function storedOr(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* 프라이빗 모드 등 */ }
  }

  function rescale() {
    wraps.forEach(function (wrap) {
      var slide = wrap.firstElementChild;
      if (!slide) return;
      var t = "scale(" + wrap.clientWidth / CANVAS_W + ")";
      // 동일한 스케일이면 재작성하지 않는다 — 불필요한 리페인트(모바일 번쩍임) 방지.
      if (slide.style.transform !== t) slide.style.transform = t;
    });
  }

  // 각 슬라이드 하단에 NAVER LABS 로고 + 현재 대분류(섹션) 라벨을 넣는다.
  // 섹션 라벨은 <section data-section="..."> 에서 읽고, 로고는 커버의 로고 SVG를 복제한다.
  // 로고가 이미 큰 cover/closing 슬라이드는 제외한다.
  function buildFooters() {
    var logo = document.querySelector('.slide[data-type="cover"] .logo svg') ||
               document.querySelector(".logo svg");
    wraps.forEach(function (wrap) {
      var slide = wrap.firstElementChild;
      if (!slide) return;
      var type = slide.getAttribute("data-type");
      // cover·toc·closing은 구조 슬라이드라 섹션 푸터를 넣지 않는다.
      if (type === "cover" || type === "toc" || type === "closing") return;
      if (slide.querySelector(".slide-foot")) return;
      var foot = document.createElement("div");
      foot.className = "slide-foot";
      if (logo) {
        var box = document.createElement("div");
        box.className = "foot-logo";
        box.appendChild(logo.cloneNode(true));
        foot.appendChild(box);
      }
      var sec = document.createElement("div");
      sec.className = "foot-sec";
      sec.textContent = slide.getAttribute("data-section") || "";
      foot.appendChild(sec);
      slide.appendChild(foot);
    });
  }

  function updateControls() {
    els.mode.textContent = state.mode === "present" ? "▶ 발표" : "≡ 스크롤";
    els.mode.setAttribute("aria-pressed", String(state.mode === "present"));
    els.theme.textContent = state.theme === "dark" ? "● 다크" : "☀ 라이트";
    els.theme.setAttribute("aria-pressed", String(state.theme === "dark"));
    els.page.textContent =
      (state.buffer ? state.buffer + "…" : state.page) + " / " + total;
  }

  function syncHash() {
    history.replaceState(null, "", "#" + state.page);
  }

  function applyPresentVisibility() {
    wraps.forEach(function (wrap, i) {
      var active = i === state.page - 1;
      wrap.classList.toggle("is-active", active);
      // 발표 모드: 활성 슬라이드의 영상은 처음부터 재생, 비활성 슬라이드 영상은 정지.
      // (다른 슬라이드에 갔다가 돌아오면 영상이 다시 처음부터 시작된다)
      var vids = wrap.querySelectorAll("video");
      for (var k = 0; k < vids.length; k++) {
        try {
          if (active) {
            vids[k].currentTime = 0;
            var p = vids[k].play();
            if (p && p.catch) p.catch(function () {});
          } else {
            vids[k].pause();
          }
        } catch (e) { /* 자동재생 제한 등 무시 */ }
      }
    });
  }

  function goTo(page, opts) {
    var p = DeckCore.clampPage(page, total);
    if (p === null) return;
    state.page = p;
    if (state.mode === "present") {
      applyPresentVisibility();
      requestAnimationFrame(rescale);
    } else if (!(opts && opts.fromScroll)) {
      // 명시적 이동: 목표 슬라이드를 화면 중앙에 두고, 스크롤이 정착하는 동안
      // IntersectionObserver의 자동 추적을 억제해 목표 페이지가 덮어쓰이지 않게 한다.
      scrollLockUntil = Date.now() + 700;
      wraps[p - 1].scrollIntoView({ behavior: opts && opts.smooth ? "smooth" : "auto", block: "center" });
    }
    syncHash();
    updateControls();
  }

  function setMode(mode) {
    state.mode = mode === "present" ? "present" : "scroll";
    state.buffer = "";
    document.body.setAttribute("data-mode", state.mode);
    store("nl-deck-mode", state.mode);
    if (state.mode === "present") {
      applyPresentVisibility();
    } else {
      wraps.forEach(function (w) { w.classList.remove("is-active"); });
      if (wraps[state.page - 1]) {
        scrollLockUntil = Date.now() + 700;
        wraps[state.page - 1].scrollIntoView({ block: "center" });
      }
    }
    requestAnimationFrame(rescale);
    updateControls();
  }

  function setTheme(theme) {
    state.theme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", state.theme);
    store("nl-deck-theme", state.theme);
    updateControls();
  }

  function openPageInput() {
    els.page.hidden = true;
    els.input.hidden = false;
    els.input.value = "";
    els.input.focus();
  }

  function closePageInput(commit) {
    if (els.input.hidden) return; // blur 중복 호출 가드
    if (commit) {
      var n = parseInt(els.input.value, 10);
      if (!isNaN(n)) goTo(n);
    }
    els.input.hidden = true;
    els.page.hidden = false;
  }

  function init() {
    wraps = Array.prototype.slice.call(document.querySelectorAll(".slide-wrap"));
    total = wraps.length;
    if (total === 0) return;
    buildFooters();

    // 스크롤 모드: 영상이 뷰포트에 들어오면 재생, 벗어나면 정지.
    // (브라우저는 화면 밖 muted 자동재생을 보류하므로 명시적으로 제어. 발표 모드는 applyPresentVisibility가 담당)
    var _vids = document.querySelectorAll(".slide video");
    if (_vids.length && "IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (entries) {
        if (state.mode === "present") return;
        entries.forEach(function (e) {
          if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
          else { e.target.pause(); }
        });
      }, { threshold: 0.25 });
      _vids.forEach(function (v) { vio.observe(v); });
    }
    els.mode = document.getElementById("modeToggle");
    els.theme = document.getElementById("themeToggle");
    els.prev = document.getElementById("prevBtn");
    els.next = document.getElementById("nextBtn");
    els.page = document.getElementById("pageBtn");
    els.input = document.getElementById("pageInput");

    var params = new URLSearchParams(location.search);

    // 기본 테마는 light. NAVER LABS 콘텐츠 슬라이드는 화이트 기반이고, 브라우저 인쇄(PDF 제출)와
    // 밝은 회의실 투사에서 일관되게 보이도록 한다. 다크는 토글로 opt-in되며 localStorage에 저장된다.
    // 우선순위: ?theme= 파라미터 > 저장된 사용자 선택 > light 기본값.
    setTheme(params.get("theme") || storedOr("nl-deck-theme", "light"));

    state.page = DeckCore.parseHash(location.hash, total) || 1;
    setMode(params.get("mode") || storedOr("nl-deck-mode", "scroll"));
    // 초기 위치는 첫 레이아웃이 끝난 뒤 잡아, 스크롤 앵커가 정확히 계산되게 한다.
    requestAnimationFrame(function () { goTo(state.page); });

    // 컨트롤
    els.mode.addEventListener("click", function () {
      setMode(state.mode === "present" ? "scroll" : "present");
    });
    els.theme.addEventListener("click", function () {
      setTheme(state.theme === "dark" ? "light" : "dark");
    });
    els.prev.addEventListener("click", function () { goTo(state.page - 1, { smooth: true }); this.blur(); });
    els.next.addEventListener("click", function () { goTo(state.page + 1, { smooth: true }); this.blur(); });
    els.page.addEventListener("click", openPageInput);
    els.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") closePageInput(true);
      else if (e.key === "Escape") closePageInput(false);
      e.stopPropagation();
    });
    // 모바일 숫자 키패드에는 Enter가 없다 — 키패드를 닫으면(blur) 입력값으로 이동한다.
    els.input.addEventListener("blur", function () { closePageInput(true); });

    // 키보드
    document.addEventListener("keydown", function (e) {
      var t = e.target;
      if (t === els.input || t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (state.mode === "present" && /^\d$/.test(e.key)) {
        state.buffer = DeckCore.pushDigit(state.buffer, e.key);
        updateControls();
        e.preventDefault();
        return;
      }
      if (e.key === "Enter" && state.buffer) {
        var n = parseInt(state.buffer, 10);
        state.buffer = "";
        goTo(n);
        e.preventDefault();
        return;
      }
      var action = DeckCore.keyAction(e.key, state.mode);
      if (!action) return;
      e.preventDefault();
      if (action === "next") goTo(state.page + 1);
      else if (action === "prev") goTo(state.page - 1);
      else if (action === "first") goTo(1);
      else if (action === "last") goTo(total);
      else if (action === "exit") setMode("scroll");
    });

    // 발표 모드: 휠/터치 스크롤 차단 (컨트롤 영역 제외), 수평 스와이프만 진행
    document.addEventListener("wheel", function (e) {
      if (state.mode === "present" && !e.target.closest(".deck-controls")) e.preventDefault();
    }, { passive: false });

    var touchStart = null;
    document.addEventListener("touchstart", function (e) {
      if (state.mode !== "present") return;
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    document.addEventListener("touchmove", function (e) {
      if (state.mode === "present" && !e.target.closest(".deck-controls")) e.preventDefault();
    }, { passive: false });
    document.addEventListener("touchend", function (e) {
      if (state.mode !== "present" || !touchStart) return;
      var dx = e.changedTouches[0].clientX - touchStart.x;
      var dy = e.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        goTo(state.page + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });

    // 스크롤 모드: 뷰포트에서 가장 많이 보이는 슬라이드를 현재 페이지로 추적한다.
    // (단일 threshold + last-wins는 큰 뷰포트에서 두 슬라이드가 동시에 조건을 만족해
    //  더 아래 슬라이드로 잘못 넘어가는 버그가 있었다 → 최대 노출 비율로 판정)
    var ratios = new Array(total);
    for (var r = 0; r < total; r++) ratios[r] = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = wraps.indexOf(entry.target);
        if (idx !== -1) ratios[idx] = entry.intersectionRatio;
      });
      if (state.mode !== "scroll") return;
      if (Date.now() < scrollLockUntil) return; // 명시 이동 직후엔 자동 추적 억제
      var best = -1, bestRatio = 0;
      for (var i = 0; i < total; i++) {
        if (ratios[i] > bestRatio) { bestRatio = ratios[i]; best = i; }
      }
      if (best !== -1 && best + 1 !== state.page) {
        goTo(best + 1, { fromScroll: true });
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    wraps.forEach(function (w) { io.observe(w); });

    // 해시/리사이즈
    window.addEventListener("hashchange", function () {
      var p = DeckCore.parseHash(location.hash, total);
      if (p !== null && p !== state.page) goTo(p);
    });
    // 모바일 Safari·인앱 웹뷰(카카오톡 등)는 스크롤로 주소창이 접/펴질 때 resize를 쏘는데,
    // 이때 바뀌는 건 높이뿐이다. 스케일은 너비에만 의존하므로(=clientWidth/CANVAS_W)
    // 너비가 그대로면 rescale을 건너뛰어 전체 리페인트로 인한 화면 번쩍임을 막는다.
    var lastW = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      requestAnimationFrame(rescale);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
