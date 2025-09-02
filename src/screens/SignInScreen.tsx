import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LinearGradient} from 'react-native-gradients';
import {ScreenProps} from '../types';
import {useSignIn} from '../hooks/useSignIn';
import {useSocialAuth} from '../hooks/useSocialAuth';
import {createSignInScreenStyles} from '../utils/styles';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import {TextInputsLogin} from '../components/TextInputsLogin';
import {SocialLogin} from '../components/SocialLogin';
import {PrivacyPolicy} from '../components/PrivacyPolicy';
import {LoadingIndicator} from '../components/LoadingIndicator';
import {HaveAnAccount} from '../components/HaveAnAccount';
import {OrComponent} from '../components/OrComponent';
import { IconSet } from '../components/IconSet';
import { CustomAlert } from '..';


export const SignInScreen: React.FC<ScreenProps> = ({
  config,
  showSocialLogin = true,
  GoogleIcon,
  AppleIcon,
}) => {
  const {t} = useLoginKitTranslation('login');
  const styles = createSignInScreenStyles(config.theme);

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    isPrivacyChecked,
    setIsPrivacyChecked,
    handleLogin,
    errorMissingInputs,
    setErrorMissingInputs,
    errorInvalidEmail,
    setErrorInvalidEmail,
    errorSignIn,
    setErrorSignIn,
    errorPassword,
    setErrorPassword
  } = useSignIn({
    config,
  });

  // Use centralized social auth hook
  const { isSocialLoginLoading, handleSocialLogin } = useSocialAuth({
    config,
    isPrivacyChecked,
  });

  if (loading || isSocialLoginLoading) {
    return <LoadingIndicator theme={config.theme} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
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

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('userSignInLoginYourAccount')}</Text>
          <Text style={styles.subtitle}>
            {t('userSignInLoginToGetStarted')}
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <TextInputsLogin
              theme={config.theme}
              type="Mail"
              placeholder={t('placeholderEnterEmail')}
              value={email}
              onChangeText={setEmail}
              IconComponent={IconSet}
            />
          </View>

          <View style={styles.passwordInputContainer}>
            <TextInputsLogin
              theme={config.theme}
              type="Password"
              placeholder={t('placeholderEnterPassword')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              IconComponent={IconSet}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              !isPrivacyChecked &&
                config.privacy.required &&
                styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={!isPrivacyChecked && config.privacy.required}>
            <Text style={styles.loginButtonText}>{t('userSignInLogin')}</Text>
          </TouchableOpacity>
        </View>

        <OrComponent theme={config.theme} text={t('userSignInOr')} />

        {/* Social Login Section */}
        {showSocialLogin && (
          <View style={styles.socialSection}>
            <SocialLogin
              theme={config.theme}
              socialConfig={config.socialAuth}
              disabled={!isPrivacyChecked && config.privacy.required}
              loading={isSocialLoginLoading}
              onGooglePress={() => handleSocialLogin('google')}
              onApplePress={() => handleSocialLogin('apple')}
              GoogleIcon={GoogleIcon}
              AppleIcon={AppleIcon}
              googleText={t('socialLoginWithGoogle')}
              appleText={t('socialLoginWithApple')}
            />
          </View>
        )}

        {/* Have an Account Section */}
        <HaveAnAccount
          theme={config.theme}
          screen="signIn"
          onPress={() => config.navigation.onRegisterPress?.()}
        />
      </ScrollView>

      {/* Privacy Section */}
      {config.privacy.required && (
        <View style={styles.privacySection}>
          <PrivacyPolicy
            theme={config.theme}
            isChecked={isPrivacyChecked}
            onCheckboxChange={setIsPrivacyChecked}
            pressPrivacyPolicy={config.privacy.pressPrivacyPolicy}
          />
        </View>
      )}

      <CustomAlert
        theme={config.theme}
        visible={errorMissingInputs}
        title={t('_error_')}
        message={t('userSignInEnterEmailAndPasswordAlert')}
        onOK={() => setErrorMissingInputs(false)}
        okText={t('ok')}
      />

      <CustomAlert
        theme={config.theme}
        visible={errorInvalidEmail}
        title={t('_error_')}
        message={t('userSignInEnterValidEmailAlert')}
        onOK={() => setErrorInvalidEmail(false)}
        okText={t('ok')}
      />

      <CustomAlert
        theme={config.theme}
        visible={errorSignIn}
        title={t('_error_')}
        message={t('userSignInErrorAlertMessage')}
        onOK={() => setErrorSignIn(false)}
        okText={t('ok')}
      />

      <CustomAlert
        theme={config.theme}
        visible={errorPassword}
        title={t('_error_')}
        message={t('userSignInErrorWrongPasswordAlertMessage')}
        onOK={() => setErrorPassword(false)}
        okText={t('ok')}
      />
    </KeyboardAvoidingView>
  );
};
