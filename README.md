<p align="center">
  <a href="https://cursor.style/emoji/">
    <img src="https://raw.githubusercontent.com/wonchoe/emoji-composer/main/docs/images/cover.png" alt="Emoji Composer by Cursor Style — Life’s better with a little feeling. Original 3D emoji in a warm ivory and lime catalog." width="1200">
  </a>
</p>

<h1 align="center">Little icons. All the feelings.</h1>

<p align="center">
  Original 3D emoji, a React picker & message composer, and a PHP catalog.<br>
  Made with feeling by <a href="https://cursor.style/">Cursor Style</a>.
</p>

<p align="center">
  <a href="https://cursor.style/emoji/"><img src="https://img.shields.io/badge/EXPLORE-THE_COLLECTION-d6ef78?style=flat-square&labelColor=252820&color=d6ef78" alt="Explore the collection"></a>
  <a href="https://github.com/wonchoe/emoji-composer/releases"><img src="https://img.shields.io/github/v/release/wonchoe/emoji-composer?style=flat-square&labelColor=252820&color=d6ef78" alt="Latest release"></a>
  <a href="https://www.npmjs.com/package/emoji-composer"><img src="https://img.shields.io/npm/v/emoji-composer?style=flat-square&labelColor=252820&color=d6ef78" alt="npm version"></a>
  <a href="https://packagist.org/packages/cursor-style/emoji"><img src="https://img.shields.io/packagist/v/cursor-style/emoji?style=flat-square&labelColor=252820&color=d6ef78" alt="Packagist version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-d6ef78?style=flat-square&labelColor=252820" alt="MIT license"></a>
</p>

<p align="center">
  <a href="https://cursor.style/emoji/">Live collection</a> &nbsp; · &nbsp;
  <a href="https://cursor.style/emoji/#playground">Try the composer</a> &nbsp; · &nbsp;
  <a href="https://www.npmjs.com/package/emoji-composer">npm</a> &nbsp; · &nbsp;
  <a href="https://packagist.org/packages/cursor-style/emoji">Packagist</a> &nbsp; · &nbsp;
  <a href="docs/usage.md">Usage guide</a> &nbsp; · &nbsp;
  <a href="https://github.com/wonchoe/emoji-composer/releases/tag/v1.0.0">Downloads</a>
</p>

---

| A whole world of expression | Every shade, every little detail | From tiny to extra expressive |
| :---: | :---: | :---: |
| **3,963 artworks** | **5 skin tones + original** | **8 PNG sizes** |
| 1,923 base emoji · Unicode Emoji 18.0 | 2,040 exact tone sequences | 16 · 24 · 32 · 64 · 128 · 256 · 512 · 1024 px |

## Pick your mood

A searchable picker with categories, real tone variants, lazy image loading, and a friendly keyboard shortcut. Drop the composer into a chat, comment box, or editor: the chosen emoji lands at the text cursor.

<p align="center">
  <a href="https://cursor.style/emoji/"><img src="https://cursor.style/emoji/v2.0.0/png/128/1f60e.png" width="80" height="80" alt="Stay cool — sunglasses"></a>
  <a href="https://cursor.style/emoji/"><img src="https://cursor.style/emoji/v2.0.0/png/128/1f496.png" width="80" height="80" alt="A little love — sparkling heart"></a>
  <a href="https://cursor.style/emoji/"><img src="https://cursor.style/emoji/v2.0.0/png/128/1f44b.png" width="80" height="80" alt="Hello there — waving hand"></a>
  <a href="https://cursor.style/emoji/"><img src="https://cursor.style/emoji/v2.0.0/png/128/1f951.png" width="80" height="80" alt="Good taste — avocado"></a>
  <a href="https://cursor.style/emoji/"><img src="https://cursor.style/emoji/v2.0.0/png/128/1f47b.png" width="80" height="80" alt="Just boo — ghost"></a>
  <a href="https://cursor.style/emoji/"><img src="https://cursor.style/emoji/v2.0.0/png/128/1f525.png" width="80" height="80" alt="Fire"></a>
</p>

## React, meet a little personality

Requires React 18+ and React DOM 18+.

```bash
npm install emoji-composer
```

