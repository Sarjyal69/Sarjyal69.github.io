# Shuvang Arjyal: portfolio

Live site: https://sarjyal69.github.io

A plain, readable portfolio for IT support and helpdesk roles in Darwin, NT, across six pages: home, experience, how I work, skills, education and contact.

- **Home:** my name, a one-line pitch, a few real figures, and my portrait as a black-and-white terminal window (with a button to see the real photo).
- **Experience and How I work:** my roles and four problems I solved, told as situation, task, action and result.
- **Skills and Education:** the tools I've used and the courses I've completed, with links to verify them.
- **Site helper:** an eye in the corner of every page follows the cursor, says what each page is about, and opens a small chat that answers common questions from the site's own content. Visitors can drag it anywhere.

Each page is a plain HTML file; shared styles, scripts, fonts and logos live in `assets/`. No frameworks and no build step.


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
