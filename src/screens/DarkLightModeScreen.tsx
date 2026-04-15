import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {LoginKitConfig} from '../types';
import {createDarkLightModeScreenStyles} from '../utils/styles';
import {useDarkLightMode} from '../hooks/useDarkLightMode';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

interface DarkLightModeScreenProps {
  config: LoginKitConfig;
  backgroundImage?: any;
  backgroundSvg?: () => React.JSX.Element;
  navigateBackIcon?: React.JSX.Element;
  iconSelected?: React.JSX.Element;
  iconThemeSun: React.ComponentType<any>;
  iconThemeMoon: React.ComponentType<any>;
}

export const DarkLightModeScreen: React.FC<DarkLightModeScreenProps> = ({
  config,
  backgroundImage,
  backgroundSvg,
  navigateBackIcon,
  iconSelected,
  iconThemeSun,
  iconThemeMoon,
}) => {
  const {t} = useLoginKitTranslation('login');
  const {theme, toggleTheme} = useDarkLightMode();
  const styles = createDarkLightModeScreenStyles(config.theme);
  const navigation = useNavigation();
  const IconThemeSun = iconThemeSun;
  const IconThemeMoon = iconThemeMoon;

  const themes = [
    {id: 'light', label: t('_theme_lightMode'), icon: <IconThemeSun selected={theme === 'light'} colors={config.theme.colors} />},
    {id: 'dark', label: t('_theme_darkMode'), icon: <IconThemeMoon selected={theme === 'dark'} colors={config.theme.colors} />},
  ];

  const handleThemeChange = (selectedTheme: string) => {
    if (selectedTheme !== theme) {
      toggleTheme();
    }
  };

  return (
    <View style={styles.container}>
      {backgroundSvg && backgroundSvg()}
      {backgroundImage && !backgroundSvg && (
        <FastImage
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {navigateBackIcon}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('_settings_darkOrLightModeSettings') || 'THEME SETTINGS'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t('_settings_darkOrLightModeSettings') || 'Select theme'}</Text>
        
        {themes.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listItem}
            onPress={() => handleThemeChange(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.listItemLeft}>
              <View style={styles.itemIcon}>{item.icon}</View>
              <Text style={[styles.itemLabel, theme === item.id && styles.itemLabelSelected]}>{item.label}</Text>
            </View>
            {theme === item.id && (
              <View style={styles.checkIcon}>{iconSelected}</View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}; 