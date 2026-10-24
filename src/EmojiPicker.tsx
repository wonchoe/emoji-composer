import { useEffect, useMemo, useRef, useState } from "react";
import {
  EMOJI_ASSET_CDN_BASE_URL,
  EMOJI_ATTRIBUTION_URL,
  getEmojiAssetUrl,
  getEmojiCategories,
  getEmojiCatalog,
  getEmojiText,
  SKIN_TONES,
  type EmojiAssetSize,
  type EmojiRecord,
  type EmojiSelection,
  type SkinTone,
} from "./catalog.js";

export interface EmojiPickerProps {
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

const toneChoices: Array<{ id: SkinTone | null; label: string; swatch: string }> = [
  { id: null, label: "Default yellow", swatch: "#ffd34e" },
  ...SKIN_TONES.map((tone) => ({ id: tone.id, label: tone.label, swatch: tone.hex })),
];

export function EmojiPicker({
  onSelect,
  assetBaseUrl = EMOJI_ASSET_CDN_BASE_URL,
  size = 64,
  initialCategory,
  skinTone,
  onSkinToneChange,
  showSkinTonePicker = true,
  showBranding = true,
  className = "",
  label = "Emoji picker",
  pageSize = 96,
}: EmojiPickerProps) {
  const catalog = getEmojiCatalog();
  const categories = useMemo(() => getEmojiCategories(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "All");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [localTone, setLocalTone] = useState<SkinTone | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const activeTone = skinTone === undefined ? localTone : skinTone;

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    searchRef.current?.focus();
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return catalog.filter((item) => {
      const categoryMatches = category === "All" || item.category === category;
      const searchMatches = !needle ||
        `${item.name} ${item.category} ${item.subcategory} ${item.id} ${item.emoji}`
          .toLocaleLowerCase()
          .includes(needle);
      return categoryMatches && searchMatches;
    });
  }, [catalog, category, query]);

  const setTone = (tone: SkinTone | null) => {
    if (skinTone === undefined) setLocalTone(tone);
    onSkinToneChange?.(tone);
  };

  const choose = (item: EmojiRecord) => {
    onSelect({
      ...item,
      skinTone: item.supportsSkinTone ? activeTone : null,
      text: getEmojiText(item, activeTone),
      assetUrl: getEmojiAssetUrl(item, { size, skinTone: activeTone, baseUrl: assetBaseUrl }),
    });
  };

  return (
    <section className={`ec-picker ${className}`.trim()} aria-label={label}>
      <div className="ec-search-wrap">
        <svg className="ec-search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.5" />
          <path d="m16 16 4.3 4.3" />
        </svg>
        <input
          ref={searchRef}
          className="ec-search"
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setVisibleCount(pageSize); }}
          placeholder="Search 1,914 emojis"
          aria-label="Search emojis"
          autoComplete="off"
        />
        <kbd className="ec-shortcut">Ctrl / ⌘ K</kbd>
      </div>

      {showSkinTonePicker && (
        <div className="ec-tone-row" aria-label="Skin tone">
          <span className="ec-tone-caption">Skin tone</span>
          <div className="ec-tone-options" role="group" aria-label="Choose skin tone">
            {toneChoices.map((choice) => (
              <button
                type="button"
                key={choice.id ?? "default"}
                className={`ec-tone-chip${activeTone === choice.id ? " is-active" : ""}`}
                title={choice.label}
                aria-label={choice.label}
                aria-pressed={activeTone === choice.id}
                onClick={() => setTone(choice.id)}
              >
                <span style={{ background: choice.swatch }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className="ec-categories" aria-label="Emoji categories">
        <button
          type="button"
          className={`ec-category${category === "All" ? " is-active" : ""}`}
          onClick={() => { setCategory("All"); setVisibleCount(pageSize); }}
        >All</button>
        {categories.map((entry) => (
          <button
            type="button"
            key={entry}
            className={`ec-category${category === entry ? " is-active" : ""}`}
            onClick={() => { setCategory(entry); setVisibleCount(pageSize); }}
            title={entry}
          >
            {categoryGlyph(entry)}
            <span>{entry}</span>
          </button>
        ))}
      </nav>

      <div className="ec-results-heading">
        <span>{query ? `Results for “${query}”` : category === "All" ? "All emojis" : category}</span>
        <span className="ec-result-count">{filtered.length.toLocaleString()}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="ec-empty">
          <span aria-hidden="true">🫧</span>
          <strong>No matches yet</strong>
          <small>Try another word or browse a category.</small>
        </div>
      ) : (
        <>
          <div className="ec-grid" role="list" aria-label="Emoji results">
            {filtered.slice(0, visibleCount).map((item) => {
              const url = getEmojiAssetUrl(item, { size, skinTone: activeTone, baseUrl: assetBaseUrl });
              return (
                <button
                  type="button"
                  className="ec-emoji"
                  key={item.id}
                  onClick={() => choose(item)}
                  title={`${item.name}${item.supportsSkinTone && activeTone ? ` · ${activeTone}` : ""}`}
                  aria-label={`${item.name}${item.supportsSkinTone && activeTone ? `, ${activeTone} skin tone` : ""}`}
                >
                  <img
                    src={url}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={size}
                    height={size}
                    onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling?.classList.add("is-visible"); }}
                  />
                  <span className="ec-emoji-fallback" aria-hidden="true">{getEmojiText(item, activeTone)}</span>
                </button>
              );
            })}
          </div>
          {visibleCount < filtered.length && (
            <button className="ec-load-more" type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>
              Show more ({(filtered.length - visibleCount).toLocaleString()} left)
            </button>
          )}
        </>
      )}
      <footer className="ec-footer">
        {showBranding ? <a className="ec-credit" href={EMOJI_ATTRIBUTION_URL} target="_blank" rel="noopener noreferrer">Emoji by Cursor Style ↗</a> : <span />}
        <span><i /> {catalog.length.toLocaleString()} icons</span>
      </footer>
    </section>
  );
}

function categoryGlyph(category: string): string {
  const normalized = category.toLowerCase();
  if (normalized.includes("smiley")) return "☺";
  if (normalized.includes("people")) return "☻";
  if (normalized.includes("animal")) return "♧";
  if (normalized.includes("food")) return "◉";
  if (normalized.includes("travel")) return "⌖";
  if (normalized.includes("activit")) return "✦";
  if (normalized.includes("object")) return "▣";
  if (normalized.includes("symbol")) return "◈";
  if (normalized.includes("flag")) return "⚑";
  return "◌";
}
