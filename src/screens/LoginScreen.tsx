import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {LinearGradient} from 'react-native-gradients';
import {ScreenProps} from '../types';
import {SocialLogin} from '../components/SocialLogin';
import {PrivacyPolicy} from '../components/PrivacyPolicy';
import {useSocialAuth} from '../hooks/useSocialAuth';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import {LoadingIndicator} from '../components/LoadingIndicator';
import { createLoginScreenStyles } from '../utils/styles';
import { OrComponent } from '../components/OrComponent';
import { usePrivacyCheck } from '../hooks/usePrivacyCheck';

export const LoginScreen: React.FC<ScreenProps> = ({
  config,
  showSocialLogin = true,
  showEmailLogin = true,
  GoogleIcon,
  AppleIcon,
}) => {
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(
    !config.privacy.required,
  );
  const {t} = useLoginKitTranslation('login');

  // Use centralized social auth hook
  const {isSocialLoginLoading, handleSocialLogin} = useSocialAuth({
    config,
    isPrivacyChecked,
  });

  const styles = createLoginScreenStyles(config.theme);

  const { animatePrivacyPolicy, handlePressWithPrivacyCheck } = usePrivacyCheck({
    isPrivacyChecked,
    isPrivacyRequired: config.privacy.required,
  });

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
                config.logo.width &&
                  config.logo.height &&
                  ({
                    width: config.logo.width,
                    height: config.logo.height,
                  } as any),
              ]}
              resizeMode="contain"
            />
          </View>
          {config.logo.text && (
            <Text style={styles.logoText}>{config.logo.text}</Text>
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
                onGooglePress={() => handlePressWithPrivacyCheck(() => handleSocialLogin('google'))}
                onApplePress={() => handlePressWithPrivacyCheck(() => handleSocialLogin('apple'))}
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
        <View style={styles.privacySection}>
          <PrivacyPolicy
            theme={config.theme}
            isChecked={isPrivacyChecked}
            onCheckboxChange={setIsPrivacyChecked}
            pressPrivacyPolicy={config.privacy.pressPrivacyPolicy}
            triggerAnimation={animatePrivacyPolicy}
          />
        </View>
      )}
    </View>
  );
};
