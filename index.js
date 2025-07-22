/**
 * @format
 */

import 'react-native-gesture-handler';

import React from 'react';
import {AppRegistry, Platform, View, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Toast from 'react-native-toast-message';
import {Fragment} from 'react';
import {windowHeight, windowWidth} from './src/utils/Dimensions';
import {COLORS} from './src/themes/themes';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('backgroundMessage!', remoteMessage);
  const pushObject = {
    title: remoteMessage?.notification?.title,
    body: remoteMessage?.notification?.body,
    ios: {
      // attachments: [
      //  {
      //      url: remoteMessage?.data?.url,
      //  },
      // ],
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

messaging()
  .getIsHeadless()
  .then(isHeadless => {
    // do sth with isHeadless
    console.log('isHeadless', isHeadless);
  });

const RootApp = ({isHeadless}) => {
  const toastConfig = {
    rendezvousToast: ({text2}) => (
      <View
        style={{
          height: Platform.OS == 'ios' ? windowHeight / 15 : 60,
          width: windowWidth / 1.1,
          backgroundColor: COLORS.vtbBtnColor,
          borderRadius: 5,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}>
        <Text style={{color: 'white', fontSize: 15, fontWeight: '700'}}>
          {text2}
        </Text>
      </View>
    ),
  };

  return (
    <Fragment>
      <App />
      <Toast config={toastConfig} />
    </Fragment>
  );
};
AppRegistry.registerComponent(appName, () => RootApp);
