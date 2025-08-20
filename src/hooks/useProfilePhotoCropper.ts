import { useState } from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useLoginKitTranslation } from './useLoginKitTranslation';
import { userManager } from '../managers/UserManager';

interface UseProfilePhotoCropperProps {
  onClose: () => void;
}

interface UseProfilePhotoCropperReturn {
  isProcessing: boolean;
  handleCropAndSave: (photoUri: string) => Promise<void>;
  photoEditSuccess: boolean;
  photoEditError: boolean;
  setPhotoEditSuccess: (success: boolean) => void;
  setPhotoEditError: (error: boolean) => void;
}

export const useProfilePhotoCropper = ({ 
  onClose, 
}: UseProfilePhotoCropperProps): UseProfilePhotoCropperReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const {t} = useLoginKitTranslation('login');
  const [photoEditSuccess, setPhotoEditSuccess] = useState(false);
  const [photoEditError, setPhotoEditError] = useState(false);

  const handleCropAndSave = async (photoUri: string): Promise<void> => {
    setIsProcessing(true);
    
    try {
      // Normalize the photo URI - ensure it's a proper file path
      let processableUri = photoUri;
      
      // If it's a content:// URI (Android) or asset-library:// URI (iOS), we need to handle it
      if (photoUri.startsWith('content://') || photoUri.startsWith('asset-library://') || photoUri.startsWith('ph://')) {
        console.log('Detected non-file URI, processing through picker first:', photoUri);
        
        // For non-file URIs, we need to first copy them to a temporary location
        try {
          const tempImage = await ImageCropPicker.openCropper({
            path: photoUri,
            width: 300,
            height: 300,
            cropperCircleOverlay: true,
            compressImageQuality: 0.8,
            mediaType: 'photo',
            includeBase64: false,
            freeStyleCropEnabled: false,
            cropping: true,
            cropperToolbarTitle: t('cropperToolbarTitle'),
            loadingLabelText: t('loadingLabelText'),
            cropperChooseText: t('cropperChooseText'),
            cropperCancelText: t('cropperCancelText'),
          });
          
          processableUri = tempImage.path;
        } catch (cropError) {
          console.error('Error processing URI in cropper:', cropError);
          throw new Error('Failed to process image URI');
        }
      } else {
        // For file:// URIs, open the cropper directly
        console.log('Processing file URI:', photoUri);
        
        const croppedImage = await ImageCropPicker.openCropper({
          path: photoUri,
          width: 300,
          height: 300,
          cropperCircleOverlay: true,
          compressImageQuality: 0.8,
          mediaType: 'photo',
          includeBase64: false,
          freeStyleCropEnabled: false,
          cropping: true,
          cropperToolbarTitle: t('cropperToolbarTitle'),
          loadingLabelText: t('loadingLabelText'),
          cropperChooseText: t('cropperChooseText'),
          cropperCancelText: t('cropperCancelText'),
        });

        processableUri = croppedImage.path;
      }

      // Update user profile photo with the cropped image
      await userManager.updateProfilePhoto(processableUri);

      setPhotoEditSuccess(true);
      onClose();
    } catch (error: any) {
      if (error.code === 'E_PICKER_CANCELLED') {
        // User cancelled, just close
        onClose();
        return;
      }

      console.error('Error cropping profile photo:', error);
      setPhotoEditError(true);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  console.log('[useProfilePhotoCropper] return:', { isProcessing, handleCropAndSave, photoEditSuccess });
  return {
    isProcessing,
    handleCropAndSave,
    photoEditSuccess,
    setPhotoEditSuccess,
    photoEditError,
    setPhotoEditError
  };
}; 