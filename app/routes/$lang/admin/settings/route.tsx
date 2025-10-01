import { Outlet } from 'react-router';

export const meta = () => [{ title: 'Settings · Admin' }];

export default function SettingsLayout() {
  return <Outlet />;
}
