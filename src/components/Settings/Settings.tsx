import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertSettingsComponent } from '../AlertSettings';
import { GeneralSettings } from './GeneralSettings';
import { ColumnSettings } from './ColumnSettings';
import { TimerSettingsTab } from './TimerSettingsTab';

import styles from './Settings.module.css';

import type {
  Settings as SettingsType,
  ViewColumnSettings,
  AlertSettings,
  TimerSettings,
} from '../../types';

type SettingsTab = 'general' | 'dps' | 'heal' | 'tank' | 'alerts' | 'timers';

interface SettingsProps {
  /** Current settings */
  settings: SettingsType;
  /** Callback when settings change */
  onSave: (settings: SettingsType) => void;
  /** Auto-detected player name from OverlayPlugin */
  detectedPlayerName: string | null;
  /** Optional callback to reset window size to defaults */
  onResetWindowSize?: () => void;
}

/**
 * Settings panel component with tabbed sections
 */
export function Settings({
  settings,
  onSave,
  detectedPlayerName,
  onResetWindowSize,
}: SettingsProps) {
  const { t, i18n } = useTranslation();
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Update nested settings and immediately save
  const updateGeneralSetting = useCallback(
    <K extends keyof SettingsType['general']>(key: K, value: SettingsType['general'][K]) => {
      const newSettings = {
        ...localSettings,
        general: { ...localSettings.general, [key]: value },
      };
      setLocalSettings(newSettings);
      onSave(newSettings);

      // Update i18n language when language setting changes
      if (key === 'language' && typeof value === 'string') {
        i18n.changeLanguage(value);
      }
    },
    [localSettings, onSave, i18n]
  );

  const updateDisplaySetting = useCallback(
    <K extends keyof SettingsType['display']>(key: K, value: SettingsType['display'][K]) => {
      const newSettings = {
        ...localSettings,
        display: { ...localSettings.display, [key]: value },
      };
      setLocalSettings(newSettings);
      onSave(newSettings);
    },
    [localSettings, onSave]
  );

  const updateBehaviorSetting = useCallback(
    <K extends keyof SettingsType['behavior']>(key: K, value: SettingsType['behavior'][K]) => {
      const newSettings = {
        ...localSettings,
        behavior: { ...localSettings.behavior, [key]: value },
      };
      setLocalSettings(newSettings);
      onSave(newSettings);
    },
    [localSettings, onSave]
  );

  const updateColumnSetting = useCallback(
    (view: 'dps' | 'heal' | 'tank', key: keyof ViewColumnSettings, value: boolean) => {
      const newSettings = {
        ...localSettings,
        columns: {
          ...localSettings.columns,
          [view]: { ...localSettings.columns[view], [key]: value },
        },
      };
      setLocalSettings(newSettings);
      onSave(newSettings);
    },
    [localSettings, onSave]
  );

  const updateAlertSettings = useCallback(
    (alerts: AlertSettings) => {
      const newSettings = {
        ...localSettings,
        alerts,
      };
      setLocalSettings(newSettings);
      onSave(newSettings);
    },
    [localSettings, onSave]
  );

  const updateTimerSettings = useCallback(
    <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => {
      const newSettings = {
        ...localSettings,
        timers: { ...localSettings.timers, [key]: value },
      };
      setLocalSettings(newSettings);
      onSave(newSettings);
    },
    [localSettings, onSave]
  );

  return (
    <div className={styles.settingsPanel}>
      <div className={styles.settingsHeader}>
        <span className={styles.settingsTitle}>{t('settings.title')}</span>
        {onResetWindowSize && (
          <button
            className={styles.resetButton}
            onClick={onResetWindowSize}
            title={t('settings.resetWindowSize')}
          >
            {t('settings.reset')}
          </button>
        )}
      </div>

      <div className={styles.settingsTabs}>
        <button
          className={activeTab === 'general' ? styles.settingsTabActive : styles.settingsTab}
          onClick={() => setActiveTab('general')}
        >
          {t('settings.tabs.general')}
        </button>
        <button
          className={activeTab === 'dps' ? styles.settingsTabActive : styles.settingsTab}
          onClick={() => setActiveTab('dps')}
        >
          {t('settings.tabs.dps')}
        </button>
        <button
          className={activeTab === 'heal' ? styles.settingsTabActive : styles.settingsTab}
          onClick={() => setActiveTab('heal')}
        >
          {t('settings.tabs.heal')}
        </button>
        <button
          className={activeTab === 'tank' ? styles.settingsTabActive : styles.settingsTab}
          onClick={() => setActiveTab('tank')}
        >
          {t('settings.tabs.tank')}
        </button>
        <button
          className={activeTab === 'alerts' ? styles.settingsTabActive : styles.settingsTab}
          onClick={() => setActiveTab('alerts')}
        >
          {t('settings.tabs.alerts')}
        </button>
        <button
          className={activeTab === 'timers' ? styles.settingsTabActive : styles.settingsTab}
          onClick={() => setActiveTab('timers')}
        >
          {t('settings.tabs.timers')}
        </button>
      </div>

      <div className={styles.settingsContent}>
        {activeTab === 'general' && (
          <GeneralSettings
            settings={localSettings}
            detectedPlayerName={detectedPlayerName}
            onGeneralChange={updateGeneralSetting}
            onDisplayChange={updateDisplaySetting}
            onBehaviorChange={updateBehaviorSetting}
          />
        )}
        {activeTab === 'dps' && (
          <ColumnSettings
            settings={localSettings}
            view="dps"
            onColumnChange={updateColumnSetting}
          />
        )}
        {activeTab === 'heal' && (
          <ColumnSettings
            settings={localSettings}
            view="heal"
            onColumnChange={updateColumnSetting}
          />
        )}
        {activeTab === 'tank' && (
          <ColumnSettings
            settings={localSettings}
            view="tank"
            onColumnChange={updateColumnSetting}
          />
        )}
        {activeTab === 'alerts' && (
          <AlertSettingsComponent settings={localSettings.alerts} onChange={updateAlertSettings} />
        )}
        {activeTab === 'timers' && (
          <TimerSettingsTab settings={localSettings.timers} onTimerChange={updateTimerSettings} />
        )}
      </div>
    </div>
  );
}
