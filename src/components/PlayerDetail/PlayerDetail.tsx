import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber, parseNumericValue } from '../../utils/formatters';

import styles from './PlayerDetail.module.css';
import { getJobAbbr, getRoleColor, isValidJob } from '../../constants/Jobs';
import { getEncDps, getEncHps, getJobFromPlayer } from '../../utils/combatantAccessors';

import type { RawCombatant, Settings } from '../../types';

const JOB_ICON_PATH = './images/icons/jobs/';

interface PlayerDetailProps {
  /** Player combat data */
  player: RawCombatant;
  /** User settings */
  settings: Settings;
  /** Callback to close the detail view */
  onClose: () => void;
}

/**
 * Detailed player statistics modal
 */
export function PlayerDetail({ player, settings, onClose }: PlayerDetailProps) {
  const { t } = useTranslation();

  const job = getJobAbbr(getJobFromPlayer(player));
  const roleColor = getRoleColor(job);
  const safeJob = isValidJob(job) ? job : '';
  const jobIconUrl = safeJob ? `${JOB_ICON_PATH}${safeJob}.png` : '';

  // Format options
  const formatOptions = useMemo(
    () => ({
      decimalPrecision: settings.general.decimalPrecision,
      useThousandSeparator: settings.general.useThousandSeparator,
    }),
    [settings.general.decimalPrecision, settings.general.useThousandSeparator]
  );

  // Parse player stats
  const stats = useMemo(() => {
    const damage = parseNumericValue(player.damage);
    const dps = parseNumericValue(getEncDps(player));
    const healing = parseNumericValue(player.healed);
    const hps = parseNumericValue(getEncHps(player));
    const damageTaken = parseNumericValue(player.damagetaken);
    const deaths = parseNumericValue(player.deaths);
    const overheal = parseNumericValue(player.overHeal);

    return {
      damage,
      dps,
      healing,
      hps,
      damageTaken,
      deaths,
      overheal,
      critPct: player['crithit%'] || '0%',
      dhPct: player.DirectHitPct || '0%',
      cdhPct: player.CritDirectHitPct || '0%',
      overhealPct: player.OverHealPct || '0%',
      maxHit: player.MAXHIT || player.maxhit || '-',
      maxHeal: player.MAXHEAL || player.maxheal || '-',
    };
  }, [player]);

  return (
    <div className={styles.playerDetailOverlay} onClick={onClose}>
      <div className={styles.playerDetailPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.playerDetailHeader} style={{ borderColor: roleColor }}>
          {jobIconUrl && (
            <div
              className={styles.playerDetailJobIcon}
              style={{ backgroundImage: `url('${jobIconUrl}')` }}
            />
          )}
          <div className={styles.playerDetailName}>
            <span className={styles.name}>{player.name}</span>
            <span className={styles.job} style={{ color: roleColor }}>
              {job || '???'}
            </span>
          </div>
          <button
            className={styles.closePlayerDetail}
            onClick={onClose}
            aria-label={t('common.close')}
          >
            ×
          </button>
        </div>

        <div className={styles.playerDetailContent}>
          {/* Damage Section */}
          <div className={styles.playerDetailSection}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.damage')}</span>
              <span className={styles.statValue}>{formatNumber(stats.damage, formatOptions)}</span>
            </div>
            <div className={styles.statRowPrimary}>
              <span className={styles.statLabel}>{t('playerDetail.stats.dps')}</span>
              <span className={styles.statValueHighlight}>
                {formatNumber(stats.dps, formatOptions)}
              </span>
            </div>
          </div>

          {/* Healing Section */}
          <div className={styles.playerDetailSection}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.healing')}</span>
              <span className={styles.statValue}>{formatNumber(stats.healing, formatOptions)}</span>
            </div>
            <div className={styles.statRowPrimary}>
              <span className={styles.statLabel}>{t('playerDetail.stats.hps')}</span>
              <span className={styles.statValueHighlight}>
                {formatNumber(stats.hps, formatOptions)}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.overheal')}</span>
              <span className={styles.statValue}>
                {formatNumber(stats.overheal, formatOptions)}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.overhealPercent')}</span>
              <span className={styles.statValue}>{stats.overhealPct}</span>
            </div>
          </div>

          {/* Defense Section */}
          <div className={styles.playerDetailSection}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.damageTaken')}</span>
              <span className={styles.statValue}>
                {formatNumber(stats.damageTaken, formatOptions)}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.deaths')}</span>
              <span className={styles.statValue}>{stats.deaths}</span>
            </div>
          </div>

          {/* Hit Stats Section */}
          <div className={styles.playerDetailSection}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.critPercent')}</span>
              <span className={styles.statValue}>{stats.critPct}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.directHitPercent')}</span>
              <span className={styles.statValue}>{stats.dhPct}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>
                {t('playerDetail.stats.critDirectHitPercent')}
              </span>
              <span className={styles.statValue}>{stats.cdhPct}</span>
            </div>
          </div>

          {/* Max Hit/Heal Section */}
          <div className={styles.playerDetailSection}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.maxHit')}</span>
              <span className={styles.statValueMaxHit}>{stats.maxHit}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{t('playerDetail.stats.maxHeal')}</span>
              <span className={styles.statValueMaxHeal}>{stats.maxHeal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
