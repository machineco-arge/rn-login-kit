import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {LinearGradient} from 'react-native-gradients';
import {ScreenProps} from '../types';
import {SocialLogin} from '../components/SocialLogin';
import {useSocialAuth} from '../hooks/useSocialAuth';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import {LoadingIndicator} from '../components/LoadingIndicator';
import { createLoginScreenStyles } from '../utils/styles';
import { OrComponent } from '../components/OrComponent';
import { usePrivacyCheckSocial } from '../hooks/usePrivacyCheckSocial';
import { CustomAlert } from '../components/CustomAlert';

export const LoginScreen: React.FC<ScreenProps> = ({
  config,
  showSocialLogin = true,
  showEmailLogin = true,
  GoogleIcon,
  AppleIcon,
}) => {
  const {t} = useLoginKitTranslation('login');

  // Use centralized social auth hook
  const { isSocialLoginLoading, handleSocialLogin } = useSocialAuth({config});

  const { visiblePrivacyAlert, setVisiblePrivacyAlert, handleVisiblePrivacyAlert, handleAcceptAndContinue, handleInspect } = usePrivacyCheckSocial({
      isPrivacyRequired: config.privacy.required,
      handleSocialLogin,
      pressPrivacyPolicy: config.privacy.pressPrivacyPolicy,
    });

  const styles = createLoginScreenStyles(config.theme);


  if (isSocialLoginLoading) {
    return <LoadingIndicator theme={config.theme} />;
  }

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          angle={45}
          colorList={config.theme.colors.gradient.map((color, index) => ({
            color,
            offset: `${
              (index / (config.theme.colors.gradient.length - 1)) * 100
            }%`,
            opacity: '1',
          }))}
        />
      </View>

      <View style={styles.contentContainer}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <FastImage
              source={config.logo.source as any}
              style={[
                styles.logoImage,
                config.logo.logoWidth &&
                  config.logo.logoHeight &&
                  ({
                    width: config.logo.logoWidth,
                    height: config.logo.logoHeight,
                  } as any),
              ]}
              resizeMode="contain"
            />
          </View>
          {config.logo.text && (
            <Text style={styles.logoText}>{config.logo.text}</Text>
          )}
          {config.logo.logoTextImage && (
            <FastImage
                source={config.logo.logoTextImage as any}
                style={[
                  styles.logoImage,
                  { width: config.logo.logoTextImageWidth, height: config.logo.logoTextImageHeight },
                ]}
                resizeMode="contain"
              />
          )}
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          {showEmailLogin && (
            <View style={styles.emailLoginSection}>
              {/* Register Button */}
              {config.emailAuth.enabledRegister && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => config.navigation.onRegisterPress?.()}>
                    <Text style={styles.primaryButtonText}>
                      {t('userRegister')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* OR Text */}
              {config.emailAuth.enabledRegister && (
                <Text style={styles.orText}>{t('userSignInOr')}</Text>
              )}

              {/* Login Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => config.navigation.onSignInPress?.()}>
                  <Text style={styles.primaryButtonText}>
                    {t('userSignInLogin')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* OR Text */}
          {!config.emailAuth.enabledRegister && (
           <OrComponent theme={config.theme} text={t('userSignInOr')} />
          )}

          {/* Social Login Buttons */}
          {showSocialLogin && (
            <View style={styles.socialContainer}>
              <SocialLogin
                theme={config.theme}
                socialConfig={config.socialAuth}
                loading={isSocialLoginLoading}
                onGooglePress={() => handleVisiblePrivacyAlert('google')}
                onApplePress={() => handleVisiblePrivacyAlert('apple')}
                GoogleIcon={GoogleIcon}
                AppleIcon={AppleIcon}
                googleText={t('socialLoginWithGoogle')}
                appleText={t('socialLoginWithApple')}
              />
            </View>
          )}
        </View>
      </View>

     {/* Privacy Section */}
      {config.privacy.required && (
        <CustomAlert
          config={config}
          visible={visiblePrivacyAlert}
          title={t("info")}
          message={t('PrivacyPolicy')}
          isFromPrivacy={true}
          onClose={() => setVisiblePrivacyAlert(false)}
          onOK={handleAcceptAndContinue}
          okText={t("confirm")}
          onInspect={handleInspect}
          inspectText={t("inspect")}
             />
           )}
    </View>
  );
};
