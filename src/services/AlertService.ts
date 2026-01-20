import overlayPlugin from './OverlayPlugin';

import type { AlertTrigger, AlertSettings, RawCombatData } from '../types';
import { parseNumericValue } from '../utils/formatters';

// Cooldown tracking (time-based)
const triggeredAlerts = new Map<string, number>();

/**
 * Check if an alert is on cooldown
 */
function isOnCooldown(triggerId: string, cooldownMs: number): boolean {
  const lastTriggered = triggeredAlerts.get(triggerId);
  if (!lastTriggered) return false;
  return Date.now() - lastTriggered < cooldownMs;
}

/**
 * Mark an alert as triggered
 */
function markTriggered(triggerId: string): void {
  triggeredAlerts.set(triggerId, Date.now());
}

/**
 * Fire an alert using TTS and/or sound
 */
async function fireAlert(trigger: AlertTrigger): Promise<void> {
  if (trigger.useTTS && trigger.message) {
    await overlayPlugin.say(trigger.message);
  }

  if (trigger.useSound && trigger.soundFile) {
    await overlayPlugin.playSound(trigger.soundFile);
  }
}

/**
 * Check if a combatant name matches the player name
 * Handles: "YOU", exact match, first name match, partial match
 */
function isPlayerMatch(combatantName: string | undefined, playerName: string): boolean {
  if (!combatantName) return false;

  const name = combatantName.toLowerCase();
  const player = playerName.toLowerCase();

  // "YOU" always matches the current player
  if (name === 'you') return true;

  // Exact match
  if (name === player) return true;

  // First name match (player name starts with combatant name)
  // e.g., combatant "Kevin" matches player "Kevin Smith"
  if (player.startsWith(name + ' ')) return true;

  // Combatant name starts with player's first name
  // e.g., combatant "Kevin S" matches player "Kevin Smith"
  const playerFirstName = player.split(' ')[0];
  if (name.startsWith(playerFirstName)) return true;

  // Partial match - combatant name is contained in player name
  if (player.includes(name)) return true;

  return false;
}

/**
 * Check death trigger
 */
function checkDeath(
  trigger: AlertTrigger,
  combatData: RawCombatData,
  playerName: string,
  previousData: RawCombatData | null
): boolean {
  if (!combatData.Combatant || !previousData?.Combatant) return false;

  for (const combatant of Object.values(combatData.Combatant)) {
    const deaths = parseNumericValue(combatant.deaths);
    const prevCombatant = previousData.Combatant[combatant.name];
    const prevDeaths = prevCombatant ? parseNumericValue(prevCombatant.deaths) : 0;

    if (deaths > prevDeaths) {
      // Someone died
      if (trigger.condition.player === 'self') {
        if (isPlayerMatch(combatant.name, playerName)) {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  return false;
}

/**
 * Process all alert triggers
 */
export function processAlerts(
  settings: AlertSettings,
  combatData: RawCombatData,
  playerName: string,
  previousData: RawCombatData | null,
  isEncounterStart: boolean,
  isEncounterEnd: boolean
): void {
  if (!settings.enabled) return;
  if (!combatData) return;

  const cooldownMs = settings.defaultCooldown * 1000;
  const isEncounterActive = combatData.isActive === 'true';

  for (const trigger of settings.triggers) {
    if (!trigger.enabled) continue;
    if (isOnCooldown(trigger.id, cooldownMs)) continue;

    let shouldFire = false;

    switch (trigger.type) {
      case 'death':
        // Only check during active encounter
        if (isEncounterActive) {
          shouldFire = checkDeath(trigger, combatData, playerName, previousData);
        }
        break;

      case 'encounter_start':
        shouldFire = isEncounterStart;
        break;

      case 'encounter_end':
        shouldFire = isEncounterEnd;
        break;

      case 'aggro_warning':
        // Only check during active encounter
        // This would require aggro data integration
        // For now, skip this trigger type
        break;
    }

    if (shouldFire) {
      markTriggered(trigger.id);
      fireAlert(trigger);
    }
  }
}

/**
 * Clear all cooldowns
 */
export function clearAlertCooldowns(): void {
  triggeredAlerts.clear();
}
