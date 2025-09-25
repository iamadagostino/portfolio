import { pxToRem } from '~/utils/style';

// Full list of tokens
const baseTokens = {
  black: 'oklch(0% 0 0)',
  blackHex: '#000000',
  white: 'oklch(100% 0 0)',
  whiteHex: '#ffffff',
  bezierFastoutSlowin: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  durationXS: '200ms',
  durationS: '300ms',
  durationM: '400ms',
  durationL: '600ms',
  durationXL: '800ms',
  systemFontStack:
    'system-ui, -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Ubuntu, Helvetica Neue, sans-serif',
  fontStack: `Gotham, var(--systemFontStack)`,
  monoFontStack:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  japaneseFontStack:
    'IPA Gothic, ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro, Hiragino Sans, Osaka, メイリオ, Meiryo, Segoe UI, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  fontSizeH0: pxToRem(140),
  fontSizeH1: pxToRem(100),
  fontSizeH2: pxToRem(58),
  fontSizeH3: pxToRem(38),
  fontSizeH4: pxToRem(28),
  fontSizeH5: pxToRem(24),
  fontSizeBodyXL: pxToRem(22),
  fontSizeBodyL: pxToRem(20),
  fontSizeBodyM: pxToRem(18),
  fontSizeBodyS: pxToRem(16),
  fontSizeBodyXS: pxToRem(14),
  lineHeightTitle: '1.1',
  lineHeightBody: '1.6',
  maxWidthS: '540px',
  maxWidthM: '720px',
  maxWidthL: '1096px',
  maxWidthXL: '1680px',
  spaceOuter: '64px',
  spaceXS: '4px',
  spaceS: '8px',
  spaceM: '16px',
  spaceL: '24px',
  spaceXL: '32px',
  space2XL: '48px',
  space3XL: '64px',
  space4XL: '96px',
  space5XL: '128px',
  zIndex0: 0,
  zIndex1: 1,
  zIndex2: 2,
  zIndex3: 4,
  zIndex4: 8,
  zIndex5: 16,
  zIndex6: 32,
  zIndex7: 64,
  zIndex8: 128,
  zIndex9: 256,
  zIndex10: 512,
  flagIconSize: '24px',
};

// Tokens that change based on viewport size
const tokensDesktop = {
  fontSizeH0: pxToRem(120),
  fontSizeH1: pxToRem(80),
};

const tokensLaptop = {
  maxWidthS: '480px',
  maxWidthM: '640px',
  maxWidthL: '1000px',
  maxWidthXL: '1100px',
  spaceOuter: '48px',
  fontSizeH0: pxToRem(100),
  fontSizeH1: pxToRem(70),
  fontSizeH2: pxToRem(50),
  fontSizeH3: pxToRem(36),
  fontSizeH4: pxToRem(26),
  fontSizeH5: pxToRem(22),
};

const tokensTablet = {
  fontSizeH0: pxToRem(80),
  fontSizeH1: pxToRem(60),
  fontSizeH2: pxToRem(48),
  fontSizeH3: pxToRem(32),
  fontSizeH4: pxToRem(24),
  fontSizeH5: pxToRem(20),
};

const tokensMobile = {
  spaceOuter: '24px',
  fontSizeH0: pxToRem(56),
  fontSizeH1: pxToRem(40),
  fontSizeH2: pxToRem(34),
  fontSizeH3: pxToRem(28),
  fontSizeH4: pxToRem(22),
  fontSizeH5: pxToRem(18),
  fontSizeBodyL: pxToRem(17),
  fontSizeBodyM: pxToRem(16),
  fontSizeBodyS: pxToRem(14),
};

const tokensMobileSmall = {
  spaceOuter: '16px',
  fontSizeH0: pxToRem(42),
  fontSizeH1: pxToRem(38),
  fontSizeH2: pxToRem(28),
  fontSizeH3: pxToRem(24),
  fontSizeH4: pxToRem(20),
};

// Tokens that change based on theme
const dark = {
  background: 'oklch(17.76% 0 0)', //#111111
  backgroundHex: '#111111',
  backgroundInverted: 'oklch(96.12% 0 0)', // #f2f2f2
  backgroundInvertedHex: '#f2f2f2',
  backgroundLight: 'oklch(21.78% 0 0)', //1a1a1a
  backgroundLightHex: '#1a1a1a',
  backgroundLightInverted: 'var(--white)', // #ffffff
  backgroundLightInvertedHex: '#ffffff',
  primary: 'var(--black)', //#  vec3 color = vec3(vUv * (0.2 - 2.0 * noise), 1.0);
  primaryHex: '#0A84FF',
  accent: 'oklch(62.43% 0.20557727502427348 255.48611841539625)',//#0a84ff
  accentHex: '#0A84FF',
  error: 'oklch(65.91% 0.249 13.76)', // #ff2463
  errorHex: '#ff2463',
  text: 'var(--white)', //#ffffff
  textHex: '#ffffff',
  textInverted: 'var(--black)', //#000000
  textInvertedHex: '#000000',
  textTitle: 'var(--text)',
  textTitleInverted: 'var(--textInverted)',
  textBody: 'color-mix(in lab, var(--text) 80%, transparent)',
  textBodyInverted: 'color-mix(in lab, var(--textInverted) 80%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 60%, transparent)',
  textLightInverted: 'color-mix(in lab, var(--textInverted) 60%, transparent)',
};

const light = {
  background: 'oklch(96.12% 0 0)', // #f2f2f2
  backgroundHex: '#f2f2f2',
  backgroundInverted: 'oklch(17.76% 0 0)', //#111111
  backgroundInvertedHex: '#111111',
  backgroundLight: 'var(--white)', // #ffffff
  backgroundLightHex: '#ffffff',
  backgroundLightInverted: 'oklch(21.78% 0 0)', //1a1a1a
  backgroundLightInvertedHex: '#1a1a1a',
  primary: 'var(--black)', // #000000 vec3 color = vec3(vUv * (0.2 - 2.0 * noise), 1.0);
  primaryHex: '#000000',
  accent: 'oklch(62.43% 0.20557727502427348 255.48611841539625)', //#0a84ff
  accentHex: '#0A84FF',
  error: 'oklch(61.22% 0.2082 22.24)', //#e63946
  errorHex: '#e63946',
  text: 'var(--black)', // #000000
  textHex: '#000000',
  textInverted: 'var(--white)', //#ffffff
  textInvertedHex: '#ffffff',
  textTitle: 'color-mix(in lab, var(--text) 90%, transparent)',
  textTitleInverted: 'color-mix(in lab, var(--textInverted) 90%, transparent)',
  textBody: 'color-mix(in lab, var(--text) 75%, transparent)',
  textBodyInverted: 'color-mix(in lab, var(--textInverted) 75%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 55%, transparent)',
  textLightInverted: 'color-mix(in lab, var(--textInverted) 55%, transparent)',
};

export const tokens = {
  base: baseTokens,
  desktop: tokensDesktop,
  laptop: tokensLaptop,
  tablet: tokensTablet,
  mobile: tokensMobile,
  mobileS: tokensMobileSmall,
};

export const themes = { dark, light };
