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
import {useRegister} from '../hooks/useRegister';
import {createRegisterScreenStyles} from '../utils/styles';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import {TextInputsLogin} from '../components/TextInputsLogin';
import {LoadingIndicator} from '../components/LoadingIndicator';
import {HaveAnAccount} from '../components/HaveAnAccount';
import {OrComponent} from '../components/OrComponent';
import { CustomBottomSheet, SocialLogin, TextInputModal, useSocialAuth } from '..';

export const RegisterScreen: React.FC<ScreenProps & { 
  isBottomSheet?: boolean;
  showSocialLogin?: boolean;
  GoogleIcon?: any;
  AppleIcon?: any;
}> = ({
  config,
  showSocialLogin = true,
  GoogleIcon,
  AppleIcon,
  isBottomSheet = false,
}) => {
  const {t} = useLoginKitTranslation('login');
  const styles = createRegisterScreenStyles(config.theme);

  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    loading,
    handleRegister,
    errorRegister,
    setErrorRegister,
    errorMissingInputs,
    setErrorMissingInputs,
    passwordError,
    emailError,
    errorMessage,
    verificationSheetVisible,
    verificationError,
    verificationSubmitting,
    handleConfirmVerificationCode,
    handleCancelVerification,
  } = useRegister({
    config,
  });

  const { isSocialLoginLoading, handleSocialLogin } = useSocialAuth({config});

  const verificationMessage = verificationError
    ? `${t('verificationCodeMessageRegister')}\n\n${verificationError}`
    : t('verificationCodeMessageRegister');

  if ((loading || isSocialLoginLoading) && !verificationSheetVisible) {
    return <LoadingIndicator theme={config.theme} />;
  }

  const isFormValid = (
    (!config.emailAuth.enabledRegisterEmail || email) &&
    (!config.emailAuth.enabledRegisterUserName || name) &&
    password && confirmPassword &&
    password === confirmPassword
  );

  if (isBottomSheet) {
    return (
      <View style={styles.sheetContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('userRegister') || 'Sign Up'}</Text>
        </View>

        <View style={styles.formSection}>
          {config.emailAuth.enabledRegisterUserName && (
            <View style={styles.inputContainer}>
              <TextInputsLogin
                theme={config.theme}
                type="User"
                placeholder={t('placeholderEnterUserName')}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}
          
          {config.emailAuth.enabledRegisterEmail && (
            <View style={styles.inputContainer}>
              <TextInputsLogin
                theme={config.theme}
                type="Mail"
                placeholder={t('placeholderEnterEmail')}
                value={email}
                onChangeText={setEmail}
                errorText={emailError}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInputsLogin
              theme={config.theme}
              type="Password"
              placeholder={t('placeholderEnterPassword')}
              value={password}
              onChangeText={setPassword}
              passwordClose={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInputsLogin
              theme={config.theme}
              type="Password"
              placeholder={t('placeholderConfirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              passwordClose={true}
              errorText={passwordError}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              !isFormValid && { backgroundColor: config.theme.colors.PRIMARY_300 }
            ]}
            onPress={handleRegister}
            disabled={!isFormValid}>
            <Text style={styles.registerButtonText}>
              {t('userRegisterCreateAccount') || 'Continue'}
            </Text>
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
        <HaveAnAccount
          theme={config.theme}
          screen="register"
          onPress={() => config.navigation.onSignInPress?.()}
        />

        {/* Error Handling with CustomBottomSheet */}
        <CustomBottomSheet  
          config={config}
          visible={errorMissingInputs}
          title={t('_error_')}
          message={t('userRegisterPleaseEnterAllInformation')}
          onOK={() => setErrorMissingInputs(false)}
          okText={t('ok')}
        />
        <CustomBottomSheet
          config={config}
          visible={errorRegister}
          title={t('_error_')}
          message={errorMessage}
          onOK={() => setErrorRegister(false)}
          okText={t('ok')}
        />
        <TextInputModal
          config={config}
          visible={verificationSheetVisible}
          title={t('verificationCodeTitle')}
          message={verificationMessage}
          placeholder={t('verificationCodePlaceholder')}
          cancelText={t('cancel')}
          submitText={t('userSignInContinue')}
          value=""
          onCancel={handleCancelVerification}
          onSubmit={handleConfirmVerificationCode}
          maxLength={6}
          keyboardType="number-pad"
          inputFilter={(text) => text.replace(/\D/g, '').slice(0, 6)}
          closeOnSubmit={false}
          submitLoading={verificationSubmitting}
        />
      </View>
    );
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
          <Text style={styles.title}>{t('userRegister')}</Text>
        </View>

        <View style={styles.formSection}>

          {config.emailAuth.enabledRegisterUserName && (
            <View style={styles.inputContainer}>
              <TextInputsLogin
                theme={config.theme}
                type="User"
                placeholder={t('placeholderEnterUserName')}
                value={name}
                onChangeText={setName}
                passwordClose={false}
              />
            </View>
          )}
          
          {config.emailAuth.enabledRegisterEmail && (
            <View style={styles.inputContainer}>
              <TextInputsLogin
                theme={config.theme}
                type="Mail"
                placeholder={t('placeholderEnterEmail')}
                value={email}
                onChangeText={setEmail}
                passwordClose={false}
                errorText={emailError}
              />
          </View>
          )}
          

          <View style={styles.inputContainer}>
            <TextInputsLogin
              theme={config.theme}
              type="Password"
              placeholder={t('placeholderEnterPassword')}
              value={password}
              onChangeText={setPassword}
              passwordClose={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInputsLogin
              theme={config.theme}
              type="Password"
              placeholder={t('placeholderConfirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              passwordClose={true}
              errorText={passwordError}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}>
            <Text style={styles.registerButtonText}>
              {t('userRegisterCreateAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        <OrComponent theme={config.theme} text={t('userSignInOr')} />

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
        <HaveAnAccount
          theme={config.theme}
          screen="register"
          onPress={() => config.navigation.onSignInPress?.()}
        />
      </ScrollView>

      {/* Direct use of CustomBottomSheet for desktop/standalone errors */}
      <CustomBottomSheet
        config={config}
        visible={errorMissingInputs}
        title={t('_error_')}
        message={t('userRegisterPleaseEnterAllInformation')}
        onOK={() => setErrorMissingInputs(false)}
        okText={t('ok')}
      />
      <CustomBottomSheet
        config={config}
        visible={errorRegister}
        title={t('_error_')}
        message={`${t('userRegisterErrorAlertMessage')} ${t(errorMessage)}`}
        onOK={() => setErrorRegister(false)}
        okText={t('ok')}
      />
      <TextInputModal
        config={config}
        visible={verificationSheetVisible}
        title={t('verificationCodeTitle')}
        message={verificationMessage}
        placeholder={t('verificationCodePlaceholder')}
        cancelText={t('cancel')}
        submitText={t('userSignInContinue')}
        value=""
        onCancel={handleCancelVerification}
        onSubmit={handleConfirmVerificationCode}
        maxLength={6}
        keyboardType="number-pad"
        inputFilter={(text) => text.replace(/\D/g, '').slice(0, 6)}
        closeOnSubmit={false}
        submitLoading={verificationSubmitting}
      />
    </KeyboardAvoidingView>
  );
};
