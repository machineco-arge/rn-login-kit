import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "react-native-gradients";
import FastImage from "react-native-fast-image";
import { createStyleProfileSettings } from "../utils/styles";
import { useProfileSettings } from "../hooks/useProfileSettings";
import { userManager } from "../managers/UserManager";
import { IconSet } from "../components/IconSet";
import { useLoginKitTranslation } from "../hooks/useLoginKitTranslation";
import { ProfileSettigsProps } from "../types";
import { MenuItems } from "../components/MenuItems";

export const ProfileSettingsScreen: React.FC<ProfileSettigsProps> = (
  props: ProfileSettigsProps
) => {
  const { userInfo } = useProfileSettings();
  const StyleProfileSettings = createStyleProfileSettings(props.config.theme);
  const { t } = useLoginKitTranslation("login");

  const menuList: ProfileSettigsProps["menuList"] = props.menuList;


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
            opacity: "1",
          }))}
        />
      </View>
      <View style={StyleProfileSettings.profileSettingsContainer}>
        {/* Header */}
        <View style={StyleProfileSettings.profileSettingsHeaderContainer}>
          <Text style={StyleProfileSettings.profileSettingsHeaderTitle}>
            {t("_settings_profileSettings")}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: "40%", width: Dimensions.get("window").width }}
          style={StyleProfileSettings.profileSettingsScrollView}
        >
          {/* Profile Section */}
          <View style={StyleProfileSettings.profileSettingsProfileSection}>
            <View
              style={StyleProfileSettings.profileSettingsProfilePhotoContainer}
            >
              {userManager.hasCustomPhoto() ? (
                <FastImage
                  source={{ uri: userInfo?.photo! }}
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
              {userInfo?.name || userInfo?.email || "User"}
            </Text>
            {props.proMemberText && (
              <Text style={[StyleProfileSettings.profileProMember, {color: props.proMemberTextColor || props.config.theme.colors.profileSettingsBioColor}]}>
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
          <View>
            {menuList.map((item, index) => (
              <MenuItems
                key={index}
                title={item.title}
                onPress={item.onPress ? item.onPress : () => {}}
                config={props.config}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
