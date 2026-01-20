import type {
  CombatDataCallback,
  ZoneChangeCallback,
  PrimaryPlayerCallback,
  InCombatCallback,
  PartyChangedCallback,
  AggroListCallback,
  LogLineCallback,
  LanguageResponse,
} from '../types';
import {
  isZoneChangeData,
  isPrimaryPlayerData,
  isInCombatData,
  isPartyChangedData,
  isAggroListData,
  isLogLineData,
  isRawCombatData,
} from '../utils/validators';

/**
 * OverlayPlugin Service
 * Handles communication with ACT's OverlayPlugin
 */
class OverlayPluginService {
  isAvailable: boolean;
  private listeners: Map<string, (data: unknown) => void>;
  private primaryPlayerName: string | null = null;
  private inCombat: boolean = false;

  constructor() {
    this.isAvailable = typeof window.addOverlayListener !== 'undefined';
    this.listeners = new Map();
  }

  /**
   * Check if OverlayPlugin API is available
   */
  checkAvailability(): boolean {
    this.isAvailable = typeof window.addOverlayListener !== 'undefined';
    return this.isAvailable;
  }

  /**
   * Get the detected primary player name
   */
  getPrimaryPlayerName(): string | null {
    return this.primaryPlayerName;
  }

  /**
   * Get current combat state
   */
  isInCombat(): boolean {
    return this.inCombat;
  }

  /**
   * Call an OverlayPlugin handler and return a promise
   */
  async callHandler<T>(call: string, params: Record<string, unknown> = {}): Promise<T | null> {
    if (!this.checkAvailability()) {
      return null;
    }

    // Try the modern callOverlayHandler first
    if (window.callOverlayHandler) {
      try {
        const result = await window.callOverlayHandler({ call, ...params });
        return result as T;
      } catch {
        return null;
      }
    }

    // Fall back to OverlayPluginApi
    if (window.OverlayPluginApi?.callHandler) {
      return new Promise((resolve) => {
        window.OverlayPluginApi!.callHandler(JSON.stringify({ call, ...params }), (data) =>
          resolve(data as T)
        );
      });
    }

    return null;
  }

  /**
   * Get the game language
   */
  async getLanguage(): Promise<LanguageResponse | null> {
    return this.callHandler<LanguageResponse>('getLanguage');
  }

  /**
   * Save data to OverlayPlugin storage
   */
  async saveData(key: string, data: unknown): Promise<boolean> {
    const result = await this.callHandler('saveData', { key, data });
    return result !== null;
  }

  /**
   * Load data from OverlayPlugin storage
   */
  async loadData<T>(key: string): Promise<T | null> {
    const result = await this.callHandler<{ key: string; data: T }>('loadData', { key });
    return result?.data ?? null;
  }

  /**
   * Text-to-speech via ACT
   */
  async say(text: string): Promise<void> {
    await this.callHandler('say', { text });
  }

  /**
   * Play a sound file via ACT
   */
  async playSound(file: string): Promise<void> {
    await this.callHandler('playSound', { file });
  }

  /**
   * Broadcast a message to other overlays
   */
  async broadcast(msg: Record<string, unknown>): Promise<void> {
    await this.callHandler('broadcast', { msg });
  }

