import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getRoleColor, isValidJob } from '../../constants/Jobs';

import styles from './AggroList.module.css';

import type { EnmityEntry, AggroListData, Settings } from '../../types';

const JOB_ICON_PATH = './images/icons/jobs/';

// Map job ID to job abbreviation
const JOB_ID_MAP: Record<number, string> = {
  0: '', // Unknown
  1: 'GLA',
  2: 'PGL',
  3: 'MRD',
  4: 'LNC',
  5: 'ARC',
  6: 'CNJ',
  7: 'THM',
  8: 'CRP',
  9: 'BSM',
  10: 'ARM',
  11: 'GSM',
  12: 'LTW',
  13: 'WVR',
  14: 'ALC',
  15: 'CUL',
  16: 'MIN',
  17: 'BTN',
  18: 'FSH',
  19: 'PLD',
  20: 'MNK',
  21: 'WAR',
  22: 'DRG',
  23: 'BRD',
  24: 'WHM',
  25: 'BLM',
  26: 'ACN',
  27: 'SMN',
  28: 'SCH',
  29: 'ROG',
  30: 'NIN',
  31: 'MCH',
  32: 'DRK',
  33: 'AST',
  34: 'SAM',
  35: 'RDM',
  36: 'BLU',
  37: 'GNB',
  38: 'DNC',
  39: 'RPR',
  40: 'SGE',
  41: 'VPR',
  42: 'PCT',
};

interface AggroListProps {
  /** Enmity entries */
  entries: EnmityEntry[];
  /** Target information */
  target: AggroListData['Target'] | null;
  /** User settings */
  settings: Settings;
}

/**
 * Aggro/Enmity list display component
 */
export function AggroList({ entries, target, settings }: AggroListProps) {
  const { t } = useTranslation();

  // Get job abbreviation from job ID
  const getJobFromId = (jobId: number): string => {
    return JOB_ID_MAP[jobId] || '';
  };

  // Calculate HP percentage
  const hpPercentage = useMemo(() => {
    if (!target || target.MaxHP === 0) return 0;
    return (target.CurrentHP / target.MaxHP) * 100;
  }, [target]);

  // Format HP values
  const formatHp = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Find max enmity for bar calculation
  const maxEnmity = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.max(...entries.map((e) => e.Enmity));
  }, [entries]);

  // Get entry class based on state
  const getEntryClass = (isMe: boolean, isFirst: boolean): string => {
    if (isMe && isFirst) return styles.aggroEntryIsYouHasAggro;
    if (isMe) return styles.aggroEntryIsYou;
    if (isFirst) return styles.aggroEntryHasAggro;
    return styles.aggroEntry;
  };

  if (!target && entries.length === 0) {
    return (
      <div className={styles.aggroList}>
        <div className={styles.noData}>
          <span>{t('aggro.noTarget')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.aggroList}>
      {/* Target HP Bar */}
      {target && (
        <div className={styles.aggroTarget}>
          <div className={styles.targetHpBar}>
            <div className={styles.targetHpFill} style={{ width: `${hpPercentage}%` }} />
            <div className={styles.targetHpText}>
              <span className={styles.targetName}>{target.Name}</span>
              <span className={styles.targetHp}>
                {formatHp(target.CurrentHP)} / {formatHp(target.MaxHP)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Enmity List */}
      <div className={styles.aggroEntries}>
        {entries.map((entry, index) => {
          const job = getJobFromId(entry.Job);
          const roleColor = getRoleColor(job);
          const safeJob = isValidJob(job) ? job : '';
          const jobIconUrl = safeJob ? `${JOB_ICON_PATH}${safeJob}.png` : '';
          const enmityWidth = maxEnmity > 0 ? (entry.Enmity / maxEnmity) * 100 : 0;
          const isFirst = index === 0;

          return (
            <div key={entry.ID} className={getEntryClass(entry.isMe, isFirst)}>
              <div
                className={isFirst ? styles.enmityBarHasAggro : styles.enmityBar}
                style={{
                  width: `${enmityWidth}%`,
                  backgroundColor: isFirst ? '#e74c3c' : roleColor,
                }}
              />
              <span className={isFirst ? styles.aggroRankHasAggro : styles.aggroRank}>
                {index + 1}
              </span>
              {settings.display.showJobIcons && jobIconUrl && (
                <div
                  className={styles.jobIcon}
                  style={{ backgroundImage: `url('${jobIconUrl}')` }}
                />
              )}
              <span className={entry.isMe ? styles.aggroNameIsYou : styles.aggroName}>
                {entry.isMe ? t('aggro.you') : entry.Name}
              </span>
              <span className={isFirst ? styles.aggroEnmityHasAggro : styles.aggroEnmity}>
                {entry.HateRate}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
