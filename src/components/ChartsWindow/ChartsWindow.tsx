import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { DpsChart, HpsChart } from '../charts';
import { CustomSelect } from '../ui/CustomSelect';
import { ErrorBoundary } from '../ErrorBoundary';
import { getJobAbbr } from '../../constants/Jobs';

import styles from './ChartsWindow.module.css';

import type { PerformancePoint, RawCombatData, SelectOption, Settings } from '../../types';

interface ChartsWindowProps {
  /** Whether the charts window should be open */
  isOpen: boolean;
  /** Performance data for charts */
  performanceData: PerformancePoint[];
  /** Current combat data for player list */
  combatData: RawCombatData | null;
  /** Current settings for theme */
  settings: Settings;
  /** The user's player name to default to */
  playerName: string;
  /** Callback when the window is closed */
  onClose: () => void;
}

/**
 * Charts window component that displays performance charts in a separate browser window
 */
export function ChartsWindow({
  isOpen,
  performanceData,
  combatData,
  settings,
  playerName,
  onClose,
}: ChartsWindowProps) {
  const { t } = useTranslation();
  const windowRef = useRef<Window | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Build player options from combat data
  const playerOptions = useMemo<SelectOption<string>[]>(() => {
    if (!combatData?.Combatant) return [];

    return Object.values(combatData.Combatant)
      .filter((c) => c.name && c.name !== 'Limit Break')
      .map((c) => ({
        value: c.name,
        label: c.name,
      }));
  }, [combatData]);

  // Get selected player's job
  const selectedPlayerJob = useMemo(() => {
    if (!selectedPlayer || !combatData?.Combatant) return '';
    const player = combatData.Combatant[selectedPlayer];
    return player ? getJobAbbr(player.Job || player.job) : '';
  }, [selectedPlayer, combatData]);

  // Auto-select the user's player, or first player if not found
  useEffect(() => {
    if (playerOptions.length > 0 && !selectedPlayer) {
      // Try to find the user's player in the list
      const userPlayer = playerOptions.find(
        (p) => p.value.toLowerCase() === playerName.toLowerCase() || p.value === 'YOU'
      );
      setSelectedPlayer(userPlayer ? userPlayer.value : playerOptions[0].value);
    }
  }, [playerOptions, selectedPlayer, playerName]);

  // Copy styles from parent window to popup
  const copyStyles = useCallback((targetDoc: Document) => {
    Array.from(document.styleSheets).forEach((styleSheet) => {
      try {
        if (styleSheet.cssRules) {
          const newStyleEl = targetDoc.createElement('style');
          Array.from(styleSheet.cssRules).forEach((cssRule) => {
            newStyleEl.appendChild(targetDoc.createTextNode(cssRule.cssText));
          });
          targetDoc.head.appendChild(newStyleEl);
        } else if (styleSheet.href) {
          const newLinkEl = targetDoc.createElement('link');
          newLinkEl.rel = 'stylesheet';
          newLinkEl.href = styleSheet.href;
          targetDoc.head.appendChild(newLinkEl);
        }
      } catch (e) {
        if (styleSheet.href) {
          const newLinkEl = targetDoc.createElement('link');
          newLinkEl.rel = 'stylesheet';
          newLinkEl.href = styleSheet.href;
          targetDoc.head.appendChild(newLinkEl);
        }
      }
    });
  }, []);

  // Open or close the window based on isOpen prop
  useEffect(() => {
    if (isOpen && !windowRef.current) {
      const newWindow = window.open(
        '',
        'ChartsWindow',
        'width=600,height=500,resizable=yes,scrollbars=yes'
      );

      if (newWindow) {
        windowRef.current = newWindow;

        newWindow.document.title = 'Glass Overlay - Performance Charts';
        newWindow.document.body.innerHTML = '';
        newWindow.document.body.style.margin = '0';
        newWindow.document.body.style.padding = '0';
        newWindow.document.body.style.background = 'rgba(15, 15, 20, 0.98)';
        newWindow.document.body.style.minHeight = '100vh';

        copyStyles(newWindow.document);

        const containerDiv = newWindow.document.createElement('div');
        containerDiv.id = 'charts-root';
        containerDiv.className = `overlay-container theme-${settings.general.theme} charts-window-container`;
        newWindow.document.body.appendChild(containerDiv);
        setContainer(containerDiv);

        newWindow.addEventListener('beforeunload', () => {
          windowRef.current = null;
          setContainer(null);
          onClose();
        });
      }
    } else if (!isOpen && windowRef.current) {
      windowRef.current.close();
      windowRef.current = null;
      setContainer(null);
    }

    return () => {
      if (windowRef.current) {
        windowRef.current.close();
        windowRef.current = null;
      }
    };
  }, [isOpen, copyStyles, onClose, settings.general.theme]);

  // Update theme class when settings change
  useEffect(() => {
    if (container && settings.general.theme) {
      container.className = `overlay-container theme-${settings.general.theme} charts-window-container`;
    }
  }, [container, settings.general.theme]);

  if (!isOpen || !container) {
    return null;
  }

  return createPortal(
    <ErrorBoundary>
      <div className={styles.chartsPanel}>
        <div className={styles.chartsHeader}>
          <span>{t('playerDetail.title')}</span>
          <button className={styles.closeCharts} onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <div className={styles.chartsPlayerSelect}>
          <label>{t('charts.selectPlayer', 'Select Player')}</label>
          {playerOptions.length > 0 ? (
            <CustomSelect<string>
              value={selectedPlayer || ''}
              options={playerOptions}
              onChange={(value) => setSelectedPlayer(value)}
              ariaLabel="Select player"
            />
          ) : (
            <span className={styles.noPlayers}>
              {t('charts.noPlayers', 'No players in encounter')}
            </span>
          )}
        </div>

        <div className={styles.chartsContent}>
          {selectedPlayer && selectedPlayerJob ? (
            <>
              <DpsChart
                performanceData={performanceData}
                playerName={selectedPlayer}
                job={selectedPlayerJob}
              />
              <HpsChart performanceData={performanceData} playerName={selectedPlayer} />
            </>
          ) : (
            <div className={styles.chartsEmpty}>
              <p>{t('charts.selectPlayerPrompt', 'Select a player to view performance charts')}</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>,
    container
  );
}
