# Camelback Roofing — Proposal Deploy Package

KCA proposal for Camelback Roofing, ready to deploy to Vercel as a static site.

## What's inside

```
_deploy/
├── proposal/
│   ├── proposal.html       (the proposal)
│   ├── kca-logo.svg
│   └── dean-blueprint.pdf  (loaded into the §4 SOP modal)
├── build/                  (Juan's v2 React site — embedded in cover laptop + §1 phone-demo)
├── assets/
│   ├── photos/home-hero-tile-roof.png   (used in §3 GMB knowledge panel)
│   └── logo/camelback-roofing-logo.png
├── vercel.json             (root → /proposal/proposal redirect, cleanUrls)
└── README.md
```

## Deploy with Vercel CLI

```bash
cd /Users/alijaafari/Desktop/website-factory/clients/camelbackroofing/_deploy

# First-time only — installs CLI globally if missing
npm install -g vercel

# Deploy a preview build
vercel

# Or deploy directly to production
vercel --prod
```

On the first run the CLI will:
1. Ask to log in (opens a browser OAuth flow — choose your Vercel account)
2. Ask to set up & deploy this directory — answer **Yes**
3. Ask which scope (your personal account or a team)
4. Ask the project name (suggest: `camelback-roofing-proposal`)
5. Detect framework: choose **Other** (it's static)
6. Skip build command (leave default)
7. Skip output directory (leave default — root)

After the first deploy, the project is linked. Subsequent `vercel --prod` from this folder pushes a new version.

## Expected URLs

- `https://<project>.vercel.app/` — redirects to `/proposal/proposal`
- `https://<project>.vercel.app/proposal/proposal` — the proposal (clean URL via `cleanUrls`)
- `https://<project>.vercel.app/build/` — Juan's v2 React Camelback site (loaded by the iframes)

## Updating the proposal

When you edit `clients/camelbackroofing/proposal/proposal.html`, copy the updated file into `_deploy/proposal/` and re-run `vercel --prod`:

```bash
cp ../proposal/proposal.html proposal/proposal.html
vercel --prod
```

## Why the structure mirrors the source folder

The proposal references `../build/`, `../assets/photos/...`, and `../assets/logo/...` (relative paths). Mirroring the same `proposal/`, `build/`, `assets/` layout in `_deploy/` keeps every path resolving correctly without modifying the proposal HTML.

## Notes

- Total deploy size: ~54 MB (most is `dean-blueprint.pdf` at 30 MB — well within Vercel hobby limits)
- The competitor screenshot thumbnails in §3 use a fallback gradient panel (the thum.io live screenshot endpoint is paywalled — fallback always shows)
- All KCA testimonials in §10 + §11 reference `kingcontractor.com/wp-content/uploads/...` (external CDN), no local copies needed
