import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createCustomBottomSheetStyles } from '../utils/styles';
import { LoginKitConfig } from '../types'

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

  const isTwoButton =
    typeof onConfirm === 'function' &&
    typeof onCancel === 'function' &&
    confirmText != null &&
    cancelText != null;

  const isSingleOk =
    typeof onOK === 'function' && okText != null && !isTwoButton;

  const dismissBackdrop = () => {
    if (confirmLoading) {
      return;
    }
    if (isTwoButton && onCancel) {
      onCancel();
    } else if (isSingleOk && onOK) {
      onOK();
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={dismissBackdrop}
      statusBarTranslucent
      navigationBarTranslucent>
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable
          style={styles.backdrop}
          onPress={dismissBackdrop}
          accessibilityRole="button"
          accessibilityLabel={isTwoButton ? cancelText ?? 'Cancel' : okText ?? 'OK'}
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) },
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
                  onPress={onCancel}
                  disabled={confirmLoading}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={cancelText}
                  accessibilityState={{ disabled: confirmLoading }}>
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={onConfirm}
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
                onPress={onOK}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={okText}>
                <Text style={styles.singleButtonText}>{okText}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};
