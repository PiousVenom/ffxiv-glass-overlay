import { useTranslation } from 'react-i18next';

import type { EncounterHistoryEntry } from '../../types';

interface EncounterHistoryProps {
  /** List of encounter history entries */
  history: EncounterHistoryEntry[];
  /** Callback when an encounter is selected to load */
  onLoadEncounter: (id: string) => void;
  /** Callback when an encounter is deleted */
  onDeleteEncounter: (id: string) => void;
  /** Callback to save the current encounter (if available) */
  onSaveEncounter?: () => void;
  /** Callback to clear all history */
  onClearHistory: () => void;
  /** Callback to close the history panel */
  onClose: () => void;
}

/**
 * Encounter history modal showing past encounters
 */
export function EncounterHistory({
  history,
  onLoadEncounter,
  onDeleteEncounter,
  onSaveEncounter,
  onClearHistory,
  onClose,
}: EncounterHistoryProps) {
  const { t } = useTranslation();

  // Format timestamp to localized date/time
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <span>{t('history.title')}</span>
        <div className="history-header-actions">
          {onSaveEncounter && (
            <button
              className="history-header-btn save-btn"
              onClick={onSaveEncounter}
              title={t('history.saveCurrent')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </button>
          )}
          {history.length > 0 && (
            <button
              className="history-header-btn clear-btn"
              onClick={onClearHistory}
              title={t('history.clearAll')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
              </svg>
            </button>
          )}
          <button className="close-history" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>
      </div>

      <div className="history-content">
        {history.length === 0 ? (
          <div className="history-empty">{t('history.noHistory')}</div>
        ) : (
          <div className="history-list">
            {history.map((entry) => (
              <div key={entry.id} className="history-entry">
                <div className="history-entry-info">
                  <span className="history-entry-title">{entry.title}</span>
                  <div className="history-entry-meta">
                    <span className="history-entry-zone">{entry.zone}</span>
                    <span className="history-entry-duration">
                      {t('history.duration')}: {entry.duration}
                    </span>
                    <span className="history-entry-date">{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
                <div className="history-entry-actions">
                  <button
                    className="history-action-btn load-btn"
                    onClick={() => onLoadEncounter(entry.id)}
                    title={t('history.loadEncounter')}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v12m0 0l-4-4m4 4l4-4" />
                      <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
                    </svg>
                  </button>
                  <button
                    className="history-action-btn delete-btn"
                    onClick={() => onDeleteEncounter(entry.id)}
                    title={t('history.deleteEncounter')}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
