import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createTextInputModalStyles } from '../utils/styles';
import { LoginKitConfig } from 'types';

interface TextInputModalProps {
  config: LoginKitConfig;
  visible: boolean;
  title: string;
  placeholder?: string;
  message?: string;
  value: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  cancelText: string;
  submitText: string;
  maxLength?: number;
}

/**
 * Cross-platform text input sheet (Alert.prompt replacement on Android).
 * Bottom-sheet layout matches album rename design (IBM Plex Mono, themed colors).
 */
export const TextInputModal: React.FC<TextInputModalProps> = ({
  config,
  visible,
  title,
  message,
  value,
  onCancel,
  onSubmit,
  cancelText,
  submitText,
  placeholder,
  maxLength = 30,
}) => {
  const insets = useSafeAreaInsets();
  const styles = createTextInputModalStyles(config.theme);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (visible) {
      setInputValue(value);
    }
  }, [visible, value]);

  const handleChangeText = (text: string) => {
    if (maxLength && text.length > maxLength) {
      setInputValue(text.substring(0, maxLength));
    } else {
      setInputValue(text);
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent
      navigationBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingRoot}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.overlay} pointerEvents="box-none">
          <Pressable
            style={styles.backdrop}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel={cancelText}
          />
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}>
            <View style={styles.handleBar} />
            <View style={styles.body}>
              <Text style={styles.modalTitle}>{title}</Text>

              {message ? (
                <Text style={styles.modalMessage}>{message}</Text>
              ) : null}

              <View style={styles.inputBlock}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChangeText}
                  value={inputValue}
                  autoFocus
                  selectTextOnFocus
                  placeholder={placeholder}
                  placeholderTextColor={config.theme.colors.PRIMARY_600}
                  maxLength={maxLength}
                />
                {maxLength ? (
                  <Text style={styles.characterCount}>
                    {inputValue.length} / {maxLength}
                  </Text>
                ) : null}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  activeOpacity={0.85}
                  accessibilityRole="button">
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={() => onSubmit(inputValue)}
                  activeOpacity={0.85}
                  accessibilityRole="button">
                  <Text style={styles.submitButtonText}>{submitText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
