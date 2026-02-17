import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, Text, Dimensions, ActivityIndicator, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoginKitTheme } from '../types';
import { useLoginKitTranslation } from '../hooks/useLoginKitTranslation';
import { createStyleProfilePhotoCropper } from '../utils/styles';
import { ArrowPathIcon, ArrowUturnLeftIcon } from 'react-native-heroicons/outline';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CROP_CIRCLE_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.75;
const HALF_CROP = CROP_CIRCLE_SIZE / 2;
const MIN_SCALE = 1;
const MAX_SCALE = 5;



interface ProfilePhotoCropperProps {
  isProcessing: boolean;
  handleCropAndSave: (
    photoUri: string,
    cropData: {
      scale: number;
      translateX: number;
      translateY: number;
      rotation: number;
      cropSize: number;
      imageRenderW: number;
      imageRenderH: number;
    },
  ) => Promise<void>;
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
  const insets = useSafeAreaInsets();
  const styles = createStyleProfilePhotoCropper(theme, insets, CROP_CIRCLE_SIZE);
  const { t } = useLoginKitTranslation('login');

  function clamp(val: number, min: number, max: number) {
    'worklet';
    return Math.min(Math.max(val, min), max);
  }

  const REF_WIDTH = 402;
  const REF_HEIGHT = 874;
  
  
  // Scale down on smaller screens (prevents text overlapping the illustration)
  const SCALE = clamp(
      Math.min(SCREEN_WIDTH / REF_WIDTH, SCREEN_HEIGHT / REF_HEIGHT),
      0.72,
      1.05,
  );
  
  const scaled = (base: number, min: number, max: number) => clamp(base * SCALE, min, max);

