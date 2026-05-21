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
  background: string;
  textShadow: string;
  text: string;
  gradient: string[];

  // new
  PRIMARY_950: string;
  PRIMARY_900: string;
  PRIMARY_800: string;
  PRIMARY_700: string;
  PRIMARY_600: string;
  PRIMARY_500: string;
  PRIMARY_400: string;
  PRIMARY_300: string;
  PRIMARY_200: string;
  PRIMARY_100: string;
  PRIMARY_50: string;

  SECONDARY_100: string;
  SECONDARY_50: string;

  TERTIARY_TEXT_DARK: string;
  TERTIARY_TEXT_LIGHT: string;

  TRANSPARENT_PRIMARY: string;
  TRANSPARENT_SECONDARY: string;
}

export interface LoginKitThemeFonts {
  primaryBlack: string;
  primaryExtraBold: string;
  primaryBold: string;
  primarySemiBold: string;
  primaryMedium: string;
  primaryRegular: string;
  primaryLight: string;
  primaryExtraLight: string;
  primaryThin: string;
  secondaryBlack?: string;
  secondaryExtraBold?: string;
  secondaryBold?: string;
  secondarySemiBold?: string;
  secondaryMedium?: string;
  secondaryRegular?: string;
  secondaryLight?: string;
  secondaryExtraLight?: string;
  secondaryThin?: string;
}

export interface LoginKitTheme {
  colors: LoginKitThemeColors;
  fonts: LoginKitThemeFonts;
  borderRadius: number;
}

export interface ThemeOverrides {
  colors?: Partial<LoginKitThemeColors>;
  fonts?: Partial<LoginKitThemeFonts>;
  borderRadius?: number;
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
  onPermissionAccessGalery?: () => Promise<boolean>;
  onDeleteAccountPress?: () => void;
}

// Logo Configuration
export interface LogoConfig {
  source: ImageSourcePropType;
  text?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoTextImage?: string;
  logoTextImageWidth?: number;
  logoTextImageHeight?: number;
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

export interface EmailAuthConfig {
  enabledRegister?: boolean;
  enabledSignInCompanyName?: boolean;
  enabledSignInEmail?: boolean;
  enabledSignInUserName?: boolean;
  enabledRegisterUserName?: boolean;
  enabledRegisterEmail?: boolean;
}

// Main Configuration Interface
export interface LoginKitConfig {
  theme: LoginKitTheme;
  socialAuth: SocialAuthConfig;
  emailAuth: EmailAuthConfig;
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
      sendRegistrationCode?: string;
      sendPasswordResetCode?: string;
      verifyPasswordResetCode?: string;
      resetPassword?: string;
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

export interface IMenuItemsProps {
    title: string;
    onPress: () => void;
    config: LoginKitConfig;
    iconChevron?: React.ComponentType<any>;
}

export interface ProfileSettigsProps {
  config: LoginKitConfig;
  backgroundImage?: any;
  backgroundSvg?: () => React.JSX.Element;
  userAvatarIcon?: React.ComponentType<any>;
  iconChevron?: React.ComponentType<any>;
  iconLogout?: React.ComponentType<any>;
  navigateBackIcon?: React.JSX.Element;
  menuList: {
    title: string;
    onPress?: () => void;
  }[];
  showUserName?: boolean;
  biography?: string;
  stats?: string;
  proMemberText?: string;
  proMemberTextColor?: string;
}


export interface TermsPoliciesProps {
  config: LoginKitConfig;
  title: string;
  content: { heading: string; paragraphs: string[] }[];
  backgroundImage?: any;
  backgroundSvg?: () => React.JSX.Element;
  navigateBackIcon?: React.JSX.Element;
}