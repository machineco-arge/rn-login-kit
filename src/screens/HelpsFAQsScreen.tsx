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
import {LinearGradient} from 'react-native-gradients';
import {ChevronDownIcon} from 'react-native-heroicons/outline';
import {createHelpsFAQsScreenStyles} from '../utils/styles';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Accordion Component ---
const AccordionItem: React.FC<{question: string; answer: string; styles: any}> =
  React.memo(({question, answer, styles}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsOpen(prev => !prev);
    }, []);

    return (
      <View style={styles.accordionItem}>
        <TouchableOpacity onPress={toggleOpen} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
          <ChevronDownIcon
            size={20}
            color={styles.toggleIcon.color}
            style={[styles.toggleIcon, isOpen && styles.toggleIconOpen]}
          />
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
    faqSections: any
}

export const HelpsFAQsScreen: React.FC<HelpsFAQsScreenProps> = (
  {title, faqSections, config}: HelpsFAQsScreenProps
) => {
  const styles = createHelpsFAQsScreenStyles(config.theme);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.gradientContainer}>
        <LinearGradient
          angle={45}
          colorList={config.theme.colors.gradient.map(
            (color: any, index: number) => ({
              color,
              offset: `${
                (index / (config.theme.colors.gradient.length - 1)) * 100
              }%`,
              opacity: '1',
            }),
          )}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
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
            const Icon = section.icon;
            return (
              <View key={section.key} style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Icon size={24} color={config.theme.colors.navbarSelected} />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                {section.items.map(item => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                    styles={styles}
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
