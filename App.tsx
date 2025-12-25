// App.tsx
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import ThemeProvider from './src/context/theme';

import { registerTokenDevice } from '@/src/api/notifee.api';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import RootNavigator from './navigation/RootNavigator';
import { persistor, store } from './src/store/store';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();

      // if (alive) {
      //   await registerTokenDevice(deviceId, token, 'ANDROID');
      // }
    };

    run().catch(console.log);

    return () => {
      alive = false;
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <GluestackUIProvider>
            <ThemeProvider>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <RootNavigator />
            </ThemeProvider>
          </GluestackUIProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
