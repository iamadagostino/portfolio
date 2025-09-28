import { DOMAIN_ROUTE_MAPPINGS } from './index';

// Generate API routes (typically not localized)
export function generateApiRoutes() {
  const apiMappings = DOMAIN_ROUTE_MAPPINGS['en-US'].api;
  
  return [
    {
      id: 'api-blog-language-switch',
      path: `api/${apiMappings['blog-language-switch']}`,
      file: './routes/api/blog-language-switch.ts',
    },
    {
      id: 'api-language-switch',
      path: `api/${apiMappings['language-switch']}`,
      file: './routes/api/language-switch.ts',
    },
    {
      id: 'api-set-theme',
      path: `api/${apiMappings['set-theme']}`,
      file: './routes/api/set-theme.ts',
    },
    {
      id: 'api-upload-image',
      path: `api/${apiMappings['upload-image']}`,
      file: './routes/api/upload-image.ts',
    },
  ];
}