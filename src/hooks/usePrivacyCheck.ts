import {useState} from 'react';

interface UsePrivacyCheckProps {
  isPrivacyChecked: boolean;
  isPrivacyRequired: boolean | undefined;
}

export const usePrivacyCheck = ({
  isPrivacyChecked,
  isPrivacyRequired,
}: UsePrivacyCheckProps) => {
  const [animatePrivacyPolicy, setAnimatePrivacyPolicy] = useState(false);

  const handlePressWithPrivacyCheck = (action: () => void) => {
    if (!isPrivacyChecked && isPrivacyRequired) {
      setAnimatePrivacyPolicy(true);
      setTimeout(() => {
        setAnimatePrivacyPolicy(false);
      }, 1000);
    } else {
      action();
    }
  };

  return {
    animatePrivacyPolicy,
    handlePressWithPrivacyCheck,
  };
};
