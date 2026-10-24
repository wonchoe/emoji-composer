# Emoji Composer

A searchable React emoji composer by [Cursor Style](https://cursor.style/), backed by an original, cohesive 3D emoji catalog. It includes category browsing, five skin-tone choices, cursor-aware message insertion, and responsive WebP assets from 16 px through 1024 px. The picker includes a small, clickable Cursor Style credit by default.

## Install

```bash
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

## Use the picker by itself

```tsx
import { EmojiPicker, type EmojiSelection } from "emoji-composer";
import "emoji-composer/styles.css";

function PickerExample() {
  const handleSelect = (selection: EmojiSelection) => {
    console.log(selection.text); // Unicode text, with a tone modifier when supported
    console.log(selection.assetUrl); // matching custom WebP artwork
  };

  return <EmojiPicker onSelect={handleSelect} />;
}
```

## Browse data and assets

```ts
import {
  getEmojiCatalog,
  getEmojiById,
  getEmojiAssetUrl,
  searchEmojis,
} from "emoji-composer";

const heart = getEmojiById("2764-fe0f");
const people = searchEmojis("waving", "People & Body");
const iconUrl = heart && getEmojiAssetUrl(heart, { size: 128 });
const allEmojis = getEmojiCatalog();
```

Supported asset sizes are `16`, `24`, `32`, `64`, `128`, `256`, `512`, and `1024`. Images load from Cursor Style's versioned CDN path, `https://cdn.cursor.style/emoji-composer/v1.0.0/assets/webp`. Set `assetBaseUrl` on either component or `baseUrl` in `getEmojiAssetUrl` to use your own CDN or local asset host.

```tsx
<EmojiPicker
  onSelect={handleSelect}
  assetBaseUrl="https://static.example.com/emoji/webp"
  showBranding={true}
  size={128}
/>
```

The picker loads the first 96 matches and reveals more on demand, which keeps a large searchable catalog responsive. Images are lazy-loaded. The default catalog icons use classic yellow skin; selecting a tone switches to the matching recolor for icons marked as tone-capable. `showBranding` defaults to `true` and displays a small “Emoji by Cursor Style” link in the picker footer; set it to `false` to hide the credit.

## Skin tones

The catalog has five visual skin-tone variants for each of the 330 source entries marked as skin-tone-capable. Variants are generated from the original 1024 px PNGs with a color mask that preserves alpha and lighting. The original PNG masters remain in the local catalog source folder and are never overwritten. Optimized WebP derivatives are served from Cursor Style's versioned CDN; only searchable metadata and component code are included in the npm tarball, which keeps installation small.

## Development

```bash
npm install
npm run dev
npm run build
```

The demo and installed components load images from Cursor Style's versioned CDN path above. Run the local demo at `http://localhost:5173` after `npm run dev`.

## License

The repository uses the MIT License. The artwork is original catalog artwork generated for this project; it does not reproduce any platform's exact emoji artwork.
