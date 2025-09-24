'use client';

import { Outlet, redirect, useLoaderData, useLocation } from 'react-router';

import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid';
import {
  BugAntIcon,
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid';
import ericaAvatar from '~/assets/images/admin/users/erica.jpg';
import adLogoMark from '~/assets/images/logos/logo-mark.svg';
import { Avatar } from '~/components/admin/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '~/components/admin/dropdown';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '~/components/admin/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '~/components/admin/sidebar';
import { getEvents } from '~/data/fake';
import { SidebarLayout } from '~/layouts/admin/sidebar-layout';
import { getAdminSideMenu } from '~/config/menus/admin-menu';

import { createLocalizedLoader } from '../locale-loader';

export const handle = {
  layout: 'admin',
};

export const loader = createLocalizedLoader(async ({ language, request }) => {
  // TODO: Re-enable admin authentication after debugging
  // const adminUser = await requireAdminUser(request, `/${language}/login`);

  const url = new URL(request.url);
  const adminBasePath = `/${language}/admin`;
  
  // Redirect /admin to /admin/dashboard
  if (url.pathname === adminBasePath || url.pathname === `${adminBasePath}/`) {
    throw redirect(`${adminBasePath}/dashboard`);
  }

  const events = await getEvents();
  const adminMenu = getAdminSideMenu({ lang: language });

  return {
    lang: language,
    events,
    adminMenu,
    // adminUser, // Disabled for debugging
  };
});

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/login">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

type AdminLoaderData = {
  lang: string;
  events?: Awaited<ReturnType<typeof getEvents>>;
  adminMenu: ReturnType<typeof getAdminSideMenu>;
};

const iconMap: Record<string, typeof HomeIcon> = {
  HomeIcon,
  Square2StackIcon,
  TicketIcon,
  Cog6ToothIcon,
  BugAntIcon,
};

export default function Admin() {
  const { pathname } = useLocation();
  const { events = [], lang, adminMenu } = useLoaderData<AdminLoaderData>();
  
  const isPathActive = (target: string) => {
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src={ericaAvatar} square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src={adLogoMark} />
                <SidebarLabel>Angelo D&apos;Agostino</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href={adminMenu.find((item: any) => item.key === 'settings')?.pathname || '#'}>
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <Avatar slot="icon" src={adLogoMark} />
                  <DropdownLabel>Angelo D&apos;Agostino</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                  <DropdownLabel>Big Events</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              {adminMenu.map((item: any) => {
                const IconComponent = iconMap[item.icon] || HomeIcon;
                return (
                  <SidebarItem 
                    key={item.key} 
                    href={item.pathname} 
                    current={isPathActive(item.pathname)}
                  >
                    <IconComponent />
                    <SidebarLabel>{item.title}</SidebarLabel>
                  </SidebarItem>
                );
              })}
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              {events.map((event) => {
                const eventsBasePath = adminMenu.find((item: any) => item.key === 'events')?.pathname || '#';
                const href = `${eventsBasePath}/${event.id}`;

                return (
                  <SidebarItem key={event.id} href={href} current={isPathActive(href)}>
                    {event.name}
                  </SidebarItem>
                );
              })}
            </SidebarSection>

            <SidebarSpacer />

            <SidebarSection>
              <SidebarItem href="#">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src={ericaAvatar} className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">Erica</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Outlet />
    </SidebarLayout>
  );
}
