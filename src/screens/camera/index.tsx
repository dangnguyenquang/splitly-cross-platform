import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/header';

export default function CameraScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Camera"
        onLeftPress={() => console.log('Menu pressed')}
        onRightPress={() => console.log('Notifications pressed')}
        backgroundColor= "#fff"
        titleColor="#070707ff"
        shadow={true}
      />

      <Text style={styles.previewText}>Preview text here...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontWeight: '500',
  },
  value: {
    fontWeight: '500',
  },
  previewText: {
    marginTop: 30,
    textAlign: 'center',
  },
});
