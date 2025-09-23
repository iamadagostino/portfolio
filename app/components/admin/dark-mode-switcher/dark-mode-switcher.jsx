import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useCallback } from 'react';
import { darkModeValue, darkMode as darkModeStore } from '~/stores/dark-mode';
import dom from '@left4code/tw-starter/dist/js/dom';
import classnames from 'classnames';

export function DarkModeSwitcher() {
  const darkMode = useRecoilValue(darkModeStore);
  const setDarkModeValue = useSetRecoilState(darkModeValue);

  const setDarkModeClass = useCallback(() => {
    // Only run DOM manipulation on client side
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      darkMode ? dom('html').addClass('dark') : dom('html').removeClass('dark');
    }
  }, [darkMode]);

  const switchMode = () => {
    setDarkModeValue(() => !darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', !darkMode);
    }
    setDarkModeClass();
  };

  // Use useEffect to set dark mode class on client side
  useEffect(() => {
    setDarkModeClass();
  }, [setDarkModeClass]);

  return (
    <>
      {/* BEGIN: Dark Mode Switcher */}
      <div
        className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10"
        onClick={switchMode}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchMode();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        <div className="mr-4 text-slate-600 dark:text-slate-200">Dark Mode</div>
        <div
          className={classnames({
            'dark-mode-switcher__toggle border': true,
            'dark-mode-switcher__toggle--active': darkMode,
          })}
        ></div>
      </div>
      {/* END: Dark Mode Switcher */}
    </>
  );
}
