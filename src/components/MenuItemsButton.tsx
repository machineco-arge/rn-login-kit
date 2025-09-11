import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { IMenuItemsButtonProps } from '../types';
import { createStyleProfileSettings } from '../utils/styles';

export const MenuItemsButton: React.FC<IMenuItemsButtonProps> = ({title, onPress, config}: IMenuItemsButtonProps) => {
  const StyleProfileSettings = createStyleProfileSettings(config.theme);;
  return (
    <TouchableOpacity
      style={StyleProfileSettings.profileSettingsMenuItem}
      onPress={onPress}>
      <Text style={StyleProfileSettings.profileSettingsMenuItemText}>
        {title}
      </Text>
      <Text style={StyleProfileSettings.profileSettingsChevron}>›</Text>
    </TouchableOpacity>
  );
};

