import { createLocalizedLoader } from '../../../locale-loader';

// Simple loader without any redirects
export const loader = createLocalizedLoader();

export default function Debug() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Debug Information</h1>
      <div className="space-y-4">
        <div className="rounded bg-gray-100 p-4">
          <h2 className="font-semibold">Route Test</h2>
          <p>This debug route is working correctly!</p>
        </div>
        <div className="rounded bg-blue-50 p-4">
          <h2 className="font-semibold">Environment</h2>
          <p>Node Environment: {typeof window === 'undefined' ? 'Server' : 'Client'}</p>
          <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
        </div>
      </div>
    </div>
  );
}

export const meta = () => {
  return [{ title: 'Debug Information' }, { name: 'description', content: 'Admin debugging information page.' }];
};
