# Cursor Style Emoji origin

Public page: `https://cursor.style/emoji/`

Public PNG base: `https://cursor.style/emoji/v2.0.0/png`

The Kubernetes manifest adds a separate nginx Deployment, Service, ConfigMap, and exact-host `/emoji` ingress in the `cursor-style` namespace. Cloudflare remains the public CDN. The static origin proxies only the catalog's permitted paths to the existing public R2 asset domain, strips cookies and authorization headers, verifies upstream TLS, and sends cross-origin image headers. The PHP application is not involved in image requests.

Build the site with `npm run build:site`. Upload `demo-dist/index.html` to R2 key `emoji/index.html` and the hashed build files to `emoji/assets/`. Upload the reviewed PNG tree to `emoji/v2.0.0/png/`. The release manifest is at `emoji/v2.0.0/manifest.json`. Do not replace a versioned image with different content; use a new version path for changes.

The production GitOps resource lives in `wonchoe/k3s-cursor.style`, `cursor.style/overlays/prod/emoji-catalog.yaml`. Keep this reference manifest aligned when changing the origin. A ConfigMap edit requires a new pod because nginx reads its configuration at startup; increment the pod's config revision annotation when updating it.

Cloudflare has a dedicated `cursor_style_emoji_immutable_v2` cache rule for GET/HEAD requests on `cursor.style`: versioned v2 PNGs, the v2 manifest, and hashed JavaScript/CSS under `/emoji/assets/` receive a one-year edge TTL. Browsers respect origin headers. The origin sends `Cache-Control: public, max-age=31536000, immutable` for these assets. HTML has a five-minute TTL. Both the edge rule and origin avoid caching 4xx/5xx responses. The rule was appended without changing the zone's eight existing cache rules.

Rollback the publication by reverting the two GitOps additions (the resource file and its kustomization entry). Stored R2 files and local masters remain available for recovery.
