import React from 'react';
import {Modal, View, Text, TouchableOpacity, Animated, ActivityIndicator} from 'react-native';
import {useEffect, useRef} from 'react';
import {LoginKitConfig} from '../types';
import {createCustomAlertStyles} from '../utils/styles';
import { XCircleIcon } from 'react-native-heroicons/outline';

interface CustomAlertProps {
  config: LoginKitConfig;
  isFromPrivacy?: boolean;
  visible: boolean;
  title: string;
  message: string;
  onCancel?: () => void;
  onClose?: () => void;
  onConfirm?: () => void;
  onOK?: () => void;
  onSendToPrint?: () => void;
  onInspect?: () => void;
  okText?: string;
  cancelText?: string;
  confirmText?: string;
  sendToPrintText?: string;
  inspectText?: string;
  isLoading?: boolean;
}

/**
 * Custom styled alert component with animation
 */
export const CustomAlert: React.FC<
  CustomAlertProps
> = ({
  config,
  isFromPrivacy = false,
  visible,
  title,
  message,
  onCancel,
  onClose,
  onConfirm,
  onOK,
  onSendToPrint,
  onInspect,
  okText = 'Tamam',
  cancelText = 'İptal',
  confirmText = 'Tamam',
  sendToPrintText = 'Gönder',
  inspectText = 'İncele',
  isLoading = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const styles = createCustomAlertStyles(config.theme);

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
      onRequestClose={onCancel || onClose}>
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
            {isFromPrivacy && config.privacy.required && (
            <TouchableOpacity
              style={styles.modalCloseIcon}
              onPress={onCancel || onClose}>
              <XCircleIcon
                size={35}
                color={config.theme.colors.customAlertCancelColor}
              />
            </TouchableOpacity>
            )}
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
            {onInspect && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                disabled={isLoading}
                onPress={onInspect}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {inspectText}
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
