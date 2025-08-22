import React from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LoginKitTheme, SocialAuthConfig } from '../types';

interface SocialLoginProps {
  theme: LoginKitTheme;
  socialConfig: SocialAuthConfig;
  disabled?: boolean;
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
  disabled = false,
  loading = false,
  onGooglePress,
  onApplePress,
  googleText = "Continue with Google",
  appleText = "Continue with Apple",
  GoogleIcon,
  AppleIcon,
}) => {
  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 16,
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.loginScreensTextInputBorderColor,
    opacity: disabled || loading ? 0.5 : 1,
  };

  const textStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.primarySemiBold,
    fontWeight: '500',
    marginLeft: 2,
    textAlign: 'left',
  };

  if (!socialConfig.google?.enabled && !socialConfig.apple?.enabled) {
    return null;
  }

  return (
    <View style={{ gap: 16 }}>
      {/* Google Login Button */}
      {socialConfig.google?.enabled && (
        <TouchableOpacity
          style={[
            buttonStyle,
            { backgroundColor: '#ffffff' }
          ]}
          onPress={onGooglePress}
          disabled={disabled || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <>
              {GoogleIcon && (
                <View style={{ marginLeft: 12, }}>
                  <GoogleIcon />
                </View>
              )}
              <Text
                style={[
                  textStyle,
                  { color: '#333333' }
                ]}
              >
                {googleText}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Apple Login Button */}
      {socialConfig.apple?.enabled && Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[
            buttonStyle,
            { backgroundColor: '#000000' }
          ]}
          onPress={onApplePress}
          disabled={disabled || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              {AppleIcon && (
                <View style={{ marginLeft: 12 }}>
                  <AppleIcon />
                </View>
              )}
              <Text
                style={[
                  textStyle,
                  { color: '#ffffff' }
                ]}
              >
                {appleText}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}; 