import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

async function requestPostNotificationsPermission() {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version < 33) return true;

  const res = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  return res === PermissionsAndroid.RESULTS.GRANTED;
}

export async function getFcmToken(): Promise<string> {
  // giúp tránh vài edge-case khi thiết bị chưa register remote messages
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  return token;
}
