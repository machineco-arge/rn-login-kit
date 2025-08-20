import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LoginKitTheme } from '../types';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';

interface HaveAnAccountProps {
  theme: LoginKitTheme;
  screen: 'signIn' | 'register';
  onPress: () => void;
}

export const HaveAnAccount: React.FC<HaveAnAccountProps> = ({
  theme,
  screen,
  onPress,
}) => {

  const { t } = useLoginKitTranslation('login');

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  };

  const textStyle: TextStyle = {
    fontFamily: theme.fonts.primary,
    fontSize: 16,
    color: theme.colors.textSecondary,
  };

  const linkStyle: TextStyle = {
    fontFamily: theme.fonts.primary,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  };

  const isSignIn = screen === 'signIn';
  const questionText = isSignIn ? t('userSignInHaveNotAccount') : t('userRegisterAlreadyHaveAccount');
  const actionText = isSignIn ? t('userRegister') : t('userSignInLogin');

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{questionText}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={linkStyle}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
}; 