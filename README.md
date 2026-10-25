# Emoji Composer

A searchable React emoji composer by [Cursor Style](https://cursor.style/), backed by an original Unicode 18.0 3D emoji catalog. It includes category browsing, five skin-tone choices, cursor-aware message insertion, and PNG assets from 16 px through 1024 px. The picker includes a small, clickable Cursor Style credit by default.

## Install

```bash
# Available after the first public release.
npm install emoji-composer
```

## Add the composer

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
      onEmojiSelect={(selection) => console.log(selection.name, selection.skinTone)}
      placeholder="Write a message…"
    />
  );
}
```

`EmojiComposer` inserts the chosen emoji at the current cursor position. It supports controlled and uncontrolled values.

The composer's picker opens in a React portal attached to `document.body`. It chooses space above or below the composer and follows viewport changes, including the mobile keyboard. This keeps it clear of ancestor containers with `overflow: hidden`. The search field receives focus when opened. Escape closes it and returns focus to the smile button; selecting an emoji restores the text cursor. Clicking or moving keyboard focus outside the composer and picker also closes it. This is a non-modal popover, so it does not trap keyboard focus.

Apply picker theme variables on `:root` or `body` when customizing the popover, since it lives outside the composer's DOM subtree. The standalone picker stays in its normal parent container.

## Use the picker by itself

```tsx
import { useState } from "react";
import { EmojiPicker, type EmojiSelection } from "emoji-composer";
import "emoji-composer/styles.css";

function PickerExample() {
  const [selected, setSelected] = useState<EmojiSelection | null>(null);
  const handleSelect = (selection: EmojiSelection) => {
    setSelected(selection);
    console.log(selection.text); // Unicode text, with a tone modifier when supported
    console.log(selection.assetUrl); // matching custom PNG artwork
  };

  return <EmojiPicker onSelect={handleSelect} selectedId={selected?.id} />;
}
```

The standalone picker preserves the page's existing focus when it mounts. These optional props control selection and search behavior:

| Prop | Default | Behavior |
| --- | --- | --- |
| `selectedId` | Unset | Highlights the matching base emoji ID and exposes its pressed state. Update this from `onSelect` to keep a persistent selection. |
| `autoFocus` | `false` | Focuses the search input when the picker mounts. The composer sets this to `true` when opening its popover. |
| `enableSearchShortcut` | `true` | Enables Ctrl+K / ⌘K and its keyboard hint. Set to `false` when your application owns that shortcut. |

When several pickers are mounted, the shortcut targets the open composer popover, then the picker containing the current focus, then the first visible picker. It focuses only one search field per keypress.

## Browse data and assets

```ts
import {
  getEmojiCatalog,
  getEmojiById,
  getEmojiAssetUrl,
  getEmojiVariantById,
  getEmojiToneVariants,
  searchEmojis,
} from "emoji-composer";

const heart = getEmojiById("2764-fe0f");
const people = searchEmojis("waving", "People & Body");
const iconUrl = heart && getEmojiAssetUrl(heart, { size: 128 });
const allEmojis = getEmojiCatalog();
const allUnicodeVariants = getEmojiToneVariants();
const mixedToneHandshake = getEmojiVariantById("1faf1-1f3fb-200d-1faf2-1f3fc");
```

Supported asset sizes are `16`, `24`, `32`, `64`, `128`, `256`, `512`, and `1024`. Images load from Cursor Style's versioned PNG path, `https://cursor.style/emoji/v2.0.0/png`. Cloudflare caches these public URLs on the main Cursor Style domain. Set `assetBaseUrl` on either component or `baseUrl` in `getEmojiAssetUrl` to use your own CDN or local asset host.

```tsx
<EmojiPicker
  onSelect={handleSelect}
  assetBaseUrl="https://static.example.com/emoji/png"
  showBranding={true}
  size={128}
/>
```

The picker loads the first 96 matches and reveals more on demand, which keeps a large searchable catalog responsive. Images are lazy-loaded. Selecting a tone chooses its exact Unicode variant PNG, and mixed-tone sequences are available by their full Unicode value. `showBranding` defaults to `true` and displays a small “Emoji by Cursor Style” link in the picker footer; set it to `false` to hide the credit.

## Skin tones

The Unicode 18.0 catalog contains all 1,923 base emoji and all 2,040 fully-qualified skin-tone sequences. Every shade is a separate generated PNG; the picker never recolors artwork with masks. Original masters remain unchanged. Exact sequences, including mixed-tone combinations, are available through `getEmojiVariantById()` and the `emoji-composer/tone-variants` data export. All tone PNGs passed Unicode, image-format, alpha, and canvas-edge checks. The corrected waving-hand set and 34 repaired variants also received side-by-side visual review; automated silhouette analysis compared the full tone set and flagged outliers for visual inspection. The CDN hosts the eight PNG sizes, while the npm tarball contains searchable metadata and component code.

The local preview serves catalog masters from the workspace. Run `python tools/sync_catalog.py` to sync all 1,923 base records and 2,040 exact tone sequences into this package.

## PHP / Composer

The same repository also provides the `cursor-style/emoji` Composer package for PHP 8.1 and later. It uses the same catalog, exact tone mapping, artwork URLs, and MIT License as the React package.

```bash
composer require cursor-style/emoji
```

```php
use CursorStyle\Emoji\EmojiCatalog;

$emoji = new EmojiCatalog();
$url = $emoji->imageUrl('👋', 128, 'medium');
// https://cursor.style/emoji/v2.0.0/png/128/skin-1f44b-1f3fd.png

$matches = $emoji->find('waving');
$allBaseEmojis = $emoji->all();
$allExactToneSequences = $emoji->toneVariants();
$mixedToneUrl = $emoji->imageUrl('1faf1-1f3fb-200d-1faf2-1f3fc', 256);
```

Pass a custom URL to `new EmojiCatalog('https://static.example.com/emoji/png')` to self-host the assets. The helper produces URLs and catalog data; it does not download images or require a framework.

## Public website and CDN

The collection and live composer are at [cursor.style/emoji](https://cursor.style/emoji/). Image URLs remain on the main Cursor Style domain and are cached by Cloudflare. PNGs have a transparent background and support cross-origin image use. A versioned asset URL is immutable: future artwork changes use a new version path.

To build the website for its `/emoji/` path, run `npm run build:site`. Development uses local artwork; production uses the public asset URL. `deploy/kubernetes.yaml` contains the static origin and the path-specific ingress. The artwork is stored separately in R2 and is not bundled into npm or Composer downloads.

## Development

```bash
npm install
python tools/sync_catalog.py
npm run dev
npm run build
```

The published component uses Cursor Style's versioned CDN path above. The local demo serves images from the catalog workspace. Run it at `http://localhost:5173` after `npm run dev`.

## License

The repository uses the MIT License. The artwork is original catalog artwork generated for this project; it does not reproduce any platform's exact emoji artwork.
