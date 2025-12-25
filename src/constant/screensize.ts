import { Dimensions, Platform, ScaledSize } from 'react-native';

// Get initial dimensions
const { width, height }: ScaledSize = Dimensions.get('window');

export const SCREEN_METRICS = {
  width,
  height,
  isSmallDevice: width < 375,
  isTablet: width >= 768,
};

export const PLATFORM = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  headerHeight: Platform.OS === 'ios' ? 44 : 56,
};

const GUIDE_LINE_BASE_WIDTH = 375;
export const horizontalScale = (size: number): number =>
  (width / GUIDE_LINE_BASE_WIDTH) * size;
