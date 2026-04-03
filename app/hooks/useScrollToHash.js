import { useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router';
import { useCallback, useMemo, useRef } from 'react';
import { getAnchorAliasMap, getCanonicalSectionAnchor } from '@/config/menus/nav-menu';
import { useCurrentLanguage } from '@/i18n/i18n.hooks';

export function useScrollToHash() {
  const scrollTimeout = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const language = useCurrentLanguage();
  const anchorAliasMap = useMemo(() => getAnchorAliasMap(language), [language]);
  const canonicalProjectAnchor = getCanonicalSectionAnchor('projects') || 'projects';

  const scrollToHash = useCallback(
    (hash, onDone) => {
      if (!hash || typeof window === 'undefined') return;
      
      const id = hash.split('#')[1];
      if (!id) return;
      
      const canonicalIdLookup = anchorAliasMap[id] ?? anchorAliasMap[`#${id}`];
      const canonicalId =
        canonicalIdLookup ||
        ((id.startsWith('project-') || id.startsWith('progetto-')) && canonicalProjectAnchor
          ? canonicalProjectAnchor
          : id);
      const targetElement = document.getElementById(canonicalId);
      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

      const handleScroll = () => {
        clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
          window.removeEventListener('scroll', handleScroll);

          if (window.location.pathname === location.pathname) {
            onDone?.();
            navigate(`${location.pathname}#${id}`, { scroll: false });
          }
        }, 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout.current);
      };
    },
    [anchorAliasMap, canonicalProjectAnchor, navigate, reduceMotion, location.pathname]
  );

  return scrollToHash;
}
