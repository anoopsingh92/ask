# Architecture & Technical Design Specification
**Project:** Portfolio, Product Catalogue & Case Studies (`anoopsingh92.github.io/ask/`)  
**Engineer:** Anoop Singh, Senior Software Engineer  
**Core Stack:** Vanilla ESNext, modern CSS3, Vite 8 (multi-page), GSAP ScrollTrigger (on demand), GitHub Pages  
**Document Version:** 2.0.0 (November 2026)

---

## 1. System Overview

A static multi-page site that pairs high visual fidelity with a minimal runtime. Every route is a real HTML file, shared chrome (head, header, footer) is injected at build time, and client JavaScript only adds behaviour on top of content that is already readable.

### Core tenets
1. **Content first paint:** nothing is hidden behind JavaScript. Theme is resolved by a tiny inline script before first paint; hero text, navigation and cards exist in the HTML.
2. **Deterministic delivery:** one CSS bundle (`assets/bundle.min.css`) and fixed-name JS entries (`assets/[name].min.js`).
3. **Clean-path routing:** folders with `index.html` (`/about/`, `/products/flexi-style/`), no `.html` in public URLs.
4. **Environment-agnostic base path:** `BASE_PATH` selects `/ask/` (GitHub Pages) or `/` (custom domain); runtime code resolves the root with `getAppRoot()`.
5. **One design system, two shells:** listing pages share `listing.css`; detail pages share `detail.css`.

---

## 2. Deployment topology

```
git push (main | master | development)
        |
        v
GitHub Actions  (.github/workflows/build-minify.yml)
  - Node 22, npm ci (falls back to npm install)
  - BASE_PATH=/ask/ npm run build   (Vite + vite-plugin-html-inject)
  - upload-pages-artifact (dist/)
        |
        v
actions/deploy-pages  ->  https://anoopsingh92.github.io/ask/
```

`dist/` contains 17 HTML entries (home, about, journey, 404, 2 listings, 5 products, 6 case studies), the hashed-free bundle files and everything from `public/`.

---

## 3. Structural patterns

### 3.1 Build-time component injection
`vite-plugin-html-inject` replaces `<load src="/src/partials/*.html" />` with the partial markup: `head.html` (icons, manifest, fonts, theme script, JSON-LD), `header.html` (navigation, theme toggle, mobile menu button) and `footer.html`.

### 3.2 Multi-page entry map
`vite.config.js` lists every page under `build.rollupOptions.input`. A matching `validPaths` array drives the dev-server 404 middleware, so a new page must be added in both places (and in `sitemap.xml` / `llms.txt`).

### 3.3 Base-path normalisation
- Build: `base` is `process.env.BASE_PATH || './'`.
- Runtime: `getAppRoot()` (exported from `src/js/script.js`) derives the site root from `location.pathname`. It fixes header links, the `#me` redirect, the active-menu logic and the image URLs rendered by the case-study listing.

### 3.4 Shared CSS layers
Imported in this order from `src/main.js` (later layers win):

| File | Responsibility |
|---|---|
| `style.css` | Design tokens (`--ac`, `--fg`, `--card`, ...), nav, hero, homepage sections, shared components |
| `products.css` | Product-detail content blocks (lists, code, sidebar rows, command chip) |
| `ads.css` | Ad and affiliate slots on detail pages |
| `awards.css` | Achievements section on the About page and the certificate viewer |
| `recommendations.css` | "What people say" cards |
| `skillmap.css` / `journey.css` | Homepage skill map and the career timeline |
| `listing.css` | Prefix `ls-`: page shell, hero, tabs, toolbar, **flexbox** grid / list cards, empty state |
| `detail.css` | Breadcrumb, detail hero, stats, numbered sections, CTA, previous / next, flex product layout |
| `responsive.css` | Mobile menu, touch targets, safe areas, phone / landscape / 4K adjustments |

Grids on listing pages are flexbox: a `--ls-cols` custom property (3, 2 or 1) sets each card's width as `(100% - gaps) / cols`, and list view sets it to 1.

---

## 4. Client runtime

### 4.1 `src/js/script.js` (all pages)
- **Theme manager:** toggle persisted in `localStorage`; initial value set inline in `head.html`.
- **Mobile menu:** `#menu` toggles `nav.is-open`; closes on link click, Escape, outside click and when the viewport grows past 1100px.
- **Active navigation:** `updateActiveNav()` highlights the current page link from the first URL segment, or runs a scroll-spy on the homepage. It is throttled with `requestAnimationFrame` and also runs on load, `hashchange` and `pageshow`.
- **Canvas particles:** the grid is drawn once, redrawn while points are settling or the pointer was active in the last 1.5s, paused when the tab is hidden, and recoloured on theme change. Setup is deferred with `requestIdleCallback`.
- **On-demand GSAP:** pages containing `.about-pinned-section` load GSAP and ScrollTrigger from jsDelivr after the window `load` event (during idle time). Other pages never request them. The old "earlier work" section was removed from the homepage; those sites live in the About page's project directory, and the homepage links there from "recent projects".
- **Reveals and counters:** one `IntersectionObserver` adds `.in` to `.rv` elements and animates `[data-n]` counters.

