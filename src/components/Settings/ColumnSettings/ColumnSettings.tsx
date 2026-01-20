import { useTranslation } from 'react-i18next';

import styles from './ColumnSettings.module.css';

import type { Settings as SettingsType, ViewColumnSettings } from '../../../types';

interface ColumnSettingsProps {
  settings: SettingsType;
  view: 'dps' | 'heal' | 'tank';
  onColumnChange: (
    view: 'dps' | 'heal' | 'tank',
    key: keyof ViewColumnSettings,
    value: boolean
  ) => void;
}

export function ColumnSettings({ settings, view, onColumnChange }: ColumnSettingsProps) {
  const { t } = useTranslation();
  const columns = settings.columns[view];
  const isHealTab = view === 'heal';

  return (
    <div className={styles.settingGroup}>
      <label className={styles.settingGroupLabel}>{t('settings.groups.columns')}</label>
      <div className={styles.settingItem}>
        <label>
          {isHealTab ? t('settings.labels.healPercent') : t('settings.labels.dmgPercent')}
        </label>
        <input
          type="checkbox"
          checked={columns.showDmgPercent}
          onChange={(e) => onColumnChange(view, 'showDmgPercent', e.target.checked)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('settings.labels.critPercent')}</label>
        <input
          type="checkbox"
          checked={columns.showCritPercent}
          onChange={(e) => onColumnChange(view, 'showCritPercent', e.target.checked)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('settings.labels.directHitPercent')}</label>
        <input
          type="checkbox"
          checked={columns.showDHPercent}
          onChange={(e) => onColumnChange(view, 'showDHPercent', e.target.checked)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('settings.labels.critDirectHitPercent')}</label>
        <input
          type="checkbox"
          checked={columns.showCDHPercent}
          onChange={(e) => onColumnChange(view, 'showCDHPercent', e.target.checked)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{isHealTab ? t('settings.labels.maxHeal') : t('settings.labels.maxHit')}</label>
        <input
          type="checkbox"
          checked={columns.showMaxHit}
          onChange={(e) => onColumnChange(view, 'showMaxHit', e.target.checked)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('settings.labels.deaths')}</label>
        <input
          type="checkbox"
          checked={columns.showDeaths}
          onChange={(e) => onColumnChange(view, 'showDeaths', e.target.checked)}
        />
      </div>
      {isHealTab && (
        <>
          <div className={styles.settingItem}>
            <label>{t('settings.labels.overhealPercent')}</label>
            <input
              type="checkbox"
              checked={columns.showOverheal}
              onChange={(e) => onColumnChange(view, 'showOverheal', e.target.checked)}
            />
          </div>
          <div className={styles.settingItem}>
            <label>{t('settings.labels.effectiveHPS')}</label>
            <input
              type="checkbox"
              checked={columns.showEffectiveHPS}
              onChange={(e) => onColumnChange(view, 'showEffectiveHPS', e.target.checked)}
            />
          </div>
        </>
      )}
      <div className={styles.settingItem}>
        <label>{t('settings.labels.last30s')}</label>
        <input
          type="checkbox"
          checked={columns.showLast30s}
          onChange={(e) => onColumnChange(view, 'showLast30s', e.target.checked)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('settings.labels.last60s')}</label>
        <input
          type="checkbox"
          checked={columns.showLast60s}
          onChange={(e) => onColumnChange(view, 'showLast60s', e.target.checked)}
        />
      </div>
    </div>
  );
}
