import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {HERE_API_KEY} from '@env';
import debounce from 'lodash.debounce';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import polyline from '@mapbox/polyline';

import SafeAreaViewComponent from '../components/common/SafeAreaViewComponent';
import HeaderTitle from '../components/common/HeaderTitle';
import SearchBar from '../components/search/SearchBar';
import {COLORS} from '../themes/themes';
import {windowHeight} from '../utils/Dimensions';

const MapsSearchScreen = ({navigation, route}) => {
  const item = route?.params;
  console.log('userLiveAddress', item);

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
        style={{flex: 1, backgroundColor: 'red', height: windowHeight / 1.4}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={{
          latitude: pickupCoords?.latitude,
          longitude: pickupCoords?.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {/* Pickup Marker */}
        <Marker coordinate={pickupCoords} title="Pickup" />

        {/* Dropoff Marker */}
        <Marker coordinate={dropoffCoords} title="Dropoff" />

        {/* Route Polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={COLORS.rendezvousRed}
            strokeWidth={4}
          />
        )}
      </MapView>
    </SafeAreaViewComponent>
  );
};

export default MapsSearchScreen;

const styles = StyleSheet.create({});
