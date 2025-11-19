/**
 * Storage Utilities
 * Handles saving and loading player progression data to/from LocalStorage
 */

const STORAGE_KEYS = {
  PROGRESSION: 'tavernRummyProgression',
  VERSION: '2.0'
};

/**
 * Default progression data structure
 */
const DEFAULT_PROGRESSION = {
  version: STORAGE_KEYS.VERSION,
  totalXP: 0,
  level: 1,
  abilityPoints: 0,
  spentAP: 0,
  gold: 200, // Player's gold for purchasing cosmetics (starting amount)
  unlockedAbilities: [],
  abilityLevels: {}, // For passive abilities with multiple levels
  equippedAbilities: [], // Active abilities currently equipped
};

/**
 * Save progression data to LocalStorage
 *
 * @param {Object} progressionData - Progression data to save
 * @returns {boolean} Success status
 */
export const saveProgression = (progressionData) => {
  try {
    const dataToSave = {
      ...progressionData,
      version: STORAGE_KEYS.VERSION,
      lastSaved: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.PROGRESSION, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Error saving progression:', error);
    return false;
  }
};

/**
 * Load progression data from LocalStorage
 *
 * @returns {Object} Progression data or default if not found
 */
export const loadProgression = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESSION);

    if (!saved) {
      return { ...DEFAULT_PROGRESSION };
    }

    const data = JSON.parse(saved);

    // Version migration (if needed in future)
    if (data.version !== STORAGE_KEYS.VERSION) {
      console.log('Migrating save data from version', data.version, 'to', STORAGE_KEYS.VERSION);
      // Add migration logic here if needed
    }

    // Ensure all required fields exist
    return {
      ...DEFAULT_PROGRESSION,
      ...data,
      version: STORAGE_KEYS.VERSION
    };
  } catch (error) {
    console.error('Error loading progression:', error);
    return { ...DEFAULT_PROGRESSION };
  }
};

/**
 * Clear all progression data (reset progress)
 *
 * @returns {boolean} Success status
 */
export const clearProgression = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESSION);
    return true;
  } catch (error) {
    console.error('Error clearing progression:', error);
    return false;
  }
};

/**
 * Check if progression data exists
 *
 * @returns {boolean} True if saved data exists
 */
export const hasProgressionData = () => {
  return localStorage.getItem(STORAGE_KEYS.PROGRESSION) !== null;
};

/**
 * Export progression data as JSON (for backup)
 *
 * @returns {string} JSON string of progression data
 */
export const exportProgression = () => {
  const data = loadProgression();
  return JSON.stringify(data, null, 2);
};

/**
 * Import progression data from JSON string
 *
 * @param {string} jsonString - JSON string to import
 * @returns {boolean} Success status
 */
export const importProgression = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    return saveProgression(data);
  } catch (error) {
    console.error('Error importing progression:', error);
    return false;
  }
};

/**
 * Get storage size (for debugging)
 *
 * @returns {number} Size in bytes
 */
export const getStorageSize = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESSION);
  return data ? new Blob([data]).size : 0;
};