  // ── Source image dimensions ─────────────────────────────────────────
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    if (!photoUri) return;
    Image.getSize(
      photoUri,
      (w, h) => setImgSize({ w, h }),
      () => setImgSize({ w: 1, h: 1 }),
    );
  }, [photoUri]);

  const aspect = imgSize ? imgSize.w / imgSize.h : 1;
  const coverW = aspect >= 1 ? CROP_CIRCLE_SIZE * aspect : CROP_CIRCLE_SIZE;
  const coverH = aspect >= 1 ? CROP_CIRCLE_SIZE : CROP_CIRCLE_SIZE / aspect;

  // halves of cover dimensions — these are screen-pixel distances from
  // the image centre to its edges at scale=1.
  const baseCoverHalfW = coverW / 2;
  const baseCoverHalfH = coverH / 2;

  // Shared values for worklet access
  const sCoverHalfW = useSharedValue(baseCoverHalfW);
  const sCoverHalfH = useSharedValue(baseCoverHalfH);
  useEffect(() => {
    sCoverHalfW.value = baseCoverHalfW;
    sCoverHalfH.value = baseCoverHalfH;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCoverHalfW, baseCoverHalfH]);

  // ── Gesture shared values ───────────────────────────────────────────
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  // ── Slider layout ──────────────────────────────────────────────────
  const sliderWidth = useSharedValue(0);
  const sliderPageX = useSharedValue(0);
  const sliderRef = useRef<View>(null);
  const handleSliderLayout = useCallback(() => {
    sliderRef.current?.measureInWindow((px, _py, w) => {
      sliderPageX.value = px;
      sliderWidth.value = w;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clampTranslation = (
    tx: number,
    ty: number,
    s: number,
    rot: number,
  ) => {
    'worklet';
    const hw = sCoverHalfW.value * s;
    const hh = sCoverHalfH.value * s;
    const cosR = Math.abs(Math.cos(rot));
    const sinR = Math.abs(Math.sin(rot));
    const maxTx = Math.max(0, hw * cosR + hh * sinR - HALF_CROP);
    const maxTy = Math.max(0, hw * sinR + hh * cosR - HALF_CROP);
    return {
      x: Math.min(maxTx, Math.max(-maxTx, tx)),
      y: Math.min(maxTy, Math.max(-maxTy, ty)),
    };
  };

  // ── Reset / Rotate ─────────────────────────────────────────────────
  const resetTransforms = () => {
    'worklet';
    scale.value = withTiming(1, { duration: 250 });
    savedScale.value = 1;
    translateX.value = withTiming(0, { duration: 250 });
    translateY.value = withTiming(0, { duration: 250 });
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    rotation.value = withTiming(0, { duration: 250 });
    savedRotation.value = 0;
  };

  const rotateBy90 = () => {
    'worklet';
    const newRot = savedRotation.value - Math.PI / 2;
    rotation.value = withTiming(newRot, { duration: 300 });
    savedRotation.value = newRot;
    const c = clampTranslation(
      savedTranslateX.value,
      savedTranslateY.value,
      savedScale.value,
      newRot,
    );
    translateX.value = withTiming(c.x, { duration: 300 });
    translateY.value = withTiming(c.y, { duration: 300 });
    savedTranslateX.value = c.x;
    savedTranslateY.value = c.y;
  };

  // ── Gestures ────────────────────────────────────────────────────────
  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .onUpdate((e: { translationX: number; translationY: number; }) => {
      const c = clampTranslation(
        savedTranslateX.value + e.translationX,
        savedTranslateY.value + e.translationY,
        scale.value,
        rotation.value,
      );
      translateX.value = c.x;
      translateY.value = c.y;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e: { rotation: number; }) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
      const c = clampTranslation(
        savedTranslateX.value,
        savedTranslateY.value,
        scale.value,
        rotation.value,
      );
      translateX.value = withTiming(c.x, { duration: 150 });
      translateY.value = withTiming(c.y, { duration: 150 });
      savedTranslateX.value = c.x;
      savedTranslateY.value = c.y;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, rotationGesture);

  const sliderGesture = Gesture.Pan()
    .onUpdate((e: { absoluteX: number; }) => {
      if (sliderWidth.value <= 0) return;
      const frac = Math.min(
        1,
        Math.max(0, (e.absoluteX - sliderPageX.value) / sliderWidth.value),
      );
      const newScale = MIN_SCALE + frac * (MAX_SCALE - MIN_SCALE);
      scale.value = newScale;
      const c = clampTranslation(
        savedTranslateX.value,
        savedTranslateY.value,
        newScale,
        rotation.value,
      );
      translateX.value = c.x;
      translateY.value = c.y;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // ── Animated styles ─────────────────────────────────────────────────
  // translate first (screen-space), then scale around centre, then rotate.
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const sliderFrac = useDerivedValue(
    () => (scale.value - MIN_SCALE) / (MAX_SCALE - MIN_SCALE),
  );
  const animatedThumbStyle = useAnimatedStyle(() => {
    const w = sliderWidth.value > 0 ? sliderWidth.value : 200;
    return { transform: [{ translateX: sliderFrac.value * w - 11 }] };
  });
  const animatedFillStyle = useAnimatedStyle(() => {
    const w = sliderWidth.value > 0 ? sliderWidth.value : 200;
    return { width: sliderFrac.value * w };
  });

  // ── Handlers ────────────────────────────────────────────────────────
  const handleCropPress = () =>
    handleCropAndSave(photoUri, {
      scale: scale.value,
      translateX: translateX.value,
      translateY: translateY.value,
      rotation: rotation.value,
      cropSize: CROP_CIRCLE_SIZE,
      imageRenderW: coverW,
      imageRenderH: coverH,
    });

  const handleReset = () => resetTransforms();
  const handleRotate = () => rotateBy90();
  const handleClose = () => {
    resetTransforms();
    onClose();
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.rootContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('cropperToolbarTitle')}</Text>
          </View>

          <View style={[styles.cropArea, { bottom: scaled(30, 12, 30) }]}>
            <View style={styles.cropContainer}>
              <GestureDetector gesture={composedGesture}>
                <Animated.View
                  style={[
                    {
                      width: coverW,
                      height: coverH,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    animatedImageStyle,
                  ]}>
                  <FastImage
                    source={{ uri: photoUri }}
                    style={{ width: coverW, height: coverH }}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                </Animated.View>
              </GestureDetector>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <View style={[styles.sliderContainer, {bottom: scaled(60, 50, 80)}]}>
              <Text style={styles.sliderLabel}>1x</Text>
              <GestureDetector gesture={sliderGesture}>
                <View
                  ref={sliderRef}
                  style={styles.sliderTrack}
                  onLayout={handleSliderLayout}>
                  <View style={styles.sliderTrackLine} />
                  <Animated.View
                    style={[styles.sliderFill, animatedFillStyle]}
                  />
                  <Animated.View
                    style={[styles.sliderThumb, animatedThumbStyle]}
                  />
                </View>
              </GestureDetector>
              <Text style={styles.sliderLabel}>5x</Text>
            </View>

            <View style={[styles.toolRow, {bottom: scaled(60, 50, 80)}]}>
              <TouchableOpacity
                style={styles.actionButtonWithLabel}
                onPress={handleRotate}
                disabled={isProcessing}>
                <View style={styles.actionButton}>
                  <ArrowPathIcon size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.actionButtonLabel}>{t('rotatePhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButtonWithLabel}
                onPress={handleReset}
                disabled={isProcessing}>
                <View style={styles.actionButton}>
                  <ArrowUturnLeftIcon size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.actionButtonLabel}>{t('resetToDefault')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleClose}
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
                {isProcessing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {t('setAsProfilePhoto')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};
