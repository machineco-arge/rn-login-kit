import React from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LoginKitTheme } from '../types';

interface TextInputsLoginProps {
  theme: LoginKitTheme;
  type: 'User' | 'Mail' | 'Password';
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  IconComponent?: React.ComponentType<{ type: string; theme: LoginKitTheme }>;
}

export const TextInputsLogin: React.FC<TextInputsLoginProps> = ({
  theme,
  type,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  IconComponent,
}) => {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.loginScreensTextInputBgColor,
    borderWidth: 1,
    borderColor: theme.colors.loginScreensTextInputBorderColor,
    borderRadius: theme.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontFamily: theme.fonts.primary,
    fontSize: 16,
    color: theme.colors.loginScreensTextInputTextColor,
    marginLeft: IconComponent ? 10 : 0,
  };

  const placeholderTextColor = theme.colors.loginScreensTextInputSecondaryTextColor;

  return (
    <View style={containerStyle}>
      {IconComponent && (
        <IconComponent type={type} theme={theme} />
      )}
      <TextInput
        style={textInputStyle}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={type === 'Mail' ? 'email-address' : 'default'}
        autoCapitalize={type === 'Mail' ? 'none' : 'words'}
        autoComplete={
          type === 'Mail' 
            ? 'email' 
            : type === 'Password' 
            ? 'password' 
            : 'name'
        }
        textContentType={
          type === 'Mail' 
            ? 'emailAddress' 
            : type === 'Password' 
            ? 'password' 
            : 'name'
        }
      />
    </View>
  );
}; 