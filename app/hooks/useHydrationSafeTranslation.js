import { useState, useEffect } from 'react';

/**
 * Hook to handle translations in a hydration-safe way.
 * On the server and initial client render, it uses server-provided data.
 * After hydration, it updates to use client-side translation logic.
 */
export function useHydrationSafeTranslation(translationFn, serverLanguage, fallbackData) {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // During SSR and initial hydration, use server data or a safe fallback
  if (!isHydrated) {
    return fallbackData || translationFn;
  }
  
  // After hydration, use the actual translation function
  return translationFn;
}