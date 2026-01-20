import { useTranslation } from 'react-i18next';

import { JOBS } from '../../constants/Jobs';
import type { PartyMember, PartyChangedData } from '../../types';

interface PartyListProps {
  /** List of party members */
  party: PartyMember[];
  /** Current party type */
  partyType: PartyChangedData['partyType'];
  /** Callback to close the panel */
  onClose: () => void;
}

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

/**
 * Party composition display component
 */
export function PartyList({ party, partyType, onClose }: PartyListProps) {
  const { t } = useTranslation();

  // Get job abbreviation from job ID
  const getJobAbbr = (jobId: number): string => {
    return JOB_ID_MAP[jobId] || '';
  };

  // Get job color from job abbreviation
  const getJobColor = (jobAbbr: string): string => {
    const job = JOBS[jobAbbr];
    return job?.color || 'rgba(255, 255, 255, 0.7)';
  };

  // Get party type display string
  const getPartyTypeDisplay = (): string => {
    switch (partyType) {
      case 'Solo':
        return 'Solo';
      case 'Party':
        return `Party (${party.length})`;
      case 'AllianceA':
      case 'AllianceB':
      case 'AllianceC':
        return `Alliance ${partyType.slice(-1)} (${party.length})`;
      default:
        return partyType;
    }
  };

  return (
    <div className="party-panel">
      <div className="party-header">
        <span>{getPartyTypeDisplay()}</span>
        <button className="close-party" onClick={onClose} aria-label={t('common.close')}>
          ×
        </button>
      </div>

      <div className="party-content">
        {party.length === 0 ? (
          <div className="party-empty">No party members</div>
        ) : (
          <div className="party-members">
            {party.map((member) => {
              const jobAbbr = getJobAbbr(member.job);
              const jobColor = getJobColor(jobAbbr);

              return (
                <div key={member.id} className="party-member">
                  <span className="party-member-job" style={{ color: jobColor }}>
                    {jobAbbr || '???'}
                  </span>
                  <span className="party-member-name">{member.name}</span>
                  <span className="party-member-level">Lv{member.level}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
