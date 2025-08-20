import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ChainedBackend from 'i18next-chained-backend';
import HttpApi from 'i18next-http-backend';
import AsyncStorageBackend from 'i18next-async-storage-backend2';
import { TranslationConfig } from '../types';

// Create a separate i18n instance for the login kit
export const loginKitI18n = i18n.createInstance();

/**
 * Initializes the i18n system using a CDN for translations.
 * @param translationConfig - Configuration for CDN, namespaces, etc.
 * @param cacheVersion - The version string to use for caching translations.
 * @param language - The explicit language to initialize with.
 */
export const initializeI18nWithCdn = async (
  translationConfig: TranslationConfig,
  cacheVersion: string,
  language: string,
): Promise<void> => {
  if (loginKitI18n.isInitialized) {
    console.log('i18n is already initialized.');
    return;
  }

  const { cdnUrl, namespaces } = translationConfig;
  
  await loginKitI18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: 'tr',
      
      // Namespaces to load
      ns: namespaces,
      defaultNS: translationConfig.defaultNS || (namespaces.includes('login') ? 'login' : namespaces[0]),

      // Bundled resources are removed. All translations are loaded from the backend.
      // resources: appTranslations.resources,

      // Chained Backend Configuration
      backend: {
        // List of backends to use
        backends: [
          AsyncStorageBackend, // First, try to load from cache
          HttpApi,             // If not found, download from CDN
        ],
        // Options for each backend
        backendOptions: [
          {
            // Options for AsyncStorageBackend
            prefix: 'i18next_res_',
            // expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 days
            defaultVersion: cacheVersion,
          },
          {
            // Options for HttpApi
            loadPath: `${cdnUrl}/{{ns}}/{{lng}}.json?v=${cacheVersion}`,
            // Add cache-busting request options to ensure fresh data is always fetched from the CDN.
            // 'reload' is the correct, forceful instruction for React Native's fetch API.
            requestOptions: {
              cache: 'reload',
            },
            parse: (data: string) => {
              const recursiveParse = (obj: any): any => {
                // If it's not an object, return as is.
                if (typeof obj !== 'object' || obj === null) {
                  return obj;
                }

                // If it's a translation entry, return the translation string.
                if ('translation' in obj && 'sourceHash' in obj) {
                  return obj.translation;
                }

                // If it's an object of other objects, recurse.
                const newObj: { [key: string]: any } = {};
                for (const key in obj) {
                  newObj[key] = recursiveParse(obj[key]);
                }
                return newObj;
              };

              try {
                const resources = JSON.parse(data);
                return recursiveParse(resources);
              } catch (e) {
                console.error("Failed to parse translation JSON:", e);
                return {};
              }
            },
          },
        ],
        // Only cache data when it comes from a backend further down the chain (HttpApi)
        saveOn: 'backend',
      },

      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: 'v4',
    });

  // The 'initialized' event handler is removed as we now await the init() promise directly.
  // The logic will be handled by the calling function.
};
