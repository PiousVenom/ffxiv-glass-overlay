// View and role types
export type ViewType = 'dps' | 'heal' | 'tank' | 'raid' | 'aggro';
export type JobRole = 'tank' | 'healer' | 'dps';
export type ShortNameFormat = 'none' | 'first' | 'last' | 'initials';
export type ThemeType = 'default' | 'dark' | 'light';
export type BlurMode = 'none' | 'all' | 'others';
export type FooterPosition = 'bottom' | 'top';
export type LayoutMode = 'vertical' | 'horizontal';
export type Language = 'en' | 'ja' | 'de' | 'fr' | 'cn';

// View constants for type-safe usage
export const VIEW = {
  DPS: 'dps',
  HEAL: 'heal',
  TANK: 'tank',
  RAID: 'raid',
  AGGRO: 'aggro',
} as const;

// Per-view stat column settings
export interface ViewColumnSettings {
  showDmgPercent: boolean;
  showCritPercent: boolean;
  showDHPercent: boolean;
  showCDHPercent: boolean;
  showMaxHit: boolean;
  showDeaths: boolean;
  showOverheal: boolean;
  showEffectiveHPS: boolean;
  showLast30s: boolean;
  showLast60s: boolean;
}

// Default column settings per view
export const DEFAULT_DPS_COLUMNS: ViewColumnSettings = {
  showDmgPercent: true,
  showCritPercent: false,
  showDHPercent: false,
  showCDHPercent: false,
  showMaxHit: false,
  showDeaths: false,
  showOverheal: false,
  showEffectiveHPS: false,
  showLast30s: false,
  showLast60s: false,
};

export const DEFAULT_HEAL_COLUMNS: ViewColumnSettings = {
  showDmgPercent: true,
  showCritPercent: false,
  showDHPercent: false,
  showCDHPercent: false,
  showMaxHit: false,
  showDeaths: false,
  showOverheal: true,
  showEffectiveHPS: false,
  showLast30s: false,
  showLast60s: false,
};

export const DEFAULT_TANK_COLUMNS: ViewColumnSettings = {
  showDmgPercent: true,
  showCritPercent: false,
  showDHPercent: false,
  showCDHPercent: false,
  showMaxHit: false,
  showDeaths: true,
  showOverheal: false,
  showEffectiveHPS: false,
  showLast30s: false,
  showLast60s: false,
};

// Settings interface - reorganized into sections
export interface Settings {
  // General settings
  general: {
    playerName: string;
    autoDetectName: boolean;
    theme: ThemeType;
    opacity: number;
    language: Language;
    decimalPrecision: number;
    useThousandSeparator: boolean;
    useCompactNumbers: boolean;
  };
  // Display settings
  display: {
    showJobIcons: boolean;
    shortNames: ShortNameFormat;
    layout: LayoutMode;
    footerPosition: FooterPosition;
    blurNames: BlurMode;
  };
  // Behavior settings
  behavior: {
    collapsible: boolean;
  };
  // Per-view column settings
  columns: {
    dps: ViewColumnSettings;
    heal: ViewColumnSettings;
    tank: ViewColumnSettings;
  };
  // Alert settings
  alerts: AlertSettings;
  // Timer settings
  timers: TimerSettings;
  // History settings
  history: HistorySettings;
}

// Default alert settings
export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  enabled: false,
  triggers: [],
  defaultCooldown: 10,
};

// Default timer settings
export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  enabled: false,
  trackedSkills: [],
  showOwnCooldowns: true,
  showPartyCooldowns: true,
};

// Default history settings
export const DEFAULT_HISTORY_SETTINGS: HistorySettings = {
  enabled: true,
  maxEntries: 20,
  autoSaveOnZoneChange: true,
};

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  general: {
    playerName: 'YOU',
    autoDetectName: true,
    theme: 'default',
    opacity: 100,
    language: 'en',
    decimalPrecision: 0,
    useThousandSeparator: true,
    useCompactNumbers: false,
  },
  display: {
    showJobIcons: true,
    shortNames: 'none',
    layout: 'vertical',
    footerPosition: 'bottom',
    blurNames: 'none',
  },
  behavior: {
    collapsible: true,
  },
  columns: {
    dps: { ...DEFAULT_DPS_COLUMNS },
    heal: { ...DEFAULT_HEAL_COLUMNS },
    tank: { ...DEFAULT_TANK_COLUMNS },
  },
  alerts: { ...DEFAULT_ALERT_SETTINGS },
  timers: { ...DEFAULT_TIMER_SETTINGS },
  history: { ...DEFAULT_HISTORY_SETTINGS },
};

// Legacy settings for migration
export interface LegacySettings {
  playerName: string;
  maxPlayers: number;
  showJobIcons: boolean;
  shortNames: ShortNameFormat;
  showDmgPercent: boolean;
  showCritPercent: boolean;
  showDHPercent: boolean;
  showCDHPercent: boolean;
}

