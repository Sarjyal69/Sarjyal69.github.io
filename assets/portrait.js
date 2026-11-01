(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = getComputedStyle(document.documentElement);
  function tok(n) { return root.getPropertyValue(n).trim(); }
  /* ---------- The binary portrait: the page's one moment ---------- */
  var box = document.getElementById("portrait"), cv = document.getElementById("binary"), ctx = cv.getContext("2d");
  var photo = box.querySelector("img");
  var DIGITS = tok("--digits"), COLS = 96, cells = [], ROWS = 0, cw = 0, ch = 0, mouse = null, settled = false, startT = 0;
  function build() {
    var s = document.createElement("canvas"), sx = s.getContext("2d");
    ROWS = Math.round(COLS / 1.6);
    s.width = COLS; s.height = ROWS;
    sx.drawImage(photo, 0, 0, COLS, ROWS);
    var px = sx.getImageData(0, 0, COLS, ROWS).data;
    cells = [];
    for (var i = 0; i < COLS * ROWS; i++) {
      var x = i % COLS, y = (i / COLS) | 0, dx = (x + 0.5) / COLS - 0.5, dy = (y + 0.5) / ROWS - 0.5;
      var r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
      // skip the near-white studio backdrop and anything outside the circle
      var m = (r + g + b) / 3, keep = dx * dx + dy * dy < 0.235 && m < 222;
      // stronger, slightly darker colour so thin digits still read as a face on white
      r = Math.max(0, Math.min(255, (m + (r - m) * 1.8) * 0.78)) | 0; g = Math.max(0, Math.min(255, (m + (g - m) * 1.8) * 0.78)) | 0; b = Math.max(0, Math.min(255, (m + (b - m) * 1.8) * 0.78)) | 0;
      cells.push(keep ? { ink: Math.min(1, 0.12 + Math.pow(1 - m / 222, 1.3) * 1.6), col: "rgb(" + r + "," + g + "," + b + ")", ch: Math.random() < 0.5 ? "0" : "1", delay: Math.random() * 0.9 + (i / COLS / ROWS) * 0.4 } : null);
    }
    size();
  }
  function size() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cw = r.width / COLS; ch = r.height / ROWS;
  }
  function draw(t) {
    var w = cv.width, now = (t - startT) / 1000, busy = false;
    ctx.clearRect(0, 0, w, cv.height);
    ctx.font = "700 " + (ch * 0.95).toFixed(1) + "px " + DIGITS;
    ctx.textBaseline = "top";
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
      var c = cells[y * COLS + x]; if (!c) continue;
      var a = c.ink, glyph = c.ch;
      if (!settled) {
        var p = Math.min(1, Math.max(0, (now - c.delay) / 0.5));
        if (p < 1) { busy = true; glyph = Math.random() < 0.5 ? "0" : "1"; a = c.ink * p; }
      }
      if (mouse) {
        var dx = (x + 0.5) * cw - mouse.x, dy = (y + 0.5) * ch - mouse.y;
        if (dx * dx + dy * dy < 1600) { glyph = Math.random() < 0.5 ? "0" : "1"; busy = true; }
      }
      ctx.globalAlpha = a; ctx.fillStyle = c.col; ctx.fillText(glyph, x * cw, y * ch);
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
