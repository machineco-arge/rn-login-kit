import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type AuthType = 'signIn' | 'register' | null;

interface AuthBottomSheetContextType {
  openSignIn: (onSuccess?: () => void) => void;
  openRegister: (onSuccess?: () => void) => void;
  closeAuth: () => void;
  authType: AuthType;
  isVisible: boolean;
  onSuccess: () => void;
}

const AuthBottomSheetContext = createContext<AuthBottomSheetContextType | undefined>(undefined);

export const useAuthBottomSheet = () => {
  const context = useContext(AuthBottomSheetContext);
  if (!context) {
    throw new Error('useAuthBottomSheet must be used within a AuthBottomSheetProvider');
  }
  return context;
};

export const AuthBottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authType, setAuthType] = useState<AuthType>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | undefined>(undefined);

  const openSignIn = useCallback((onSuccess?: () => void) => {
    setOnSuccessCallback(() => onSuccess);
    setAuthType('signIn');
  }, []);

  const openRegister = useCallback((onSuccess?: () => void) => {
    setOnSuccessCallback(() => onSuccess);
    setAuthType('register');
  }, []);

  const closeAuth = useCallback(() => {
    setAuthType(null);
    setOnSuccessCallback(undefined);
  }, []);

  const handleSuccess = useCallback(() => {
    setAuthType(null);
    if (onSuccessCallback) {
      onSuccessCallback();
    }
    setOnSuccessCallback(undefined);
  }, [onSuccessCallback]);

  const value = useMemo(() => ({
    openSignIn,
    openRegister,
    closeAuth,
    authType,
    isVisible: authType !== null,
    onSuccess: handleSuccess,
  }), [openSignIn, openRegister, closeAuth, authType, handleSuccess]);

  return (
    <AuthBottomSheetContext.Provider value={value}>
      {children}
    </AuthBottomSheetContext.Provider>
  );
};
