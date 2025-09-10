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


  // Login&SignIn&Register Screens
  loginScreensTextInputBgColor: string;
  loginScreensTextInputBorderColor: string;
  loginScreensTextInputTextColor: string;
  loginScreensTextInputSecondaryTextColor: string;
  loginScreensPrivacyPolicyCheckTrueColor: string;
  loginScreensPrivacyPolicyCheckFalseColor: string;
  loginScreensPrivacyPolicyTextColor: string;
  loginScreensHaveAnAccountTextColor: string;
  loginScreensHaveAnAccountButtonColor: string;
  loginScreensTitleColor: string;
  loginScreensSubTitleColor: string;
  loginScreensButtonsColor: string;
  loginScreensButtonTextColor: string;
  loginScreensLogoTextColor: string;

  // Account Screen
  accountScreenPhotoCropperBgColor: string;
  accountScreenPhotoCropperTitleColor: string;
  accountScreenPhotoCropperPreviewContainerBorderColor: string;
  accountScreenPhotoCropperButtonBorderColor: string;
  accountScreenPhotoCropperOkButtonColor: string;
  accountScreenPhotoCropperCancelButtonColor: string;
  accountScreenPhotoCropperButtonTextColor: string;
  accountScreenEditNameModalBgColor: string;
  accountScreenEditNameModalBorderColor: string;
  accountScreenEditNameModalTitleColor: string;
  accountScreenEditNameModalTextInputBgColor: string;
  accountScreenEditNameModalTextInputColor: string;
  accountScreenEditNameModalOkButtonColor: string;
  accountScreenEditNameModalCancelButtonColor: string;
  accountScreenEditNameModalButtonTextColor: string;
  accountScreenHeaderTitleColor: string;
  accountScreenHeaderEditPhotoTitleColor: string;
  accountScreenEditPhotoCardBgColor: string;
  accountScreenAvatarPhotoCardBgColor: string;
  accountScreenAvatarPhotoCardTextColor: string;
  accountScreenEditPhotoActionButtonsBgColor: string;
  accountScreenEditPhotoActionButtonsBorderColor: string;
  accountScreenInfoSectionBgColor: string;
  accountScreenInfoSectionBorderColor: string;
  accountScreenInfoSectionLabelTextColor: string;
  accountScreenInfoSectionValueTextColor: string;
  accountScreenLogoutButtonColor: string;

  // Language Screen
  languageScreenHeaderTitleColor: string;
  languageScreenItemCardBgColor: string;
  languageScreenSelectedLanguageItemBgColor: string;
  languageScreenSelectedLanguageItemBorderColor: string;
  languageScreenCurrentLanguageItemBgColor: string;
  languageScreenCurrentLanguageItemBorderColor: string;
  languageScreenAllLanguagesTextColor: string;
  languageScreenEnglishVersionOfAllLanguagesTextColor: string;
  languageScreenSelectedLanguageTextColor: string;
  languageScreenCurrentLanguageColor: string;
  languageScreenApplyButtonColor: string;
  languageScreenApplyButtonTextColor: string;
  languageScreenProgressTitle: string;
  languageScreenProgressSubTitle: string;
  languageScreenProgressBarContainer: string;
  languageScreenProgressBarFill: string;

  // Helps&FAQs Screen
  faqsScreeenHeaderTitleColor: string;
  faqsScreeenIconsColor: string;
  faqsScreeenTooggleIconColor: string;
  faqsScreeenSectionTitle: string;
  faqsScreeenAccordionBgColor: string;
  faqsScreeenAccordionShadowColor: string;
  faqsScreeenAccordionBorderColor: string;
  faqsScreeenQuestionTextColor: string;
  faqsScreeenAnswerTextColor: string;

  // DarkLightMode Screen
  themeScreenHeaderTitleColor: string;
  themeScreenSubHeaderTitleColor: string;
  themeScreenCardBgColor: string;
  themeScreenCardShadowColor: string;
  themeScreenToggleContainerColor: string;
  themeScreenToggleTextColor: string;

  // CustomAlert
  customAlertCardBgColor: string;
  customAlertBorderColor: string;
  customAlertTitleTextColor: string;
  customAlertCancelColor: string;
  customAlertConfirmColor: string;
  customAlertOkColor: string;
  customAlertSendPrintColor: string;
  customAlertButtonTextColor: string;

  // IconSet
  iconSetSignInAndSignUpScreenIconsColor: string;
  iconSetThemeScreenIconsColor: string;
  iconSetAccountScreenResetColor: string;
  iconSetAccountScreenEditColor: string;
  iconSetAccountScreenImagePickerColor: string;
  iconSetAccountScreenDeleteColor: string;
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