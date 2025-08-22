// Main Screens
export {LoginScreen} from './screens/LoginScreen';
export {RegisterScreen} from './screens/RegisterScreen';
export {AccountScreen} from './screens/AccountScreen';
export {LanguageScreen} from './screens/LanguageScreen';
export {DarkLightModeScreen} from './screens/DarkLightModeScreen';
export {SignInScreen} from './screens/SignInScreen';
export {HelpsFAQsScreen} from './screens/HelpsFAQsScreen';

// Main Components
export {SocialLogin} from './components/SocialLogin';
export {PrivacyPolicy} from './components/PrivacyPolicy';
export {TextInputsLogin} from './components/TextInputsLogin';
export {LoadingIndicator} from './components/LoadingIndicator';
export {HaveAnAccount} from './components/HaveAnAccount';
export {OrComponent} from './components/OrComponent';
export {ProfilePhotoCropper} from './components/ProfilePhotoCropper';
export {EditNameModal} from './components/EditNameModal';
export {IconSet} from './components/IconSet';
export {CustomAlert} from './components/CustomAlert';

// Configuration and I18n
export {initializeI18nWithCdn, loginKitI18n} from './config/i18n';

// Services
export {SocialAuthService} from './services/SocialAuthService';
export {EmailAuthService} from './services/EmailAuthService';
export {UserLogoutService} from './services/UserLogoutService';
export {
  TranslationService,
  translationService,
} from './services/TranslationService';

// Managers
export {userManager} from './managers/UserManager';
export {userNameManager} from './managers/UserNameManager';
export {profilePhotoManager} from './managers/ProfilePhotoManager';
export {uriManager} from './managers/UriManager';

// Hooks
export {useSignIn} from './hooks/useSignIn';
export {useRegister} from './hooks/useRegister';
export {useSocialAuth} from './hooks/useSocialAuth';
export {useAccountSettings} from './hooks/useAccountSettings';
export {useProfilePhotoCropper} from './hooks/useProfilePhotoCropper';
export {useCurrentUser} from './hooks/useCurrentUser';
export {useLoginKitTranslation} from './hooks/useLoginKitTranslation';
export {useAutoTranslation} from './hooks/useAutoTranslation';
export {useDarkLightMode} from './hooks/useDarkLightMode';
export {useThemeContext, ThemeProvider} from './hooks/useThemeContext';

// Types
export type {
  LoginKitConfig,
  LoginKitTheme,
  LoginKitThemeColors,
  ThemeOverrides,
  SocialAuthConfig,
  NavigationConfig,
  LogoConfig,
  PrivacyConfig,
  LocalizationConfig,
  ScreenProps,
  IUserInfo,
  AppTranslationResources,
  TranslationConfig,
} from './types';
export type { Theme, ThemeContextType } from './hooks/useThemeContext';

// Utility functions
export {
  createDefaultTheme,
  createLightTheme,
  createDarkTheme,
} from './utils/themes';
export {createDefaultConfig} from './utils/config';
export {
  createLoginScreenStyles,
  createSignInScreenStyles,
  createRegisterScreenStyles,
  createAccountScreenStyles,
  createStyleProfilePhotoCropper,
  createStyleEditNameModal,
  createLanguageScreenStyles,
  createDarkLightModeScreenStyles,
  createCustomAlertStyles,
  createHelpsFAQsScreenStyles,
} from './utils/styles';