```tsx
import { useState } from "react";
import { EmojiComposer } from "emoji-composer";
import "emoji-composer/styles.css";

export function MessageBox() {
  const [message, setMessage] = useState("");

  return (
    <EmojiComposer
      value={message}
      onChange={setMessage}
      placeholder="Say it with a little feeling…"
    />
  );
}
```

Just need the picker?

```tsx
import { EmojiPicker } from "emoji-composer";
import "emoji-composer/styles.css";

<EmojiPicker onSelect={({ text, assetUrl }) => console.log(text, assetUrl)} />;
```

The composer supports controlled and uncontrolled values. Its popover follows the viewport, closes on Escape or outside interaction, and restores the text cursor after selection. The standalone picker also supports Ctrl/⌘ K search.

## PHP feels included

Requires PHP 8.1+ and `ext-json`. Works with Laravel, Symfony, or plain PHP.

```bash
composer require cursor-style/emoji
```

```php
require __DIR__ . '/vendor/autoload.php';

use CursorStyle\Emoji\EmojiCatalog;

$emoji = new EmojiCatalog();

$url = $emoji->imageUrl('👋', 128, 'medium');
$matches = $emoji->find('waving');
```

Both packages share the same catalog, exact Unicode tone mapping, and artwork URLs.

## Every shade is its own artwork

Each supported tone is a separately generated transparent PNG. Original masters are preserved. Mixed-tone Unicode sequences are available by their full sequence ID.

<p align="center">
  <img src="https://cursor.style/emoji/v2.0.0/png/128/1f44b.png" width="72" height="72" alt="Waving hand — original">
  <img src="https://cursor.style/emoji/v2.0.0/png/128/skin-1f44b-1f3fb.png" width="72" height="72" alt="Waving hand — light skin tone">
  <img src="https://cursor.style/emoji/v2.0.0/png/128/skin-1f44b-1f3fc.png" width="72" height="72" alt="Waving hand — medium-light skin tone">
  <img src="https://cursor.style/emoji/v2.0.0/png/128/skin-1f44b-1f3fd.png" width="72" height="72" alt="Waving hand — medium skin tone">
  <img src="https://cursor.style/emoji/v2.0.0/png/128/skin-1f44b-1f3fe.png" width="72" height="72" alt="Waving hand — medium-dark skin tone">
  <img src="https://cursor.style/emoji/v2.0.0/png/128/skin-1f44b-1f3ff.png" width="72" height="72" alt="Waving hand — dark skin tone">
</p>

## One URL. Ready anywhere.

Artwork is delivered through Cloudflare on the main **cursor.style** domain. Versioned PNGs are immutable, support cross-origin use, and have transparent backgrounds.

```html
<img
  src="https://cursor.style/emoji/v2.0.0/png/128/1f44b.png"
  width="64"
  height="64"
  alt="Waving hand"
/>
```

Use the helper for tones and exact variants:

```ts
import { getEmojiAssetUrl, getEmojiVariantById } from "emoji-composer";

getEmojiAssetUrl("👋", { size: 256, skinTone: "medium" });
getEmojiVariantById("1faf1-1f3fb-200d-1faf2-1f3fc");
```

The packages contain code and searchable metadata; PNGs load on demand from the CDN. To use your own asset host, set `assetBaseUrl` on the React components, `baseUrl` in the URL helper, or pass the base URL to PHP's `EmojiCatalog` constructor.

## Make it yours

- **[Usage guide](docs/usage.md)** — picker props, data helpers, theme variables, focus behavior, tones, and local development.
- **[Deployment guide](deploy/README.md)** — static origin, versioned paths, Cloudflare caching, and GitOps.
- **[Catalog manifest](https://cursor.style/emoji/v2.0.0/manifest.json)** — the published artwork inventory.
- **[Releases](https://github.com/wonchoe/emoji-composer/releases)** — tagged source, package archives, and checksums.

The picker includes an “Emoji by Cursor Style” link by default. You can hide it with `showBranding={false}`; attribution is appreciated and optional under the MIT License.

---

<p align="center">
  <b>Free to use. Full of feeling.</b><br>
  <a href="LICENSE">MIT licensed</a> code and original AI-generated catalog artwork.<br>
  Created for this collection; no platform's exact emoji artwork is reproduced.<br><br>
  A little more personality, by <a href="https://cursor.style/">Cursor Style ↗</a>
</p>
