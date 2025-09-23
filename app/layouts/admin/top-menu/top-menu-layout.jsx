import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { helper as $h } from '@/utils';
import { topMenu as useTopMenuStore } from '~/storestop-menu';
import { useRecoilValue } from 'recoil';
import { linkTo, nestedMenu } from '@/layouts/side-menu';
import { Lucide } from '~/components/admin/base';
import classnames from 'classnames';
import TopBar from '@/components/top-bar/Main';
import MobileMenu from '@/components/mobile-menu/Main';
import MainColorSwitcher from '@/components/main-color-switcher/Main';
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main';
import dom from '@left4code/tw-starter/dist/js/dom';

export function TopMenuLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);
  const topMenuStore = useRecoilValue(useTopMenuStore);
  const topMenu = useCallback(
    () => nestedMenu($h.toRaw(topMenuStore.menu), location),
    [topMenuStore.menu, location]
  );

  useEffect(() => {
    // Only run DOM manipulation on client side
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      dom('body').removeClass('error-page').removeClass('login').addClass('main');
    }
    setFormattedMenu(topMenu());
  }, [topMenu]);

  return (
    <div className="py-5 md:py-0">
      <DarkModeSwitcher />
      <MainColorSwitcher />
      <MobileMenu />
      <TopBar className="top-bar-boxed--top-menu" />
      {/* BEGIN: Top Menu */}
      <nav className="top-nav">
        <ul>
          {formattedMenu.map((menu, menuKey) => (
            <li key={menuKey}>
              <button
                type="button"
                className={classnames({
                  'top-menu': true,
                  'top-menu--active': menu.active,
                })}
                onClick={event => {
                  event.preventDefault();
                  linkTo(menu, navigate);
                }}
              >
                <div className="top-menu__icon">
                  <Lucide icon={menu.icon} />
                </div>
                <div className="top-menu__title">
                  {menu.title}
                  {menu.subMenu && (
                    <Lucide icon="ChevronDown" className="top-menu__sub-icon" />
                  )}
                </div>
              </button>
              {/* BEGIN: Second Child */}
              {menu.subMenu && (
                <ul>
                  {menu.subMenu.map((subMenu, subMenuKey) => (
                    <li key={subMenuKey}>
                      <button
                        type="button"
                        className="top-menu"
                        onClick={event => {
                          event.preventDefault();
                          linkTo(subMenu, navigate);
                        }}
                      >
                        <div className="top-menu__icon">
                          <Lucide icon="Activity" />
                        </div>
                        <div className="top-menu__title">
                          {subMenu.title}
                          {subMenu.subMenu && (
                            <Lucide icon="ChevronDown" className="top-menu__sub-icon" />
                          )}
                        </div>
                      </button>
                      {/* BEGIN: Third Child */}
                      {subMenu.subMenu && (
                        <ul>
                          {subMenu.subMenu.map((lastSubMenu, lastSubMenuKey) => (
                            <li key={lastSubMenuKey}>
                              <button
                                type="button"
                                className="top-menu"
                                onClick={event => {
                                  event.preventDefault();
                                  linkTo(lastSubMenu, navigate);
                                }}
                              >
                                <div className="top-menu__icon">
                                  <Lucide icon="Zap" />
                                </div>
                                <div className="top-menu__title">{lastSubMenu.title}</div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* END: Third Child */}
                    </li>
                  ))}
                </ul>
              )}
              {/* END: Second Child */}
            </li>
          ))}
        </ul>
      </nav>
      {/* END: Top Menu */}
      {/* BEGIN: Content */}
      <div className="content content--top-nav">
        <Outlet />
      </div>
      {/* END: Content */}
    </div>
  );
}
