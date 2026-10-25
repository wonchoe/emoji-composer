<?php

declare(strict_types=1);

namespace CursorStyle\Emoji;

final class EmojiCatalog
{
    public const ASSET_BASE_URL = 'https://cursor.style/emoji/v2.0.0/png';
    public const SIZES = [16, 24, 32, 64, 128, 256, 512, 1024];
    public const TONES = ['light', 'medium-light', 'medium', 'medium-dark', 'dark'];

    private array $bases;
    private array $variants;
    private array $byId = [];
    private array $byGlyph = [];
    private array $variantById = [];
    private array $variantByGlyph = [];
    private array $uniformTones = [];

    public function __construct(private readonly string $baseUrl = self::ASSET_BASE_URL)
    {
        $dataRoot = dirname(__DIR__, 2) . '/data/';
        $this->bases = self::readJson($dataRoot . 'emojis.json');
        $this->variants = self::readJson($dataRoot . 'tone-variants.json');
        $aliases = self::readJson($dataRoot . 'tone-aliases.json');
        foreach ($this->bases as $record) {
            $this->byId[self::normalize($record['id'])] = $record;
            $this->byGlyph[$record['emoji']] = $record;
        }
        $fallbacks = [];
        foreach ($this->variants as $variant) {
            $unicode = self::normalize($variant['unicode']);
            $this->variantById[$unicode] = $variant;
            $this->variantByGlyph[$variant['emoji']] = $variant;
            if (empty($variant['skinTones']) || count(array_unique($variant['skinTones'])) !== 1) continue;
            $tone = $variant['skinTones'][0];
            $parts = array_filter(explode('-', $unicode), static fn(string $part): bool => !in_array($part, ['1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff'], true));
            $base = implode('-', $parts);
            $direct = isset($this->byId[$base]) ? $base : (isset($this->byId[$base . '-fe0f']) ? $base . '-fe0f' : null);
            if ($direct !== null) {
                $this->uniformTones[$direct . ':' . $tone] = $variant;
                continue;
            }
            $root = self::normalize($aliases[$base]['packageBaseUnicode'] ?? $variant['baseUnicode']);
            $fallbacks[$root . ':' . $tone] ??= $variant;
        }
        $this->uniformTones += $fallbacks;
    }

    /** Base emoji in Unicode order; exact tone sequences are available via toneVariants(). */
    public function all(): array
    {
        return $this->bases;
    }

    public function toneVariants(): array
    {
        return $this->variants;
    }

    public function get(string $emoji): ?array
    {
        $query = trim($emoji);
        $id = self::normalize($query);
        return $this->variantByGlyph[$query] ?? $this->variantById[$id] ?? $this->byGlyph[$query] ?? $this->byId[$id] ?? null;
    }

    public function find(string $query, int $limit = 60): array
    {
        $query = trim($query);
        if ($query === '' || $limit <= 0) return [];
        if (($exact = $this->get($query)) !== null) return [$exact];
        $matches = [];
        $needle = strtolower($query);
        foreach ([$this->bases, $this->variants] as $records) {
            foreach ($records as $record) {
                if (!str_contains(strtolower($record['name'] . ' ' . $record['category']), $needle)) continue;
                $matches[] = $record;
                if (count($matches) >= $limit) return $matches;
            }
        }
        return $matches;
    }

    public function imageUrl(string $emoji, int $size = 64, string $tone = 'original'): string
    {
        if (!in_array($size, self::SIZES, true)) throw new \InvalidArgumentException('Unsupported emoji size: ' . $size);
        if ($tone !== 'original' && !in_array($tone, self::TONES, true)) throw new \InvalidArgumentException('Unsupported skin tone: ' . $tone);
        $record = $this->get($emoji);
        if ($record === null) throw new \InvalidArgumentException('Emoji is not present in this catalog: ' . $emoji);
        if (!isset($record['baseUnicode']) && $tone !== 'original' && $record['supportsSkinTone']) {
            $record = $this->uniformTones[self::normalize($record['id']) . ':' . $tone] ?? $record;
        }
        return rtrim($this->baseUrl, '/') . '/' . $size . '/' . rawurlencode($record['file']);
    }

    private static function readJson(string $path): array
    {
        $json = file_get_contents($path);
        if ($json === false) throw new \RuntimeException('Could not load emoji catalog: ' . $path);
        return json_decode($json, true, 512, JSON_THROW_ON_ERROR);
    }

    private static function normalize(string $id): string
    {
        $id = strtolower(trim($id));
        $id = preg_replace('/^emoji-/', '', $id) ?? $id;
        return preg_replace('/\s+/', '-', str_replace(['u+', '_'], ['', '-'], $id)) ?? $id;
    }
}
