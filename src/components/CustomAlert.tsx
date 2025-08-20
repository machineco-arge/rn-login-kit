import React from 'react';
import {Modal, View, Text, TouchableOpacity, Animated, ActivityIndicator} from 'react-native';
import {useEffect, useRef} from 'react';
import {LoginKitTheme} from '../types';
import {createCustomAlertStyles} from '../utils/styles';

interface CustomAlertProps {
  theme: LoginKitTheme;
  visible: boolean;
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onOK?: () => void;
  onSendToPrint?: () => void;
  okText?: string;
  cancelText?: string;
  confirmText?: string;
  sendToPrintText?: string;
  isLoading?: boolean;
}

/**
 * Custom styled alert component with animation
 */
export const CustomAlert: React.FC<
  CustomAlertProps
> = ({
  theme,
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  onOK,
  onSendToPrint,
  okText = 'Tamam',
  cancelText = 'İptal',
  confirmText = 'Tamam',
  sendToPrintText = 'Gönder',
  isLoading = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const styles = createCustomAlertStyles(theme);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          {/* Alert Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          {/* Alert Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                disabled={isLoading}
                onPress={onCancel}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {cancelText}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                disabled={isLoading}
                onPress={onConfirm}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {confirmText}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            {onOK && (
              <TouchableOpacity
                style={[styles.button, styles.okButton]}
                disabled={isLoading}
                onPress={onOK}>
                {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ): (
                  <Text style={styles.buttonText}>
                    {okText}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            {onSendToPrint && (
              <TouchableOpacity
                style={[styles.button, styles.sendToPrintButton]}
                disabled={isLoading}
                onPress={onSendToPrint}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {sendToPrintText}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
