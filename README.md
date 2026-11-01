# Shuvang Arjyal: portfolio

A plain, readable portfolio across six pages (home, experience, how I work, skills, education, contact), with a shared footer where a small eye and keyboard react to typing. Light theme: white page, black type, terracotta actions. On first arrival the name types itself and the portrait boots up with a scan line; the real-photo switch wipes like a screen refresh. The home page shows the portrait as a green terminal window, generated from the real photo, with a button to see the real photo. Below it: about, experience, how I work (four stories in situation, task, action, result form), skills with app logos, education and contact,. Cleaned up against the kill-ai-slop, taste-skill and Hallmark checklists.

Each page is a plain HTML file; shared styles and scripts live in `assets/`. No build step.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on Netlify

Connect this repository in Netlify. Leave the build command empty and set the publish directory to `/`.

## Still to fill in

A dashed box marks the LinkedIn link, which still needs adding.

## Logo credits

Logos and brand names belong to their respective owners and are shown only to indicate tools used; no endorsement is implied. Icons come from [Iconify's Logos set](https://github.com/gilbarbara/logos) by Gil Barbara (CC0), [Devicon](https://github.com/devicons/devicon) (MIT) and [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0).

Logos for IPinfo, HighLevel, Blotato, RepliQ, ServiceNow, CapCut, Higgsfield, Runway, Screen Studio, Supercut, Charles Darwin University, NIT, the Australian Computer Society, Skillsoft, ISC2, CompTIA and ISACA are each organisation's own site icon or logo, taken from their official websites and stored in `assets/logos/`. They remain the property of their owners.
