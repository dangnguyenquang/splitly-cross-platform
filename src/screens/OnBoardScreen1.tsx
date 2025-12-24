import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function OnboardScreen1() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/image_2.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Curved White Bottom Section */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Track your expenses easily</Text>
        <Text style={styles.description}>
          Monitor and categorize your spending habits to manage your finances
          smartly.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  // Top Image
  imageContainer: {
    height: height * 0.55,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Curved White Section
  bottomContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  // Texts
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
    width: '85%',
  },
});
