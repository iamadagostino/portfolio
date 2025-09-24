import { type Config } from 'prettier';

const config: Config = {
  semi: true,
  singleQuote: true,
  printWidth: 120,
  trailingComma: 'es5',
  tailwindFunctions: ['clsx', 'tw'],
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/assets/css/tailwind.css',
};

export default config;
