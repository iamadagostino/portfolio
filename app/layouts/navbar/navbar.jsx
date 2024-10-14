import { cssProps, msToNum, numToMs } from '~/utils/style';
import { navLinks, socialLinks } from './nav-data';

import { Icon } from '~/components/icon';
import { LanguageDropdown } from './language-dropdown';
import { Monogram } from '~/components/monogram';
import NavbarHeader from './navbar-header';
import { Link as RouterLink } from '@remix-run/react';
import { ThemeToggle } from './theme-toggle';
import { Transition } from '~/components/transition';
import config from '~/config/app.json';
import styles from './navbar.module.css';
import { tokens } from '~/config/theme.mjs';
import { useEffect } from 'react';
import { useNavbar } from '~/components/navbar-provider';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
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
    scrollToHash,
  } = useNavbar();

  useEffect(() => {
    // Prevent ssr mismatch by storing this in state
    setCurrent(`${location.pathname}${location.hash}`);
  }, [location, setCurrent]);

  // Handle smooth scroll nav items
  useEffect(() => {
    if (!target || location.pathname !== '/') return;
    setCurrent(`${location.pathname}${target}`);
    scrollToHash(target, () => setTarget(null));
  }, [location.pathname, scrollToHash, setCurrent, setTarget, target]);

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
  const getCurrent = (url = '') => {
    const nonTrailing = current?.endsWith('/') ? current?.slice(0, -1) : current;

    if (url === nonTrailing) {
      return 'page';
    }

    return '';
  };

  // Store the current hash to scroll to
  const handleNavItemClick = event => {
    const hash = event.currentTarget.href.split('#')[1];
    setTarget(null);

    if (hash && location.pathname === '/') {
      setTarget(`#${hash}`);
      event.preventDefault();
    }
  };

  const handleMobileNavClick = event => {
    handleNavItemClick(event);
    if (menuOpen) setMenuOpen(false);
  };

  // i18n
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <NavbarHeader />

      {/* Aside */}
      <aside className={styles.navbar} ref={headerRef}>
        {/* Monogram Logo */}
        <RouterLink
          viewTransition
          prefetch="intent"
          to={location.pathname === '/' ? '/#intro' : '/'}
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
            {navLinks.map(({ label, pathname }) => (
              <RouterLink
                viewTransition
                prefetch="intent"
                to={pathname}
                key={t(label)}
                data-navbar-item
                className={styles.navLink}
                aria-current={getCurrent(pathname)}
                onClick={handleNavItemClick}
              >
                {t(label)}
              </RouterLink>
            ))}
          </div>
          <NavbarIcons desktop />
        </nav>

        {/* Mobile Navigation Menu */}
        <Transition unmount in={menuOpen} timeout={msToNum(tokens.base.durationL)}>
          {({ visible, nodeRef }) => (
            <nav className={styles.mobileNav} data-visible={visible} ref={nodeRef}>
              {navLinks.map(({ label, pathname }, index) => (
                <RouterLink
                  viewTransition
                  prefetch="intent"
                  to={pathname}
                  key={t(label)}
                  className={styles.mobileNavLink}
                  data-visible={visible}
                  aria-current={getCurrent(pathname)}
                  onClick={handleMobileNavClick}
                  style={cssProps({
                    transitionDelay: numToMs(
                      Number(msToNum(tokens.base.durationS)) + index * 50
                    ),
                  })}
                >
                  {t(label)}
                </RouterLink>
              ))}
              <NavbarIcons />
              <LanguageDropdown isMobile />
              <ThemeToggle isMobile />
            </nav>
          )}
        </Transition>
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
