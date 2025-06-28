import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {AppState} from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen1 from '../screens/auth/RegisterScreen1';
import RegisterScreen2 from '../screens/auth/RegisterScreen2';
import EmailVerificationScreen from '../screens/auth/EmailVerification';
import ForgetPassword from '../screens/auth/ForgotPassword';
import ResetPassword from '../screens/auth/ResetPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingFlow from '../screens/auth/OnboardingFlow';
import OnboardingScreen2 from '../screens/auth/OnboardingScreen2';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const state = useSelector(state => state);
  const reduxLaunchScreen = state?.user?.launchScreen;

  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // To show the onboarding screen on just first launch
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      AsyncStorage.getItem('alreadyLaunched').then(value => {
        console.log('launchVal', value);
        if (value === null) {
          AsyncStorage.setItem('alreadyLaunched', 'true');
          setIsFirstLaunch(true);
          console.log('isFirstLaunch');
        } else {
          setIsFirstLaunch(false);
          console.log('notIsFirstLaunch');
        }
      });

      AppState.addEventListener('change', state =>
        console.log('AppState changed to', state),
      );
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setLoading(reduxLaunchScreen);
    setIsFirstLaunch(false);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [reduxLaunchScreen]);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="OnboardingScreen2"
          component={OnboardingScreen2}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {loading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen1} />
            <Stack.Screen name="Register2" component={RegisterScreen2} />
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerificationScreen}
            />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} />
          </>
        )}
      </Stack.Navigator>
    );
  }
};

export default AuthStack;
