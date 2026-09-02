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
import {LoginKitConfig} from '../types';

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
  /** When false, sheet stays open after submit (parent closes on success). Default true. */
  closeOnSubmit?: boolean;
  /** Optional transform applied on each keystroke (e.g. digits-only). */
  inputFilter?: (text: string) => string;
  keyboardType?: 'default' | 'number-pad' | 'numeric';
  submitLoading?: boolean;
  submitDisabled?: boolean;
  /** Called after close animation and modal unmount (iOS-safe delay included). */
  onClosed?: () => void;
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
  closeOnSubmit = true,
  inputFilter,
  keyboardType = 'default',
  submitLoading = false,
  submitDisabled = false,
  onClosed,
}) => {
  const insets = useSafeAreaInsets();
  const styles = createTextInputModalStyles(config.theme);
  const [inputValue, setInputValue] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const sheetWasShownRef = useRef(false);
  /** Run after exit animation + modal unmount — avoids stacking modals / frozen UI on iOS. */
  const pendingAfterCloseRef = useRef<(() => void) | null>(null);
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;

  const runAfterSheetClose = useCallback((runPending?: () => void) => {
    InteractionManager.runAfterInteractions(() => {
      const execute = () => {
        runPending?.();
        onClosedRef.current?.();
      };
      if (Platform.OS === 'ios') {
        setTimeout(execute, IOS_AFTER_MODAL_MS);
      } else {
        execute();
      }
    });
  }, []);

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
        runAfterSheetClose(run ?? undefined);
      }
    });
  }, [visible, value, translateY, runAfterSheetClose]);

  const close = useCallback(() => {
    pendingAfterCloseRef.current = onCancel;
    onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    if (submitLoading || submitDisabled) {
      return;
    }
    if (closeOnSubmit) {
      pendingAfterCloseRef.current = () => onSubmit(inputValue);
      onCancel();
      return;
    }
    onSubmit(inputValue);
  }, [onSubmit, onCancel, inputValue, closeOnSubmit, submitLoading, submitDisabled]);

  const handleChangeText = (text: string) => {
    const filtered = inputFilter ? inputFilter(text) : text;
    if (maxLength && filtered.length > maxLength) {
      setInputValue(filtered.substring(0, maxLength));
    } else {
      setInputValue(filtered);
    }
  };

  const isSubmitDisabled = submitDisabled || submitLoading || !inputValue.trim();

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
                  keyboardType={keyboardType}
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
                  style={[
                    styles.button,
                    styles.submitButton,
                    isSubmitDisabled && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitDisabled}
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

