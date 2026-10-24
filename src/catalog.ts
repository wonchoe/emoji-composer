import rawCatalog from "../data/emojis.json";

export type SkinTone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";
export type EmojiAssetSize = 16 | 24 | 32 | 64 | 128 | 256 | 512 | 1024;

export interface EmojiRecord {
  id: string;
  emoji: string;
  name: string;
  category: string;
  subcategory: string;
  supportsSkinTone: boolean;
  file: string;
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
  "https://cdn.cursor.style/emoji-composer/v1.0.0/assets/webp";

const catalog = rawCatalog as EmojiRecord[];
const byId = new Map(catalog.map((item) => [normalizeEmojiId(item.id), item]));
const searchable = catalog.map((item) => ({
  item,
  text: `${item.name} ${item.category} ${item.subcategory} ${item.id} ${item.emoji}`.toLocaleLowerCase(),
}));

function normalizeEmojiId(id: string): string {
  return id.toLowerCase().replace(/^emoji-/, "").replace(/_/g, "-");
}

function shardForEmojiId(id: string): string {
  return normalizeEmojiId(id).split("-")[0].slice(0, 3);
}

export function getEmojiCatalog(): readonly EmojiRecord[] {
  return catalog;
}

export function getEmojiById(id: string): EmojiRecord | undefined {
  return byId.get(normalizeEmojiId(id));
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
  const id = normalizeEmojiId(typeof emoji === "string" ? emoji : emoji.id);
  const record = typeof emoji === "string" ? byId.get(id) : emoji;
  const size = options.size ?? 64;
  if (!EMOJI_ASSET_SIZES.includes(size)) throw new RangeError(`Unsupported emoji asset size: ${size}`);
  const tone = record?.supportsSkinTone ? options.skinTone : null;
  const suffix = tone ? `--${tone}` : "";
  const base = (options.baseUrl ?? EMOJI_ASSET_CDN_BASE_URL).replace(/\/+$/, "");
  return `${base}/${size}/${shardForEmojiId(id)}/${id}${suffix}.webp`;
}

export function getEmojiText(item: EmojiRecord, skinTone?: SkinTone | null): string {
  if (!skinTone || !item.supportsSkinTone) return item.emoji;
  const tone = SKIN_TONES.find((entry) => entry.id === skinTone);
  if (!tone) return item.emoji;
  const characters = Array.from(item.emoji);
  const alreadyModified = characters.some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint >= 0x1f3fb && codePoint <= 0x1f3ff;
  });
  if (alreadyModified || characters.length === 0) return item.emoji;
  // skin_tones=yes in the source catalog marks a valid modifier base. Inserting
  // after the first code point follows Unicode order for single-person/hand icons.
  characters.splice(1, 0, tone.modifier);
  return characters.join("");
}
