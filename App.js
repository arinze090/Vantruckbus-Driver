import React from 'react';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as ReduxStoreProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './src/redux/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';

import MainNavigator from './src/navigation/MainNavigator';
import AppNavigation from './src/navigation/AppNavigator';

LogBox.ignoreAllLogs();
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiYXJpYm9ibyIsImEiOiJjbWMwZW1mZjcwMWp1Mm1zMHpiZXRvMHJsIn0.lXKXWQLoZamYGiT6MdHYzw',
);

export default function App({}) {
  return (
    <SafeAreaProvider>
      <ReduxStoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </PersistGate>
      </ReduxStoreProvider>
    </SafeAreaProvider>
  );
}
