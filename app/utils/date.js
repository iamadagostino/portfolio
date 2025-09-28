export function formatDate(date, lang = 'en') {
  // Normalize the locale - JavaScript's Intl.DateTimeFormat handles all world locales
  let locale = lang;
  
  // If only language code provided (e.g., 'en', 'it'), let the browser/system 
  // determine the best regional variant based on user's locale preferences
  // JavaScript's Intl automatically falls back to appropriate variants
  if (!lang.includes('-')) {
    // For most cases, we can just use the language code directly
    // The Intl API will automatically select the most appropriate regional variant
    locale = lang;
  }
  
  try {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    // Fallback to English if the locale is not supported
    console.warn(`Unsupported locale: ${locale}, falling back to English`);
    return new Date(date).toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
