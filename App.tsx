// App.tsx
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import ThemeProvider from './src/context/theme';

import { setAccessTokenGetter } from '@/src/service/axios';
import { setupForegroundNotifications } from '@/src/service/notifee';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { PermissionsAndroid } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import RootNavigator from './navigation/RootNavigator';
import { persistor, store } from './src/store/store';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
setAccessTokenGetter(
  () => store.getState().auth?.login?.currentUser?.token ?? null,
);
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    let unsubOnMessage: undefined | (() => void);
    let cancelled = false;

    const run = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('device token: ', token);
      if (!cancelled) {
        try {
          unsubOnMessage = await setupForegroundNotifications();
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log('setupForegroundNotifications failed', err);
          }
        }
      }
    };

    run().catch(console.log);

    return () => {
      cancelled = true;
      unsubOnMessage?.(); //cleanup listener
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
