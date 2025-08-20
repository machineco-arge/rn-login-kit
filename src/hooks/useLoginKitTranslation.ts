import { useTranslation } from 'react-i18next';
import {loginKitI18n} from '../config/i18n';

export const useLoginKitTranslation = (namespace: string = 'login') => {
  const { t, i18n } = useTranslation(namespace, { i18n: loginKitI18n });
  
  return { t, i18n };
};