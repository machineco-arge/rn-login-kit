import { LoginKitTheme, LoginKitThemeColors, LoginKitThemeFonts, ThemeOverrides } from '../types';

const createBaseColors = (): LoginKitThemeColors => ({
  background: '#FFFFFF',
  textShadow: '#f0f0f1',
  text: '#000000',
  gradient: ['#007AFF', '#5856D6'],

  PRIMARY_950: '#0B0B0B',
  PRIMARY_900: '#1A1A1A',
  PRIMARY_800: '#272727',
  PRIMARY_700: '#404040',
  PRIMARY_600: '#535353',
  PRIMARY_500: '#6C6C6C',
  PRIMARY_400: '#A3A3A3',
  PRIMARY_300: '#D3D3D3',
  PRIMARY_200: '#E6E6E6',
  PRIMARY_100: '#F5F5F5',
  PRIMARY_50: '#FAFAFA',

  SECONDARY_100: '#F1EDE3',
  SECONDARY_50: '#FCFBF9',

  TERTIARY_TEXT_DARK: '#2C2837',
  TERTIARY_TEXT_LIGHT: '#FFFFFF',

  TRANSPARENT_PRIMARY: 'rgba(86, 86, 86, 0.5)', // custom bottom sheets
  TRANSPARENT_SECONDARY: 'rgba(107, 60, 3, 0.5)', // camera details bg
});

const createBaseFonts = (): LoginKitThemeFonts => ({
  primaryBlack: 'System',
  primaryExtraBold: 'System',
  primaryBold: 'System',
  primarySemiBold: 'System',
  primaryMedium: 'System',
  primaryRegular: 'System',
  primaryLight: 'System',
  primaryExtraLight: 'System',
  primaryThin: 'System',
})

export const createDefaultTheme = (overrides: ThemeOverrides = {}): LoginKitTheme => ({
  colors: {
    ...createBaseColors(),
    ...overrides.colors,
  },
  fonts: {
    ...createBaseFonts(),
    ...overrides.fonts,
  },
  borderRadius: overrides.borderRadius ?? 12,
});

export const createLightTheme = (overrides: ThemeOverrides = {}): LoginKitTheme => ({
  ...createDefaultTheme(overrides),
  colors: {
    ...createBaseColors(),
    background: '#FFFFFF',
    text: '#000000',
    gradient: ['#007AFF', '#5856D6'],
    ...overrides.colors,
  },
  fonts: {
    ...createBaseFonts(),
    ...overrides.fonts,
  },
  borderRadius: overrides.borderRadius ?? 12,
});

export const createDarkTheme = (overrides: ThemeOverrides = {}): LoginKitTheme => ({
  ...createDefaultTheme(overrides),
  colors: {
    ...createBaseColors(),
    background: '#000000',
    text: '#FFFFFF',
    gradient: ['#5E5CE6', '#0A84FF'],
    ...overrides.colors,
  },
  fonts: {
    ...createBaseFonts(),
    ...overrides.fonts,
  },
  borderRadius: overrides.borderRadius ?? 12,

}); 