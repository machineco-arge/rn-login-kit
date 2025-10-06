import {
  StyleSheet,
  Dimensions,
  ViewStyle,
  Platform,
  TextStyle,
} from "react-native";
import { LoginKitTheme } from "../types";
import { ImageStyle } from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

export const createLoginScreenStyles = (theme: LoginKitTheme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,

    gradientContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as ViewStyle,

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    } as ViewStyle,

    contentContainer: {
      flex: 1,
      paddingHorizontal: width * 0.05,
      justifyContent: "space-between",
    } as ViewStyle,

    logoSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,

    logoContainer: {
      width: width * 0.5,
      height: height * 0.22,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
    } as ViewStyle,

    logoImage: {
      width: "100%",
      height: "100%",
    } as ImageStyle,

    logoText: {
      fontFamily: theme.fonts.primarySemiBold,
      fontSize: Math.min(width * 0.12, 44),
      textAlign: "center",
      marginTop: height * 0.001,
      color: theme.colors.loginScreensLogoTextColor,
    } as TextStyle,

    buttonsSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: height * 0.05,
    } as ViewStyle,

    emailLoginSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    } as ViewStyle,

    buttonContainer: {
      width: "100%",
      paddingHorizontal: width * 0.05,
    } as ViewStyle,

    primaryButton: {
      backgroundColor: theme.colors.loginScreensButtonsColor,
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.15,
      borderRadius: theme.borderRadius,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: height * 0.02,
    } as ViewStyle,

    primaryButtonText: {
      color: theme.colors.loginScreensButtonTextColor,
      fontSize: 18,
      fontFamily: theme.fonts.primarySemiBold,
    } as TextStyle,

    socialContainer: {
      width: "100%",
      flex: 1,
      justifyContent: "center",
      marginTop: Platform.OS === "ios" ? height * 0.05 : height * 0.01 - 50,
    } as ViewStyle,

    orText: {
      fontFamily: theme.fonts.primaryRegular,
      fontSize: Math.min(width * 0.045, 18),
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: height * 0.015,
    } as TextStyle,

    privacySection: {
      marginBottom: height * 0.003,
      marginLeft: width * 0.03,
      alignItems: "center",
    } as ViewStyle,
  };
};

export const createSignInScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    } as ViewStyle,

    gradientContainer: {
      position: "absolute",
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
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.loginScreensTitleColor,
      fontSize: Math.min(width * 0.08, 32),
      marginTop: 16,
    },

    subtitle: {
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.loginScreensSubTitleColor,
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
      backgroundColor: theme.colors.loginScreensButtonsColor,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      marginBottom: 24,
      borderRadius: theme.borderRadius,
      marginTop: 8,
    } as ViewStyle,

    loginButtonText: {
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.loginScreensButtonTextColor,
      fontSize: 18,
      paddingLeft: 8,
    },

    socialSection: {
      marginBottom: Platform.OS === "ios" ? 0 : height * 0.06,
      marginTop: Platform.OS === "ios" ? height * 0.04 : height * 0.08,
    } as ViewStyle,

    privacySection: {
      marginBottom: height * 0.003,
      marginLeft: width * 0.03,
      alignItems: "center",
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
      position: "absolute",
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
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.loginScreensTitleColor,
      fontSize: Math.min(width * 0.08, 32),
      fontWeight: "600",
    },

    subtitle: {
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.loginScreensSubTitleColor,
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
      backgroundColor: theme.colors.loginScreensButtonsColor,
      paddingVertical: 16,
      borderRadius: theme.borderRadius,
      marginTop: height * 0.04,
    } as ViewStyle,

    registerButtonText: {
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.loginScreensButtonTextColor,
      fontSize: 16,
      textAlign: "center",
    },

    privacySection: {
      marginBottom: height * 0.03,
      marginLeft: width * 0.03,
      alignItems: "center",
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
      position: "absolute",
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
      position: "relative",
      alignItems: "center",
      marginTop: "15%",
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: theme.fonts.primaryBold,
      color: theme.colors.accountScreenHeaderTitleColor,
    },
    editProfilePhotoHeaderContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    editProfilePhotoHeaderTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.accountScreenHeaderEditPhotoTitleColor,
      textAlign: "center",
    },
    profileSection: {
      alignItems: "center",
      marginBottom: 40,
      backgroundColor: theme.colors.accountScreenEditPhotoCardBgColor,
      borderRadius: 20,
      padding: 20,
      shadowColor: theme.colors.textShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileImageContainer: {
      position: "relative",
      marginBottom: 20,
    },
    profileImage: {
      width: 180,
      height: 180,
      borderRadius: 100,
      borderWidth: 3,
      borderColor:
        theme.colors.accountScreenPhotoCropperPreviewContainerBorderColor,
    },
    defaultAvatarContainer: {
      width: 180,
      height: 180,
      borderRadius: 100,
      backgroundColor: theme.colors.accountScreenAvatarPhotoCardBgColor,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor:
        theme.colors.accountScreenPhotoCropperPreviewContainerBorderColor,
    },
    defaultAvatarText: {
      fontSize: 40,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.accountScreenAvatarPhotoCardTextColor,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 100,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 15,
      marginTop: 15,
    },
    actionButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.accountScreenEditPhotoActionButtonsBgColor,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.accountScreenEditPhotoActionButtonsBorderColor,
    },
    infoSection: {
      backgroundColor: theme.colors.accountScreenInfoSectionBgColor,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.colors.textShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.accountScreenInfoSectionBorderColor,
    },
    lastInfoRow: {
      borderBottomWidth: 0,
    },
    infoLabel: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.accountScreenInfoSectionLabelTextColor,
      flex: 2,
      maxWidth: 150,
    },
    infoValue: {
      fontSize: 16,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.accountScreenInfoSectionValueTextColor,
      flex: 2,
      textAlign: "right",
    },
    editableInfoValue: {
      color: theme.colors.accountScreenInfoSectionLabelTextColor,
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 15,
      width: "100%",
    },
    actionButtonWithLabel: {
      alignItems: "center",
      opacity: 1,
    },
    actionButtonDisabled: {
      opacity: 0.5,
    },
    actionButtonLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.accountScreenInfoSectionLabelTextColor,
      marginTop: 5,
      textAlign: "center",
      width: 80,
    },
    profileSettingsLogoutButtonText: {
      fontSize: 17,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.accountScreenLogoutButtonColor,
    },
  });
};

