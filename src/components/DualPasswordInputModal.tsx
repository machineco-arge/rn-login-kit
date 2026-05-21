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

/** After RN Modal unmounts, iOS still needs a tick before showing another Modal. */
const IOS_AFTER_MODAL_MS = 100;

export interface DualPasswordSubmitValues {
  password: string;
  confirmPassword: string;
}

interface DualPasswordInputModalProps {
  config: LoginKitConfig;
  visible: boolean;
  title: string;
  message?: string;
  passwordPlaceholder: string;
  confirmPlaceholder: string;
  onCancel: () => void;
  onSubmit: (values: DualPasswordSubmitValues) => void;
  cancelText: string;
  submitText: string;
  closeOnSubmit?: boolean;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  onClosed?: () => void;
}

/**
 * Twin of TextInputModal — same sheet layout, buttons, and animation; two password fields.
 */
export const DualPasswordInputModal: React.FC<DualPasswordInputModalProps> = ({
  config,
  visible,
  title,
  message,
  passwordPlaceholder,
  confirmPlaceholder,
  onCancel,
  onSubmit,
  cancelText,
  submitText,
  closeOnSubmit = true,
  submitLoading = false,
  submitDisabled = false,
  onClosed,
}) => {
  const insets = useSafeAreaInsets();
  const styles = createTextInputModalStyles(config.theme);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const sheetWasShownRef = useRef(false);
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
      setPassword('');
      setConfirmPassword('');
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
  }, [visible, translateY, runAfterSheetClose]);

  const close = useCallback(() => {
    pendingAfterCloseRef.current = onCancel;
    onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    if (submitLoading || submitDisabled) {
      return;
    }
    const values = { password, confirmPassword };
    if (closeOnSubmit) {
      pendingAfterCloseRef.current = () => onSubmit(values);
      onCancel();
      return;
    }
    onSubmit(values);
  }, [onSubmit, onCancel, password, confirmPassword, closeOnSubmit, submitLoading, submitDisabled]);

  const isSubmitDisabled =
    submitDisabled || submitLoading || !password.trim() || !confirmPassword.trim();

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
        keyboardVerticalOffset={0}>
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

              {message ? <Text style={styles.modalMessage}>{message}</Text> : null}

              <View style={styles.inputBlock}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={setPassword}
                  value={password}
                  autoFocus
                  selectTextOnFocus
                  placeholder={passwordPlaceholder}
                  placeholderTextColor={config.theme.colors.PRIMARY_600}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                />
                <TextInput
                  style={styles.textInput}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  placeholder={confirmPlaceholder}
                  placeholderTextColor={config.theme.colors.PRIMARY_600}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                />
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
