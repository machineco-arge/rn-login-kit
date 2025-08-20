import {useState, useCallback} from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import {IUserInfo, LoginKitConfig} from '../types';
import {SocialAuthService} from '../services/SocialAuthService';
import {UserLogoutService} from '../services/UserLogoutService';
import {userManager} from '../managers/UserManager';
import {useCurrentUser} from './useCurrentUser';

interface UseAccountSettingsProps {
  config: LoginKitConfig;
}

interface UseAccountSettingsReturn {
  // State
  currentUser: IUserInfo | null;
  isLoading: boolean;
  showProfilePhotoCropper: boolean;
  showEditNameModal: boolean;
  pendingPhotoUri: string | null;

  // Alert states
  visibleNoProfilePhotoAlert: boolean;
  visibleSelectPhotoErrorAlert: boolean;
  visibleResetConfirmAlert: boolean;
  visibleResetSuccessAlert: boolean;
  visibleResetErrorAlert: boolean;
  visibleDeleteConfirmAlert: boolean;
  visibleDeleteSuccessAlert: boolean;
  visibleDeleteErrorAlert: boolean;
  visibleInvalidNameAlert: boolean;
  visibleNameUpdateSuccessAlert: boolean;
  visibleNameUpdateErrorAlert: boolean;

  // Handlers
  handleEditProfilePhoto: () => void;
  handleSelectFromGallery: () => void;
  handleResetToDefault: () => void;
  handleDeletePhoto: () => void;
  handleUpdateName: (newName: string) => void;
  handleLogout: () => void;
  handleConfirmReset: () => void;
  handleConfirmDelete: () => void;

  // Setters
  setShowProfilePhotoCropper: (show: boolean) => void;
  setShowEditNameModal: (show: boolean) => void;
  setPendingPhotoUri: (uri: string | null) => void;
  setVisibleNoProfilePhotoAlert: (visible: boolean) => void;
  setVisibleSelectPhotoErrorAlert: (visible: boolean) => void;
  setVisibleResetConfirmAlert: (visible: boolean) => void;
  setVisibleResetSuccessAlert: (visible: boolean) => void;
  setVisibleResetErrorAlert: (visible: boolean) => void;
  setVisibleDeleteConfirmAlert: (visible: boolean) => void;
  setVisibleDeleteSuccessAlert: (visible: boolean) => void;
  setVisibleDeleteErrorAlert: (visible: boolean) => void;
  setVisibleInvalidNameAlert: (visible: boolean) => void;
  setVisibleNameUpdateSuccessAlert: (visible: boolean) => void;
  setVisibleNameUpdateErrorAlert: (visible: boolean) => void;
}

export const useAccountSettings = ({
  config,
}: UseAccountSettingsProps): UseAccountSettingsReturn => {
  // Use custom hook for user management
  const { currentUser } = useCurrentUser();
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [showProfilePhotoCropper, setShowProfilePhotoCropper] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);

  // Alert states
  const [visibleNoProfilePhotoAlert, setVisibleNoProfilePhotoAlert] = useState(false);
  const [visibleSelectPhotoErrorAlert, setVisibleSelectPhotoErrorAlert] = useState(false);
  const [visibleResetConfirmAlert, setVisibleResetConfirmAlert] = useState(false);
  const [visibleResetSuccessAlert, setVisibleResetSuccessAlert] = useState(false);
  const [visibleResetErrorAlert, setVisibleResetErrorAlert] = useState(false);
  const [visibleDeleteConfirmAlert, setVisibleDeleteConfirmAlert] = useState(false);
  const [visibleDeleteSuccessAlert, setVisibleDeleteSuccessAlert] = useState(false);
  const [visibleDeleteErrorAlert, setVisibleDeleteErrorAlert] = useState(false);
  const [visibleInvalidNameAlert, setVisibleInvalidNameAlert] = useState(false);
  const [visibleNameUpdateSuccessAlert, setVisibleNameUpdateSuccessAlert] = useState(false);
  const [visibleNameUpdateErrorAlert, setVisibleNameUpdateErrorAlert] = useState(false);

  // Initialize services
  const socialAuthService = new SocialAuthService(
    config.socialAuth,
    config.apiConfig,
  );

  const userLogoutService = new UserLogoutService(
    config.apiConfig?.baseUrl,
    config.apiConfig?.endpoints.logout,
  );

  /**
   * Handle editing current profile photo (re-crop existing photo)
   */
  const handleEditProfilePhoto = async (): Promise<void> => {
    if (!currentUser?.photo) {
      setVisibleNoProfilePhotoAlert(true);
      return;
    }

    try {
      setPendingPhotoUri(currentUser.photo);
      setShowProfilePhotoCropper(true);
    } catch (error) {
      console.error('Error preparing profile photo for editing:', error);
      setVisibleSelectPhotoErrorAlert(true);
    }
  };

  /**
   * Handle selecting photo from device gallery
   */
  const handleSelectFromGallery = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Open image picker
      const image = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        includeBase64: false,
        freeStyleCropEnabled: false,
        cropping: false, // will crop in the next step
        multiple: false,
        maxFiles: 1,
      });

      // Set pending photo and show cropper
      setPendingPhotoUri(image.path);
      setShowProfilePhotoCropper(true);
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        console.log('User cancelled photo selection');
        return;
      }

      console.error('Error selecting photo from gallery:', error);
      setVisibleSelectPhotoErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle resetting profile photo to default
   */
  const handleResetToDefault = (): void => {
    setVisibleResetConfirmAlert(true);
  };

  /**
   * Handle confirm reset operation
   */
  const handleConfirmReset = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setVisibleResetConfirmAlert(false);
      await userManager.resetToDefaultProfilePhoto();
      setVisibleResetSuccessAlert(true);
    } catch (error) {
      console.error('Error resetting profile photo:', error);
      setVisibleResetErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle deleting custom profile photo
   */
  const handleDeletePhoto = (): void => {
    setVisibleDeleteConfirmAlert(true);
  };

  /**
   * Handle confirm delete operation
   */
  const handleConfirmDelete = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setVisibleDeleteConfirmAlert(false);
      await userManager.clearProfilePhoto();
      setVisibleDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      setVisibleDeleteErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle updating user name
   */
  const handleUpdateName = async (newName: string): Promise<void> => {
    if (!newName.trim()) {
      setVisibleInvalidNameAlert(true);
      return;
    }

    try {
      setIsLoading(true);
      await userManager.updateUserName(newName.trim(), config.navigation.onUserNameUpdate);
      setShowEditNameModal(false);
      setVisibleNameUpdateSuccessAlert(true);
    } catch (error) {
      console.error('Error updating user name:', error);
      setVisibleNameUpdateErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = useCallback(async () => {
    try {
      if (currentUser?.providerId === 'google.com') {
        await socialAuthService.useGoogleAuthOut();
      } else if (currentUser?.providerId === 'apple.com') {
        await socialAuthService.revokeAppleSignIn();
      } else if (
        currentUser?.providerId === 'userSignIn' ||
        currentUser?.providerId === 'userRegister'
      ) {
        if (!currentUser?.idToken) {
          throw new Error('idToken is null! Cannot log out.');
        }
        await userLogoutService.logout(currentUser.idToken);
      }

      // Clear user data (this will also clear the session token)
      await userManager.clearCurrentUser();

      // Call navigation logout callback if provided
      if (config.navigation.onLogout) {
        config.navigation.onLogout();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [
    currentUser,
    socialAuthService,
    userLogoutService,
    config.navigation.onLogout,
  ]);

  return {
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
  };
};
