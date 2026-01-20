import { useState, useEffect, useCallback, useRef } from 'react';

import type { RawCombatData, PerformancePoint } from '../types';
import { parseNumericValue, parseDuration } from '../utils/formatters';
import { getEncDps, getEncHps } from '../utils/combatantAccessors';

// Sample interval in milliseconds
const SAMPLE_INTERVAL = 3000;
// Maximum number of data points to keep
const MAX_DATA_POINTS = 60;

interface UsePerformanceDataReturn {
  /** Performance data points over time */
  performanceData: PerformancePoint[];
  /** Clear all performance data */
  clearData: () => void;
}

/**
 * Hook for tracking DPS/HPS performance over time
 * Samples combat data at regular intervals to build a time series
 */
export function usePerformanceData(combatData: RawCombatData | null): UsePerformanceDataReturn {
  const [performanceData, setPerformanceData] = useState<PerformancePoint[]>([]);
  const lastSampleRef = useRef<number>(0);
  const encounterTitleRef = useRef<string | undefined>(undefined);
  const wasActiveRef = useRef<boolean>(false);

  // Clear data
  const clearData = useCallback(() => {
    setPerformanceData([]);
    lastSampleRef.current = 0;
    encounterTitleRef.current = undefined;
    wasActiveRef.current = false;
  }, []);

  // Sample current combat data
  useEffect(() => {
    const isActive = combatData?.isActive === 'true';

    // Detect encounter start (transition from inactive to active)
    if (isActive && !wasActiveRef.current) {
      // New encounter starting, clear old data
      setPerformanceData([]);
      lastSampleRef.current = 0;
      encounterTitleRef.current = combatData?.Encounter?.title;
    }

    // Update active state tracking
    wasActiveRef.current = isActive;

    if (!combatData || !combatData.Combatant || !isActive) {
      return;
    }

    // Also check for title change mid-combat (rare but possible)
    const currentTitle = combatData.Encounter?.title;
    if (currentTitle !== encounterTitleRef.current && encounterTitleRef.current !== undefined) {
      // Title changed, clear old data
      setPerformanceData([]);
      lastSampleRef.current = 0;
      encounterTitleRef.current = currentTitle;
    }

    // Get encounter duration in seconds from ACT
    const encounterDuration = parseDuration(combatData.Encounter?.duration);

    // Only sample at intervals (based on encounter duration, not wall clock)
    // This ensures we don't add duplicate data points for the same encounter time
    const lastSampleTime = lastSampleRef.current;
    if (encounterDuration - lastSampleTime < SAMPLE_INTERVAL / 1000) {
      return;
    }

    lastSampleRef.current = encounterDuration;

    // Build DPS and HPS records for all combatants
    const dps: Record<string, number> = {};
    const hps: Record<string, number> = {};

    Object.values(combatData.Combatant).forEach((combatant) => {
      const name = combatant.name;
      if (name) {
        dps[name] = parseNumericValue(getEncDps(combatant));
        hps[name] = parseNumericValue(getEncHps(combatant));
      }
    });

    const dataPoint: PerformancePoint = {
      // Store encounter time in seconds (converted to ms for compatibility)
      timestamp: encounterDuration * 1000,
      dps,
      hps,
    };

    setPerformanceData((prev) => {
      const newData = [...prev, dataPoint];
      // Keep only the last MAX_DATA_POINTS
      if (newData.length > MAX_DATA_POINTS) {
        return newData.slice(-MAX_DATA_POINTS);
      }
      return newData;
    });
  }, [combatData]);

  return {
    performanceData,
    clearData,
  };
}

/**
 * Get DPS history for a specific player
 */
export function getPlayerDpsHistory(
  performanceData: PerformancePoint[],
  playerName: string
): { timestamps: number[]; values: number[] } {
  const timestamps: number[] = [];
  const values: number[] = [];

  performanceData.forEach((point) => {
    timestamps.push(point.timestamp);
    values.push(point.dps[playerName] ?? 0);
  });

  return { timestamps, values };
}

/**
 * Get HPS history for a specific player
 */
export function getPlayerHpsHistory(
  performanceData: PerformancePoint[],
  playerName: string
): { timestamps: number[]; values: number[] } {
  const timestamps: number[] = [];
  const values: number[] = [];

  performanceData.forEach((point) => {
    timestamps.push(point.timestamp);
    values.push(point.hps[playerName] ?? 0);
  });

  return { timestamps, values };
}
