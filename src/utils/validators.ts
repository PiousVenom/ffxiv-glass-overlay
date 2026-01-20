/**
 * Runtime validation utilities for external data
 * Validates data from OverlayPlugin API and localStorage before type casting
 */

import type {
  ZoneChangeData,
  PrimaryPlayerData,
  InCombatData,
  PartyChangedData,
  AggroListData,
  RawCombatData,
  Settings,
} from '../types';

/**
 * Type guard for ZoneChangeData
 */
export function isZoneChangeData(data: unknown): data is ZoneChangeData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.zoneID === 'number' && typeof obj.zoneName === 'string';
}

/**
 * Type guard for PrimaryPlayerData
 */
export function isPrimaryPlayerData(data: unknown): data is PrimaryPlayerData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.charID === 'number' && typeof obj.charName === 'string';
}

/**
 * Type guard for InCombatData
 */
export function isInCombatData(data: unknown): data is InCombatData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.inACTCombat === 'boolean' && typeof obj.inGameCombat === 'boolean';
}

/**
 * Type guard for PartyChangedData
 */
export function isPartyChangedData(data: unknown): data is PartyChangedData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.party)) return false;
  if (typeof obj.partyType !== 'string') return false;

  const validPartyTypes = ['Solo', 'Party', 'AllianceA', 'AllianceB', 'AllianceC'];
  if (!validPartyTypes.includes(obj.partyType)) return false;

  // Validate party members have required fields
  return obj.party.every((member: unknown) => {
    if (!member || typeof member !== 'object') return false;
    const m = member as Record<string, unknown>;
    return (
      typeof m.id === 'string' &&
      typeof m.name === 'string' &&
      typeof m.worldId === 'number' &&
      typeof m.job === 'number' &&
      typeof m.level === 'number' &&
      typeof m.inParty === 'boolean'
    );
  });
}

/**
 * Type guard for AggroListData
 */
export function isAggroListData(data: unknown): data is AggroListData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.Entries)) return false;

  // Validate entries have required fields
  const entriesValid = obj.Entries.every((entry: unknown) => {
    if (!entry || typeof entry !== 'object') return false;
    const e = entry as Record<string, unknown>;
    return (
      typeof e.ID === 'number' &&
      typeof e.Name === 'string' &&
      typeof e.Enmity === 'number' &&
      typeof e.isMe === 'boolean' &&
      typeof e.HateRate === 'number' &&
      typeof e.Job === 'number'
    );
  });

  if (!entriesValid) return false;

  // Target is optional but if present must have required fields
  if (obj.Target !== undefined) {
    if (typeof obj.Target !== 'object' || obj.Target === null) return false;
    const target = obj.Target as Record<string, unknown>;
    if (
      typeof target.ID !== 'number' ||
      typeof target.Name !== 'string' ||
      typeof target.CurrentHP !== 'number' ||
      typeof target.MaxHP !== 'number'
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Type guard for LogLine data
 */
export function isLogLineData(data: unknown): data is { line: string[] } {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return Array.isArray(obj.line) && obj.line.every((item) => typeof item === 'string');
}

/**
 * Type guard for RawCombatData
 * More lenient validation since this data has inconsistent casing from OverlayPlugin
 */
export function isRawCombatData(data: unknown): data is RawCombatData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  // Encounter is optional but if present must be an object
  if (
    obj.Encounter !== undefined &&
    (typeof obj.Encounter !== 'object' || obj.Encounter === null)
  ) {
    return false;
  }

  // Combatant is optional but if present must be an object (record of combatants)
  if (
    obj.Combatant !== undefined &&
    (typeof obj.Combatant !== 'object' || obj.Combatant === null)
  ) {
    return false;
  }

  return true;
}

/**
 * Validates Settings structure
 * Returns true if the data has the expected shape for Settings
 */
export function isSettings(data: unknown): data is Settings {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  // Check top-level sections exist and are objects
  const sections = ['general', 'display', 'behavior', 'columns', 'alerts', 'timers', 'history'];
  for (const section of sections) {
    if (typeof obj[section] !== 'object' || obj[section] === null) {
      return false;
    }
  }

  // Validate general section has required fields
  const general = obj.general as Record<string, unknown>;
  if (
    typeof general.playerName !== 'string' ||
    typeof general.autoDetectName !== 'boolean' ||
    typeof general.theme !== 'string' ||
    typeof general.opacity !== 'number' ||
    typeof general.language !== 'string'
  ) {
    return false;
  }

  // Validate display section
  const display = obj.display as Record<string, unknown>;
  if (
    typeof display.showJobIcons !== 'boolean' ||
    typeof display.shortNames !== 'string' ||
    typeof display.layout !== 'string' ||
    typeof display.footerPosition !== 'string' ||
    typeof display.blurNames !== 'string'
  ) {
    return false;
  }

  // Validate behavior section
  const behavior = obj.behavior as Record<string, unknown>;
  if (typeof behavior.collapsible !== 'boolean') {
    return false;
  }

  // Validate columns section has dps, heal, tank
  const columns = obj.columns as Record<string, unknown>;
  if (
    typeof columns.dps !== 'object' ||
    typeof columns.heal !== 'object' ||
    typeof columns.tank !== 'object'
  ) {
    return false;
  }

  // Validate alerts section
  const alerts = obj.alerts as Record<string, unknown>;
  if (typeof alerts.enabled !== 'boolean' || !Array.isArray(alerts.triggers)) {
    return false;
  }

  // Validate timers section
  const timers = obj.timers as Record<string, unknown>;
  if (
    typeof timers.enabled !== 'boolean' ||
    !Array.isArray(timers.trackedSkills) ||
    typeof timers.showOwnCooldowns !== 'boolean' ||
    typeof timers.showPartyCooldowns !== 'boolean'
  ) {
    return false;
  }

  // Validate history section
  const history = obj.history as Record<string, unknown>;
  if (
    typeof history.enabled !== 'boolean' ||
    typeof history.maxEntries !== 'number' ||
    typeof history.autoSaveOnZoneChange !== 'boolean'
  ) {
    return false;
  }

  return true;
}

/**
 * Type guard for EncounterHistoryEntry array
 * Validates structure and that data field contains RawCombatData-like structure
 */
export function isEncounterHistoryArray(
  data: unknown
): data is import('../types').EncounterHistoryEntry[] {
  if (!Array.isArray(data)) return false;

  return data.every((entry: unknown) => {
    if (!entry || typeof entry !== 'object') return false;
    const e = entry as Record<string, unknown>;

    // Validate required fields
    if (
      typeof e.id !== 'string' ||
      typeof e.timestamp !== 'number' ||
      typeof e.title !== 'string' ||
      typeof e.duration !== 'string' ||
      typeof e.zone !== 'string'
    ) {
      return false;
    }

    // Validate data field contains RawCombatData structure
    if (!e.data || typeof e.data !== 'object') return false;

    return isRawCombatData(e.data);
  });
}

/**
 * Generic validator type for use with SettingsStorage
 */
export type Validator<T> = (data: unknown) => data is T;
