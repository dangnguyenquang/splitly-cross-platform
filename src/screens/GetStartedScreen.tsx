import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/src/types';
const { width, height } = Dimensions.get('window');

export default function GetStartedScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.topImage}
          resizeMode="cover"
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Let's get started</Text>
          <Text style={styles.subtitle}>
            Easily manage your Splitlyfy friends. Add, remove, and stay in the
            loop of who you're splitting with.
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Login with Google"
            type="logo"
            logo={require('../../assets/logo/google_logo.png')}
            onPress={() => console.log('Google login')}
            width={width * 0.85}
            height={50}
          />

          <CustomButton
            title="Sign Up"
            width={width * 0.85}
            height={50}
            borderRadius={30}
            onPress={() => navigation.navigate('SignUp')}
          />

          <CustomButton
            title="Log in"
            type="secondary"
            width={width * 0.85}
            height={50}
            borderRadius={30}
            onPress={() => navigation.navigate('SignIn')}
          />
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footerText}>
        <Text style={styles.footerLink}>Privacy Policy</Text>
        <Text style={styles.dot}> • </Text>
        <Text style={styles.footerLink}>Terms of Service</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    fontFamily: 'NunitoSans-Variable',
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  topImage: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: 30,
  },

  titleContainer: {
    marginBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'NunitoSans-Variable',
    color: '#222',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },

  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  footerLink: {
    fontSize: 13,
    color: '#888',
  },

  dot: {
    color: '#aaa',
    marginHorizontal: 6,
  },
});
