(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ---------- Copy email: Contact page button and the footer's Copy button share one helper ---------- */
  var EMAIL = "sarjyal69@protonmail.com";
  function copyEmail(btn, rest, textEl) {
    function label(text) { btn.innerHTML = '<span class="lbl in">' + text + "</span>"; }
    function done() {
      btn.style.minWidth = btn.offsetWidth + "px"; // keep the button the same width while the label changes
      label("Copied");
      if (textEl && textEl.id === "mail-addr") { textEl.classList.remove("flash"); void textEl.offsetWidth; textEl.classList.add("flash"); }
      setTimeout(function () { label(rest); }, 1500);
    }
    function sel() { if (!textEl) return; var r = document.createRange(); r.selectNodeContents(textEl); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    try { navigator.clipboard.writeText(EMAIL).then(done, sel); } catch (e) { sel(); }
  }
  var copy = document.getElementById("copy-btn");
  if (copy) copy.addEventListener("click", function () { copyEmail(copy, "Copy email", document.getElementById("mail-addr")); });
  [].forEach.call(document.querySelectorAll(".copy-mail"), function (btn) {
    btn.addEventListener("click", function () { copyEmail(btn, "Copy", btn.parentNode.querySelector(".foot-email")); });
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
    // pointing at the drawing's heading or card makes it sketch itself again
    var host = svg.closest(".sec-head, .skills > div, .story, .figs li") || svg;
    if (window.matchMedia("(hover: hover)").matches) host.addEventListener("mouseenter", function () {
      if (!svg.classList.contains("in")) return;
      svg.classList.remove("in"); void svg.getBoundingClientRect(); svg.classList.add("in");
    });
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

  /* ---------- Footer: contents fade up; back to top ---------- */
  var band = document.querySelector("footer.band");
  if (band && !reduce) {
    var parts = band.querySelectorAll(".reveal");
    [].forEach.call(parts, function (el, n) { el.style.setProperty("--i", n); el.classList.add("pre"); });
    onView(band.querySelector(".cta") || band, function () { [].forEach.call(parts, function (el) { el.classList.add("in"); }); });
  }
  var toTop = document.querySelector(".to-top");
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var home = document.querySelector(".nav .name"); if (home) home.focus({ preventScroll: true });
  });

  /* ---------- Headings slide up word by word as they scroll into view ---------- */
  if (!reduce) [].forEach.call(document.querySelectorAll("main h1:not(.hero h1), main h2, .sec-head h1"), function (h) {
    if (h.children.length) return; // only plain-text headings
    var words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map(function (w, i) { return '<span class="w"><span style="--i:' + i + '">' + w + "</span></span>"; }).join(" ");
    h.classList.add("rv");
    onView(h, function () { h.classList.add("in"); });
  });

  /* ---------- Magnetic buttons: lean toward a nearby mouse, spring back when it leaves ---------- */
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var pt = null, queuedM = false;
    var pull = function () {
      queuedM = false;
      [].forEach.call(document.querySelectorAll(".hero .btn, .cta-btn, .chat-fab:not(.dragging)"), function (el) {
        var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = pt.x - cx, dy = pt.y - cy, reach = Math.max(r.width, r.height) / 2 + 60, d = Math.hypot(dx, dy);
        var cap = function (v, m) { return Math.max(-m, Math.min(m, v)).toFixed(1) + "px"; };
        el.style.translate = d < reach ? cap(dx * 0.22, 10) + " " + cap(dy * 0.3, 8) : "";
      });
    };
    window.addEventListener("pointermove", function (e) { pt = { x: e.clientX, y: e.clientY }; if (!queuedM) { queuedM = true; requestAnimationFrame(pull); } }, { passive: true });
  }

  /* ---------- "Email me": let visitors pick their own email service ---------- */
  var SUBJECT = "Hello from your portfolio";
  var MAIL_OPTS = [
    ["Gmail", "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(EMAIL) + "&su=" + encodeURIComponent(SUBJECT)],
    ["Outlook", "https://outlook.live.com/mail/0/deeplink/compose?to=" + encodeURIComponent(EMAIL) + "&subject=" + encodeURIComponent(SUBJECT)],
    ["Yahoo Mail", "https://compose.mail.yahoo.com/?to=" + encodeURIComponent(EMAIL) + "&subject=" + encodeURIComponent(SUBJECT)],
    ["Your email app", "mailto:" + EMAIL + "?subject=" + encodeURIComponent(SUBJECT)]
  ];
  var openMenu = null;
  function closeMailMenu(focusBack) {
    if (!openMenu) return;
    var m = openMenu; openMenu = null;
    m.trigger.setAttribute("aria-expanded", "false"); m.el.remove();
    if (focusBack) m.trigger.focus();
  }
  [].forEach.call(document.querySelectorAll(".mail-pick"), function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (openMenu && openMenu.trigger === trigger) { closeMailMenu(true); return; }
      closeMailMenu(false);
      var menu = document.createElement("div");
      menu.className = "mail-menu"; menu.setAttribute("role", "menu"); menu.setAttribute("aria-label", "Choose how to email");
      menu.innerHTML = MAIL_OPTS.map(function (o) {
        var web = o[1].indexOf("http") === 0;
        return '<a role="menuitem" href="' + o[1] + '"' + (web ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" + o[0] + (web ? '<span class="sr-only"> (opens in a new tab)</span>' : "") + "</a>";
      }).join("");
      trigger.parentNode.style.position = "relative";
      trigger.insertAdjacentElement("afterend", menu);
      var r = trigger.getBoundingClientRect(), pr = trigger.parentNode.getBoundingClientRect();
      // open to the left of the button when there is no room on the right
      menu.style.left = Math.max(0, r.left + menu.offsetWidth > Math.min(pr.right, innerWidth - 12) ? r.right - pr.left - menu.offsetWidth : r.left - pr.left) + "px";
      menu.style.top = (r.bottom - pr.top + 8) + "px";
      trigger.setAttribute("aria-expanded", "true");
      openMenu = { trigger: trigger, el: menu };
      menu.querySelector("a").focus();
      menu.addEventListener("click", function () { closeMailMenu(false); });
      menu.addEventListener("keydown", function (ev) {
        var items = [].slice.call(menu.querySelectorAll("a")), i = items.indexOf(document.activeElement);
        if (ev.key === "Escape") { ev.preventDefault(); closeMailMenu(true); }
        else if (ev.key === "ArrowDown") { ev.preventDefault(); items[(i + 1) % items.length].focus(); }
        else if (ev.key === "ArrowUp") { ev.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      });
    });
  });
  document.addEventListener("click", function (e) { if (openMenu && !openMenu.el.contains(e.target) && e.target !== openMenu.trigger && !openMenu.trigger.contains(e.target)) closeMailMenu(false); });
})();
