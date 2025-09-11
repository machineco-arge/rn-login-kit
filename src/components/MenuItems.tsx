import {View} from 'react-native';
import React from 'react';
import {MenuItemsButton} from './MenuItemsButton';
import { IMenuItemsProps, IMenuList } from 'types';

export const MenuItems: React.FC<IMenuItemsProps>  = (props: IMenuItemsProps) => {
  const menuList: IMenuList[] = props.menuList;
  return (
    <View>
      {menuList.map((item, index) => (
        <MenuItemsButton
          key={index}
          title={item.title}
          onPress={item.onPress ? item.onPress : (() => {})}
          config={props.config}
        />
      ))}
    </View>
  );
};