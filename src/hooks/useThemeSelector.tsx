import { Colors, Fonts, FontSizes, Radius, Shadow, Spacing } from "../Constant/theme"
import { ThemeContext } from '../context/theme';
import { useContext } from 'react';

export const useThemeStyle = () => {
  const { currentTheme } = useContext(ThemeContext);
  const isDark = currentTheme === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;
  const shadow = isDark ? Shadow.dark : Shadow.light;

  return {
    colors,
    fonts: Fonts,
    fontSizes: FontSizes,
    spacing: Spacing,
    radius: Radius,
    shadow,
    isDark,
  };
};
