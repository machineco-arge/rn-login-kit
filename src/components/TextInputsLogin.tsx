import React, {useState} from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  StyleSheet,
  Text,
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
  errorText?: string;
}

export const TextInputsLogin: React.FC<TextInputsLoginProps> = ({
  theme,
  type,
  placeholder,
  value,
  onChangeText,
  passwordClose = false,
  errorText,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const isSecure = type === 'Password' ? !isPasswordVisible : passwordClose;

  const placeholderTextColor =
    theme.colors.PRIMARY_400;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: errorText ? theme.colors.PRIMARY_50 : theme.colors.TERTIARY_TEXT_LIGHT,
      borderWidth: 1,
      borderColor: errorText ? '#B91C1C' : theme.colors.PRIMARY_200,
      borderRadius: 4,
      paddingHorizontal: 16,
      height: 40,
    } as ViewStyle,
    textInput: {
      flex: 1,
      fontFamily: theme.fonts.primaryRegular,
      fontSize: 14,
      color: theme.colors.PRIMARY_950,
    } as TextStyle,
    errorLabel: {
      color: '#B91C1C',
      fontSize: 12,
      fontFamily: theme.fonts.primaryRegular,
      marginTop: 4,
    } as TextStyle,
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          key={isPasswordVisible ? 'visible' : 'hidden'}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={type === 'Password' ? 'default' : type === 'Mail' ? 'email-address' : 'default'}
          autoCapitalize={type === 'Password' ? 'none' : type === 'Mail' ? 'none' : 'none'}
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
      {!!errorText && <Text style={styles.errorLabel}>{errorText}</Text>}
    </View>
  );
};