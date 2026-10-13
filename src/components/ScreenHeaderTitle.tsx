import React from 'react';
import {StyleSheet, Text, type StyleProp, type TextStyle} from 'react-native';

// Only header word spacing changes; translated text and custom title nodes are preserved.
export const ScreenHeaderTitle: React.FC<{
  style: StyleProp<TextStyle>;
  children: React.ReactNode;
}> = ({style, children}) => (
  <Text style={style}>
    {typeof children === 'string'
      ? children.split(/( +)/).map((part, index) =>
          /^ +$/.test(part) ? (
            <Text key={index} style={styles.wordSpace}>{part}</Text>
          ) : part,
        )
      : children}
  </Text>
);

const styles = StyleSheet.create({
  wordSpace: {fontSize: 6},
});
