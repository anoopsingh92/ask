# Anoop Singh: Senior Software Engineer & Drupal Specialist

[![Portfolio](https://img.shields.io/badge/Portfolio-Live_Site-0369a1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://anoopsingh92.github.io/ask/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anoopsingh92/)
[![Drupal](https://img.shields.io/badge/Drupal-Community_Profile-0678be?style=for-the-badge&logo=drupal&logoColor=white)](https://www.drupal.org/u/anoopsingh92)
[![The DropTimes](https://img.shields.io/badge/The_DropTimes-Contributor-ff4081?style=for-the-badge&logo=rss&logoColor=white)](https://www.thedroptimes.com/people/40250/anoopsingh92)

Personal portfolio, product catalogue and case-study library of **Anoop Singh**, Senior Software Engineer at NextOpcode Consulting LLP with 13+ years of experience in front-end architecture, responsive UI/UX, decoupled CMS implementations and custom Drupal theming (Drupal 7 to 11).

Live site: **https://anoopsingh92.github.io/ask/**

Built with semantic **HTML5**, modern **CSS3** and vanilla **ESNext JavaScript**, bundled by **Vite** as a multi-page site. **GSAP ScrollTrigger** is loaded on demand, only on pages that use pinned sections.

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage: hero, about, skills, experience, recommendations, contact |
| `/about/` | Full career story, education, certifications, awards |
| `/products/` | **My Products & Apps** listing: Free / Premium tabs, category filters, search, grid / list view |
| `/products/<slug>/` | Product detail: screenshot, install steps, downloads, spec sidebar, case-study link, previous / next |
| `/case-studies/` | Case-study listing with filters, search and grid / list view |
| `/case-studies/<slug>/` | Case-study detail: stats, numbered sections, tech chips, product link, previous / next |
| `/404.html` | Not-found page |

Products: `flexi-style`, `flexistyle-bootstrap`, `flexistyle-bootstrap-scss`, `flexistyle-dxp`, `workpulse`.
Case studies: the same five, plus `anoop-singh-portfolio`.

---

## Features

- **Performance-first**: the page is visible from the first paint (no JavaScript gate), hero text is real HTML, the canvas background only renders while the pointer moves, and GSAP is fetched after load and only where needed.
- **Shared design system**: one listing stylesheet (`listing.css`) powers both the products and case-study listings with a flexbox grid; one detail stylesheet (`detail.css`) powers every detail page. No inline CSS on these pages.
- **Responsive on every device**: collapsible mobile menu up to 1100px, fluid type, 3 / 2 / 1 column grids, touch-sized controls, safe-area insets and a wide-screen layout from 1700px.
- **Adaptive themes**: dark / light toggle that respects `prefers-color-scheme` and is applied before first paint.
- **Accessible**: skip links, ARIA labels and live regions, visible focus states, `prefers-reduced-motion` support.
- **SEO and AI discovery**: Open Graph and Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt` and `llms.txt`.
- **Environment-agnostic**: `BASE_PATH` switches between subfolder hosting (`/ask/`) and a root domain.

---

## Project structure

```text
anoopsingh92/
├── .github/workflows/build-minify.yml   # Build with Vite and deploy to GitHub Pages
├── index.html                           # Homepage
├── 404.html
├── about/index.html
├── products/
│   ├── index.html                       # Listing
│   └── <slug>/index.html                # 5 product pages
├── case-studies/
│   ├── index.html                       # Listing
│   └── <slug>/index.html                # 6 case-study pages
├── public/                              # Copied untouched to dist/
│   ├── assets/img/, Anoop-Singh-Resume.pdf
│   ├── favicon.ico, manifest.json, sw.js
│   └── robots.txt, sitemap.xml, llms.txt, _redirects
├── src/
│   ├── main.js                          # Vite entry: CSS imports, listing renderer
│   ├── products.js                      # Products listing logic (tabs, filters, search, view)
│   ├── css/
│   │   ├── style.css                    # Tokens, layout, homepage and shared components
│   │   ├── products.css                 # Product detail content styles
│   │   ├── listing.css                  # Global listing / grid styles (products + case studies)
│   │   ├── detail.css                   # Global detail-page styles
│   │   └── responsive.css               # Mobile menu, touch targets, device tweaks (loaded last)
│   ├── js/
│   │   ├── script.js                    # Theme, menu, scroll, canvas, GSAP loader, nav state
│   │   ├── case-studies-data.js         # Case-study records used by the listing
│   │   └── products-data.js             # Product records and download counters
│   └── partials/                        # head / header / footer injected at build time
├── vite.config.js
└── package.json
```

---

## Local development

Requires **Node.js 20.19+** (Node 22 recommended).

```bash
git clone https://github.com/anoopsingh92/ask.git
cd ask
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR and a custom 404 route |
| `npm run build` | Production build into `dist/` (base `./`) |
| `BASE_PATH=/ask/ npm run build` | Production build for GitHub Pages |
| `npm run preview` | Serve `dist/` locally |

On Windows PowerShell use `$env:BASE_PATH="/ask/"; npm run build`.

---

## Deployment

Pushing to `main`, `master` or `development` runs `.github/workflows/build-minify.yml`, which installs dependencies, builds with `BASE_PATH=/ask/` and publishes `dist/` to GitHub Pages. In the repository settings, set **Pages, Source** to **GitHub Actions**.

---

## Adding content

**New case study**
1. Copy a folder in `case-studies/` and edit the page.
2. Add a record to `src/js/case-studies-data.js` (`group` must be `open-source`, `headless`, `saas` or `performance`).
3. Register the page in `vite.config.js` (`input` and `validPaths`) and add it to `public/sitemap.xml` and `public/llms.txt`.

**New product**
1. Copy a folder in `products/` and edit the page.
2. Add a `.ls-card` to `products/index.html` with `data-c` (category) and `data-p` (`free` or `premium`).
3. Register it in `vite.config.js`, `public/sitemap.xml` and `public/llms.txt`.

---

## Performance notes

- No render-blocking JavaScript; the module entry is deferred.
- Web fonts load asynchronously with `font-display: swap`.
- First-row listing images load eagerly, the rest lazily, all with explicit dimensions to avoid layout shift.
- The service worker in `public/sw.js` is intentionally **not registered**; register it only if offline support is wanted.

---

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Anoop Singh.
