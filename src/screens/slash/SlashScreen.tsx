import { Spinner } from '@/components/ui/spinner';
import { colors } from '@/src/constant/theme';
import { RootStackParamList } from '@/src/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SlashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Onboard');
    }, 1000);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/logo.png')}
          style={styles.topImage}
          resizeMode="cover"
        />
        <Text style={styles.appName}>Splitly</Text>
        <Spinner color={colors.primary} size={80} style={styles.spinner} />
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
    position: 'relative',
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  topImage: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: 5,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'NunitoSans-Variable',
  },
  spinner: {
    position: 'absolute',
    bottom: 50,
  },
});
