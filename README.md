# Shuvang Arjyal: portfolio

Live site: https://sarjyal69.github.io

A plain, readable portfolio for IT support and helpdesk roles in Darwin, NT, across six pages: home, experience, how I work, skills, education and contact.

- **Home:** my name, a one-line pitch, a few real figures, and my portrait as a black-and-white terminal window (with a button to see the real photo).
- **Experience and How I work:** my roles and four problems I solved, told as situation, task, action and result.
- **Skills and Education:** the tools I've used and the courses I've completed, with links to verify them.
- **Site helper:** an eye in the corner of every page follows the cursor, says what each page is about, and opens a small chat that answers common questions from the site's own content. Visitors can drag it anywhere.

Each page is a plain HTML file; shared styles, scripts, fonts and logos live in `assets/`. No frameworks and no build step.

## How I built this site

I built this portfolio with **Claude Code**, Anthropic's AI coding assistant, working as my pair-programmer and guide. I decided what the site should say, how it should look and behave, and what was good enough to ship. Claude Code wrote the code, explained the options and checked the results. I reviewed every change and tested it myself before it went live.

### What I did

- **Set the goal and the brief:** a plain, readable portfolio aimed at IT support and helpdesk roles in Darwin, that reads like my résumé.
- **Supplied all the content:** my experience, the STAR stories, my courses and certificates, photos, and the company and university logos. I also corrected anything that wasn't accurate. No numbers or claims on this site are invented.
- **Made the design calls:**
  - I rejected early versions that looked generic or "AI-made".
  - I chose light mode, black-and-white type with one blue accent, and the terminal-style portrait.
  - I asked for the eye helper and decided how it should behave.
- **Tested it like a user:** I found and reported real bugs, such as the light/dark choice resetting between pages and the chat's suggested questions being impossible to scroll. I checked each fix.
- **Made the privacy and security decisions:** I removed my phone number from the site and from the repo's whole history before making it public, and I chose what personal information appears.
- **Set up hosting:** I renamed the repo, made it public and turned on GitHub Pages.

### What Claude Code did

- Wrote the HTML, CSS and JavaScript to my brief, explaining options and trade-offs before big changes, and waiting for my go-ahead.
- Researched colours, fonts and accessibility guidelines, and ran design, code and security reviews.
- Tested each page in a real browser on desktop and phone, and ran Lighthouse audits.

### What I learned

- **Writing a clear brief and acceptance criteria matters more than the tool.** Vague requests produced work I had to throw away.
- **Read what changed, and test it yourself.** A fix isn't done until I've seen it work.
- **The basics of how a website goes live:**
  - Git and GitHub: commits, history and repository settings.
  - GitHub Pages hosting.
  - Performance with Lighthouse (now 95 to 100).
  - Security headers and keeping personal data out of public code.

### Tools

Claude Code, GitHub, GitHub Pages, Lighthouse, Playwright for browser testing, plain HTML, CSS and JavaScript (no frameworks), and self-hosted Atkinson Hyperlegible Next and Bricolage Grotesque fonts. Design and accessibility checks used the Web Interface Guidelines, Hallmark and kill-ai-slop checklists.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Hosting

Published with GitHub Pages from the `main` branch (root folder). Every push to `main` updates the live site within about a minute.

## Still to add

- My LinkedIn link (the Contact page shows a placeholder).

## Credits

Logos and brand names belong to their owners and are shown only to name where I worked, studied, and the tools I've used; no endorsement is implied.

- Icons from [Iconify's Logos set](https://github.com/gilbarbara/logos) by Gil Barbara (CC0), [Devicon](https://github.com/devicons/devicon) (MIT) and [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0), including the McDonald's, GitHub and Coursera marks.
- Logos for IPinfo, HighLevel, Blotato, RepliQ, ServiceNow, CapCut, Higgsfield, Runway, Screen Studio, Supercut, Charles Darwin University, NIT, the Australian Computer Society, ISC2, CompTIA, ISACA, Nando's and GovHack are each organisation's own icon or logo, taken from their official websites. The Skillsoft wordmark and the DGK Business Consultancy logo were supplied by me.
- Fonts: Atkinson Hyperlegible Next (Braille Institute) and Bricolage Grotesque (Mathieu Triay), both under the SIL Open Font License, self-hosted in `assets/fonts`.
