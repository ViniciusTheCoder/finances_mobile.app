import React from 'react';
import { StatusBar } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR'
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Routes } from './src/routes'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';



import theme, { } from './src/global/styles/theme';

import { AppRoutes } from './src/routes/app.routes';

import { SignIn } from './src/screens/SignIn';

import { AuthProvider, useAuth } from './src/hooks/auth';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "EventEmitter.removeListener('url', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`."
])

export default function App() {

  SplashScreen.preventAutoHideAsync();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  if (!fontsLoaded || userStorageLoading) {
    return null;
  }

  SplashScreen.hideAsync();

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent />

        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )

}