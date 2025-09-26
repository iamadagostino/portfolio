import { createContext, useContext, useRef, useState } from 'react';
import { useScrollToHash, useWindowSize } from '~/hooks';

import { media } from '~/utils/style';
import { useLocation } from 'react-router';
import { useTheme } from '../theme-provider';

// Create the context
const NavbarContext = createContext();

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
  };

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>;
};

// Create a custom hook to consume the context
export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
