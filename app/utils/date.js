export function formatDate(date, lang = 'en') {
  // Map language codes to locale strings
  const locales = {
    'en': 'en-US',
    'it': 'it-IT'
  };
  
  const locale = locales[lang] || 'en-US';
  
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
