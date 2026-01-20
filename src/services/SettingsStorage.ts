import overlayPlugin from './OverlayPlugin';
import type { Validator } from '../utils/validators';

/**
 * Storage abstraction that tries OverlayPlugin first, then falls back to localStorage
 */
class SettingsStorageService {
  /**
   * Save data to storage
   * Tries OverlayPlugin saveData first, falls back to localStorage
   */
  async save(key: string, data: unknown): Promise<boolean> {
    // Try OverlayPlugin first
    if (overlayPlugin.isAvailable) {
      const saved = await overlayPlugin.saveData(key, data);
      if (saved) {
        return true;
      }
    }

    // Fallback to localStorage
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
      return false;
    }
  }

  /**
   * Load data from storage
   * Tries OverlayPlugin loadData first, falls back to localStorage
   * @param key - Storage key
   * @param validator - Optional validator function to validate the loaded data structure
   */
  async load<T>(key: string, validator?: Validator<T>): Promise<T | null> {
    // Try OverlayPlugin first
    if (overlayPlugin.isAvailable) {
      const data = await overlayPlugin.loadData<unknown>(key);
      if (data !== null) {
        // Validate if validator provided
        if (validator) {
          if (validator(data)) {
            return data;
          }
          console.warn(`Data from OverlayPlugin for key "${key}" failed validation`);
          return null;
        }
        return data as T;
      }
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;

      const parsed: unknown = JSON.parse(saved);

      // Validate if validator provided
      if (validator) {
        if (validator(parsed)) {
          return parsed;
        }
        console.warn(`Data from localStorage for key "${key}" failed validation`);
        return null;
      }

      return parsed as T;
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return null;
    }
  }

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    return overlayPlugin.isAvailable || typeof localStorage !== 'undefined';
  }
}

// Export singleton instance
const settingsStorage = new SettingsStorageService();
export default settingsStorage;
