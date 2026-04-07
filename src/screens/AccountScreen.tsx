import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScreenProps} from '../types';
import {createAccountScreenStyles} from '../utils/styles';
import {useAccountSettings} from '../hooks/useAccountSettings';
import {ProfilePhotoCropper} from '../components/ProfilePhotoCropper';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';
import { userManager } from '../managers/UserManager';
import { CustomBottomSheet, TextInputModal, useProfilePhotoCropper } from '..';
import { useNavigation } from '@react-navigation/native';

export interface AccountScreenProps extends ScreenProps {
  navigateBackIcon?: React.JSX.Element;
  backgroundImage?: any;
  iconUserIcon?: React.JSX.Element;
  iconMail?: React.JSX.Element;
  iconEdit?: React.JSX.Element;
  iconUserAvatarL?: React.JSX.Element;
  iconAddPP?: React.JSX.Element;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  config,
  showProfileManagement = true,
  navigateBackIcon,
  backgroundImage,
  iconUserIcon,
  iconMail,
  iconEdit,
  iconUserAvatarL,
  iconAddPP,
}) => {
  const styles = createAccountScreenStyles(config.theme);
  const {t} = useLoginKitTranslation('login');
  const navigation = useNavigation();

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
    handleSelectFromGallery,
    handleUpdateName,
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
      {backgroundImage && (
        <FastImage
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {navigateBackIcon}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('accountSettings')}</Text>
        </View>
        <View style={styles.headerUnderline} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Section */}
        {showProfileManagement && (
          <View style={styles.profileSectionWrapper}>
            <TouchableOpacity 
              style={styles.profileSection}
              activeOpacity={0.8}
              onPress={handleSelectFromGallery}
            >
              <View style={styles.profileImageContainer}>
                {hasCustomPhoto() ? (
                  <FastImage
                    source={{uri: currentUser.photo!}}
                    style={styles.profileImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View style={styles.defaultAvatarContainer}>
                    {iconUserAvatarL && iconUserAvatarL}
                  </View>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
                
                {/* Add PP Icon Overlay */}
                <View style={styles.addPPIconContainer}>
                  {iconAddPP && iconAddPP}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* User Information Section */}
        <View style={styles.infoSectionContainer}>
          <Text style={styles.sectionLabel}>Main Info</Text>
          <View style={styles.infoSection}>
            {/* Name */}
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                {iconUserIcon && iconUserIcon}
                <Text style={[styles.infoValue]}>
                  {currentUser.name || t('noName')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setShowEditNameModal(true)}
                disabled={isLoading}
                accessibilityLabel={t('editName')}>
                {iconEdit && iconEdit}
              </TouchableOpacity>
            </View>

            {/* Email */}
            <View style={[styles.infoRow]}>
              <View style={styles.infoRowLeft}>
                {iconMail && iconMail}
                <Text style={styles.infoValue}>
                  {currentUser.email || t('noEmail')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delete Account Section */}
        {config.navigation.onDeleteAccountPress && (
          <View style={styles.deleteAccountContainer}>
            <Text style={styles.sectionLabel}>{t('deleteAccountButton')}</Text>
            <TouchableOpacity 
              style={styles.deleteAccountButton}
              onPress={() => config.navigation.onDeleteAccountPress?.()}
            >
              <Text style={styles.deleteAccountButtonText}>{t('deleteAccountButton')}</Text>
            </TouchableOpacity>
          </View>
        )}
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
      <CustomBottomSheet
        config={config}
        visible={photoEditSuccess}
        title={t('_success_')}
        message={t('profilePhotoUpdatedMessage')}
        okText={t('ok')}
        onOK={() => setPhotoEditSuccess(false)}
      />

      {/* Photo Edit Error Alert */}
      <CustomBottomSheet
        config={config}
        visible={photoEditError}
        title={t('_error_')}
        message={t('profilePhotoErrorMessage')}
        okText={t('ok')}
        onOK={() => setPhotoEditError(false)}
      />

      {/* Edit Name Modal */}
      <TextInputModal
        config={config}
        visible={showEditNameModal}
        title={t('editNameTitle')}
        placeholder={currentUser.name || ''}
        cancelText={t('cancel')}
        submitText={t('save')}
        value={currentUser.name || ''}
        onCancel={() => setShowEditNameModal(false)}
        onSubmit={handleUpdateName}
        maxLength={32}
      />

      {/* No Profile Photo Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleNoProfilePhotoAlert}
        title={t('noProfilePhotoTitle')}
        message={t('noProfilePhotoMessage')}
        okText={t('ok')}
        onOK={() => setVisibleNoProfilePhotoAlert(false)}
      />

      {/* Select Photo Error Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleSelectPhotoErrorAlert}
        title={t('_error_')}
        message={t('selectPhotoErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleSelectPhotoErrorAlert(false)}
      />

      {/* Reset Confirmation Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleResetConfirmAlert}
        title={t('resetProfilePhotoTitle')}
        message={t('resetProfilePhotoMessage')}
        confirmText={t('resetToDefault')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmReset}
        onCancel={() => setVisibleResetConfirmAlert(false)}
      />

      {/* Reset Success Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleResetSuccessAlert}
        title={t('_success_')}
        message={t('profilePhotoResetSuccessMessage')}
        okText={t('ok')}
        onOK={() => setVisibleResetSuccessAlert(false)}
      />

      {/* Reset Error Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleResetErrorAlert}
        title={t('_error_')}
        message={t('profilePhotoResetErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleResetErrorAlert(false)}
      />

      {/* Delete Confirmation Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleDeleteConfirmAlert}
        title={t('delete')}
        message={t('deleteProfilePhotoMessage')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setVisibleDeleteConfirmAlert(false)}
      />

      {/* Delete Success Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleDeleteSuccessAlert}
        title={t('_success_')}
        message={t('profilePhotoDeletedSuccessMessage')}
        okText={t('ok')}
        onOK={() => setVisibleDeleteSuccessAlert(false)}
      />

      {/* Delete Error Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleDeleteErrorAlert}
        title={t('_error_')}
        message={t('profilePhotoDeleteErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleDeleteErrorAlert(false)}
      />

      {/* Invalid Name Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleInvalidNameAlert}
        title={t('_error_')}
        message={t('invalidNameMessage')}
        okText={t('ok')}
        onOK={() => setVisibleInvalidNameAlert(false)}
      />

      {/* Name Update Success Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleNameUpdateSuccessAlert}
        title={t('_success_')}
        message={t('nameUpdatedSuccessMessage')}
        okText={t('ok')}
        onOK={() => setVisibleNameUpdateSuccessAlert(false)}
      />

      {/* Name Update Error Alert */}
      <CustomBottomSheet
        config={config}
        visible={visibleNameUpdateErrorAlert}
        title={t('_error_')}
        message={t('nameUpdateErrorMessage')}
        okText={t('ok')}
        onOK={() => setVisibleNameUpdateErrorAlert(false)}
      />
    </View>
  );
}; 