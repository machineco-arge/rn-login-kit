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
      color: theme.colors.TERTIARY_TEXT_LIGHT,
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
      backgroundColor: theme.colors.PRIMARY_950,
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.15,
      borderRadius: theme.borderRadius,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: height * 0.02,
    } as ViewStyle,

    primaryButtonText: {
      color: theme.colors.TERTIARY_TEXT_LIGHT,
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
      backgroundColor: theme.colors.TRANSPARENT_PRIMARY,
    },
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheetContent: {
      // Used when embedded in Another BottomSheet
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: theme.colors.TRANSPARENT_PRIMARY,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 40,
    },
    headerSection: {
      marginBottom: 24,
    },
    handleBar: {
      width: 50,
      height: 5,
      backgroundColor: theme.colors.TRANSPARENT_PRIMARY,
      borderRadius: 2.5,
      alignSelf: 'center',
      marginBottom: 12,
    },
    title: {
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_950,
      fontSize: 18,
    },
    formSection: {
      marginTop: 0,
    },
    loginButton: {
      backgroundColor: theme.colors.PRIMARY_950,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      marginTop: 12,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    loginButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.TERTIARY_TEXT_LIGHT,
      fontSize: 14,
    },
    socialSection: {
      marginVertical: 12,
    },
  });
};

export const createRegisterScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.TRANSPARENT_PRIMARY,
    } as ViewStyle,

    gradientContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as ViewStyle,

    sheetContent: {
      // Used when embedded in Another BottomSheet
    },

    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    } as ViewStyle,

    headerSection: {
      marginBottom: 24,
    } as ViewStyle,

    title: {
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_950,
      fontSize: 18,
    },

    formSection: {
      marginTop: 0,
    } as ViewStyle,

    inputContainer: {
      marginBottom: 8,
    } as ViewStyle,

    registerButton: {
      backgroundColor: theme.colors.PRIMARY_950,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      marginTop: 12,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    } as ViewStyle,

    registerButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.TERTIARY_TEXT_LIGHT,
      fontSize: 14,
      textAlign: "center",
    },

    socialSection: {
      marginVertical: 12,
    } as ViewStyle,
  });
};

export const createAccountScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 0,
      paddingBottom: 30,
    },
    headerContainer: {
      position: "relative",
      marginTop: "15%",
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.PRIMARY_950,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    headerUnderline: {
      height: 1,
      backgroundColor: theme.colors.PRIMARY_300,
      marginTop: 20,
      marginHorizontal: -16, // expand beyond padding
    },
    profileSectionWrapper: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
    },
    profileSection: {
      width: '100%',
      maxWidth: 343,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileImageContainer: {
      position: "relative",
      width: 100,
      height: 100,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.PRIMARY_200,
    },
    defaultAvatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.PRIMARY_200,
      justifyContent: "center",
      alignItems: "center",
      overflow: 'hidden',
    },
    addPPIconContainer: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      zIndex: 10,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 50,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    infoSectionContainer: {
      width: '100%',
      maxWidth: 343,
      alignSelf: 'center',
    },
    sectionLabel: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 12,
      color: theme.colors.PRIMARY_500,
      marginBottom: 12,
      marginLeft: -8,
    },
    infoSection: {
      backgroundColor: 'transparent',
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      marginLeft: -8,
    },
    infoRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    infoValue: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.TERTIARY_TEXT_DARK,
      marginLeft: 12,
      flex: 1,
    },
    editButton: {
      marginLeft: 10,
      padding: 5,
    },
    deleteAccountContainer: {
      width: '100%',
      maxWidth: 343,
      alignSelf: 'center',
      marginTop: 40,
    },
    deleteAccountButton: {
      alignSelf: 'flex-start',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.PRIMARY_300,
      borderRadius: 4,
      marginLeft: -8,
    },
    deleteAccountButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 12,
      color: theme.colors.PRIMARY_950,
    },
  });
};

