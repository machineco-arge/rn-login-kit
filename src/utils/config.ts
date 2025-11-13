import { LoginKitConfig, LoginKitTheme, NavigationConfig, TranslationConfig } from '../types';
import { createDefaultTheme } from './themes';

interface CreateDefaultConfigParams {
  theme?: LoginKitTheme;
  googleClientIds?: {
    webClientId: string;
    iosClientId: string;
  };
  navigation: NavigationConfig;
  logoSource: any; // ImageSourcePropType
  logoWidth?: number;
  logoHeight?: number;
  logoText?: string;
  logoTextImage?: string;
  logoTextImageWidth?: number;
  logoTextImageHeight?: number;
  enableAppleLogin: boolean;
  enableGoogleLogin: boolean;
  enableRegister: boolean;
  enableSignInCompanyName: boolean;
  enableSignInEmail: boolean;
  enableSignInUserName: boolean;
  enableRegisterUserName: boolean;
  enableRegisterEmail: boolean;
  requirePrivacyAcceptance: boolean;
  pressPrivacyPolicy?: () => void;
  translationConfig: TranslationConfig;
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
}

export const createDefaultConfig = (params: CreateDefaultConfigParams): LoginKitConfig => {
  const {
    theme = createDefaultTheme(),
    googleClientIds,
    navigation,
    logoSource,
    logoWidth,
    logoHeight,
    logoText,
    logoTextImage,
    logoTextImageWidth,
    logoTextImageHeight,
    enableAppleLogin = true,
    enableGoogleLogin = true,
    enableRegister = true,
    enableSignInCompanyName = true,
    enableSignInEmail = true,
    enableSignInUserName = true,
    enableRegisterUserName = true,
    enableRegisterEmail = true,
    requirePrivacyAcceptance = true,
    pressPrivacyPolicy,
    translationConfig,
    apiConfig,
  } = params;

  return {
    theme,
    socialAuth: {
      google: enableGoogleLogin && googleClientIds ? {
        webClientId: googleClientIds.webClientId,
        iosClientId: googleClientIds.iosClientId,
        enabled: true,
      } : undefined,
      apple: enableAppleLogin ? {
        enabled: true,
      } : undefined,
    },
    emailAuth: {
      enabledRegister: enableRegister,
      enabledSignInCompanyName: enableSignInCompanyName,
      enabledSignInEmail: enableSignInEmail,
      enabledSignInUserName: enableSignInUserName,
      enabledRegisterUserName: enableRegisterUserName,
      enabledRegisterEmail: enableRegisterEmail,
    },
    navigation,
    logo: {
      source: logoSource,
      text: logoText,
      logoWidth: logoWidth,
      logoHeight: logoHeight,
      logoTextImage: logoTextImage,
      logoTextImageWidth: logoTextImageWidth,
      logoTextImageHeight: logoTextImageHeight,
    },
    privacy: {
      required: requirePrivacyAcceptance,
      pressPrivacyPolicy: pressPrivacyPolicy || (() => {
        console.log('Privacy Policy pressed - Please implement this callback');
      }),
    },
    translationConfig,
    apiConfig,
  };
};

export const validateConfig = (config: LoginKitConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (!config.navigation?.onLoginSuccess) {
    errors.push('navigation.onLoginSuccess callback is required');
  }

  if (!config.logo?.source) {
    errors.push('logo.source is required');
  }

  // Check social auth configuration
  if (config.socialAuth.google?.enabled && !config.socialAuth.google.webClientId) {
    errors.push('Google webClientId is required when Google auth is enabled');
  }

  if (config.socialAuth.google?.enabled && !config.socialAuth.google.iosClientId) {
    errors.push('Google iosClientId is required when Google auth is enabled');
  }

  // Check if at least one auth method is enabled
  const hasGoogleAuth = config.socialAuth.google?.enabled;
  const hasAppleAuth = config.socialAuth.apple?.enabled;
  
  if (!hasGoogleAuth && !hasAppleAuth) {
    errors.push('At least one social authentication method must be enabled');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}; 