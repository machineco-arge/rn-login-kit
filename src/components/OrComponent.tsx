import React from 'react';
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LoginKitTheme } from '../types';

interface OrComponentProps {
  theme: LoginKitTheme;
  text?: string;
}

export const OrComponent: React.FC<OrComponentProps> = ({
  theme,
  text = 'or',
}) => {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  };

  const lineStyle: ViewStyle = {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.loginScreensTextInputBorderColor,
  };

  const textStyle: TextStyle = {
    fontFamily: theme.fonts.primary,
    fontSize: 16,
    color: theme.colors.loginScreensHaveAnAccountTextColor,
    marginHorizontal: 16,
    textTransform: 'lowercase',
  };

  return (
    <View style={containerStyle}>
      <View style={lineStyle} />
      <Text style={textStyle}>{text}</Text>
      <View style={lineStyle} />
    </View>
  );
}; 