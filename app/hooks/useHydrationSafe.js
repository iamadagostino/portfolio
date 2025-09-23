import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatches by ensuring server and client
 * render the same content on initial hydration, then updating to client state.
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  return isHydrated;
}

/**
 * Hook specifically for handling translations that might cause hydration mismatches.
 * Returns a flag indicating whether it's safe to use client-side translations.
 */
export function useHydrationSafeTranslations() {
  return useHydrationSafe();
}