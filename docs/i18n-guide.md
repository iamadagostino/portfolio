# i18n Translation System Guide

## Overview

This project now has a comprehensive internationalization (i18n) system with multiple translation namespaces for different sections of the site.

## File Structure

```
resources/locales/
├── en-US/
│   ├── common.json      # Common translations
│   ├── navbar.json      # Navigation translations
│   ├── home.json        # Homepage translations
│   ├── articles.json    # Articles page translations
│   ├── contact.json     # Contact page translations
│   ├── projects.json    # Projects page translations
│   └── error.json       # Error pages translations
└── it-IT/
    ├── common.json      # Common translations (Italian)
    ├── navbar.json      # Navigation translations (Italian)
    ├── home.json        # Homepage translations (Italian)
    ├── articles.json    # Articles page translations (Italian)
    ├── contact.json     # Contact page translations (Italian)
    ├── projects.json    # Projects page translations (Italian)
    └── error.json       # Error pages translations (Italian)
```

## Usage Examples

### 1. Using Typed Translation Hooks

```tsx
import { useNavbarTranslation, useHomeTranslation } from '~/i18n/i18n.hooks';

export const MyComponent = () => {
  const { t: tNavbar } = useNavbarTranslation();
  const { t: tHome } = useHomeTranslation();

  return (
    <div>
      <h1>{tNavbar('Home')}</h1>
      <p>{tHome('hero.description')}</p>
    </div>
  );
};
```

### 2. Using Generic Namespace Hook

```tsx
import { useNamespaceTranslation } from '~/i18n/i18n.hooks';

export const ArticlesPage = () => {
  const { t } = useNamespaceTranslation('articles');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('readTime', { minutes: 5 })}</p>
    </div>
  );
};
```

### 3. Language Switching

```tsx
import { useLanguageChanger } from '~/i18n/i18n.hooks';

export const LanguageSwitcher = () => {
  const { changeLanguage, currentLanguage } = useLanguageChanger();

  return (
    <div>
      <p>Current: {currentLanguage}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('it')}>Italiano</button>
    </div>
  );
};
```

### 4. Using Error Page Translations

```tsx
import { useErrorTranslation } from '~/i18n/i18n.hooks';

export const ErrorPage = ({ error }) => {
  const { t } = useErrorTranslation();

  return (
    <div>
      <h1>{t('errors.404.summary')}</h1>
      <p>{t('errors.404.message')}</p>
      <button>{t('errors.notFound.button')}</button>
    </div>
  );
};
```

### 5. Using Translations in Navigation

```tsx
import { useNavbarTranslation } from '~/i18n/i18n.hooks';
import { getNavLinks } from './nav-data';

export const NavigationMenu = () => {
  const { t } = useNavbarTranslation();
  const navLinks = getNavLinks(t);

  return (
    <nav>
      {navLinks.map(link => (
        <a key={link.key} href={link.pathname}>
          {link.label}
        </a>
      ))}
    </nav>
  );
};
```

## Available Translation Namespaces

### navbar.json

- Navigation items (Home, Projects, Details, Articles, Contact)

### home.json

- Hero section content
- About section
- Services descriptions

### articles.json

- Article listing and reading interface
- Search functionality
- Article metadata

### contact.json

- Contact form labels and messages
- Social media links
- Validation messages

### projects.json

### projects.json

- Project showcase content
- Technology categories
- Project status indicators

### error.json

- Error page messages (404, 405, etc.)
- Error button texts
- Animation credits

### common.json

- Shared translations across the app
- Common UI elements

## Adding New Languages

1. Create new locale folders: `resources/locales/[language-code]/`
2. Copy existing JSON files and translate the values
3. Update `app/i18n/i18n.resources.ts`:
   ```typescript
   const languages = ['en', 'it', 'newLanguage'] as const;
   ```
4. Import the new translation files and add them to the resources object

## Adding New Translation Namespaces

1. Create new JSON files in each language folder
2. Update the Resource type in `i18n.resources.ts`
3. Add imports and include in the resources object
4. Create a new hook in `i18n.hooks.ts`:
   ```typescript
   export function useNewNamespaceTranslation() {
     return useTranslation('newNamespace');
   }
   ```

## Error Page Translation Hook

The error translation hook is already available:

```tsx
import { useErrorTranslation } from '~/i18n/i18n.hooks';

export const MyErrorComponent = () => {
  const { t } = useErrorTranslation();

  return (
    <div>
      <h1>{t('errors.404.summary')}</h1>
      <p>{t('errors.404.message')}</p>
    </div>
  );
};
```

## Best Practices

1. **Use descriptive keys**: `hero.title` instead of `title1`
2. **Group related translations**: Use nested objects for related content
3. **Include context**: Use parameters for dynamic content
4. **Type safety**: Always use the provided hooks for better TypeScript support
5. **Fallback values**: Provide meaningful fallback text
6. **Consistent naming**: Use the same key structure across all languages
