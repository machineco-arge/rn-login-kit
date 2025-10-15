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
import {PrivacyPolicy} from '../components/PrivacyPolicy';
import {LoadingIndicator} from '../components/LoadingIndicator';
import {HaveAnAccount} from '../components/HaveAnAccount';
import {OrComponent} from '../components/OrComponent';
import { IconSet } from '../components/IconSet';
import { CustomAlert } from '..';
import { usePrivacyCheck } from '../hooks/usePrivacyCheck';

export const RegisterScreen: React.FC<ScreenProps> = ({
  config,
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
    isPrivacyChecked,
    setIsPrivacyChecked,
    handleRegister,
    errorRegister,
    setErrorRegister,
    errorMissingInputs,
    setErrorMissingInputs,
    errorPassword,
    setErrorPassword,
    errorInvalidEmail,
    setErrorInvalidEmail,
    errorMessage
  } = useRegister({
    config,
  });

  const { animatePrivacyPolicy, handlePressWithPrivacyCheck } = usePrivacyCheck({
    isPrivacyChecked,
    isPrivacyRequired: config.privacy.required,
  });

  if (loading) {
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
          <Text style={styles.title}>{t('userRegister')}</Text>
          <Text style={styles.subtitle}>{t('userRegisterToGetStarted')}</Text>
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
                IconComponent={IconSet}
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
                IconComponent={IconSet}
                passwordClose={false}
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
              IconComponent={IconSet}
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
              IconComponent={IconSet}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => handlePressWithPrivacyCheck(handleRegister)}>
            <Text style={styles.registerButtonText}>
              {t('userRegisterCreateAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        <OrComponent theme={config.theme} text={t('userSignInOr')} />

        {/* Have an Account Section */}
        <HaveAnAccount
          theme={config.theme}
          screen="register"
          onPress={() => config.navigation.onSignInPress?.()}
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
            triggerAnimation={animatePrivacyPolicy}
          />
        </View>
      )}

    <CustomAlert
      theme={config.theme}
      visible={errorMissingInputs}
      title={t('_error_')}
      message={t('userRegisterPleaseEnterAllInformation')}
      onOK={() => setErrorMissingInputs(false)}
      okText={t('ok')}
    />
    
    <CustomAlert
      theme={config.theme}
      visible={errorPassword}
      title={t('_error_')}
      message={t('userRegisterPasswordsNotMatchErrorAlert')}
      onOK={() => setErrorPassword(false)}
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
      visible={errorRegister}
      title={t('_error_')}
      message={`${t('userRegisterErrorAlertMessage')} ${t(errorMessage)}`}
      onOK={() => setErrorRegister(false)}
      okText={t('ok')}
    />
    </KeyboardAvoidingView>
  );
};
