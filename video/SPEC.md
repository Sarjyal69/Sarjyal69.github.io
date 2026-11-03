GOAL:    a recruiter scrolling LinkedIn understands in 27 s that Shuvang keeps real systems running under pressure, is a 2025 IT graduate, and is available for IT roles in Darwin; ends wanting to email.
OUTPUT:  HyperFrames, 1080 x 1080, 30 fps (LinkedIn feed square)
TIME:    27 s x 30 = 810 frames; silent (LinkedIn autoplays muted; no music source signed in)
LOOK:    ground #ffffff flat with a 1px #e3e3e3 dot grid at 40 px (the site's paper); ink #111111; accent #1d4ed8 on ONE thing per shot;
         display Bricolage Grotesque 800, wdth 88, -3% tracking (the site's display face); body Atkinson Hyperlegible Next 400/700; terminal text JetBrains Mono 700.
         medium: the site's black-and-white terminal window (#0b0b0b body, 16 px radius, 3 traffic-light dots, 1 px #2a2a2a edge), paper cards with a 0 18px 40px -18px rgba(0,0,0,.35) shadow.
OBJECTS: POS terminal screen (terminal window with a status line), a "try this first" checklist card, a stack of guide pages with "15 approved", a chat bubble -> 3 workflow nodes -> spreadsheet row, CDU and ACS logos on a degree card, the terminal portrait, email line.
MOTION:  camera (world transform) moves: 27 frames, power3.inOut; enters: 12 frames power3.out from 24 px; typing: steps, 2 frames per character; ticks: 6 frames back.out(2); staggers 4 frames.
SHOTS:
  0-150   (0-5 s)   frame 0 already shows the terminal with "12:04 · lunch rush". Types "$ status pos-2" then "OFFLINE" in accent. Caption "When it breaks mid-rush," (28+ px).
  150-300 (5-10 s)  camera pushes right to the checklist: Diagnose it / Fix the common ones on the spot / Log and escalate the rest tick in; POS line flips to "ONLINE". Caption "I'm the one who fixes it. 4 years at McDonald's and Nando's." with both logos.
  300-435 (10-14.5) camera pans down to the guide stack; "15" lands in accent; caption "15 approved step-by-step guides, so it stays fixed."
  435-570 (14.5-19) camera pans left to automation: chat bubble -> nodes light in order -> sheet row fills; caption "IT & Automation Intern at DGK: workflows that do the boring parts."
  570-690 (19-23)   camera pans to the degree card: "Bachelor of IT, Charles Darwin University, 2025" + "ACS Professional Year (ICT)" with logos.
  690-810 (23-27)   camera pulls back to the portrait window; "Hiring for IT in Darwin?" / "Let's talk." (accent on "Let's talk."), email and sarjyal69.github.io; holds 2 s as a poster.
BANNED:  dark void ground, glow, gradients, glass cards, particles, everything centred, everything fading up, corner labels/HUD, three cards in a row, logo docked in a corner, invented numbers or claims.
QA:      frames 0, 120, 270, 400, 520, 640, 800: each readable as a poster, accent on one thing, text >= 28 px, nothing outside the 90% safe box.
