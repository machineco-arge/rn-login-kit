import { useState, useMemo } from 'react';
import { SocialAuthService } from '../services/SocialAuthService';
import { LoginKitConfig } from '../types';

interface UseSocialAuthProps {
  config: LoginKitConfig;
  isPrivacyChecked: boolean;
}

export const useSocialAuth = ({ config, isPrivacyChecked }: UseSocialAuthProps) => {
  const [isSocialLoginLoading, setIsSocialLoginLoading] = useState(false);

  // Initialize Social Auth Service
  const socialAuthService = useMemo(() => {
    return new SocialAuthService(
      config.socialAuth,
      config.apiConfig,
      config.navigation.onGetUserName,
    );
  }, [config.socialAuth, config.apiConfig, config.navigation.onGetUserName]);

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (!isPrivacyChecked && config.privacy.required) {
      return;
    }

    try {
      setIsSocialLoginLoading(true);

      let result;
      if (provider === 'google') {
        result = await socialAuthService.signInWithGoogle();
      } else {
        result = await socialAuthService.signInWithApple();
      }

      if (result.success && result.user) {
        config.navigation.onLoginSuccess();
      } else {
        console.log('Social login failed:', result.error);
      }
    } catch (error) {
      console.log('Social login error:', (error as Error).message);
    } finally {
      setIsSocialLoginLoading(false);
    }
  };

  return {
    isSocialLoginLoading,
    socialAuthService,
    handleSocialLogin,
  };
}; 