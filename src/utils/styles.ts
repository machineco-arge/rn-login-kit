import {StyleSheet, Dimensions, ViewStyle, Platform, TextStyle} from 'react-native';
import {LoginKitTheme} from '../types';
import { ImageStyle } from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

export const createLoginScreenStyles = (theme: LoginKitTheme) => {

  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,

    gradientContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as ViewStyle,

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    } as ViewStyle,

    contentContainer: {
      flex: 1,
      paddingHorizontal: width * 0.05,
      justifyContent: 'space-between',
    } as ViewStyle,

    logoSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,

    logoContainer: {
      width: width * 0.5,
      height: height * 0.22,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,

    logoImage: {
      width: '100%',
      height: '100%',
    } as ImageStyle,

    logoText: {
      fontFamily: theme.fonts.primary,
      fontSize: Math.min(width * 0.12, 44),
      textAlign: 'center',
      marginTop: height * 0.001,
      color: theme.colors.text,
    } as TextStyle,

    buttonsSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: height * 0.05,
    } as ViewStyle,

    emailLoginSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    } as ViewStyle,

    buttonContainer: {
      width: '100%',
      paddingHorizontal: width * 0.05,
    } as ViewStyle,

    primaryButton: {
      backgroundColor: theme.colors.buttonPrimary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: theme.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    } as ViewStyle,

    disabledButton: {
      opacity: 0.5,
    } as ViewStyle,

    primaryButtonText: {
      color: theme.colors.buttonText,
      fontSize: 18,
      fontFamily: theme.fonts.primary,
      fontWeight: '600',
    } as TextStyle,

    socialContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      marginTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.01 - 50,
    } as ViewStyle,

    orText: {
      fontFamily: theme.fonts.primary,
      fontSize: Math.min(width * 0.045, 18),
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: height * 0.015,
    } as TextStyle,
  };
};

export const createSignInScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,

    gradientContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as ViewStyle,

    scrollContainer: {
      flex: 1,
      paddingHorizontal: width * 0.06,
      paddingVertical: height * 0.02,
      marginTop: height * 0.05,
    } as ViewStyle,

    headerSection: {
      marginTop: 0,
      marginBottom: 0,
    } as ViewStyle,

    title: {
      fontFamily: theme.fonts.primary,
      color: theme.colors.text,
      fontSize: Math.min(width * 0.08, 32),
      fontWeight: '600',
      marginTop: 16,
    },

    subtitle: {
      fontFamily: theme.fonts.primary,
      color: theme.colors.textSecondary,
      fontSize: 16,
      marginTop: 16,
    },

    formSection: {
      marginTop: height * 0.06,
    } as ViewStyle,

    inputContainer: {
      marginBottom: 8,
    } as ViewStyle,

    passwordInputContainer: {
      marginBottom: height * 0.04,
    } as ViewStyle,

    loginButton: {
      backgroundColor: theme.colors.buttonPrimary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      marginBottom: 24,
      borderRadius: theme.borderRadius,
      marginTop: 8,
    } as ViewStyle,

    disabledButton: {
      opacity: 0.5,
    } as ViewStyle,

    loginButtonText: {
      fontFamily: theme.fonts.primary,
      color: theme.colors.buttonText,
      fontSize: 18,
      fontWeight: '600',
      paddingLeft: 8,
    },

    socialSection: {
      marginBottom: Platform.OS === 'ios' ? 0 : height * 0.06,
      marginTop: Platform.OS === 'ios' ? height * 0.04 : height * 0.08,
    } as ViewStyle,

    privacySection: {
      marginBottom: height * 0.003,
      marginLeft: width * 0.03,
      alignItems: 'center',
    } as ViewStyle,
  });
};

export const createRegisterScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,

    gradientContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as ViewStyle,

    scrollContainer: {
      flex: 1,
      paddingHorizontal: width * 0.06,
      paddingVertical: height * 0.02,
      marginTop: height * 0.05,
    } as ViewStyle,

    headerSection: {
      marginTop: height * 0.05,
      marginBottom: height * 0.02,
    } as ViewStyle,

    title: {
      fontFamily: theme.fonts.primary,
      color: theme.colors.text,
      fontSize: Math.min(width * 0.08, 32),
      fontWeight: '600',
    },

    subtitle: {
      fontFamily: theme.fonts.primary,
      color: theme.colors.textSecondary,
      fontSize: 16,
      marginTop: 8,
    },

    formSection: {
      marginTop: height * 0.02,
    } as ViewStyle,

    inputContainer: {
      marginBottom: 8,
    } as ViewStyle,

    registerButton: {
      backgroundColor: theme.colors.buttonPrimary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius,
      marginTop: height * 0.04,
    } as ViewStyle,

    disabledButton: {
      opacity: 0.5,
    } as ViewStyle,

    registerButtonText: {
      fontFamily: theme.fonts.primary,
      color: theme.colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },

    privacySection: {
      marginBottom: height * 0.03,
      marginLeft: width * 0.03,
      alignItems: 'center',
    } as ViewStyle,
  });
};

