import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Footer.module.css';

import type { ViewType } from '../../types';
import { VIEW } from '../../types';

interface FooterProps {
  /** Current view type */
  currentView: ViewType;
  /** Callback when view changes */
  onViewChange: (view: ViewType) => void;
  /** Callback when settings button is clicked */
  onSettingsClick: () => void;
  /** Callback when collapse toggle is clicked (undefined if not collapsible) */
  onToggleCollapse?: () => void;
  /** Whether the overlay is currently collapsed */
  isCollapsed: boolean;
}

/**
 * Footer component with view tabs, clear button, and settings
 */
export function Footer({
  currentView,
  onViewChange,
  onSettingsClick,
  onToggleCollapse,
  isCollapsed,
}: FooterProps) {
  const { t } = useTranslation();

  // Memoize click handlers to prevent unnecessary re-renders
  const handleDpsClick = useCallback(() => onViewChange(VIEW.DPS), [onViewChange]);
  const handleHealClick = useCallback(() => onViewChange(VIEW.HEAL), [onViewChange]);
  const handleTankClick = useCallback(() => onViewChange(VIEW.TANK), [onViewChange]);
  const handleRaidClick = useCallback(() => onViewChange(VIEW.RAID), [onViewChange]);
  const handleAggroClick = useCallback(() => onViewChange(VIEW.AGGRO), [onViewChange]);

  return (
    <div className={styles.footer}>
      <div className={styles.roleTabs}>
        <button
          className={currentView === VIEW.DPS ? styles.roleTabActive : styles.roleTab}
          onClick={handleDpsClick}
        >
          {t('footer.dps')}
        </button>
        <button
          className={currentView === VIEW.HEAL ? styles.roleTabActive : styles.roleTab}
          onClick={handleHealClick}
        >
          {t('footer.heal')}
        </button>
        <button
          className={currentView === VIEW.TANK ? styles.roleTabActive : styles.roleTab}
          onClick={handleTankClick}
        >
          {t('footer.tank')}
        </button>
        <button
          className={currentView === VIEW.RAID ? styles.roleTabActive : styles.roleTab}
          onClick={handleRaidClick}
        >
          {t('footer.raid')}
        </button>
        <button
          className={currentView === VIEW.AGGRO ? styles.roleTabActive : styles.roleTab}
          onClick={handleAggroClick}
        >
          {t('footer.aggro')}
        </button>
      </div>
      <div className={styles.controls}>
        {onToggleCollapse && (
          <button
            className={styles.controlBtn}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? t('footer.expand') : t('footer.collapse')}
            title={isCollapsed ? t('footer.expand') : t('footer.collapse')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isCollapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        )}
        <button
          className={styles.controlBtn}
          onClick={onSettingsClick}
          aria-label={t('footer.settings')}
          title={t('footer.settings')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
