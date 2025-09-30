import React, {useState} from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {LoginKitTheme} from '../types';
import {IconSet} from './IconSet';

interface TextInputsLoginProps {
  theme: LoginKitTheme;
  type: 'User' | 'Mail' | 'Password' | 'Company';
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  passwordClose?: boolean;
  IconComponent?: React.ComponentType<{type: string; theme: LoginKitTheme}>;
}

export const TextInputsLogin: React.FC<TextInputsLoginProps> = ({
  theme,
  type,
  placeholder,
  value,
  onChangeText,
  passwordClose = false,
  IconComponent,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

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

  const isSecure = type === 'Password' ? !isPasswordVisible : passwordClose;

  const textInputStyle: TextStyle = {
    flex: 1,
    fontFamily:
      Platform.OS === 'android' && isSecure
        ? undefined
        : theme.fonts.primaryRegular,
    fontSize: 16,
    color: theme.colors.loginScreensTextInputTextColor,
    marginLeft: IconComponent ? 10 : 0,
  };

  const placeholderTextColor =
    theme.colors.loginScreensTextInputSecondaryTextColor;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={containerStyle}>
      {IconComponent && <IconComponent type={type} theme={theme} />}
      <TextInput
        key={isPasswordVisible ? 'visible' : 'hidden'}
        style={textInputStyle}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        keyboardType={type === 'Mail' ? 'email-address' : 'default'}
        autoCapitalize={type === 'Mail' ? 'none' : 'words'}
        autoComplete={
          type === 'Mail' ? 'email' : type === 'Password' ? 'password' : 'name'
        }
        textContentType={
          type === 'Password'
            ? isPasswordVisible
              ? 'none'
              : 'password'
            : type === 'Mail'
            ? 'emailAddress'
            : 'name'
        }
      />
      {type === 'Password' && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <IconSet
            type={isPasswordVisible ? 'EyeSlash' : 'Eye'}
            theme={theme}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};