export default {
  plugins: {
    'postcss-import': {},
    'postcss-advanced-variables': {},
    '@csstools/postcss-global-data': {
      files: [
        'app/assets/css/app.global.module.css'
      ],
    },
    'postcss-custom-media': {},
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
};
