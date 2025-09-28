# Localized Routing System

This document explains how the locale-aware routing system works with full locale codes (en-US, it-IT).

## Route Mappings

Routes are mapped based on language in `app/utils/route-mapping.ts`:

**English (en-US):**
- `/en-US/articles` → Articles page
- `/en-US/article/slug` → Single article
- `/en-US/contact` → Contact page
- `/en-US/projects` → Projects page

**Italian (it-IT):**
- `/it-IT/articoli` → Articles page (plural)
- `/it-IT/articolo/slug` → Single article (singular)
- `/it-IT/contatti` → Contact page
- `/it-IT/progetti` → Projects page

## Usage

### In Components

Use the `LocalizedLink` component for navigation:

```tsx
import { LocalizedLink } from '~/components/LocalizedLink';

// Will generate /en-US/articles or /it-IT/articoli based on current language
<LocalizedLink routeKey="articles">Articles</LocalizedLink>

// With slug parameter
<LocalizedLink routeKey="article" slug="my-article">Read Article</LocalizedLink>
```

### Programmatic Navigation

Use the `useLocalizedNavigation` hook:

```tsx
import { useLocalizedNavigation } from '~/utils/navigation';

function MyComponent() {
  const { getPath, currentLanguage } = useLocalizedNavigation();
  
  const articlesPath = getPath('articles'); // /en-US/articles or /it-IT/articoli
  const articlePath = getPath('article', 'my-slug'); // /en-US/article/my-slug or /it-IT/articoli/my-slug
}
```

## Language Switching

The language dropdown automatically handles URL translation:
- From `/en-US/articles` → `/it-IT/articoli`
- From `/en-US/article/slug` → `/it-IT/articolo/slug`
- From `/it-IT/articolo/slug` → `/en-US/article/slug`

## Adding New Localized Routes

1. Add the route mapping in `app/utils/route-mapping.ts`:
```ts
export const ROUTE_MAPPINGS: Record<Language, Record<string, string>> = {
  'en-US': {
    // ... existing routes
    newRoute: 'new-route',
  },
  'it-IT': {
    // ... existing routes  
    newRoute: 'nuova-rotta',
  },
};
```

2. Add both route variants in `app/routes.ts`:
```ts
{
  id: 'new-route-en',
  path: 'new-route',
  file: './routes/$lang/new-route/route.tsx',
},
{
  id: 'new-route-it', 
  path: 'nuova-rotta',
  file: './routes/$lang/new-route/route.tsx',
},
```

The system automatically handles URL generation and language switching!