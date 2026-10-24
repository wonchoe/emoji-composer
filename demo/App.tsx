import { useState } from "react";
import { EmojiComposer, EmojiPicker, EMOJI_ASSET_CDN_BASE_URL, getEmojiCatalog, type EmojiSelection } from "../src/index.js";

export function App() {
  const [message, setMessage] = useState("A little joy goes a long way ");
  const [last, setLast] = useState<EmojiSelection | null>(null);
  const count = getEmojiCatalog().length;

  return (
    <main className="demo-shell">
      <div className="demo-orb demo-orb-a" />
      <div className="demo-orb demo-orb-b" />
      <nav className="demo-nav">
        <a className="demo-brand" href="#top"><span>✦</span> emoji composer</a>
        <div className="demo-nav-links"><a href="#composer">Composer</a><a href="#library">Library</a><a href="https://github.com/wonchoe/emoji-composer">GitHub ↗</a></div>
      </nav>

      <section className="demo-hero" id="top">
        <div className="demo-eyebrow"><i /> YOUR MESSAGES, WITH MORE FEELING</div>
        <h1>Say it with<br /><span>an emoji.</span></h1>
        <p className="demo-lede">A tiny, joyful composer for the moments words don't quite cover. Search the full catalog, choose a tone, and keep the conversation moving.</p>
        <div className="demo-stats"><div><strong>{count.toLocaleString()}</strong><span>original icons</span></div><i /><div><strong>5</strong><span>skin tones</span></div><i /><div><strong>8</strong><span>image sizes</span></div></div>
        <div className="demo-stage" id="composer">
          <div className="demo-stage-top"><div><strong>Message composer</strong><small>Try search, tone, and insert</small></div><span className="demo-live"><i /> LIVE DEMO</span></div>
          <EmojiComposer
            value={message}
            onChange={setMessage}
            onEmojiSelect={setLast}
            assetBaseUrl={LOCAL_ASSETS}
            placeholder="Write something nice…"
          />
          <div className="demo-stage-bottom"><span>Press the smile button to open the library</span>{last && <span className="demo-selected">Selected · {last.name}{last.skinTone ? ` · ${last.skinTone}` : ""}</span>}</div>
        </div>
      </section>

      <section className="demo-library" id="library">
        <div className="demo-section-copy"><div className="demo-eyebrow">A WHOLE LITTLE WORLD</div><h2>Find your<br /><span>perfect reaction.</span></h2><p>Browse by category, search by name, or pick a skin tone. The selection inserts right where your cursor is.</p><div className="demo-badges"><span>⌕ Smart search</span><span>✦ Tone variants</span><span>↗ Cursor insertion</span></div></div>
        <div className="demo-picker-card"><div className="demo-picker-heading"><div><strong>Explore the catalog</strong><small>1,914 hand-curated meanings</small></div><span>⌘ K</span></div><EmojiPicker onSelect={setLast} assetBaseUrl={EMOJI_ASSET_CDN_BASE_URL} size={64} label="Explore emojis" /></div>
      </section>

      <footer className="demo-footer"><span>emoji composer <b>·</b> by <a href="https://cursor.style/?utm_source=emoji-composer&amp;utm_medium=demo&amp;utm_campaign=emoji-catalog" target="_blank" rel="noopener noreferrer">Cursor Style ↗</a></span><a href="https://github.com/wonchoe/emoji-composer">View source ↗</a></footer>
    </main>
  );
}
