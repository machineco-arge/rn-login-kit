import React from "react";
import { Text, ScrollView, View } from "react-native";
import { LinearGradient } from "react-native-gradients";
import { createTermsPolicyStyles } from "../utils/styles";
import { TermsPoliciesProps } from "../types";

export const TermsPoliciesScreen: React.FC<TermsPoliciesProps> = (props: TermsPoliciesProps) => {
  const style = createTermsPolicyStyles(props.config.theme);
  const content: TermsPoliciesProps["content"] = props.content;

  return (
    <View style={style.container}>
      <View style={style.gradientContainer}>
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
      <View style={style.headerContainer}>
        <Text style={style.title}>{props.title}</Text>
      </View>

      <ScrollView contentContainerStyle={style.scrollView}>
        {content.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <Text style={style.heading}>{section.heading}</Text>
            {section.paragraphs.map((paragraph, pIndex) => (
              <Text key={pIndex} style={style.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};