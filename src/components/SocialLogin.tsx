import React from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LoginKitTheme, SocialAuthConfig } from '../types';

interface SocialLoginProps {
  theme: LoginKitTheme;
  socialConfig: SocialAuthConfig;
  loading?: boolean;
  onGooglePress?: () => void;
  onApplePress?: () => void;
  googleText?: string;
  appleText?: string;
  GoogleIcon?: React.ComponentType<any>;
  AppleIcon?: React.ComponentType<any>;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  theme,
  socialConfig,
  loading = false,
  onGooglePress,
  onApplePress,
  googleText = "Sign in with Google",
  appleText = "Sign in with Apple",
  GoogleIcon,
  AppleIcon,
}) => {

  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.PRIMARY_400,
      opacity: loading ? 0.5 : 1,
      shadowColor: '#0A0D12',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    } as ViewStyle,
    iconContainer: {
      marginRight: 10,
    },
    text: {
      fontSize: 14,
      fontFamily: theme.fonts.primaryMedium,
      color: theme.colors.PRIMARY_600
    } as TextStyle,
  });

  if (!socialConfig.google?.enabled && !socialConfig.apple?.enabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Google Login Button */}
      {socialConfig.google?.enabled && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFFFFF' }]}
          onPress={onGooglePress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <>
              {GoogleIcon && (
                <View style={styles.iconContainer}>
                  <GoogleIcon />
                </View>
              )}
              <Text style={styles.text}>
                {googleText}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Apple Login Button */}
      {socialConfig.apple?.enabled && Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFFFFF' }]}
          onPress={onApplePress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#333" />
          ) : (
            <>
              {AppleIcon && (
                <View style={[styles.iconContainer, {left: -3}]}>
                  <AppleIcon />
                </View>
              )}
              <Text style={[styles.text, { left: -3 }]}>
                {appleText}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};