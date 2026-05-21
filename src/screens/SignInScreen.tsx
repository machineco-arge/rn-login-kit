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
import {useForgotPassword} from '../hooks/useForgotPassword';
import {useSocialAuth} from '../hooks/useSocialAuth';
import {createSignInScreenStyles} from '../utils/styles';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import {TextInputsLogin} from '../components/TextInputsLogin';
import {SocialLogin} from '../components/SocialLogin';
import {LoadingIndicator} from '../components/LoadingIndicator';
import {HaveAnAccount} from '../components/HaveAnAccount';
import {OrComponent} from '../components/OrComponent';
import { CustomBottomSheet, DualPasswordInputModal, TextInputModal } from '..';

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
    loading: signInLoading,
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

  const forgotPassword = useForgotPassword({ config, email, userName });
  const { isSocialLoginLoading, handleSocialLogin } = useSocialAuth({config});

  const loading =
    signInLoading ||
    isSocialLoginLoading ||
    (forgotPassword.loading &&
      !forgotPassword.verificationSheetVisible &&
      !forgotPassword.newPasswordSheetVisible);

  const verificationResetMessage = forgotPassword.verificationError
    ? `${t('verificationCodeMessageReset')}\n\n${forgotPassword.verificationError}`
    : t('verificationCodeMessageReset');

  const newPasswordMessage = forgotPassword.newPasswordError
    ? `${t('newPasswordMessage')}\n\n${forgotPassword.newPasswordError}`
    : t('newPasswordMessage');

  if (loading) {
    return <LoadingIndicator theme={config.theme} />;
  }

  const renderPasswordField = () => (
    <View>
      <TextInputsLogin
        theme={config.theme}
        type="Password"
        placeholder={t('placeholderEnterPassword')}
        value={password}
        onChangeText={setPassword}
        passwordClose={true}
        errorText={passwordError}
      />
      {config.emailAuth.enabledSignInEmail && (
        <View style={styles.passwordFieldFooter}>
          <TouchableOpacity
            onPress={forgotPassword.handleForgotPassword}
            disabled={!forgotPassword.isForgotPasswordEnabled}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.forgotPasswordText,
                !forgotPassword.isForgotPasswordEnabled && styles.forgotPasswordTextDisabled,
              ]}>
              {t('forgotPassword')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderForgotPasswordSheets = () => (
    <>
      <TextInputModal
        config={config}
        visible={forgotPassword.verificationSheetVisible}
        title={t('verificationCodeTitle')}
        message={verificationResetMessage}
        placeholder={t('verificationCodePlaceholder')}
        cancelText={t('cancel')}
        submitText={t('userSignInContinue')}
        value=""
        onCancel={forgotPassword.handleCancelVerification}
        onSubmit={forgotPassword.handleConfirmVerificationCode}
        maxLength={6}
        keyboardType="number-pad"
        inputFilter={(text) => text.replace(/\D/g, '').slice(0, 6)}
        closeOnSubmit={false}
        submitLoading={forgotPassword.verificationSubmitting}
        onClosed={forgotPassword.handleVerificationModalClosed}
      />
      <DualPasswordInputModal
        config={config}
        visible={forgotPassword.newPasswordSheetVisible}
        title={t('newPasswordTitle')}
        message={newPasswordMessage}
        passwordPlaceholder={t('placeholderEnterPassword')}
        confirmPlaceholder={t('placeholderConfirmPassword')}
        cancelText={t('cancel')}
        submitText={t('confirm')}
        onCancel={forgotPassword.handleCancelNewPassword}
        onSubmit={forgotPassword.handleConfirmNewPassword}
        closeOnSubmit={false}
        submitLoading={forgotPassword.passwordSubmitting}
      />
      <CustomBottomSheet
        config={config}
        visible={forgotPassword.serverErrorVisible}
        title={t('_error_')}
        message={forgotPassword.serverErrorMessage}
        okText={t('ok')}
        onOK={() => forgotPassword.setServerErrorVisible(false)}
      />
    </>
  );

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

          {renderPasswordField()}

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

        {config.emailAuth.enabledRegister && (
          <HaveAnAccount
            theme={config.theme}
            screen="signIn"
            onPress={() => config.navigation.onRegisterPress?.()}
          />
        )}

        <CustomBottomSheet
          config={config}
          visible={serverErrorVisible}
          title={t('_error_') || 'Error'}
          message={serverErrorMessage}
          okText={t('ok') || 'OK'}
          onOK={() => setServerErrorVisible(false)}
        />
        {renderForgotPasswordSheets()}
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

              {renderPasswordField()}

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

      <CustomBottomSheet
        config={config}
        visible={serverErrorVisible}
        title={t('_error_') || 'Error'}
        message={serverErrorMessage}
        okText={t('ok') || 'OK'}
        onOK={() => setServerErrorVisible(false)}
      />
      {renderForgotPasswordSheets()}
    </KeyboardAvoidingView>
  );
};
