# Cursor Style Emoji

Canonical page: https://cursor.style/emoji/

Free original AI-generated 3D emoji artwork, licensed under MIT. Unicode Emoji 18.0: 1,923 base emoji plus 2,040 exact skin-tone sequences. The 3,963 artworks have transparent backgrounds and eight PNG sizes: 16, 24, 32, 64, 128, 256, 512 and 1024 pixels.

## Direct image

```html
<img src="https://cursor.style/emoji/v2.0.0/png/32/1f44b.png" width="32" height="32" alt="Waving hand">
```

## HTML element

Add the loader once:

```html
<script type="module" src="https://cursor.style/emoji/assets/emoji-element-v1-1-0.js"></script>
<cs-emoji name="waving-hand" size="32" tone="medium"></cs-emoji>
```

In an npm application, use `import "emoji-composer/element"` instead of the script tag. No React dependency is needed for this entry.

## React

Install `emoji-composer` with React and React DOM 18 or later.

```tsx
import { Emoji, EmojiPicker } from "emoji-composer";
import "emoji-composer/styles.css";

<Emoji name="waving-hand" size={32} skinTone="medium" />;
<EmojiPicker onSelect={selection => console.log(selection.text, selection.assetUrl)} />;
```

The picker emits Unicode text and a matching PNG URL. Unicode uses the receiving device's emoji font; use PNG images or the image component to preserve Cursor Style artwork.

## PHP

Install `cursor-style/emoji` with Composer. Requires PHP 8.1+ and ext-json.

```php
require __DIR__ . '/vendor/autoload.php';
$emoji = new \CursorStyle\Emoji\EmojiCatalog();
echo $emoji->imageTag('👋', 32, 'medium');
```

## Sources

- Repository and license: https://github.com/wonchoe/emoji-composer
- JavaScript package: https://www.npmjs.com/package/emoji-composer
- PHP package: https://packagist.org/packages/cursor-style/emoji
- Full API guide: https://github.com/wonchoe/emoji-composer/blob/main/docs/usage.md
- Base catalog: https://raw.githubusercontent.com/wonchoe/emoji-composer/main/data/emojis.json
- Exact tone sequences: https://raw.githubusercontent.com/wonchoe/emoji-composer/main/data/tone-variants.json
- Asset manifest: https://cursor.style/emoji/v2.0.0/manifest.json

This is original Cursor Style artwork. It is not an Apple emoji font or another platform's exact artwork. Public credit is optional. Keep the MIT copyright and license notice when redistributing copies or substantial portions.
