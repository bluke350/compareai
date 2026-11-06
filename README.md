# CompareAI

A static, multi-page AI tool comparison site with real affiliate plumbing. No framework, no build step, no dependencies, no third-party trackers. Clone it, paste your affiliate links into one file, deploy free on Cloudflare Pages.

**Live pages:** homepage, 6 category comparisons (32 tools), 3 buyer guides, monetization hub, methodology/disclosure, 404.

**Live site:** https://compareai.wildbillsproplans.com · **Repo:** https://github.com/bluke350/compareai

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

Prefer a form? Open `monetize.html#builder`, paste your tracking URLs and copy the generated file — it writes this whole config for you, with validation.

Empty entries are safe: the link falls back to the vendor's own site and keeps `rel="sponsored noopener"`, so no button ever dead-ends.

The status panel at the top of `monetize.html` shows how many of the 16 open programs you have configured.

---

## Click tracking (built in)

Every click on a `data-aff` button is counted first-party and stored in Cloudflare KV — aggregate only, no cookies, no IP addresses, no third-party analytics.

- `functions/api/click.js` — receives the beacon and increments `t:<slug>`
- `functions/api/stats.js` — returns per-tool and per-category totals, gated by `STATS_KEY`
- `clicks.html` — private dashboard (`noindex`, not in the nav)

Set the key once, then open `/clicks` and paste it (it stays in that browser tab only):

```bash
printf '%s' 'a-long-random-key' | npx wrangler pages secret put STATS_KEY --project-name compareai
```

The KV binding lives in `wrangler.toml`. The free plan allows 1,000 writes/day and a click costs one write. Delete this section's files if you would rather count nothing.

---

## Deploy free: GitHub + Cloudflare Pages

### This repo: auto-deploy status

The live `compareai` project was created as a **Direct Upload** project, and Cloudflare does not allow converting one to Git (`8000069`). So this repo deploys through `.github/workflows/deploy.yml` on every push to `main` instead. It needs one repository secret:

1. Cloudflare dashboard → **My Profile → API Tokens → Create Token → Custom token**
2. Permission: **Account → Cloudflare Pages → Edit**; Account resources: your account
3. Create, then copy the token (shown once)
4. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
5. Name `CLOUDFLARE_API_TOKEN`, paste the value, save

Until the secret exists the workflow runs but skips the deploy with a warning. Once it exists, every push to `main` publishes to https://compareai.wildbillsproplans.com. Use **Actions → Deploy to Cloudflare Pages → Run workflow** for the first run.

The alternative is a *new* Git-connected Pages project in the dashboard (Workers & Pages → Create → Pages → Connect to Git). That gives true dashboard Git integration but a different `*.pages.dev` URL, because an existing direct-upload project cannot be attached to a repo.

### Option A — Git integration (new projects)

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
- `_redirects` is intentionally **not** included. Cloudflare Pages' automatic HTML handling already serves extensionless paths, and an explicit alias file created a 308/301 loop on `/monetize.html` and `/about.html`. Internal links use the `.html` paths, which work as-is. Add your own aliases only if you move to a host without HTML handling.
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
├── seo-tools.html             # 5 tools: Semrush, SE Ranking, Frase, Ahrefs, Otterly
├── jasper-vs-writesonic.html  # buyer guide
├── synthesia-vs-heygen.html   # buyer guide
├── elevenlabs-vs-murf.html    # buyer guide
├── monetize.html              # program directory, earnings calc, setup, deploy
├── about.html                 # methodology, disclosure, program legend, changelog
├── 404.html
├── clicks.html                # private dashboard for click counts
├── functions/api/click.js     # counts one outbound click in KV
├── functions/api/stats.js     # aggregated counts, STATS_KEY required
├── wrangler.toml              # KV binding for the Functions
├── .github/workflows/deploy.yml  # push-to-deploy workflow
├── _headers                   # Cloudflare Pages security + cache headers
├── assets/
│   ├── css/style.css          # design system, dark + light themes
│   └── js/
│       ├── data.js            # 32-tool dataset (pricing, pros/cons, program terms)
│       ├── affiliates.js      # ← YOUR LINKS GO HERE
│       ├── app.js             # all behaviour
│       └── clicks.js          # dashboard logic
└── README.md
```

---

## What actually works (no mock UI)

| Feature | How |
|---|---|
| Affiliate links | `data-aff` attributes resolved from `AFFILIATE_LINKS` at load; safe fallback when unset |
| Compare tray | Pick up to 3 tools on any page, side-by-side dialog, persists in `localStorage` |
| Search | Homepage searches all 32 tools by name, category, tagline, feature |
| Filters / sorting | Category chips + price/score/A–Z sorting, per page |
| Cost calculators | Per-seat, per-month annual cost estimates from real entry prices |
| Earnings calculator | Commission-window math per program, with honest caveats |
| Theme | Dark/light, persisted |
| Monetization monitor | Live count of configured links on `monetize.html` |
| Click stats | First-party KV counters per tool and category, private dashboard at `/clicks` |
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

## SEO baseline

The site is a static multi-page build, so the SEO surface is files in the repo root:

- `robots.txt` — allows everything except `/api/` and `/clicks`, and points at the sitemap.
- `sitemap.xml` — the 12 indexable URLs with `lastmod`. Regenerate it whenever a page is added or renamed.
- **Canonicals** — every indexable page declares an absolute canonical. All of them, plus `og:url`, the JSON-LD `url`/`item` values and the sitemap, use the base `https://compareai.wildbillsproplans.com`. If you attach a custom domain, change that one base everywhere (a find/replace over the HTML heads, `sitemap.xml` and `robots.txt`) before deploying.
- **Structured data** — `Organization` + `WebSite` on the home page, `BreadcrumbList` on every page with crumbs, `ItemList` on the six category pages, `FAQPage` generated from the visible `<details>` blocks, `AboutPage` on about, `Article` on the three guides.
- **Social cards** — one shared 1200×630 `assets/img/og.png` is referenced by `og:image` and `twitter:image`.
- **Noindex** — `404.html` and `clicks.html` carry `noindex` meta; `/clicks` and `/api/*` also send `X-Robots-Tag`.

Cloudflare Pages 308-redirects `/writing-tools.html` to `/writing-tools`, so the extensionless URL is the canonical one. Internal links, canonicals, `og:url`, JSON-LD `url` values and the sitemap all use it — linking to `.html` directly would put a redirect in front of every visit.
