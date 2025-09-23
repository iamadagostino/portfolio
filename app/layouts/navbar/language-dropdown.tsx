import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useLanguageChanger } from '~/i18n/i18n.hooks';
import { supportedLanguages } from '~/i18n/i18n.resources';
import { getClientLanguageSwitchUrl } from '~/services/language-switch.client';
import type { Language as LanguageCode } from '~/i18n/i18n.resources';
import styles from './language-dropdown.module.css';

interface Language {
  key: string;
  name: string;
  nativeName: string;
}

interface FlagIconProps {
  countryCode: string;
}

function FlagIcon({ countryCode = '' }: FlagIconProps) {
  let flagCode = countryCode;
  if (countryCode === 'en') {
    flagCode = 'us';
  }

  return <span className={`fi fis ${styles.flag} fi-${flagCode}`} />;
}

// Map language codes to their native names
const LANGUAGE_MAP: Record<string, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  it: { name: 'Italian', nativeName: 'Italiano' },
};

const LANGUAGE_SELECTOR_ID = 'language-selector';

interface LanguageDropdownProps {
  isMobile?: boolean;
  locale?: string;
  'data-mobile'?: boolean;
  'data-navbar-item'?: boolean;
}

export const LanguageDropdown = ({
  isMobile,
  locale,
  ...rest
}: LanguageDropdownProps) => {
  const { currentLanguage: clientLanguage } = useLanguageChanger();
  const currentLanguage = locale || clientLanguage; // Use server locale first
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = languages.find(language => language.key === currentLanguage);

  // Filter out React-specific props that shouldn't be passed to DOM
  const { 'data-navbar-item': dataNavbarItem, ...domProps } = rest;

  const handleLanguageChange = async (language: Language) => {
    const newLang = language.key as LanguageCode;

    // Set language cookie for persistence
    document.cookie = `i18n=${newLang}; max-age=31536000; path=/; samesite=lax`;

    // Get intelligent language switch URL
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const currentLang = currentLanguage as LanguageCode;

    try {
      const newUrl = await getClientLanguageSwitchUrl(currentPath, currentLang, newLang);
      window.location.href = newUrl + currentHash;
    } catch (error) {
      console.warn(
        'Error during intelligent language switching, falling back to simple switching:',
        error
      );

      // Fallback to simple replacement
      let newUrl;
      if (currentPath.startsWith('/en') || currentPath.startsWith('/it')) {
        newUrl = currentPath.replace(/^\/(en|it)/, `/${newLang}`);
      } else {
        newUrl = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
      }
      window.location.href = newUrl + currentHash;
    }

    setIsOpen(false);
  };

  useEffect(() => {
    const setupLanguages = async () => {
      const appLanguages = supportedLanguages.map(lang => ({
        key: lang,
        name: LANGUAGE_MAP[lang]?.name || lang,
        nativeName: LANGUAGE_MAP[lang]?.nativeName || lang,
      }));
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
    <div
      className={styles.dropdown}
      data-mobile={isMobile}
      data-navbar-item={dataNavbarItem}
      {...domProps}
    >
      <button
        type="button"
        id={LANGUAGE_SELECTOR_ID}
        className={styles.button}
        data-mobile={isMobile}
        aria-label="Select language"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FlagIcon countryCode={selectedLanguage.key} />
        {selectedLanguage.nativeName}
        <svg
          className={styles.chevron}
          data-open={isOpen}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className={styles.panel}>
            {languages.map(language => {
              const isSelected = selectedLanguage.key === language.key;
              return (
                <Link
                  key={language.key}
                  to={language.key}
                  onClick={e => {
                    e.preventDefault();
                    handleLanguageChange(language);
                  }}
                  className={styles.item}
                  data-selected={isSelected}
                  aria-label={`Switch to ${language.nativeName}`}
                  role="menuitem"
                >
                  <FlagIcon countryCode={language.key} />
                  <span className={styles.itemText}>{language.nativeName}</span>
                  {isSelected && (
                    <svg
                      className={styles.checkmark}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
