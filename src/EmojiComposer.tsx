import { useEffect, useId, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import { createPortal } from "react-dom";
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
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pickerId = useId();
  const text = value ?? internalValue;

  useEffect(() => {
    if (!open) {
      setPopoverStyle(null);
      return;
    }
    const positionPopover = (event?: Event) => {
      if (event?.type === "scroll" && event.target instanceof Node && popoverRef.current?.contains(event.target)) return;
      const anchor = rootRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const viewport = window.visualViewport;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportTop = viewport?.offsetTop ?? 0;
      const margin = 16;
      const gap = 10;
      const width = Math.min(400, viewportWidth - margin * 2);
      const above = anchor.top - viewportTop - margin - gap;
      const below = viewportTop + viewportHeight - margin - anchor.bottom - gap;
      const preferBelow = below >= 540 || below > above;
      const available = preferBelow ? below : above;
      const height = Math.min(540, viewportHeight - margin * 2, Math.max(320, available));
      const top = preferBelow ? anchor.bottom + gap : anchor.top - gap - height;
      setPopoverStyle({
        width,
        height,
        left: Math.max(viewportLeft + margin, Math.min(anchor.right - width, viewportLeft + viewportWidth - width - margin)),
        top: Math.max(viewportTop + margin, Math.min(top, viewportTop + viewportHeight - height - margin)),
      });
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target) && !popoverRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnOutsideFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target) && !popoverRef.current?.contains(event.target)) setOpen(false);
    };
    positionPopover();
    window.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("focusin", closeOnOutsideFocus);
    window.addEventListener("resize", positionPopover);
    window.addEventListener("scroll", positionPopover, true);
    window.visualViewport?.addEventListener("resize", positionPopover);
    window.visualViewport?.addEventListener("scroll", positionPopover);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("focusin", closeOnOutsideFocus);
      window.removeEventListener("resize", positionPopover);
      window.removeEventListener("scroll", positionPopover, true);
      window.visualViewport?.removeEventListener("resize", positionPopover);
      window.visualViewport?.removeEventListener("scroll", positionPopover);
    };
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
      if (!area?.isConnected) return;
      area.focus();
      const cursor = start + selection.text.length;
      area.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div
      ref={rootRef}
      className={`ec-composer ${className}`.trim()}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
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
            ref={triggerRef}
            type="button"
            className={`ec-trigger${open ? " is-active" : ""}`}
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close emoji picker" : "Open emoji picker"}
            aria-expanded={open}
            aria-controls={pickerId}
            aria-haspopup="dialog"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M8.5 14.3c.7 1.4 1.9 2.2 3.5 2.2s2.8-.8 3.5-2.2" />
              <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="2.5" />
            </svg>
          </button>
        </div>
      </div>
      {open && popoverStyle && createPortal(
        <div ref={popoverRef} className="ec-popover" id={pickerId} style={popoverStyle} role="dialog" aria-label="Choose an emoji">
          <EmojiPicker onSelect={insertEmoji} assetBaseUrl={assetBaseUrl} showBranding={showBranding} label="Choose an emoji" autoFocus />
        </div>,
        document.body,
      )}
    </div>
  );
}
