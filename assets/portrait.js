(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = getComputedStyle(document.documentElement);
  function tok(n) { return root.getPropertyValue(n).trim(); }
  /* ---------- The binary portrait: the page's one moment ---------- */
  var box = document.getElementById("portrait"), cv = document.getElementById("binary"), ctx = cv.getContext("2d");
  var photo = box.querySelector("img");
  var COLS = 112, cells = [], ROWS = 0, cw = 0, ch = 0, mouse = null, settled = false, startT = 0;
  function build() {
    var s = document.createElement("canvas"), sx = s.getContext("2d");
    ROWS = Math.round(COLS / 1.6);
    s.width = COLS; s.height = ROWS;
    sx.drawImage(photo, 0, 0, COLS, ROWS);
    var px = sx.getImageData(0, 0, COLS, ROWS).data, vals = [], lo = 255, hi = 0;
    for (var i = 0; i < COLS * ROWS; i++) { var v = 0.3 * px[i * 4] + 0.59 * px[i * 4 + 1] + 0.11 * px[i * 4 + 2]; vals.push(v); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    cells = vals.map(function (v, i) {
      var n = (v - lo) / (hi - lo || 1);
      var ink = n > 0.92 ? 0 : Math.max(0.08, Math.min(1, Math.pow(1 - n, 1.25) * 1.15));
      return { ink: ink, ch: Math.random() < 0.5 ? "0" : "1", delay: Math.random() * 0.9 + (i / COLS / ROWS) * 0.4 };
    });
    size();
  }
  function size() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cw = r.width / COLS; ch = r.height / ROWS;
  }
  function draw(t) {
    var w = cv.width, ink = tok("--ink"), now = (t - startT) / 1000, busy = false;
    ctx.clearRect(0, 0, w, cv.height);
    ctx.font = "700 " + (ch * 0.95).toFixed(1) + "px " + tok("--digits");
    ctx.textBaseline = "top"; ctx.fillStyle = ink;
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      var c = cells[y * COLS + x]; if (!c.ink) continue;
      var a = c.ink, glyph = c.ch;
      if (!settled) {
        var p = Math.min(1, Math.max(0, (now - c.delay) / 0.5));
        if (p < 1) { busy = true; glyph = Math.random() < 0.5 ? "0" : "1"; a = c.ink * p; }
      }
      if (mouse) {
        var dx = (x + 0.5) * cw - mouse.x, dy = (y + 0.5) * ch - mouse.y;
        if (dx * dx + dy * dy < 1600) { glyph = Math.random() < 0.5 ? "0" : "1"; busy = true; }
      }
      ctx.globalAlpha = a; ctx.fillText(glyph, x * cw, y * ch);
    }
    ctx.globalAlpha = 1;
    if (!busy && !settled) settled = true;
    if (busy) requestAnimationFrame(draw);
  }
  function start() {
    build();
    if (reduce) { settled = true; draw(0); return; }
    startT = performance.now(); requestAnimationFrame(draw);
  }
  if (photo.complete) start(); else photo.addEventListener("load", start);
  window.addEventListener("resize", function () { size(); draw(performance.now()); });
  cv.addEventListener("pointermove", function (e) {
    if (reduce) return;
    var r = cv.getBoundingClientRect(), was = mouse;
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (!was && settled) requestAnimationFrame(draw);
  });
  cv.addEventListener("pointerleave", function () { mouse = null; requestAnimationFrame(draw); });
  var swap = document.getElementById("swap-btn");
  swap.addEventListener("click", function () {
    var on = box.classList.toggle("photo");
    swap.setAttribute("aria-pressed", on ? "true" : "false");
    swap.textContent = on ? "Show it in binary" : "Show the photo";
  });

})();
