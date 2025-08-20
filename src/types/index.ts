import { ImageSourcePropType } from 'react-native';

// Callback Types
export type UserInitializationCallback = () => Promise<void>;

// App Translation Configuration
export interface AppTranslationResources {
  [namespace: string]: {
    [key: string]: any; // Allow any nested structure
  };
}

// Theme Configuration
export interface LoginKitThemeColors {
  primary: string;
  secondary: string;
  background: string;
  cardBackground: string;
  navbarUnselected: string;
  navbarSelected: string;
  textShadow: string;
  gray: string;
  reddish: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  gradient: string[];
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  error: string;
  success: string;
  themeToggleCircle: string;
  editColor: string;
  resetColor: string;
  deleteColor: string;
  imagePickerColor: string;
  alertOkButtonColor: string;
  alertCancelButtonColor: string;
  alertConfirmButtonColor: string;
}

export interface LoginKitTheme {
  colors: LoginKitThemeColors;
  fonts: {
    primary: string;
    secondary?: string;
  };
  borderRadius: number;
}

// Social Auth Configuration
export interface SocialAuthConfig {
  google?: {
    webClientId: string;
    iosClientId: string;
    enabled: boolean;
  };
  apple?: {
    enabled: boolean;
  };
}

export interface IUserInfo {
  idToken: string | null;
  name: string | null;
  email: string | null;
  photo: string | null;
  providerId: 'google.com' | 'apple.com' | 'userSignIn' | 'userRegister' | null;
} 

// Navigation Configuration
export interface NavigationConfig {
  onLoginSuccess: () => void;
  onRegisterPress?: () => void;
  onSignInPress?: () => void;
  onForgotPasswordPress?: () => void;
  onLogout?: () => void;
  onUserNameUpdate?: (newName: string) => Promise<void>;
  onGetUserName?: () => Promise<string | null>;
}

// Logo Configuration
export interface LogoConfig {
  source: ImageSourcePropType;
  text?: string;
  width?: number;
  height?: number;
}

// Privacy Policy Configuration
export interface PrivacyConfig {
  pressPrivacyPolicy: () => void;
  required?: boolean;
}

// Localization Configuration
export interface LocalizationConfig {
  namespace?: string;
  translations?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

// Translation API Configuration
export interface TranslationAPIConfig {
  deepLAuthKey?: string;
  googleCloudApiKey?: string;
}

// Localization and Translation Configuration
export interface TranslationConfig {
  cdnUrl: string;
  namespaces: string[];
  defaultNS?: string;
  apiConfig?: TranslationAPIConfig; // For potential future on-the-fly translations
}

// Main Configuration Interface
export interface LoginKitConfig {
  theme: LoginKitTheme;
  socialAuth: SocialAuthConfig;
  navigation: NavigationConfig;
  logo: LogoConfig;
  privacy: PrivacyConfig;
  localization?: LocalizationConfig;
  apiConfig?: {
    baseUrl: string;
    endpoints: {
      googleLogin: string;
      appleLogin: string;
      logout: string;
      userLogin?: string;
      userRegister?: string;
    };
  };
  translationConfig: TranslationConfig; // New CDN-based config
}

export interface ScreenProps {
  config: LoginKitConfig;
  showSocialLogin?: boolean;
  showEmailLogin?: boolean;
  showProfileManagement?: boolean;
  GoogleIcon?: React.ComponentType<any>;
  AppleIcon?: React.ComponentType<any>;
}