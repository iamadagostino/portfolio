import { createPagesFunctionHandler } from '@react-router/cloudflare-pages';

import * as build from '../build/server';

// Attempt to import the route slug map to derive rewrite rules programmatically.
// We import the compiled utils file from the app folder. If the import fails at
// runtime in Cloudflare (e.g. due to bundling), the fallback below will be used.
let ROUTE_SLUG_MAP = null;
let DEFAULT_CANONICAL_LANGUAGE = 'en-US';

try {
	// Note: using the path into the app routes so the bundler includes it
	// Keep this import dynamic to avoid build-time failures in some toolchains
	const config = require('../app/routes/config');
	ROUTE_SLUG_MAP = config.ROUTE_SLUG_MAP;
	if (config.DEFAULT_CANONICAL_LANGUAGE) {
		DEFAULT_CANONICAL_LANGUAGE = config.DEFAULT_CANONICAL_LANGUAGE;
	}
} catch {
	// Fallback: minimal mapping for contact
	ROUTE_SLUG_MAP = {
		articles: { 'en-US': 'articles', 'it-IT': 'articoli' },
		article: { 'en-US': 'article', 'it-IT': 'articolo' },
		contact: { 'en-US': 'contact', 'it-IT': 'contatti' },
		details: { 'en-US': 'details', 'it-IT': 'dettagli' },
		projects: { 'en-US': 'projects', 'it-IT': 'progetti' },
		'3d-experience': { 'en-US': '3d-experience', 'it-IT': 'esperienza-3d' },
	};
}

// Build rewrite rules from ROUTE_SLUG_MAP. For each canonical route, create mappings
// from localized slug -> canonical slug for each language. Example: '/it/contatti' -> '/it/contact'
const REWRITE_PREFIXES = [];
Object.entries(ROUTE_SLUG_MAP).forEach(([canonical, translations]) => {
	Object.entries(translations).forEach(([lang, localizedSlug]) => {
		const canonicalSlug = translations[DEFAULT_CANONICAL_LANGUAGE] || canonical;
		// Only rewrite when the localized slug matches the canonical slug.
		// This preserves locale-specific slugs like 'contatti' or 'esperienza-3d'.
		if (localizedSlug !== canonicalSlug) {
			return;
		}
		const from = `/${lang}/${localizedSlug}`;
		const to = `/${lang}/${canonicalSlug}`;
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
