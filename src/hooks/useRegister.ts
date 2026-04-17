import { useCallback, useEffect, useState } from 'react';
import { LoginKitConfig } from '../types';
import { EmailAuthService } from '../services/EmailAuthService';
import { useLoginKitTranslation } from './useLoginKitTranslation';
import { useAuthBottomSheet } from './AuthBottomSheetContext';

interface UseRegisterProps {
  config: LoginKitConfig;
}

export const useRegister = ({ config }: UseRegisterProps) => {
  const { onSuccess } = useAuthBottomSheet();
  const { t } = useLoginKitTranslation('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(true);
  const [errorRegister, setErrorRegister] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errorMissingInputs, setErrorMissingInputs] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const emailAuthService = new EmailAuthService(config);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError(t('userRegisterPasswordsNotMatchErrorAlert') || 'Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword, t]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRegister = useCallback(async () => {
    setEmailError('');

    if (
      (config.emailAuth.enabledRegisterEmail && !email) ||
      (config.emailAuth.enabledRegisterUserName && !name) ||
      !password || !confirmPassword) {
      setErrorMissingInputs(true);
      return;
    }

    if (config.emailAuth.enabledRegisterEmail && !emailRegex.test(email)) {
      setEmailError(t('userSignInEnterValidEmailAlert') || 'Please enter a valid email');
      return;
    }

    const _userName = config.emailAuth.enabledRegisterUserName ? name : 'tempName';
    const _email = config.emailAuth.enabledRegisterEmail ? email : 'tempName@example.com';

    try {
      setLoading(true);
      const result = await emailAuthService.registerWithEmail(_userName, _email, password);

      if (result.success && result.user) {
        config.navigation.onLoginSuccess();
      } else {
        console.log(`${t('_error_')} ${t('userRegisterErrorAlertMessage')}`, { error: result.error || 'Unknown error' });
        if (result.error == 'Bu e-posta ile kayıtlı başka bir kullanıcı mevcut') {
          setErrorMessage('userRegisterErrorAlertMessageAnotherUserUseThisEmail');
        }
        setErrorRegister(true);
      }
    } catch (error) {
      console.log(`${t('_error_')} ${t('userRegisterErrorAlertMessage')}`, { error: (error as Error).message });
      setErrorRegister(true);
    } finally {
      setLoading(false);
    }
  }, [
    email,
    password,
    confirmPassword,
    name,
    emailAuthService,
    config.navigation,
    config.emailAuth.enabledRegisterEmail,
    config.emailAuth.enabledRegisterUserName,
    t,
    onSuccess
  ]);

  return {
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
    passwordError,
    setPasswordError,
    emailError,
    setEmailError,
    errorMessage,
  };
}; 