export const createAccountScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 30,
    },
    headerContainer: {
      position: 'relative',
      alignItems: 'center',
      marginTop: '15%',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    editProfilePhotoHeaderContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    editProfilePhotoHeaderTitle: {
      fontSize: 16,
      color: theme.colors.navbarUnselected,
      textAlign: 'center',
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 40,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 20,
      padding: 20,
      shadowColor: theme.colors.textShadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: 20,
    },
    profileImage: {
      width: 180,
      height: 180,
      borderRadius: 100,
      borderWidth: 3,
      borderColor: theme.colors.navbarSelected,
    },
    defaultAvatarContainer: {
      width: 180,
      height: 180,
      borderRadius: 100,
      backgroundColor: theme.colors.gray,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.colors.navbarSelected,
    },
    defaultAvatarText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 15,
      marginTop: 15,
    },
    actionButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.navbarUnselected,
    },
    actionButtonActive: {
      backgroundColor: theme.colors.navbarSelected,
      borderColor: theme.colors.navbarSelected,
    },
    infoSection: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.colors.textShadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray,
    },
    lastInfoRow: {
      borderBottomWidth: 0,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 2,
      maxWidth: 150,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.navbarUnselected,
      flex: 2,
      textAlign: 'right',
    },
    editableInfoValue: {
      color: theme.colors.text,
    },
    editButton: {
      marginLeft: 10,
      padding: 5,
    },
    editIcon: {
      width: 20,
      height: 20,
    },
    // Action buttons grid layout
    actionButtonsGrid: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 15,
      width: '100%',
    },
    actionButtonWithLabel: {
      alignItems: 'center',
      opacity: 1,
    },
    actionButtonDisabled: {
      opacity: 0.5,
    },
    actionButtonLabel: {
      fontSize: 12,
      color: theme.colors.text,
      marginTop: 5,
      textAlign: 'center',
      width: 80,
    },
    profileSettingsLogoutButtonText: {
      fontSize: 17,
      color: theme.colors.reddish,
      fontWeight: '400',
    },
  });
};

export const createStyleProfilePhotoCropper = (theme: LoginKitTheme) => {
  const CROP_SIZE = width * 0.8;

  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      width: width * 0.9,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    previewContainer: {
      width: CROP_SIZE * 0.6,
      height: CROP_SIZE * 0.6,
      borderRadius: (CROP_SIZE * 0.6) / 2,
      overflow: 'hidden',
      marginBottom: 20,
      borderWidth: 3,
      borderColor: theme.colors.navbarSelected,
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 15,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.text,
      minWidth: 100,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: theme.colors.navbarSelected,
    },
    secondaryButton: {
      backgroundColor: theme.colors.navbarUnselected,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    disabledButton: {
      opacity: 0.6,
    },
  });
};

export const createStyleEditNameModal = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 20,
      padding: 20,
      margin: 20,
      minWidth: 300,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.navbarUnselected,
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: theme.colors.navbarSelected,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.navbarUnselected,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    disabledButton: {
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
  });
}; 