export const createStyleProfilePhotoCropper = (theme: LoginKitTheme) => {
  const CROP_SIZE = width * 0.8;

  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.colors.accountScreenPhotoCropperBgColor,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      width: width * 0.9,
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.accountScreenPhotoCropperTitleColor,
      marginBottom: 20,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.accountScreenPhotoCropperTitleColor,
      marginBottom: 20,
      textAlign: "center",
    },
    previewContainer: {
      width: CROP_SIZE * 0.6,
      height: CROP_SIZE * 0.6,
      borderRadius: (CROP_SIZE * 0.6) / 2,
      overflow: "hidden",
      marginBottom: 20,
      borderWidth: 3,
      borderColor:
        theme.colors.accountScreenPhotoCropperPreviewContainerBorderColor,
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 15,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.accountScreenPhotoCropperButtonBorderColor,
      minWidth: 100,
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: theme.colors.accountScreenPhotoCropperOkButtonColor,
    },
    secondaryButton: {
      backgroundColor: theme.colors.accountScreenPhotoCropperCancelButtonColor,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.accountScreenPhotoCropperButtonTextColor,
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
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.colors.accountScreenEditNameModalBgColor,
      borderRadius: 20,
      padding: 20,
      margin: 20,
      minWidth: 300,
      shadowColor: "#000",
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
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.accountScreenEditNameModalTitleColor,
      textAlign: "center",
      marginBottom: 20,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.accountScreenEditNameModalBorderColor,
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.accountScreenEditNameModalTextInputColor,
      backgroundColor: theme.colors.accountScreenEditNameModalTextInputBgColor,
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: theme.colors.accountScreenEditNameModalOkButtonColor,
      borderWidth: 1,
      borderColor: theme.colors.accountScreenEditNameModalBorderColor,
    },
    secondaryButton: {
      backgroundColor: theme.colors.accountScreenEditNameModalCancelButtonColor,
      borderWidth: 1,
      borderColor: theme.colors.accountScreenEditNameModalBorderColor,
    },
    disabledButton: {
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.accountScreenEditNameModalButtonTextColor,
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
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerContainer: {
      alignItems: "center",
      paddingTop: height * 0.1,
      paddingBottom: height * 0.03,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: Math.min(width * 0.07, 28),
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.languageScreenHeaderTitleColor,
      textAlign: "center",
      marginBottom: 8,
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
      backgroundColor: theme.colors.languageScreenItemCardBgColor,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "transparent",
      shadowColor: theme.colors.textShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    disabledItem: {
      opacity: 0.5,
    },
    selectedLanguageItem: {
      borderColor: theme.colors.languageScreenSelectedLanguageItemBorderColor,
      backgroundColor: theme.colors.languageScreenSelectedLanguageItemBgColor,
    },
    currentLanguageItem: {
      borderColor: theme.colors.languageScreenCurrentLanguageItemBorderColor,
      backgroundColor: theme.colors.languageScreenCurrentLanguageItemBgColor,
    },
    languageContent: {
      flexDirection: "row",
      alignItems: "center",
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
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.languageScreenAllLanguagesTextColor,
      marginBottom: 4,
    },
    languageEnglishName: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.languageScreenEnglishVersionOfAllLanguagesTextColor,
    },
    selectedLanguageText: {
      color: theme.colors.languageScreenSelectedLanguageTextColor,
    },
    selectedLanguageTextSecondary: {
      color: theme.colors.languageScreenEnglishVersionOfAllLanguagesTextColor,
      opacity: 0.7,
    },
    currentLanguageText: {
      color: theme.colors.languageScreenCurrentLanguageColor,
    },
    currentIndicator: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.languageScreenCurrentLanguageColor,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },
    currentIndicatorText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    selectedIndicator: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.languageScreenCurrentLanguageItemBgColor,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },
    selectedIndicatorText: {
      color: theme.colors.languageScreenCurrentLanguageColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    actionContainer: {
      paddingHorizontal: 20,
      paddingBottom: height * 0.05,
      paddingTop: 20,
    },
    applyButton: {
      backgroundColor: theme.colors.languageScreenApplyButtonColor,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
      shadowColor: theme.colors.textShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    disabledButton: {
      opacity: 0.6,
    },
    applyButtonText: {
      color: theme.colors.languageScreenApplyButtonTextColor,
      fontSize: 18,
      fontFamily: theme.fonts.primarySemiBold,
    },
    // Progress tracking styles
    progressContainer: {
      backgroundColor: theme.colors.languageScreenItemCardBgColor,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.textShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.languageScreenCurrentLanguageItemBorderColor,
    },
    progressHeader: {
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.languageScreenProgressTitle,
      textAlign: "center",
      marginBottom: 4,
    },
    progressSubtitle: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.languageScreenProgressSubTitle,
      textAlign: "center",
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.colors.languageScreenProgressBarContainer,
      borderRadius: 4,
      marginBottom: 12,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.languageScreenProgressBarFill,
      borderRadius: 4,
      minWidth: 4,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    loadingText: {
      color: theme.colors.languageScreenProgressBarContainer,
      fontSize: 14,
      fontFamily: theme.fonts.primaryRegular,
    },
  });
};

