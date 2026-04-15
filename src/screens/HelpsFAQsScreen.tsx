import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {LoginKitConfig} from '../types';
import {createHelpsFAQsScreenStyles} from '../utils/styles';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Accordion Component ---
const AccordionItem: React.FC<{
  question: string;
  answer: string;
  styles: any;
  iconArrowUp?: React.JSX.Element;
  iconArrowDown?: React.JSX.Element;
}> = React.memo(({question, answer, styles, iconArrowUp, iconArrowDown}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(prev => !prev);
  }, []);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={toggleOpen} style={styles.questionContainer} activeOpacity={0.7}>
        <Text style={styles.questionText}>{question}</Text>
        <View style={styles.toggleIcon}>
          {isOpen ? iconArrowUp : iconArrowDown}
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
});

export interface HelpsFAQsScreenProps {
  config: LoginKitConfig;
  title: any;
  faqSections: any;
  backgroundImage?: any;
  backgroundSvg?: () => React.JSX.Element;
  navigateBackIcon?: React.JSX.Element;
  iconArrowUp?: React.JSX.Element;
  iconArrowDown?: React.JSX.Element;
}

export const HelpsFAQsScreen: React.FC<HelpsFAQsScreenProps> = ({
  title,
  faqSections,
  config,
  backgroundImage,
  backgroundSvg,
  navigateBackIcon,
  iconArrowUp,
  iconArrowDown,
}) => {
  const styles = createHelpsFAQsScreenStyles(config.theme);
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      {backgroundSvg && backgroundSvg()}
      {backgroundImage && !backgroundSvg && (
        <FastImage
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {navigateBackIcon}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title || 'HELP & FAQ'}</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {faqSections.map(
          (section: {
            icon: any;
            key: React.Key;
            title: string;
            items: any[];
          }) => {
            return (
              <View key={section.key} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                {section.items.map((item: any) => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                    styles={styles}
                    iconArrowUp={iconArrowUp}
                    iconArrowDown={iconArrowDown}
                  />
                ))}
              </View>
            );
          },
        )}
      </ScrollView>
    </View>
  );
};
