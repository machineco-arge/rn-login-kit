import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {LinearGradient} from 'react-native-gradients';
import FastImage from 'react-native-fast-image';
import { IconSet, MenuItems, ProfileSettigsProps, useLoginKitTranslation, useProfileSettings, userManager } from 'index';
import { createStyleProfileSettings } from 'utils/styles';

export const ProfileSettingsScreen: React.FC<ProfileSettigsProps> = (props: ProfileSettigsProps) => {
  const {userInfo} = useProfileSettings();
  const StyleProfileSettings = createStyleProfileSettings(props.config.theme);
  const {t} = useLoginKitTranslation('login');
  return (
    <View style={StyleProfileSettings.profileSettingsMainContainer}>
      <View style={StyleProfileSettings.gradientContainer}>
        <LinearGradient
          angle={45}
          colorList={props.config.theme.colors.gradient.map((color, index) => ({
            color,
            offset: `${
              (index / (props.config.theme.colors.gradient.length - 1)) * 100
            }%`,
            opacity: '1',
          }))}
        />
      </View>
      <View style={StyleProfileSettings.profileSettingsContainer}>
        {/* Header */}
        <View style={StyleProfileSettings.profileSettingsHeaderContainer}>
          <Text style={StyleProfileSettings.profileSettingsHeaderTitle}>
            {t('_settings_profileSettings')}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{paddingBottom: '40%'}}
          style={StyleProfileSettings.profileSettingsScrollView}>
          {/* Profile Section */}
          <View style={StyleProfileSettings.profileSettingsProfileSection}>
            <View
              style={StyleProfileSettings.profileSettingsProfilePhotoContainer}>
              {userManager.hasCustomPhoto() ? (
                <FastImage
                  source={{uri: userInfo?.photo!}}
                  resizeMode={FastImage.resizeMode.cover}
                  style={StyleProfileSettings.profileSettingsProfilePhoto}
                />
              ) : (
                <View style={StyleProfileSettings.profileSettingsIconContainer}>
                  <IconSet type="UserXL" theme={props.config.theme} />
                </View>
              )}
            </View>
            <Text style={StyleProfileSettings.profileSettingsUserName}>
              {userInfo?.name || userInfo?.email || 'User'}
            </Text>
            {props.biography && (
              <Text style={StyleProfileSettings.profileSettingsBio}>
                {props.biography}
              </Text>
            )}
            {props.stats && (
              <Text style={StyleProfileSettings.profileSettingsStats}>
                {props.stats}
              </Text>
            )}
          </View>

          {/* Menu Items */}
          <MenuItems config={props.config} menuList={props.menuList} />
        </ScrollView>
      </View>
    </View>
  );
};
