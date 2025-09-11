import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { createStyleProfileSettings } from '../utils/styles';
import { IMenuItemsProps } from '../types';

export const MenuItems: React.FC<IMenuItemsProps> = ({title, onPress, config}: IMenuItemsProps) => {
  const StyleProfileSettings = createStyleProfileSettings(config.theme);

  return (
    <TouchableOpacity
      style={StyleProfileSettings.profileSettingsMenuItem} onPress={onPress}>
      <Text style={StyleProfileSettings.profileSettingsMenuItemText}>{title}</Text>
      <Text style={StyleProfileSettings.profileSettingsChevron}>›</Text>
    </TouchableOpacity>
  );
};
