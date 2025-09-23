import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';

/**
 * This is a special "pathless layout route" that will act as the root layout
 * for all admin routes. It prevents the admin pages from inheriting the main app layout.
 */

// Authentication loader for admin routes
export async function loader(/* args: LoaderFunctionArgs */) {
  // Here you would check if the user is authenticated and has admin permissions
  // For now we'll just pass through without authentication

  // In the future, you can implement authentication:
  // const { request } = args;
  // const isAdmin = await requireAdmin(request);
  // if (!isAdmin) {
  //   throw redirect('/login');
  // }

  // Return empty object
  return {};
}

// This tells Remix to treat this layout as a route boundary
export const handle = {
  skipErrorBoundary: true,
};

export default function AdminRootLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body data-theme="dark" className="bg-slate-900 text-white">
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
