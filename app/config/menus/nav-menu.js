import config from '@/config/app.json';
import { getLocalizedPath } from '@/config/routes';

const SECTION_ANCHORS = {
  home: {
    canonical: 'home',
    localized: {
      'it-IT': 'home',
    },
    aliases: ['intro'],
  },
  projects: {
    canonical: 'projects',
    localized: {
      'it-IT': 'progetti',
    },
    aliases: ['project-1', 'project-2', 'project-3', 'progetto-1', 'progetto-2', 'progetto-3'],
  },
  details: {
    canonical: 'details',
    localized: {
      'it-IT': 'dettagli',
    },
  },
};

export const getLocalizedSectionAnchor = (slug, language) => {
  const config = SECTION_ANCHORS[slug];
  if (!config) {
    return null;
  }

  return config.localized[language] ?? config.canonical;
};

// Navigation link keys for translation
export const navLinkKeys = [
  {
    key: 'Home',
    type: 'home',
  },
  {
    key: 'Projects',
    type: 'page',
    slug: 'projects',
  },
  {
    key: 'Details',
    type: 'page',
    slug: 'details',
  },
  {
    key: 'Articles',
    type: 'page',
    slug: 'articles',
  },
  {
    key: 'Contact',
    type: 'page',
    slug: 'contact',
  },
];

// Helper function to get translated nav links with locale-aware URLs
export const getNavLinks = (t, currentLanguage = 'en', currentPath = '/') => {
  const localePrefix = `/${currentLanguage}`;
  const isOnHomePage = currentPath === localePrefix || currentPath === `${localePrefix}/`;
  
  return navLinkKeys.map(link => {
    let pathname;

    if (link.type === 'home') {
      // Always navigate to #home anchor to show the hero section
      pathname = isOnHomePage ? '#home' : `${localePrefix}#home`;
    } else if (link.type === 'anchor') {
      // Hash links (anchors on home page) - DON'T translate the anchor ID
      // HTML section IDs are fixed regardless of language
      if (isOnHomePage) {
        // If we're on the home page, use just the hash
        pathname = `#${link.anchor}`;
      } else {
        // If we're on another page, include the full path to home + hash (no slash before #)
        pathname = `${localePrefix}#${link.anchor}`;
      }
    } else if (link.type === 'page') {
      // Use our domain-based route mapping system
      const translatedSlug = getLocalizedPath('main', link.slug, currentLanguage) || t(`slugs.${link.slug}`, { defaultValue: link.slug });
      
      // If this section has an anchor and we're on the home page, use anchor for smooth scrolling
      const anchorId = getLocalizedSectionAnchor(link.slug, currentLanguage);
      if (anchorId) {
        pathname = isOnHomePage ? `#${anchorId}` : `${localePrefix}#${anchorId}`;
      } else {
        // Otherwise use the full localized route
        pathname = `${localePrefix}/${translatedSlug}`;
      }
    } else {
      // Fallback
      pathname = localePrefix || '/';
    }
    
    return {
      label: t(link.key),
      pathname: pathname,
      key: link.key,
      type: link.type, // Include type for handling in navbar
    };
  });
};

export const getAnchorAliasMap = (language) => {
  const aliases = {};

  Object.values(SECTION_ANCHORS).forEach(({ canonical, localized, aliases: extraAliases = [] }) => {
    aliases[canonical] = canonical;
    aliases[`#${canonical}`] = canonical;

    const localizedValue = localized[language];
    if (localizedValue && localizedValue !== canonical) {
      aliases[localizedValue] = canonical;
      aliases[`#${localizedValue}`] = canonical;
    }

    extraAliases.forEach((alias) => {
      aliases[alias] = canonical;
      aliases[`#${alias}`] = canonical;
    });
  });

  return aliases;
};

export const getAnchorHashes = (language) => {
  const hashes = {};

  Object.entries(SECTION_ANCHORS).forEach(([slug, { canonical, localized, aliases: extraAliases = [] }]) => {
    const variations = new Set([`#${canonical}`]);
    const localizedValue = localized[language];
    if (localizedValue && localizedValue !== canonical) {
      variations.add(`#${localizedValue}`);
    }
    extraAliases.forEach((alias) => variations.add(`#${alias}`));
    hashes[slug] = Array.from(variations);
  });

  return hashes;
};

export const getCanonicalSectionAnchor = (slug) => SECTION_ANCHORS[slug]?.canonical ?? null;

export const socialLinks = [
  {
    label: 'Facebook',
    url: `https://www.facebook.com/${config.facebook}`,
    icon: 'facebook',
  },
  {
    label: 'Instagram',
    url: `https://www.instagram.com/${config.instagram}`,
    icon: 'instagram',
  },
  {
    label: 'X',
    url: `https://x.com/${config.x}`,
    icon: 'twitter-x',
  },
  {
    label: 'Github',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
];

// Keep original navLinks for backward compatibility
export const navLinks = [
  {
    label: 'Projects',
    pathname: '/#projects',
  },
  {
    label: 'Details',
    pathname: '/#details',
  },
  {
    label: 'Articles',
    pathname: '/articles',
  },
  {
    label: 'Contact',
    pathname: '/contact',
  },
];
