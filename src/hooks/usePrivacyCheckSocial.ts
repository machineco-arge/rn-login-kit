import {useState} from 'react';

interface UsePrivacyCheckSocialProps {
  isPrivacyRequired: boolean | undefined;
  handleSocialLogin: (provider: "apple" | "google") => Promise<void>
}

export const usePrivacyCheckSocial = ({
  isPrivacyRequired, handleSocialLogin
}: UsePrivacyCheckSocialProps) => {
  const [visiblePrivacyAlert, setVisiblePrivacyAlert] = useState(false);
  const [myProvider, setMyProvider] = useState<'apple' | 'google' | null>(null)

  const handleVisiblePrivacyAlert = (provider: 'apple' | 'google') => {
    setMyProvider(provider);
    console.log('provider is: ', myProvider)
    if(isPrivacyRequired) {
      setVisiblePrivacyAlert(true);
    } else {

      handleSocialLogin(provider);
    }
  }

  const handleAcceptAndContinue = () => {
    console.log('Pressed Accept and Continue');

    if(!myProvider) {
      console.log('Provider is null');
      return;
    };
    
    setVisiblePrivacyAlert(false);
    handleSocialLogin(myProvider);
  }

  return {
    visiblePrivacyAlert, setVisiblePrivacyAlert,
    handleVisiblePrivacyAlert, handleAcceptAndContinue
  };
};
