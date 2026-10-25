import { createElement, useEffect, useRef, useState, type CSSProperties } from "react";
import "../src/element.js";
import {
  Emoji, EmojiComposer, EmojiPicker, EMOJI_ASSET_SIZES, EMOJI_ASSET_CDN_BASE_URL, SKIN_TONES, getEmojiByName, getEmojiSlug,
  getEmojiAssetUrl, getEmojiById, getEmojiCatalog, getEmojiText, getEmojiToneVariant,
  getEmojiToneVariants, type EmojiAssetSize, type EmojiRecord, type EmojiSelection, type SkinTone,
} from "../src/index.js";

const LOCAL_ASSETS = import.meta.env.VITE_EMOJI_ASSET_BASE_URL || (import.meta.env.PROD ? "https://cursor.style/emoji/v2.0.0/png" : "/_emoji-assets");
const catalog = getEmojiCatalog();
const toneCount = getEmojiToneVariants().length;
const toneChoices = [{ id: null, label: "Original yellow" }, ...SKIN_TONES] as const;
const copyFormats = ["HTML", "React", "URL", "Unicode"] as const;
const packageFormats = ["HTML", "React", "PHP"] as const;
type CopyFormat = typeof copyFormats[number] | "PHP";
const elementScript = "https://cursor.style/emoji/assets/emoji-element-v1-1-0.js";
const htmlEntities: Record<string, string> = { "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" };
const featured = [
  { id: "1f60e", label: "Stay cool", color: "#eff0de" },
  { id: "1f496", label: "A little love", color: "#f6e8eb" },
  { id: "1f44b", label: "Hello there", color: "#f5eddc" },
  { id: "1f951", label: "Good taste", color: "#e8efdf" },
  { id: "1f47b", label: "Just boo", color: "#e9e6f1" },
  { id: "1f525", label: "On fire", color: "#f6e7dd" },
];
const snippet = `import { EmojiPicker } from "emoji-composer";
import "emoji-composer/styles.css";

<EmojiPicker
  onSelect={(emoji) => console.log(emoji.text)}
/>`;

function asset(emoji: EmojiRecord | string, size: EmojiAssetSize = 256, tone: SkinTone | null = null) {
  return getEmojiAssetUrl(emoji, { size, skinTone: tone, baseUrl: LOCAL_ASSETS });
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;
}

function CopyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/></svg>;
}

