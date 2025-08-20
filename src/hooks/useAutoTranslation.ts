import { useState, useEffect, useCallback } from 'react';
import { translationService } from '../services/TranslationService';
import { loginKitI18n, initializeI18nWithCdn } from '../config/i18n';
import { LoginKitConfig } from '../types';

interface UseAutoTranslationReturn {
  currentLanguage: string;
  supportedLanguages: Array<{ code: string; name: string; nativeName: string }>;
  isChangingLanguage: boolean;
  changeLanguage: (languageCode: string) => Promise<void>;
  initializeAutoTranslation: (config: LoginKitConfig) => Promise<void>;
}

export const useAutoTranslation = (): UseAutoTranslationReturn => {
  const [currentLanguage, setCurrentLanguage] = useState(loginKitI18n.language || 'tr');
  const [supportedLanguages] = useState(translationService.getSupportedLanguages());
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const initializeAutoTranslation = useCallback(async (config: LoginKitConfig) => {
    if (loginKitI18n.isInitialized) return;

    try {
      const {translationConfig} = config;
      if (!translationConfig?.cdnUrl) {
        console.error('Translation CDN URL is not configured. Aborting.');
        return;
      }

      // 1. Determine the correct language to use *before* anything else.
      const languageToUse = await translationService.getEffectiveLanguage();
      console.log(`[Translation] Effective language determined: ${languageToUse}`);

      // 2. Check versions.
      const remoteVersion = await translationService.getRemoteVersion(
        translationConfig.cdnUrl,
      );
      const localVersion = await translationService.getStoredVersion();
      console.log(
        `[Translation] Versions - Local: ${
          localVersion || 'none'
        }, Remote: ${remoteVersion || 'none'}`,
      );

      const newVersionAvailable = remoteVersion && remoteVersion !== localVersion;

      // If a new version is available, clear the cache before initializing i18n.
      // This forces i18next to fetch the new translations from the CDN.
      if (newVersionAvailable) {
        console.log(`[Translation] New version ${remoteVersion} detected. Clearing cache.`);
        await translationService.clearCache();
      }

      // 3. Determine the definitive version to use for this session.
      const versionToUse = remoteVersion || localVersion || 'v1.0.0';

      // 4. Initialize i18next exactly ONCE with the correct version AND language.
      await initializeI18nWithCdn(
        translationConfig,
        versionToUse,
        languageToUse,
      );
      await translationService.initialize(translationConfig.apiConfig);

      // 5. If a new version was loaded, store it for the next launch.
      if (newVersionAvailable) {
        console.log(
          `[Translation] New version ${remoteVersion} was loaded. Storing for next launch.`,
        );
        await translationService.setStoredVersion(remoteVersion);
      }

      // 6. Sync React state with the now-initialized i18next instance.
      setCurrentLanguage(loginKitI18n.language);

    } catch (error) {
      console.error('Error during auto-translation initialization:', error);
      // Fallback for catastrophic failure
      if (!loginKitI18n.isInitialized && config.translationConfig) {
        const localVersion = await translationService.getStoredVersion();
        const lang = await translationService.getEffectiveLanguage();
        await initializeI18nWithCdn(
          config.translationConfig,
          localVersion || 'v1.0.0',
          lang,
        );
      }
    }
  }, []);

  const changeLanguage = useCallback(async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      console.log(`Language is already set to ${languageCode}.`);
      return;
    }

    console.log(`Requesting language change to: ${languageCode}`);
    setIsChangingLanguage(true);
    try {
      await loginKitI18n.changeLanguage(languageCode);
      await translationService.setUserLanguage(languageCode);
      // The 'languageChanged' event will update the state
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      // The 'languageChanged' event listener will set this to false
    }
  }, [currentLanguage]);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log(`i18n language changed to: ${lng}`);
      setCurrentLanguage(lng);
      setIsChangingLanguage(false);
    };

    loginKitI18n.on('languageChanged', handleLanguageChange);

    // Initial sync
    if (loginKitI18n.isInitialized && loginKitI18n.language) {
      setCurrentLanguage(loginKitI18n.language);
    }

    return () => {
      loginKitI18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return {
    currentLanguage,
    supportedLanguages,
    isChangingLanguage,
    changeLanguage,
    initializeAutoTranslation,
  };
}; 