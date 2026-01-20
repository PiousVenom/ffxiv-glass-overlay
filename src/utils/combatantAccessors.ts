import type { RawCombatant } from '../types';

/**
 * Utility functions for accessing RawCombatant properties
 * Handles OverlayPlugin's inconsistent casing (encdps vs ENCDPS, etc.)
 */

/**
 * Get encounter DPS (handles encdps/ENCDPS casing)
 */
export function getEncDps(player: RawCombatant): string | number {
  return player.encdps ?? player.ENCDPS ?? 0;
}

/**
 * Get encounter HPS (handles enchps/ENCHPS casing)
 */
export function getEncHps(player: RawCombatant): string | number {
  return player.enchps ?? player.ENCHPS ?? 0;
}

/**
 * Get job abbreviation (handles Job/job casing)
 */
export function getJobFromPlayer(player: RawCombatant): string {
  return player.Job || player.job || '';
}
