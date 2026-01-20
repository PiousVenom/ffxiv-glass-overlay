import type { JobRole, JobsMap } from '../types';

// FFXIV Job definitions with colors
export const JOBS: JobsMap = {
  // Tanks
  PLD: { name: 'Paladin', role: 'tank', color: '#a8d4e6' },
  WAR: { name: 'Warrior', role: 'tank', color: '#cf2621' },
  DRK: { name: 'Dark Knight', role: 'tank', color: '#d126cc' },
  GNB: { name: 'Gunbreaker', role: 'tank', color: '#796d30' },

  // Healers
  WHM: { name: 'White Mage', role: 'healer', color: '#fff0dc' },
  SCH: { name: 'Scholar', role: 'healer', color: '#8657ff' },
  AST: { name: 'Astrologian', role: 'healer', color: '#ffe74a' },
  SGE: { name: 'Sage', role: 'healer', color: '#80a0f0' },

  // Melee DPS
  MNK: { name: 'Monk', role: 'dps', color: '#d69c00' },
  DRG: { name: 'Dragoon', role: 'dps', color: '#4164cd' },
  NIN: { name: 'Ninja', role: 'dps', color: '#af1964' },
  SAM: { name: 'Samurai', role: 'dps', color: '#e46d04' },
  RPR: { name: 'Reaper', role: 'dps', color: '#965a90' },
  VPR: { name: 'Viper', role: 'dps', color: '#108b52' },

  // Ranged Physical DPS
  BRD: { name: 'Bard', role: 'dps', color: '#91ba5e' },
  MCH: { name: 'Machinist', role: 'dps', color: '#6ee1d6' },
  DNC: { name: 'Dancer', role: 'dps', color: '#e2b0af' },

  // Ranged Magical DPS
  BLM: { name: 'Black Mage', role: 'dps', color: '#a579d6' },
  SMN: { name: 'Summoner', role: 'dps', color: '#2d9b78' },
  RDM: { name: 'Red Mage', role: 'dps', color: '#e87b7b' },
  PCT: { name: 'Pictomancer', role: 'dps', color: '#e6a8fa' },

  // Limited Jobs
  BLU: { name: 'Blue Mage', role: 'dps', color: '#3366cc' },
};

// Role colors for fallback
export const ROLE_COLORS: Record<JobRole, string> = {
  tank: '#3a7bd5',
  healer: '#2ecc71',
  dps: '#e74c3c',
};

/**
 * Check if a job abbreviation is valid (security validation)
 */
export function isValidJob(jobAbbr: string): boolean {
  return jobAbbr in JOBS;
}

/**
 * Get job abbreviation from job string (handles various formats)
 */
export function getJobAbbr(jobString: string | null | undefined): string {
  if (!jobString) return '';
  const upper = jobString.toUpperCase().trim();

  // Direct match
  if (JOBS[upper]) return upper;

  // Try to find by full name
  for (const [abbr, data] of Object.entries(JOBS)) {
    if (data.name.toUpperCase() === upper) return abbr;
  }

  // Return first 3 chars as fallback
  return upper.substring(0, 3);
}

/**
 * Get role from job abbreviation
 */
export function getRole(jobAbbr: string): JobRole {
  const job = JOBS[jobAbbr];
  return job ? job.role : 'dps';
}

/**
 * Get job color
 */
export function getJobColor(jobAbbr: string): string {
  const job = JOBS[jobAbbr];
  if (job) return job.color;
  return ROLE_COLORS.dps;
}

/**
 * Get role color for a job
 */
export function getRoleColor(jobAbbr: string): string {
  const role = getRole(jobAbbr);
  return ROLE_COLORS[role];
}
