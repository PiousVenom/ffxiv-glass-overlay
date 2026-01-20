import { useMemo } from 'react';

import {
  formatNumber,
  formatName,
  parseNumericValue,
  shouldBlurName,
} from '../../utils/formatters';

import styles from './PlayerRow.module.css';
import { getJobAbbr, getRole, getRoleColor, isValidJob } from '../../constants/Jobs';
import { getStatValues, getColumnSettingsForView } from '../../utils/statColumns';
import { getEncDps, getEncHps, getJobFromPlayer } from '../../utils/combatantAccessors';

import type { RawCombatant, ViewType, Settings } from '../../types';

const JOB_ICON_PATH = './images/icons/jobs/';

interface PlayerRowProps {
  /** Player combat data */
  player: RawCombatant;
  /** Player rank in the list */
  rank: number;
  /** Maximum value for bar width calculation */
  maxValue: number;
  /** Current view type */
  currentView: ViewType;
  /** User settings */
  settings: Settings;
  /** Effective player name (auto-detected or manual) */
  playerName: string;
  /** Callback when player row is clicked */
  onClick?: (player: RawCombatant) => void;
}

/**
 * Individual player row in the combat list
 */
export function PlayerRow({
  player,
  rank,
  maxValue,
  currentView,
  settings,
  playerName,
  onClick,
}: PlayerRowProps) {
  const job = getJobAbbr(getJobFromPlayer(player));
  const role = getRole(job);
  const roleColor = getRoleColor(job);

  // Get column settings for the current view
  const columnSettings = useMemo(
    () => getColumnSettingsForView(settings.columns, currentView),
    [settings.columns, currentView]
  );

  // Check if this is "you"
  const isYou = useMemo(() => {
    const name = player.name?.toLowerCase();
    const configName = playerName?.toLowerCase();
    return name === 'you' || name === configName;
  }, [player.name, playerName]);

  // Check if name should be blurred
  const isBlurred = useMemo(() => {
    return shouldBlurName(player.name, settings.display.blurNames, playerName);
  }, [player.name, settings.display.blurNames, playerName]);

  // Calculate bar width
  const barWidth = useMemo(() => {
    let value = 0;
    switch (currentView) {
      case 'heal':
        value = parseNumericValue(player.healed);
        break;
      case 'tank':
        value = parseNumericValue(player.damagetaken);
        break;
      default:
        value = parseNumericValue(player.damage);
    }
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }, [currentView, player.healed, player.damagetaken, player.damage, maxValue]);

  // Get primary stat based on view
  const primaryStat = useMemo(() => {
    const formatOptions = {
      decimalPrecision: settings.general.decimalPrecision,
      useThousandSeparator: settings.general.useThousandSeparator,
      useCompactNumbers: settings.general.useCompactNumbers,
    };

    switch (currentView) {
      case 'heal':
        return formatNumber(getEncHps(player), formatOptions);
      case 'tank':
        return formatNumber(player.damagetaken ?? 0, formatOptions);
      default:
        return formatNumber(getEncDps(player), formatOptions);
    }
  }, [
    currentView,
    player,
    settings.general.decimalPrecision,
    settings.general.useThousandSeparator,
    settings.general.useCompactNumbers,
  ]);

  const statValues = getStatValues(player, columnSettings, currentView, {
    decimalPrecision: settings.general.decimalPrecision,
    useCompactNumbers: settings.general.useCompactNumbers,
  });

  // Check if this is Limit Break
  const isLimitBreak = player.name?.toLowerCase() === 'limit break';

  // Security: Only use job abbreviation in URL if it's a valid job
  const safeJob = isValidJob(job) ? job : '';
  const jobIconUrl = isLimitBreak
    ? `${JOB_ICON_PATH}LMB.png`
    : safeJob
      ? `${JOB_ICON_PATH}${safeJob}.png`
      : '';

  // Determine row class
  const rowClass = isYou ? styles.isYou : styles.playerRow;
  const clickableClass = onClick ? styles.clickable : '';

  // Determine rank class based on position
  const getRankClass = (): string => {
    const baseClass = styles.playerRank;
    if (rank === 1) return `${baseClass} ${styles.rankGold}`;
    if (rank === 2) return `${baseClass} ${styles.rankSilver}`;
    if (rank === 3) return `${baseClass} ${styles.rankBronze}`;
    return baseClass;
  };

  // Determine name class
  const nameClass = isYou ? styles.playerNameYou : styles.playerName;
  const blurClass = isBlurred ? styles.blurText : '';

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div
      className={`${rowClass} ${clickableClass}`}
      data-job={job}
      data-role={role}
      onClick={handleClick}
    >
      <div
        className={styles.dpsBar}
        style={{
          width: `${barWidth}%`,
          backgroundColor: roleColor,
        }}
      />

      <span className={getRankClass()}>{rank}</span>

      {settings.display.showJobIcons && (
        <div
          className={styles.jobIcon}
          style={jobIconUrl ? { backgroundImage: `url('${jobIconUrl}')` } : undefined}
        />
      )}

      <span className={`${nameClass} ${blurClass}`}>
        {formatName(player.name, settings.display.shortNames, playerName)}
      </span>

      <div className={styles.playerStats}>
        <span className={styles.statPrimary}>{primaryStat}</span>
        {statValues.map((stat) => (
          <span key={stat.key} className={styles.statValue}>
            {stat.value}
          </span>
        ))}
      </div>
    </div>
  );
}
