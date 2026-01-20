import { useTranslation } from 'react-i18next';

import styles from './TimerSettingsTab.module.css';

import type { TimerSettings } from '../../../types';

interface TimerSettingsTabProps {
  settings: TimerSettings;
  onTimerChange: <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => void;
}

export function TimerSettingsTab({ settings, onTimerChange }: TimerSettingsTabProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.settingGroup}>
        <label className={styles.settingGroupLabel}>{t('settings.groups.timerSettings')}</label>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.enableTimers')}</label>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onTimerChange('enabled', e.target.checked)}
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.showOwnCooldowns')}</label>
          <input
            type="checkbox"
            checked={settings.showOwnCooldowns}
            onChange={(e) => onTimerChange('showOwnCooldowns', e.target.checked)}
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.showPartyCooldowns')}</label>
          <input
            type="checkbox"
            checked={settings.showPartyCooldowns}
            onChange={(e) => onTimerChange('showPartyCooldowns', e.target.checked)}
          />
        </div>
      </div>
      <div className={styles.settingGroup}>
        <p className={styles.settingHint}>{t('settings.timerHint')}</p>
      </div>
    </>
  );
}
