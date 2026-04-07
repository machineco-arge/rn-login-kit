import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 24,
    },
    text: {
      fontFamily: theme.fonts.primaryRegular,
      fontSize: 14,
      color: theme.colors.PRIMARY_500,
      textAlign: 'center',
    },
    link: {
      fontFamily: theme.fonts.primaryMedium,
      fontSize: 14,
      color: theme.colors.PRIMARY_950,
      marginTop: 4,
    },
  });

  const isSignIn = screen === 'signIn';
  const questionText = isSignIn ? t('userSignInHaveNotAccount') || "Don't you have an account?" : t('userRegisterAlreadyHaveAccount');
  const actionText = isSignIn ? t('userRegister') || "Sign Up" : t('userSignIn');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{questionText}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.link}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
}; 