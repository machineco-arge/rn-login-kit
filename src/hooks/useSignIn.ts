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
  const [companyName, setCompanyName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation Errors (Inline)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [userError, setUserError] = useState('');

  // Server Errors (Bottom Sheet)
  const [serverErrorVisible, setServerErrorVisible] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  const emailAuthService = new EmailAuthService(config);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleLogin = useCallback(async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setCompanyError('');
    setUserError('');
    setServerErrorVisible(false);

    let hasError = false;

    if (config.emailAuth.enabledSignInEmail) {
      if (!email) {
        setEmailError(t('userSignInEnterEmailAndPasswordAlert') || 'Email is required');
        hasError = true;
      } else if (!emailRegex.test(email)) {
        setEmailError(t('userSignInEnterValidEmailAlert') || 'Invalid email');
        hasError = true;
      }
    }

    if (config.emailAuth.enabledSignInUserName && !userName) {
      setUserError(t('userSignInEnterEmailAndPasswordAlert') || 'Username is required');
      hasError = true;
    }

    if (config.emailAuth.enabledSignInCompanyName && !companyName) {
      setCompanyError(t('userSignInEnterEmailAndPasswordAlert') || 'Company name is required');
      hasError = true;
    }

    if (!password) {
      setPasswordError(t('userSignInEnterEmailAndPasswordAlert') || 'Password is required');
      hasError = true;
    }

    if (hasError) return;

    const _companyName = config.emailAuth.enabledSignInCompanyName ? companyName : 'tempName';
    const _userName = config.emailAuth.enabledSignInUserName ? userName : 'tempName';
    const _email = config.emailAuth.enabledSignInEmail ? email : 'tempName@example.com';

    try {
      setLoading(true);
      const result = await emailAuthService.signInWithEmail(_companyName, _email, _userName, password);

      if (result.success && result.user) {
        config.navigation.onLoginSuccess();
      } else {
        if (result.error === 'Şifre hatalı') {
          setServerErrorMessage(t('userSignInErrorWrongPasswordAlertMessage') || 'Wrong password');
        } else if (result.error === 'Zaten aktif bir oturum var.') {
          setServerErrorMessage(t('userSignInErrorAlreadyActiveSession') || 'Active session exists');
        } else {
          setServerErrorMessage(result.error || t('userSignInErrorAlertMessage') || 'An error occurred');
        }
        setServerErrorVisible(true);
      }
    } catch (error) {
      setServerErrorMessage((error as Error).message);
      setServerErrorVisible(true);
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
    handleLogin,
    emailError,
    passwordError,
    companyError,
    userError,
    serverErrorVisible,
    setServerErrorVisible,
    serverErrorMessage,
    isFormValid: (
      !!password &&
      (!config.emailAuth.enabledSignInEmail || !!email) &&
      (!config.emailAuth.enabledSignInUserName || !!userName) &&
      (!config.emailAuth.enabledSignInCompanyName || !!companyName)
    ),
  };
};