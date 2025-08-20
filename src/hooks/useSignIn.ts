import { useCallback, useState } from 'react';
import { LoginKitConfig } from '../types';
import { EmailAuthService } from '../services/EmailAuthService';
import { useLoginKitTranslation } from './useLoginKitTranslation';

interface UseSignInProps {
  config: LoginKitConfig;
}

export const useSignIn = ({ config }: UseSignInProps) => {
  const { t } = useLoginKitTranslation('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorMissingInputs, setErrorMissingInputs] = useState(false);
  const [errorInvalidEmail, setErrorInvalidEmail] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(!config.privacy.required);

  const emailAuthService = new EmailAuthService(
    config.apiConfig,
    config.navigation.onGetUserName,
  );

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setErrorMissingInputs(true);
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorInvalidEmail(true);
      return;
    }

    try {
      setLoading(true);
      const result = await emailAuthService.signInWithEmail(email, password);
      
      if (result.success && result.user) {
        config.navigation.onLoginSuccess();
      } else {
        console.log(`${t('_error_')} ${t('userSignInErrorAlertMessage')}`, { error: result.error || 'Unknown error' });
        if (result.error == 'Şifre hatalı') {
          setErrorPassword(true);
        } else {
          setErrorSignIn(true);
        }
      }
    } catch (error) {
      console.log(`${t('_error_')} ${t('userSignInErrorAlertMessage')}`, { error: (error as Error).message });
      setErrorSignIn(true);
    } finally {
      setLoading(false);
    }
  }, [email, password, emailAuthService, config.navigation, t]);


  return {
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
  };
}; 