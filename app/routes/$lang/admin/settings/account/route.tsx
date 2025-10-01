'use client';

import { useState } from 'react';
import { Avatar } from '~/components/admin/avatar';
import { Button } from '~/components/admin/button';
import { Divider } from '~/components/admin/divider';
import { Heading, Subheading } from '~/components/admin/heading';
import { Link } from '~/components/admin/link';
import { Text } from '~/components/admin/text';

export const meta = () => [{ title: 'Profile · Account · Admin' }];

const navigationItems = [
  { name: 'Account Information', current: true },
  { name: 'Connected Accounts', current: false },
  { name: 'Security and Privacy', current: false },
  { name: 'Communication Preferences', current: false },
  { name: 'Payment and Wallet', current: false },
  { name: 'Family Management', current: false },
  { name: 'Subscriptions and Memberships', current: false },
];

export default function Profile() {
  const [showDateOfBirth, setShowDateOfBirth] = useState(false);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header Section */}
      <div className="relative mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-8 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Adetton-X1"
                initials="AD"
                alt="Adetton-X1"
                className="size-24 bg-zinc-800 text-white ring-4 ring-white/20"
                square
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full bg-white p-1.5 shadow-md hover:bg-zinc-50"
                aria-label="Edit avatar"
              >
                <svg className="size-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <Heading className="!text-3xl text-white">Adetton-X1</Heading>
              <Text className="text-zinc-300">Member since 2010</Text>
            </div>
          </div>
          <div className="flex gap-3">
            <Button outline className="border-white/30 text-white hover:bg-white/10">
              Edit password
            </Button>
            <Button outline className="border-white/30 text-white hover:bg-white/10">
              Manage linked accounts
            </Button>
            <Button outline className="border-white/30 text-white hover:bg-white/10">
              Manage 2FA settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href="#"
              className={
                item.current
                  ? 'flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white'
                  : 'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
              }
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Account Information Content */}
        <div className="space-y-8 rounded-lg bg-white p-8 shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          <div>
            <Heading className="!text-2xl">Account information</Heading>
          </div>

          <Divider soft />

          {/* EA ID Field */}
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>EA ID</Subheading>
            </div>
            <div className="flex items-center justify-between">
              <Text className="font-medium">Adetton-X1</Text>
              <Button plain className="text-sm">
                Edit
              </Button>
            </div>
          </section>

          <Divider soft />

          {/* Name Field */}
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>Name</Subheading>
            </div>
            <div className="flex items-center justify-between">
              <Text className="font-medium">Angelo D&apos;Agostino</Text>
              <Button plain className="text-sm">
                Edit
              </Button>
            </div>
          </section>

          <Divider soft />

          {/* Date of Birth Field */}
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>Date of birth (YYYY-MM-DD)</Subheading>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Text className="font-medium">{showDateOfBirth ? '1990-01-15' : '****-**-**'}</Text>
              <div className="flex gap-2">
                <Button plain className="text-sm" onClick={() => setShowDateOfBirth(!showDateOfBirth)}>
                  {showDateOfBirth ? 'Hide' : 'Show'}
                </Button>
                <Button plain className="text-sm">
                  Edit
                </Button>
              </div>
            </div>
          </section>

          <Divider soft />

          {/* Email Address Field */}
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Subheading>Email address</Subheading>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="font-medium">a****0@o****m</Text>
                  <div className="mt-1 flex items-center gap-1.5">
                    <svg className="size-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Text className="text-sm text-green-600">Verified</Text>
                  </div>
                </div>
                <Button plain className="text-sm">
                  Edit
                </Button>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
                <svg className="mt-0.5 size-5 shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <Text className="text-sm text-blue-900 dark:text-blue-100">
                  We recommend using an email you check often.
                </Text>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
