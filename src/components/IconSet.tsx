import React from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  PhoneIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
  BuildingLibraryIcon
} from 'react-native-heroicons/outline';
import {SunIcon, MoonIcon, UserCircleIcon} from 'react-native-heroicons/solid';
import {LoginKitTheme} from '../types';

interface IconSetProps {
  type: string;
  theme: LoginKitTheme;
}

export const IconSet: React.FC<IconSetProps> = (props: IconSetProps) => {
  const {theme} = props;
  switch (props.type) {
    case 'User':
      return <UserIcon size={30} color={theme.colors.iconSetSignInAndSignUpScreenIconsColor} />;
    case 'UserXL':
      return <UserCircleIcon size={45} color={theme.colors.iconSetProfileSettingsPpIconColor} />;
    case 'Mail':
      return <EnvelopeIcon size={30} color={theme.colors.iconSetSignInAndSignUpScreenIconsColor} />;
    case 'Phone':
      return <PhoneIcon size={30} color={theme.colors.iconSetSignInAndSignUpScreenIconsColor} />;
    case 'Password':
      return <KeyIcon size={30} color={theme.colors.iconSetSignInAndSignUpScreenIconsColor} />;
    case 'Company':
      return <BuildingLibraryIcon size={25} color={theme.colors.iconSetSignInAndSignUpScreenIconsColor} />;
    case 'Sun':
      return <SunIcon size={40} color={theme.colors.iconSetThemeScreenIconsColor} />;
    case 'Moon':
      return <MoonIcon size={40} color={theme.colors.iconSetThemeScreenIconsColor} />;
    case 'Reset':
      return <ArrowUturnLeftIcon size={25} color={theme.colors.iconSetAccountScreenResetColor} />;
    case 'EditPhoto':
      return <PencilSquareIcon size={25} color={theme.colors.iconSetAccountScreenEditColor} />;
    case 'EditName':
      return <PencilSquareIcon size={18} color={theme.colors.iconSetAccountScreenEditColor} />;
    case 'ImagePicker':
      return <PhotoIcon size={25} color={theme.colors.iconSetAccountScreenImagePickerColor} />;
    case 'Delete':
      return <TrashIcon size={25} color={theme.colors.iconSetAccountScreenDeleteColor} />;
    default:
      return null;
  }
};
