import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {HERE_API_KEY} from '@env';
import Toast from 'react-native-toast-message';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {
  getUser,
  saveTruckListings,
  saveUserLocationCoordinates,
} from '../redux/features/user/userSlice';
import axiosInstance from '../utils/api-client';
import {COLORS} from '../themes/themes';
import {windowHeight, windowWidth} from '../utils/Dimensions';
import {getTimeOfDayGreeting, RNToast} from '../Library/Common';
import {checkDriverProfile} from '../services/userServices';
import DriverNotVerifiedComponent from '../components/common/DriverNotVerifiedComponent';
import DriverNotAssignedToTruckComponent from '../components/common/DriverNotAssignedToTruckComponent';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const mapRef = useRef(null);

  const userProfle = state?.user?.user;
  const hasVerificationData = userProfle?.User?.verification;
  console.log('userProfle', userProfle, hasVerificationData);

  const reduxTruckListings = state?.user?.truckListings;
  console.log('reduxTruckListings', reduxTruckListings);

  const [loading, setLoading] = useState(false);

  const [userLiveAddress, setUserLiveAddress] = useState();
  const [coordinates, setCoordinates] = useState();
  const [isOnline, setIsOnline] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  console.log('location', location, errorMsg);
  console.log('coordinates', coordinates);

  const toggleOnlineStatus = async () => {
    if (userProfle?.assignedTrucks) {
      setIsOnline(!isOnline);

      const locationUpdateData = {
        listingId: userProfle?.assignedTrucks[0]?.truckId,
        location: [coordinates],
      };

      try {
        await axiosInstance({
          url: 'api/location/driver-location',
          method: 'POST',
          data: locationUpdateData,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            console.log('toggleOnlineStatus res', res?.data);

            // fetch the userprofile again here
            checkDriverProfile(dispatch, getUser, axiosInstance, setLoading);
          })
          .catch(err => {
            console.log('toggleOnlineStatus err', err?.response?.data);
          });
      } catch (error) {
        console.log('toggleOnlineStatus error', error);
      }
    } else {
      RNToast(
        Toast,
        'You are not yet a truck driver or assigned to a truck yet',
      );
    }
  };

  const fetchTruckListings = async () => {
    try {
      await axiosInstance({
        url: 'api/listings/all-offerings',
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

  const reverseGeocode = async (lat, lng) => {
    const apiKey = HERE_API_KEY;

    try {
      const res = await axios.get(
        'https://revgeocode.search.hereapi.com/v1/revgeocode',
        {
          params: {
            at: `${lat},${lng}`,
            apikey: apiKey,
          },
        },
      );

      console.log('reverseGeocode res:', res);

      const address = res?.data?.items?.[0]?.address?.label;
      setUserLiveAddress(address);
      console.log('Resolved address:', address);
      return address;
    } catch (error) {
      console.error('Reverse geocoding error:', error?.response);
      return null;
    }
  };

  useEffect(() => {
    fetchTruckListings();
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        console.log('Geolocationinfo', info);
        setCoordinates(info?.coords);
        reverseGeocode(info?.coords?.latitude, info?.coords?.longitude);

        // dispatch the coordinates to redux just incase its used elsewhere
        dispatch(saveUserLocationCoordinates(info?.coords));
      },
      error => {
        console.log('Geolocation error', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  // to update the drivers location real time
  useEffect(() => {
    if (coordinates && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [coordinates]);

  return (
    <View style={{flex: 1}} showsVerticalScrollIndicator={false}>
      {!userProfle?.isVerified &&
      !hasVerificationData?.supportingDocuments?.length ? (
        <DriverNotVerifiedComponent />
      ) : !userProfle?.assignedTrucks?.length ? (
        <DriverNotAssignedToTruckComponent />
      ) : (
        <View style={{flex: 1}}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shieldButton}>
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Map Container */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={
                coordinates
                  ? {
                      latitude: coordinates.latitude,
                      longitude: coordinates.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
                  : null
              }
              showsUserLocation={true}
              showsMyLocationButton={false}
              zoomEnabled={true}
              scrollEnabled={true}>
              <Marker coordinate={coordinates}>
                <Ionicons
                  name="car-outline"
                  size={50}
                  color={COLORS.vtbBtnColor}
                />
              </Marker>
            </MapView>
          </View>

          {/* Go Online Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.onlineButton, isOnline && styles.onlineButtonActive]}
            onPress={toggleOnlineStatus}>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#fff"
              style={styles.onlineButtonIcon}
            />
            <Text style={styles.onlineButtonText}>
              {isOnline ? 'Go offline' : 'Go online'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  carIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -15}],
    zIndex: 1,
  },
  carIcon: {
    width: 40,
    height: 30,
    position: 'relative',
  },
  carBody: {
    width: 40,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 8,
    position: 'absolute',
    top: 5,
  },
  onlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C851',
    marginHorizontal: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,

    padding: 20,
    justifyContent: 'center',
  },
  onlineButtonActive: {
    backgroundColor: '#ff4444',
  },
  onlineButtonIcon: {
    marginRight: 12,
  },
  onlineButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
