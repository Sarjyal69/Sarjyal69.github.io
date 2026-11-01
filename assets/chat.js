(function () {
  "use strict";
  /* ---------- Site helper: a small chat bubble that answers from facts already on this site ---------- */
  var EMAIL = "sarjyal69@protonmail.com";
  var MAIL = '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>";

  // Each answer lists the words that point to it. Answers only repeat what the pages already say.
  var ANSWERS = [
    { id: "experience", label: "See his experience", words: ["experience", "work", "job", "jobs", "worked", "career", "history", "intern", "internship", "dgk", "mcdonald", "mcdonalds", "nando", "nandos", "manager", "leader", "employ"],
      html: 'Shuvang is an IT and Automation Intern at DGK Business Consultancy (since Aug 2026). Since Sep 2022 he has also been a Shift Manager at McDonald\'s and a Shift Leader at Nando\'s, fixing kiosks, POS terminals and printers mid-rush. <a href="experience.html">Open Experience</a>' },
    { id: "skills", label: "What can he do?", words: ["skill", "skills", "tools", "tool", "apps", "app", "software", "tech", "network", "networking", "support", "troubleshoot", "windows", "microsoft", "python", "automation"],
      html: 'Support and troubleshooting, systems and networks, tools and automation, and introductory programming. He has used 48 apps and tools, from Microsoft 365 and Active Directory to n8n and Airtable. <a href="skills.html">Open Skills</a>' },
    { id: "education", label: "Education", words: ["study", "studied", "degree", "uni", "university", "education", "cdu", "acs", "professional", "year", "certificate", "certificates", "course", "courses", "qualification", "qualifications", "graduate", "skillsoft"],
      html: 'Bachelor of Information Technology from Charles Darwin University (2025), the ACS Professional Year (ICT) from Oct 2025 to Oct 2026, and Skillsoft learning paths including ISC2 and CompTIA Tech+. <a href="education.html">Open Education</a>' },
    { id: "how", label: "How he works", words: ["approach", "story", "stories", "example", "examples", "star", "problem", "problems", "fix", "process", "method"],
      html: 'Four real problems told as situation, task, action and result, plus his five steps for fixing things: report, check the basics, narrow it down, fix and test, write it up. <a href="how-i-work.html">Open How I work</a>' },
    { id: "contact", label: "How do I contact him?", words: ["contact", "email", "mail", "phone", "call", "reach", "hire", "message", "talk", "interview", "linkedin"],
      html: "Email " + MAIL + '. The <a href="contact.html">Contact page</a> also has his phone number and a copy-email button.' },
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

  function answerFor(text) {
    var words = text.toLowerCase().replace(/[^a-zà-ÿ'\s]/g, " ").split(/\s+/), best = null, bestScore = 0;
    ANSWERS.forEach(function (a) {
      var score = 0;
      words.forEach(function (w) { if (w && a.words.indexOf(w.replace(/'s$/, "")) !== -1) score++; });
      if (score > bestScore) { best = a; bestScore = score; }
    });
    return best ? best.html : FALLBACK;
  }

  // shortcut: history lives in sessionStorage, so it lasts for the visit only and is lost where storage is blocked
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem("sa-chat") || "[]"); } catch (e) {}
  function save() { try { sessionStorage.setItem("sa-chat", JSON.stringify(history.slice(-30))); } catch (e) {} }

  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A2.5 2.5 0 0 1 3 13.5v-8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7.5 9.5c1.3-1.8 2.8-2.7 4.5-2.7s3.2.9 4.5 2.7c-1.3 1.8-2.8 2.7-4.5 2.7s-3.2-.9-4.5-2.7z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9.5" r="1.4" fill="currentColor"/></svg>';

  var fab = document.createElement("button");
  fab.type = "button"; fab.className = "chat-fab"; fab.innerHTML = ICON;
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
    if (who === "you") m.textContent = html; else m.innerHTML = html;
    log.appendChild(m); log.scrollTop = log.scrollHeight;
    if (store !== false) { history.push({ who: who, html: html }); save(); }
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
    b.addEventListener("click", function () { add("you", a.label); add("bot", a.html); input.focus(); });
    chips.appendChild(b);
  });

  if (history.length) history.forEach(function (m) { add(m.who, m.html, false); });
  else add("bot", GREETING);

  function open() {
    panel.hidden = false; fab.setAttribute("aria-expanded", "true"); fab.classList.add("on");
    log.scrollTop = log.scrollHeight; input.focus();
  }
  function close() {
    panel.hidden = true; fab.setAttribute("aria-expanded", "false"); fab.classList.remove("on"); fab.focus();
  }
  fab.addEventListener("click", function () { if (panel.hidden) open(); else close(); });
  panel.querySelector(".chat-close").addEventListener("click", close);
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); input.value = ""; });
})();
