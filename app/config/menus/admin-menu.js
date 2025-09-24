import { getLocalizedSlug } from '~/routes/config';

const RAW_ADMIN_MENU = [
  {
    key: 'dashboard',
    icon: 'HomeIcon',
    title: 'Dashboard',
    segment: 'dashboard',
  },
  {
    key: 'events',
    icon: 'Square2StackIcon',
    title: 'Events',
    segment: 'events',
  },
  {
    key: 'orders',
    icon: 'TicketIcon',
    title: 'Orders',
    segment: 'orders',
  },
  {
    key: 'settings',
    icon: 'Cog6ToothIcon',
    title: 'Settings',
    segment: 'settings',
  },
  {
    key: 'debug',
    icon: 'BugAntIcon',
    title: 'Debug',
    segment: 'debug',
  },
];

const trimSlashes = value => value.replace(/(^\/+|\/+?$)/g, '') || '';

const buildMenu = (items, basePath) =>
  items.map(item => {
    if (typeof item === 'string') {
      return item;
    }

    const { segment = '', subMenu, ...rest } = item;
    const normalisedSegment = trimSlashes(segment);
    const pathname = `${basePath}${normalisedSegment ? `/${normalisedSegment}` : ''}`;

    return {
      ...rest,
      pathname,
      ...(subMenu ? { subMenu: buildMenu(subMenu, pathname) } : {}),
    };
  });

export function getAdminSideMenu({ lang = 'en' } = {}) {
  const adminSlug = getLocalizedSlug('admin', lang);
  const basePath = `/${lang}/${trimSlashes(adminSlug)}`;
  return buildMenu(RAW_ADMIN_MENU, basePath);
}

export { RAW_ADMIN_MENU };
