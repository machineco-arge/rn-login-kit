import React from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { createStyleProfileSettings } from "../utils/styles";
import { useProfileSettings } from "../hooks/useProfileSettings";
import { userManager } from "../managers/UserManager";
import { useLoginKitTranslation } from "../hooks/useLoginKitTranslation";
import { ProfileSettigsProps } from "../types";
import { MenuItems } from "../components/MenuItems";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useAccountSettings} from '../hooks/useAccountSettings';

export const ProfileSettingsScreen: React.FC<ProfileSettigsProps> = (
  props: ProfileSettigsProps,
) => {
  const {userInfo} = useProfileSettings();
  const isUserLoggedIn = userManager.isUserLoggedIn();
  const StyleProfileSettings = createStyleProfileSettings(props.config.theme);
  const {t} = useLoginKitTranslation('login');
  const navigation = useNavigation();
  const {handleLogout} = useAccountSettings({ config: props.config });
  const insets = useSafeAreaInsets();

  const menuList: ProfileSettigsProps['menuList'] = props.menuList;
  const NavigateBackIcon = props.navigateBackIcon;

  return (
    <View style={StyleProfileSettings.profileSettingsMainContainer}>
      <FastImage
        source={props.backgroundImage}
        style={StyleProfileSettings.backgroundImage}
        resizeMode="cover"
      />
      <View style={StyleProfileSettings.profileSettingsContainer}>
        {/* Header */}
        <View style={StyleProfileSettings.headerContainer}>
          <View style={StyleProfileSettings.headerTitleContainer}>
            <TouchableOpacity onPress={() => {navigation.goBack();}} style={StyleProfileSettings.backButton}>
              {NavigateBackIcon}
            </TouchableOpacity>
            <Text style={StyleProfileSettings.headerTitleText}>
              {t('_settings_profileSettings')}
            </Text>
          </View>
          <View style={StyleProfileSettings.headerUnderline} />
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: '40%',
            width: Dimensions.get('window').width,
          }}
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
                  {props.userAvatarIcon && <props.userAvatarIcon />}
                </View>
              )}
            </View>
            {props.showUserName && (
              <Text style={StyleProfileSettings.profileSettingsUserName}>
                {userInfo?.name || userInfo?.email || 'User'}
              </Text>
            )}
            {props.proMemberText && (
              <Text
                style={[
                  StyleProfileSettings.profileProMember,
                  {
                    color:
                      props.proMemberTextColor ||
                      props.config.theme.colors.PRIMARY_300,
                  },
                ]}>
                {props.proMemberText}
              </Text>
            )}
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
          <View style={StyleProfileSettings.profileSettingsMenuContainer}>
            {menuList.map((item, index) => (
              <MenuItems
                key={index}
                title={item.title}
                onPress={item.onPress ? item.onPress : () => {}}
                config={props.config}
                iconChevron={props.iconChevron}
              />
            ))}
          </View>
        </ScrollView>
        {isUserLoggedIn && (
          <TouchableOpacity
            style={[StyleProfileSettings.profileSettingsLogoutButton, { marginBottom: Math.max(insets.bottom, 100) }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={StyleProfileSettings.profileSettingsLogoutButtonText}>
              {t('logOut')}
            </Text>
            {props.iconLogout && (
              <View style={StyleProfileSettings.profileSettingsLogoutIcon}>
                <props.iconLogout />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
