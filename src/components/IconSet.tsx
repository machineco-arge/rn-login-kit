import React from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  PhoneIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon
} from 'react-native-heroicons/outline';
import {SunIcon, MoonIcon} from 'react-native-heroicons/solid';
import {LoginKitTheme} from '../types';

interface IconSetProps {
  type: string;
  theme: LoginKitTheme;
}

export const IconSet: React.FC<IconSetProps> = (props: IconSetProps) => {
  const {theme} = props;
  switch (props.type) {
    case 'User':
      return <UserIcon size={30} color={theme.colors.navbarUnselected} />;
    case 'Mail':
      return <EnvelopeIcon size={30} color={theme.colors.navbarUnselected} />;
    case 'Phone':
      return <PhoneIcon size={30} color={theme.colors.navbarUnselected} />;
    case 'Password':
      return <KeyIcon size={30} color={theme.colors.navbarUnselected} />;
    case 'Sun':
      return <SunIcon size={40} color={theme.colors.themeToggleCircle} />;
    case 'Moon':
      return <MoonIcon size={40} color={theme.colors.themeToggleCircle} />;
    case 'Reset':
      return <ArrowUturnLeftIcon size={25} color={theme.colors.resetColor} />;
    case 'EditPhoto':
      return <PencilSquareIcon size={25} color={theme.colors.editColor} />;
    case 'EditName':
      return <PencilSquareIcon size={18} color={theme.colors.editColor} />;
    case 'ImagePicker':
      return <PhotoIcon size={25} color={theme.colors.imagePickerColor} />;
    case 'Delete':
      return <TrashIcon size={25} color={theme.colors.deleteColor} />;
    default:
      return null;
  }
};
