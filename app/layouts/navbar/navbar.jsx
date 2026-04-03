import { cssProps, msToNum, numToMs } from '@/utils/style';
import {
  getAnchorAliasMap,
  getAnchorHashes,
  getCanonicalSectionAnchor,
  getNavLinks,
  socialLinks,
} from '../../config/menus/nav-menu';

import { Icon } from '@/components/main/icon';
import { Monogram } from '@/components/main/monogram';
import { useNavbar } from '@/components/main/navbar-provider';
import { Transition } from '@/components/main/transition';
import config from '@/config/app.json';
import { tokens } from '@/config/theme.mjs';
import { useCurrentLanguage, useNavbarTranslation } from '@/i18n/i18n.hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router';
import { ExperienceToggle } from './3d-experience-toggle';
import { LanguageDropdown } from './language-dropdown';
import NavbarHeader from './navbar-header';
import styles from './navbar.module.css';
import { ThemeToggle } from './theme-toggle';

export const Navbar = ({ locale: serverLocale }) => {
  const isHydrated = true;
  const {
    theme,
    target,
    current,
    isMobile,
    location,
    menuOpen,
    headerRef,
    setTarget,
    setCurrent,
    windowSize,
    setMenuOpen,
    isHeroHidden,
  } = useNavbar();

  // i18n - move this up before useEffects
  const { t } = useNavbarTranslation();
  const clientLanguage = useCurrentLanguage();
  const currentLanguage = serverLocale || clientLanguage; // Use server locale first

  // Generate locale-aware home link early
  const localePrefix = `/${currentLanguage}`;
  const homeLink = localePrefix;
  const navLinks = getNavLinks(t, currentLanguage, location.pathname);
  const anchorAliasMap = useMemo(() => getAnchorAliasMap(currentLanguage), [currentLanguage]);
  const anchorHashes = useMemo(() => getAnchorHashes(currentLanguage), [currentLanguage]);
  const canonicalHomeAnchor = getCanonicalSectionAnchor('home') || 'home';
  const canonicalProjectAnchor = getCanonicalSectionAnchor('projects') || 'projects';
  const canonicalDetailsAnchor = getCanonicalSectionAnchor('details') || 'details';
  const toCanonicalAnchor = useCallback(
    (hash) => {
      if (!hash) return '';
      const keyWithHash = hash.startsWith('#') ? hash : `#${hash}`;
      const keyWithoutHash = keyWithHash.slice(1);

      if (keyWithoutHash === 'home' && canonicalHomeAnchor) {
        return canonicalHomeAnchor;
      }

      if (keyWithoutHash.startsWith('project-') && canonicalProjectAnchor) {
        return canonicalProjectAnchor;
      }

      if (keyWithoutHash.startsWith('progetto-') && canonicalProjectAnchor) {
        return canonicalProjectAnchor;
      }

      return anchorAliasMap[keyWithHash] ?? anchorAliasMap[keyWithoutHash] ?? keyWithoutHash;
    },
    [anchorAliasMap, canonicalHomeAnchor, canonicalProjectAnchor]
  );

  useEffect(() => {
    // Update current state for proper navigation tracking
    setCurrent(`${location.pathname}${location.hash}`);
  }, [location, setCurrent]);

  // Handle smooth scroll nav items
  useEffect(() => {
    if (!target) return;

    // Check if we're on home page (with any locale)
    const isOnHomePage = location.pathname === homeLink || location.pathname === `${homeLink}/`;
    if (!isOnHomePage) return;

    // Scroll to the target hash when navigating from other pages
    const canonicalTarget = toCanonicalAnchor(target);

    // Special case: if target is #home, scroll to end of hero animation sequence
    if (target === '#home' || canonicalTarget === 'home') {
      console.log('[Navbar] Target is #home, scrolling to end of animation sequence');

      // Hero animation is pinned for 4 viewport heights
      // Scroll to that position to show the final frame with everything visible
      const SCROLL_DURATION_MULTIPLIER = 4;
      const scrollTarget = window.innerHeight * SCROLL_DURATION_MULTIPLIER;

      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });
      setCurrent(`${location.pathname}${target}`);
    } else {
      // For other targets, use normal scrollIntoView
      const targetElement = canonicalTarget ? document.getElementById(canonicalTarget) : null;
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setCurrent(`${location.pathname}${target}`);
      }
    }

    setTarget(null);
  }, [anchorAliasMap, location.pathname, setCurrent, setTarget, target, homeLink, toCanonicalAnchor]);

  // Handle swapping the theme when intersecting with inverse themed elements
  useEffect(() => {
    const navItems = document.querySelectorAll('[data-navbar-item]');
    const inverseTheme = theme === 'dark' ? 'light' : 'dark';
    const { innerHeight } = window;

    let inverseMeasurements = [];
    let navItemMeasurements = [];

    const isOverlap = (rect1, rect2, scrollY) => {
      return !(rect1.bottom - scrollY < rect2.top || rect1.top - scrollY > rect2.bottom);
    };

    const resetNavTheme = () => {
      for (const measurement of navItemMeasurements) {
        measurement.element.dataset.theme = '';
      }
    };

    const handleInversion = () => {
      const invertedElements = document.querySelectorAll(`[data-theme='${inverseTheme}'][data-invert]`);

      if (!invertedElements) return;

      inverseMeasurements = Array.from(invertedElements).map((item) => ({
        element: item,
        top: item.offsetTop,
        bottom: item.offsetTop + item.offsetHeight,
      }));

      const { scrollY } = window;

      resetNavTheme();

      for (const inverseMeasurement of inverseMeasurements) {
        if (inverseMeasurement.top - scrollY > innerHeight || inverseMeasurement.bottom - scrollY < 0) {
          continue;
        }

        for (const measurement of navItemMeasurements) {
          if (isOverlap(inverseMeasurement, measurement, scrollY)) {
            measurement.element.dataset.theme = inverseTheme;
          } else {
            measurement.element.dataset.theme = '';
          }
        }
      }
    };

    // Currently only the light theme has dark full-width elements
    if (theme === 'light') {
      navItemMeasurements = Array.from(navItems).map((item) => {
        const rect = item.getBoundingClientRect();

        return {
          element: item,
          top: rect.top,
          bottom: rect.bottom,
        };
      });

      document.addEventListener('scroll', handleInversion);
      handleInversion();
    }

    return () => {
      document.removeEventListener('scroll', handleInversion);
      resetNavTheme();
    };
  }, [theme, windowSize, location.key]);

  // Check if a nav item should be active
  const getCurrent = (url = '', type = '') => {
    // During initial hydration, return empty string to match server
    if (!isHydrated) {
      return '';
    }

    const nonTrailing = current?.endsWith('/') ? current?.slice(0, -1) : current;
    const currentPath = location.pathname;
    const currentHash = current?.includes('#') ? current.split('#')[1] : '';
    const currentBase = current ? current.split('#')[0] : '';
    const canonicalCurrentHash = toCanonicalAnchor(currentHash);
    const urlHash = url.includes('#') ? url.split('#')[1] : '';
    const canonicalUrlHash = toCanonicalAnchor(urlHash);

    // Smart highlighting system for localized routes
    if (type === 'page') {
      // Create mapping for ALL localized route matching
      const routeMatches = {
        articles: ['/articles', '/articoli', '/article', '/articolo'],
        contact: ['/contact', '/contatti'],
        projects: ['/projects', '/progetti', ...(anchorHashes.projects || [])],
        details: ['/details', '/dettagli', ...(anchorHashes.details || [])],
      };

      // Check if URL contains any route segment and current path matches
      for (const [, variations] of Object.entries(routeMatches)) {
        const urlContainsRoute = variations.some((variation) => url.includes(variation));
        const currentPathMatches = variations.some((variation) => currentPath.includes(variation));

        if (urlContainsRoute && currentPathMatches) {
          return 'page';
        }
      }

      // Additional smart detection: if on home with anchor, check if navbar link corresponds to that anchor
      if (canonicalCurrentHash) {
        const anchorRoutePairs = [
          {
            canonicalAnchor: canonicalProjectAnchor,
            routes: ['/projects', '/progetti'],
            hashes: anchorHashes.projects || [],
          },
          {
            canonicalAnchor: canonicalDetailsAnchor,
            routes: ['/details', '/dettagli'],
            hashes: anchorHashes.details || [],
          },
        ];

        for (const { canonicalAnchor, routes, hashes } of anchorRoutePairs) {
          if (!canonicalAnchor) continue;

          const matchesRoute =
            routes.some((route) => url.includes(route)) || hashes.some((hashValue) => url.includes(hashValue));

          if (matchesRoute && canonicalCurrentHash === canonicalAnchor) {
            return 'page';
          }
        }
      }
    }
    // Enhanced highlighting for anchor sections
    if (type === 'anchor' || url.startsWith('#')) {
      // If we have a current hash, check if it matches this URL
      if (canonicalCurrentHash && canonicalUrlHash && canonicalCurrentHash === canonicalUrlHash) {
        return 'page';
      }

      // Also check if we're on a localized route that corresponds to this anchor
      const anchorId = canonicalUrlHash || url.replace('#', '');
      if (
        canonicalHomeAnchor &&
        anchorId === canonicalHomeAnchor &&
        (currentPath === homeLink || currentBase === homeLink) &&
        canonicalCurrentHash === canonicalHomeAnchor
      ) {
        return 'page';
      }
      const anchorToRouteMapping = {};
      if (canonicalProjectAnchor) {
        anchorToRouteMapping[canonicalProjectAnchor] = ['/projects', '/progetti'];
      }
      if (canonicalDetailsAnchor) {
        anchorToRouteMapping[canonicalDetailsAnchor] = ['/details', '/dettagli'];
      }

      if (anchorToRouteMapping[anchorId]) {
        const routeVariations = anchorToRouteMapping[anchorId];
        const isOnCorrespondingRoute = routeVariations.some((route) => currentPath.includes(route));

        if (isOnCorrespondingRoute) {
          return 'page';
        }
      }
    }

    // Home link handling: mark Home active when on the locale home path
    // Only match exact home path or a home path with a hash (e.g. '/en' or '/en#projects').
    if (type === 'home') {
      const onHomePath = currentPath === homeLink || currentBase === homeLink;
      const hashMatchesHome = !canonicalCurrentHash || canonicalCurrentHash === canonicalHomeAnchor;
      const isHashLink = url.startsWith('#');

      if (isHashLink) {
        if (onHomePath && hashMatchesHome) {
          return 'page';
        }
      } else {
        if ((currentPath === url || currentBase === url) && hashMatchesHome) {
          return 'page';
        }
      }
    }

    // Fallback: exact URL match
    if (url === nonTrailing) {
      return 'page';
    }

    return '';
  };

  // Store the current hash to scroll to
  const handleNavItemClick = (event) => {
    const href = event.currentTarget.href || event.currentTarget.getAttribute('href');

    // For anchor links, handle them consistently
    if (href && href.includes('#')) {
      const hash = href.split('#')[1];

      // Check if we're dealing with a hash link on the same page
      const isOnHomePage = location.pathname === homeLink || location.pathname === `${homeLink}/`;

      // Special handling for Home link when hero is hidden
      if (hash === 'home' && isHeroHidden && isOnHomePage) {
        // Hero is hidden, do a full page reload to show animation
        event.preventDefault();
        console.log('[Navbar] Home clicked with hidden hero - reloading page');
        window.location.href = homeLink;
        return;
      }

      if (hash && isOnHomePage) {
        // Prevent default browser behavior to avoid conflicts
        event.preventDefault();

        // Use our custom scroll logic for smooth scrolling
        const canonicalHash = toCanonicalAnchor(hash);
        const targetElement = canonicalHash ? document.getElementById(canonicalHash) : null;
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Update URL and state after scroll starts
          window.history.replaceState(null, '', `${location.pathname}#${hash}`);
          setCurrent(`${location.pathname}#${hash}`);
        }
      } else if (hash && !isOnHomePage) {
        // If clicking an anchor that points to home from another page,
        // store the target so the NavbarProvider can scroll to it after navigation
        // We don't preventDefault here so RouterLink/navigation proceeds normally.
        try {
          setTarget(`#${hash}`);
        } catch {
          // ignore if setTarget isn't available for some reason
        }
      }
      // For hash links from other pages, let RouterLink handle navigation naturally
    }
  };

  const handleMobileNavClick = (event) => {
    handleNavItemClick(event);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <div className="z-40 flex flex-col" data-hero-nav="container">
      {/* Header */}
      <NavbarHeader locale={currentLanguage} />

      {/* Aside */}
      <aside className={styles.navbar} ref={headerRef}>
        {/* Monogram Logo */}
        <RouterLink
          viewTransition
          prefetch="intent"
          to={homeLink}
          data-navbar-item
          className={styles.logo}
          aria-label={`${config.name}, ${config.role}`}
          onClick={handleMobileNavClick}
        >
          <Monogram highlight />
        </RouterLink>

        {/* Desktop Navigation Menu */}
        <nav className={styles.nav} hidden={isMobile}>
          <div className={styles.navList}>
            {navLinks.map(({ label, pathname, key, type }) => {
              // Render a native anchor when the pathname is an in-page hash.
              // Note: getNavLinks may return '#projects' even for items with
              // type === 'page' when on the home page, so rely on pathname
              // content rather than the declared type.
              if (pathname && pathname.startsWith('#')) {
                return (
                  <a
                    href={pathname}
                    key={key || label}
                    data-navbar-item
                    className={styles.navLink}
                    aria-current={getCurrent(pathname, type)}
                    onClick={handleNavItemClick}
                  >
                    {label}
                  </a>
                );
              }

              // For all other links, use RouterLink
              return (
                <RouterLink
                  viewTransition
                  prefetch="intent"
                  to={pathname}
                  key={key || label}
                  data-navbar-item
                  className={styles.navLink}
                  aria-current={getCurrent(pathname, type)}
                  onClick={handleNavItemClick}
                >
                  {label}
                </RouterLink>
              );
            })}
          </div>
          <NavbarIcons desktop />
        </nav>

        {/* Mobile Navigation Menu */}
        <Transition unmount in={menuOpen} timeout={msToNum(tokens.base.durationL)}>
          {({ visible, nodeRef }) => (
            <nav className={styles.mobileNav} data-visible={visible} ref={nodeRef}>
              {navLinks.map(({ label, pathname, key, type }, index) => {
                // Use native anchor when pathname is an in-page hash. See note
                // in desktop rendering: getNavLinks can return hashes for page
                // items when on the home page.
                if (pathname && pathname.startsWith('#')) {
                  return (
                    <a
                      href={pathname}
                      key={key || label}
                      className={styles.mobileNavLink}
                      data-visible={visible}
                      aria-current={getCurrent(pathname, type)}
                      onClick={handleMobileNavClick}
                      style={cssProps({
                        transitionDelay: numToMs(Number(msToNum(tokens.base.durationS)) + index * 50),
                      })}
                    >
                      {label}
                    </a>
                  );
                }

                // For all other links, use RouterLink
                return (
                  <RouterLink
                    viewTransition
                    prefetch="intent"
                    to={pathname}
                    key={key || label}
                    className={styles.mobileNavLink}
                    data-visible={visible}
                    aria-current={getCurrent(pathname, type)}
                    onClick={handleMobileNavClick}
                    style={cssProps({
                      transitionDelay: numToMs(Number(msToNum(tokens.base.durationS)) + index * 50),
                    })}
                  >
                    {label}
                  </RouterLink>
                );
              })}
              <NavbarIcons />
              <div className="mt-6 flex items-center justify-center gap-3">
                <LanguageDropdown isMobile locale={currentLanguage} />
                <ThemeToggle isMobile />
                <ExperienceToggle isMobile />
              </div>
            </nav>
          )}
        </Transition>

        {/* No separate mobile components needed */}
      </aside>
    </div>
  );
};

const NavbarIcons = ({ desktop }) => (
  <div className={styles.navIcons}>
    {socialLinks.map(({ label, url, icon }) => (
      <a
        key={label}
        data-navbar-item={desktop || undefined}
        className={styles.navIconLink}
        aria-label={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon className={styles.navIcon} icon={icon} />
      </a>
    ))}
  </div>
);
