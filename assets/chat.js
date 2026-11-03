(function () {
  "use strict";
  // build the helper once the page has finished loading and the browser is idle, so it never delays the first paint
  function init() {
  /* ---------- Site helper: a small chat bubble that answers from facts already on this site ---------- */
  var EMAIL = "sarjyal69@protonmail.com";
  var MAIL = '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>";

  // Each answer lists the words that point to it. Answers only repeat what the pages already say.
  var ANSWERS = [
    { id: "experience", label: "See his experience", words: ["experience", "work", "job", "jobs", "worked", "career", "history", "intern", "internship", "dgk", "mcdonald", "mcdonalds", "nando", "nandos", "manager", "leader", "employ", "govhack", "volunteer", "volunteering", "hackathon"],
      html: 'Shuvang is an IT and Automation Intern at DGK Business Consultancy (since Aug 2026). Since Sep 2022 he has also been a Shift Manager at McDonald\'s and a Shift Leader at Nando\'s, fixing kiosks, POS terminals and printers mid-rush. He also volunteered at GovHack in Darwin (2024 to 2025). <a href="experience.html">Open Experience</a>' },
    { id: "skills", label: "What can he do?", words: ["skill", "skills", "tools", "tool", "apps", "app", "software", "tech", "network", "networking", "support", "troubleshoot", "windows", "microsoft", "python", "automation"],
      html: 'Support and troubleshooting, systems and networks, tools and automation, and introductory programming. He has used 48 apps and tools, from Microsoft 365 and Active Directory to n8n and Airtable. <a href="skills.html">Open Skills</a>' },
    { id: "education", label: "Education", words: ["study", "studied", "degree", "uni", "university", "education", "cdu", "acs", "professional", "year", "certificate", "certificates", "course", "courses", "qualification", "qualifications", "graduate", "skillsoft", "coursera", "google", "badge", "badges"],
      html: 'Bachelor of Information Technology from Charles Darwin University (2025), the ACS Professional Year (ICT) from Oct 2025 to Oct 2026, Google\'s Technical Support Fundamentals on Coursera, and Skillsoft courses including the ISC2 Certified in Cybersecurity learning path and CompTIA Tech+, each with a verified badge. <a href="education.html">Open Education</a>' },
    { id: "how", label: "How he works", words: ["approach", "story", "stories", "example", "examples", "star", "problem", "problems", "fix", "process", "method"],
      html: 'Four real problems told as situation, task, action and result, plus his five steps for fixing things: report, check the basics, narrow it down, fix and test, write it up. <a href="how-i-work.html">Open How I work</a>' },
    { id: "contact", label: "How do I contact him?", words: ["contact", "email", "mail", "phone", "call", "reach", "hire", "message", "talk", "interview", "linkedin"],
      html: "Email " + MAIL + '. The <a href="contact.html">Contact page</a> has a copy-email button. His phone number and referees are shared on request by email. You can also <a href="https://www.linkedin.com/in/shuv-arjyal-580143424/" rel="noopener">connect on LinkedIn</a>.' },
    { id: "available", label: "Is he available?", words: ["available", "availability", "start", "visa", "rights", "when", "where", "location", "located", "darwin", "based", "live", "relocate"],
      html: 'Yes. He is based in Darwin, NT, has full work rights, and is available to start now. <a href="contact.html">Get in touch</a>' },
    { id: "resume", label: "Can I get his résumé?", words: ["resume", "résumé", "cv", "referee", "referees", "reference", "references"],
      html: 'His résumé and referees are available on request. Email <a href="mailto:' + EMAIL + '?subject=R%C3%A9sum%C3%A9%20request">' + EMAIL + "</a> and he'll send them." },
    { id: "hello", words: ["hi", "hello", "hey", "gday", "g'day", "morning", "afternoon"],
      html: "Hi! Pick a question below or type your own." },
    { id: "thanks", words: ["thanks", "thank", "cheers", "ta"],
      html: "You're welcome. Anything else?" }
  ];
  var GREETING = "Hi! I can help you find your way around Shuvang's portfolio. What would you like to know?";
  var FALLBACK = "Sorry, I can only answer questions about this site. Try one of the buttons below, or email " + MAIL + ".";

  function htmlFor(id) {
    if (id === "greeting") return GREETING;
    for (var i = 0; i < ANSWERS.length; i++) if (ANSWERS[i].id === id) return ANSWERS[i].html;
    return FALLBACK;
  }
  function answerFor(text) {
    var words = text.toLowerCase().replace(/[^a-zà-ÿ'\s]/g, " ").split(/\s+/), best = null, bestScore = 0;
    ANSWERS.forEach(function (a) {
      var score = 0;
      words.forEach(function (w) { if (w && a.words.indexOf(w.replace(/'s$/, "")) !== -1) score++; });
      if (score > bestScore) { best = a; bestScore = score; }
    });
    return best ? best.id : "fallback";
  }

  // shortcut: history lives in sessionStorage, so it lasts for the visit only and is lost where storage is blocked
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem("sa-chat") || "[]"); } catch (e) {}
  var chatted = history.length > 0; // checked before the welcome message is added
  function save() { try { sessionStorage.setItem("sa-chat", JSON.stringify(history.slice(-30))); } catch (e) {} }

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A2.5 2.5 0 0 1 3 13.5v-8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7.5 9.5c1.3-1.8 2.8-2.7 4.5-2.7s3.2.9 4.5 2.7c-1.3 1.8-2.8 2.7-4.5 2.7s-3.2-.9-4.5-2.7z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9.5" r="1.4" fill="currentColor"/></svg>';

  var EYE_SHAPE = "M3 20C8.5 11 14 7.5 20 7.5S31.5 11 37 20C31.5 29 26 32.5 20 32.5S8.5 29 3 20z";
  var EYE = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><defs><clipPath id="eye-clip"><path d="' + EYE_SHAPE + '"/></clipPath></defs>' +
    '<g class="lid"><path d="' + EYE_SHAPE + '" fill="#fff"/><g clip-path="url(#eye-clip)"><g class="iris"><circle cx="20" cy="20" r="8.5" class="iris-ring"/><circle cx="20" cy="20" r="4" fill="#111"/><circle cx="22.4" cy="17.6" r="1.4" fill="#fff"/></g></g>' +
    '<path d="' + EYE_SHAPE + '" fill="none" stroke="#111" stroke-width="2.2" stroke-linejoin="round"/></g></svg>';
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var fab = document.createElement("button");
  fab.type = "button"; fab.className = "chat-fab"; fab.innerHTML = EYE;
  fab.setAttribute("aria-label", "Open site helper"); fab.setAttribute("aria-expanded", "false"); fab.setAttribute("aria-controls", "chat-panel");

  var panel = document.createElement("div");
  panel.className = "chat"; panel.id = "chat-panel"; panel.hidden = true;
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Site helper");
  panel.innerHTML =
    '<div class="chat-top"><span class="chat-avatar">' + ICON + '</span><div><b>Site helper</b><small>Answers about Shuvang and this site</small></div>' +
    '<button type="button" class="chat-close" aria-label="Close site helper">&times;</button></div>' +
    '<div class="chat-log" role="log" aria-live="polite"></div>' +
    '<div class="chat-chips"></div>' +
    '<form class="chat-form"><label class="sr-only" for="chat-input">Ask a question</label>' +
    '<input id="chat-input" type="text" autocomplete="off" placeholder="Ask about experience, skills…" maxlength="200">' +
    '<button type="submit" aria-label="Send">&rarr;</button></form>';

  document.body.appendChild(panel); document.body.appendChild(fab);
  var log = panel.querySelector(".chat-log"), chips = panel.querySelector(".chat-chips"),
      form = panel.querySelector(".chat-form"), input = panel.querySelector("input");

  function add(who, html, store) {
    var m = document.createElement("div");
    m.className = "msg " + who;
    // visitor text is only ever shown as plain text; bot replies come from the fixed answers above by id
    if (who === "you") m.textContent = html; else m.innerHTML = htmlFor(html);
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    if (store !== false) { history.push(who === "you" ? { who: who, text: html } : { who: who, id: html }); save(); }
  }
  function ask(text) {
    text = text.trim(); if (!text) return;
    add("you", text);
    add("bot", answerFor(text));
  }
  ANSWERS.forEach(function (a) {
    if (!a.label) return;
    var b = document.createElement("button");
    b.type = "button"; b.textContent = a.label;
    b.addEventListener("click", function () { add("you", a.label); add("bot", a.id); input.focus(); });
    chips.appendChild(b);
  });

  history = history.filter(function (m) { return typeof (m.who === "you" ? m.text : m.id) === "string"; });
  if (history.length) history.forEach(function (m) { add(m.who, m.who === "you" ? m.text : m.id, false); });
  else add("bot", "greeting");

  /* ---------- The eye follows the cursor or finger, and blinks now and then ---------- */
  var iris = fab.querySelector(".iris"), lid = fab.querySelector(".lid"), target = null, queued = false;
  function look() {
    queued = false;
    var r = fab.getBoundingClientRect(), dx = target.x - (r.left + r.width / 2), dy = target.y - (r.top + r.height / 2);
    var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 220);
    iris.setAttribute("transform", "translate(" + (dx / d * 6 * k).toFixed(2) + " " + (dy / d * 3.5 * k).toFixed(2) + ")");
  }
  function follow(e) {
    var p = e.touches ? e.touches[0] : e; if (!p) return;
    target = { x: p.clientX, y: p.clientY };
    if (!queued) { queued = true; requestAnimationFrame(look); }
  }
  if (!reduce) {
    window.addEventListener("pointermove", follow, { passive: true });
    window.addEventListener("pointerdown", follow, { passive: true });
    window.addEventListener("touchstart", follow, { passive: true });
    window.addEventListener("touchmove", follow, { passive: true });
    (function blink() {
      setTimeout(function () { lid.classList.add("blink"); setTimeout(function () { lid.classList.remove("blink"); blink(); }, 150); }, 3000 + Math.random() * 3000);
    })();
  }

  /* ---------- Visitors can drag the eye anywhere; the chat and messages open beside it ---------- */
  var dragged = false, drag = null;
  function clampTo(x, y) {
    var s = fab.offsetWidth, m = 8;
    return { x: Math.max(m, Math.min(innerWidth - s - m, x)), y: Math.max(m, Math.min(innerHeight - s - m, y)) };
  }
  function setFab(x, y) {
    var c = clampTo(x, y);
    fab.style.left = c.x + "px"; fab.style.top = c.y + "px"; fab.style.right = "auto"; fab.style.bottom = "auto";
  }
  // put a popup next to the eye, on whichever side has room
  function place(el) {
    if (!fab.style.left) return; // eye still in its default corner, CSS positions everything
    var s = fab.offsetWidth, l = parseFloat(fab.style.left), t = parseFloat(fab.style.top), r = { left: l, top: t, right: l + s, bottom: t + s, width: s, height: s };
    var gap = 14, w = el.offsetWidth, h = el.offsetHeight;
    var x = r.left + r.width / 2 > innerWidth / 2 ? r.right - w : r.left;
    var y = r.top + r.height / 2 > innerHeight / 2 ? r.top - gap - h : r.bottom + gap;
    el.style.right = el.style.bottom = "auto";
    el.style.left = Math.max(12, Math.min(innerWidth - w - 12, x)) + "px";
    el.style.top = Math.max(12, Math.min(innerHeight - h - 12, y)) + "px";
  }
  try { var saved = JSON.parse(sessionStorage.getItem("sa-eye") || "null"); if (saved) setFab(saved.x * innerWidth, saved.y * innerHeight); } catch (e) {}
  fab.addEventListener("pointerdown", function (e) {
    var r = fab.getBoundingClientRect();
    drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY };
  });
  window.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!dragged && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
    if (!dragged) { dragged = true; fab.setPointerCapture(e.pointerId); fab.classList.add("dragging"); hideCard(); }
    setFab(e.clientX - drag.dx, e.clientY - drag.dy);
    if (!panel.hidden) place(panel);
  });
  function endDrag() {
    if (!drag) return;
    drag = null; fab.classList.remove("dragging");
    if (dragged) {
      try { sessionStorage.setItem("sa-eye", JSON.stringify({ x: parseFloat(fab.style.left) / innerWidth, y: parseFloat(fab.style.top) / innerHeight })); } catch (e) {}
      setTimeout(function () { dragged = false; }, 0); // let the click handler see the drag first
    }
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  window.addEventListener("resize", function () {
    if (!fab.style.left) return;
    setFab(parseFloat(fab.style.left), parseFloat(fab.style.top));
    if (!panel.hidden) place(panel);
  });

  /* ---------- Greeting card: shows what the helper can do before it's opened ---------- */
  var card = null, hideTimer = null, seenHello = false;
  try { seenHello = sessionStorage.getItem("sa-hello") === "1"; } catch (e) {}
  var PICKS = ["experience", "skills", "contact", "available"];
  function showCard() {
    clearTimeout(hideTimer);
    if (card && card.classList.contains("tip")) { card.remove(); card = null; }
    if (card || !panel.hidden) return;
    card = document.createElement("div");
    card.className = "chat-hello"; card.setAttribute("role", "group"); card.setAttribute("aria-label", "What the site helper can do");
    card.innerHTML = '<div class="hello-top"><p>Hi! I can help you navigate this website.</p><button type="button" class="hello-x" aria-label="Dismiss">&times;</button></div><div class="hello-picks"></div><button type="button" class="hello-more">More questions…</button>';
    var picks = card.querySelector(".hello-picks");
    ANSWERS.forEach(function (a) {
      if (PICKS.indexOf(a.id) === -1) return;
      var btn = document.createElement("button");
      btn.type = "button"; btn.textContent = a.label;
      btn.addEventListener("click", function () { open(); add("you", a.label); add("bot", a.id); });
      picks.appendChild(btn);
    });
    card.querySelector(".hello-more").addEventListener("click", function () { open(); });
    card.querySelector(".hello-x").addEventListener("click", function () { hideCard(); fab.focus(); });
    card.addEventListener("keydown", function (e) { if (e.key === "Escape") { hideCard(); fab.focus(); } });
    card.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    card.addEventListener("mouseleave", hideSoon);
    document.body.appendChild(card); place(card);
  }
  function hideCard() {
    clearTimeout(hideTimer);
    if (!card) return;
    card.remove(); card = null;
    try { sessionStorage.setItem("sa-hello", "1"); } catch (e) {}
  }
  function hideSoon() { clearTimeout(hideTimer); hideTimer = setTimeout(hideCard, 350); }
  // Every page visit: the eye says a short message about the page it's on
  var PAGE_TIPS = {
    "index": "Hi! I can help you navigate this website.",
    "experience": "This is his work history. Ask me about any job.",
    "how-i-work": "Four real problems he solved. Want the short version?",
    "skills": "48 apps and tools are listed here. Ask me what he can do.",
    "education": "His degree, courses and certificates. Questions? Just ask.",
    "contact": "Want to get in touch? I can help with that."
  };
  var page = (location.pathname.split("/").pop() || "index").replace(".html", "") || "index";
  function showTip() {
    if (card || !panel.hidden) return;
    card = document.createElement("div");
    card.className = "chat-hello tip"; card.setAttribute("role", "status");
    card.innerHTML = '<div class="hello-top"><button type="button" class="tip-text"></button><button type="button" class="hello-x" aria-label="Dismiss">&times;</button></div>';
    card.querySelector(".tip-text").textContent = PAGE_TIPS[page] || PAGE_TIPS.index;
    card.querySelector(".tip-text").addEventListener("click", function () { open(); });
    card.querySelector(".hello-x").addEventListener("click", function () { hideCard(); });
    card.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    card.addEventListener("mouseleave", hideSoon);
    document.body.appendChild(card); place(card);
    hideTimer = setTimeout(hideCard, 6000);
  }
  setTimeout(!seenHello && !chatted ? showCard : showTip, 2000);
  if (window.matchMedia("(hover: hover)").matches) {
    fab.addEventListener("mouseenter", showCard);
    fab.addEventListener("mouseleave", hideSoon);
  }
  fab.addEventListener("focus", function () { if (fab.matches(":focus-visible")) showCard(); });

  function open() {
    hideCard();
    panel.hidden = false; place(panel); fab.setAttribute("aria-expanded", "true"); fab.setAttribute("aria-label", "Close site helper"); fab.classList.add("on");
    log.scrollTop = log.scrollHeight; input.focus();
  }
  function close() {
    panel.hidden = true; fab.setAttribute("aria-expanded", "false"); fab.setAttribute("aria-label", "Open site helper"); fab.classList.remove("on"); fab.focus();
  }
  fab.addEventListener("click", function (e) {
    if (dragged) { dragged = false; e.preventDefault(); return; } // a drag is not a click
    if (panel.hidden) open(); else close();
  });
  panel.querySelector(".chat-close").addEventListener("click", close);
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); input.value = ""; });
  }
  function later() { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(init, { timeout: 1500 }); }
  if (document.readyState === "complete") later(); else window.addEventListener("load", later);
})();
