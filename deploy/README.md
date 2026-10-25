# Cursor Style Emoji origin

Public page: `https://cursor.style/emoji/`

Public PNG base: `https://cursor.style/emoji/v2.0.0/png`

The Kubernetes manifest adds a separate nginx Deployment, Service, ConfigMap, and exact-host `/emoji` ingress in the `cursor-style` namespace. Cloudflare remains the public CDN. The static origin proxies only the catalog's permitted paths to the existing public R2 asset domain, strips cookies and authorization headers, verifies upstream TLS, and sends cross-origin image headers. The PHP application is not involved in image requests.

Build the site with `npm run build:site`. Upload `demo-dist/index.html` to R2 key `emoji/index.html` and the hashed build files to `emoji/assets/`. Upload the reviewed PNG tree to `emoji/v2.0.0/png/`. The release manifest is at `emoji/v2.0.0/manifest.json`. Do not replace a versioned image with different content; use a new version path for changes.

The production GitOps resource lives in `wonchoe/k3s-cursor.style`, `cursor.style/overlays/prod/emoji-catalog.yaml`. Keep this reference manifest aligned when changing the origin. A ConfigMap edit requires a new pod because nginx reads its configuration at startup; increment the pod's config revision annotation when updating it.

The existing zone cache rules cache PNGs, CSS, and JavaScript. The origin also sends `Cache-Control: public, max-age=31536000, immutable` for versioned PNGs and hashed build files. HTML has a five-minute TTL. Error responses are not cached by the origin, and the zone's image rule gives 4xx/5xx a zero edge TTL.

Rollback the publication by reverting the two GitOps additions (the resource file and its kustomization entry). Stored R2 files and local masters remain available for recovery.
