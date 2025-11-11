// App.tsx
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import AppNavigator from './navigation/AppNavigator';
import ThemeProvider from './src/context/theme';

import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider"

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
      <ThemeProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <AppNavigator />
      </ThemeProvider>
    </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

export default App;