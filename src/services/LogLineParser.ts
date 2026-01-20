import { getSkillById } from '../data/skills';

import type { SkillDefinition } from '../types';

/**
 * Parsed skill usage event
 */
export interface SkillUsageEvent {
  timestamp: number;
  casterId: string;
  casterName: string;
  skillId: number;
  skillName: string;
  targetId: string;
  targetName: string;
}

/**
 * ACT Log Line Types
 * See: https://github.com/quisquous/cactbot/blob/main/docs/LogGuide.md
 */
const LOG_LINE_TYPE = {
  ABILITY: '21', // Single target ability
  AOE_ABILITY: '22', // AoE ability
  START_CASTING: '20', // Cast start
} as const;

/**
 * Parse a LogLine array into a skill usage event
 * Returns null if the line is not a skill usage or skill is not tracked
 */
export function parseLogLine(line: string[]): SkillUsageEvent | null {
  if (!line || line.length < 4) {
    return null;
  }

  const lineType = line[0];

  // We're interested in ability usage (types 21 and 22)
  if (lineType !== LOG_LINE_TYPE.ABILITY && lineType !== LOG_LINE_TYPE.AOE_ABILITY) {
    return null;
  }

  // LogLine format for ability usage (type 21/22):
  // 0: Type
  // 1: Timestamp
  // 2: Caster ID
  // 3: Caster Name
  // 4: Skill ID (hex)
  // 5: Skill Name
  // 6: Target ID
  // 7: Target Name
  // ... more fields

  if (line.length < 8) {
    return null;
  }

  const skillIdHex = line[4];
  const skillId = parseInt(skillIdHex, 16);

  // Check if this is a tracked skill
  const skillDef = getSkillById(skillId);
  if (!skillDef) {
    return null;
  }

  return {
    timestamp: Date.now(), // Use current time as ACT timestamp may not be synchronized
    casterId: line[2],
    casterName: line[3],
    skillId,
    skillName: line[5] || skillDef.name,
    targetId: line[6],
    targetName: line[7],
  };
}

/**
 * Get skill definition if tracked
 */
export function getTrackedSkillDef(skillId: number): SkillDefinition | null {
  return getSkillById(skillId) || null;
}
