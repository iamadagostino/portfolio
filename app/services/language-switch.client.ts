import type { Language } from '~/i18n/i18n.resources';

/**
 * Client-side version that makes a fetch request to get the intelligent URL
 */
export async function getClientLanguageSwitchUrl(
  currentPath: string,
  currentLang: Language,
  targetLang: Language
): Promise<string> {
  // Remove language prefix from current path (handle full locale codes)
  const pathWithoutLang = currentPath.replace(/^\/(en-US|it-IT)/, '') || '/';

  // Check if we're on a specific article page (with slug)
  const articleMatch = pathWithoutLang.match(/^\/(article|articolo)\/(.+)$/);

  if (articleMatch) {
    const [, , currentSlug] = articleMatch;

    try {
      // Make a fetch request to the API endpoint that handles the language switching logic
      const response = await fetch('/api/blog-language-switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentSlug,
          currentLang,
          targetLang,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { targetUrl: string };
        return data.targetUrl;
      }
    } catch (error) {
      console.warn('Error during client-side intelligent language switching:', error);
    }
  }

  // For article listing pages and all other pages, use simple replacement with section translation
  return getSimpleLanguageSwitchUrl(currentPath, targetLang);
}

/**
 * Simple language switching that just replaces the language prefix and translates section names
 */
function getSimpleLanguageSwitchUrl(currentPath: string, targetLang: Language): string {
  let newPath: string;

  if (currentPath.startsWith('/en-US') || currentPath.startsWith('/it-IT')) {
    // Replace existing language prefix with full locale codes
    newPath = currentPath.replace(/^\/(en-US|it-IT)/, `/${targetLang}`);
  } else {
    // Add language prefix to root or other paths
    newPath = `/${targetLang}${currentPath === '/' ? '' : currentPath}`;
  }

  // Handle section name translations for article and project pages
  if (targetLang === 'it-IT') {
    // English to Italian: articles → articoli, article → articolo, projects → progetti
    newPath = newPath.replace(/\/articles(\/|$)/, '/articoli$1');
    newPath = newPath.replace(/\/article(\/|$)/, '/articolo$1');
    newPath = newPath.replace(/\/projects(\/|$)/, '/progetti$1');
  } else if (targetLang === 'en-US') {
    // Italian to English: articoli → articles, articolo → article, progetti → projects
    newPath = newPath.replace(/\/articoli(\/|$)/, '/articles$1');
    newPath = newPath.replace(/\/articolo(\/|$)/, '/article$1');
    newPath = newPath.replace(/\/progetti(\/|$)/, '/projects$1');
  }

  return newPath;
}
