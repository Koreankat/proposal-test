# Becker Roofing and Exteriors — Proposal Deploy Package

KCA proposal for Becker Roofing and Exteriors, ready to deploy to Vercel as a static site. The live build is bundled alongside the proposal so the cover laptop iframe and §1 phone-demo iframe both render the actual site directly from this repo (no external Vercel app required).

## What's inside

```
_deploy/
├── proposal/
│   ├── proposal.html        (the proposal)
│   ├── kca-logo.svg
│   ├── dean-blueprint.pdf   (loaded into the §4 SOP modal)
│   └── kca-assets/          (KCA branding + competitor screenshots)
├── build/
│   └── index.html           (the live BR Exteriors site — embedded in cover laptop + §1 phone-demo)
├── assets/
│   ├── logo/becker-roofing-primary.jpg
│   ├── photos/hero-keller-texas.jpg     (used in §3 GMB knowledge panel)
│   ├── gallery/gallery-*.jpg            (referenced by build/index.html)
│   ├── generated/hero-truck-keller-v4.png, mascot-cutout.png
│   └── team/sean-becker-portrait.jpg, sean-becker-cutout.png, andre-coursey.jpg, maru-iabichela.jpg, team-group-home-garden-show.jpg
├── vercel.json              (root → /proposal/proposal redirect, cleanUrls)
└── README.md
```

## How the iframes work

The proposal at `/proposal/proposal.html` references the build via relative paths:
- Cover laptop: `<iframe src="../build/index.html">` → resolves to `/build/index.html` on Vercel
- §1 phone-demo: `<iframe src="../build/index.html">` → resolves to `/build/index.html` on Vercel
- "Open Live Site" links: `../build/index.html` → resolves to `/build/index.html` on Vercel

The build at `/build/index.html` references images via `../assets/...` which resolves to `/assets/...` on Vercel.

## Deploy

Push to `main` on `Koreankat/proposal-test`. Vercel auto-deploys to the connected production URL.
