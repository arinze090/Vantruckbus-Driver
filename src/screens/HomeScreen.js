import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';

import SafeAreaViewComponent from '../components/common/SafeAreaViewComponent';
import HomeHeader from '../components/common/HomeHeader';

import ScrollViewSpace from '../components/common/ScrollViewSpace';
import Carousels from '../components/common/Carousel';
import {
  saveProductCatgeories,
  saveTruckListings,
} from '../redux/features/user/userSlice';
import axiosInstance, {baseURL} from '../utils/api-client';
import verifyTokenWithoutApi from '../components/hoc/verifyToken';
import {COLORS} from '../themes/themes';
import {windowHeight} from '../utils/Dimensions';
import FormInput from '../components/form/FormInput';
import PickerSelect from '../components/pickerSelect/PickerSelect';
import VtbTruckCard from '../components/cards/VtbTruckCard';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  console.log('userProfle', userProfle);

  const reduxTruckListings = state?.user?.truckListings;
  console.log('reduxTruckListings', reduxTruckListings);

  const productCategories = async () => {
    axiosInstance({
      url: 'category',
      method: 'GET',
    })
      .then(res => {
        console.log('productCategories res', res);
        dispatch(saveProductCatgeories(res?.data?.data?.categories));
      })
      .catch(err => {
        console.log('productCategories err', err);
      });
  };

  const fetchTruckListings = async () => {
    try {
      await axiosInstance({
        url: 'api/listing/all-offerings',
        method: 'GET',
      })
        .then(res => {
          console.log('fetchTruckListings res', res?.data);
          dispatch(saveTruckListings(res?.data?.data));
        })
        .catch(err => {
          console.log('fetchTruckListings err', err?.response?.data);
        });
    } catch (error) {
      console.log('fetchTruckListings error', error);
    }
  };

  Geolocation.getCurrentPosition(info => console.log('Geolocationinfo', info));

  useEffect(() => {
    // productCategories();
    fetchTruckListings();
  }, []);

  return (
    <View style={{flex: 1}} showsVerticalScrollIndicator={false}>
      <View
        style={{
          backgroundColor: COLORS.vtbBtnColor,
          marginBottom: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.menuBorder} activeOpacity={0.9}>
              <Ionicons
                name="menu-outline"
                size={25}
                color="black"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </TouchableOpacity>

            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>
                Hello,{' '}
                <Text style={{fontWeight: '600'}}>{userProfle?.fullname} </Text>
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="white"
              onPress={() => {
                navigation.navigate('Notification');
              }}
              style={{marginLeft: 24}}
            />
          </View>
        </View>
        <View
          style={{
            padding: 20,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, color: 'white', marginBottom: 10}}>
            Good Morning, Arinze!
          </Text>
          <Text style={{fontSize: 22, color: 'white', fontWeight: '600'}}>
            Want to Book a Truck ?
          </Text>
        </View>
      </View>

      {/* Carousel section */}
      <Carousels />

      {/* Popular Trucks */}
      <ScrollView
        contentContainerStyle={{padding: 20}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>Popular Trucks</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              textDecorationLine: 'underline',
            }}>
            See More
          </Text>
        </View>
        {reduxTruckListings?.map((cur, i) => (
          <VtbTruckCard
            key={i}
            props={cur}
            onPress={() => {
              navigation.navigate('TruckDetails');
            }}
          />
        ))}

        <ScrollViewSpace />
      </ScrollView>
    </View>
  );
};

export default verifyTokenWithoutApi(HomeScreen);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    // backgroundColor: '#F7F7F7',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 40,
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 20,
  },
  profileDetails: {
    // alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 24,
    color: 'white',
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    color: '#000',
  },
  wallet: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.pinky,
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 6,
  },
  walletBalance: {
    color: 'black',
    fontWeight: '700',
    fontSize: 14,
    marginRight: 6,
  },
  menuBorder: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
  },
});
