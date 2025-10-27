import {useRef, useState} from 'react';

interface UsePrivacyCheckSocialProps {
  isPrivacyRequired: boolean | undefined;
  pressPrivacyPolicy: () => void;
  handleSocialLogin: (provider: "apple" | "google") => Promise<void>
}

export const usePrivacyCheckSocial = ({
  isPrivacyRequired, handleSocialLogin, pressPrivacyPolicy
}: UsePrivacyCheckSocialProps) => {
  const [visiblePrivacyAlert, setVisiblePrivacyAlert] = useState(false);
  const myProvider = useRef<'apple' | 'google' | null>(null);

  const handleVisiblePrivacyAlert = (provider: 'apple' | 'google') => {
    myProvider.current = provider;
    console.log('provider is: ', myProvider.current)
    if(isPrivacyRequired) {
      setVisiblePrivacyAlert(true);
    } else {

      handleSocialLogin(provider);
    }
  }

  const handleAcceptAndContinue = () => {
    console.log('Pressed Accept and Continue');

    if(!myProvider.current) {
      console.log('Provider is null');
      return;
    };
    
    setVisiblePrivacyAlert(false);
    handleSocialLogin(myProvider.current);
  }

  const handleInspect = () => {
    setVisiblePrivacyAlert(false);
    pressPrivacyPolicy();
  }

  return {
    visiblePrivacyAlert, setVisiblePrivacyAlert, handleInspect,
    handleVisiblePrivacyAlert, handleAcceptAndContinue
  };
};
