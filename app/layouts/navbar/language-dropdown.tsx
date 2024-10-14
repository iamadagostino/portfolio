import { useEffect, useState } from 'react';

import { Button } from '~/components/button';
import { Link } from '@remix-run/react';
import styles from './language-dropdown.module.css';
import { supportedLanguages } from '~/i18n/i18n.resources';
import { useTranslation } from 'react-i18next';

// import { useId } from 'react';
// import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface FlagIconProps {
  countryCode: string;
}

function FlagIcon({ countryCode = '' }: FlagIconProps) {
  if (countryCode === 'en') {
    countryCode = 'us';
  }

  return (
    <span className={`fi fis ${styles.fiCircle} inline-block mr-2 fi-${countryCode}`} />
  );
}

interface Language {
  key: string;
  name: string;
}

const LANGUAGE_SELECTOR_ID = 'language-selector';

interface LanguageDropdownProps {
  isMobile: boolean;
}

export const LanguageDropdown = ({ isMobile, ...rest }: LanguageDropdownProps) => {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = languages.find(language => language.key === i18n.language);

  const handleLanguageChange = async (language: Language) => {
    await i18n.changeLanguage(language.key);
    setIsOpen(false);
  };

  useEffect(() => {
    const setupLanguages = async () => {
      const appLanguages = supportedLanguages.map(lang => ({ key: lang, name: lang }));
      setLanguages(appLanguages);
    };
    setupLanguages();
  }, []);

  useEffect(() => {
    const handleWindowClick = (event: MouseEvent) => {
      const target = (event.target as Element).closest('button');
      if (target && target.id === LANGUAGE_SELECTOR_ID) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  if (!selectedLanguage) {
    return null;
  }

  return (
    <>
      <div className={styles.dropdown}>
        <div className="relative inline-block text-left">
          <div>
            <Button
              iconOnly
              id={LANGUAGE_SELECTOR_ID}
              className="inline-flex items-center justify-center w-full rounded-md border border-[var(--textBody)] shadow-sm px-4 bg-[var(--textBody)] text-sm font-medium text-[var(--textInverted)] hover:bg-[var(--textLight)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              aria-label="Language"
              aria-haspopup="true"
              aria-expanded={isOpen}
              data-mobile={isMobile}
              onClick={() => setIsOpen(!isOpen)}
              {...rest}
            >
              <FlagIcon countryCode={selectedLanguage.key} />
              <span className="uppercase">{selectedLanguage.name}</span>
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          {isOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-[var(--background)] ring-1 ring-[var(--backgroundLight)] ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="language-selector"
            >
              <div className="py-1 grid grid-cols-2 gap-2" role="none">
                {languages.map((language, index) => {
                  return (
                    <Link
                      key={language.key}
                      to={language.key}
                      onClick={() => handleLanguageChange(language)}
                      className={`${
                        selectedLanguage.key === language.key
                          ? 'bg-[var(--backgroundInverted)] text-[var(--textInverted)]'
                          : 'text-[var(--textLight)]'
                      } px-4 py-2 text-sm text-left items-center inline-flex hover:bg-[var(--backgroundLightInverted)] hover:text-[var(--textInverted)] cursor-pointer ${
                        index % 2 === 0 ? 'rounded-r' : 'rounded-l'
                      }`}
                    >
                      <FlagIcon countryCode={language.key} />
                      <span className="truncate uppercase">{language.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
