# Cursor Style Emoji origin

Public page: `https://cursor.style/emoji/`

Public PNG base: `https://cursor.style/emoji/v2.0.0/png`

The Kubernetes manifest adds a separate nginx Deployment, Service, ConfigMap, and exact-host `/emoji` ingress in the `cursor-style` namespace. Cloudflare remains the public CDN. The static origin proxies only the catalog's permitted paths to the existing public R2 asset domain, strips cookies and authorization headers, verifies upstream TLS, and sends cross-origin image headers. The PHP application is not involved in image requests.

Build the site with `npm run build:site`. This builds the client and prerenders the same React page into HTML for every visitor. Upload the complete `demo-dist/` tree under R2 prefix `emoji/`, including the sitemap, plain-text guide, favicon and versioned social image. Upload assets before `index.html`. The reviewed PNG tree remains at `emoji/v2.0.0/png/`; the release manifest is at `emoji/v2.0.0/manifest.json`. Do not replace a versioned image with different content; use a new version path for changes.

The production GitOps resource lives in `wonchoe/k3s-cursor.style`, `cursor.style/overlays/prod/emoji-catalog.yaml`. Keep this reference manifest aligned when changing the origin. A ConfigMap edit requires a new pod because nginx reads its configuration at startup; increment the pod's config revision annotation when updating it.

Cloudflare has a dedicated `cursor_style_emoji_immutable_v2` cache rule on `cursor.style`: versioned v2 PNGs, the v2 manifest, and versioned JavaScript/CSS/PNG/SVG under `/emoji/assets/` receive a one-year edge TTL. Browsers respect origin headers. The origin sends `Cache-Control: public, max-age=31536000, immutable` for these assets. HTML has a five-minute TTL. Both the edge rule and origin avoid caching 4xx/5xx responses. Cloudflare's normal HTTP cache method restrictions still apply. The cache rule does not filter on the request method because Cloudflare documents that method filters can interfere with single-file purge. During the SEO release, this filter was also removed from the existing public HTML eligibility rule; its host/path exclusions and TTL policy were preserved. The other seven cache rules were unchanged.

Rollback the publication by reverting the two GitOps additions (the resource file and its kustomization entry). Stored R2 files and local masters remain available for recovery.

## Search and social previews

The canonical page is `https://cursor.style/emoji/`; `/emoji` and `/emoji/index.html` redirect there. `demo/index.html` holds title, description, canonical, Open Graph and Twitter metadata. `demo/seo.ts` holds JSON-LD and the visible FAQ text. Keep these descriptions and counts consistent with the real catalog. `demo/og-card.html` is the source for the reviewed 1200x630 social preview; publish changed previews under a fresh filename.

`demo/public/sitemap.xml` lists only the actual canonical landing page. The main site's default sitemap and footer also link to this page, and its root robots file declares both sitemaps. There are no invented locale URLs. `/emoji/guide.md` is an additional human-readable integration guide, not a search-engine requirement or a guarantee of AI citations.

After deployment, verify raw HTML includes the H1, guide and FAQ before JavaScript runs, then check hydration, canonical redirects, JSON-LD, social image MIME type and dimensions, robots rules and both sitemaps. Purge only updated mutable page URLs when needed. Never purge the whole zone for a catalog text update.
