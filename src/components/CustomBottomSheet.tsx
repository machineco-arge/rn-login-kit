import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Animated,
  Platform,
  InteractionManager,
  Easing,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createCustomBottomSheetStyles } from '../utils/styles';
import { LoginKitConfig } from '../types'

const SCREEN_HEIGHT = Dimensions.get('window').height;

/** After RN Modal unmounts, iOS still needs a tick before showing share sheet / another Modal. */
const IOS_AFTER_MODAL_MS = 100;

/**
 * Bottom-sheet replacement for CustomAlert (album flows).
 * Supports two-button (confirm/cancel) or single OK — same prop shapes as CustomAlert.
 */
interface ICustomBottomSheetProps {
  /** Kept for CustomAlert compatibility; unused. */
  config: LoginKitConfig;
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Shows spinner on primary button and disables actions (delete / bulk download confirm). */
  confirmLoading?: boolean;
  okText?: string;
  onOK?: () => void;
  /** Optional children for custom content (e.g. film roll list) */
  children?: React.ReactNode;
  /** Hide the default confirm button for custom content flows */
  hideConfirm?: boolean;
}

export const CustomBottomSheet: React.FC<ICustomBottomSheetProps> = ({
  config,
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmLoading = false,
  okText,
  onOK,
  children,
  hideConfirm = false,
}) => {
  const insets = useSafeAreaInsets();
  const styles = createCustomBottomSheetStyles(config.theme);

  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const sheetWasShownRef = useRef(false);
  /** Run after exit animation + modal unmount — avoids stacking modals / frozen UI on iOS. */
  const pendingAfterCloseRef = useRef<(() => void) | null>(null);

  const isTwoButton =
    typeof onConfirm === 'function' &&
    typeof onCancel === 'function' &&
    confirmText != null &&
    cancelText != null;

  const isSingleOk =
    typeof onOK === 'function' && okText != null && !isTwoButton;

  const close = useCallback(() => {
    pendingAfterCloseRef.current = null;
    if (onCancel) {
      onCancel();
    } else if (onOK) {
      onOK();
    }
  }, [onCancel, onOK]);

  const queueCloseThen = useCallback(
    (action: () => void) => {
      pendingAfterCloseRef.current = action;
      if (onCancel) {
        onCancel();
      } else if (onOK) {
        onOK();
      }
    },
    [onCancel, onOK],
  );

  useEffect(() => {
    if (visible) {
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
  }, [visible, translateY]);

  const onConfirmPress = useCallback(() => {
    if (onConfirm) {
      queueCloseThen(onConfirm);
    }
  }, [onConfirm, queueCloseThen]);

  const onCancelPress = useCallback(() => {
    close();
  }, [close]);

  const onOKPress = useCallback(() => {
    if (onOK) {
      close();
    }
  }, [onOK, close]);

  const dismissBackdrop = () => {
    if (confirmLoading) {
      return;
    }
    close();
  };

  return (
    <Modal
      transparent
      animationType="none"
      visible={modalVisible}
      onRequestClose={dismissBackdrop}
      statusBarTranslucent
      navigationBarTranslucent>
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable
          style={styles.backdrop}
          onPress={dismissBackdrop}
          accessibilityRole="button"
          accessibilityLabel={
            isTwoButton ? cancelText ?? 'Cancel' : okText ?? 'OK'
          }
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
            {(title || message) && (
              <View style={styles.textStack}>
                {title ? <Text style={styles.title}>{title}</Text> : null}
                {message ? <Text style={styles.message}>{message}</Text> : null}
              </View>
            )}

            {children}

            {isTwoButton && !hideConfirm ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancelPress}
                  disabled={confirmLoading}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={cancelText}
                  accessibilityState={{ disabled: confirmLoading }}>
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={onConfirmPress}
                  disabled={confirmLoading}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={confirmText}
                  accessibilityState={{ disabled: confirmLoading }}>
                  {confirmLoading ? (
                    <ActivityIndicator color={config.theme.colors.TERTIARY_TEXT_LIGHT} />
                  ) : (
                    <Text style={styles.primaryButtonText}>{confirmText}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}

            {isSingleOk ? (
              <TouchableOpacity
                style={styles.singleButton}
                onPress={onOKPress}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={okText}>
                <Text style={styles.singleButtonText}>{okText}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
