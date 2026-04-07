import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Easing,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';
import {LoginKitTheme} from '../types';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';

interface PrivacyPolicyProps {
  theme: LoginKitTheme;
  isChecked: boolean;
  onCheckboxChange: (checked: boolean) => void;
  pressPrivacyPolicy: () => void;
  triggerAnimation?: boolean;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  theme,
  isChecked,
  onCheckboxChange,
  pressPrivacyPolicy,
  triggerAnimation,
}) => {
  const {t} = useLoginKitTranslation('login');
  const colors = theme.colors;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (triggerAnimation) {
      setIsError(true);
      shakeAnimation.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(() => {
        setIsError(false);
      });
    }
  }, [triggerAnimation, shakeAnimation]);

  const animatedStyle = {
    transform: [{translateX: shakeAnimation}],
  };

  const styles = createStyles();

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Checkbox
        value={isChecked}
        onValueChange={onCheckboxChange}
        tintColors={{
          true: colors.PRIMARY_950,
          false: isError
            ? 'red'
            : colors.PRIMARY_300,
        }}
        style={styles.checkbox}
      />
      <TouchableOpacity
        style={styles.textContainer}
        onPress={pressPrivacyPolicy}>
        <Text
          style={[
            styles.text,
            {color: colors.PRIMARY_300},
          ]}>
          <Text
            style={[
              styles.link,
              {
                color: colors.PRIMARY_600,
                fontFamily: theme.fonts.primaryRegular,
              },
            ]}>
            {t('PrivacyPolicy')}
          </Text>
        </Text>
      </TouchableOpacity>
    </Animated.View>
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
      fontSize: 12,
      textDecorationLine: 'underline',
    } as TextStyle,
  });
