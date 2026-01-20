import type { Settings, LegacySettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import settingsStorage from '../services/SettingsStorage';

/**
 * Check if settings are in the legacy format
 */
export function isLegacySettings(settings: unknown): settings is LegacySettings {
  if (!settings || typeof settings !== 'object') return false;
  const s = settings as Record<string, unknown>;
  // Legacy settings have playerName at root level, new settings have general.playerName
  return typeof s.playerName === 'string' && !('general' in s);
}

/**
 * Migrate legacy settings to new format
 */
export function migrateLegacySettings(legacy: LegacySettings): Settings {
  return {
    general: {
      playerName: legacy.playerName || DEFAULT_SETTINGS.general.playerName,
      autoDetectName: DEFAULT_SETTINGS.general.autoDetectName,
      theme: DEFAULT_SETTINGS.general.theme,
      opacity: DEFAULT_SETTINGS.general.opacity,
      language: DEFAULT_SETTINGS.general.language,
      decimalPrecision: DEFAULT_SETTINGS.general.decimalPrecision,
      useThousandSeparator: DEFAULT_SETTINGS.general.useThousandSeparator,
      useCompactNumbers: DEFAULT_SETTINGS.general.useCompactNumbers,
    },
    display: {
      showJobIcons: legacy.showJobIcons ?? DEFAULT_SETTINGS.display.showJobIcons,
      shortNames: legacy.shortNames || DEFAULT_SETTINGS.display.shortNames,
      layout: DEFAULT_SETTINGS.display.layout,
      footerPosition: DEFAULT_SETTINGS.display.footerPosition,
      blurNames: DEFAULT_SETTINGS.display.blurNames,
    },
    behavior: {
      collapsible: DEFAULT_SETTINGS.behavior.collapsible,
    },
    columns: {
      dps: {
        ...DEFAULT_SETTINGS.columns.dps,
        showDmgPercent: legacy.showDmgPercent ?? DEFAULT_SETTINGS.columns.dps.showDmgPercent,
        showCritPercent: legacy.showCritPercent ?? DEFAULT_SETTINGS.columns.dps.showCritPercent,
        showDHPercent: legacy.showDHPercent ?? DEFAULT_SETTINGS.columns.dps.showDHPercent,
        showCDHPercent: legacy.showCDHPercent ?? DEFAULT_SETTINGS.columns.dps.showCDHPercent,
      },
      heal: {
        ...DEFAULT_SETTINGS.columns.heal,
        showDmgPercent: legacy.showDmgPercent ?? DEFAULT_SETTINGS.columns.heal.showDmgPercent,
        showCritPercent: legacy.showCritPercent ?? DEFAULT_SETTINGS.columns.heal.showCritPercent,
        showDHPercent: legacy.showDHPercent ?? DEFAULT_SETTINGS.columns.heal.showDHPercent,
        showCDHPercent: legacy.showCDHPercent ?? DEFAULT_SETTINGS.columns.heal.showCDHPercent,
      },
      tank: {
        ...DEFAULT_SETTINGS.columns.tank,
        showDmgPercent: legacy.showDmgPercent ?? DEFAULT_SETTINGS.columns.tank.showDmgPercent,
        showCritPercent: legacy.showCritPercent ?? DEFAULT_SETTINGS.columns.tank.showCritPercent,
        showDHPercent: legacy.showDHPercent ?? DEFAULT_SETTINGS.columns.tank.showDHPercent,
        showCDHPercent: legacy.showCDHPercent ?? DEFAULT_SETTINGS.columns.tank.showCDHPercent,
      },
    },
    alerts: { ...DEFAULT_SETTINGS.alerts },
    timers: { ...DEFAULT_SETTINGS.timers },
    history: { ...DEFAULT_SETTINGS.history },
  };
}

/**
 * Deep merge settings with defaults to ensure all fields exist
 */
export function mergeWithDefaults(settings: Partial<Settings>): Settings {
  return {
    general: {
      ...DEFAULT_SETTINGS.general,
      ...settings.general,
    },
    display: {
      ...DEFAULT_SETTINGS.display,
      ...settings.display,
    },
    behavior: {
      ...DEFAULT_SETTINGS.behavior,
      ...settings.behavior,
    },
    columns: {
      dps: {
        ...DEFAULT_SETTINGS.columns.dps,
        ...settings.columns?.dps,
      },
      heal: {
        ...DEFAULT_SETTINGS.columns.heal,
        ...settings.columns?.heal,
      },
      tank: {
        ...DEFAULT_SETTINGS.columns.tank,
        ...settings.columns?.tank,
      },
    },
    alerts: {
      ...DEFAULT_SETTINGS.alerts,
      ...settings.alerts,
    },
    timers: {
      ...DEFAULT_SETTINGS.timers,
      ...settings.timers,
    },
    history: {
      ...DEFAULT_SETTINGS.history,
      ...settings.history,
    },
  };
}

/**
 * Check if value is a valid object (not null, not array)
 */
function isValidObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Load and migrate settings from storage (synchronous - localStorage only)
 * Used for initial state in React
 */
export function loadSettings(storageKey: string): Settings {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return DEFAULT_SETTINGS;

    const parsed: unknown = JSON.parse(saved);

    // Validate parsed data is an object
    if (!isValidObject(parsed)) {
      console.warn('Invalid settings format in storage, using defaults');
      return DEFAULT_SETTINGS;
    }

    // Check if legacy format and migrate
    if (isLegacySettings(parsed)) {
      const migrated = migrateLegacySettings(parsed);
      // Save migrated settings
      localStorage.setItem(storageKey, JSON.stringify(migrated));
      return migrated;
    }

    // Merge with defaults to ensure all fields exist
    return mergeWithDefaults(parsed as Partial<Settings>);
  } catch (e) {
    console.warn('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Load settings asynchronously (tries OverlayPlugin first, then localStorage)
 */
export async function loadSettingsAsync(storageKey: string): Promise<Settings> {
  try {
    const saved = await settingsStorage.load<unknown>(storageKey);
    if (!saved) return DEFAULT_SETTINGS;

    // Validate saved data is an object
    if (!isValidObject(saved)) {
      console.warn('Invalid settings format in storage, using defaults');
      return DEFAULT_SETTINGS;
    }

    // Check if legacy format and migrate
    if (isLegacySettings(saved)) {
      const migrated = migrateLegacySettings(saved);
      // Save migrated settings
      await settingsStorage.save(storageKey, migrated);
      return migrated;
    }

    // Merge with defaults to ensure all fields exist
    return mergeWithDefaults(saved as Partial<Settings>);
  } catch (e) {
    console.warn('Failed to load settings async:', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings asynchronously (tries OverlayPlugin first, then localStorage)
 */
export async function saveSettingsAsync(storageKey: string, settings: Settings): Promise<boolean> {
  return settingsStorage.save(storageKey, settings);
}
