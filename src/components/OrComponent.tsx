import React from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.PRIMARY_200,
    },
    text: {
      fontFamily: theme.fonts.primaryRegular,
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.PRIMARY_400,
      marginHorizontal: 12,
      textTransform: 'lowercase',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};