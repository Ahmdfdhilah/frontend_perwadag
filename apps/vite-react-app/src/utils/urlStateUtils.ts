/**
 * Utility functions for preserving and restoring URL state across page navigation
 * Useful for maintaining filter states when navigating between list and detail pages
 */

/**
 * Save current URL state to sessionStorage
 * @param key - Unique key to identify the saved state
 * @param url - Full URL including pathname and search params
 */
export const saveUrlState = (key: string, url: string): void => {
  try {
    sessionStorage.setItem(key, url);
  } catch (error) {
    console.error('Error saving URL state to sessionStorage:', error);
  }
};

/**
 * Restore URL state from sessionStorage and navigate to it
 * @param key - Unique key to identify the saved state
 * @param navigate - React Router navigate function
 * @param fallbackPath - Fallback path if no saved state exists or error occurs
 * @param clearAfterUse - Whether to clear the saved state after use (default: false)
 * @returns boolean - true if state was restored, false if fallback was used
 */
export const restoreUrlState = (
  key: string,
  navigate: (path: string) => void,
  fallbackPath: string,
  clearAfterUse: boolean = false
): boolean => {
  try {
    const savedUrl = sessionStorage.getItem(key);
    
    if (savedUrl) {
      if (clearAfterUse) {
        sessionStorage.removeItem(key);
      }
      
      const url = new URL(savedUrl);
      navigate(url.pathname + url.search);
      return true;
    }
  } catch (error) {
    console.error('Error restoring URL state from sessionStorage:', error);
  }
  
  // Fallback to default path
  navigate(fallbackPath);
  return false;
};

/**
 * Check if there's saved URL state for a given key
 * @param key - Unique key to identify the saved state
 * @returns boolean - true if saved state exists
 */
export const hasSavedUrlState = (key: string): boolean => {
  try {
    return sessionStorage.getItem(key) !== null;
  } catch (error) {
    console.error('Error checking saved URL state:', error);
    return false;
  }
};

/**
 * Clear saved URL state for a given key
 * @param key - Unique key to identify the saved state
 */
export const clearUrlState = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing URL state from sessionStorage:', error);
  }
};

/**
 * Hook-like function to create URL state management functions for a specific key
 * @param key - Unique key to identify the saved state
 * @param fallbackPath - Default fallback path
 * @returns Object with URL state management functions
 */
export const createUrlStateManager = (key: string, fallbackPath: string) => {
  return {
    /**
     * Save current URL state
     * @param url - Full URL to save
     */
    save: (url: string) => saveUrlState(key, url),
    
    /**
     * Restore URL state and navigate
     * @param navigate - React Router navigate function
     * @param clearAfterUse - Whether to clear after use (default: false)
     */
    restore: (navigate: (path: string) => void, clearAfterUse: boolean = false) =>
      restoreUrlState(key, navigate, fallbackPath, clearAfterUse),
    
    /**
     * Check if saved state exists
     */
    hasSaved: () => hasSavedUrlState(key),
    
    /**
     * Clear saved state
     */
    clear: () => clearUrlState(key),
    
    /**
     * Create a navigation function that restores state or falls back
     * @param navigate - React Router navigate function
     * @returns Navigation function
     */
    createNavigateBack: (navigate: (path: string) => void) => () =>
      restoreUrlState(key, navigate, fallbackPath, false),
  };
};

// Pre-defined state managers for common use cases
export const riskAssessmentStateManager = createUrlStateManager(
  'riskAssessmentFilters',
  '/penilaian-resiko'
);

export const entryMeetingStateManager = createUrlStateManager(
  'entryMeetingFilters',
  '/entry-meeting'
);

export const exitMeetingStateManager = createUrlStateManager(
  'exitMeetingFilters',
  '/exit-meeting'
);

export const kuisionerStateManager = createUrlStateManager(
  'kuisionerFilters',
  '/kuisioner'
);

export const usersStateManager = createUrlStateManager(
  'usersFilters',
  '/users'
);