(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ---------- Copy email ---------- */
  var copy = document.getElementById("copy-btn");
  if (copy) copy.addEventListener("click", function () {
    function label(text) { copy.innerHTML = '<span class="lbl in">' + text + "</span>"; }
    function done() {
      copy.style.minWidth = copy.offsetWidth + "px"; // keep the button the same width while the label changes
      label("Copied");
      var addr = document.getElementById("mail-addr"); addr.classList.remove("flash"); void addr.offsetWidth; addr.classList.add("flash");
      setTimeout(function () { label("Copy email"); }, 1500);
    }
    function sel() { var r = document.createRange(); r.selectNodeContents(document.getElementById("mail-addr")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    try { navigator.clipboard.writeText("sarjyal69@protonmail.com").then(done, sel); } catch (e) { sel(); }
  });

  /* ---------- Portrait: switch between the green terminal version and the real photo ---------- */
  var swap = document.getElementById("swap-btn");
  // the real photo only downloads when someone shows interest in it, so it doesn't slow the first load
  var realImg = document.querySelector(".term .real");
  function loadReal() { if (realImg && !realImg.src) realImg.src = realImg.dataset.src; }
  if (swap) ["pointerenter", "focus", "touchstart"].forEach(function (ev) { swap.addEventListener(ev, loadReal, { passive: true }); });
  if (swap) swap.addEventListener("click", function () {
    loadReal();
    var showing = !document.getElementById("term").classList.contains("real-on");
    if (showing && realImg.decode) realImg.decode().then(flip, flip); else flip();
  });
  function flip() {
    var term = document.getElementById("term"), on = term.classList.toggle("real-on");
    term.querySelector(".green").setAttribute("aria-hidden", on ? "true" : "false");
    term.querySelector(".real").setAttribute("aria-hidden", on ? "false" : "true");
    swap.setAttribute("aria-pressed", on ? "true" : "false");
    swap.textContent = on ? "See terminal version" : "See real photo";
  }

  /* ---------- Home page arrival: the name types itself and the portrait boots up, once per visit ---------- */
  function firstTime(key) { var seen = false; try { seen = sessionStorage.getItem(key) === "1"; sessionStorage.setItem(key, "1"); } catch (e) {} return !seen; }
  var name = document.querySelector(".hero h1"), term = document.getElementById("term");
  if (name && term && !reduce && firstTime("sa-arrive")) {
    var text = name.textContent;
    name.setAttribute("aria-label", text);
    name.innerHTML = text.split("").map(function (c) { return '<span class="ch" aria-hidden="true">' + c + "</span>"; }).join("");
    name.classList.add("typing");
    var chars = name.querySelectorAll(".ch"), n = 0;
    var typer = setInterval(function () {
      if (n) chars[n - 1].classList.remove("cur");
      chars[n].classList.add("on", "cur");
      if (++n === chars.length) {
        clearInterval(typer);
        setTimeout(function () { chars[n - 1].classList.remove("cur"); name.classList.remove("typing"); }, 1100);
      }
    }, 55);
    term.classList.add("boot");
  }

  /* ---------- Figures: run something once when it scrolls into view ---------- */
  function onView(el, fn) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) return fn();
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: 0.4 });
    io.observe(el);
  }
  // number highlights count up from 0; the final numbers are already in the page for screen readers and no-JS
  var figs = document.querySelector(".figs");
  if (figs && !reduce) onView(figs, function () {
    [].forEach.call(figs.querySelectorAll("[data-count]"), function (el) {
      var end = +el.dataset.count, t0 = performance.now();
      el.setAttribute("aria-label", end);
      (function tick(now) {
        var k = Math.min(1, (now - t0) / 800);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  });
  // fix-it steps light up in order
  var flow = document.querySelector(".flow");
  if (flow && !reduce) {
    [].forEach.call(flow.children, function (li, n) { li.style.setProperty("--i", n); });
    flow.classList.add("anim");
    onView(flow, function () { flow.classList.add("in"); });
  }

  // line drawings sketch themselves in
  if (!reduce) [].forEach.call(document.querySelectorAll(".art"), function (svg) {
    [].forEach.call(svg.children, function (el, n) { el.style.setProperty("--i", n); });
    svg.classList.add("draw");
    onView(svg, function () { svg.classList.add("in"); });
  });

  /* ---------- Lists that ripple in, once per visit ---------- */
  function rippleOnce(el, key) {
    if (!el || reduce) return;
    var seen = false;
    try { seen = sessionStorage.getItem(key) === "1"; sessionStorage.setItem(key, "1"); } catch (e) {}
    if (seen) return;
    [].forEach.call(el.querySelectorAll("li"), function (li, n) { li.style.setProperty("--i", n); });
    el.classList.add("ripple");
  }
  rippleOnce(document.querySelector(".next"), "sa-ripple-home");
  rippleOnce(document.getElementById("apps"), "sa-ripple-skills");

  /* ---------- Header: sliding highlight, reading progress, lift and tuck-away on scroll ---------- */
  var header = document.querySelector(".nav"), menu = header && header.querySelector("nav");
  if (menu) {
    var ink = menu.querySelector(".nav-ink"), current = menu.querySelector('[aria-current="page"]');
    var moveInk = function (a) {
      if (!a) { ink.style.opacity = "0"; return; }
      ink.style.opacity = "1"; ink.style.width = a.offsetWidth + "px"; ink.style.transform = "translate(" + a.offsetLeft + "px, " + (a.offsetTop + a.offsetHeight - 2) + "px)";
    };
    menu.classList.add("has-ink"); moveInk(current);
    requestAnimationFrame(function () { ink.classList.add("ready"); });
    [].forEach.call(menu.querySelectorAll("a"), function (a) {
      if (window.matchMedia("(hover: hover)").matches) a.addEventListener("mouseenter", function () { moveInk(a); });
      a.addEventListener("focus", function () { moveInk(a); });
    });
    menu.addEventListener("mouseleave", function () { moveInk(current); });
    menu.addEventListener("focusout", function (e) { if (!menu.contains(e.relatedTarget)) moveInk(current); });
    window.addEventListener("resize", function () { moveInk(current); });
    if (document.fonts) document.fonts.ready.then(function () { moveInk(current); });

    var bar = header.querySelector(".progress"), lastY = window.scrollY, ticking = false;
    var onScroll = function () {
      ticking = false;
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ")";
      header.classList.toggle("scrolled", y > 4);
      if (!reduce) {
        if (y > lastY + 6 && y > 140 && !header.contains(document.activeElement)) header.classList.add("hide");
        else if (y < lastY - 6 || y < 140) header.classList.remove("hide");
      }
      lastY = y;
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    header.addEventListener("focusin", function () { header.classList.remove("hide"); });
    onScroll();
  }

  /* ---------- Footer: name signature rises in; back to top ---------- */
  var sig = document.querySelector(".sig");
  if (sig && !reduce) { sig.classList.add("pre"); onView(sig, function () { sig.classList.add("in"); }); }
  var toTop = document.querySelector(".to-top");
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var home = document.querySelector(".nav .name"); if (home) home.focus({ preventScroll: true });
  });
})();
