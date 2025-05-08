import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import ProfileScreen from './Profile/ProfileScreen';
import {COLORS} from '../themes/themes';
import EditProfile from './Profile/EditProfile';
import ResetPassword from './auth/ResetPassword';
import AccountSettings from './Profile/AccountSettings';
import ChangePassword from './Profile/ChangePassword';
import PasswordResetSuccess from './Profile/PasswordResetConfirmation';

import LoginScreen from './auth/LoginScreen';
import DetailsScreen from './Dashboard/DetailsScreen';

import Bookings from './Profile/Bookings';
import RegisterScreen1 from './auth/RegisterScreen1';
import RegisterScreen2 from './auth/RegisterScreen2';
import EmailVerificationScreen from './auth/EmailVerification';
import ForgetPassword from './auth/ForgotPassword';
import AccountCreationSuccess from './auth/AccountCreationSuccess';
import ProfileInfo from './Profile/ProfileInfo';
import ProfileInformation from './Profile/User/ProfileInformation';
import BasicInformation from './Profile/User/BasicInformation';

import SupportScreen from './Profile/SupportScreen';
import NotificationsScreen from './NotificationsScreen';

import LegalScreen from './Profile/LegalScreen';
import TruckListing from './TruckListings/TruckListing';
import TruckDetailsScreen from './TruckListings/TruckDetailsScreen';
import TruckBookingScreen from './TruckListings/TruckBookingScreen';
import BookedTrucksListingScreen from './TruckListings/BookedTrucksListingScreen';
import TruckBookingConfirmationScreen from './TruckListings/TruckBookingConfirmationScreen';
import OnboardingFlow from './auth/OnboardingFlow';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerLeft: () => (
          <View style={{marginLeft: 10}}>
            <Ionicons
              name="menu-outline"
              size={30}
              color="#333"
              onPress={() => navigation.navigate('Drawer')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen1}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Register2"
      component={RegisterScreen2}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="EmailVerification"
      component={EmailVerificationScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ForgetPassword"
      component={ForgetPassword}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="SuccessScreen"
      component={AccountCreationSuccess}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Details"
      component={DetailsScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />

    <Stack.Screen
      name="Notification"
      component={NotificationsScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />

    {/* Car Rental section */}

    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="PasswordResetSuccess"
      component={PasswordResetSuccess}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="Bookings"
      component={Bookings}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />

    <Stack.Screen
      name="Support"
      component={SupportScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />

    <Stack.Screen
      name="Legal"
      component={LegalScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

const AuthStack = ({}) => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      screenOptions={{headerShown: false}}
    />
    <Stack.Screen name="Register" component={RegisterScreen1} />
    <Stack.Screen name="Register2" component={RegisterScreen2} />
    <Stack.Screen
      name="EmailVerification"
      component={EmailVerificationScreen}
    />
    <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="SuccessScreen" component={AccountCreationSuccess} />
  </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerLeft: () => (
          <View style={{marginLeft: 10}}>
            <Ionicons
              name="menu-outline"
              size={30}
              color="#333"
              onPress={() => navigation.navigate('Drawer')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="ProfileInfo"
      component={ProfileInfo}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerLeft: () => (
          <View style={{marginLeft: 10}}>
            <Ionicons
              name="menu-outline"
              size={30}
              color="#333"
              onPress={() => navigation.navigate('Drawer')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="ProfileInformation"
      component={ProfileInformation}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="BasicProfile"
      component={BasicInformation}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />

    <Stack.Screen
      name="Account"
      component={AccountSettings}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="PasswordResetSuccess"
      component={PasswordResetSuccess}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="Bookings"
      component={Bookings}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />

    <Stack.Screen
      name="Support"
      component={SupportScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="Legal"
      component={LegalScreen}
      options={{
        headerShown: false,
        headerBackTitleVisible: false,
      }}
    />

    {/* auth flows */}
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
  </Stack.Navigator>
);

const TruckListingStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="TruckListing"
      component={TruckListing}
      options={{
        headerShown: false,
        headerTitle: 'Discover',
        headerBackTitleVisible: false,
        // headerLeft: () => (
        //   <View style={{marginLeft: 10}}>
        //     <Ionicons
        //       name="menu-outline"
        //       size={30}
        //       color="#333"
        //       onPress={() => navigation.navigate('Drawer')}
        //     />
        //   </View>
        // ),
      }}
    />

    <Stack.Screen
      name="TruckDetails"
      component={TruckDetailsScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="TruckBooking"
      component={TruckBookingScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="TruckBookingConfirmation"
      component={TruckBookingConfirmationScreen}
      options={{
        headerShown: false,
      }}
    />

    {/* auth flows */}
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen name="Register" component={RegisterScreen1} />
    <Stack.Screen name="Register2" component={RegisterScreen2} />
    <Stack.Screen
      name="EmailVerification"
      component={EmailVerificationScreen}
    />
    <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} />
  </Stack.Navigator>
);

const TruckBookingsStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Bookings"
      component={BookedTrucksListingScreen}
      options={{
        headerShown: false,
      }}
    />

    {/* auth flows */}
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
  </Stack.Navigator>
);

const MainScreen = () => {
  const state = useSelector(state => state);
  const loggedInUserRole = state?.user?.userRole;
  console.log('loggedInUserRole', loggedInUserRole);

  const userProfle = state?.user?.user;
  console.log('userProfle', userProfle);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          const routeWithNoTarBar = [
            'Details',
            'EditProfile',
            'ChangePassword',
            'PasswordResetSuccess',
            'PaymentMethod',
            'AddPaymentCard',
            'OrderSummary',
            'OrderSuccessful',
            'OrderReceipt',
            'Bookings',
            'ProfileInformation',
            'BasicProfile',
            'AdditionalInformation',

            'TruckDetails',
            'TruckBooking',
            'TruckBookingConfirmation',
          ];
          if (routeWithNoTarBar.includes(routeName)) {
            return {display: 'none'};
          }
          return {
            backgroundColor: COLORS.white,
          };
        })(route),
        tabBarActiveTintColor: COLORS.vtbBtnColor,
        tabBarColor: COLORS.vtbBtnColor,
        tabBarInActiveBackgroundColor: COLORS.vtbBtnColor,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({route}) => ({
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <Ionicons name="home-outline" color={color} size={26} />
          ),
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Trucks"
        component={TruckListingStack}
        options={({route}) => ({
          tabBarLabel: 'Trucks',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="truck-outline"
              color={color}
              size={26}
            />
          ),
          headerShown: false,
        })}
      />
      <Tab.Screen
        name={'Bookings'}
        component={userProfle ? TruckBookingsStack : AuthStack}
        options={({route}) => ({
          tabBarLabel: 'My Bookings',
          tabBarIcon: ({color}) => (
            <Ionicons name="receipt-outline" color={color} size={26} />
          ),
          headerShown: false,
        })}
      />
      <Tab.Screen
        name={'Profile'}
        component={userProfle ? ProfileStack : AuthStack}
        options={({route}) => ({
          tabBarLabel: userProfle ? 'Profile' : 'Login',
          tabBarIcon: ({color}) => (
            <Ionicons name="person-outline" color={color} size={26} />
          ),
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;