### 4.2 Listings
- `src/main.js` renders the case-study listing from `case-studies-data.js` (filter pills with counts, search, grid / list toggle, empty state). The first three images load eagerly, the first with `fetchpriority="high"`.
- `src/products.js` adds the same behaviour to the static product cards and an extra **Free / Premium** tab group (`data-p`). The grid / list choice is shared by both listings through `localStorage["ls-view"]`.

### 4.3 Skill map and career journey
- `src/js/skills-data.js` holds the 14 skill groups and 90 skills (the same lists as the About page toolkit) plus project links. `skill-map.js` renders the map into `#skill-map` and is imported dynamically by `main.js` when the section is within 400px of the viewport, so it costs nothing on first load. The section ships with a readable, crawlable list of the same skills in the HTML; the map replaces it once loaded. The old "skillset & tools" pills section was merged into it. "Pairs with" is computed from shared projects.
- `/journey/` is a static, crawlable `<ol class="jt">` timeline (HTML first). `journey.js` only adds the type filters and the progress highlight.

- `src/js/recommendations.js` holds the eight LinkedIn recommendations and renders them into `#recommendations` when the section is within 400px of the viewport; long quotes are clamped and expand with a "Read more" button. `case-studies-data.js` is likewise imported only on the case-study listing.

### 4.4 Ads and affiliate slots
Detail pages ship static "Advertise here" placeholders (`.ad-section`, `.ad-slot[data-slot]`). `src/js/ads.js` is imported only when a slot exists and replaces a placeholder with a sponsor from `src/js/ads-data.js`, or fills the "Recommended tools" list with matching affiliates. Slot heights are reserved in `ads.css`, links use `rel="sponsored nofollow noopener"`, and every paid element carries a visible label.

### 4.5 Service worker
`public/sw.js` implements network-first navigation with an offline fallback and stale-while-revalidate for assets. It is **not registered** by default.

---

## 5. File layout

```text
anoopsingh92/
├── .github/workflows/build-minify.yml
├── index.html  404.html  about/index.html
├── products/            index.html + 5 product folders
├── case-studies/        index.html + 6 case-study folders
├── public/              assets/, favicon.ico, manifest.json, sw.js,
│                        robots.txt, sitemap.xml, llms.txt, _redirects
├── src/
│   ├── main.js  products.js
│   ├── css/     style.css  products.css  listing.css  detail.css  responsive.css
│   ├── js/      script.js  case-studies-data.js  products-data.js
│   └── partials/ head.html  header.html  footer.html
├── vite.config.js  package.json  package-lock.json
├── LICENSE (MIT)  README.md  project_architecture_and_technical_documentation.md
```

---

## 6. Build lifecycle

| Step | Tool | Purpose |
|---|---|---|
| Entry resolution | Vite multi-page | Every HTML file in `rollupOptions.input` becomes an entry |
| Component injection | `vite-plugin-html-inject` | Inlines head / header / footer partials |
| Bundling | Rolldown (Vite 8) | One minified CSS file and per-entry JS files |
| Static pass-through | `public/` | Copied to `dist/` untouched |
| Dev 404 | Custom Vite plugin | Mirrors production 404 behaviour locally |

---

## 7. SEO, discovery and hosting files

| File | Notes |
|---|---|
| `public/sitemap.xml` | All 16 pages plus the resume PDF, absolute `/ask/` URLs |
| `public/robots.txt` | Allow all, links the sitemap |
| `public/llms.txt` | Markdown profile for AI agents: role, products, case studies, profiles |
| `public/manifest.json` | Relative `start_url` and `scope` so it works under `/ask/` |
| `public/_redirects` | Only used on Netlify / Cloudflare Pages; ignored by GitHub Pages |

When pages are added or renamed, update the sitemap, `llms.txt`, `vite.config.js` and the data files together.

---

## 8. Performance and quality

Measures taken for Lighthouse 100:
- No hidden-until-JS gate; theme applied synchronously, so first paint is styled.
- Hero heading, role line and navigation are server-rendered HTML; letter animation is CSS only.
- Below-the-fold portrait is lazy (it was previously preloaded at high priority).
- GSAP (about 100 KB) and the jsDelivr connection are removed from every page that does not pin sections.
- Canvas rendering stops when idle; scroll handlers are `requestAnimationFrame`-throttled; per-frame `getComputedStyle` removed.
- Fonts load asynchronously with `display=swap`; images carry explicit `width` / `height`.

SEO hygiene: a small `html-minify` plugin in `vite.config.js` collapses whitespace and comments in every served page (raising the text-to-HTML ratio above 25%), meta descriptions stay under about 140 characters, Twitter cards fall back to the Open Graph tags, and marquee tickers are written once in HTML and repeated by `script.js` so keywords are not duplicated in the markup.

Dev-only note: `npm run dev` serves unbundled modules and injects CSS through JavaScript, so a small plugin in `vite.config.js` hides the page until `html.is-ready` is set to avoid a flash of unstyled HTML. Production builds link the stylesheet in `<head>` and do not need it. **Never run Lighthouse against `localhost:5173`**; use `npm run build` and `npm run preview`.

Targets: Performance 100, Accessibility 100, Best Practices 100, SEO 100. Verify with Lighthouse in an incognito window on the deployed URL, using the mobile profile.
