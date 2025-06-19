import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {HERE_API_KEY, GOOGLE_MAPS_PLACES_API_KEY} from '@env';
import debounce from 'lodash.debounce';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import polyline from '@mapbox/polyline';
import MapboxGL from '@rnmapbox/maps';

import SafeAreaViewComponent from '../components/common/SafeAreaViewComponent';
import HeaderTitle from '../components/common/HeaderTitle';
import SearchBar from '../components/search/SearchBar';
import {COLORS} from '../themes/themes';
import {windowHeight, windowWidth} from '../utils/Dimensions';

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (windowWidth / windowHeight);

const MapsSearchScreen = ({navigation, route}) => {
  const item = route?.params;
  console.log('userLiveAddress', item);

  const mapRef = useRef();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedQueryData, setSelectedQueryData] = useState();
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeCoordsx, setRouteCoordsx] = useState();

  console.log('selectedQueryData', selectedQueryData, routeCoords);

  const pickupCoords = {
    longitude: item?.coordinates?.longitude,
    latitude: item?.coordinates?.latitude,
  };

  const dropoffCoords = {
    longitude: selectedQueryData?.position?.lng,
    latitude: selectedQueryData?.position?.lat,
  };

  //   const routeCoords = [pickupCoords, dropoffCoords];

  const fetchSuggestions = async text => {
    if (!text) {
      return setSuggestions([]);
    }

    try {
      const res = await axios.get(
        'https://autosuggest.search.hereapi.com/v1/autosuggest',
        {
          params: {
            q: text,
            apiKey: HERE_API_KEY,
            // at: '6.5244,3.3792',
            at: `${item?.coordinates?.latitude},${item?.coordinates?.longitude}`,
          },
        },
      );

      console.log('fetchSuggestions', res?.data?.items);

      setSuggestions(res?.data?.items || []);
    } catch (error) {
      console.error('Error fetching suggestions', error?.response);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  const handleInputChange = text => {
    setQuery(text);
    debouncedFetch(text);
  };

  const handleSelect = itemx => {
    console.log('Selected location:', itemx);
    setSelectedQueryData(itemx);
    setQuery(itemx?.title);
    setSuggestions([]);

    getRouteFromHere(pickupCoords, itemx?.position);
    getRouteFromGoogle(pickupCoords, itemx?.position);
  };

  const decodePolyline = encoded => {
    const decoded = polyline.decode(encoded);
    console.log('decoded', decoded);

    return decoded.map(([lat, lng]) => ({latitude: lat, longitude: lng}));
  };

  const getRouteFromHere = async (origin, destination) => {
    const params = {
      transportMode: 'truck',
      origin: `${origin?.latitude},${origin?.longitude}`,
      destination: `${destination?.lat},${destination?.lng}`,
      return: 'polyline',
      apiKey: HERE_API_KEY,
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `https://router.hereapi.com/v8/routes?${queryString}`;

    try {
      const response = await fetch(url);
      const data = await response?.json();
      console.log('getRouteFromHere res', data);

      const polylinex = data?.routes[0]?.sections[0]?.polyline;
      const newDropOff = data?.routes[0]?.sections[0]?.arrival?.place?.location;
      const newDropOffCoords = {
        longitude: newDropOff?.lng,
        latitude: newDropOff?.lat,
      };
      const decoded = decodePolyline(polylinex);
      console.log('decoded polylinex', decoded);

      setRouteCoords(decoded);
      console.log('setRouteCoords polylinex', routeCoords);

      navigation.navigate('MapsDisplayScreen', {
        routeCoords: decoded,
        pickoffCoords: pickupCoords,
        dropoffCoords: newDropOffCoords,
      });

      setRouteCoordsx({
        routeCoords: decoded,
        pickoffCoords: pickupCoords,
        dropoffCoords: newDropOffCoords,
      });

      //   return decoded;
    } catch (error) {
      console.error('Routing error:', error);
    }
  };

  const getRouteFromGoogle = async (origin, destination) => {
    if (!origin || !destination) {
      return;
    }

    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.lat},${destination.lng}`;
    const GOOGLE_API_KEY = GOOGLE_MAPS_PLACES_API_KEY;
    console.log('GOOGLE_API_KEY', GOOGLE_API_KEY);

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=driving&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('data', data);

      console.log('dddd', data?.routes);

      if (data.status !== 'OK') {
        console.error(
          'Google Directions Error:',
          data.error_message || data.status,
        );
        return;
      }

      const points = data?.routes[0]?.overview_polyline.points;
      const decoded = polyline.decode(points).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      setRouteCoords(decoded);

      const duration = data.routes[0].legs[0].duration.text;
      const arrivalTime = data.routes[0].legs[0].arrival_time?.text; // only available for transit
      const distance = data.routes[0].legs[0].distance.text;

      console.log('routesssss', duration, arrivalTime, distance);

      // setRouteInfo({duration, distance});

      console.log('Decoded Route:', decoded);
    } catch (error) {
      console.error('Google Directions Error:', error);
    }
  };

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        headerTitle={'Your route'}
        onLeftIconPress={() => navigation.goBack()}
        leftIcon={'close-outline'}
      />
      <SearchBar
        searchIcon={'radio-button-on-outline'}
        searchIconColor={COLORS.vtbBtnColor}
        searchPhrase={item?.userLiveAddress}
      />
      <SearchBar
        searchIcon={'search-outline'}
        onPressIn={fetchSuggestions}
        searchPhrase={query}
        setSearchPhrase={handleInputChange}
      />

      <FlatList
        data={suggestions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
              padding: 10,
            }}>
            <Text style={{color: 'black'}}>{item?.title}</Text>
            {item?.address && (
              <Text style={{color: '#888'}}>{item?.address.label}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* this is for displaying like how bolt display the data*/}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: pickupCoords?.latitude || 0,
          longitude: pickupCoords?.longitude || 0,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        region={
          pickupCoords && dropoffCoords
            ? {
                latitude: (pickupCoords.latitude + dropoffCoords.latitude) / 2,
                longitude:
                  (pickupCoords.longitude + dropoffCoords.longitude) / 2,
                latitudeDelta:
                  Math.abs(pickupCoords.latitude - dropoffCoords.latitude) *
                    2 || LATITUDE_DELTA,
                longitudeDelta:
                  Math.abs(pickupCoords.longitude - dropoffCoords.longitude) *
                    2 || LONGITUDE_DELTA,
              }
            : undefined
        }>
        {/* Pickup Marker */}
        {pickupCoords && (
          <Marker
            coordinate={{
              latitude: pickupCoords.latitude,
              longitude: pickupCoords.longitude,
            }}
            title="Pickup"
            pinColor="green"
          />
        )}

        {/* Dropoff Marker */}
        {dropoffCoords && (
          <Marker
            coordinate={{
              latitude: dropoffCoords.latitude,
              longitude: dropoffCoords.longitude,
            }}
            title="Dropoff"
            pinColor="red"
          />
        )}

        {/* Route Polyline */}
        {routeCoords && routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords} // e.g., [{ latitude: ..., longitude: ... }, ...]
            strokeColor="#4B4DED"
            strokeWidth={4}
          />
        )}
      </MapView>
    </SafeAreaViewComponent>
  );
};

export default MapsSearchScreen;

const styles = StyleSheet.create({});
