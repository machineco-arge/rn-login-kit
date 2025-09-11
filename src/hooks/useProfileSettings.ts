import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useCurrentUser } from './useCurrentUser';
import { userManager } from '../managers/UserManager';

export const useProfileSettings = () => {
  // Use custom hook for user management
  const { currentUser, setCurrentUser } = useCurrentUser();
  const isFocused = useIsFocused();

  // Focus-based refresh (fallback method) - Performance optimized
  useEffect(() => {
    if (isFocused) {
      // Single update when screen comes into focus
      // This catches any missed updates without continuous polling
      const latestUser = userManager.getCurrentUser();
      setCurrentUser(latestUser);
    }
  }, [isFocused]);

  return {
    userInfo: currentUser,
  };
};