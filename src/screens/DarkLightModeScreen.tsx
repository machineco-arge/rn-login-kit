import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import {LinearGradient} from 'react-native-gradients';
import {ScreenProps} from '../types';
import {createDarkLightModeScreenStyles} from '../utils/styles';
import {useDarkLightMode} from '../hooks/useDarkLightMode';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';
import { IconSet } from '../components/IconSet';

export const DarkLightModeScreen: React.FC<ScreenProps> = ({
  config,
}) => {
  const {t} = useLoginKitTranslation('login');
  const {animatedStyle, theme, toggleTheme} = useDarkLightMode();
  const styles = createDarkLightModeScreenStyles(config.theme);

  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <LinearGradient
          angle={45}
          colorList={config.theme.colors.gradient.map((color, index) => ({
            color,
            offset: `${
              (index / (config.theme.colors.gradient.length - 1)) * 100
            }%`,
            opacity: '1',
          }))}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('_settings_darkOrLightModeSettings')}</Text>
        <Text style={styles.subHeaderText}>{t('_theme_switchTheme')}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          {theme === 'light' ? (
            <IconSet type={'Sun'} theme={config.theme} />
          ) : (
            <IconSet type={'Moon'} theme={config.theme} />
          )}
        </View>

        <TouchableOpacity style={styles.toggleContainer} onPress={toggleTheme}>
          <Animated.View style={[styles.toggleCircle, animatedStyle]} />
        </TouchableOpacity>

        <Text style={styles.toggleText}>
          {theme === 'light' ? t('_theme_lightMode') : t('_theme_darkMode')}
        </Text>
      </View>
    </View>
  );
}; 