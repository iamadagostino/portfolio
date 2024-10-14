import { Disclosure } from '@headlessui/react';
import { LanguageDropdown } from './language-dropdown';
import { NavToggle } from './nav-toggle';
import { ThemeToggle } from './theme-toggle';
import { useNavbar } from '~/components/navbar-provider';

export default function NavbarHeader() {
  const { isMobile, menuOpen, setMenuOpen, setMenuLangOpen } = useNavbar();

  return (
    <Disclosure as="nav" className="bg-transparent fixed top-0 w-full z-10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 sticky top-0">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"></div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <LanguageDropdown
              data-mobile={isMobile}
              menuLangOpen={setMenuLangOpen}
              hidden={isMobile}
              data-navbar-item
            />
            <ThemeToggle data-navbar-item />

            {/* Mobile Toggle Menu */}
            {isMobile && (
              <NavToggle
                onClick={() => setMenuOpen(!menuOpen)}
                data-mobile={isMobile}
                menuOpen={menuOpen}
              />
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
