import { createPagesFunctionHandler } from '@react-router/cloudflare-pages';

import * as build from '../build/server';

// Attempt to import the route slug map to derive rewrite rules programmatically.
// We import the compiled utils file from the app folder. If the import fails at
// runtime in Cloudflare (e.g. due to bundling), the fallback below will be used.
let ROUTE_SLUG_MAP = null;
try {
		// Note: using the path into the app routes so the bundler includes it
		// Keep this import dynamic to avoid build-time failures in some toolchains
		ROUTE_SLUG_MAP = require('../app/routes/config').ROUTE_SLUG_MAP;
} catch {
	// Fallback: minimal mapping for contact
	ROUTE_SLUG_MAP = {
		contact: { en: 'contact', it: 'contatti' },
	};
}

// Build rewrite rules from ROUTE_SLUG_MAP. For each canonical route, create mappings
// from localized slug -> canonical slug for each language. Example: '/it/contatti' -> '/it/contact'
const REWRITE_PREFIXES = [];
Object.entries(ROUTE_SLUG_MAP).forEach(([canonical, translations]) => {
	Object.entries(translations).forEach(([lang, localizedSlug]) => {
		const from = `/${lang}/${localizedSlug}`;
		const to = `/${lang}/${translations.en || canonical}`; // prefer English canonical here
		REWRITE_PREFIXES.push({ from, to });
	});
});

export const onRequest = async (context) => {
	const { request } = context;
	const url = new URL(request.url);
	const originalPath = url.pathname;

	// Check if we need to internally rewrite localized slug to canonical slug
	// This keeps the original URL in the address bar but routes to the correct folder
	for (const { from, to } of REWRITE_PREFIXES) {
		if (originalPath === from || originalPath.startsWith(from + '/')) {
			const suffix = originalPath.slice(from.length);
			const rewrittenPath = `${to}${suffix}`;
			const rewrittenUrl = `${url.origin}${rewrittenPath}${url.search}`;
			const rewrittenRequest = new Request(rewrittenUrl, request);
			context = { ...context, request: rewrittenRequest };
			break;
		}
	}

	return createPagesFunctionHandler({ build })(context);
};
