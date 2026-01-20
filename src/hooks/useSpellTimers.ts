import { useState, useCallback, useEffect } from 'react';

import { parseLogLine, getTrackedSkillDef } from '../services/LogLineParser';

import type { ActiveTimer, TimerSettings, LogLineCallback } from '../types';

interface UseSpellTimersReturn {
  /** Active cooldown timers */
  activeTimers: ActiveTimer[];
  /** Handle LogLine event */
  handleLogLine: LogLineCallback;
  /** Clear all timers */
  clearTimers: () => void;
}

/**
 * Hook for managing spell cooldown timers
 */
export function useSpellTimers(settings: TimerSettings, playerName: string): UseSpellTimersReturn {
  const [activeTimers, setActiveTimers] = useState<ActiveTimer[]>([]);

  // Clear all timers
  const clearTimers = useCallback(() => {
    setActiveTimers([]);
  }, []);

  // Handle LogLine event
  const handleLogLine = useCallback(
    (data: { line: string[] }) => {
      if (!settings.enabled) return;

      const event = parseLogLine(data.line);
      if (!event) return;

      const skillDef = getTrackedSkillDef(event.skillId);
      if (!skillDef) return;

      // Check if we should track this skill
      if (settings.trackedSkills.length > 0 && !settings.trackedSkills.includes(event.skillId)) {
        return;
      }

      // Check player filter
      const isOwnSkill =
        event.casterName.toLowerCase() === playerName.toLowerCase() ||
        event.casterName.toLowerCase() === 'you';

      if (!settings.showPartyCooldowns && !isOwnSkill) {
        return;
      }

      if (!settings.showOwnCooldowns && isOwnSkill) {
        return;
      }

      // Create new timer
      const newTimer: ActiveTimer = {
        skillId: event.skillId,
        skillName: event.skillName,
        startTime: event.timestamp,
        duration: skillDef.cooldown * 1000, // Convert to ms
        casterName: event.casterName,
      };

      // Add to active timers (replace existing if same skill + caster)
      setActiveTimers((prev) => {
        const filtered = prev.filter(
          (t) => !(t.skillId === newTimer.skillId && t.casterName === newTimer.casterName)
        );
        return [...filtered, newTimer];
      });
    },
    [settings, playerName]
  );

  // Timer update loop - remove expired timers
  // Only runs when there are active timers to avoid unnecessary CPU usage
  useEffect(() => {
    if (!settings.enabled || activeTimers.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setActiveTimers((prev) =>
        prev.filter((timer) => {
          const elapsed = now - timer.startTime;
          return elapsed < timer.duration;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.enabled, activeTimers.length]);

  return {
    activeTimers,
    handleLogLine,
    clearTimers,
  };
}

/**
 * Get remaining time for a timer
 */
export function getTimerRemaining(timer: ActiveTimer): number {
  const elapsed = Date.now() - timer.startTime;
  return Math.max(0, timer.duration - elapsed);
}

/**
 * Format remaining time as MM:SS
 */
export function formatTimerRemaining(timer: ActiveTimer): string {
  const remainingMs = getTimerRemaining(timer);
  const seconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
}

/**
 * Get timer progress (0-1)
 */
export function getTimerProgress(timer: ActiveTimer): number {
  const remainingMs = getTimerRemaining(timer);
  return 1 - remainingMs / timer.duration;
}
