import React from 'react';
import {
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { LoginKitTheme } from '../types';

interface LoadingIndicatorProps {
  theme: LoginKitTheme;
  size?: 'small' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  theme,
  size = 'large',
}) => {
  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  };

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
    </View>
  );
}; 