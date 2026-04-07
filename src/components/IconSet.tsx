import React from 'react';
import {EyeIcon, EyeSlashIcon} from 'react-native-heroicons/solid';
import {LoginKitTheme} from '../types';

interface IconSetProps {
  type: string;
  theme: LoginKitTheme;
}

export const IconSet: React.FC<IconSetProps> = (props: IconSetProps) => {
  const {theme} = props;
  switch (props.type) {
    case 'Eye':
      return <EyeIcon size={25} color={theme.colors.PRIMARY_200} />;
    case 'EyeSlash':
      return <EyeSlashIcon size={25} color={theme.colors.PRIMARY_200} />;
    default:
      return null;
  }
};
