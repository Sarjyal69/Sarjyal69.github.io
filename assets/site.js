(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = getComputedStyle(document.documentElement);
  function tok(n) { return root.getPropertyValue(n).trim(); }
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

  /* ---------- The small eye and keyboard: keys light up as the visitor types ---------- */
  var dc = document.getElementById("desk-canvas"), dx = dc.getContext("2d");
  var W = 360, H = 172, busyK = 0, idle = 0, dm = { x: -1, y: -1 }, tt = 0, last = 0, lit = {}, gaze = { x: 0, y: 0 }, lastKey = null, nextBlink = 3, running = false;
  function fit() { var r = dc.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); dc.width = r.width * dpr; dc.height = r.height * dpr; dx.setTransform(dc.width / W, 0, 0, dc.height / H, 0, 0); }
  fit(); window.addEventListener("resize", fit);
  var RK = ["1234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"], KW = 24, KH = 17, GAP = 4, KTOP = 66, KEYS = {};
  RK.forEach(function (row, r) {
    var width = row.length * (KW + GAP) - GAP, x0 = (W - width) / 2 + (r === 3 ? 6 : 0);
    row.split("").forEach(function (c, i) { KEYS[c] = { x: x0 + i * (KW + GAP), y: KTOP + r * (KH + GAP), w: KW, label: c }; });
  });
  KEYS[" "] = { x: (W - 150) / 2, y: KTOP + 4 * (KH + GAP), w: 150, label: "" };
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.key.length !== 1) return;
    var k = KEYS[e.key.toLowerCase()]; if (!k) return;
    lit[e.key.toLowerCase()] = 1; lastKey = k; busyK = 0.35; idle = 0; wake();
  });
  window.addEventListener("pointermove", function (e) { var r = dc.getBoundingClientRect(); dm.x = (e.clientX - r.left) / r.width * W; dm.y = (e.clientY - r.top) / r.height * H; idle = 0; wake(); });
  function almond(cx, cy, w, h) { dx.beginPath(); dx.moveTo(cx - w, cy); dx.quadraticCurveTo(cx, cy - h * 2, cx + w, cy); dx.quadraticCurveTo(cx, cy + h * 2, cx - w, cy); dx.closePath(); }
  var INK, SOFT, LINE, ACC, BG, FONT;
  function readColours() { INK = tok("--ink"); SOFT = tok("--soft"); LINE = tok("--line"); ACC = tok("--accent"); BG = tok("--paper"); FONT = "11px " + tok("--font"); }
  readColours();
  function drawDesk(dt) {
    tt += dt; busyK = Math.max(0, busyK - dt); if (!busyK) idle += dt;
    dx.clearRect(0, 0, W, H); dx.lineWidth = 1.6; dx.lineCap = "round"; dx.lineJoin = "round";
    var ex = W / 2, ey = 30, tx = 0, ty = 0;
    if (busyK > 0 && lastKey) { tx = (lastKey.x + lastKey.w / 2 - ex) / 9; ty = 7; }
    else if (dm.x >= 0) { tx = (dm.x - ex) / 10; ty = (dm.y - ey) / 10; }
    tx = Math.max(-20, Math.min(20, tx)); ty = Math.max(-6, Math.min(7, ty));
    gaze.x += (tx - gaze.x) * Math.min(1, dt * 10); gaze.y += (ty - gaze.y) * Math.min(1, dt * 10);
    nextBlink -= dt; if (nextBlink < -0.14) nextBlink = 2.5 + Math.random() * 3;
    var open = nextBlink < 0 ? 0.08 : idle > 25 ? 0.35 : 1, h = 13 * open;
    dx.save(); almond(ex, ey, 46, h); dx.clip();
    dx.strokeStyle = INK; dx.beginPath(); dx.arc(ex + gaze.x, ey + gaze.y, 12, 0, Math.PI * 2); dx.stroke();
    dx.fillStyle = INK; dx.beginPath(); dx.arc(ex + gaze.x, ey + gaze.y, 5, 0, Math.PI * 2); dx.fill();
    dx.fillStyle = BG; dx.beginPath(); dx.arc(ex + gaze.x + 2, ey + gaze.y - 2, 1.4, 0, Math.PI * 2); dx.fill();
    dx.restore(); dx.strokeStyle = INK; almond(ex, ey, 46, h); dx.stroke();
    dx.font = FONT; dx.textAlign = "center"; dx.textBaseline = "middle";
    var anyLit = false;
    Object.keys(KEYS).forEach(function (c) {
      var k = KEYS[c], l = lit[c] || 0;
      if (l) { lit[c] = Math.max(0, l - dt * 3.5); anyLit = true; }
      if (l > 0) { dx.globalAlpha = l; dx.fillStyle = ACC; dx.fillRect(k.x, k.y, k.w, KH); dx.globalAlpha = 1; }
      dx.strokeStyle = l > 0.2 ? ACC : LINE; dx.strokeRect(k.x + 0.5, k.y + 0.5, k.w - 1, KH - 1);
      dx.fillStyle = l > 0.55 ? BG : SOFT; dx.fillText(k.label, k.x + k.w / 2, k.y + KH / 2 + 0.5);
    });
    return anyLit || busyK > 0 || Math.abs(gaze.x - tx) > 0.1 || Math.abs(gaze.y - ty) > 0.1 || nextBlink < 1;
  }
  function deskFrame(now) { var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; if (drawDesk(dt)) requestAnimationFrame(deskFrame); else running = false; }
  function wake() { if (reduce) { drawDesk(0); return; } if (!running) { running = true; last = performance.now(); requestAnimationFrame(deskFrame); } }
  drawDesk(0);
  if (!reduce) setInterval(wake, 3000);

  /* ---------- Portrait: switch between the green terminal version and the real photo ---------- */
  var swap = document.getElementById("swap-btn");
  if (swap) swap.addEventListener("click", function () {
    var term = document.getElementById("term"), on = term.classList.toggle("real-on");
    term.querySelector(".green").setAttribute("aria-hidden", on ? "true" : "false");
    term.querySelector(".real").setAttribute("aria-hidden", on ? "false" : "true");
    swap.setAttribute("aria-pressed", on ? "true" : "false");
    swap.textContent = on ? "See terminal version" : "See real photo";
  });

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
  window.rippleOnce = rippleOnce;
})();
