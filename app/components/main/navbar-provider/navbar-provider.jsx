import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useScrollToHash, useWindowSize } from '@/hooks';

import { media } from '@/utils/style';
import { useLocation } from 'react-router';
import { useTheme } from '../theme-provider';

// Create the context
const NavbarContext = createContext();

// Component to handle hash navigation ONLY on initial page load
const InitialHashNavigator = () => {
  const { setTarget } = useNavbar();
  const hasRun = useRef(false);

  useEffect(() => {
    // Only run ONCE on initial page load
    if (hasRun.current || typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash) return;

    console.log('[InitialHashNavigator] Initial page load with hash:', hash);
    hasRun.current = true;

    const handleLoad = () => {
      console.log('[InitialHashNavigator] Page loaded, setting target:', hash);
      setTarget(hash);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [setTarget]);

  return null;
};

// Create a provider component
export const NavbarProvider = ({ children }) => {
  const { theme } = useTheme();
  const headerRef = useRef();
  const location = useLocation();
  const scrollToHash = useScrollToHash();
  const windowSize = useWindowSize();
  // Initialize as empty string to match server, then update via useEffect
  const [current, setCurrent] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [target, setTarget] = useState();
  const [isHeroHidden, setIsHeroHidden] = useState(false);
  const isMobile = windowSize.width <= media.mobile || windowSize.height <= 696;

  const value = {
    theme,
    target,
    current,
    menuOpen,
    isMobile,
    location,
    headerRef,
    setTarget,
    windowSize,
    setCurrent,
    setMenuOpen,
    scrollToHash,
    isHeroHidden,
    setIsHeroHidden,
  };

  return (
    <NavbarContext.Provider value={value}>
      <InitialHashNavigator />
      {children}
    </NavbarContext.Provider>
  );
};

// Create a custom hook to consume the context
export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