  /**
   * Subscribe to combat data updates
   */
  subscribeToCombatData(callback: CombatDataCallback): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    const wrappedCallback = (data: unknown) => {
      if (isRawCombatData(data)) {
        callback(data);
      }
    };
    window.addOverlayListener?.('CombatData', wrappedCallback);
    this.listeners.set('CombatData', wrappedCallback);
    return true;
  }

  /**
   * Subscribe to zone changes
   */
  subscribeToZoneChange(callback: ZoneChangeCallback): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    const wrappedCallback = (data: unknown) => {
      if (isZoneChangeData(data)) {
        callback(data);
      } else {
        // ZoneChangeCallback allows undefined, call with no args for invalid data
        callback();
      }
    };
    window.addOverlayListener?.('ChangeZone', wrappedCallback);
    this.listeners.set('ChangeZone', wrappedCallback);
    return true;
  }

  /**
   * Subscribe to primary player changes (auto-detect player name)
   */
  subscribeToPrimaryPlayer(callback: PrimaryPlayerCallback): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    const wrappedCallback = (data: unknown) => {
      if (isPrimaryPlayerData(data)) {
        this.primaryPlayerName = data.charName;
        callback(data);
      }
    };
    window.addOverlayListener?.('ChangePrimaryPlayer', wrappedCallback);
    this.listeners.set('ChangePrimaryPlayer', wrappedCallback);
    return true;
  }

  /**
   * Subscribe to combat state changes
   */
  subscribeToInCombat(callback: InCombatCallback): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    const wrappedCallback = (data: unknown) => {
      if (isInCombatData(data)) {
        this.inCombat = data.inGameCombat || data.inACTCombat;
        callback(data);
      }
    };
    window.addOverlayListener?.('InCombat', wrappedCallback);
    this.listeners.set('InCombat', wrappedCallback);
    return true;
  }

  /**
   * Subscribe to party changes
   */
  subscribeToPartyChanged(callback: PartyChangedCallback): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    const wrappedCallback = (data: unknown) => {
      if (isPartyChangedData(data)) {
        callback(data);
      }
    };
    window.addOverlayListener?.('PartyChanged', wrappedCallback);
    this.listeners.set('PartyChanged', wrappedCallback);
    return true;
  }

  /**
   * Subscribe to aggro list updates
   */
  subscribeToAggroList(callback: AggroListCallback): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    const wrappedCallback = (data: unknown) => {
      if (isAggroListData(data)) {
        callback(data);
      }
    };
    window.addOverlayListener?.('EnmityAggroList', wrappedCallback);
    this.listeners.set('EnmityAggroList', wrappedCallback);
    return true;
  }

  /**
   * Subscribe to log line events (for spell tracking)
   */
  subscribeToLogLine(callback: LogLineCallback): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    const wrappedCallback = (data: unknown) => {
      if (isLogLineData(data)) {
        callback(data);
      }
    };
    window.addOverlayListener?.('LogLine', wrappedCallback);
    this.listeners.set('LogLine', wrappedCallback);
    return true;
  }

  /**
   * Start receiving events from OverlayPlugin
   */
  startEvents(): boolean {
    if (!this.checkAvailability()) {
      return false;
    }

    window.startOverlayEvents?.();
    return true;
  }

  /**
   * Initialize all subscriptions and start events
   */
  initialize(
    onCombatData: CombatDataCallback,
    onZoneChange?: ZoneChangeCallback,
    options?: {
      onPrimaryPlayer?: PrimaryPlayerCallback;
      onInCombat?: InCombatCallback;
      onPartyChanged?: PartyChangedCallback;
      onAggroList?: AggroListCallback;
      onLogLine?: LogLineCallback;
    }
  ): boolean {
    this.subscribeToCombatData(onCombatData);
    if (onZoneChange) {
      this.subscribeToZoneChange(onZoneChange);
    }

    // Subscribe to optional events
    if (options?.onPrimaryPlayer) {
      this.subscribeToPrimaryPlayer(options.onPrimaryPlayer);
    }
    if (options?.onInCombat) {
      this.subscribeToInCombat(options.onInCombat);
    }
    if (options?.onPartyChanged) {
      this.subscribeToPartyChanged(options.onPartyChanged);
    }
    if (options?.onAggroList) {
      this.subscribeToAggroList(options.onAggroList);
    }
    if (options?.onLogLine) {
      this.subscribeToLogLine(options.onLogLine);
    }

    this.startEvents();
    return this.isAvailable;
  }

  /**
   * Cleanup all subscriptions
   */
  cleanup(): void {
    if (!window.removeOverlayListener) {
      this.listeners.clear();
      return;
    }

    for (const [event, callback] of this.listeners.entries()) {
      window.removeOverlayListener(event, callback);
    }
    this.listeners.clear();
  }
}

// Export singleton instance
const overlayPlugin = new OverlayPluginService();
export default overlayPlugin;