export const createStyleProfilePhotoCropper = (
  theme: LoginKitTheme,
  insets: { top: number; bottom: number },
  CROP_CIRCLE_SIZE: number
) =>
  StyleSheet.create({
    rootContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.95)' },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? (insets.top + 8) : (insets.top + 16),
      paddingHorizontal: 20,
      paddingBottom: 12,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fonts.primarySemiBold,
      color: '#FCFBF9',
      textAlign: 'center',
    },
    cropArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cropContainer: {
      width: CROP_CIRCLE_SIZE,
      height: CROP_CIRCLE_SIZE,
      borderRadius: CROP_CIRCLE_SIZE / 2,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor:  '#A3A3A3',
    },
    controlsContainer: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom:
        Platform.OS === 'ios'
          ? insets.bottom + 24
          : Math.max(insets.bottom, 48) + 24,
    },
    toolRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 32,
      marginBottom: 20,
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 4,
      gap: 10,
    },
    sliderTrack: { flex: 1, height: 36, justifyContent: 'center' },
    sliderTrackLine: {
      height: 3,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 1.5,
    },
    sliderFill: {
      height: 3,
      backgroundColor: '#D3D3D3',
      borderRadius: 1.5,
      position: 'absolute',
      left: 0,
      top: (36 - 3) / 2,
    },
    sliderThumb: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: '#D3D3D3',
      position: 'absolute',
      top: (36 - 22) / 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
    sliderLabel: {
      fontSize: 11,
      fontFamily: theme.fonts.primaryRegular,
      color: 'rgba(255,255,255,0.5)',
      width: 28,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 15,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.PRIMARY_950,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: '#0B0B0B',
    },
    secondaryButton: {
      backgroundColor: '#A3A3A3',
    },
    buttonText: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      color: '#FCFBF9',
    },
    disabledButton: { opacity: 0.6 },
    actionButtonWithLabel: {
      alignItems: "center",
      opacity: 1,
    },
    actionButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#0B0B0B',
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: '#D3D3D3',
    },
    actionButtonLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.primaryMedium,
      color:  '#D3D3D3',
      marginTop: 5,
      textAlign: "center",
      width: 80,
    },
  });

export const createLanguageScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    headerContainer: {
      flexDirection: 'column',
      paddingTop: '15%',
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.PRIMARY_300,
      marginBottom: 20,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.PRIMARY_950,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    selectLanguageContainer: {
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    selectedLanguageText: {
      fontSize: 16,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_800,
    },
    selectLanguageText: {
      fontSize: 12,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_500,
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    languageList: {
      paddingBottom: 20,
      paddingTop: 5,
    },
    languageItem: {
      marginBottom: 16,
    },
    disabledItem: {
      opacity: 0.5,
    },
    languageContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    languageTextContainer: {
      flex: 1,
    },
    languageName: {
      fontSize: 16,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_600,
      marginBottom: 2,
    },
    languageEnglishName: {
      fontSize: 12,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_400,
    },
    checkIconContainer: {
      marginLeft: 15,
    },
    // Progress tracking styles
    progressContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor: theme.colors.TRANSPARENT_PRIMARY,
      // marginHorizontal: 20,
      marginBottom: 20,
      // borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.textShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      width: '100%',
      height: '100%',
      borderColor: theme.colors.PRIMARY_950,
    },
    progressHeader: {
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.PRIMARY_950,
      textAlign: "center",
      marginBottom: 4,
    },
  });
};

