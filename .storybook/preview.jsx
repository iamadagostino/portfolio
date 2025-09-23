import 'assets/css/app.reset.module.css'; // Contains Reset styles
import 'assets/css/app.global.module.css'; // Contains Global styles
import './preview.css';

import { ThemeProvider, themeStyles } from '../app/components/theme-provider';

import { useEffect } from 'react';

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme;

    useEffect(() => {
      document.body.dataset.theme = theme;
    }, [theme]);

    return (
      <ThemeProvider theme={theme}>
        <style>{themeStyles}</style>
        <div id="story-root" className="storyRoot">
          <Story />
        </div>
      </ThemeProvider>
    );
  },
];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'dark',
    toolbar: {
      icon: 'paintbrush',
      items: ['light', 'dark'],
    },
  },
};

export const parameters = {
  layout: 'fullscreen',
  controls: { hideNoControlsWarning: true },
};
