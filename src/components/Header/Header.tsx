import { useTranslation } from 'react-i18next';

import { formatNumber } from '../../utils/formatters';

import styles from './Header.module.css';

import type { RawCombatData, ViewType, Settings } from '../../types';

interface HeaderProps {
  /** Combat data from OverlayPlugin */
  combatData: RawCombatData | null;
  /** Current view type */
  currentView: ViewType;
  /** User settings */
  settings: Settings;
}

/**
 * Header component displaying encounter info and raid totals
 */
export function Header({ combatData, currentView, settings }: HeaderProps) {
  const { t } = useTranslation();
  const encounter = combatData?.Encounter || {};

  const formatOptions = {
    decimalPrecision: settings.general.decimalPrecision,
    useThousandSeparator: settings.general.useThousandSeparator,
  };

  const getLabel = (): string => {
    switch (currentView) {
      case 'heal':
        return t('header.rhps');
      case 'tank':
        return t('header.rtps');
      case 'raid':
        return t('header.rdps');
      default:
        return t('header.rdps');
    }
  };

  const getValue = (): string => {
    switch (currentView) {
      case 'heal':
        return formatNumber(encounter.enchps ?? encounter.ENCHPS ?? 0, formatOptions);
      case 'tank':
        return formatNumber(encounter.damagetaken ?? 0, formatOptions);
      default:
        return formatNumber(encounter.encdps ?? encounter.ENCDPS ?? 0, formatOptions);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.encounterInfo}>
        <span className={styles.encounterName}>
          {encounter.title && encounter.CurrentZoneName
            ? `${encounter.title} - ${encounter.CurrentZoneName}`
            : t('header.waiting')}
        </span>
        <span className={styles.encounterDuration}>{encounter.duration || '00:00'}</span>
      </div>
      <div className={styles.totalDps}>
        <span className={styles.label}>{getLabel()}</span>
        <span className={styles.raidDpsValue}>{getValue()}</span>
      </div>
    </div>
  );
}
