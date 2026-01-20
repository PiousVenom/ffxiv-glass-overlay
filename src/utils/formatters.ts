import type { ShortNameFormat } from '../types';

/**
 * Parse a value to a number, returning 0 if invalid
 */
export function parseNumericValue(value: string | number | null | undefined): number {
  return parseFloat(String(value)) || 0;
}

/**
 * Format numbers with configurable precision and separators
 */
export function formatNumber(
  num: number | string | null | undefined,
  options?: {
    decimalPrecision?: number;
    useThousandSeparator?: boolean;
    useCompactNumbers?: boolean;
  }
): string {
  const n = parseNumericValue(num);
  const precision = options?.decimalPrecision ?? 0;
  const useSeparator = options?.useThousandSeparator ?? true;
  const useCompact = options?.useCompactNumbers ?? false;

  // Compact format: 32388.15 -> 32.39k
  if (useCompact) {
    if (n >= 1_000_000) {
      const m = n / 1_000_000;
      return `${m.toFixed(precision)}M`;
    }
    if (n >= 1_000) {
      const k = n / 1_000;
      return `${k.toFixed(precision)}k`;
    }
    return n.toFixed(precision);
  }

  if (useSeparator) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  }

  return n.toFixed(precision);
}

/**
 * Format a percentage value (removes trailing %)
 */
export function formatPercent(
  value: string | number | null | undefined,
  options?: {
    decimalPrecision?: number;
  }
): string {
  if (typeof value === 'string') {
    // Remove % if present and parse
    const numStr = value.replace('%', '').trim();
    const num = parseFloat(numStr) || 0;
    const precision = options?.decimalPrecision ?? 0;
    return `${num.toFixed(precision)}%`;
  }
  const num = parseNumericValue(value);
  const precision = options?.decimalPrecision ?? 0;
  return `${num.toFixed(precision)}%`;
}

/**
 * Format max hit string (e.g., "12345-Skill Name" -> "12.3K")
 */
export function formatMaxHit(
  maxHit: string | null | undefined,
  options?: {
    useThousandSeparator?: boolean;
  }
): string {
  if (!maxHit) return '-';

  // Max hit format is typically "12345-Skill Name"
  const parts = maxHit.split('-');
  if (parts.length === 0) return '-';

  const num = parseNumericValue(parts[0]);
  if (num === 0) return '-';

  // Format as K for thousands
  if (num >= 1000) {
    const k = num / 1000;
    return `${k.toFixed(1)}K`;
  }

  return formatNumber(num, options);
}

/**
 * Calculate effective healing percentage (100% - overheal%)
 */
export function calculateEffectiveHealPct(
  healed: string | number | null | undefined,
  overheal: string | number | null | undefined
): number {
  const healedNum = parseNumericValue(healed);
  const overhealNum = parseNumericValue(overheal);

  if (healedNum <= 0) return 0;
  return Math.max(0, 100 - (overhealNum / healedNum) * 100);
}

/**
 * Format player names based on shortNames setting
 */
export function formatName(
  name: string | null | undefined,
  shortNames?: ShortNameFormat,
  playerName: string = 'YOU'
): string {
  if (!name) return '';

  // Always show "YOU" for the player
  if (name.toLowerCase() === 'you' || name.toLowerCase() === playerName?.toLowerCase()) {
    return 'YOU';
  }

  switch (shortNames) {
    case 'first':
      return name.split(' ')[0];
    case 'last': {
      const parts = name.split(' ');
      return parts[parts.length - 1];
    }
    case 'initials':
      return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase();
    default:
      return name;
  }
}

/**
 * Apply blur CSS class based on blur mode and player name
 */
export function shouldBlurName(
  name: string | null | undefined,
  blurMode: 'none' | 'all' | 'others',
  playerName: string
): boolean {
  if (blurMode === 'none') return false;
  if (blurMode === 'all') return true;

  // 'others' - blur everyone except the player
  const lowerName = name?.toLowerCase();
  return lowerName !== 'you' && lowerName !== playerName.toLowerCase();
}

/**
 * Parse duration string (MM:SS or HH:MM:SS) to seconds
 */
export function parseDuration(duration: string | null | undefined): number {
  if (!duration) return 0;

  const parts = duration.split(':').map((p) => parseInt(p, 10) || 0);

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }

  return 0;
}
