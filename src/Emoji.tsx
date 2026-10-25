import type { ImgHTMLAttributes } from "react";
import { getEmojiImage } from "./image.js";
import type { EmojiAssetSize, SkinTone } from "./catalog.js";

export interface EmojiProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height" | "size"> {
  name: string;
  size?: EmojiAssetSize;
  skinTone?: SkinTone | null;
  assetBaseUrl?: string;
}

/** An inline image; accepts a readable name, Unicode glyph, or catalog ID. */
export function Emoji({ name, size = 32, skinTone, assetBaseUrl, alt, style, ...props }: EmojiProps) {
  const image = getEmojiImage({ name, size, skinTone, baseUrl: assetBaseUrl });
  return <img {...props} {...image} alt={alt ?? image.alt} style={{ display: "inline-block", verticalAlign: "-0.15em", objectFit: "contain", ...style }} />;
}
