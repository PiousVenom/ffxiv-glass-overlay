import { useState, useCallback } from 'react';

import type { AggroListData, EnmityEntry } from '../types';

interface UseAggroDataReturn {
  /** Sorted enmity entries */
  entries: EnmityEntry[];
  /** Target information */
  target: AggroListData['Target'] | null;
  /** Handle aggro list update */
  handleAggroList: (data: AggroListData) => void;
}

/**
 * Hook for managing aggro/enmity list data
 */
export function useAggroData(): UseAggroDataReturn {
  const [entries, setEntries] = useState<EnmityEntry[]>([]);
  const [target, setTarget] = useState<AggroListData['Target'] | null>(null);

  const handleAggroList = useCallback((data: AggroListData) => {
    // Sort entries by enmity (highest first)
    const sortedEntries = [...(data.Entries || [])].sort((a, b) => b.Enmity - a.Enmity);
    setEntries(sortedEntries);
    setTarget(data.Target || null);
  }, []);

  return {
    entries,
    target,
    handleAggroList,
  };
}
