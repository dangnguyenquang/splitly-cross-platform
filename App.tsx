// App.tsx
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import AppNavigator from './navigation/AppNavigator';
import ThemeProvider from './src/context/theme';

import { Provider } from 'react-redux';
import { store, persistor } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import messaging from '@react-native-firebase/messaging';

  import {PermissionsAndroid} from 'react-native';
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    (async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('FCM_TOKEN:', token);
    })();
    const unsub = messaging().onMessage(async rm => {
      console.log('FCM_FOREGROUND:', rm);
    });
    return unsub;
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
              <AppNavigator />
            </ThemeProvider>
          </GluestackUIProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
