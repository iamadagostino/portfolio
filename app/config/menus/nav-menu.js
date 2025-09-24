import config from '~/config/app.json';

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
      // Home page
      pathname = localePrefix;
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
      // Smart routing for sections that have both page routes and anchors
      const sectionsWithAnchors = {
        projects: 'project-1',
        details: 'details'
      };
      
      const translatedSlug = t(`slugs.${link.slug}`, { defaultValue: link.slug });
      
      // If this section has an anchor and we're on the home page, use anchor for smooth scrolling
      if (sectionsWithAnchors[link.slug] && isOnHomePage) {
        pathname = `#${sectionsWithAnchors[link.slug]}`;
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
    pathname: '/#projects', // Changed from '#project-1' to '#projects'
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