export const createDarkLightModeScreenStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    headerContainer: {
      flexDirection: 'column',
      paddingTop: '15%',
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.PRIMARY_300,
      marginBottom: 2,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.PRIMARY_950,
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
    scrollViewContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 40,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_500,
      marginBottom: 16,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 40,
      marginBottom: 8,
    },
    listItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemIcon: {
      marginRight: 12,
    },
    itemLabel: {
      fontSize: 16,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_600
    },
    itemLabelSelected: {
      color: theme.colors.PRIMARY_800
    },
    checkIcon: {
      marginRight: 110,
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
      backgroundColor: theme.colors.SECONDARY_50,
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
      borderBottomColor: theme.colors.PRIMARY_300,
    },
    titleText: {
      fontSize: 18,
      color: theme.colors.PRIMARY_950,
      textAlign: "center",
      fontFamily: theme.fonts.primarySemiBold,
    },
    modalCloseIcon: {
      position: "absolute",
      marginLeft: "98%",
      marginTop: "3%",
    },
    messageContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.PRIMARY_950,
      textAlign: "center",
      lineHeight: 22,
      fontFamily: theme.fonts.primaryMedium,
    },
    buttonContainer: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: theme.colors.PRIMARY_300,
    },
    button: {
      flex: 1,
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButton: {
      backgroundColor: theme.colors.PRIMARY_400,
    },
    confirmButton: {
      backgroundColor: theme.colors.PRIMARY_950,
    },
    okButton: {
      backgroundColor: theme.colors.PRIMARY_950,
    },
    sendToPrintButton: {
      backgroundColor: theme.colors.PRIMARY_950,
    },
    buttonText: {
      fontSize: 16,
      color: theme.colors.TERTIARY_TEXT_LIGHT,
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
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    headerContainer: {
      flexDirection: 'column',
      paddingTop: '15%',
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.PRIMARY_300,
      marginBottom: 2,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.PRIMARY_950,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    scrollViewContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
      paddingTop: 16,
    },
    sectionContainer: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_500,
    },
    accordionItem: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.PRIMARY_300,
    },
    questionContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
    },
    questionText: {
      flex: 1,
      fontSize: 14,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_800,
    },
    toggleIcon: {
      marginLeft: 12,
    },
    answerContainer: {
      paddingBottom: 16,
    },
    answerText: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_600,
      lineHeight: 20,
    },
  });
};

export const createStyleProfileSettings = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    backgroundImage: {
      position: 'absolute',
      width: width,
      height: height,
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
      paddingTop: 64,
      paddingBottom: 0,
      paddingHorizontal: 16,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 16,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitleText: {
      fontSize: 24,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.PRIMARY_950,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    headerUnderline: {
      height: 1,
      backgroundColor: theme.colors.PRIMARY_300,
      width: Dimensions.get('window').width + 40,
      marginTop: 2,
      left: -20,
    },
    profileSettingsScrollView: {
      flex: 1,
      top: '1%',
    },
    profileSettingsProfileSection: {
      alignItems: 'center',
      paddingVertical: 0,
      paddingHorizontal: 16,
    },
    profileSettingsProfilePhotoContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: 'hidden',
      marginBottom: 16,
      marginTop: 16,
      backgroundColor: theme.colors.SECONDARY_50,
    },
    profileSettingsProfilePhoto: {
      width: '100%',
      height: '100%',
    },
    profileSettingsIconContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{scale: 2.5}],
    },
    profileSettingsUserName: {
      fontSize: 24,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_950,
      marginBottom: 8,
    },
    profileProMember: {
      fontSize: 16,
      fontFamily: theme.fonts.primarySemiBold,
      textAlign: 'center',
      marginBottom: 8,
    },
    profileSettingsBio: {
      fontSize: 16,
      fontFamily: theme.fonts.primaryLight,
      color: theme.colors.PRIMARY_300,
      textAlign: 'center',
      marginBottom: 8,
    },
    profileSettingsStats: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_300,
    },
    profileSettingsMenuContainer: {
      width: width * 0.9,
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 24,
    },
    profileSettingsMenuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.PRIMARY_300,
    },
    profileSettingsMenuItemText: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.TERTIARY_TEXT_DARK,
    },
    profileSettingsLogoutButton: {
      position: 'relative',
      marginBottom: 24,                // veya 20/32 gibi ekran alt boşluk
      alignSelf: 'center',
      width: 343,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.PRIMARY_400,
      borderRadius: 4,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
    },
    profileSettingsLogoutButtonText: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_950,
    },
    profileSettingsLogoutIcon: {
      marginLeft: 8,
    },
  });
};