export const createDarkLightModeScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    gradientContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    header: {
      marginBottom: 30,
      alignItems: "center",
    },
    headerText: {
      fontSize: 28,
      letterSpacing: 1,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.themeScreenHeaderTitleColor,
    },
    subHeaderText: {
      fontSize: 16,
      marginTop: 5,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.themeScreenSubHeaderTitleColor,
    },
    card: {
      width: width * 0.8,
      padding: 20,
      borderRadius: 20,
      alignItems: "center",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
      backgroundColor: theme.colors.themeScreenCardBgColor,
      shadowColor: theme.colors.themeScreenCardShadowColor,
    },
    iconContainer: {
      marginBottom: 20,
    },
    toggleContainer: {
      width: 200,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      padding: 5,
      backgroundColor: theme.colors.themeScreenToggleContainerColor,
    },
    toggleCircle: {
      width: 100,
      height: 50,
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: theme.colors.iconSetThemeScreenIconsColor,
    },
    toggleText: {
      marginTop: 20,
      fontSize: 18,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.themeScreenToggleTextColor,
    },
  });
};

export const createCustomAlertStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    alertContainer: {
      width: width * 0.85,
      backgroundColor: theme.colors.customAlertCardBgColor,
      borderRadius: 15,
      overflow: "hidden",
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
      borderBottomColor: theme.colors.customAlertBorderColor,
    },
    titleText: {
      fontSize: 18,
      color: theme.colors.customAlertTitleTextColor,
      textAlign: "center",
      fontFamily: theme.fonts.primarySemiBold,
    },
    messageContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.customAlertTitleTextColor,
      textAlign: "center",
      lineHeight: 22,
      fontFamily: theme.fonts.primaryMedium,
    },
    buttonContainer: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: theme.colors.customAlertBorderColor,
    },
    button: {
      flex: 1,
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButton: {
      backgroundColor: theme.colors.customAlertCancelColor,
    },
    confirmButton: {
      backgroundColor: theme.colors.customAlertConfirmColor,
    },
    okButton: {
      backgroundColor: theme.colors.customAlertOkColor,
    },
    sendToPrintButton: {
      backgroundColor: theme.colors.customAlertSendPrintColor,
    },
    buttonText: {
      fontSize: 16,
      color: theme.colors.customAlertButtonTextColor,
      fontFamily: theme.fonts.primarySemiBold,
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
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerContainer: {
      paddingTop: 100,
      paddingBottom: 20,
      alignItems: "center",
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.faqsScreeenHeaderTitleColor,
      textAlign: "center",
    },
    scrollViewContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    sectionContainer: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.faqsScreeenSectionTitle,
      marginLeft: 12,
    },
    accordionItem: {
      backgroundColor: theme.colors.faqsScreeenAccordionBgColor,
      borderRadius: 12,
      marginBottom: 12,
      elevation: 3,
      shadowColor: theme.colors.faqsScreeenAccordionShadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    questionContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    questionText: {
      flex: 1,
      fontSize: 16,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.faqsScreeenQuestionTextColor,
    },
    toggleIcon: {
      color: theme.colors.faqsScreeenTooggleIconColor,
      marginLeft: 12,
      transform: [{ rotate: "0deg" }],
    },
    toggleIconOpen: {
      transform: [{ rotate: "180deg" }],
    },
    answerContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.faqsScreeenAccordionBorderColor,
    },
    answerText: {
      fontSize: 15,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.faqsScreeenAnswerTextColor,
      lineHeight: 22,
      marginTop: 8,
    },
  });
};

