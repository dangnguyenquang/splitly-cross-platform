import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
  Image,
  View,
  ImageSourcePropType,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  type?: 'primary' | 'secondary' | 'logo';
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  textStyle?: TextStyle;
  style?: ViewStyle;
  logo?: ImageSourcePropType;
  logoSize?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  width = '80%',
  height = 50,
  borderRadius = 30,
  textStyle,
  style,
  logo,
  logoSize = 22,
}) => {
  const buttonStyle: ViewStyle = {
    width,
    height,
    borderRadius,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        type === 'primary'
          ? styles.primary
          : type === 'secondary'
            ? styles.secondary
            : styles.logoButton,
        buttonStyle,
        style,
      ]}
    >
      <View style={styles.content}>
        {logo && (
          <Image
            source={logo}
            style={{ width: logoSize, height: logoSize, marginRight: 10 }}
          />
        )}
        <Text
          style={[
            styles.text,
            type === 'primary'
              ? styles.primaryText
              : type === 'secondary'
                ? styles.secondaryText
                : styles.logoText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#FFC107',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  logoButton: {
    backgroundColor: '#FFFFFF', // white background
    borderWidth: 1.5,
    borderColor: '#000000', // black border
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#000000',
  },
  secondaryText: {
    color: '#000000',
  },
  logoText: {
    color: '#000000',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CustomButton;
