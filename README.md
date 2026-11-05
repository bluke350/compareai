# CompareAI

A static, multi-page AI tool comparison site with real affiliate plumbing. No framework, no build step, no dependencies, no trackers. Clone it, paste your affiliate links into one file, deploy free on Cloudflare Pages.

**Live pages:** homepage, 5 category comparisons (27 tools), monetization hub, methodology/disclosure, 404.

---

## Quick start (local)

```bash
# from this folder — any static server works
python3 -m http.server 8080
# open http://localhost:8080
```

Opening `index.html` directly also works, but a local server is better because `localStorage` behaves consistently on `http://`.

---

## Add your affiliate links (the only edit that matters)

1. Apply to a program from `monetize.html` — **all of them are free to join**.
2. Copy the tracking URL from your dashboard.
3. Paste it into `assets/js/affiliates.js`:

```js
window.AFFILIATE_LINKS = {
  jasper:     "https://jasper.ai/?fpr=YOURID",
  elevenlabs: "https://elevenlabs.io/?affiliate_id=YOURID",
  // ...
};
```

Reload. Every `data-aff="jasper"` link now points at your URL. Nothing else to change — no HTML edits, no rebuild.

Empty entries are safe: the link falls back to the vendor's own site and keeps `rel="sponsored noopener"`, so no button ever dead-ends.

The status panel at the top of `monetize.html` shows how many of the 13 open programs you have configured.

---

## Deploy free: GitHub + Cloudflare Pages

### Option A — Git integration (recommended)

```bash
git init
git add .
git commit -m "CompareAI comparison site"

# create an empty repo on github.com named compareai, then:
git remote add origin https://github.com/YOURNAME/compareai.git
git branch -M main
git push -u origin main
```

Then in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**
2. Select the repo
3. Framework preset: **None**
4. Build command: **(leave empty)**
5. Build output directory: **/**
6. **Save and Deploy**

You get `https://<project>.pages.dev` with free HTTPS. Every push to `main` redeploys.

If you have the GitHub CLI, steps 1–2 above collapse to:

```bash
gh repo create compareai --public --source=. --push
```

### Option B — Wrangler CLI (one-off publish)

```bash
npm install -g wrangler
wrangler login
wrangler pages project create compareai --production-branch main
wrangler pages deploy . --project-name compareai
```

Cloudflare Pages free plan: 500 builds/month, unlimited requests and bandwidth, unlimited static sites. GitHub free repos are free. **The only optional cost in this project is a custom domain.**

### Notes

- `_headers` sets CSP, nosniff, referrer policy and cache rules. Cloudflare Pages applies it automatically.
- `_redirects` adds extensionless aliases (`/writing`, `/voice`, …). If your host is configured to strip `.html` and you see a redirect loop, delete `_redirects` — internal links all use the `.html` paths and work regardless.
- GitHub Pages works too, but ignores `_headers` and `_redirects`.

---

## File structure

```
.
├── index.html                 # hub: categories, live search, shortlist
├── writing-tools.html         # 6 tools
├── image-generators.html      # 5 tools
├── video-tools.html           # 6 tools
├── voice-tools.html           # 4 tools
├── coding-tools.html          # 6 tools
├── monetize.html              # program directory, earnings calc, setup, deploy
├── about.html                 # methodology, disclosure, program legend, changelog
├── 404.html
├── _headers                   # Cloudflare Pages security + cache headers
├── _redirects                 # clean URL aliases
├── assets/
│   ├── css/style.css          # design system, dark + light themes
│   └── js/
│       ├── data.js            # 27-tool dataset (pricing, pros/cons, program terms)
│       ├── affiliates.js      # ← YOUR LINKS GO HERE
│       └── app.js             # all behaviour
└── README.md
```

---

## What actually works (no mock UI)

| Feature | How |
|---|---|
| Affiliate links | `data-aff` attributes resolved from `AFFILIATE_LINKS` at load; safe fallback when unset |
| Compare tray | Pick up to 3 tools on any page, side-by-side dialog, persists in `localStorage` |
| Search | Homepage searches all 27 tools by name, category, tagline, feature |
| Filters / sorting | Category chips + price/score/A–Z sorting, per page |
| Cost calculators | Per-seat, per-month annual cost estimates from real entry prices |
| Earnings calculator | Commission-window math per program, with honest caveats |
| Theme | Dark/light, persisted |
| Monetization monitor | Live count of configured links on `monetize.html` |
| Deep links | `writing-tools.html#jasper` scrolls to and highlights the card |

Everything is progressive: if JavaScript fails, the pages still render, tables still read, and links still go to the right vendor.

---

## Content accuracy

- Pricing and affiliate terms were checked against vendor and network pages in **November 2026**.
- Programs are labelled `open`, `verify`, `closed` or `none`. Do not upgrade a `verify` to a number without checking the vendor dashboard.
- Two claims worth repeating: **Cursor has no cash affiliate program** (referral credits closed 23 July 2026) and **GitHub Copilot has no public program**. Several directories still publish invented rates for both.
- **Canva** and **Leonardo AI** closed their programs; they remain in comparisons for reader value.
- These are desk-researched buying guides, not lab benchmarks. The site never claims hands-on testing it did not do.

Re-check prices before publishing an update; AI tools repriced repeatedly during 2026.

---

## Add a tool

1. Add an object to `window.TOOLS` in `assets/js/data.js` (slug, name, category, price, priceNum, rating, pros, cons, affiliate metadata).
2. Add a card to the relevant page with `id="<slug>"`, `data-compare="<slug>"`, `data-aff="<slug>"`, `data-price`, `data-rating`.
3. Add the slug to `AFFILIATE_LINKS` in `assets/js/affiliates.js`.

## Add a category

1. Copy an existing comparison page and replace cards/table.
2. Add the nav link to every page's header and footer (plain HTML — no includes).
3. Add the category card to `index.html`.

---

## Licence / attribution

Content and code in this project are yours to use and modify. Vendor names and logos belong to their owners. Affiliate programs may prohibit brand bidding and income claims — read each program's terms before promoting it.
