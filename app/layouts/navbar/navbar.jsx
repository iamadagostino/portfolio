import { cssProps, msToNum, numToMs } from '~/utils/style';
import { getNavLinks, socialLinks } from '../../config/menus/nav-menu';

import { Icon } from '~/components/icon';
import { LanguageDropdown } from './language-dropdown';
import { Monogram } from '~/components/monogram';
import NavbarHeader from './navbar-header';
import { Link as RouterLink } from 'react-router';
import { ThemeToggle } from './theme-toggle';
import { Transition } from '~/components/transition';
import config from '~/config/app.json';
import styles from './navbar.module.css';
import { tokens } from '~/config/theme.mjs';
import { useEffect, useState } from 'react';
import { useNavbar } from '~/components/navbar-provider';
import { useNavbarTranslation, useCurrentLanguage } from '~/i18n/i18n.hooks';

export const Navbar = ({ locale: serverLocale }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
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
  } = useNavbar();

  // i18n - move this up before useEffects
  const { t } = useNavbarTranslation();
  const clientLanguage = useCurrentLanguage();
  const currentLanguage = serverLocale || clientLanguage; // Use server locale first

  // Generate locale-aware home link early
  const localePrefix = `/${currentLanguage}`;
  const homeLink = localePrefix;
  const navLinks = getNavLinks(t, currentLanguage, location.pathname);

  useEffect(() => {
    // Update current state for proper navigation tracking
    setCurrent(`${location.pathname}${location.hash}`);
  }, [location, setCurrent]);

  // Handle smooth scroll nav items
  useEffect(() => {
    if (!target) return;

    // Check if we're on home page (with any locale)
    const isOnHomePage =
      location.pathname === homeLink || location.pathname === `${homeLink}/`;
    if (!isOnHomePage) return;

    // Scroll to the target hash when navigating from other pages
    const targetElement = document.getElementById(target.replace('#', ''));
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrent(`${location.pathname}${target}`);
    }
    setTarget(null);
  }, [location.pathname, setCurrent, setTarget, target, homeLink]);

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
      const invertedElements = document.querySelectorAll(
        `[data-theme='${inverseTheme}'][data-invert]`
      );

      if (!invertedElements) return;

      inverseMeasurements = Array.from(invertedElements).map(item => ({
        element: item,
        top: item.offsetTop,
        bottom: item.offsetTop + item.offsetHeight,
      }));

      const { scrollY } = window;

      resetNavTheme();

      for (const inverseMeasurement of inverseMeasurements) {
        if (
          inverseMeasurement.top - scrollY > innerHeight ||
          inverseMeasurement.bottom - scrollY < 0
        ) {
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
      navItemMeasurements = Array.from(navItems).map(item => {
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

    // Smart highlighting system for localized routes
    if (type === 'page') {
      // Create mapping for ALL localized route matching
      const routeMatches = {
        articles: ['/articles', '/articoli'],
        contact: ['/contact', '/contatti'],
        projects: ['/projects', '/progetti'],
        details: ['/details', '/dettagli'],
      };

      // Check if URL contains any route segment and current path matches
      for (const [, variations] of Object.entries(routeMatches)) {
        const urlContainsRoute = variations.some(variation => url.includes(variation));
        const currentPathMatches = variations.some(variation =>
          currentPath.includes(variation)
        );

        if (urlContainsRoute && currentPathMatches) {
          return 'page';
        }
      }

      // Additional smart detection: if on home with anchor, check if navbar link corresponds to that anchor
      if (currentHash) {
        // Map URL segments to their corresponding anchors
        const urlToAnchorMapping = {
          '/projects': 'project-1',
          '/progetti': 'project-1',
          '/details': 'details',
          '/dettagli': 'details',
        };

        // Check if this navbar URL corresponds to the current anchor
        for (const [urlSegment, anchorId] of Object.entries(urlToAnchorMapping)) {
          if (url.includes(urlSegment) && currentHash === anchorId) {
            return 'page';
          }
        }
      }
    }

    // Enhanced highlighting for anchor sections
    if (type === 'anchor' || url.startsWith('#')) {
      // If we have a current hash, check if it matches this URL
      if (currentHash && url === `#${currentHash}`) {
        return 'page';
      }

      // Also check if we're on a localized route that corresponds to this anchor
      const anchorId = url.replace('#', '');
      const anchorToRouteMapping = {
        'project-1': ['/projects', '/progetti'],
        details: ['/details', '/dettagli'],
      };

      if (anchorToRouteMapping[anchorId]) {
        const routeVariations = anchorToRouteMapping[anchorId];
        const isOnCorrespondingRoute = routeVariations.some(route =>
          currentPath.includes(route)
        );

        if (isOnCorrespondingRoute) {
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
  const handleNavItemClick = event => {
    const href = event.currentTarget.href || event.currentTarget.getAttribute('href');

    // For anchor links, handle them consistently
    if (href && href.includes('#')) {
      const hash = href.split('#')[1];

      // Check if we're dealing with a hash link on the same page
      const isOnHomePage =
        location.pathname === homeLink || location.pathname === `${homeLink}/`;

      if (hash && isOnHomePage) {
        // Prevent default browser behavior to avoid conflicts
        event.preventDefault();

        // Use our custom scroll logic for smooth scrolling
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Update URL and state after scroll starts
          window.history.replaceState(null, '', `${location.pathname}#${hash}`);
          setCurrent(`${location.pathname}#${hash}`);
        }
      }
      // For hash links from other pages, let RouterLink handle navigation naturally
    }
  };

  const handleMobileNavClick = event => {
    handleNavItemClick(event);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <div className="flex flex-col">
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
              // For anchor links on the same page, use regular anchor tag
              if (type === 'anchor' && pathname.startsWith('#')) {
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
                // For anchor links on the same page, use regular anchor tag
                if (type === 'anchor' && pathname.startsWith('#')) {
                  return (
                    <a
                      href={pathname}
                      key={key || label}
                      className={styles.mobileNavLink}
                      data-visible={visible}
                      aria-current={getCurrent(pathname, type)}
                      onClick={handleMobileNavClick}
                      style={cssProps({
                        transitionDelay: numToMs(
                          Number(msToNum(tokens.base.durationS)) + index * 50
                        ),
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
                      transitionDelay: numToMs(
                        Number(msToNum(tokens.base.durationS)) + index * 50
                      ),
                    })}
                  >
                    {label}
                  </RouterLink>
                );
              })}
              <NavbarIcons />
              <div className="flex items-center justify-center gap-3 mt-6">
                <LanguageDropdown isMobile locale={currentLanguage} />
                <ThemeToggle isMobile />
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
