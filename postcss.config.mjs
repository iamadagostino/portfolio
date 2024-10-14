export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: [
        'resources/css/app/global.module.css'
      ],
    },
    'postcss-custom-media': {},
    '@tailwindcss/postcss': {},
  },
};
