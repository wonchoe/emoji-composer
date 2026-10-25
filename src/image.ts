import {
  getEmojiAssetUrl, getEmojiById, getEmojiCatalog, getEmojiToneVariant, getEmojiVariantById,
  type EmojiAssetSize, type EmojiRecord, type SkinTone,
} from "./catalog.js";

export function getEmojiSlug(emoji: EmojiRecord): string {
  return emoji.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const names = new Map<string, EmojiRecord | null>();
for (const emoji of getEmojiCatalog()) {
  const slug = getEmojiSlug(emoji);
  names.set(slug, names.has(slug) ? null : emoji);
}

export function getEmojiByName(name: string): EmojiRecord | undefined {
  return getEmojiById(name) ?? names.get(name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) ?? undefined;
}

export function getEmojiImage({ name, size = 32, skinTone, baseUrl }: {
  name: string; size?: EmojiAssetSize; skinTone?: SkinTone | null; baseUrl?: string;
}) {
  const exact = getEmojiVariantById(name);
  const record = getEmojiByName(name);
  const variant = exact ?? (record && skinTone ? getEmojiToneVariant(record, skinTone) : undefined);
  return {
    src: getEmojiAssetUrl(exact ? exact.unicode : record ?? name, { size, skinTone, baseUrl }),
    width: size,
    height: size,
    alt: variant?.name ?? record?.name ?? name,
  };
}