export function App() {
  const [selected, setSelected] = useState<EmojiRecord>(() => getEmojiById("1f44b")!);
  const [tone, setTone] = useState<SkinTone | null>(null);
  const [size, setSize] = useState<EmojiAssetSize>(128);
  const [darkPreview, setDarkPreview] = useState(false);
  const [message, setMessage] = useState("Hey! A little something to brighten your day ");
  const [copyStatus, setCopyStatus] = useState("");
  const [copyFormat, setCopyFormat] = useState<CopyFormat>("HTML");
  const [copyMethod, setCopyMethod] = useState<"direct" | "package">("direct");
  const previewRef = useRef<HTMLDivElement>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const selectedTone = selected.supportsSkinTone ? tone : null;
  const variant = selectedTone ? getEmojiToneVariant(selected, selectedTone) : undefined;
  const selectedText = getEmojiText(selected, selectedTone);
  const selectedFile = variant?.file ?? selected.file;
  const publicAssetUrl = getEmojiAssetUrl(selected, { size, skinTone: selectedTone, baseUrl: EMOJI_ASSET_CDN_BASE_URL });
  const selectedName = variant?.name ?? selected.name;
  const imageAlt = selectedName.replace(/[&"<>]/g, character => htmlEntities[character]!);
  const slug = getEmojiSlug(selected);
  const tagName = getEmojiByName(slug)?.id === selected.id ? slug : selected.id;
  const directValues: Partial<Record<CopyFormat, string>> = {
    HTML: `<img src="${publicAssetUrl}"\n  width="${size}" height="${size}"\n  alt="${imageAlt}" />`,
    React: `<img src="${publicAssetUrl}"\n  width={${size}} height={${size}}\n  alt={${JSON.stringify(selectedName)}} />`,
    URL: publicAssetUrl,
    Unicode: selectedText,
  };
  const packageValues: Partial<Record<CopyFormat, string>> = {
    HTML: `<cs-emoji name="${tagName}" size="${size}"${selectedTone ? ` tone="${selectedTone}"` : ""}></cs-emoji>`,
    React: `<Emoji name="${tagName}" size={${size}}${selectedTone ? ` skinTone="${selectedTone}"` : ""} />`,
    PHP: `<?= $emoji->imageTag('${selected.id}', ${size}, '${selectedTone ?? "original"}') ?>`,
  };
  const setupValues: Partial<Record<CopyFormat, string>> = {
    HTML: `<script type="module"\n  src="${elementScript}"></script>`,
    React: `// npm install emoji-composer@^1.1.0 react react-dom\nimport { Emoji } from "emoji-composer";`,
    PHP: `<?php\n// composer require cursor-style/emoji:^1.1\nrequire __DIR__ . '/vendor/autoload.php';\n$emoji = new \\CursorStyle\\Emoji\\EmojiCatalog();\n?>`,
  };
  const usageCode = (copyMethod === "direct" ? directValues : packageValues)[copyFormat] ?? "";
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    preview.scrollLeft = Math.max(0, (preview.scrollWidth - preview.clientWidth) / 2);
    preview.scrollTop = Math.max(0, (preview.scrollHeight - preview.clientHeight) / 2);
  }, [size, selected.id, selectedTone, copyMethod, copyFormat]);

  function selectEmoji(selection: EmojiSelection) {
    setSelected(selection);
    setCopyStatus("");
  }

  function selectFeatured(id: string) {
    setSelected(getEmojiById(id)!);
    setCopyStatus("");
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copyEmoji() {
    try {
      await navigator.clipboard.writeText(usageCode);
      setCopyStatus(copyFormat === "Unicode" ? "Unicode copied. Its appearance depends on your device." : `${copyFormat} copied. Ready to use your Cursor Style artwork.`);
    } catch {
      setCopyStatus("Could not copy automatically. Select the code above and copy it.");
    }
  }

  async function copySetup() {
    try { await navigator.clipboard.writeText(setupValues[copyFormat] ?? ""); setCopyStatus("Setup copied. Add it once, then use the emoji tag."); }
    catch { setCopyStatus("Could not copy automatically. Select the setup code to copy it."); }
  }

  async function copyCode() {
    try { await navigator.clipboard.writeText(snippet); setCodeCopied(true); }
    catch { setCodeCopied(false); }
  }

  return (
    <div className="demo-shell" id="top">
      <a className="skip-link" href="#library">Skip to emoji library</a>
      <header className="demo-nav wrap">
        <a className="demo-brand" href="#top" aria-label="Emoji Composer home">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M9 18c1 7 13 7 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="11" cy="11" r="1.7" fill="currentColor"/><circle cx="21" cy="11" r="1.7" fill="currentColor"/></svg></span>
          <span>emoji<span className="brand-light">composer</span><small>BY CURSOR STYLE</small></span>
        </a>
        <nav aria-label="Main navigation"><a href="#library">The collection</a><a href="#playground">Playground</a><a href="#integrate">For developers <Arrow diagonal /></a></nav>
        <span className="preview-badge"><i /> Open source</span>
      </header>

      <main>
        <section className="demo-hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="tiny-star">✳</span> LITTLE ICONS. ALL THE FEELINGS.</div>
            <h1 id="hero-title">Life’s better<br/>with a little <span>feeling<span className="period">.</span><svg viewBox="0 0 370 17" preserveAspectRatio="none" aria-hidden="true"><path d="M4 12C110 0 265 1 365 9"/></svg></span></h1>
            <p>A whole world of expressive 3D emoji.<br className="desktop-break"/> Find your favorite. Make it yours. Say more.</p>
            <div className="hero-actions"><a className="button button-dark" href="#library">Explore the collection <Arrow /></a><a className="text-link" href="#playground">Try the composer <span>↗</span></a></div>
            <div className="hero-footnote"><span className="stack-dots"><i/><i/><i/><i/><i/></span><span>Every shade. Every little detail.</span></div>
          </div>
          <div className="hero-art" aria-label="A few favorites from the collection">
            <div className="art-orbit"/><span className="art-spark art-spark-one" aria-hidden="true">✳</span><span className="art-spark art-spark-two" aria-hidden="true">+</span>
            <span className="art-note">pick your mood ↘</span>
            {featured.map((item, index) => <button type="button" key={item.id} className={`art-tile art-tile-${index}`} style={{ "--tile-color": item.color } as CSSProperties} onClick={() => selectFeatured(item.id)} aria-label={`Explore ${getEmojiById(item.id)!.name}`}><img src={asset(item.id)} alt=""/><span>{item.label}</span></button>)}
            <span className="art-sticker"><span>100%</span> personality</span>
          </div>
        </section>

        <div className="collection-facts wrap" aria-label="Collection details">
          <div><strong>{(catalog.length + toneCount).toLocaleString("en-US")}</strong><span>individual artworks</span></div>
          <div><strong>5</strong><span>skin tones + original</span></div>
          <div><strong>16-1024<span>px</span></strong><span>8 ready-to-use sizes</span></div>
          <div className="fact-unicode"><span className="fact-check">✓</span><span><strong>Unicode 18.0</strong><span>The complete collection</span></span></div>
        </div>

        <section className="library-section wrap" id="library" aria-labelledby="library-title">
          <div className="section-heading"><div><div className="eyebrow">THE COLLECTION</div><h2 id="library-title">Find your kind of happy.</h2></div><p>One for every mood. <br/>Click an emoji to get a closer look.</p></div>
          <div className="library-workbench">
            <div className="library-browser">
              <div className="browser-title"><span>All the little things</span><span className="count-pill">{catalog.length.toLocaleString("en-US")} base emoji</span></div>
              <EmojiPicker onSelect={selectEmoji} assetBaseUrl={LOCAL_ASSETS} size={128} skinTone={tone} onSkinToneChange={setTone} selectedId={selected.id} showBranding={false} label="Explore the emoji collection" />
              <div className="browser-bottom"><span><i/> Original artwork by <a href="https://cursor.style/?utm_source=emoji-composer&utm_medium=demo&utm_campaign=emoji-catalog" target="_blank" rel="noopener noreferrer">Cursor Style ↗</a></span><span>Made for your next idea.</span></div>
            </div>
            <aside className="emoji-detail" aria-label="Selected emoji details">
              <div className={`detail-stage${darkPreview ? " is-dark" : ""}`}>
                <span className="detail-stage-label">A CLOSER LOOK</span>
                <button className="preview-theme" type="button" onClick={() => setDarkPreview(!darkPreview)} aria-label={darkPreview ? "Use light preview background" : "Use dark preview background"} title="Change preview background"><span aria-hidden="true">{darkPreview ? "☀" : "◐"}</span></button>
                <div className="detail-image-viewport" ref={previewRef}><div className="detail-image-canvas">
                  {copyMethod === "package" && copyFormat === "HTML"
                    ? createElement("cs-emoji", { name: selected.id, size: String(size), tone: selectedTone ?? "original", "base-url": LOCAL_ASSETS })
                    : <Emoji name={selected.id} size={size} skinTone={selectedTone} assetBaseUrl={LOCAL_ASSETS} />}
                </div></div>
                <span className="transparency-label"><span/> {size} × {size} px · 1:1{size > 128 ? " · scroll to explore" : ""}</span>
              </div>
              <div className="detail-content">
                <div className="detail-category">{selected.category}</div>
                <h3>{selected.name}<span className="unicode-glyph" title="Unicode character">{selectedText}</span></h3>
                <div className="detail-tones">
                  <span className="field-label">{selected.supportsSkinTone ? "MAKE IT YOURS" : "ORIGINAL COLOR"}</span>
                  {selected.supportsSkinTone ? <div className="tone-thumbnails" aria-label="Preview skin tones">{toneChoices.map(choice => <button type="button" key={choice.id ?? "original"} aria-label={`Preview ${choice.label.toLowerCase()}`} aria-pressed={tone === choice.id} onClick={() => { setTone(choice.id); setCopyStatus(""); }}><img src={asset(selected, 64, choice.id)} alt=""/></button>)}</div> : <p className="no-tones">This emoji is already its colorful self.</p>}
                </div>
                <div className="size-heading"><span className="field-label">IMAGE SIZE</span><span>{size} × {size} px</span></div>
                <div className="size-options" aria-label="PNG image size">{EMOJI_ASSET_SIZES.map(option => <button type="button" key={option} aria-pressed={size === option} onClick={() => { setSize(option); setCopyStatus(""); }}>{option}</button>)}</div>
                <div className="embed-options">
                  <span className="field-label">USE THIS EMOJI</span>
                  <div className="embed-methods" role="group" aria-label="Integration method">
                    <button type="button" aria-pressed={copyMethod === "direct"} onClick={() => { setCopyMethod("direct"); setCopyFormat("HTML"); setCopyStatus(""); }}>Direct image</button>
                    <button type="button" aria-pressed={copyMethod === "package"} onClick={() => { setCopyMethod("package"); setCopyFormat("HTML"); setCopyStatus(""); }}>Package tag</button>
                  </div>
                  <div className="copy-formats" style={{ gridTemplateColumns: `repeat(${copyMethod === "direct" ? 4 : 3}, minmax(0, 1fr))` }} role="group" aria-label="Copy format">{(copyMethod === "direct" ? copyFormats : packageFormats).map(format => <button type="button" key={format} aria-pressed={copyFormat === format} onClick={() => { setCopyFormat(format); setCopyStatus(""); }}>{format}</button>)}</div>
                  {copyMethod === "package" && <details className="embed-setup"><summary>1. One-time setup</summary><pre className="embed-code"><code>{setupValues[copyFormat]}</code></pre><button type="button" onClick={copySetup}>Copy setup <CopyIcon/></button></details>}
                  <pre className="embed-code" aria-label={`${copyFormat} to copy`} tabIndex={0}><code>{usageCode}</code></pre>
                  <p className="embed-help">{copyMethod === "package" ? "Add the setup once, then use this tag anywhere on your page." : copyFormat === "Unicode" ? "Plain text emoji. Your device chooses its appearance." : copyFormat === "URL" ? "A direct PNG link for apps that accept image URLs." : "No setup needed. Paste this image tag into your page."}</p>
                </div>
                <div className="detail-actions"><button className="button copy-button" type="button" onClick={copyEmoji}><CopyIcon/> Copy {copyFormat}</button><a className="button download-button" href={asset(selected, size, selectedTone)} download={`cursor-style-${size}-${selectedFile}`} aria-label={`Download ${selected.name} PNG at ${size} pixels`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/></svg> PNG</a></div>
                <div className="copy-status" role="status">{copyStatus || "Tiny in pixels. Big on personality."}</div>
              </div>
            </aside>
          </div>
        </section>

        <section className="playground-section wrap" id="playground" aria-labelledby="playground-title">
          <div className="playground-copy"><div className="eyebrow">TAKE THEM FOR A SPIN</div><h2 id="playground-title">Good words.<br/>Great company.</h2><p>A hello, a thank you, a just-because.<br/>Give your next message a little personality.</p><div className="mini-emoji-row" aria-hidden="true">{["1f60a", "1f44b", "1f496", "1f389"].map(id => <img key={id} src={asset(id,128)} alt="" loading="lazy"/>)}</div></div>
          <div className="composer-card"><div className="composer-card-top"><span className="conversation-avatar">Y</span><div><strong>Your little corner</strong><span>Go on, say something nice.</span></div><span className="live-label"><i/> Live playground</span></div><div className="conversation-bubble">Some things are better said with an emoji.<img src={asset("1f60a",64)} alt="smile"/></div><EmojiComposer value={message} onChange={setMessage} assetBaseUrl={LOCAL_ASSETS} placeholder="Write something nice…" rows={3}/><div className="composer-note"><span>Click the smile to find your finishing touch.</span><span>↵ Make it yours</span></div></div>
        </section>

        <section className="integrate-section wrap" id="integrate" aria-labelledby="integrate-title"><div><div className="eyebrow">SMALL COMPONENT. SO MANY POSSIBILITIES.</div><h2 id="integrate-title">A little joy,<br/>in your next project.</h2><p>A searchable picker. A ready-to-use composer.<br/>Original artwork, right at your fingertips.</p><div className="integration-tags"><span>React</span><span>TypeScript</span><span>Custom asset host</span></div><small className="release-note">Free to use · MIT licensed · Made by Cursor Style.</small></div><div className="code-card"><div className="code-title"><span><i/><i/><i/></span><span>YourNextIdea.tsx</span><button type="button" onClick={copyCode} aria-label="Copy React example">{codeCopied ? "Copied ✓" : <CopyIcon/>}</button></div><pre><code><span className="code-keyword">import</span> {"{ EmojiPicker } "}<span className="code-keyword">from</span> <span className="code-string">"emoji-composer"</span>;{"\n"}<span className="code-keyword">import</span> <span className="code-string">"emoji-composer/styles.css"</span>;{"\n\n"}<span className="code-tag">&lt;EmojiPicker</span>{"\n  "}<span className="code-prop">onSelect</span>{"={(emoji) => console.log(emoji.text)}\n"}<span className="code-tag">/&gt;</span></code></pre><div className="code-bottom"><span className="code-dot"/> A few lines. A lot more expression.</div></div></section>
      </main>

      <footer className="demo-footer wrap"><a className="footer-brand" href="#top">emoji composer<span>Made to make you smile.</span></a><span>A little creation by <a href="https://cursor.style/?utm_source=emoji-composer&utm_medium=demo&utm_campaign=emoji-catalog" target="_blank" rel="noopener noreferrer">Cursor Style <Arrow diagonal/></a></span><a href="#top" className="back-top">Back to top ↑</a></footer>
    </div>
  );
}
