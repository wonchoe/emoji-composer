import rawCatalog from "../data/emojis.json";
import rawToneVariants from "../data/tone-variants.json";
import rawToneAliases from "../data/tone-aliases.json";

export type SkinTone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";
export type EmojiAssetSize = 16 | 24 | 32 | 64 | 128 | 256 | 512 | 1024;

export interface EmojiRecord {
  id: string;
  unicode: string;
  emoji: string;
  name: string;
  category: string;
  subcategory: string;
  supportsSkinTone: boolean;
  file: string;
}

export interface EmojiToneVariant {
  emoji: string;
  unicode: string;
  baseUnicode: string;
  skinTones: SkinTone[];
  file: string;
  name: string;
  category: string;
  subcategory: string;
}

export interface EmojiSelection extends EmojiRecord {
  skinTone: SkinTone | null;
  text: string;
  assetUrl: string;
}

export const SKIN_TONES: ReadonlyArray<{ id: SkinTone; label: string; hex: string; modifier: string }> = [
  { id: "light", label: "Light skin tone", hex: "#F3D1B9", modifier: "🏻" },
  { id: "medium-light", label: "Medium-light skin tone", hex: "#E6B58C", modifier: "🏼" },
  { id: "medium", label: "Medium skin tone", hex: "#C98A5B", modifier: "🏽" },
  { id: "medium-dark", label: "Medium-dark skin tone", hex: "#95613F", modifier: "🏾" },
  { id: "dark", label: "Dark skin tone", hex: "#593A2D", modifier: "🏿" },
];

export const EMOJI_ASSET_SIZES: ReadonlyArray<EmojiAssetSize> = [16, 24, 32, 64, 128, 256, 512, 1024];
export const EMOJI_ATTRIBUTION_URL =
  "https://cursor.style/?utm_source=emoji-composer&utm_medium=package&utm_campaign=emoji-catalog";
export const EMOJI_ASSET_CDN_BASE_URL =
  "https://cursor.style/emoji/v2.0.0/png";

const catalog = rawCatalog as EmojiRecord[];
const toneVariants = rawToneVariants as EmojiToneVariant[];
const toneAliases = rawToneAliases as Record<string, { referenceUnicode: string; packageBaseUnicode: string }>;
const byId = new Map(catalog.map((item) => [normalizeEmojiId(item.id), item]));
const byGlyph = new Map(catalog.map((item) => [item.emoji, item]));
const variantsByUnicode = new Map(toneVariants.map((item) => [normalizeEmojiId(item.unicode), item]));
const variantsByGlyph = new Map(toneVariants.map((item) => [item.emoji, item]));
const toneModifiers = new Set(["1f3fb", "1f3fc", "1f3fd", "1f3fe", "1f3ff"]);
const uniformToneVariants = new Map<string, EmojiToneVariant>();
const aliasedToneVariants = new Map<string, EmojiToneVariant>();
for (const variant of toneVariants) {
  if (variant.skinTones.length === 0 || !variant.skinTones.every((tone) => tone === variant.skinTones[0])) continue;
  const tone = variant.skinTones[0];
  const exactBase = normalizeEmojiId(variant.unicode)
    .split("-")
    .filter((codepoint) => !toneModifiers.has(codepoint))
    .join("-");
  const directRoot = byId.has(exactBase)
    ? exactBase
    : byId.has(`${exactBase}-fe0f`)
      ? `${exactBase}-fe0f`
      : undefined;
  if (directRoot) {
    uniformToneVariants.set(`${directRoot}:${tone}`, variant);
    continue;
  }
  const aliasRoot = toneAliases[exactBase]?.packageBaseUnicode || variant.baseUnicode;
  const fallbackKey = `${normalizeEmojiId(aliasRoot)}:${tone}`;
  if (!aliasedToneVariants.has(fallbackKey)) aliasedToneVariants.set(fallbackKey, variant);
}
for (const [key, variant] of aliasedToneVariants) {
  if (!uniformToneVariants.has(key)) uniformToneVariants.set(key, variant);
}
const searchable = catalog.map((item) => ({
  item,
  text: `${item.name} ${item.category} ${item.subcategory} ${item.id} ${item.emoji}`.toLocaleLowerCase(),
}));

function normalizeEmojiId(id: string): string {
  return id.toLowerCase().trim().replace(/^emoji-/, "").replace(/u\+/g, "").replace(/\s+/g, "-").replace(/_/g, "-");
}

export function getEmojiCatalog(): readonly EmojiRecord[] {
  return catalog;
}

export function getEmojiById(id: string): EmojiRecord | undefined {
  const key = id.trim();
  return byGlyph.get(key) || byId.get(normalizeEmojiId(key));
}

export function getEmojiVariantById(id: string): EmojiToneVariant | undefined {
  const key = id.trim();
  return variantsByGlyph.get(key) || variantsByUnicode.get(normalizeEmojiId(key));
}

export function getEmojiToneVariants(): readonly EmojiToneVariant[] {
  return toneVariants;
}

export function getEmojiToneVariant(emoji: EmojiRecord | string, tone: SkinTone): EmojiToneVariant | undefined {
  const record = typeof emoji === "string" ? getEmojiById(emoji) : emoji;
  if (!record?.supportsSkinTone) return undefined;
  return uniformToneVariants.get(`${normalizeEmojiId(record.id)}:${tone}`);
}

export function getEmojiCategories(): string[] {
  return [...new Set(catalog.map((item) => item.category))];
}

export function searchEmojis(query: string, category?: string): EmojiRecord[] {
  const needle = query.trim().toLocaleLowerCase();
  return searchable
    .filter(({ item, text }) => (!category || item.category === category) && (!needle || text.includes(needle)))
    .map(({ item }) => item);
}

export function getEmojiAssetUrl(
  emoji: EmojiRecord | string,
  options: { size?: EmojiAssetSize; skinTone?: SkinTone | null; baseUrl?: string } = {},
): string {
  const query = typeof emoji === "string" ? emoji.trim() : emoji.id;
  const exactVariant = typeof emoji === "string" ? getEmojiVariantById(query) : undefined;
  const record = typeof emoji === "string" ? getEmojiById(query) : emoji;
  const size = options.size ?? 64;
  if (!EMOJI_ASSET_SIZES.includes(size)) throw new RangeError(`Unsupported emoji asset size: ${size}`);
  const toneVariant = exactVariant || (record && options.skinTone ? getEmojiToneVariant(record, options.skinTone) : undefined);
  const file = toneVariant?.file || record?.file || (exactVariant ? exactVariant.file : undefined);
  if (!file) throw new RangeError(`Emoji not found: ${query}`);
  const base = (options.baseUrl ?? EMOJI_ASSET_CDN_BASE_URL).replace(/\/+$/, "");
  return `${base}/${size}/${encodeURIComponent(file)}`;
}

export function getEmojiText(item: EmojiRecord, skinTone?: SkinTone | null): string {
  return (skinTone && getEmojiToneVariant(item, skinTone)?.emoji) || item.emoji;
}
