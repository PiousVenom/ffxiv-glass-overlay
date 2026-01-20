import { useMemo, useState, useCallback } from 'react';

import { PlayerRow } from '../PlayerRow';
import { PlayerDetail } from '../PlayerDetail';

import styles from './PlayerList.module.css';
import { getJobAbbr } from '../../constants/Jobs';
import { parseNumericValue } from '../../utils/formatters';
import {
  buildStatColumns,
  getHeaderLabels,
  getColumnSettingsForView,
} from '../../utils/statColumns';
import { getEncDps, getEncHps, getJobFromPlayer } from '../../utils/combatantAccessors';

import type { RawCombatData, RawCombatant, ViewType, Settings } from '../../types';

interface PlayerListProps {
  /** Combat data from OverlayPlugin */
  combatData: RawCombatData | null;
  /** Current view type */
  currentView: ViewType;
  /** User settings */
  settings: Settings;
  /** Maximum number of players to display */
  maxPlayers: number;
  /** Effective player name (auto-detected or manual) */
  playerName: string;
}

/**
 * Generate a unique key for a player
 * Uses name + job combination, avoiding index as fallback
 */
function getPlayerKey(player: RawCombatant, index: number): string {
  const name = player.name || '';
  const job = getJobAbbr(getJobFromPlayer(player));
  // Use name + job as unique identifier
  // Only fall back to index if both name and job are empty
  const key = `${name}-${job}`;
  return key !== '-' ? key : `player-${index}`;
}

/**
 * Player list component displaying combat participants
 */
export function PlayerList({
  combatData,
  currentView,
  settings,
  maxPlayers,
  playerName,
}: PlayerListProps) {
  // State for selected player detail view
  const [selectedPlayer, setSelectedPlayer] = useState<RawCombatant | null>(null);

  // Handle player row click
  const handlePlayerClick = useCallback((player: RawCombatant) => {
    setSelectedPlayer(player);
  }, []);

  // Handle closing player detail
  const handleCloseDetail = useCallback(() => {
    setSelectedPlayer(null);
  }, []);

  // Get column settings for the current view
  const columnSettings = useMemo(
    () => getColumnSettingsForView(settings.columns, currentView),
    [settings.columns, currentView]
  );

  // Process and sort players
  const players = useMemo(() => {
    if (!combatData || !combatData.Combatant) {
      return [];
    }

    const combatants = Object.values(combatData.Combatant);

    // Sort by appropriate metric
    combatants.sort((a, b) => {
      switch (currentView) {
        case 'heal':
          return parseNumericValue(getEncHps(b)) - parseNumericValue(getEncHps(a));
        case 'tank':
          return parseNumericValue(b.damagetaken) - parseNumericValue(a.damagetaken);
        default:
          return parseNumericValue(getEncDps(b)) - parseNumericValue(getEncDps(a));
      }
    });

    // Limit to max players
    return combatants.slice(0, maxPlayers);
  }, [combatData, currentView, maxPlayers]);

  // Calculate max value for bar widths
  const maxValue = useMemo(() => {
    if (players.length === 0) return 0;

    switch (currentView) {
      case 'heal':
        return Math.max(...players.map((p) => parseNumericValue(p.healed)));
      case 'tank':
        return Math.max(...players.map((p) => parseNumericValue(p.damagetaken)));
      default:
        return Math.max(...players.map((p) => parseNumericValue(p.damage)));
    }
  }, [players, currentView]);

  // Get header labels and stat columns based on view and settings
  const headerLabels = useMemo(() => getHeaderLabels(currentView), [currentView]);
  const statColumns = useMemo(
    () => buildStatColumns(columnSettings, currentView),
    [columnSettings, currentView]
  );

  if (players.length === 0) {
    return (
      <div className={styles.playerList}>
        <div className={styles.noData}>
          <span className={styles.noDataTitle}>No combat data</span>
          <span className={styles.hint}>Waiting for encounter...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.playerList}>
      <div className={styles.playerListHeader}>
        <span></span>
        <span></span>
        <span className={styles.headerName}>Name</span>
        <div className={styles.headerStats}>
          <span className={styles.headerPrimary}>{headerLabels.primary}</span>
          {statColumns.map((col) => (
            <span key={col.key} className={styles.headerStat}>
              {col.label}
            </span>
          ))}
        </div>
      </div>
      {players.map((player, index) => (
        <PlayerRow
          key={getPlayerKey(player, index)}
          player={player}
          rank={index + 1}
          maxValue={maxValue}
          currentView={currentView}
          settings={settings}
          playerName={playerName}
          onClick={handlePlayerClick}
        />
      ))}

      {selectedPlayer && (
        <PlayerDetail player={selectedPlayer} settings={settings} onClose={handleCloseDetail} />
      )}
    </div>
  );
}
