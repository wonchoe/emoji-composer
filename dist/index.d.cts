import * as react from 'react';
import { ImgHTMLAttributes } from 'react';

type SkinTone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";
type EmojiAssetSize = 16 | 24 | 32 | 64 | 128 | 256 | 512 | 1024;
interface EmojiRecord {
    id: string;
    unicode: string;
    emoji: string;
    name: string;
    category: string;
    subcategory: string;
    supportsSkinTone: boolean;
    file: string;
}
interface EmojiToneVariant {
    emoji: string;
    unicode: string;
    baseUnicode: string;
    skinTones: SkinTone[];
    file: string;
    name: string;
    category: string;
    subcategory: string;
}
interface EmojiSelection extends EmojiRecord {
    skinTone: SkinTone | null;
    text: string;
    assetUrl: string;
}
declare const SKIN_TONES: ReadonlyArray<{
    id: SkinTone;
    label: string;
    hex: string;
    modifier: string;
}>;
declare const EMOJI_ASSET_SIZES: ReadonlyArray<EmojiAssetSize>;
declare const EMOJI_ATTRIBUTION_URL = "https://cursor.style/?utm_source=emoji-composer&utm_medium=package&utm_campaign=emoji-catalog";
declare const EMOJI_ASSET_CDN_BASE_URL = "https://cursor.style/emoji/v2.0.0/png";
declare function getEmojiCatalog(): readonly EmojiRecord[];
declare function getEmojiById(id: string): EmojiRecord | undefined;
declare function getEmojiVariantById(id: string): EmojiToneVariant | undefined;
declare function getEmojiToneVariants(): readonly EmojiToneVariant[];
declare function getEmojiToneVariant(emoji: EmojiRecord | string, tone: SkinTone): EmojiToneVariant | undefined;
declare function getEmojiCategories(): string[];
declare function searchEmojis(query: string, category?: string): EmojiRecord[];
declare function getEmojiAssetUrl(emoji: EmojiRecord | string, options?: {
    size?: EmojiAssetSize;
    skinTone?: SkinTone | null;
    baseUrl?: string;
}): string;
declare function getEmojiText(item: EmojiRecord, skinTone?: SkinTone | null): string;

interface EmojiComposerProps {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onEmojiSelect?: (selection: EmojiSelection) => void;
    placeholder?: string;
    assetBaseUrl?: string;
    showBranding?: boolean;
    className?: string;
    label?: string;
    rows?: number;
}
declare function EmojiComposer({ value, defaultValue, onChange, onEmojiSelect, placeholder, assetBaseUrl, showBranding, className, label, rows, }: EmojiComposerProps): react.JSX.Element;

interface EmojiProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height" | "size"> {
    name: string;
    size?: EmojiAssetSize;
    skinTone?: SkinTone | null;
    assetBaseUrl?: string;
}
/** An inline image; accepts a readable name, Unicode glyph, or catalog ID. */
declare function Emoji({ name, size, skinTone, assetBaseUrl, alt, style, ...props }: EmojiProps): react.JSX.Element;

declare function getEmojiSlug(emoji: EmojiRecord): string;
declare function getEmojiByName(name: string): EmojiRecord | undefined;

interface EmojiPickerProps {
    onSelect: (selection: EmojiSelection) => void;
    assetBaseUrl?: string;
    size?: EmojiAssetSize;
    initialCategory?: string;
    skinTone?: SkinTone | null;
    onSkinToneChange?: (tone: SkinTone | null) => void;
    showSkinTonePicker?: boolean;
    showBranding?: boolean;
    className?: string;
    label?: string;
    pageSize?: number;
    autoFocus?: boolean;
    enableSearchShortcut?: boolean;
    selectedId?: string;
}
declare function EmojiPicker({ onSelect, assetBaseUrl, size, initialCategory, skinTone, onSkinToneChange, showSkinTonePicker, showBranding, className, label, pageSize, autoFocus, enableSearchShortcut, selectedId, }: EmojiPickerProps): react.JSX.Element;

export { EMOJI_ASSET_CDN_BASE_URL, EMOJI_ASSET_SIZES, EMOJI_ATTRIBUTION_URL, Emoji, type EmojiAssetSize, EmojiComposer, type EmojiComposerProps, EmojiPicker, type EmojiPickerProps, type EmojiProps, type EmojiRecord, type EmojiSelection, type EmojiToneVariant, SKIN_TONES, type SkinTone, getEmojiAssetUrl, getEmojiById, getEmojiByName, getEmojiCatalog, getEmojiCategories, getEmojiSlug, getEmojiText, getEmojiToneVariant, getEmojiToneVariants, getEmojiVariantById, searchEmojis };
