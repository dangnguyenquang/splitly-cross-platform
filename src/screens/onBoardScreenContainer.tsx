// src/screens/OnboardContainer.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  Animated,
} from 'react-native';
import OnboardScreen1 from './onBoardScreen1';
import OnboardScreen2 from './onBoardScreen2';
import OnboardScreen3 from './onBoardScreen3';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const screens = [<OnboardScreen1 />, <OnboardScreen2 />, <OnboardScreen3 />];
type OnboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Onboard'
>;


export default function OnboardContainer() {
  const navigation = useNavigation<OnboardNavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
    );
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.log('Navigate to Home screen');
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Onboarding Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={screens}
        renderItem={({ item }) => <View style={{ width }}>{item}</View>}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={20}
      />

      {/* Dots Indicator */}
      <View style={styles.dotContainer}>
        {screens.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });
          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#D3D3D3', '#FFC107', '#D3D3D3'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  backgroundColor: dotColor,
                },
              ]}
            />
          );
        })}
      </View>

        {currentIndex < screens.length - 1 ? (
        <View style={[styles.buttonRow, { justifyContent: 'space-between' }]}>
            <CustomButton
            title="Skip"
            type="secondary"
            width={190}
            height={60}
            borderRadius={25}
            onPress={handleSkip}
            />
            <CustomButton
            title="Continue"
            width={190}
            height={60}
            borderRadius={25}
            onPress={handleNext}
            />
        </View>
        ) : (
        <View style={[styles.buttonRow, { justifyContent: 'center' }]}>
            <CustomButton
            title="Get Started"
            width={400}
            height={50}
            borderRadius={30}
            onPress={() => navigation.navigate('GetStartedScreen')}
            />
        </View>
        )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily:'NunitoSans-Variable'
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
    buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    marginBottom: 50,
    },
});
