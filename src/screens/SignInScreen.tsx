import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScreenProps} from '../types';
import {useSignIn} from '../hooks/useSignIn';
import {useSocialAuth} from '../hooks/useSocialAuth';
import {createSignInScreenStyles} from '../utils/styles';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import {TextInputsLogin} from '../components/TextInputsLogin';
import {SocialLogin} from '../components/SocialLogin';
import {LoadingIndicator} from '../components/LoadingIndicator';
import {HaveAnAccount} from '../components/HaveAnAccount';
import {OrComponent} from '../components/OrComponent';
import { CustomBottomSheet } from '..';

export const SignInScreen: React.FC<ScreenProps & { isBottomSheet?: boolean }> = ({
  config,
  showSocialLogin = true,
  GoogleIcon,
  AppleIcon,
  isBottomSheet = false,
}) => {
  const {t} = useLoginKitTranslation('login');
  const styles = createSignInScreenStyles(config.theme);

  const {
    email,
    setEmail,
    userName,
    setUserName,
    companyName,
    setCompanyName,
    password,
    setPassword,
    loading,
    handleLogin,
    emailError,
    passwordError,
    companyError,
    userError,
    serverErrorVisible,
    setServerErrorVisible,
    serverErrorMessage,
    isFormValid,
  } = useSignIn({
    config,
  });

  // Use centralized social auth hook
  const { isSocialLoginLoading, handleSocialLogin } = useSocialAuth({config});

  if (loading || isSocialLoginLoading) {
    return <LoadingIndicator theme={config.theme} />;
  }

  if (isBottomSheet) {
    return (
      <View style={styles.sheetContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('userSignIn') || 'Sign In'}</Text>
        </View>

        <View style={styles.formSection}>
          {config.emailAuth.enabledSignInCompanyName && (
            <TextInputsLogin
              theme={config.theme}
              type="Company"
              placeholder={t('placeholderCompanyName')}
              value={companyName}
              onChangeText={setCompanyName}
              errorText={companyError}
            />
          )}

          {config.emailAuth.enabledSignInEmail && (
            <TextInputsLogin
              theme={config.theme}
              type="Mail"
              placeholder={t('placeholderEnterEmail')}
              value={email}
              onChangeText={setEmail}
              errorText={emailError}
            />
          )}

          {config.emailAuth.enabledSignInUserName && (
            <TextInputsLogin
              theme={config.theme}
              type="User"
              placeholder={t('placeholderEnterUserName')}
              value={userName}
              onChangeText={setUserName}
              errorText={userError}
            />
          )}

          <TextInputsLogin
            theme={config.theme}
            type="Password"
            placeholder={t('placeholderEnterPassword')}
            value={password}
            onChangeText={setPassword}
            passwordClose={true}
            errorText={passwordError}
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              !isFormValid && { backgroundColor: config.theme.colors.PRIMARY_300 }
            ]}
            onPress={handleLogin}
            disabled={!isFormValid}>
            <Text style={styles.loginButtonText}>{t('userSignInContinue') || 'Continue'}</Text>
          </TouchableOpacity>
        </View>

        <OrComponent theme={config.theme} text={t('userSignInOr') || 'or'} />

        {/* Social Login Section */}
        {showSocialLogin && (
          <View style={styles.socialSection}>
            <SocialLogin
              theme={config.theme}
              socialConfig={config.socialAuth}
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
        {config.emailAuth.enabledRegister && (
          <HaveAnAccount
            theme={config.theme}
            screen="signIn"
            onPress={() => config.navigation.onRegisterPress?.()}
          />
        )}
        
        {/* Server Error Bottom Sheet (Moved inside for context) */}
        <CustomBottomSheet
          config={config}
          visible={serverErrorVisible}
          title={t('_error_') || 'Error'}
          message={serverErrorMessage}
          okText={t('ok') || 'OK'}
          onOK={() => setServerErrorVisible(false)}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.overlay}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          
          <View style={styles.sheet}>
            <View style={styles.handleBar} />
            
            <View style={styles.headerSection}>
              <Text style={styles.title}>{t('userSignIn') || 'Sign In'}</Text>
            </View>

            <View style={styles.formSection}>
              {config.emailAuth.enabledSignInCompanyName && (
                <TextInputsLogin
                  theme={config.theme}
                  type="Company"
                  placeholder={t('placeholderCompanyName')}
                  value={companyName}
                  onChangeText={setCompanyName}
                  errorText={companyError}
                />
              )}

              {config.emailAuth.enabledSignInEmail && (
                <TextInputsLogin
                  theme={config.theme}
                  type="Mail"
                  placeholder={t('placeholderEnterEmail')}
                  value={email}
                  onChangeText={setEmail}
                  errorText={emailError}
                />
              )}

              {config.emailAuth.enabledSignInUserName && (
                <TextInputsLogin
                  theme={config.theme}
                  type="User"
                  placeholder={t('placeholderEnterUserName')}
                  value={userName}
                  onChangeText={setUserName}
                  errorText={userError}
                />
              )}

              <TextInputsLogin
                theme={config.theme}
                type="Password"
                placeholder={t('placeholderEnterPassword')}
                value={password}
                onChangeText={setPassword}
                passwordClose={true}
                errorText={passwordError}
              />

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  !isFormValid && { backgroundColor: config.theme.colors.PRIMARY_300 }
                ]}
                onPress={handleLogin}
                disabled={!isFormValid}>
                <Text style={styles.loginButtonText}>{t('userSignInContinue') || 'Continue'}</Text>
              </TouchableOpacity>
            </View>

            <OrComponent theme={config.theme} text={t('userSignInOr') || 'or'} />

            {/* Social Login Section */}
            {showSocialLogin && (
              <View style={styles.socialSection}>
                <SocialLogin
                  theme={config.theme}
                  socialConfig={config.socialAuth}
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
            {config.emailAuth.enabledRegister && (
              <HaveAnAccount
                theme={config.theme}
                screen="signIn"
                onPress={() => config.navigation.onRegisterPress?.()}
              />
            )}
          </View>
        </ScrollView>
      </View>

      {/* Server Error Bottom Sheet */}
      <CustomBottomSheet
        config={config}
        visible={serverErrorVisible}
        title={t('_error_') || 'Error'}
        message={serverErrorMessage}
        okText={t('ok') || 'OK'}
        onOK={() => setServerErrorVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};
