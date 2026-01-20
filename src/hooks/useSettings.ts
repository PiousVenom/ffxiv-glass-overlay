import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { loadSettings } from '../utils/settingsMigration';

import type { Settings } from '../types';

const STORAGE_KEY = 'glassOverlaySettings';

interface UseSettingsReturn {
  settings: Settings;
  saveSettings: (newSettings: Settings) => void;
  effectivePlayerName: string;
}

/**
 * Hook to manage settings with localStorage persistence
 */
export function useSettings(detectedPlayerName: string | null): UseSettingsReturn {
  const { i18n } = useTranslation();

  const [settings, setSettings] = useState<Settings>(() => loadSettings(STORAGE_KEY));

  // Sync i18n language with settings on load
  useEffect(() => {
    if (settings.general.language && i18n.language !== settings.general.language) {
      i18n.changeLanguage(settings.general.language);
    }
  }, [settings.general.language, i18n]);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  // Compute effective player name (auto-detected or manual)
  const effectivePlayerName = useMemo(() => {
    if (settings.general.autoDetectName && detectedPlayerName) {
      return detectedPlayerName;
    }
    return settings.general.playerName;
  }, [settings.general.autoDetectName, settings.general.playerName, detectedPlayerName]);

  return { settings, saveSettings, effectivePlayerName };
}
