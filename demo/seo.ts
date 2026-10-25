export const pageUrl = "https://cursor.style/emoji/";
export const pageTitle = "Free 3D Emoji PNGs & React Emoji Picker | Cursor Style";
export const pageDescription = "Download 3,963 free 3D emoji PNGs with transparent backgrounds, five skin tones and sizes up to 1024 px. Add them with HTML, React or PHP.";
export const faq = [
  { question: "Are these emoji PNGs free for commercial use?", answer: "Yes. Cursor Style's original AI-generated emoji artwork and package code use the MIT License. You can use them in personal and commercial projects. Public credit is appreciated but optional. Keep the MIT copyright and license notice when redistributing copies or substantial portions. The license is included with the packages and on GitHub." },
  { question: "How do I download an emoji with a transparent background?", answer: "Choose an emoji, select a skin tone when available, choose an image size, and click PNG. All images are transparent PNG files. The eight sizes are 16, 24, 32, 64, 128, 256, 512 and 1024 pixels." },
  { question: "Why does a copied Unicode emoji look different?", answer: "Unicode text uses the emoji font on the receiving device. To keep the Cursor Style artwork, choose Direct image and copy an HTML image tag or PNG URL, or choose Package tag and use the HTML element, React component or PHP helper." },
  { question: "Can I use the emoji picker in React?", answer: "Yes. Install emoji-composer from npm, import EmojiPicker or EmojiComposer, and import emoji-composer/styles.css. The picker supports search, categories and skin tones. The separate Emoji component displays a single artwork and does not need the picker stylesheet." },
  { question: "Can I add emoji to HTML or a PHP website?", answer: "For plain HTML, use a direct image URL or load the web component script once and add a cs-emoji tag. For PHP 8.1 and later, install cursor-style/emoji with Composer and use EmojiCatalog::imageUrl() or imageTag(). Both approaches use the same PNG catalog." },
  { question: "What is included in the Unicode Emoji 18.0 collection?", answer: "The catalog contains 1,923 base emoji and 2,040 exact skin-tone sequences, for 3,963 original artworks. Supported people and gesture emoji have five skin tones. Exact mixed-tone Unicode sequences are available through the package APIs. This is original Cursor Style artwork, not an Apple or other platform emoji font." },
];

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://cursor.style/#organization", name: "Cursor Style", url: "https://cursor.style/" },
    { "@type": "WebSite", "@id": "https://cursor.style/#website", name: "Cursor Style", url: "https://cursor.style/", publisher: { "@id": "https://cursor.style/#organization" } },
    { "@type": "CollectionPage", "@id": pageUrl + "#webpage", url: pageUrl, name: pageTitle, description: pageDescription,
      inLanguage: "en", isPartOf: { "@id": "https://cursor.style/#website" },
      publisher: { "@id": "https://cursor.style/#organization" },
      mainEntity: { "@id": pageUrl + "#catalog" }, about: { "@id": pageUrl + "#software" },
      primaryImageOfPage: { "@id": pageUrl + "#social-image" }, breadcrumb: { "@id": pageUrl + "#breadcrumbs" } },
    { "@type": "ImageObject", "@id": pageUrl + "#social-image", contentUrl: pageUrl + "assets/social-v4.png", width: 1200, height: 630,
      caption: "Free 3D emoji PNGs by Cursor Style", creator: { "@id": "https://cursor.style/#organization" },
      license: "https://github.com/wonchoe/emoji-composer/blob/main/LICENSE" },
    { "@type": "Dataset", "@id": pageUrl + "#catalog", name: "Cursor Style Unicode Emoji 18.0 PNG Catalog", url: pageUrl,
      description: "1,923 base emoji and 2,040 exact skin-tone sequences, with transparent PNG artwork in eight sizes from 16 to 1024 pixels.",
      creator: { "@id": "https://cursor.style/#organization" }, license: "https://github.com/wonchoe/emoji-composer/blob/main/LICENSE",
      distribution: [
        { "@type": "DataDownload", contentUrl: "https://raw.githubusercontent.com/wonchoe/emoji-composer/main/data/emojis.json", encodingFormat: "application/json" },
        { "@type": "DataDownload", contentUrl: "https://raw.githubusercontent.com/wonchoe/emoji-composer/main/data/tone-variants.json", encodingFormat: "application/json" },
      ] },
    { "@type": "SoftwareSourceCode", "@id": pageUrl + "#software", name: "Emoji Composer", url: pageUrl + "#integrate",
      description: "React emoji picker, message composer, inline emoji component, HTML web element and PHP emoji catalog helper.",
      codeRepository: "https://github.com/wonchoe/emoji-composer", programmingLanguage: ["TypeScript", "JavaScript", "PHP"],
      license: "https://github.com/wonchoe/emoji-composer/blob/main/LICENSE", author: { "@id": "https://cursor.style/#organization" },
      sameAs: ["https://www.npmjs.com/package/emoji-composer", "https://packagist.org/packages/cursor-style/emoji"] },
    { "@type": "BreadcrumbList", "@id": pageUrl + "#breadcrumbs", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cursor Style", item: "https://cursor.style/" },
      { "@type": "ListItem", position: 2, name: "3D Emoji PNGs", item: pageUrl },
    ] },
  ],
};
