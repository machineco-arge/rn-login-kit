import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import {LoginKitTheme} from '../types';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';

interface PrivacyPolicyProps {
  theme: LoginKitTheme;
  isChecked: boolean;
  onCheckboxChange: (checked: boolean) => void;
  pressPrivacyPolicy: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  theme,
  isChecked,
  onCheckboxChange,
  pressPrivacyPolicy,
}) => {
  const colors = theme.colors;
  const {t} = useLoginKitTranslation('login');

  const styles = createStyles();

  return (
    <View style={styles.container}>
      <Checkbox
        value={isChecked}
        onValueChange={onCheckboxChange}
        tintColors={{
          true: colors.loginScreensPrivacyPolicyCheckTrueColor,
          false: colors.loginScreensPrivacyPolicyCheckFalseColor,
        }}
        style={styles.checkbox}
      />
      <TouchableOpacity
        style={styles.textContainer}
        onPress={pressPrivacyPolicy}>
        <Text style={[styles.text, {color: colors.loginScreensPrivacyPolicyCheckFalseColor}]}>
            <Text style={[styles.link, {color: colors.loginScreensPrivacyPolicyTextColor}]}>{t('PrivacyPolicy')}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginVertical: 20,
      marginHorizontal: 0,
      paddingHorizontal: 0,
      gap: 8,
    } as ViewStyle,
    checkbox: {
      marginTop: 2,
      marginLeft: 4,
      left: 12,
    } as ViewStyle,
    textContainer: {
      width: '80%',
    } as ViewStyle,
    text: {
      textAlign: 'center',
    } as TextStyle,
    link: {
      textDecorationLine: 'underline',
    } as TextStyle,
  });
