// src/screens/OnboardScreen2.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardScreen2() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/image_2.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Track your expenses easily</Text>
        <Text style={styles.description}>
          Monitor and categorize your spending habits to manage your finances
          smartly.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { height: height * 0.55, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
  description: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 20,
  },
});
