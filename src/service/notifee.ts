import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

type AnyData = Record<string, string | object | undefined>;

const normalizeData = (data?: AnyData): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!data) return out;

  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string') out[k] = v;
    else if (v != null) out[k] = JSON.stringify(v); // fallback if obj
  }
  return out;
};

const createAndroidChannel = async () => {
  if (Platform.OS !== 'android') return 'default';
  return notifee.createChannel({
    id: 'default_high',         
    name: 'Default (High)',
    importance: AndroidImportance.HIGH, // heads-up
  });
};

const parsePayload = (data: Record<string, string>) => {
  const raw = data.payload;
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return { _raw: raw };
  }
};

export const setupForegroundNotifications = async () => {
  // Android 13+
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const channelId = await createAndroidChannel();

  return messaging().onMessage(async (rm: FirebaseMessagingTypes.RemoteMessage) => {

    const data = normalizeData(rm.data as AnyData | undefined);

    const title = data.title ?? rm.notification?.title ?? '';
    const body = data.body ?? rm.notification?.body ?? '';

    const notificationImage = data.notificationImage; // string | undefined
    const payloadObj = parsePayload(data);

    await notifee.displayNotification({
      title,
      body,
      data: {
        notificationType: data.notificationType ?? '',
        payload: payloadObj ? JSON.stringify(payloadObj) : '',
      },
      android: {
        channelId,
        pressAction: { id: 'default' },
        smallIcon: 'logo',
        style: notificationImage
          ? { type: AndroidStyle.BIGPICTURE, picture: notificationImage }
          : undefined,
      },
    });
  });
};
