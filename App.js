import React, {useEffect, useState} from 'react';
import {LogBox, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as ReduxStoreProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import store, {persistor} from './src/redux/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import MainNavigator from './src/navigation/MainNavigator';
import AppNavigation from './src/navigation/AppNavigator';
import {setFcmToken} from './src/redux/features/user/userSlice';

LogBox.ignoreAllLogs();

export default function App({}) {
  const [notifiGranted, setNotifiGranted] = useState();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      setNotifiGranted(enabled);
    }
  }

  const getFcmToken = async () => {
    try {
      // Register the device with FCM
      await messaging().registerDeviceForRemoteMessages();
      const newFcmToken = await messaging().getToken();

      store.dispatch(setFcmToken(newFcmToken));

      // Send fcmtoken to database
      console.log('newFcmToken', newFcmToken);
      Alert.alert('newFcmToken', newFcmToken);
      return newFcmToken;
    } catch (error) {
      console.error('GETFCMError', error);
      return null;
    }
  };

  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('remoteMessage', remoteMessage);
    Alert.alert('Firebase notiff', remoteMessage);
    const pushObject = {
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      ios: {
        attachments: [
          {
            url: remoteMessage?.data?.url,
          },
        ],
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    };
    if (remoteMessage?.data?.image) {
      pushObject.ios.attachments = [
        {
          url: remoteMessage?.data?.url,
        },
      ];
    }
    // await notifee.displayNotification(pushObject);
    await notifee.displayNotification({
      title: 'Hello',
      body: 'World',
    });
  });

  const sendMessageOnBackground = async () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('appJsBackground', remoteMessage);
      const pushObject = {
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        ios: {
          attachments: [
            {
              url: remoteMessage?.data?.url,
            },
          ],
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      };
      if (remoteMessage?.data?.url) {
        pushObject.ios.attachments = [
          {
            url: remoteMessage?.data?.url,
          },
        ];
      }
      await notifee.displayNotification(pushObject);
    });
  };

  useEffect(() => {
    requestUserPermission();
    getFcmToken();
    sendMessageOnBackground();
    unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <ReduxStoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </PersistGate>
      </ReduxStoreProvider>
    </SafeAreaProvider>
  );
}
