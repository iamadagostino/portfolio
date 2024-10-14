import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    { name: '@storybook/addon-essentials', options: { backgrounds: false } },
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    // Ensure config.define is properly handled
    const customConfig = {
      // Add support for GLB, HDR, and GLSL files
      assetsInclude: ['**/*.glb', '**/*.hdr', '**/*.glsl'],
      // Increase the asset size limit to 1KB
      build: {
        assetsInlineLimit: 1024,
      },
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
      // Define the NODE_ENV environment variable
      define: {
        'process.env': {},
      },
    };

    /**
     * Using dynamic import to load the mergeConfig function from Vite
     * https://github.com/storybookjs/storybook/issues/26291#issuecomment-1978193283
     */
    const { mergeConfig } = await import('vite');

    // Merge custom configuration into the default config
    return mergeConfig(config, customConfig);
  },
};

export default config;
