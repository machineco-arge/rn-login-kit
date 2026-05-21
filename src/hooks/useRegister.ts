import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoginKitConfig } from '../types';
import { EmailAuthService } from '../services/EmailAuthService';
import { extractAuthApiError, resolveAuthErrorMessage } from '../utils/authApiErrors';
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
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(true);
  const [errorRegister, setErrorRegister] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errorMissingInputs, setErrorMissingInputs] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [verificationSheetVisible, setVerificationSheetVisible] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);

  const emailAuthService = useMemo(() => new EmailAuthService(config), [config]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError(t('userRegisterPasswordsNotMatchErrorAlert') || 'Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword, t]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const resolveRegisterError = useCallback(
    (error?: string, errorCode?: string) => {
      setErrorMessage(
        resolveAuthErrorMessage(t, {
          code: errorCode,
          message: error,
          fallbackKey: 'userRegisterErrorAlertMessage',
        }),
      );
      setErrorRegister(true);
    },
    [t],
  );

  const handleRegister = useCallback(async () => {
    setEmailError('');
    setVerificationError('');

    if (
      (config.emailAuth.enabledRegisterEmail && !email) ||
      (config.emailAuth.enabledRegisterUserName && !name) ||
      !password ||
      !confirmPassword
    ) {
      setErrorMissingInputs(true);
      return;
    }

    if (config.emailAuth.enabledRegisterEmail && !emailRegex.test(email)) {
      setEmailError(t('userSignInEnterValidEmailAlert') || 'Please enter a valid email');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(t('userRegisterPasswordsNotMatchErrorAlert') || 'Passwords do not match');
      return;
    }

    const _email = config.emailAuth.enabledRegisterEmail ? email : 'tempName@example.com';

    try {
      setLoading(true);
      const sendResult = await emailAuthService.sendRegistrationCode(_email);

      if (!sendResult.success) {
        resolveRegisterError(sendResult.error, sendResult.errorCode);
        return;
      }

      setVerificationError('');
      setVerificationSheetVisible(true);
    } catch (error) {
      const apiError = extractAuthApiError(error);
      resolveRegisterError(apiError.message, apiError.code);
    } finally {
      setLoading(false);
    }
  }, [
    email,
    password,
    confirmPassword,
    name,
    emailAuthService,
    config.emailAuth.enabledRegisterEmail,
    config.emailAuth.enabledRegisterUserName,
    emailRegex,
    resolveRegisterError,
    t,
  ]);

  const handleConfirmVerificationCode = useCallback(async (code: string) => {
    setVerificationError('');

    const trimmed = code.trim();
    if (!trimmed || trimmed.length !== 6) {
        setVerificationError(t('verificationEnterValidCode'));
      return;
    }

    const _userName = config.emailAuth.enabledRegisterUserName ? name : 'tempName';
    const _email = config.emailAuth.enabledRegisterEmail ? email : 'tempName@example.com';

    try {
      setVerificationSubmitting(true);
      const result = await emailAuthService.registerWithEmail(
        _userName,
        _email,
        password,
        trimmed,
      );

      if (result.success && result.user) {
        setVerificationSheetVisible(false);
        config.navigation.onLoginSuccess();
      } else {
        setVerificationError(
          resolveAuthErrorMessage(t, {
            code: result.errorCode,
            message: result.error,
            fallbackKey: 'verificationInvalidCode',
          }),
        );
      }
    } catch (error) {
      const err = error as { message?: string; errorCode?: string };
      setVerificationError(
        resolveAuthErrorMessage(t, {
          code: err.errorCode,
          message: err.message,
          fallbackKey: 'verificationInvalidCode',
        }),
      );
    } finally {
      setVerificationSubmitting(false);
    }
  }, [
    emailAuthService,
    config.navigation,
    config.emailAuth.enabledRegisterEmail,
    config.emailAuth.enabledRegisterUserName,
    name,
    email,
    password,
    t,
  ]);

  const handleCancelVerification = useCallback(() => {
    setVerificationSheetVisible(false);
    setVerificationError('');
    setVerificationSubmitting(false);
  }, []);

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
    verificationSheetVisible,
    verificationError,
    verificationSubmitting,
    handleConfirmVerificationCode,
    handleCancelVerification,
  };
};