export const createStyleProfileSettings = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    gradientContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    profileSettingsMainContainer: {
      flex: 1,
    },
    profileSettingsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    profileSettingsHeaderContainer: {
      top: "5%",
      paddingTop: 20,
      paddingBottom: 20,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor:
        theme.colors.profileSettingsHeaderContainerBottomBorderColor,
    },
    profileSettingsHeaderTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.profileSettingsHeaderTitleColor,
    },
    profileSettingsScrollView: {
      flex: 1,
      top: "5%",
    },
    profileSettingsProfileSection: {
      alignItems: "center",
      paddingVertical: 0,
      paddingHorizontal: 16,
    },
    profileSettingsProfilePhotoContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: "hidden",
      marginBottom: 16,
      marginTop: 16,
      backgroundColor: theme.colors.profileSettingsProfilePhotoBgColor,
    },
    profileSettingsProfilePhoto: {
      width: "100%",
      height: "100%",
    },
    profileSettingsIconContainer: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      transform: [{ scale: 2.5 }],
    },
    profileSettingsUserName: {
      fontSize: 24,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.profileSettingsUserNameColor,
      marginBottom: 8,
    },
    profileSettingsBio: {
      fontSize: 16,
      fontFamily: theme.fonts.primaryLight,
      color: theme.colors.profileSettingsBioColor,
      textAlign: "center",
      marginBottom: 8,
    },
    profileSettingsStats: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.profileSettingsStatsColor,
    },
    profileSettingsMenuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.profileSettingsMenuItemBottomBorderColor,
    },
    profileSettingsMenuItemText: {
      fontSize: 17,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.profileSettingsMenuItemTextColor,
    },
    profileSettingsChevron: {
      fontSize: 24,
      fontFamily: theme.fonts.primaryBold,
      color: theme.colors.profileSettingsChevronColor,
    },
  });
};

export const createTermsPolicyStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    scrollView: {
      padding: 20,
      paddingBottom: 60,
    },
    headerContainer: {
      paddingTop: height * 0.1,
      paddingBottom: height * 0.03,
      alignItems: "center",
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 26,
      textAlign: "center",
      fontFamily: theme.fonts.primaryExtraBold,
      color: theme.colors.text,
    },
    heading: {
      fontSize: 20,
      fontFamily: theme.fonts.primaryBold,
      marginTop: 20,
      marginBottom: 10,
      color: theme.colors.faqsScreeenAnswerTextColor,
    },
    paragraph: {
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 35,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.text,
    },
  });
};
