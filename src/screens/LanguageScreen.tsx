import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {ScreenProps} from '../types';
import {createLanguageScreenStyles} from '../utils/styles';
import {useAutoTranslation} from '../hooks/useAutoTranslation';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { CustomBottomSheet } from '..';

export interface LanguageScreenProps extends ScreenProps {
  navigateBackIcon?: React.JSX.Element;
  backgroundImage?: any;
  backgroundSvg?: () => React.JSX.Element;
  iconCheck?: React.JSX.Element;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  config,
  navigateBackIcon,
  backgroundImage,
  iconCheck,
  backgroundSvg,
}) => {
  const navigation = useNavigation();
  const styles = createLanguageScreenStyles(config.theme);
  const {
    currentLanguage,
    supportedLanguages,
    isChangingLanguage,
    changeLanguage,
  } = useAutoTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [languageChangeSuccess, setLanguageChangeSuccess] = useState<boolean>(false);
  const [languageChangeError, setLanguageChangeError] = useState<boolean>(false);
  const {t} = useLoginKitTranslation('login');

  // Sync selectedLanguage with currentLanguage when it changes
  React.useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === currentLanguage || isChangingLanguage) return;

    setSelectedLanguage(languageCode);
    console.log('Applying language change to:', languageCode);

    try {
      await changeLanguage(languageCode);
      setLanguageChangeSuccess(true);
    } catch (error) {
      console.error('Error auto-applying language:', error);
      setLanguageChangeError(true);
      setSelectedLanguage(currentLanguage); // revert selection
    }
  };

  const renderTranslationProgress = () => {
    if (!isChangingLanguage) return null;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            {t('translatingContent')}...
          </Text>
          <ActivityIndicator size="small" color={config.theme.colors.text} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      {backgroundSvg && backgroundSvg()}
      {backgroundImage && !backgroundSvg && (
        <FastImage
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {navigateBackIcon}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('language') || 'LANGUAGE'}</Text>
        </View>
      </View>

      <View style={styles.selectLanguageContainer}>
        <Text style={styles.selectLanguageText}>{t('selectLanguage') || 'Select language'}</Text>
      </View>

      {/* Language List */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.languageList}>
          {supportedLanguages.map(language => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageItem,
                isChangingLanguage && styles.disabledItem,
              ]}
              onPress={() => handleLanguageSelect(language.code)}
              disabled={isChangingLanguage}
              activeOpacity={0.7}>
              <View style={styles.languageContent}>
                <View style={styles.languageTextContainer}>
                  <Text style={[styles.languageName, selectedLanguage === language.code && styles.selectedLanguageText]}>
                    {language.nativeName}
                  </Text>
                  <Text style={styles.languageEnglishName}>
                    {language.name}
                  </Text>
                </View>
                {selectedLanguage === language.code && (
                  <View style={styles.checkIconContainer}>
                    {iconCheck ? iconCheck : <Text>✓</Text>}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderTranslationProgress()}

      {/* Language Change Success Alert */}
      <CustomBottomSheet
        config={config}
        visible={languageChangeSuccess}
        title={t('languageChanged')}
        message={t('languageChangedMessage')}
        onOK={() => setLanguageChangeSuccess(false)}
        okText={t('ok')}
      />

      {/* Language Change Error Alert */}
      <CustomBottomSheet
        config={config}
        visible={languageChangeError}
        title={t('_error_')}
        message={t('languageChangeError')}
        onOK={() => setLanguageChangeError(false)}
        okText={t('ok')}
      />
    </View>
  );
};
