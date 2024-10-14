import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandImage: './icon.svg',
    brandTitle: 'Angelo D\'Agostino Components',
    brandUrl: 'https://www.angelo-dagostino.com',
  },
});
