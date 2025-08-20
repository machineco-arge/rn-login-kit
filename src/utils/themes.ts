import { LoginKitTheme, LoginKitThemeColors } from '../types';

const createBaseColors = (): LoginKitThemeColors => ({
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  cardBackground: '#2A3436',
  navbarUnselected: '#8E8E93',
  navbarSelected: '#be5300',
  textShadow: '#f0f0f1',
  gray: '#e5e7eb',
  reddish: '#FF3B30',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#6D6D80',
  border: '#E5E5EA',
  gradient: ['#007AFF', '#5856D6'],
  buttonPrimary: '#007AFF',
  buttonSecondary: '#F2F2F7',
  buttonText: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
  themeToggleCircle: '#FFD700',
  editColor: '#48515C',
  resetColor: '#1C54BE',
  deleteColor: '#A60909',
  imagePickerColor: '#0F877D',
  alertOkButtonColor: '#2677c8',
  alertCancelButtonColor: '#d60c0c',
  alertConfirmButtonColor: '#2677c8',
});

export const createDefaultTheme = (colors?: Partial<LoginKitThemeColors>): LoginKitTheme => ({
  colors: {
    ...createBaseColors(),
    ...colors,
  },
  fonts: {
    primary: 'System',
  },
  borderRadius: 12,
});

export const createLightTheme = (colors?: Partial<LoginKitThemeColors>): LoginKitTheme => ({
  colors: {
    ...createBaseColors(),
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#6D6D80',
    border: '#E5E5EA',
    gradient: ['#007AFF', '#5856D6'],
    ...colors,
  },
  fonts: {
    primary: 'System',
  },
  borderRadius: 12,
});

export const createDarkTheme = (colors?: Partial<LoginKitThemeColors>): LoginKitTheme => ({
  colors: {
    ...createBaseColors(),
    background: '#000000',
    cardBackground: '#2A3436',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A', 
    gradient: ['#5E5CE6', '#0A84FF'],
    buttonPrimary: '#0A84FF',
    buttonSecondary: '#1C1C1E',
    buttonText: '#FFFFFF',
    ...colors,
  },
  fonts: {
    primary: 'System',
  },
  borderRadius: 12,
}); 