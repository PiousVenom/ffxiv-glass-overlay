import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CustomSelect } from '../../ui/CustomSelect';

import styles from './GeneralSettings.module.css';

import type {
  Settings as SettingsType,
  ShortNameFormat,
  ThemeType,
  BlurMode,
  FooterPosition,
  LayoutMode,
  Language,
  SelectOption,
} from '../../../types';

interface GeneralSettingsProps {
  settings: SettingsType;
  detectedPlayerName: string | null;
  onGeneralChange: <K extends keyof SettingsType['general']>(
    key: K,
    value: SettingsType['general'][K]
  ) => void;
  onDisplayChange: <K extends keyof SettingsType['display']>(
    key: K,
    value: SettingsType['display'][K]
  ) => void;
  onBehaviorChange: <K extends keyof SettingsType['behavior']>(
    key: K,
    value: SettingsType['behavior'][K]
  ) => void;
}

export function GeneralSettings({
  settings,
  detectedPlayerName,
  onGeneralChange,
  onDisplayChange,
  onBehaviorChange,
}: GeneralSettingsProps) {
  const { t } = useTranslation();

  const shortNameOptions = useMemo<SelectOption<ShortNameFormat>[]>(
    () => [
      { value: 'none', label: t('settings.options.nameFormats.none') },
      { value: 'first', label: t('settings.options.nameFormats.first') },
      { value: 'last', label: t('settings.options.nameFormats.last') },
      { value: 'initials', label: t('settings.options.nameFormats.initials') },
    ],
    [t]
  );

  const themeOptions = useMemo<SelectOption<ThemeType>[]>(
    () => [
      { value: 'default', label: t('settings.options.themes.default') },
      { value: 'dark', label: t('settings.options.themes.dark') },
      { value: 'light', label: t('settings.options.themes.light') },
    ],
    [t]
  );

  const blurOptions = useMemo<SelectOption<BlurMode>[]>(
    () => [
      { value: 'none', label: t('settings.options.blurModes.none') },
      { value: 'all', label: t('settings.options.blurModes.all') },
      { value: 'others', label: t('settings.options.blurModes.others') },
    ],
    [t]
  );

  const footerPositionOptions = useMemo<SelectOption<FooterPosition>[]>(
    () => [
      { value: 'bottom', label: t('settings.options.footerPositions.bottom') },
      { value: 'top', label: t('settings.options.footerPositions.top') },
    ],
    [t]
  );

  const layoutOptions = useMemo<SelectOption<LayoutMode>[]>(
    () => [
      { value: 'vertical', label: t('settings.options.layouts.vertical') },
      { value: 'horizontal', label: t('settings.options.layouts.horizontal') },
    ],
    [t]
  );

  const languageOptions = useMemo<SelectOption<Language>[]>(
    () => [
      { value: 'en', label: t('settings.options.languages.en') },
      { value: 'ja', label: t('settings.options.languages.ja') },
      { value: 'de', label: t('settings.options.languages.de') },
      { value: 'fr', label: t('settings.options.languages.fr') },
      { value: 'cn', label: t('settings.options.languages.cn') },
    ],
    [t]
  );

  return (
    <>
      <div className={styles.settingGroup}>
        <label className={styles.settingGroupLabel}>{t('settings.groups.playerIdentity')}</label>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.yourName')}</label>
          <input
            type="text"
            value={settings.general.playerName}
            onChange={(e) => onGeneralChange('playerName', e.target.value)}
            placeholder="Character name"
            maxLength={50}
            aria-label="Character name"
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.autoDetectName')}</label>
          <input
            type="checkbox"
            checked={settings.general.autoDetectName}
            onChange={(e) => onGeneralChange('autoDetectName', e.target.checked)}
          />
        </div>
        {settings.general.autoDetectName && detectedPlayerName && (
          <div className={styles.settingItemHint}>
            <span className={styles.detectedName}>
              {t('settings.labels.detected')}: {detectedPlayerName}
            </span>
          </div>
        )}
      </div>

      <div className={styles.settingGroup}>
        <label className={styles.settingGroupLabel}>{t('settings.groups.appearance')}</label>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.theme')}</label>
          <CustomSelect<ThemeType>
            value={settings.general.theme}
            options={themeOptions}
            onChange={(value) => onGeneralChange('theme', value)}
            ariaLabel="Select theme"
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.opacity')}</label>
          <div className={styles.sliderInput}>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.general.opacity}
              onChange={(e) => onGeneralChange('opacity', parseInt(e.target.value, 10))}
            />
            <span className={styles.sliderValue}>{settings.general.opacity}%</span>
          </div>
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.language')}</label>
          <CustomSelect<Language>
            value={settings.general.language}
            options={languageOptions}
            onChange={(value) => onGeneralChange('language', value)}
            ariaLabel="Select language"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <label className={styles.settingGroupLabel}>{t('settings.groups.display')}</label>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.showJobIcons')}</label>
          <input
            type="checkbox"
            checked={settings.display.showJobIcons}
            onChange={(e) => onDisplayChange('showJobIcons', e.target.checked)}
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.nameFormat')}</label>
          <CustomSelect<ShortNameFormat>
            value={settings.display.shortNames}
            options={shortNameOptions}
            onChange={(value) => onDisplayChange('shortNames', value)}
            ariaLabel="Select name format"
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.blurNames')}</label>
          <CustomSelect<BlurMode>
            value={settings.display.blurNames}
            options={blurOptions}
            onChange={(value) => onDisplayChange('blurNames', value)}
            ariaLabel="Select blur mode"
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.layout')}</label>
          <CustomSelect<LayoutMode>
            value={settings.display.layout}
            options={layoutOptions}
            onChange={(value) => onDisplayChange('layout', value)}
            ariaLabel="Select layout"
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.footerPosition')}</label>
          <CustomSelect<FooterPosition>
            value={settings.display.footerPosition}
            options={footerPositionOptions}
            onChange={(value) => onDisplayChange('footerPosition', value)}
            ariaLabel="Select footer position"
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <label className={styles.settingGroupLabel}>{t('settings.groups.behavior')}</label>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.allowCollapse')}</label>
          <input
            type="checkbox"
            checked={settings.behavior.collapsible}
            onChange={(e) => onBehaviorChange('collapsible', e.target.checked)}
          />
        </div>
      </div>

      <div className={styles.settingGroup}>
        <label className={styles.settingGroupLabel}>{t('settings.groups.numberFormatting')}</label>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.decimalPrecision')}</label>
          <div className={styles.numberInput}>
            <button
              type="button"
              onClick={() =>
                onGeneralChange(
                  'decimalPrecision',
                  Math.max(0, settings.general.decimalPrecision - 1)
                )
              }
              aria-label="Decrease precision"
            >
              −
            </button>
            <span className={styles.numberValue}>{settings.general.decimalPrecision}</span>
            <button
              type="button"
              onClick={() =>
                onGeneralChange(
                  'decimalPrecision',
                  Math.min(2, settings.general.decimalPrecision + 1)
                )
              }
              aria-label="Increase precision"
            >
              +
            </button>
          </div>
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.thousandSeparator')}</label>
          <input
            type="checkbox"
            checked={settings.general.useThousandSeparator}
            onChange={(e) => onGeneralChange('useThousandSeparator', e.target.checked)}
          />
        </div>
        <div className={styles.settingItem}>
          <label>{t('settings.labels.compactNumbers')}</label>
          <input
            type="checkbox"
            checked={settings.general.useCompactNumbers}
            onChange={(e) => onGeneralChange('useCompactNumbers', e.target.checked)}
          />
        </div>
        <div className={styles.settingItemHint}>
          <span className={styles.hintText}>{t('settings.hints.compactNumbers')}</span>
        </div>
      </div>
    </>
  );
}
