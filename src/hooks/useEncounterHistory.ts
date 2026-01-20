import { useState, useCallback, useEffect } from 'react';

import type { EncounterHistoryEntry, RawCombatData, HistorySettings } from '../types';
import settingsStorage from '../services/SettingsStorage';
import { isEncounterHistoryArray } from '../utils/validators';

const HISTORY_STORAGE_KEY = 'glassOverlayHistory';

interface UseEncounterHistoryReturn {
  history: EncounterHistoryEntry[];
  addEncounter: (data: RawCombatData, zone: string) => void;
  loadEncounter: (id: string) => RawCombatData | null;
  deleteEncounter: (id: string) => void;
  clearHistory: () => void;
}

/**
 * Hook for managing encounter history
 * Stores encounters in localStorage with fallback to OverlayPlugin storage
 */
export function useEncounterHistory(settings: HistorySettings): UseEncounterHistoryReturn {
  const [history, setHistory] = useState<EncounterHistoryEntry[]>([]);

  // Load history from storage on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await settingsStorage.load<EncounterHistoryEntry[]>(
          HISTORY_STORAGE_KEY,
          isEncounterHistoryArray
        );
        if (saved) {
          setHistory(saved);
        }
      } catch (error) {
        console.error('Failed to load encounter history:', error);
      }
    };
    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      settingsStorage.save(HISTORY_STORAGE_KEY, history).catch((error) => {
        console.error('Failed to save encounter history:', error);
      });
    }
  }, [history]);

  // Add a new encounter to history
  const addEncounter = useCallback(
    (data: RawCombatData, zone: string) => {
      if (!settings.enabled || !data.Encounter) return;

      const encounter = data.Encounter;
      const title = encounter.title || 'Unknown Encounter';
      const duration = encounter.duration || '00:00';

      // Don't save very short encounters
      if (duration === '00:00' || duration === '00:01') return;

      const entry: EncounterHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        title,
        duration,
        zone: zone || encounter.CurrentZoneName || 'Unknown Zone',
        data,
      };

      setHistory((prev) => {
        // Add new entry at the beginning, limit to max entries
        const updated = [entry, ...prev].slice(0, settings.maxEntries);
        return updated;
      });
    },
    [settings.enabled, settings.maxEntries]
  );

  // Load a specific encounter by ID
  const loadEncounter = useCallback(
    (id: string): RawCombatData | null => {
      const entry = history.find((e) => e.id === id);
      return entry?.data || null;
    },
    [history]
  );

  // Delete a specific encounter
  const deleteEncounter = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    settingsStorage.save(HISTORY_STORAGE_KEY, []).catch((error) => {
      console.error('Failed to clear encounter history:', error);
    });
  }, []);

  return {
    history,
    addEncounter,
    loadEncounter,
    deleteEncounter,
    clearHistory,
  };
}
