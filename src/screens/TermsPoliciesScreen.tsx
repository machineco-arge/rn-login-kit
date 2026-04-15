import React from "react";
import { Text, ScrollView, View, TouchableOpacity } from "react-native";
import { createTermsPolicyStyles } from "../utils/styles";
import { TermsPoliciesProps } from "../types";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";


export const TermsPoliciesScreen: React.FC<TermsPoliciesProps> = ({
  config,
  title,
  content,
  backgroundImage,
  backgroundSvg,
  navigateBackIcon,
}) => {
  const style = createTermsPolicyStyles(config.theme);
  const navigation = useNavigation();

  return (
    <View style={style.container}>
      {backgroundSvg && backgroundSvg()}
      {backgroundImage && !backgroundSvg && (
        <FastImage
          source={backgroundImage}
          style={style.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      {backgroundImage && (
        <FastImage
          source={backgroundImage}
          style={style.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={style.headerContainer}>
        <View style={style.headerTitleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={style.backButton}>
            {navigateBackIcon}
          </TouchableOpacity>
          <Text style={style.headerTitle}>{title || "TERMS AND POLICIES"}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={style.scrollView} showsVerticalScrollIndicator={false}>
        {content.map((section, sectionIndex) => (
          <View key={sectionIndex} style={style.sectionContainer}>
            <Text style={style.heading}>{section.heading}</Text>
            {section.paragraphs.map((paragraph, pIndex) => {
              // Check if paragraph looks like a numbered section header (e.g. "1. Definitions:")
              const isSectionHeader = /^\d+\.\s/.test(paragraph);

              return (
                <Text
                  key={pIndex}
                  style={isSectionHeader ? style.sectionLabel : style.paragraph}
                >
                  {paragraph}
                </Text>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};