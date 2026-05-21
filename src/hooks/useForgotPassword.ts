import { useCallback, useMemo, useRef, useState } from 'react';
import type { DualPasswordSubmitValues } from '../components/DualPasswordInputModal';
import { LoginKitConfig } from '../types';
import { EmailAuthService } from '../services/EmailAuthService';
import { resolveAuthErrorMessage } from '../utils/authApiErrors';
import { useLoginKitTranslation } from './useLoginKitTranslation';

interface UseForgotPasswordProps {
  config: LoginKitConfig;
  email: string;
  userName: string;
}

export const useForgotPassword = ({ config, email, userName }: UseForgotPasswordProps) => {
  const { t } = useLoginKitTranslation('login');
  const [loading, setLoading] = useState(false);

  const [verificationSheetVisible, setVerificationSheetVisible] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);

  const [newPasswordSheetVisible, setNewPasswordSheetVisible] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const openNewPasswordAfterVerifyRef = useRef(false);

  const [serverErrorVisible, setServerErrorVisible] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  const emailAuthService = useMemo(() => new EmailAuthService(config), [config]);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isForgotPasswordEnabled =
    config.emailAuth.enabledSignInEmail && emailRegex.test(email.trim());

  const showServerError = useCallback(
    (error?: string, errorCode?: string, fallbackKey = 'userSignInErrorAlertMessage') => {
      setServerErrorMessage(
        resolveAuthErrorMessage(t, { code: errorCode, message: error, fallbackKey }),
      );
      setServerErrorVisible(true);
    },
    [t],
  );

  const handleForgotPassword = useCallback(async () => {
    if (!isForgotPasswordEnabled) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      setLoading(true);
      const sendResult = await emailAuthService.sendPasswordResetCode(normalizedEmail);

      if (!sendResult.success) {
        showServerError(sendResult.error, sendResult.errorCode);
        return;
      }

      setVerificationError('');
      setPasswordResetToken(null);
      setVerificationSheetVisible(true);
    } catch (error) {
      showServerError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [isForgotPasswordEnabled, email, emailAuthService, showServerError]);

  const handleConfirmVerificationCode = useCallback(async (code: string) => {
    setVerificationError('');

    const trimmed = code.trim();
    if (!trimmed || trimmed.length !== 6) {
      setVerificationError(t('verificationEnterValidCode'));
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      setVerificationSubmitting(true);
      const verifyResult = await emailAuthService.verifyPasswordResetCode(
        normalizedEmail,
        trimmed,
      );

      if (!verifyResult.success || !verifyResult.passwordResetToken) {
        setVerificationError(
          resolveAuthErrorMessage(t, {
            code: verifyResult.errorCode,
            message: verifyResult.error,
            fallbackKey: 'verificationInvalidCode',
          }),
        );
        return;
      }

      setPasswordResetToken(verifyResult.passwordResetToken);
      setNewPasswordError('');
      openNewPasswordAfterVerifyRef.current = true;
      setVerificationSheetVisible(false);
    } catch (error) {
      setVerificationError(
        resolveAuthErrorMessage(t, {
          message: (error as Error).message,
          fallbackKey: 'verificationInvalidCode',
        }),
      );
    } finally {
      setVerificationSubmitting(false);
    }
  }, [email, emailAuthService, t]);

  const handleCancelVerification = useCallback(() => {
    openNewPasswordAfterVerifyRef.current = false;
    setVerificationSheetVisible(false);
    setVerificationError('');
    setVerificationSubmitting(false);
  }, []);

  const handleVerificationModalClosed = useCallback(() => {
    if (!openNewPasswordAfterVerifyRef.current) {
      return;
    }
    openNewPasswordAfterVerifyRef.current = false;
    setNewPasswordSheetVisible(true);
  }, []);

  const handleCancelNewPassword = useCallback(() => {
    setNewPasswordSheetVisible(false);
    setNewPasswordError('');
    setPasswordResetToken(null);
  }, []);

  const handleConfirmNewPassword = useCallback(
    async ({ password: newPassword, confirmPassword: confirmNewPassword }: DualPasswordSubmitValues) => {
      setNewPasswordError('');

      if (!newPassword || !confirmNewPassword) {
        setNewPasswordError(t('userSignInEnterEmailAndPasswordAlert'));
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setNewPasswordError(t('userRegisterPasswordsNotMatchErrorAlert'));
        return;
      }

      if (!passwordResetToken) {
        setNewPasswordError(t('verificationInvalidCode'));
        return;
      }

      const _email = config.emailAuth.enabledSignInEmail ? email.trim().toLowerCase() : 'tempName@example.com';
      const _userName = config.emailAuth.enabledSignInUserName ? userName : 'tempName';

      try {
        setPasswordSubmitting(true);
        const result = await emailAuthService.resetPasswordAndSignIn(
          _userName,
          _email,
          passwordResetToken,
          newPassword,
          confirmNewPassword,
        );

        if (result.success && result.user) {
          setNewPasswordSheetVisible(false);
          config.navigation.onLoginSuccess();
          return;
        }

        if (result.errorCode === 'invalid_credentials' || result.error === 'Şifre hatalı') {
          setNewPasswordSheetVisible(false);
          showServerError(undefined, undefined, 'passwordResetLoginFailed');
        } else if (
          result.errorCode === 'active_session' ||
          result.error === 'Zaten aktif bir oturum var.'
        ) {
          setNewPasswordSheetVisible(false);
          showServerError(undefined, undefined, 'userSignInErrorAlreadyActiveSession');
        } else {
          setNewPasswordError(
            resolveAuthErrorMessage(t, {
              code: result.errorCode,
              message: result.error,
              fallbackKey: 'userSignInErrorAlertMessage',
            }),
          );
        }
      } catch (error) {
        setNewPasswordError(
          resolveAuthErrorMessage(t, {
            message: (error as Error).message,
            fallbackKey: 'userSignInErrorAlertMessage',
          }),
        );
      } finally {
        setPasswordSubmitting(false);
      }
    },
    [
      passwordResetToken,
      email,
      userName,
      emailAuthService,
      config.navigation,
      config.emailAuth.enabledSignInEmail,
      config.emailAuth.enabledSignInUserName,
      showServerError,
      t,
    ],
  );

  return {
    loading,
    isForgotPasswordEnabled,
    handleForgotPassword,
    verificationSheetVisible,
    verificationError,
    verificationSubmitting,
    handleConfirmVerificationCode,
    handleCancelVerification,
    handleVerificationModalClosed,
    newPasswordSheetVisible,
    newPasswordError,
    passwordSubmitting,
    handleConfirmNewPassword,
    handleCancelNewPassword,
    serverErrorVisible,
    setServerErrorVisible,
    serverErrorMessage,
  };
};
