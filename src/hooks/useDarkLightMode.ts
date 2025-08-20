import {useEffect} from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {useThemeContext} from './useThemeContext';

export const useDarkLightMode = () => {
  const {theme, toggleTheme} = useThemeContext();
  const togglePosition = useSharedValue(0);

  useEffect(() => {
    togglePosition.value = withSpring(theme === 'light' ? 0 : 100, {
      damping: 15,
      stiffness: 100,
    });
  }, [theme]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: togglePosition.value}],
  }));

  return {animatedStyle, theme, toggleTheme};
};
