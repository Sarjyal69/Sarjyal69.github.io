(function () {
  "use strict";
  /* ---------- The portrait: coloured dots gather into the photo, then it tilts toward the mouse ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var box = document.getElementById("portrait"), photo = box.querySelector("img"), cv = document.getElementById("reveal");

  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    box.addEventListener("pointermove", function (e) {
      var r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      box.style.setProperty("--rx", ((0.5 - y) * 12).toFixed(2) + "deg");
      box.style.setProperty("--ry", ((x - 0.5) * 12).toFixed(2) + "deg");
      box.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      box.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      box.classList.add("tilt");
    });
    box.addEventListener("pointerleave", function () {
      box.classList.remove("tilt");
      box.style.setProperty("--rx", "0deg"); box.style.setProperty("--ry", "0deg");
    });
  }

  function done() { box.classList.add("shown"); setTimeout(function () { cv.remove(); }, 600); }
  if (reduce) { done(); return; }

  function reveal() {
    var N = 46, s = document.createElement("canvas"), sx = s.getContext("2d");
    s.width = s.height = N; sx.drawImage(photo, 0, 0, N, N);
    var px = sx.getImageData(0, 0, N, N).data, dots = [];
    for (var i = 0; i < N * N; i++) {
      var gx = (i % N + 0.5) / N, gy = (((i / N) | 0) + 0.5) / N, dx = gx - 0.5, dy = gy - 0.5;
      if (dx * dx + dy * dy > 0.25) continue;
      var a = Math.random() * Math.PI * 2, d = 0.35 + Math.random() * 0.35;
      dots.push({ tx: gx, ty: gy, sx: 0.5 + Math.cos(a) * d, sy: 0.5 + Math.sin(a) * d, delay: Math.random() * 0.35,
        col: "rgb(" + px[i * 4] + "," + px[i * 4 + 1] + "," + px[i * 4 + 2] + ")" });
    }
    var ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1), size = cv.getBoundingClientRect().width;
    cv.width = cv.height = size * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var step = size / N, t0 = performance.now();
    function frame(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, size, size);
      for (var j = 0; j < dots.length; j++) {
        var p = dots[j], k = Math.min(1, Math.max(0, (t - p.delay) / 0.9)), e = 1 - Math.pow(1 - k, 3);
        ctx.globalAlpha = Math.min(1, k * 2);
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc((p.sx + (p.tx - p.sx) * e) * size, (p.sy + (p.ty - p.sy) * e) * size, step * (0.2 + 0.4 * e), 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 1.3) requestAnimationFrame(frame); else done();
    }
    requestAnimationFrame(frame);
  }
  if (photo.complete) reveal(); else photo.addEventListener("load", reveal);
})();
