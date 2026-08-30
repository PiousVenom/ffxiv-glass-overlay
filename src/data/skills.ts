import type { SkillDefinition } from '../types';

/**
 * FFXIV Skill Database
 * Contains major party cooldowns and tank mitigation for tracking
 */
export const SKILLS: Record<number, SkillDefinition> = {
  // ===============================
  // Tank Mitigation
  // ===============================

  // Paladin
  7531: { id: 7531, name: 'Hallowed Ground', cooldown: 420, job: 'PLD' },
  7385: { id: 7385, name: 'Sentinel', cooldown: 120, job: 'PLD' },
  7382: { id: 7382, name: 'Rampart', cooldown: 90, job: 'PLD' },
  16457: { id: 16457, name: 'Divine Veil', cooldown: 90, job: 'PLD' },
  7535: { id: 7535, name: 'Passage of Arms', cooldown: 120, job: 'PLD' },

  // Warrior
  43: { id: 43, name: 'Holmgang', cooldown: 240, job: 'WAR' },
  44: { id: 44, name: 'Vengeance', cooldown: 120, job: 'WAR' },
  7388: { id: 7388, name: 'Shake It Off', cooldown: 90, job: 'WAR' },
  7389: { id: 7389, name: 'Nascent Flash', cooldown: 25, job: 'WAR' },

  // Dark Knight
  3638: { id: 3638, name: 'Living Dead', cooldown: 300, job: 'DRK' },
  3636: { id: 3636, name: 'Shadow Wall', cooldown: 120, job: 'DRK' },
  7393: { id: 7393, name: 'The Blackest Night', cooldown: 15, job: 'DRK' },
  16472: { id: 16472, name: 'Dark Missionary', cooldown: 90, job: 'DRK' },

  // Gunbreaker
  16152: { id: 16152, name: 'Superbolide', cooldown: 360, job: 'GNB' },
  16148: { id: 16148, name: 'Nebula', cooldown: 120, job: 'GNB' },
  16160: { id: 16160, name: 'Heart of Light', cooldown: 90, job: 'GNB' },
  16161: { id: 16161, name: 'Heart of Stone', cooldown: 25, job: 'GNB' },

  // ===============================
  // Healer Cooldowns
  // ===============================

  // White Mage
  140: { id: 140, name: 'Benediction', cooldown: 180, job: 'WHM' },
  3569: { id: 3569, name: 'Asylum', cooldown: 90, job: 'WHM' },
  7432: { id: 7432, name: 'Divine Benison', cooldown: 30, job: 'WHM' },
  7433: { id: 7433, name: 'Plenary Indulgence', cooldown: 60, job: 'WHM' },
  16536: { id: 16536, name: 'Temperance', cooldown: 120, job: 'WHM' },

  // Scholar
  189: { id: 189, name: 'Lustrate', cooldown: 1, job: 'SCH' }, // Aetherflow based
  7434: { id: 7434, name: 'Fey Illumination', cooldown: 120, job: 'SCH' },
  7436: { id: 7436, name: 'Excogitation', cooldown: 45, job: 'SCH' },
  16545: { id: 16545, name: 'Seraphic Veil', cooldown: 30, job: 'SCH' },
  16557: { id: 16557, name: 'Expedient', cooldown: 120, job: 'SCH' },

  // Astrologian
  3594: { id: 3594, name: 'Essential Dignity', cooldown: 40, job: 'AST' },
  16559: { id: 16559, name: 'Celestial Opposition', cooldown: 60, job: 'AST' },
  16556: { id: 16556, name: 'Neutral Sect', cooldown: 120, job: 'AST' },
  16553: { id: 16553, name: 'Earthly Star', cooldown: 60, job: 'AST' },

  // Sage
  24298: { id: 24298, name: 'Kerachole', cooldown: 30, job: 'SGE' },
  24302: { id: 24302, name: 'Physis II', cooldown: 60, job: 'SGE' },
  24303: { id: 24303, name: 'Taurochole', cooldown: 45, job: 'SGE' },
  24305: { id: 24305, name: 'Haima', cooldown: 120, job: 'SGE' },
  24310: { id: 24310, name: 'Holos', cooldown: 120, job: 'SGE' },
  24311: { id: 24311, name: 'Panhaima', cooldown: 120, job: 'SGE' },
  24318: { id: 24318, name: 'Pneuma', cooldown: 120, job: 'SGE' },

  // ===============================
  // DPS Raid Buffs
  // ===============================

  // Dragoon
  7398: { id: 7398, name: 'Battle Litany', cooldown: 120, job: 'DRG' },
  7399: { id: 7399, name: 'Dragon Sight', cooldown: 120, job: 'DRG' },

  // Ninja
  7546: { id: 7546, name: 'Trick Attack', cooldown: 60, job: 'NIN' },
  16493: { id: 16493, name: 'Mug', cooldown: 120, job: 'NIN' },

  // Bard
  118: { id: 118, name: 'Battle Voice', cooldown: 120, job: 'BRD' },
  7405: { id: 7405, name: 'Radiant Finale', cooldown: 110, job: 'BRD' },

  // Dancer
  16015: { id: 16015, name: 'Technical Step', cooldown: 120, job: 'DNC' },
  16013: { id: 16013, name: 'Standard Step', cooldown: 30, job: 'DNC' },
  16004: { id: 16004, name: 'Devilment', cooldown: 120, job: 'DNC' },

  // Monk
  65: { id: 65, name: 'Mantra', cooldown: 90, job: 'MNK' },
  16476: { id: 16476, name: 'Brotherhood', cooldown: 120, job: 'MNK' },

  // Samurai
  16481: { id: 16481, name: 'Ikishoten', cooldown: 120, job: 'SAM' },

  // Red Mage
  7520: { id: 7520, name: 'Embolden', cooldown: 120, job: 'RDM' },

  // Summoner
  25799: { id: 25799, name: 'Searing Light', cooldown: 120, job: 'SMN' },

  // Machinist
  16502: { id: 16502, name: 'Automaton Queen', cooldown: 0, job: 'MCH' }, // Variable

  // Reaper
  24380: { id: 24380, name: 'Arcane Circle', cooldown: 120, job: 'RPR' },

  // Viper
  34620: { id: 34620, name: 'Vicewinder', cooldown: 40, job: 'VPR' },
  34623: { id: 34623, name: 'Vicepit', cooldown: 40, job: 'VPR' },
  34647: { id: 34647, name: "Serpent's Ire", cooldown: 120, job: 'VPR' },

  // Black Mage
  158: { id: 158, name: 'Manafont', cooldown: 120, job: 'BLM' },
  3573: { id: 3573, name: 'Ley Lines', cooldown: 120, job: 'BLM' },
  7421: { id: 7421, name: 'Triplecast', cooldown: 60, job: 'BLM' },

  // Pictomancer
  34675: { id: 34675, name: 'Starry Muse', cooldown: 120, job: 'PCT' },
  35347: { id: 35347, name: 'Living Muse', cooldown: 40, job: 'PCT' },
  35348: { id: 35348, name: 'Steel Muse', cooldown: 40, job: 'PCT' },
  35349: { id: 35349, name: 'Scenic Muse', cooldown: 40, job: 'PCT' },
  34685: { id: 34685, name: 'Tempera Coat', cooldown: 120, job: 'PCT' },
};

/**
 * Get skill definition by ID
 */
export function getSkillById(id: number): SkillDefinition | undefined {
  return SKILLS[id];
}

/**
 * Get all skills for a specific job
 */
export function getSkillsByJob(jobAbbr: string): SkillDefinition[] {
  return Object.values(SKILLS).filter((skill) => skill.job === jobAbbr);
}

/**
 * Get all trackable skills (those with significant cooldowns)
 */
export function getTrackableSkills(): SkillDefinition[] {
  return Object.values(SKILLS).filter((skill) => skill.cooldown >= 30);
}
