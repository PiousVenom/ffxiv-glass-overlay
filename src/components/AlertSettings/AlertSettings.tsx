import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './AlertSettings.module.css';

import type {
  AlertSettings as AlertSettingsType,
  AlertTrigger,
  AlertTriggerType,
} from '../../types';

interface AlertSettingsProps {
  /** Current alert settings */
  settings: AlertSettingsType;
  /** Callback when settings change */
  onChange: (settings: AlertSettingsType) => void;
}

const TRIGGER_TYPES: AlertTriggerType[] = [
  'death',
  'aggro_warning',
  'encounter_start',
  'encounter_end',
];

/**
 * Generate a unique ID for a new trigger
 */
function generateTriggerId(): string {
  return `trigger-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new default trigger
 */
function createDefaultTrigger(type: AlertTriggerType): AlertTrigger {
  return {
    id: generateTriggerId(),
    type,
    condition: {
      player: 'self',
    },
    message: '',
    soundFile: '',
    useTTS: true,
    useSound: false,
    enabled: true,
  };
}

/**
 * Alert settings configuration component
 */
export function AlertSettingsComponent({ settings, onChange }: AlertSettingsProps) {
  const { t } = useTranslation();
  const [editingTrigger, setEditingTrigger] = useState<AlertTrigger | null>(null);

  // Toggle main enabled state
  const handleToggleEnabled = useCallback(() => {
    onChange({
      ...settings,
      enabled: !settings.enabled,
    });
  }, [settings, onChange]);

  // Add new trigger
  const handleAddTrigger = useCallback((type: AlertTriggerType) => {
    const newTrigger = createDefaultTrigger(type);
    setEditingTrigger(newTrigger);
  }, []);

  // Save editing trigger
  const handleSaveTrigger = useCallback(() => {
    if (!editingTrigger) return;

    const existingIndex = settings.triggers.findIndex((t) => t.id === editingTrigger.id);
    const newTriggers = [...settings.triggers];

    if (existingIndex >= 0) {
      newTriggers[existingIndex] = editingTrigger;
    } else {
      newTriggers.push(editingTrigger);
    }

    onChange({
      ...settings,
      triggers: newTriggers,
    });
    setEditingTrigger(null);
  }, [settings, onChange, editingTrigger]);

  // Delete trigger
  const handleDeleteTrigger = useCallback(
    (triggerId: string) => {
      onChange({
        ...settings,
        triggers: settings.triggers.filter((t) => t.id !== triggerId),
      });
    },
    [settings, onChange]
  );

  // Toggle trigger enabled
  const handleToggleTrigger = useCallback(
    (triggerId: string) => {
      onChange({
        ...settings,
        triggers: settings.triggers.map((t) =>
          t.id === triggerId ? { ...t, enabled: !t.enabled } : t
        ),
      });
    },
    [settings, onChange]
  );

  // Edit trigger
  const handleEditTrigger = useCallback((trigger: AlertTrigger) => {
    setEditingTrigger({ ...trigger });
  }, []);

  return (
    <div className={styles.alertSettings}>
      {/* Main Enable Toggle */}
      <div className={styles.settingsRow}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" checked={settings.enabled} onChange={handleToggleEnabled} />
          {t('settings.labels.enableAlerts')}
        </label>
      </div>

      {/* Cooldown Setting */}
      <div className={styles.settingsRow}>
        <label>{t('settings.labels.alertCooldown')}</label>
        <div className={styles.numberInput}>
          <button
            type="button"
            onClick={() =>
              onChange({ ...settings, defaultCooldown: Math.max(0, settings.defaultCooldown - 1) })
            }
            aria-label="Decrease cooldown"
          >
            −
          </button>
          <span className={styles.numberValue}>{settings.defaultCooldown}</span>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...settings,
                defaultCooldown: Math.min(300, settings.defaultCooldown + 1),
              })
            }
            aria-label="Increase cooldown"
          >
            +
          </button>
        </div>
      </div>

      {/* Trigger List */}
      <div className={styles.triggerList}>
        <h4>{t('alerts.title')}</h4>
        {settings.triggers.length === 0 ? (
          <p className={styles.noTriggers}>{t('alerts.noTriggers')}</p>
        ) : (
          <ul className={styles.triggers}>
            {settings.triggers.map((trigger) => (
              <li
                key={trigger.id}
                className={trigger.enabled ? styles.triggerItem : styles.triggerItemDisabled}
              >
                <div className={styles.triggerInfo}>
                  <span className={styles.triggerType}>
                    {t(`alerts.triggerTypes.${trigger.type}`)}
                  </span>
                  <span className={styles.triggerMessage}>
                    {trigger.message || t('alerts.noMessage')}
                  </span>
                </div>
                <div className={styles.triggerActions}>
                  <button
                    className={styles.btnIcon}
                    onClick={() => handleToggleTrigger(trigger.id)}
                    title={trigger.enabled ? t('common.enabled') : t('common.disabled')}
                  >
                    {trigger.enabled ? '✓' : '○'}
                  </button>
                  <button
                    className={styles.btnIcon}
                    onClick={() => handleEditTrigger(trigger)}
                    title={t('alerts.edit')}
                  >
                    ✎
                  </button>
                  <button
                    className={styles.btnIconDanger}
                    onClick={() => handleDeleteTrigger(trigger.id)}
                    title={t('common.delete')}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Trigger Buttons */}
      <div className={styles.addTrigger}>
        <label>{t('alerts.addTrigger')}</label>
        <div className={styles.triggerTypeButtons}>
          {TRIGGER_TYPES.map((type) => (
            <button
              key={type}
              className={styles.btnTriggerType}
              onClick={() => handleAddTrigger(type)}
            >
              {t(`alerts.triggerTypes.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Trigger Modal */}
      {editingTrigger && (
        <div className={styles.triggerEditOverlay} onMouseDown={() => setEditingTrigger(null)}>
          <div className={styles.triggerEditPanel} onMouseDown={(e) => e.stopPropagation()}>
            <h4>{t(`alerts.triggerTypes.${editingTrigger.type}`)}</h4>

            {/* Player condition */}
            {editingTrigger.type === 'death' && (
              <div className={styles.editRow}>
                <label>{t('alerts.player')}</label>
                <select
                  value={editingTrigger.condition.player || 'self'}
                  onChange={(e) =>
                    setEditingTrigger({
                      ...editingTrigger,
                      condition: {
                        ...editingTrigger.condition,
                        player: e.target.value as 'self' | 'any',
                      },
                    })
                  }
                >
                  <option value="self">{t('alerts.playerSelf')}</option>
                  <option value="any">{t('alerts.playerAny')}</option>
                </select>
              </div>
            )}

            {/* Message */}
            <div className={styles.editRow}>
              <label>{t('alerts.ttsMessage')}</label>
              <input
                type="text"
                placeholder={t('alerts.ttsMessagePlaceholder')}
                value={editingTrigger.message}
                onChange={(e) =>
                  setEditingTrigger({
                    ...editingTrigger,
                    message: e.target.value,
                  })
                }
                maxLength={200}
                aria-label="TTS message"
              />
            </div>

            {/* TTS Toggle */}
            <div className={styles.editRowCheckbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editingTrigger.useTTS}
                  onChange={(e) =>
                    setEditingTrigger({
                      ...editingTrigger,
                      useTTS: e.target.checked,
                    })
                  }
                />
                {t('alerts.useTTS')}
              </label>
            </div>

            {/* Sound File */}
            <div className={styles.editRow}>
              <label>{t('alerts.soundFile')}</label>
              <input
                type="text"
                placeholder={t('alerts.soundFilePlaceholder')}
                value={editingTrigger.soundFile || ''}
                onChange={(e) =>
                  setEditingTrigger({
                    ...editingTrigger,
                    soundFile: e.target.value,
                  })
                }
                maxLength={500}
                aria-label="Sound file path"
              />
            </div>

            {/* Sound Toggle */}
            <div className={styles.editRowCheckbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editingTrigger.useSound}
                  onChange={(e) =>
                    setEditingTrigger({
                      ...editingTrigger,
                      useSound: e.target.checked,
                    })
                  }
                />
                {t('alerts.useSound')}
              </label>
            </div>

            {/* Actions */}
            <div className={styles.editActions}>
              <button className={styles.btnCancel} onClick={() => setEditingTrigger(null)}>
                {t('common.cancel')}
              </button>
              <button className={styles.btnSave} onClick={handleSaveTrigger}>
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
