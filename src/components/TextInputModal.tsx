import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
  InteractionManager,
  Easing,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createTextInputModalStyles } from '../utils/styles';
import { LoginKitConfig } from 'types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/** After RN Modal unmounts, iOS still needs a tick before showing share sheet / another Modal (see SharedPhotoManager). */
const IOS_AFTER_MODAL_MS = 100;

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

  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const sheetWasShownRef = useRef(false);
  /** Run after exit animation + modal unmount — avoids stacking modals / frozen UI on iOS. */
  const pendingAfterCloseRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (visible) {
      setInputValue(value);
      sheetWasShownRef.current = true;
      setModalVisible(true);
      translateY.setValue(SCREEN_HEIGHT);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }
    if (!sheetWasShownRef.current) {
      return;
    }
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setModalVisible(false);
        const run = pendingAfterCloseRef.current;
        pendingAfterCloseRef.current = null;
        if (run) {
          InteractionManager.runAfterInteractions(() => {
            if (Platform.OS === 'ios') {
              setTimeout(run, IOS_AFTER_MODAL_MS);
            } else {
              run();
            }
          });
        }
      }
    });
  }, [visible, value, translateY]);

  const close = useCallback(() => {
    pendingAfterCloseRef.current = onCancel;
    onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    pendingAfterCloseRef.current = () => onSubmit(inputValue);
    onCancel(); // Trigger close animation by changing visible via parent
  }, [onSubmit, onCancel, inputValue]);

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
      animationType="none"
      visible={modalVisible}
      onRequestClose={close}
      statusBarTranslucent
      navigationBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingRoot}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <View style={styles.overlay} pointerEvents="box-none">
          <Pressable
            style={styles.backdrop}
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel={cancelText}
          />
          <Animated.View
            style={[
              styles.sheet,
              {
                paddingBottom: Math.max(insets.bottom, 16),
                transform: [{ translateY }],
              },
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
                  onPress={close}
                  activeOpacity={0.85}
                  accessibilityRole="button">
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleSubmit}
                  activeOpacity={0.85}
                  accessibilityRole="button">
                  <Text style={styles.submitButtonText}>{submitText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

