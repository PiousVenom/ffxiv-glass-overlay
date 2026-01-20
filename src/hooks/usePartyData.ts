import { useState, useCallback } from 'react';

import type { PartyChangedData, PartyMember } from '../types';

interface UsePartyDataReturn {
  party: PartyMember[];
  partyType: PartyChangedData['partyType'];
  handlePartyChanged: (data: PartyChangedData) => void;
}

/**
 * Hook for managing party composition data
 */
export function usePartyData(): UsePartyDataReturn {
  const [party, setParty] = useState<PartyMember[]>([]);
  const [partyType, setPartyType] = useState<PartyChangedData['partyType']>('Solo');

  const handlePartyChanged = useCallback((data: PartyChangedData) => {
    setParty(data.party);
    setPartyType(data.partyType);
  }, []);

  return {
    party,
    partyType,
    handlePartyChanged,
  };
}
