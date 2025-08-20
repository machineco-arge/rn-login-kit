import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {LinearGradient} from 'react-native-gradients';
import {ScreenProps} from '../types';
import {createAccountScreenStyles} from '../utils/styles';
import {useAccountSettings} from '../hooks/useAccountSettings';
import {ProfilePhotoCropper} from '../components/ProfilePhotoCropper';
import {EditNameModal} from '../components/EditNameModal';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';
import { userManager } from '../managers/UserManager';
import { IconSet } from '../components/IconSet';
import { CustomAlert } from '../components/CustomAlert';
import { useProfilePhotoCropper } from '..';

export const AccountScreen: React.FC<ScreenProps> = ({
  config,
  showProfileManagement = true,
}) => {
  const styles = createAccountScreenStyles(config.theme);
  const {t} = useLoginKitTranslation('login');

  // Use account settings hook for all business logic
  const {
    // State
    currentUser,
    isLoading,
    showProfilePhotoCropper,
    showEditNameModal,
    pendingPhotoUri,

    // Alert states
    visibleNoProfilePhotoAlert,
    visibleSelectPhotoErrorAlert,
    visibleResetConfirmAlert,
    visibleResetSuccessAlert,
    visibleResetErrorAlert,
    visibleDeleteConfirmAlert,
    visibleDeleteSuccessAlert,
    visibleDeleteErrorAlert,
    visibleInvalidNameAlert,
    visibleNameUpdateSuccessAlert,
    visibleNameUpdateErrorAlert,

    // Handlers
    handleEditProfilePhoto,
    handleSelectFromGallery,
    handleResetToDefault,
    handleDeletePhoto,
    handleUpdateName,
    handleLogout,
    handleConfirmReset,
    handleConfirmDelete,

    // Setters
    setShowProfilePhotoCropper,
    setShowEditNameModal,
    setPendingPhotoUri,
    setVisibleNoProfilePhotoAlert,
    setVisibleSelectPhotoErrorAlert,
    setVisibleResetConfirmAlert,
    setVisibleResetSuccessAlert,
    setVisibleResetErrorAlert,
    setVisibleDeleteConfirmAlert,
    setVisibleDeleteSuccessAlert,
    setVisibleDeleteErrorAlert,
    setVisibleInvalidNameAlert,
    setVisibleNameUpdateSuccessAlert,
    setVisibleNameUpdateErrorAlert,
  } = useAccountSettings({ config });

  /**
   * Get user's initials for default avatar
   */
  const getUserInitials = (): string => {
    if (!currentUser?.name) return 'U';
    const nameParts = currentUser.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return currentUser.name[0].toUpperCase();
  };

  /**
   * Check if user has custom photo
   */
  const hasCustomPhoto = (): boolean => {
    return userManager.hasCustomPhoto()
  };

  /**
   * Handle profile photo cropper close
   */
  const handleProfilePhotoCropperClose = () => {
    setShowProfilePhotoCropper(false);
    setPendingPhotoUri(null);
  };

  // Custom hook handles all business logic
  const { isProcessing, handleCropAndSave, photoEditSuccess, setPhotoEditSuccess, photoEditError, setPhotoEditError } = useProfilePhotoCropper({ 
    onClose: handleProfilePhotoCropperClose,
  });

  if (!currentUser) {
    return <LoadingIndicator theme={config.theme} />
  }

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          angle={45}
          colorList={config.theme.colors.gradient.map((color, index) => ({
            color,
            offset: `${
              (index / (config.theme.colors.gradient.length - 1)) * 100
            }%`,
            opacity: '1',
          }))}
        />
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('accountSettings')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Section */}
        {showProfileManagement && (
          <View style={styles.profileSection}>
            <View style={styles.editProfilePhotoHeaderContainer}>
              <Text style={styles.editProfilePhotoHeaderTitle}>
                {t('manageProfileSettings')}
              </Text>
            </View>
            
            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              {hasCustomPhoto() ? (
                <FastImage
                  source={{uri: currentUser.photo!}}
                  style={styles.profileImage}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <View style={styles.defaultAvatarContainer}>
                  <Text style={styles.defaultAvatarText}>
                    {getUserInitials()}
                  </Text>
                </View>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
            </View>

            {/* Action Buttons Grid */}
            <View style={styles.actionButtonsGrid}>
              {/* Edit Current Photo */}
              <TouchableOpacity
                style={[
                  styles.actionButtonWithLabel,
                  !hasCustomPhoto() && styles.actionButtonDisabled,
                ]}
                onPress={handleEditProfilePhoto}
                disabled={!hasCustomPhoto() || isLoading}
                accessibilityLabel={t('editCurrentPhoto')}>
                <View style={styles.actionButton}>
                  <IconSet type="EditPhoto" theme={config.theme} />
                </View>
                <Text style={styles.actionButtonLabel}>{t('editPhoto')}</Text>
              </TouchableOpacity>

              {/* Select from Gallery */}
              <TouchableOpacity
                style={styles.actionButtonWithLabel}
                onPress={handleSelectFromGallery}
                disabled={isLoading}
                accessibilityLabel={t('selectFromGallery')}>
                <View style={styles.actionButton}>
                  <IconSet type="ImagePicker" theme={config.theme} />
                </View>
                <Text style={styles.actionButtonLabel}>{t('selectFromGallery')}</Text>
              </TouchableOpacity>

              {/* Reset to Default */}
              <TouchableOpacity
                style={[
                  styles.actionButtonWithLabel,
                  !hasCustomPhoto() && styles.actionButtonDisabled,
                ]}
                onPress={handleResetToDefault}
                disabled={!hasCustomPhoto() || isLoading}
                accessibilityLabel={t('resetToDefault')}>
                <View style={styles.actionButton}>
                  <IconSet type="Reset" theme={config.theme} />
                </View>
                <Text style={styles.actionButtonLabel}>{t('resetToDefault')}</Text>
              </TouchableOpacity>

              {/* Delete Photo */}
              <TouchableOpacity
                style={[
                  styles.actionButtonWithLabel,
                  !hasCustomPhoto() && styles.actionButtonDisabled,
                ]}
                onPress={handleDeletePhoto}
                disabled={!hasCustomPhoto() || isLoading}
                accessibilityLabel={t('delete')}>
                <View style={styles.actionButton}>
                  <IconSet type="Delete" theme={config.theme} />
                </View>
                <Text style={styles.actionButtonLabel}>{t('delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* User Information Section */}
        <View style={styles.infoSection}>
          {/* Name */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('name')}</Text>
            <Text style={[styles.infoValue, styles.editableInfoValue]}>
              {currentUser.name || t('noName')}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEditNameModal(true)}
              disabled={isLoading}
              accessibilityLabel={t('editName')}>
              <IconSet type="EditName" theme={config.theme} />
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.infoLabel}>{t('email')}</Text>
            <Text style={styles.infoValue}>
              {currentUser.email || t('noEmail')}
            </Text>
          </View>
        </View>

        {/* Provider Information Section */}
        <View style={styles.infoSection}>
          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.infoLabel}>{t('loginMethod')}</Text>
            <Text style={styles.infoValue}>
              {currentUser.providerId === 'google.com'
                ? t('googleLogin')
                : currentUser.providerId === 'apple.com'
                ? t('appleLogin')
                : currentUser.providerId === 'userSignIn'
                ? t('emailLogin')
                : currentUser.providerId === 'userRegister'
                ? t('emailLogin')
                : t('unknown')}
            </Text>
          </View>
          
          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.profileSettingsLogoutButtonText}>
              {t('logOut')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Photo Cropper Modal */}
      <ProfilePhotoCropper
        isProcessing={isProcessing}
        handleCropAndSave={handleCropAndSave}
        visible={showProfilePhotoCropper}
        onClose={handleProfilePhotoCropperClose}
        photoUri={pendingPhotoUri || currentUser.photo || ''}
        theme={config.theme}
      />

      {/* Photo Edit Success Alert */}
      <CustomAlert
        theme={config.theme}
        visible={photoEditSuccess}
        title={t('_success_')}
        message={t('profilePhotoUpdatedMessage')}
        okText={t('ok')}
        onOK={() => setPhotoEditSuccess(false)}
      />

      {/* Photo Edit Error Alert */}
      <CustomAlert
        theme={config.theme}
        visible={photoEditError}
        title={t('_error_')}
        message={t('profilePhotoErrorMessage')}
        okText={t('ok')}
        onOK={() => setPhotoEditError(false)}
      />

      {/* Edit Name Modal */}
      <EditNameModal
        visible={showEditNameModal}
        onClose={() => setShowEditNameModal(false)}
        currentName={currentUser.name || ''}
        onSave={handleUpdateName}
        isLoading={isLoading}
        theme={config.theme}
      />

      {/* No Profile Photo Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleNoProfilePhotoAlert}
        title={t('noProfilePhotoTitle')}
        message={t('noProfilePhotoMessage')}
        okText={t('ok')}
        onOK={() => setVisibleNoProfilePhotoAlert(false)}
      />

      {/* Select Photo Error Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleSelectPhotoErrorAlert}
        title={t('_error_')}
        message={t('selectPhotoErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleSelectPhotoErrorAlert(false)}
      />

      {/* Reset Confirmation Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleResetConfirmAlert}
        title={t('resetProfilePhotoTitle')}
        message={t('resetProfilePhotoMessage')}
        confirmText={t('resetToDefault')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmReset}
        onCancel={() => setVisibleResetConfirmAlert(false)}
      />

      {/* Reset Success Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleResetSuccessAlert}
        title={t('_success_')}
        message={t('profilePhotoResetSuccessMessage')}
        okText={t('ok')}
        onOK={() => setVisibleResetSuccessAlert(false)}
      />

      {/* Reset Error Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleResetErrorAlert}
        title={t('_error_')}
        message={t('profilePhotoResetErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleResetErrorAlert(false)}
      />

      {/* Delete Confirmation Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleDeleteConfirmAlert}
        title={t('delete')}
        message={t('deleteProfilePhotoMessage')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setVisibleDeleteConfirmAlert(false)}
      />

      {/* Delete Success Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleDeleteSuccessAlert}
        title={t('_success_')}
        message={t('profilePhotoDeletedSuccessMessage')}
        okText={t('ok')}
        onOK={() => setVisibleDeleteSuccessAlert(false)}
      />

      {/* Delete Error Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleDeleteErrorAlert}
        title={t('_error_')}
        message={t('profilePhotoDeleteErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleDeleteErrorAlert(false)}
      />

      {/* Invalid Name Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleInvalidNameAlert}
        title={t('_error_')}
        message={t('invalidNameMessage')}
        okText={t('ok')}
        onOK={() => setVisibleInvalidNameAlert(false)}
      />

      {/* Name Update Success Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleNameUpdateSuccessAlert}
        title={t('_success_')}
        message={t('nameUpdatedSuccessMessage')}
        okText={t('ok')}
        onOK={() => setVisibleNameUpdateSuccessAlert(false)}
      />

      {/* Name Update Error Alert */}
      <CustomAlert
        theme={config.theme}
        visible={visibleNameUpdateErrorAlert}
        title={t('_error_')}
        message={t('nameUpdateErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleNameUpdateErrorAlert(false)}
      />
    </View>
  );
}; 