import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {LinearGradient} from 'react-native-gradients';
import {ScreenProps} from '../types';
import {createLanguageScreenStyles} from '../utils/styles';
import {useAutoTranslation} from '../hooks/useAutoTranslation';
import {useLoginKitTranslation} from '../hooks/useLoginKitTranslation';
import { CustomAlert } from '..';

export const LanguageScreen: React.FC<ScreenProps> = ({config}) => {
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

  const handleLanguageSelect = (languageCode: string) => {
    console.log('Language selected:', languageCode);
    setSelectedLanguage(languageCode);
  };

  const handleApplyLanguage = async () => {
    if (selectedLanguage === currentLanguage) {
      console.log('Selected language is same as current, no change needed');
      return;
    }

    console.log('Applying language change to:', selectedLanguage);

    try {
      await changeLanguage(selectedLanguage);
      setLanguageChangeSuccess(true);
    } catch (error) {
      console.error('Error in handleApplyLanguage:', error);
      setLanguageChangeError(true);
    }
  };


  const getLanguageFlag = (code: string) => {
    const flags: {[key: string]: string} = {
      tr: '🇹🇷',
      en: '🇬🇧',
      az: '🇦🇿',
      de: '🇩🇪',
      es: '🇪🇸',
      fr: '🇫🇷',
      it: '🇮🇹',
      pt: '🇵🇹',
      ru: '🇷🇺',
      ja: '🇯🇵',
      ko: '🇰🇷',
      zh: '🇨🇳',
      ar: '🇸🇦',
    };
    return flags[code] || '🌐';
  };

  const renderTranslationProgress = () => {
    if (!isChangingLanguage) return null;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <ActivityIndicator size="small" color={config.theme.colors.text} />
          <Text style={styles.progressTitle}>
            {t('translatingContent')}...
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
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

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('languageSettings')}</Text>
      </View>

      {renderTranslationProgress()}

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
                selectedLanguage === language.code &&
                  styles.selectedLanguageItem,
                currentLanguage === language.code && styles.currentLanguageItem,
                isChangingLanguage && styles.disabledItem,
              ]}
              onPress={() => handleLanguageSelect(language.code)}
              disabled={isChangingLanguage}
              activeOpacity={0.7}>
              <View style={styles.languageContent}>
                <Text style={styles.languageFlag}>
                  {getLanguageFlag(language.code)}
                </Text>
                <View style={styles.languageTextContainer}>
                  <Text
                    style={[
                      styles.languageName,
                      selectedLanguage === language.code &&
                        styles.selectedLanguageText,
                      currentLanguage === language.code &&
                        styles.currentLanguageText,
                    ]}>
                    {language.nativeName}
                  </Text>
                  <Text
                    style={[
                      styles.languageEnglishName,
                      selectedLanguage === language.code &&
                        styles.selectedLanguageTextSecondary,
                    ]}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <View style={styles.currentIndicator}>
                    <Text style={styles.currentIndicatorText}>✓</Text>
                  </View>
                )}
                {selectedLanguage === language.code &&
                  selectedLanguage !== currentLanguage && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIndicatorText}>○</Text>
                    </View>
                  )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.applyButton,
            (isChangingLanguage || selectedLanguage == currentLanguage) &&
              styles.disabledButton,
          ]}
          onPress={handleApplyLanguage}
          disabled={isChangingLanguage || selectedLanguage == currentLanguage}>
          {isChangingLanguage ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.loadingText}>
                {t('applying')}
              </Text>
            </View>
          ) : (
            <Text style={styles.applyButtonText}>{t('applyLanguage')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Language Change Success Alert */}
      <CustomAlert
        theme={config.theme}
        visible={languageChangeSuccess}
        title={t('languageChanged')}
        message={t('languageChangedMessage')}
        onOK={() => setLanguageChangeSuccess(false)}
        okText={t('ok')}
      />

      {/* Language Change Error Alert */}
      <CustomAlert
        theme={config.theme}
        visible={languageChangeError}
        title={t('_error_')}
        message={t('languageChangeError')}
        onOK={() => setLanguageChangeError(false)}
        okText={t('ok')}
      />
    </View>
  );
};