export const createLanguageScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerContainer: {
      alignItems: 'center',
      paddingTop: height * 0.1,
      paddingBottom: height * 0.03,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: Math.min(width * 0.07, 28),
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.colors.navbarUnselected,
      textAlign: 'center',
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    languageList: {
      paddingBottom: 20,
      paddingTop: 5,
    },
    languageItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: theme.colors.textShadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    disabledItem: {
      opacity: 0.5,
    },
    selectedLanguageItem: {
      borderColor: theme.colors.navbarUnselected,
      backgroundColor: theme.colors.primary,
    },
    currentLanguageItem: {
      borderColor: theme.colors.navbarSelected,
      backgroundColor: theme.colors.secondary,
    },
    languageContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    languageFlag: {
      fontSize: 28,
      marginRight: 15,
    },
    languageTextContainer: {
      flex: 1,
    },
    languageName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    languageEnglishName: {
      fontSize: 14,
      color: theme.colors.navbarUnselected,
    },
    selectedLanguageText: {
      color: theme.colors.background,
    },
    selectedLanguageTextSecondary: {
      color: theme.colors.navbarUnselected,
      opacity: 0.7,
    },
    currentLanguageText: {
      color: theme.colors.navbarSelected,
    },
    currentIndicator: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.navbarSelected,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    currentIndicatorText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    selectedIndicator: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    selectedIndicatorText: {
      color: theme.colors.navbarSelected,
      fontSize: 16,
      fontWeight: 'bold',
    },
    actionContainer: {
      paddingHorizontal: 20,
      paddingBottom: height * 0.05,
      paddingTop: 20,
    },
    applyButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      shadowColor: theme.colors.textShadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    disabledButton: {
      opacity: 0.6,
    },
    applyButtonText: {
      color: theme.colors.background,
      fontSize: 18,
      fontWeight: '600',
    },
    // Progress tracking styles
    progressContainer: {
      backgroundColor: theme.colors.cardBackground,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.textShadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.navbarSelected,
    },
    progressHeader: {
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.navbarSelected,
      textAlign: 'center',
      marginBottom: 4,
    },
    progressSubtitle: {
      fontSize: 14,
      color: theme.colors.navbarUnselected,
      textAlign: 'center',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      marginBottom: 12,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.colors.navbarSelected,
      borderRadius: 4,
      minWidth: 4,
    },
    currentTranslationText: {
      fontSize: 12,
      color: theme.colors.navbarUnselected,
      textAlign: 'center',
      fontStyle: 'italic',
      marginBottom: 8,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    loadingText: {
      color: theme.colors.background,
      fontSize: 14,
      fontWeight: '500',
    },
  });
}

export const createDarkLightModeScreenStyles = (theme: LoginKitTheme) => {

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    gradientContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    header: {
      marginBottom: 30,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 28,
      fontWeight: 'bold',
      letterSpacing: 1,
      color: theme.colors.text
    },
    subHeaderText: {
      fontSize: 16,
      marginTop: 5,
      opacity: 0.7,
      color: theme.colors.text
    },
    card: {
      width: width * 0.8,
      padding: 20,
      borderRadius: 20,
      alignItems: 'center',
      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
      backgroundColor: theme.colors.cardBackground,
      shadowColor: theme.colors.textShadow
    },
    iconContainer: {
      marginBottom: 20,
    },
    toggleContainer: {
      width: 200,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      padding: 5,
      backgroundColor: theme.colors.secondary
    },
    toggleCircle: {
      width: 100,
      height: 50,
      borderRadius: 25,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: theme.colors.themeToggleCircle,
    },
    toggleText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text
    },
  });
};

export const createCustomAlertStyles = (theme: LoginKitTheme) => {

  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertContainer: {
      width: width * 0.85,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: theme.colors.textShadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    titleContainer: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    titleText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: theme.fonts.primary,
    },
    messageContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 22,
      fontFamily: theme.fonts.primary,
    },
    buttonContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    button: {
      flex: 1,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.alertCancelButtonColor,
    },
    confirmButton: {
      backgroundColor: theme.colors.alertConfirmButtonColor,
    },
    okButton: {
      backgroundColor: theme.colors.alertOkButtonColor,
    },
    sendToPrintButton: {
      backgroundColor: theme.colors.navbarSelected,
    },
    buttonText: {
      fontSize: 16,
      color: 'white',
      fontWeight: '600',
      fontFamily: theme.fonts.primary,
    },
  });
};

export const createHelpsFAQsScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerContainer: {
      paddingTop: 100,
      paddingBottom: 20,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    scrollViewContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    sectionContainer: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginLeft: 12,
    },
    accordionItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      marginBottom: 12,
      elevation: 3,
      shadowColor: theme.colors.textShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    questionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    questionText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    toggleIcon: {
      color: theme.colors.navbarUnselected,
      marginLeft: 12,
      transform: [{ rotate: '0deg' }],
    },
    toggleIconOpen: {
        transform: [{ rotate: '180deg' }],
    },
    answerContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    answerText: {
      fontSize: 15,
      color: theme.colors.navbarSelected,
      lineHeight: 22,
      marginTop: 8,
    },
  });
};