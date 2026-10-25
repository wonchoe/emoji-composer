#!/usr/bin/env python3
"""Sync the composer package's searchable data from the reviewed Unicode catalog."""

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CATALOG = ROOT.parent / "emoji-catalog" / "review-package" / "data" / "catalog.json"
DEFAULT_TONE_REQUESTS = ROOT.parent / "emoji-catalog" / "review-package" / "data" / "unicode-18-tone-request-review.jsonl"
DEFAULT_TONE_ALIASES = ROOT.parent / "emoji-catalog" / "review-package" / "data" / "tone-reference-aliases.json"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, default=DEFAULT_CATALOG)
    parser.add_argument("--tone-requests", type=Path, default=DEFAULT_TONE_REQUESTS)
    parser.add_argument("--tone-aliases", type=Path, default=DEFAULT_TONE_ALIASES)
    args = parser.parse_args()

    catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    tone_aliases = json.loads(args.tone_aliases.read_text(encoding="utf-8"))
    tone_roots = set()
    for line in args.tone_requests.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        row = json.loads(line)
        review = row.get("review", {})
        if review.get("baseUnicode"):
            tone_roots.add(review["baseUnicode"].lower())
    tone_roots.update(alias.lower() for alias in tone_aliases)

    emojis = [
        {
            "id": item["unicode"].lower(),
            "unicode": item["unicode"].lower(),
            "emoji": item["emoji"],
            "name": item["name"],
            "category": item["category"],
            "subcategory": item["subcategory"],
            "supportsSkinTone": item["unicode"].lower() in tone_roots,
            "file": item["file"],
        }
        for item in catalog["emojis"]
    ]
    tone_variants = [
        {
            "emoji": item["emoji"],
            "unicode": item["unicode"].lower(),
            "baseUnicode": item["baseUnicode"].lower(),
            "skinTones": [tone.lower() for tone in item["skinTones"]],
            "file": item["file"],
            "name": item["name"],
            "category": item["category"],
            "subcategory": item["subcategory"],
        }
        for item in catalog.get("toneVariants", [])
    ]

    data = ROOT / "data"
    data.mkdir(exist_ok=True)
    (data / "emojis.json").write_text(json.dumps(emojis, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    (data / "tone-variants.json").write_text(json.dumps(tone_variants, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    (data / "tone-aliases.json").write_text(json.dumps(tone_aliases, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Synced {len(emojis)} base emoji records, {len(tone_variants)} reviewed tone variants, and {len(tone_aliases)} Unicode aliases.")


if __name__ == "__main__":
    main()
