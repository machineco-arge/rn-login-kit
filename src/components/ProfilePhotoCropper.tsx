import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { createStyleProfilePhotoCropper } from '../utils/styles';
import { LoginKitTheme } from '../types';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';

interface ProfilePhotoCropperProps {
  isProcessing: boolean;
  handleCropAndSave: (photoUri: string) => Promise<void>;
  visible: boolean;
  onClose: () => void;
  photoUri: string;
  theme: LoginKitTheme;
}

export const ProfilePhotoCropper: React.FC<ProfilePhotoCropperProps> = ({
  isProcessing,
  handleCropAndSave,
  visible,
  onClose,
  photoUri,
  theme,
}) => {
  const styles = createStyleProfilePhotoCropper(theme);
  const {t} = useLoginKitTranslation('login');

  // UI event handlers
  const handleCropPress = () => handleCropAndSave(photoUri);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('cropperToolbarTitle')}</Text>

          <View style={styles.previewContainer}>
            <FastImage
              source={{ uri: photoUri }}
              style={styles.previewImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>

          <Text style={[styles.title, { fontSize: 14, marginBottom: 20 }]}>
            {t('setProfilePhotoDescription')}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
              disabled={isProcessing}>
              <Text style={styles.buttonText}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                isProcessing && styles.disabledButton,
              ]}
              onPress={handleCropPress}
              disabled={isProcessing}>
              <Text style={styles.buttonText}>
                {isProcessing ? t('saving') : t('setAsProfilePhoto')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 