export const createTermsPolicyStyles = (theme: LoginKitTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    headerContainer: {
      flexDirection: 'column',
      paddingTop: '15%',
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.PRIMARY_300,
      marginBottom: 2,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: theme.fonts.primarySemiBold,
      color: theme.colors.PRIMARY_950,
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
    scrollView: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 60,
    },
    sectionContainer: {
      marginBottom: 20,
    },
    heading: {
      fontSize: 18,
      fontFamily: theme.fonts.primaryMedium,
      marginBottom: 12,
      color: theme.colors.PRIMARY_950,
    },
    paragraph: {
      fontSize: 14,
      lineHeight: 16.8, // 120%
      marginBottom: 12,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_700,
    },
    sectionLabel: {
      fontSize: 12,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_500,
      marginTop: 8,
      marginBottom: 8,
      textTransform: 'none',
    },
  });
};

export const createCustomBottomSheetStyles = (theme: LoginKitTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    sheet: {
      backgroundColor: theme.colors.SECONDARY_50,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderTopWidth: 1,
      borderColor: theme.colors.PRIMARY_300,
    },
    handleBar: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.PRIMARY_300,
      marginTop: 8,
      marginBottom: 16,
    },
    body: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 24,
    },
    textStack: {
      gap: 8,
    },
    title: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 18,
      lineHeight: 22,
      color: theme.colors.PRIMARY_950,
    },
    message: {
      fontFamily: theme.fonts.primaryRegular,
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.PRIMARY_600,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'stretch',
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.SECONDARY_50,
      borderWidth: 1,
      borderColor: theme.colors.PRIMARY_400,
    },
    primaryButton: {
      backgroundColor: theme.colors.PRIMARY_950,
    },
    cancelButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.PRIMARY_950,
    },
    primaryButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.TERTIARY_TEXT_LIGHT,
    },
    singleButton: {
      width: '100%',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.PRIMARY_950,
    },
    singleButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.TERTIARY_TEXT_LIGHT,
    },
});

export const createTextInputModalStyles = (theme: LoginKitTheme) =>
  StyleSheet.create({
    keyboardAvoidingRoot: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    sheet: {
      backgroundColor: theme.colors.SECONDARY_50,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderTopWidth: 1,
      borderColor: theme.colors.PRIMARY_300,
    },
    handleBar: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.PRIMARY_300,
      marginTop: 8,
      marginBottom: 16,
    },
    body: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 24,
    },
    modalTitle: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 18,
      lineHeight: 22,
      color: theme.colors.PRIMARY_950,
    },
    modalMessage: {
      fontFamily: theme.fonts.primaryRegular,
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.PRIMARY_600,
    },
    inputBlock: {
      gap: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.PRIMARY_300,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontFamily: theme.fonts.primaryRegular,
      fontSize: 16,
      lineHeight: 22,
      color: theme.colors.PRIMARY_950,
      backgroundColor: theme.colors.SECONDARY_50,
    },
    characterCount: {
      fontSize: 12,
      lineHeight: 14,
      fontFamily: theme.fonts.primaryRegular,
      color: theme.colors.PRIMARY_600,
      textAlign: 'right',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'stretch',
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.SECONDARY_50,
      borderWidth: 1,
      borderColor: theme.colors.PRIMARY_400,
    },
    submitButton: {
      backgroundColor: theme.colors.PRIMARY_950,
    },
    cancelButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.PRIMARY_950,
    },
    submitButtonText: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 14,
      lineHeight: 22,
      color: theme.colors.TERTIARY_TEXT_LIGHT,
    },
});
