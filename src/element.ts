import { EMOJI_ASSET_SIZES, SKIN_TONES, type EmojiAssetSize, type SkinTone } from "./catalog.js";
import { getEmojiImage } from "./image.js";

/** Safe to import on the server; registers automatically when a DOM is available. */
export function registerEmojiElement(): void {
  if (typeof window === "undefined" || !window.customElements || typeof HTMLElement === "undefined" || window.customElements.get("cs-emoji")) return;
  class CursorStyleEmoji extends HTMLElement {
    static observedAttributes = ["name", "size", "tone", "base-url", "label"];
    private image: HTMLImageElement;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = ":host{display:inline-block;vertical-align:-.15em;line-height:0}img{display:block;width:100%;height:100%;object-fit:contain}img[hidden]{display:none}";
      this.image = document.createElement("img");
      this.image.alt = "";
      this.image.setAttribute("aria-hidden", "true");
      root.append(style, this.image);
    }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    private render() {
      try {
        const size = this.hasAttribute("size") ? Number(this.getAttribute("size")) : 32;
        const tone = this.getAttribute("tone");
        if (!EMOJI_ASSET_SIZES.includes(size as EmojiAssetSize)) throw new RangeError("Unsupported emoji size");
        if (tone && tone !== "original" && !SKIN_TONES.some(entry => entry.id === tone)) throw new RangeError("Unsupported skin tone");
        const image = getEmojiImage({ name: this.getAttribute("name") ?? "", size: size as EmojiAssetSize,
          skinTone: tone && tone !== "original" ? tone as SkinTone : null, baseUrl: this.getAttribute("base-url") ?? undefined });
        this.image.src = image.src;
        this.image.width = size;
        this.image.height = size;
        this.image.hidden = false;
        this.style.width = `${size}px`;
        this.style.height = `${size}px`;
        this.setAttribute("role", "img");
        this.setAttribute("aria-label", this.getAttribute("label") ?? image.alt);
        this.removeAttribute("data-error");
      } catch (error) {
        this.image.hidden = true;
        this.image.removeAttribute("src");
        const message = error instanceof Error ? error.message : "Invalid emoji";
        this.setAttribute("role", "img");
        this.setAttribute("aria-label", this.getAttribute("label") ?? "Emoji unavailable");
        this.setAttribute("data-error", message);
      }
    }
  }
  window.customElements.define("cs-emoji", CursorStyleEmoji);
}

registerEmojiElement();
