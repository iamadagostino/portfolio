import { EnvelopeIcon, HomeIcon, SwatchIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { useSound } from 'react-sounds';
import lightSwitchOffSoundEffect from '~/assets/sounds/effects/light-switch-off.wav';
import lightSwitchOnSoundEffect from '~/assets/sounds/effects/light-switch-on.wav';
import betterDayMusic from '~/assets/sounds/music/better-day.mp3';
import flowMusic from '~/assets/sounds/music/flow.mp3';

type MenuProps = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setSection: (section: number) => void;
  menuOpened: boolean;
  setMenuOpened: (value: boolean) => void;
  enabledAmbientMusic: boolean;
  setEnabledAmbientMusic: (value: boolean) => void;
};

export const Menu = ({
  darkMode,
  setDarkMode,
  setSection,
  menuOpened,
  setMenuOpened,
  enabledAmbientMusic,
  setEnabledAmbientMusic,
}: MenuProps) => {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [ambientMusic, setAmbientMusic] = useState<string>(betterDayMusic);

  const lightSwitchOffSound = useSound(lightSwitchOffSoundEffect, {
    volume: 0.5,
  });

  const lightSwitchOnSound = useSound(lightSwitchOnSoundEffect, {
    volume: 0.5,
  });

  // Ambient music sound with a delay for user interaction
  const ambientSound = useSound(ambientMusic, {
    loop: true,
    volume: 0.5,
  });

  useEffect(() => {
    // Listen for user interaction
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Handle dark mode switch
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      if (hasUserInteracted) void lightSwitchOffSound.play();
      setAmbientMusic(flowMusic);
    } else {
      document.body.classList.remove('dark');
      if (hasUserInteracted) void lightSwitchOnSound.play();
      setAmbientMusic(betterDayMusic);
    }
  }, [darkMode, hasUserInteracted, lightSwitchOffSound, lightSwitchOnSound]);

  // Stop current music if ambient music changes
  useEffect(() => {
    if (hasUserInteracted) {
      ambientSound.stop();
    }
  }, [ambientMusic, ambientSound, hasUserInteracted]);

  // Play or stop ambient music when enabled/disabled after user interaction
  useEffect(() => {
    if (enabledAmbientMusic && hasUserInteracted) {
      void ambientSound.play();
    } else {
      ambientSound.stop();
    }
  }, [enabledAmbientMusic, hasUserInteracted, ambientSound]);

  // Handle menu toggle
  const handleMenuToggle = () => {
    setMenuOpened(!menuOpened);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <div className="fixed top-12 right-12 z-20">
        {menuOpened ? (
          <button
            type="button"
            onClick={handleMenuToggle}
            aria-expanded="true"
            aria-controls="experience-menu"
            aria-label="Close menu"
            title="Close menu"
            className="group relative"
          >
            <div
              className={`relative flex h-[48px] w-[48px] transform flex-col items-center justify-center overflow-hidden rounded-full bg-slate-700 ring-0 ring-gray-300 transition-all hover:ring-8 ${menuOpened ? 'ring-4' : ''} ring-opacity-30 shadow-md duration-200`}
            >
              <div
                className={`-translate-y-5 transform overflow-hidden transition-all duration-150 ${menuOpened ? 'translate-y-3' : ''}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6h-6 h-6 w-6 animate-bounce text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <span
                aria-hidden
                className={`flex h-[20px] w-[20px] origin-center -translate-y-3 transform flex-col justify-between overflow-hidden transition-all duration-300`}
              >
                <span
                  className={`mb-1.5 block h-[2px] w-7 origin-left transform bg-white transition-all duration-300 ${menuOpened ? 'translate-y-6' : ''}`}
                ></span>
                <span
                  className={`mb-1.5 block h-[2px] w-7 transform rounded bg-white transition-all duration-300 ${menuOpened ? 'translate-y-6' : ''} delay-75`}
                ></span>
                <span
                  className={`block h-[2px] w-7 origin-left transform bg-white transition-all duration-300 ${menuOpened ? 'translate-y-6' : ''} delay-100`}
                ></span>
              </span>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleMenuToggle}
            aria-expanded="false"
            aria-controls="experience-menu"
            aria-label="Open menu"
            title="Open menu"
            className="group relative"
          >
            <div
              className={`relative flex h-[48px] w-[48px] transform flex-col items-center justify-center overflow-hidden rounded-full bg-slate-700 ring-0 ring-gray-300 transition-all hover:ring-8 ${menuOpened ? 'ring-4' : ''} ring-opacity-30 shadow-md duration-200`}
            >
              <div
                className={`-translate-y-5 transform overflow-hidden transition-all duration-150 ${menuOpened ? 'translate-y-3' : ''}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6h-6 h-6 w-6 animate-bounce text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <span
                aria-hidden
                className={`flex h-[20px] w-[20px] origin-center -translate-y-3 transform flex-col justify-between overflow-hidden transition-all duration-300`}
              >
                <span
                  className={`mb-1.5 block h-[2px] w-7 origin-left transform bg-white transition-all duration-300 ${menuOpened ? 'translate-y-6' : ''}`}
                ></span>
                <span
                  className={`mb-1.5 block h-[2px] w-7 transform rounded bg-white transition-all duration-300 ${menuOpened ? 'translate-y-6' : ''} delay-75`}
                ></span>
                <span
                  className={`block h-[2px] w-7 origin-left transform bg-white transition-all duration-300 ${menuOpened ? 'translate-y-6' : ''} delay-100`}
                ></span>
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Dark Mode Button */}
      <div className="fixed top-[50px] right-[120px] z-20">
        {darkMode ? (
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-pressed="true"
            aria-label="Switch to light mode"
            title="Switch to light mode"
            className="ring-opacity-30 relative flex h-[42px] w-[42px] transform items-center justify-center overflow-hidden rounded-full bg-slate-700 shadow-md ring-0 ring-gray-300 transition-all duration-200 hover:ring-8"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 18 18"
              className={`absolute origin-center transform overflow-hidden transition-all duration-500 ${darkMode ? 'rotate-0' : 'rotate-[-45deg]'} fill-yellow-500`}
              aria-hidden
            >
              <mask id="sun-mask-open">
                <rect x="0" y="0" width="18" height="18"></rect>
                <circle cx="25" cy="0" r="8" fill="black"></circle>
              </mask>
              <circle
                cx="9"
                cy="9"
                fill="var(--color-text)"
                mask="url(#sun-mask-open)"
                r="5"
                className={`origin-center transform transition-all duration-75 ${darkMode ? 'scale-0' : 'scale-100'}`}
              ></circle>
              <g className={`${darkMode ? 'animate-wiggle' : ''}`}>
                <circle
                  cx="17"
                  cy="9"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-100 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="13"
                  cy="15.928203"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-150 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="5"
                  cy="15.928203"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-200 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="1"
                  cy="9"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-300 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="5"
                  cy="2.071797"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-400 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="13"
                  cy="2.071797"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-500 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
              </g>
            </svg>

            <svg
              width="24"
              height="24"
              viewBox="0 0 18 18"
              className={`absolute origin-center transform overflow-hidden transition-all duration-500 ${darkMode ? 'rotate-[30deg]' : 'rotate-0'} fill-gray-200 ${darkMode ? 'animate-wiggle' : ''}`}
            >
              <mask id="moon-mask-open">
                <rect x="0" y="0" width="18" height="18"></rect>
                <circle cx="10.474085155384738" cy="1.936788645948704" r="8" fill="black"></circle>
              </mask>
              <circle
                cx="9"
                cy="9"
                fill="var(--color-text)"
                mask="url(#moon-mask-open)"
                r="8"
                className={`origin-center transform transition-all duration-500 ${darkMode ? 'scale-100' : 'scale-0'}`}
              ></circle>
            </svg>
            <span className="sr-only">Toggle dark mode</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-pressed="false"
            aria-label="Switch to dark mode"
            title="Switch to dark mode"
            className="ring-opacity-30 relative flex h-[42px] w-[42px] transform items-center justify-center overflow-hidden rounded-full bg-slate-700 shadow-md ring-0 ring-gray-300 transition-all duration-200 hover:ring-8"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 18 18"
              className={`absolute origin-center transform overflow-hidden transition-all duration-500 ${darkMode ? 'rotate-0' : 'rotate-[-45deg]'} fill-yellow-500`}
              aria-hidden
            >
              <mask id="sun-mask-closed">
                <rect x="0" y="0" width="18" height="18"></rect>
                <circle cx="25" cy="0" r="8" fill="black"></circle>
              </mask>
              <circle
                cx="9"
                cy="9"
                fill="var(--color-text)"
                mask="url(#sun-mask-closed)"
                r="5"
                className={`origin-center transform transition-all duration-75 ${darkMode ? 'scale-0' : 'scale-100'}`}
              ></circle>
              <g className={`${darkMode ? 'animate-wiggle' : ''}`}>
                <circle
                  cx="17"
                  cy="9"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-100 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="13"
                  cy="15.928203"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-150 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="5"
                  cy="15.928203"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-200 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="1"
                  cy="9"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-300 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="5"
                  cy="2.071797"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-400 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
                <circle
                  cx="13"
                  cy="2.071797"
                  r="1.5"
                  fill="var(--color-text)"
                  className={`origin-center transform transition-all duration-500 ${darkMode ? 'scale-0' : 'scale-100'}`}
                ></circle>
              </g>
            </svg>

            <svg
              width="24"
              height="24"
              viewBox="0 0 18 18"
              className={`absolute origin-center transform overflow-hidden transition-all duration-500 ${darkMode ? 'rotate-[30deg]' : 'rotate-0'} fill-gray-200 ${darkMode ? 'animate-wiggle' : ''}`}
            >
              <mask id="moon-mask-closed">
                <rect x="0" y="0" width="18" height="18"></rect>
                <circle cx="10.474085155384738" cy="1.936788645948704" r="8" fill="black"></circle>
              </mask>
              <circle
                cx="9"
                cy="9"
                fill="var(--color-text)"
                mask="url(#moon-mask-closed)"
                r="8"
                className={`origin-center transform transition-all duration-500 ${darkMode ? 'scale-100' : 'scale-0'}`}
              ></circle>
            </svg>
            <span className="sr-only">Toggle dark mode</span>
          </button>
        )}
      </div>

      {/* Sound Button */}
      <div className="fixed top-[50px] right-[180px] z-20">
        {enabledAmbientMusic ? (
          <button
            type="button"
            onClick={() => setEnabledAmbientMusic(!enabledAmbientMusic)}
            aria-pressed="true"
            aria-label="Disable ambient music"
            title="Disable ambient music"
            className="ring-opacity-30 relative flex h-[42px] w-[42px] transform items-center justify-center overflow-hidden rounded-full bg-slate-700 shadow-md ring-0 ring-gray-300 transition-all duration-200 hover:ring-8"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 18 18"
              fill="none"
              className={`absolute origin-center transform overflow-hidden transition-all duration-500 ${enabledAmbientMusic ? 'rotate-0' : 'rotate-30'} fill-white`}
              aria-hidden
            >
              <path
                d="M8.25 3.75L4.5 6.75H1.5V11.25H4.5L8.25 14.25V3.75Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-500 ${!enabledAmbientMusic ? '' : 'animate-wiggle-vertical'}`}
              ></path>
              <path
                d="M14.3025 3.69751C15.7086 5.10397 16.4984 7.01128 16.4984 9.00001C16.4984 10.9887 15.7086 12.8961 14.3025 14.3025"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-opacity duration-500 ${enabledAmbientMusic ? 'opacity-1' : 'opacity-0'}`}
              ></path>
              <path
                d="M11.655 6.34501C12.358 7.04824 12.753 8.00189 12.753 8.99626C12.753 9.99063 12.358 10.9443 11.655 11.6475"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-opacity duration-500 ${enabledAmbientMusic ? 'opacity-1' : 'opacity-0'}`}
              ></path>
            </svg>
            <span className="sr-only">Toggle ambient music</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEnabledAmbientMusic(!enabledAmbientMusic)}
            aria-pressed="false"
            aria-label="Enable ambient music"
            title="Enable ambient music"
            className="ring-opacity-30 relative flex h-[42px] w-[42px] transform items-center justify-center overflow-hidden rounded-full bg-slate-700 shadow-md ring-0 ring-gray-300 transition-all duration-200 hover:ring-8"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 18 18"
              fill="none"
              className={`absolute origin-center transform overflow-hidden transition-all duration-500 ${enabledAmbientMusic ? 'rotate-0' : 'rotate-30'} fill-white`}
              aria-hidden
            >
              <path
                d="M8.25 3.75L4.5 6.75H1.5V11.25H4.5L8.25 14.25V3.75Z"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-500 ${!enabledAmbientMusic ? '' : 'animate-wiggle-vertical'}`}
              ></path>
              <path
                d="M14.3025 3.69751C15.7086 5.10397 16.4984 7.01128 16.4984 9.00001C16.4984 10.9887 15.7086 12.8961 14.3025 14.3025"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-opacity duration-500 ${enabledAmbientMusic ? 'opacity-1' : 'opacity-0'}`}
              ></path>
              <path
                d="M11.655 6.34501C12.358 7.04824 12.753 8.00189 12.753 8.99626C12.753 9.99063 12.358 10.9443 11.655 11.6475"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-opacity duration-500 ${enabledAmbientMusic ? 'opacity-1' : 'opacity-0'}`}
              ></path>
            </svg>
            <span className="sr-only">Toggle ambient music</span>
          </button>
        )}
      </div>

      {/* Menu */}
      <motion.div
        className={`${!menuOpened ? 'hidden' : ''} over shadow-blue-gray-900/5 fixed top-10 right-0 z-10 flex w-full max-w-[20rem] flex-col rounded-tl-xl rounded-bl-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl transition-all`}
        data-menu-container="true"
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 0.8,
          y: 0,
          transition: {
            duration: 0.25,
            delay: 0.125,
          },
        }}
      >
        <div className="mt-10 mb-2 p-4">
          <h5 className="block font-sans text-xl leading-snug font-semibold tracking-normal text-gray-900 antialiased">
            Explore
          </h5>
        </div>
        <nav
          className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-gray-700"
          data-menu-nav="true"
          id="experience-menu"
        >
          {/* Home */}
          <button
            type="button"
            onClick={() => {
              setSection(0);
            }}
            className="hover:bg-opacity-80 focus:bg-opacity-80 active:bg-opacity-80 flex w-full items-center rounded-lg p-3 text-start leading-tight transition-all outline-none hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 active:bg-blue-50 active:text-blue-900"
            data-menu-section-button="true"
          >
            <div className="mr-4 grid place-items-center">
              <HomeIcon className="size-5" />
            </div>
            Home
          </button>

          {/* About */}
          <button
            type="button"
            onClick={() => {
              setSection(1);
            }}
            className="hover:bg-opacity-80 focus:bg-opacity-80 active:bg-opacity-80 flex w-full items-center rounded-lg p-3 text-start leading-tight transition-all outline-none hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 active:bg-blue-50 active:text-blue-900"
            data-menu-section-button="true"
          >
            <div className="mr-4 grid place-items-center">
              <UserCircleIcon className="size-5" />
            </div>
            About
          </button>

          {/* Projects */}
          <button
            type="button"
            onClick={() => {
              setSection(2);
            }}
            className="hover:bg-opacity-80 focus:bg-opacity-80 active:bg-opacity-80 flex w-full items-center rounded-lg p-3 text-start leading-tight transition-all outline-none hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 active:bg-blue-50 active:text-blue-900"
            data-menu-section-button="true"
          >
            <div className="mr-4 grid place-items-center">
              <SwatchIcon className="size-5" />
            </div>
            Projects
          </button>

          {/* Contact */}
          <button
            type="button"
            onClick={() => {
              setSection(3);
            }}
            className="hover:bg-opacity-80 focus:bg-opacity-80 active:bg-opacity-80 flex w-full items-center rounded-lg p-3 text-start leading-tight transition-all outline-none hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900 active:bg-blue-50 active:text-blue-900"
            data-menu-section-button="true"
          >
            <div className="mr-4 grid place-items-center">
              <EnvelopeIcon className="size-5" />
            </div>
            Contact
          </button>
        </nav>
      </motion.div>
    </>
  );
};
