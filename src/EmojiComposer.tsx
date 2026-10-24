import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { EmojiPicker } from "./EmojiPicker.js";
import type { EmojiSelection } from "./catalog.js";

export interface EmojiComposerProps {
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

export function EmojiComposer({
  value,
  defaultValue = "",
  onChange,
  onEmojiSelect,
  placeholder = "Write a message…",
  assetBaseUrl,
  showBranding,
  className = "",
  label = "Message composer",
  rows = 3,
}: EmojiComposerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pickerId = useId();
  const text = value ?? internalValue;

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => window.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open]);

  const updateValue = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => updateValue(event.target.value);

  const insertEmoji = (selection: EmojiSelection) => {
    const area = textareaRef.current;
    const start = area?.selectionStart ?? text.length;
    const end = area?.selectionEnd ?? text.length;
    const next = `${text.slice(0, start)}${selection.text}${text.slice(end)}`;
    updateValue(next);
    onEmojiSelect?.(selection);
    setOpen(false);
    requestAnimationFrame(() => {
      if (!area) return;
      area.focus();
      const cursor = start + selection.text.length;
      area.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div
      ref={rootRef}
      className={`ec-composer ${className}`.trim()}
      onKeyDown={(event) => { if (event.key === "Escape" && open) setOpen(false); }}
    >
      <div className="ec-composer-field">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          rows={rows}
          placeholder={placeholder}
          aria-label={label}
        />
        <div className="ec-composer-tools">
          <span className="ec-composer-hint">Add a little feeling</span>
          <button
            type="button"
            className={`ec-trigger${open ? " is-active" : ""}`}
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close emoji picker" : "Open emoji picker"}
            aria-expanded={open}
            aria-controls={pickerId}
          >
            <span aria-hidden="true">☺</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="ec-popover" id={pickerId}>
          <EmojiPicker onSelect={insertEmoji} assetBaseUrl={assetBaseUrl} showBranding={showBranding} label="Choose an emoji" />
        </div>
      )}
    </div>
  );
}
