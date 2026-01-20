import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  formatTimerRemaining,
  getTimerProgress,
  getTimerRemaining,
} from '../../hooks/useSpellTimers';

import styles from './SpellTimers.module.css';
import { getSkillById } from '../../data/skills';
import { getRoleColor } from '../../constants/Jobs';

import type { ActiveTimer } from '../../types';

interface SpellTimersProps {
  /** Active cooldown timers */
  timers: ActiveTimer[];
  /** Player name for highlighting own timers */
  playerName: string;
}

/**
 * Spell cooldown timers display component
 */
export function SpellTimers({ timers, playerName }: SpellTimersProps) {
  const { t } = useTranslation();

  // Sort timers by remaining time (shortest first)
  const sortedTimers = useMemo(() => {
    return [...timers].sort((a, b) => getTimerRemaining(a) - getTimerRemaining(b));
  }, [timers]);

  if (sortedTimers.length === 0) {
    return (
      <div className={styles.spellTimersEmpty}>
        <span>{t('timers.noActiveTimers')}</span>
      </div>
    );
  }

  return (
    <div className={styles.spellTimers}>
      {sortedTimers.map((timer) => {
        const skillDef = getSkillById(timer.skillId);
        const jobColor = skillDef?.job ? getRoleColor(skillDef.job) : '#888';
        const isOwn =
          timer.casterName.toLowerCase() === playerName.toLowerCase() ||
          timer.casterName.toLowerCase() === 'you';
        const progress = getTimerProgress(timer);
        const remaining = formatTimerRemaining(timer);

        return (
          <div
            key={`${timer.skillId}-${timer.casterName}-${timer.startTime}`}
            className={isOwn ? styles.spellTimerOwn : styles.spellTimer}
          >
            <div
              className={styles.timerProgress}
              style={{
                width: `${progress * 100}%`,
                backgroundColor: jobColor,
              }}
            />
            <div className={styles.timerContent}>
              <span className={isOwn ? styles.timerNameOwn : styles.timerName}>
                {timer.skillName}
              </span>
              <span className={isOwn ? styles.timerCasterOwn : styles.timerCaster}>
                {isOwn ? 'You' : timer.casterName}
              </span>
              <span className={styles.timerRemaining}>{remaining}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
