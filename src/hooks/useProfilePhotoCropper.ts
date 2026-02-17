import { useState } from 'react';
import { Skia, ImageFormat, ClipOp } from '@shopify/react-native-skia';
import { userManager } from '../managers/UserManager';
import * as RNFS from '@dr.pogodin/react-native-fs';

interface CropData {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
  cropSize: number;
  imageRenderW: number;
  imageRenderH: number;
}

interface UseProfilePhotoCropperProps {
  onClose: () => void;
}

interface UseProfilePhotoCropperReturn {
  isProcessing: boolean;
  handleCropAndSave: (photoUri: string, cropData: CropData) => Promise<void>;
  photoEditSuccess: boolean;
  photoEditError: boolean;
  setPhotoEditSuccess: (success: boolean) => void;
  setPhotoEditError: (error: boolean) => void;
}

const OUTPUT_SIZE = 600;

export const useProfilePhotoCropper = ({
  onClose,
}: UseProfilePhotoCropperProps): UseProfilePhotoCropperReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoEditSuccess, setPhotoEditSuccess] = useState(false);
  const [photoEditError, setPhotoEditError] = useState(false);

  const handleCropAndSave = async (
    photoUri: string,
    cropData: CropData,
  ): Promise<void> => {
    setIsProcessing(true);

    try {
      const {
        scale,
        translateX,
        translateY,
        rotation,
        cropSize,
        imageRenderW,
        imageRenderH,
      } = cropData;

      // Load source image via Skia
      let normalizedPath = photoUri;
      if (normalizedPath.startsWith('file://')) {
        normalizedPath = normalizedPath.replace('file://', '');
      }

      const imageBase64 = await RNFS.readFile(normalizedPath, 'base64');
      const skData = Skia.Data.fromBase64(imageBase64);
      if (!skData) {
        throw new Error('Failed to create Skia data from image');
      }

      const skImage = Skia.Image.MakeImageFromEncoded(skData);
      if (!skImage) {
        throw new Error('Failed to decode image with Skia');
      }

      const imgWidth = skImage.width();
      const imgHeight = skImage.height();

      // Create offscreen surface
      const surface = Skia.Surface.MakeOffscreen(OUTPUT_SIZE, OUTPUT_SIZE);
      if (!surface) {
        throw new Error('Failed to create Skia surface');
      }

      const canvas = surface.getCanvas();
      canvas.clear(Skia.Color('black'));

      // Clip to circle
      const clipPath = Skia.Path.Make();
      clipPath.addCircle(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
      canvas.clipPath(clipPath, ClipOp.Intersect, true);

      // Map screen-space transforms to output-space
      const outputScale = OUTPUT_SIZE / cropSize;

      // Move origin to output center
      canvas.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

      // Apply user transforms (scaled from screen -> output coords)
      canvas.translate(translateX * outputScale, translateY * outputScale);
      canvas.scale(scale, scale);
      canvas.rotate((rotation * 180) / Math.PI, 0, 0);

      // Draw the image matching the UI layout:
      // In the UI the image is rendered at imageRenderW x imageRenderH,
      // centered in the crop circle. We replicate that in output coords.
      const drawW = imageRenderW * outputScale;
      const drawH = imageRenderH * outputScale;

      const dstRect = Skia.XYWHRect(-drawW / 2, -drawH / 2, drawW, drawH);
      const srcRect = Skia.XYWHRect(0, 0, imgWidth, imgHeight);

      const paint = Skia.Paint();
      paint.setAntiAlias(true);

      canvas.drawImageRect(skImage, srcRect, dstRect, paint);

      // Snapshot and save
      const snapshot = surface.makeImageSnapshot();
      const croppedBase64 = snapshot.encodeToBase64(ImageFormat.JPEG, 90);

      const outputPath = `${RNFS.CachesDirectoryPath}/profile_photo_cropped_${Date.now()}.jpg`;
      await RNFS.writeFile(outputPath, croppedBase64, 'base64');

      const fileUri = `file://${outputPath}`;

      // Update user profile photo
      await userManager.updateProfilePhoto(fileUri);

      setPhotoEditSuccess(true);
      onClose();
    } catch (error: any) {
      console.error('Error cropping profile photo:', error);
      setPhotoEditError(true);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleCropAndSave,
    photoEditSuccess,
    setPhotoEditSuccess,
    photoEditError,
    setPhotoEditError,
  };
};
