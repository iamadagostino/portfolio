import type { Config } from 'tailwindcss';

export default {
  content: {
    relative: true,
    files: ['./app/**/*.{js,jsx,ts,tsx}'],
  },
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
