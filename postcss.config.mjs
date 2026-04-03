export default {
  plugins: {
    'postcss-import': {},
    'postcss-advanced-variables': {
      // Ignore unresolved variables (e.g., Vite's asset placeholders like __VITE_ASSET__$...)
      unresolved: 'ignore',
    },
    '@csstools/postcss-global-data': {
      files: [
        'app/assets/css/global.module.css'
      ],
    },
    'postcss-custom-media': {},
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
};
