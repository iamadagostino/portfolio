export const loader = async () => {
  // Always respond with a 404 so the root ErrorBoundary / Error layout renders
  throw new Response('Not Found', { status: 404 });
};

export default function LocalizedNotFound() {
  // This component's UI is handled by the global Error layout. Return null.
  return null;
}
