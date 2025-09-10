import { useCallback, useState } from 'react';
import { LoginKitConfig } from '../types';
import { EmailAuthService } from '../services/EmailAuthService';
import { useLoginKitTranslation } from './useLoginKitTranslation';

interface UseRegisterProps {
  config: LoginKitConfig;
}

export const useRegister = ({ config }: UseRegisterProps) => {
  const { t } = useLoginKitTranslation('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(!config.privacy.required);
  const [errorRegister, setErrorRegister] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorMissingInputs, setErrorMissingInputs] = useState(false);
  const [errorInvalidEmail, setErrorInvalidEmail] = useState(false);

  const emailAuthService = new EmailAuthService(config);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRegister = useCallback(async () => {
    if (
      (config.emailAuth.enabledRegisterEmail && !email) || 
      (config.emailAuth.enabledRegisterUserName && !name) || 
      !password || !confirmPassword) {
      setErrorMissingInputs(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorPassword(true);
      return;
    }

    if (config.emailAuth.enabledRegisterEmail && !emailRegex.test(email)) {
      setErrorInvalidEmail(true);
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
    t
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
    errorPassword,
    setErrorPassword,
    errorInvalidEmail,
    setErrorInvalidEmail
  };
}; 