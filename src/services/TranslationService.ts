import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLocales} from 'react-native-localize';
import { TranslationAPIConfig } from '../types';

interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export class TranslationService {
  private static instance: TranslationService;
  private isInitialized = false;
  private baseLanguage = 'tr';

  // Supported languages list
  private supportedLanguages: SupportedLanguage[] = [
    {code: 'tr', name: 'Turkish', nativeName: 'Türkçe'},
    {code: 'en', name: 'English', nativeName: 'English'},
    {code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycanca'},
    {code: 'de', name: 'German', nativeName: 'Deutsch'},
    {code: 'es', name: 'Spanish', nativeName: 'Español'},
    {code: 'fr', name: 'French', nativeName: 'Français'},
    {code: 'it', name: 'Italian', nativeName: 'Italiano'},
    {code: 'pt', name: 'Portuguese', nativeName: 'Português'},
    {code: 'ru', name: 'Russian', nativeName: 'Русский'},
    {code: 'ja', name: 'Japanese', nativeName: '日本語'},
    {code: 'ko', name: 'Korean', nativeName: '한국어'},
    {code: 'zh', name: 'Chinese', nativeName: '中文'},
    {code: 'ar', name: 'Arabic', nativeName: 'العربية'},
  ];

  private constructor() {}

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  get initialized(): boolean {
    return this.isInitialized;
  }

  get baseLanguageCode(): string {
    return this.baseLanguage;
  }

  async initialize(config?: TranslationAPIConfig): Promise<void> {
    if (this.isInitialized) return;
    if (config) {
    }
    this.isInitialized = true;
    console.log('TranslationService initialized successfully (for language persistence).');
  }

  getDeviceLanguage(): string {
    const deviceLanguages = getLocales();
    const primaryDeviceLanguage = deviceLanguages[0]?.languageCode;
    
    if (!primaryDeviceLanguage) {
      return this.baseLanguage;
    }

    const isSupported = this.supportedLanguages.some(
      lang => lang.code === primaryDeviceLanguage,
    );
    
    if (isSupported) {
      return primaryDeviceLanguage;
    }

    for (const deviceLang of deviceLanguages) {
      const isDeviceLangSupported = this.supportedLanguages.some(
        lang => lang.code === deviceLang.languageCode,
      );
      if (isDeviceLangSupported) {
        return deviceLang.languageCode;
      }
    }
    return this.baseLanguage;
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return this.supportedLanguages;
  }

  async setUserLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem('user_preferred_language', language);
    } catch (error) {
      console.error('Error setting user language:', error);
    }
  }

  async getUserLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('user_preferred_language');
    } catch (error) {
      console.error('Error getting user language:', error);
      return null;
    }
  }

  async getEffectiveLanguage(): Promise<string> {
    const userLanguage = await this.getUserLanguage();
    if (userLanguage) {
      return userLanguage;
    }
    return this.getDeviceLanguage();
  }

  async getRemoteVersion(cdnUrl: string): Promise<string | null> {
    if (!cdnUrl) {
      console.warn('CDN URL was not provided. Cannot fetch version.');
      return null;
    }

    const manifestUrl = `${cdnUrl}/manifest.json`;
    console.log(`[Translation] Fetching version from: ${manifestUrl}`);

    try {
      // Use no-cache to ensure we always get the latest manifest file from the server
      const response = await fetch(manifestUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.statusText}`);
      }

      const manifest = await response.json();
      if (manifest && typeof manifest.version === 'string') {
        console.log(`[Translation] Fetched remote version: ${manifest.version}`);
        return manifest.version;
      }
      console.warn(
        '[Translation] Manifest file is invalid or does not contain a version key.',
      );
      return null;
    } catch (error) {
      console.error(
        '[Translation] Error fetching remote translation version:',
        error,
      );
      return null;
    }
  }

  async getStoredVersion(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('translation_version');
    } catch (error) {
      console.error(
        '[Translation] Error getting stored translation version:',
        error,
      );
      return null;
    }
  }

  async setStoredVersion(version: string): Promise<void> {
    try {
      await AsyncStorage.setItem('translation_version', version);
      console.log(`[Translation] Stored new version: ${version}`);
    } catch (error) {
      console.error(
        '[Translation] Error setting stored translation version:',
        error,
      );
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const translationKeys = keys.filter(key => key.startsWith('i18next_res_'));
      if (translationKeys.length > 0) {
        console.log('[Translation] Clearing cached translation keys:', translationKeys);
        await AsyncStorage.multiRemove(translationKeys);
      } else {
        console.log('[Translation] No translation cache keys found to clear.');
      }
    } catch (error) {
      console.error('[Translation] Error clearing translation cache:', error);
    }
  }
}

export const translationService = TranslationService.getInstance();
