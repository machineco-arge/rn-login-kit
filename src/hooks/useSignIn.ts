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
  const [companyName, setCompanyName] =  useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorMissingInputs, setErrorMissingInputs] = useState(false);
  const [errorInvalidEmail, setErrorInvalidEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(!config.privacy.required);

  const emailAuthService = new EmailAuthService(config);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleLogin = useCallback(async () => {
    if (
      !password ||
      (config.emailAuth.enabledSignInUserName && !userName) ||
      (config.emailAuth.enabledSignInEmail && !email) ||
      (config.emailAuth.enabledSignInCompanyName && !companyName)
    ) {
      setErrorMissingInputs(true);
      return;
    }

    if (config.emailAuth.enabledSignInEmail && !emailRegex.test(email)) {
      setErrorInvalidEmail(true);
      return;
    }

    const _companyName = config.emailAuth.enabledSignInCompanyName ? companyName : 'tempName';
    const _userName = config.emailAuth.enabledSignInUserName ? userName : 'tempName';
    const _email = config.emailAuth.enabledSignInEmail ? email : 'tempName@example.com';

    try {
      setLoading(true);
      const result = await emailAuthService.signInWithEmail(_companyName, _email, _userName, password);
      
      if (result.success && result.user) {
        config.navigation.onLoginSuccess();
      } else {
        console.log(`${t('_error_')} ${t('userSignInErrorAlertMessage')}`, { error: result.error || 'Unknown error' });
        if (result.error == 'Şifre hatalı') {
          setErrorPassword(true);
        } else if(result.error == 'Zaten aktif bir oturum var.') {
          setErrorMessage('userSignInErrorAlreadyActiveSession');
          setErrorSignIn(true);
        } else {
          setErrorMessage('');
          setErrorSignIn(true);
        }
      }
    } catch (error) {
      console.log(`${t('_error_')} ${t('userSignInErrorAlertMessage')}`, { error: (error as Error).message });
      setErrorSignIn(true);
    } finally {
      setLoading(false);
    }
  }, [
    email,
    password,
    companyName,
    userName,
    emailAuthService,
    config.navigation,
    config.emailAuth.enabledSignInCompanyName,
    config.emailAuth.enabledSignInEmail,
    config.emailAuth.enabledSignInUserName,
    t,
  ]);


  return {
    email,
    setEmail,
    companyName,
    setCompanyName,
    userName,
    setUserName,
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
    setErrorPassword,
    errorMessage,
  };
}; 