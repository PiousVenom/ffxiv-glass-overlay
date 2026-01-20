import type { RawCombatant, ViewColumnSettings, ViewType } from '../types';
import {
  formatNumber,
  formatPercent,
  formatMaxHit,
  calculateEffectiveHealPct,
  parseNumericValue,
} from './formatters';

export interface StatColumn {
  key: string;
  label: string;
}

export interface StatValue {
  key: string;
  value: string;
}

/**
 * Get the header labels based on view type
 */
export function getHeaderLabels(currentView: ViewType): { primary: string; dmgPercent: string } {
  switch (currentView) {
    case 'heal':
      return { primary: 'HPS', dmgPercent: 'HEAL %' };
    case 'tank':
      return { primary: 'TAKEN', dmgPercent: 'DMG %' };
    case 'raid':
      return { primary: 'DPS', dmgPercent: 'DMG %' };
    default:
      return { primary: 'DPS', dmgPercent: 'DMG %' };
  }
}

/**
 * Build dynamic stat column definitions based on view-specific settings
 */
export function buildStatColumns(
  columnSettings: ViewColumnSettings,
  currentView: ViewType
): StatColumn[] {
  const headerLabels = getHeaderLabels(currentView);
  const columns: StatColumn[] = [];

  if (columnSettings.showDmgPercent) {
    columns.push({ key: 'dmgPercent', label: headerLabels.dmgPercent });
  }
  if (columnSettings.showCritPercent) {
    columns.push({ key: 'critPercent', label: 'CH %' });
  }
  if (columnSettings.showDHPercent) {
    columns.push({ key: 'dhPercent', label: 'DH %' });
  }
  if (columnSettings.showCDHPercent) {
    columns.push({ key: 'cdhPercent', label: 'CDH %' });
  }
  if (columnSettings.showMaxHit) {
    columns.push({ key: 'maxHit', label: 'MAX' });
  }
  if (columnSettings.showDeaths) {
    columns.push({ key: 'deaths', label: 'DEATHS' });
  }
  if (columnSettings.showOverheal) {
    columns.push({ key: 'overheal', label: 'OH %' });
  }
  if (columnSettings.showEffectiveHPS) {
    columns.push({ key: 'effectiveHPS', label: 'EFF %' });
  }
  if (columnSettings.showLast30s) {
    columns.push({ key: 'last30s', label: '30s' });
  }
  if (columnSettings.showLast60s) {
    columns.push({ key: 'last60s', label: '60s' });
  }

  return columns;
}

/**
 * Get the damage/heal percentage based on view type
 */
function getDmgPercent(player: RawCombatant, currentView: ViewType): string {
  switch (currentView) {
    case 'heal':
      return player['healed%'] || '0%';
    case 'tank':
      return player.damage_taken_pct || '0%';
    default:
      return player['damage%'] || '0%';
  }
}

/**
 * Extract stat values from a player based on view-specific settings
 */
export function getStatValues(
  player: RawCombatant,
  columnSettings: ViewColumnSettings,
  currentView: ViewType,
  options?: {
    decimalPrecision?: number;
    useCompactNumbers?: boolean;
  }
): StatValue[] {
  const dmgPercent = getDmgPercent(player, currentView);
  const values: StatValue[] = [];
  const precision = options?.decimalPrecision ?? 0;
  const useCompact = options?.useCompactNumbers ?? false;

  if (columnSettings.showDmgPercent) {
    values.push({
      key: 'dmgPercent',
      value: formatPercent(dmgPercent, { decimalPrecision: precision }),
    });
  }
  if (columnSettings.showCritPercent) {
    values.push({
      key: 'critPercent',
      value: formatPercent(player['crithit%'], { decimalPrecision: precision }),
    });
  }
  if (columnSettings.showDHPercent) {
    values.push({
      key: 'dhPercent',
      value: formatPercent(player.DirectHitPct, { decimalPrecision: precision }),
    });
  }
  if (columnSettings.showCDHPercent) {
    values.push({
      key: 'cdhPercent',
      value: formatPercent(player.CritDirectHitPct, { decimalPrecision: precision }),
    });
  }
  if (columnSettings.showMaxHit) {
    const maxHit =
      currentView === 'heal' ? player.MAXHEAL || player.maxheal : player.MAXHIT || player.maxhit;
    values.push({ key: 'maxHit', value: formatMaxHit(maxHit) });
  }
  if (columnSettings.showDeaths) {
    values.push({ key: 'deaths', value: String(parseNumericValue(player.deaths)) });
  }
  if (columnSettings.showOverheal) {
    values.push({
      key: 'overheal',
      value: formatPercent(player.OverHealPct, { decimalPrecision: precision }),
    });
  }
  if (columnSettings.showEffectiveHPS) {
    const effectivePct = calculateEffectiveHealPct(player.healed, player.overHeal);
    values.push({ key: 'effectiveHPS', value: `${effectivePct.toFixed(precision)}%` });
  }
  if (columnSettings.showLast30s) {
    values.push({
      key: 'last30s',
      value: formatNumber(player.Last30DPS, {
        decimalPrecision: useCompact ? precision : 0,
        useCompactNumbers: useCompact,
      }),
    });
  }
  if (columnSettings.showLast60s) {
    values.push({
      key: 'last60s',
      value: formatNumber(player.Last60DPS, {
        decimalPrecision: useCompact ? precision : 0,
        useCompactNumbers: useCompact,
      }),
    });
  }

  return values;
}

/**
 * Get the column settings for the current view
 */
export function getColumnSettingsForView(
  columns: { dps: ViewColumnSettings; heal: ViewColumnSettings; tank: ViewColumnSettings },
  currentView: ViewType
): ViewColumnSettings {
  switch (currentView) {
    case 'heal':
      return columns.heal;
    case 'tank':
      return columns.tank;
    case 'raid':
      // Raid view uses DPS columns but condensed
      return columns.dps;
    default:
      return columns.dps;
  }
}
