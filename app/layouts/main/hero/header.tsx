import { Logo } from '@/components/main/logo';
import { useNavbar } from '@/components/main/navbar-provider';
import { getAnchorAliasMap, getNavLinks } from '@/config/menus/nav-menu';
import { useCurrentLanguage, useNavbarTranslation } from '@/i18n/i18n.hooks';
import { ArrowUpRight } from 'lucide-react';
import { forwardRef, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { FloatingTechNav } from './floating-nav';
import styles from './header.module.css';

export const Header = forwardRef<HTMLHeadingElement>((_, ref) => {
  const currentLanguage = useCurrentLanguage();
  const location = useLocation();
  const { t } = useNavbarTranslation();
  const { setCurrent, setTarget, isHeroHidden } = useNavbar();

  // Use the same nav links structure as the navbar
  const navLinks = useMemo(
    () => getNavLinks(t, currentLanguage, location.pathname),
    [t, currentLanguage, location.pathname]
  );

  const anchorAliasMap = useMemo(() => getAnchorAliasMap(currentLanguage), [currentLanguage]);
  const homeLink = `/${currentLanguage}`;

  const toCanonicalAnchor = useCallback(
    (hash: string) => {
      if (!hash) return '';
      const keyWithHash = hash.startsWith('#') ? hash : `#${hash}`;
      const keyWithoutHash = keyWithHash.slice(1);
      const aliasMap = anchorAliasMap as Record<string, string>;
      return aliasMap[keyWithHash] ?? aliasMap[keyWithoutHash] ?? keyWithoutHash;
    },
    [anchorAliasMap]
  );

  // Get contact link
  const contactLinkData = navLinks.find((link) => link.key === 'Contact') || {
    pathname: `${homeLink}/contact`,
    label: t('Contact'),
  };

  // Handle click with same logic as navbar
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.href || event.currentTarget.getAttribute('href');

    if (href && href.includes('#')) {
      const hash = href.split('#')[1];
      const isOnHomePage = location.pathname === homeLink || location.pathname === `${homeLink}/`;

      // Special handling for Home link when hero is hidden
      if (hash === 'home' && isHeroHidden && isOnHomePage) {
        event.preventDefault();
        window.location.href = homeLink;
        return;
      }

      if (hash && isOnHomePage) {
        event.preventDefault();

        const canonicalHash = toCanonicalAnchor(hash);
        const targetElement = canonicalHash ? document.getElementById(canonicalHash) : null;
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          window.history.replaceState(null, '', `${location.pathname}#${hash}`);
          setCurrent(`${location.pathname}#${hash}`);
        }
      } else if (hash && !isOnHomePage) {
        setTarget(`#${hash}`);
      }
    }
  };

  // Render contact link
  const renderContactLink = () => {
    const { pathname, label } = contactLinkData;
    const commonProps = {
      className:
        'group border-primary/60 text-cyan-300 hover:border-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/10 inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-[0.55rem] tracking-[0.35em] uppercase transition duration-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]',
    };

    const content = (
      <>
        {label}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </>
    );

    if (pathname.startsWith('#')) {
      return (
        <a href={pathname} onClick={handleClick} {...commonProps}>
          {content}
        </a>
      );
    }

    return (
      <Link to={pathname} {...commonProps}>
        {content}
      </Link>
    );
  };

  return (
    <header ref={ref} className={styles.header}>
      {/* Digital honeycomb background */}
      <div className={styles.hexagonGrid} />
      <div className={styles.background} />

      {/* Glitch flux capacitor lines */}
      <div className={styles.glitchLines}>
        <div className={styles.glitchLine} />
        <div className={styles.glitchLine} />
        <div className={styles.glitchLine} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <Logo />
      </div>
      <div className={styles.center}>
        <FloatingTechNav onNavClick={handleClick} />
      </div>
      <div className={styles.content}>{renderContactLink()}</div>
    </header>
  );
});

Header.displayName = 'Header';
