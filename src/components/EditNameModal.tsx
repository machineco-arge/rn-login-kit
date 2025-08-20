import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { createStyleEditNameModal } from '../utils/styles';
import { LoginKitTheme } from '../types';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';

interface EditNameModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
  isLoading?: boolean;
  theme: LoginKitTheme;
}

export const EditNameModal: React.FC<EditNameModalProps> = ({
  visible,
  onClose,
  currentName,
  onSave,
  isLoading = false,
  theme,
}) => {
  const styles = createStyleEditNameModal(theme);
  const {t} = useLoginKitTranslation('login');
  
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    if (name.trim() && name.trim() !== currentName) {
      onSave(name.trim());
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setName(currentName); // Reset to original name
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('editNameTitle')}</Text>

          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={t('enterNamePlaceholder')}
            placeholderTextColor={styles.textInput.color}
            maxLength={50}
            autoFocus={true}
            selectTextOnFocus={true}
            editable={!isLoading}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleClose}
              disabled={isLoading}>
              <Text style={styles.buttonText}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={isLoading || !name.trim()}>
              <Text style={styles.buttonText}>
                {isLoading ? t('saving') : t('save')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 