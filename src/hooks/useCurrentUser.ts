import { useState, useEffect } from 'react';
import { IUserInfo } from '../types';
import { userManager } from '../managers/UserManager';

interface UseCurrentUserReturn {
  currentUser: IUserInfo | null;
  setCurrentUser: (user: IUserInfo | null) => void;
  hasCustomPhoto: boolean;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
  const [currentUser, setCurrentUser] = useState<IUserInfo | null>(
    userManager.getCurrentUser(),
  );

  useEffect(() => {
    // Subscribe to user changes
    const unsubscribe = userManager.subscribe((updatedUser: IUserInfo | null) => {
      setCurrentUser(updatedUser);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    currentUser,
    setCurrentUser,
    hasCustomPhoto: userManager.hasCustomPhoto(),
  };
}; 