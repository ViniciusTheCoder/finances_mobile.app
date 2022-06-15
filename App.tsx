import React from 'react';
import { StatusBar } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR'
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import { NavigationContainer } from '@react-navigation/native';

import theme, { } from './src/global/styles/theme';

import { AppRoutes } from './src/routes/app.routes';

import { SignIn } from './src/screens/SignIn';


export default function App() {

  SplashScreen.preventAutoHideAsync();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent />
          <SignIn />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )

}