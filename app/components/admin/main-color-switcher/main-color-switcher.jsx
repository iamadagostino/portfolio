import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useCallback } from 'react';
import { colorSchemeValue, colorScheme as colorSchemeStore } from '~/stores/color-scheme';
import { darkMode as darkModeStore } from '~/stores/dark-mode';
import dom from '@left4code/tw-starter/dist/js/dom';
import classnames from 'classnames';

export function MainColorSwitcher() {
  const darkMode = useRecoilValue(darkModeStore);
  const colorScheme = useRecoilValue(colorSchemeStore);
  const setColorSchemeValue = useSetRecoilState(colorSchemeValue);

  const setColorSchemeClass = useCallback(() => {
    // Only run DOM manipulation on client side
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      dom('html')
        .attr('class', colorScheme)
        .addClass(darkMode ? 'dark' : '');
    }
  }, [colorScheme, darkMode]);

  const switchColorScheme = colorScheme => {
    setColorSchemeValue(() => colorScheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('colorScheme', colorScheme);
    }
    setColorSchemeClass();
  };

  // Use useEffect to set color scheme class on client side
  useEffect(() => {
    setColorSchemeClass();
  }, [setColorSchemeClass]);

  return (
    <>
      {/* BEGIN: Main Color Switcher */}
      <div className="shadow-md fixed bottom-0 right-0 box border rounded-full h-12 px-5 flex items-center justify-center z-50 mb-10 mr-52">
        <div className="mr-4 hidden sm:block text-slate-600 dark:text-slate-200">
          Color Scheme
        </div>
        <button
          type="button"
          onClick={() => {
            switchColorScheme('default');
          }}
          className={classnames({
            'block w-8 h-8 cursor-pointer bg-cyan-900 rounded-full border-4 mr-1 hover:border-slate-200': true,
            'border-slate-300 dark:border-darkmode-800/80': colorScheme == 'default',
            'border-white dark:border-darkmode-600': colorScheme != 'default',
          })}
          aria-label="Switch to default color scheme"
        ></button>
        <button
          type="button"
          onClick={() => {
            switchColorScheme('theme-1');
          }}
          className={classnames({
            'block w-8 h-8 cursor-pointer bg-blue-800 rounded-full border-4 mr-1 hover:border-slate-200': true,
            'border-slate-300 dark:border-darkmode-800/80': colorScheme == 'theme-1',
            'border-white dark:border-darkmode-600': colorScheme != 'theme-1',
          })}
          aria-label="Switch to theme 1 color scheme"
        ></button>
        <button
          type="button"
          onClick={() => {
            switchColorScheme('theme-2');
          }}
          className={classnames({
            'block w-8 h-8 cursor-pointer bg-blue-900 rounded-full border-4 mr-1 hover:border-slate-200': true,
            'border-slate-300 dark:border-darkmode-800/80': colorScheme == 'theme-2',
            'border-white dark:border-darkmode-600': colorScheme != 'theme-2',
          })}
          aria-label="Switch to theme 2 color scheme"
        ></button>
        <button
          type="button"
          onClick={() => {
            switchColorScheme('theme-3');
          }}
          className={classnames({
            'block w-8 h-8 cursor-pointer bg-emerald-900 rounded-full border-4 mr-1 hover:border-slate-200': true,
            'border-slate-300 dark:border-darkmode-800/80': colorScheme == 'theme-3',
            'border-white dark:border-darkmode-600': colorScheme != 'theme-3',
          })}
          aria-label="Switch to theme 3 color scheme"
        ></button>
        <button
          type="button"
          onClick={() => {
            switchColorScheme('theme-4');
          }}
          className={classnames({
            'block w-8 h-8 cursor-pointer bg-indigo-900 rounded-full border-4 hover:border-slate-200': true,
            'border-slate-300 dark:border-darkmode-800/80': colorScheme == 'theme-4',
            'border-white dark:border-darkmode-600': colorScheme != 'theme-4',
          })}
          aria-label="Switch to theme 4 color scheme"
        ></button>
      </div>
      {/* END: Main Color Switcher */}
    </>
  );
}
