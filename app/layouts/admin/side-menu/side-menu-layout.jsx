import { Transition } from 'react-transition-group';
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { helper as $h } from '~/utils/helper';
// Temporarily disable Recoil and use static menu data
// import { sideMenu as useSideMenuStore } from '~/stores/side-menu';
// import { useRecoilValue } from 'recoil';
import { linkTo, nestedMenu, enter, leave } from './index';
import { Lucide } from '~/components/admin/base';
import classnames from 'classnames';
import { TopBar } from '../../../components/admin/top-bar';
import { MobileMenu } from '../../../components/admin/mobile-menu';
import { MainColorSwitcher } from '../../../components/admin/main-color-switcher';
import { DarkModeSwitcher } from '../../../components/admin/dark-mode-switcher';
import { SideMenuTooltip } from '../../../components/admin/side-menu-tooltip';

// Static menu data to replace Recoil store
const staticSideMenuStore = {
  menu: [
    {
      icon: 'Home',
      pathname: '/admin',
      title: 'Dashboard',
    },
    {
      icon: 'FileText',
      pathname: '/admin/page-1',
      title: 'Page 1',
    },
    {
      icon: 'Settings',
      pathname: '/admin/page-2',
      title: 'Page 2',
    },
  ],
};

export function SideMenuLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);
  // Use static data instead of Recoil
  const sideMenuStore = staticSideMenuStore;
  const sideMenu = useCallback(
    () => nestedMenu($h.toRaw(sideMenuStore.menu), location),
    [sideMenuStore.menu, location]
  );

  useEffect(() => {
    // Add main class to body for admin layout
    document.body.classList.remove('error-page', 'login');
    document.body.classList.add('main');
    setFormattedMenu(sideMenu());

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('main');
    };
  }, [sideMenuStore, location.pathname, sideMenu]);

  return (
    <div className="py-5 md:py-0">
      <DarkModeSwitcher />
      <MainColorSwitcher />
      <MobileMenu />
      <TopBar />
      <div className="flex overflow-hidden">
        {/* BEGIN: Side Menu */}
        <nav className="side-nav">
          <ul>
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == 'devider' ? (
                <li className="side-nav__devider my-6" key={menu + menuKey}></li>
              ) : (
                <li key={menu + menuKey}>
                  <SideMenuTooltip
                    tag="a"
                    content={menu.title}
                    href={menu.subMenu ? '#' : menu.pathname}
                    className={classnames({
                      'side-menu': true,
                      'side-menu--active': menu.active,
                      'side-menu--open': menu.activeDropdown,
                    })}
                    onClick={event => {
                      event.preventDefault();
                      linkTo(menu, navigate);
                      setFormattedMenu($h.toRaw(formattedMenu));
                    }}
                  >
                    <div className="side-menu__icon">
                      <Lucide icon={menu.icon} />
                    </div>
                    <div className="side-menu__title">
                      {menu.title}
                      {menu.subMenu && (
                        <div
                          className={classnames({
                            'side-menu__sub-icon': true,
                            'transform rotate-180': menu.activeDropdown,
                          })}
                        >
                          <Lucide icon="ChevronDown" />
                        </div>
                      )}
                    </div>
                  </SideMenuTooltip>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={classnames({
                          'side-menu__sub-open': menu.activeDropdown,
                        })}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <SideMenuTooltip
                              tag="a"
                              content={subMenu.title}
                              href={subMenu.subMenu ? '#' : subMenu.pathname}
                              className={classnames({
                                'side-menu': true,
                                'side-menu--active': subMenu.active,
                              })}
                              onClick={event => {
                                event.preventDefault();
                                linkTo(subMenu, navigate);
                                setFormattedMenu($h.toRaw(formattedMenu));
                              }}
                            >
                              <div className="side-menu__icon">
                                <Lucide icon="Activity" />
                              </div>
                              <div className="side-menu__title">
                                {subMenu.title}
                                {subMenu.subMenu && (
                                  <div
                                    className={classnames({
                                      'side-menu__sub-icon': true,
                                      'transform rotate-180': subMenu.activeDropdown,
                                    })}
                                  >
                                    <Lucide icon="ChevronDown" />
                                  </div>
                                )}
                              </div>
                            </SideMenuTooltip>
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={classnames({
                                    'side-menu__sub-open': subMenu.activeDropdown,
                                  })}
                                >
                                  {subMenu.subMenu.map((lastSubMenu, lastSubMenuKey) => (
                                    <li key={lastSubMenuKey}>
                                      <SideMenuTooltip
                                        tag="a"
                                        content={lastSubMenu.title}
                                        href={
                                          lastSubMenu.subMenu ? '#' : lastSubMenu.pathname
                                        }
                                        className={classnames({
                                          'side-menu': true,
                                          'side-menu--active': lastSubMenu.active,
                                        })}
                                        onClick={event => {
                                          event.preventDefault();
                                          linkTo(lastSubMenu, navigate);
                                        }}
                                      >
                                        <div className="side-menu__icon">
                                          <Lucide icon="Zap" />
                                        </div>
                                        <div className="side-menu__title">
                                          {lastSubMenu.title}
                                        </div>
                                      </SideMenuTooltip>
                                    </li>
                                  ))}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div className="content">
          <Outlet />
        </div>
        {/* END: Content */}
      </div>
    </div>
  );
}


