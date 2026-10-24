import * as react from 'react';

type SkinTone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";
type EmojiAssetSize = 16 | 24 | 32 | 64 | 128 | 256 | 512 | 1024;
interface EmojiRecord {
    id: string;
    emoji: string;
    name: string;
    category: string;
    subcategory: string;
    supportsSkinTone: boolean;
    file: string;
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
declare const EMOJI_ASSET_CDN_BASE_URL = "https://cdn.cursor.style/emoji-composer/v1.0.0/assets/webp";
declare function getEmojiCatalog(): readonly EmojiRecord[];
declare function getEmojiById(id: string): EmojiRecord | undefined;
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
}
declare function EmojiPicker({ onSelect, assetBaseUrl, size, initialCategory, skinTone, onSkinToneChange, showSkinTonePicker, showBranding, className, label, pageSize, }: EmojiPickerProps): react.JSX.Element;

export { EMOJI_ASSET_CDN_BASE_URL, EMOJI_ASSET_SIZES, EMOJI_ATTRIBUTION_URL, type EmojiAssetSize, EmojiComposer, type EmojiComposerProps, EmojiPicker, type EmojiPickerProps, type EmojiRecord, type EmojiSelection, SKIN_TONES, type SkinTone, getEmojiAssetUrl, getEmojiById, getEmojiCatalog, getEmojiCategories, getEmojiText, searchEmojis };
