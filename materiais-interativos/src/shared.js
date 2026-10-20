/* Guia clínico F.S · comportamento compartilhado */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isPrint = /[?&]print\b/.test(location.search) || root.hasAttribute("data-print");
  if (isPrint) root.setAttribute("data-print", "");
  var km = doc.querySelector('meta[name="fs-store"]');
  var KEY = (km && km.content) || "fs-guia";

  var FS = window.FS = { reduce: reduce, isPrint: isPrint };

  /* armazenamento local, sempre protegido */
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { store = {}; }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  FS.get = function (k, d) { return k in store ? store[k] : d; };
  FS.set = function (k, v) { store[k] = v; persist(); };

  /* campos preenchíveis: salvam no navegador e ganham âncora para o PDF */
  function initFields() {
    var els = doc.querySelectorAll("input[id]:not([type=range]):not([data-nostore]), textarea[id]:not([data-nostore])");
    els.forEach(function (el) {
      var id = el.id;
      if (!isPrint) {
        var v = FS.get("f:" + id);
        if (v !== undefined) { if (el.type === "checkbox" || el.type === "radio") el.checked = !!v; else el.value = v; }
        el.addEventListener(el.type === "checkbox" || el.type === "radio" ? "change" : "input", function () {
          if (el.type === "radio") {
            doc.querySelectorAll('input[type=radio][name="' + el.name + '"]').forEach(function (r) { FS.set("f:" + r.id, r.checked); });
          } else FS.set("f:" + id, el.type === "checkbox" ? el.checked : el.value);
          flashSaved(el);
        });
      } else {
        if (el.type === "checkbox" || el.type === "radio") el.checked = false; else el.value = "";
      }
      /* âncora invisível que o gerador do PDF converte em campo de formulário */
      var t = el.type === "checkbox" ? "check" : el.type === "radio" ? "radio" : el.tagName === "TEXTAREA" ? "area" : "text";
      var wrap = doc.createElement("span");
      wrap.className = "pf";
      wrap.style.display = (t === "check" || t === "radio") ? "inline-block" : "block";
      if (t === "check" || t === "radio") wrap.style.flex = "none";
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      var a = doc.createElement("a");
      a.className = "pdf-field";
      a.setAttribute("aria-hidden", "true");
      a.tabIndex = -1;
      a.href = "https://pdf-field.invalid/" + encodeURIComponent(id) + "?t=" + t + (el.name ? "&g=" + encodeURIComponent(el.name) : "");
      a.textContent = ".";
      wrap.appendChild(a);
    });
  }
  var savedTimer;
  function flashSaved(el) {
    var box = el.closest("[data-saves]");
    var note = box && box.querySelector(".saved-note");
    if (!note) return;
    note.textContent = "Salvo neste navegador";
    clearTimeout(savedTimer);
    savedTimer = setTimeout(function () { note.textContent = "Salvo automaticamente neste navegador"; }, 1600);
  }

  /* copiar texto de um bloco preenchível */
  FS.copyFrom = function (btn, container) {
    var lines = [];
    container.querySelectorAll("[data-copy-title], input[id], textarea[id]").forEach(function (el) {
      if (el.hasAttribute("data-copy-title")) { lines.push("", el.getAttribute("data-copy-title").toUpperCase()); return; }
      if (el.type === "checkbox" || el.type === "radio") { if (el.checked) lines.push("[x] " + (el.closest("label") ? el.closest("label").textContent.trim() : el.id)); return; }
      var lab = el.getAttribute("aria-label") || el.placeholder || el.id;
      if (el.value.trim()) lines.push(lab + ": " + el.value.trim());
    });
    var text = lines.join("\n").trim() || "Nada preenchido ainda.";
    var done = function (ok) { var o = btn.textContent; btn.textContent = ok ? "Copiado" : "Selecione e copie"; setTimeout(function () { btn.textContent = o; }, 1800); };
    try { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); } catch (e) { done(false); }
  };
  FS.clear = function (btn, container) {
    if (btn.getAttribute("data-armed") !== "1") {
      btn.setAttribute("data-armed", "1"); var o = btn.textContent; btn.textContent = "Toque de novo para apagar";
      setTimeout(function () { btn.removeAttribute("data-armed"); btn.textContent = o; }, 2600); return;
    }
    btn.removeAttribute("data-armed");
    container.querySelectorAll("input[id], textarea[id]").forEach(function (el) {
      if (el.type === "checkbox" || el.type === "radio") el.checked = false; else el.value = "";
      FS.set("f:" + el.id, el.type === "checkbox" || el.type === "radio" ? false : "");
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    btn.textContent = "Apagado";
    setTimeout(function () { btn.textContent = "Apagar respostas"; }, 1600);
  };

  /* entrada suave: elementos fora da primeira tela começam levemente apagados, nunca invisíveis */
  function initReveal() {
    if (reduce || isPrint || !("IntersectionObserver" in window)) return;
    var items = doc.querySelectorAll(".rv");
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top > vh) { el.classList.add("pre"); io.observe(el); }
    });
  }

  /* traçado de curvas SVG ao entrar na tela */
  FS.drawPaths = function (scope) {
    var paths = (scope || doc).querySelectorAll("path.draw, polyline.draw, line.draw");
    paths.forEach(function (p) {
      if (reduce || isPrint || !p.getTotalLength) return;
      var L = p.getTotalLength();
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      var r = p.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); }); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { p.style.strokeDashoffset = 0; io.disconnect(); } });
      }, { rootMargin: "0px 0px -15% 0px" });
      io.observe(p);
    });
  };

  /* progresso de leitura e seção ativa */
  function initNav() {
    var bar = doc.querySelector(".progress");
    var where = doc.querySelector(".topbar .where");
    var secs = Array.prototype.slice.call(doc.querySelectorAll("section[data-nav]"));
    var rail = doc.querySelector(".rail");
    if (rail && !rail.children.length) {
      secs.forEach(function (s) {
        var a = doc.createElement("a"); a.href = "#" + s.id;
        a.innerHTML = "<i></i><span>" + s.getAttribute("data-nav") + "</span>";
        rail.appendChild(a);
      });
    }
    var links = rail ? rail.querySelectorAll("a") : [];
    var ticking = false, last = -1;
    function update() {
      ticking = false;
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty("--p", h > 0 ? Math.min(1, window.scrollY / h) : 0);
      var idx = -1;
      for (var i = 0; i < secs.length; i++) if (secs[i].getBoundingClientRect().top < window.innerHeight * .35) idx = i;
      if (idx !== last) {
        last = idx;
        links.forEach(function (a, j) { a.classList.toggle("on", j === idx); });
        if (where) where.innerHTML = idx >= 0 ? "<span>" + (secs[idx].getAttribute("data-num") || "") + "</span> " + secs[idx].getAttribute("data-nav") : where.getAttribute("data-default") || "";
      }
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* controles segmentados genéricos: [data-seg] com botões [data-v] */
  FS.seg = function (el, onChange) {
    var btns = el.querySelectorAll("button[data-v]");
    btns.forEach(function (b) {
      b.type = "button";
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        onChange(b.getAttribute("data-v"), b);
      });
    });
  };

  /* utilitário de interpolação suave */
  FS.tween = function (from, to, ms, step, done) {
    if (reduce) { step(to); if (done) done(); return; }
    var t0 = performance.now();
    function f(t) {
      var k = Math.min(1, (t - t0) / ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      step(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(f); else if (done) done();
    }
    requestAnimationFrame(f);
  };

  /* carrega a cena 3D quando three.js estiver disponível; senão mantém a figura estática */
  FS.when3D = function (fn) {
    if (isPrint) return;
    if (window.THREE) { try { fn(window.THREE); } catch (e) { console.warn(e); } return; }
    window.addEventListener("load", function () { if (window.THREE) { try { fn(window.THREE); } catch (e) { console.warn(e); } } });
  };

  function boot() {
    initFields();
    initNav();
    initReveal();
    FS.drawPaths();
    doc.querySelectorAll("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () { FS.copyFrom(b, doc.getElementById(b.getAttribute("data-copy"))); });
    });
    doc.querySelectorAll("[data-clear]").forEach(function (b) {
      b.addEventListener("click", function () { FS.clear(b, doc.getElementById(b.getAttribute("data-clear"))); });
    });
    root.classList.add("js");
    doc.dispatchEvent(new Event("fs:ready"));
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot); else boot();
})();
