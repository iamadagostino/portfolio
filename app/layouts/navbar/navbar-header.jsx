import { Disclosure } from '@headlessui/react';
import { useNavbar } from '~/components/navbar-provider';
import { ExperienceToggle } from './experience-toggle';
import { LanguageDropdown } from './language-dropdown';
import { NavToggle } from './nav-toggle';
import { ThemeToggle } from './theme-toggle';

export default function NavbarHeader({ locale }) {
  const { isMobile, menuOpen, setMenuOpen } = useNavbar();

  return (
    <Disclosure as="nav" className="fixed top-0 z-10 w-full bg-transparent">
      <div className="sticky top-0 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"></div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {!isMobile && <LanguageDropdown data-navbar-item locale={locale} />}
            <div className="flex items-center gap-3">
              <ThemeToggle data-navbar-item />
              <ExperienceToggle data-navbar-item />
            </div>

            {/* Mobile Toggle Menu */}
            {isMobile && <NavToggle onClick={() => setMenuOpen(!menuOpen)} data-mobile={isMobile} />}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