// Raw combatant data from OverlayPlugin (inconsistent casing)
export interface RawCombatant {
  name: string;
  Job?: string;
  job?: string;
  encdps?: string | number;
  ENCDPS?: string | number;
  enchps?: string | number;
  ENCHPS?: string | number;
  damage?: string | number;
  healed?: string | number;
  damagetaken?: string | number;
  'damage%'?: string;
  'healed%'?: string;
  damage_taken_pct?: string;
  'crithit%'?: string;
  DirectHitPct?: string;
  CritDirectHitPct?: string;
  // Additional fields for new features
  deaths?: string | number;
  overHeal?: string | number;
  OverHealPct?: string;
  MAXHIT?: string;
  maxhit?: string;
  MAXHEAL?: string;
  maxheal?: string;
  Last30DPS?: string | number;
  Last60DPS?: string | number;
  Last180DPS?: string | number;
}

// Raw encounter data from OverlayPlugin
export interface RawEncounter {
  title?: string;
  CurrentZoneName?: string;
  duration?: string;
  encdps?: string | number;
  ENCDPS?: string | number;
  enchps?: string | number;
  ENCHPS?: string | number;
  damagetaken?: string | number;
}

// Raw combat data from OverlayPlugin
export interface RawCombatData {
  Encounter?: RawEncounter;
  Combatant?: Record<string, RawCombatant>;
  isActive?: string;
}

// Zone change event data
export interface ZoneChangeData {
  zoneID: number;
  zoneName: string;
}

// Primary player event data
export interface PrimaryPlayerData {
  charID: number;
  charName: string;
}

// Combat state event data
export interface InCombatData {
  inACTCombat: boolean;
  inGameCombat: boolean;
}

// Party member data
export interface PartyMember {
  id: string;
  name: string;
  worldId: number;
  job: number;
  level: number;
  inParty: boolean;
}

// Party changed event data
export interface PartyChangedData {
  party: PartyMember[];
  partyType: 'Solo' | 'Party' | 'AllianceA' | 'AllianceB' | 'AllianceC';
}

// Enmity entry for aggro tracking
export interface EnmityEntry {
  ID: number;
  Name: string;
  Enmity: number;
  isMe: boolean;
  HateRate: number;
  Job: number;
}

// Aggro list data
export interface AggroListData {
  Entries: EnmityEntry[];
  Target?: {
    ID: number;
    Name: string;
    CurrentHP: number;
    MaxHP: number;
  };
}

// Encounter history entry
export interface EncounterHistoryEntry {
  id: string;
  timestamp: number;
  title: string;
  duration: string;
  zone: string;
  data: RawCombatData;
}

// Player detail stats
export interface PlayerDetailStats {
  name: string;
  job: string;
  damage: number;
  dps: number;
  healing: number;
  hps: number;
  overheal: number;
  overhealpct: number;
  damageTaken: number;
  deaths: number;
  critPct: number;
  dhPct: number;
  cdhPct: number;
  maxHit: string;
  maxHeal: string;
}

// Job definition
export interface JobDefinition {
  name: string;
  role: JobRole;
  color: string;
}

// Jobs map type
export type JobsMap = Record<string, JobDefinition>;

// Select option for CustomSelect
export interface SelectOption<T = string> {
  value: T;
  label: string;
}

// OverlayPlugin callback types
export type CombatDataCallback = (data: RawCombatData) => void;
export type ZoneChangeCallback = (data?: ZoneChangeData) => void;
export type PrimaryPlayerCallback = (data: PrimaryPlayerData) => void;
export type InCombatCallback = (data: InCombatData) => void;
export type PartyChangedCallback = (data: PartyChangedData) => void;
export type AggroListCallback = (data: AggroListData) => void;

// OverlayPlugin handler response types
export interface LanguageResponse {
  language: string;
  languageId: string;
}

// Alert trigger types
export type AlertTriggerType = 'death' | 'aggro_warning' | 'encounter_start' | 'encounter_end';

export interface AlertTrigger {
  id: string;
  type: AlertTriggerType;
  condition: {
    player?: 'self' | 'any';
  };
  message: string;
  soundFile?: string;
  useTTS: boolean;
  useSound: boolean;
  enabled: boolean;
}

export interface AlertSettings {
  enabled: boolean;
  triggers: AlertTrigger[];
  defaultCooldown: number;
}

// Spell timer types
export interface SkillDefinition {
  id: number;
  name: string;
  cooldown: number;
  icon?: string;
  job?: string;
}

export interface ActiveTimer {
  skillId: number;
  skillName: string;
  startTime: number;
  duration: number;
  casterName: string;
}

export interface TimerSettings {
  enabled: boolean;
  trackedSkills: number[];
  showOwnCooldowns: boolean;
  showPartyCooldowns: boolean;
}

// History settings
export interface HistorySettings {
  enabled: boolean;
  maxEntries: number;
  autoSaveOnZoneChange: boolean;
}

// Performance data point for charts
export interface PerformancePoint {
  timestamp: number;
  dps: Record<string, number>;
  hps: Record<string, number>;
}

// LogLine callback type
export type LogLineCallback = (data: { line: string[] }) => void;

// OverlayPlugin window augmentation
declare global {
  interface Window {
    addOverlayListener?: (event: string, callback: (data: unknown) => void) => void;
    removeOverlayListener?: (event: string, callback: (data: unknown) => void) => void;
    startOverlayEvents?: () => void;
    callOverlayHandler?: (msg: { call: string; [key: string]: unknown }) => Promise<unknown>;
    OverlayPluginApi?: {
      ready: boolean;
      callHandler: (msg: string, callback?: (data: unknown) => void) => void;
    };
  }
}
