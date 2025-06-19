import React, {useEffect, useState} from 'react';
import {Text, View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import polyline from '@mapbox/polyline';
import axios from 'axios';
import debounce from 'lodash.debounce';
import {HERE_API_KEY} from '@env';
import MapView, {Marker, Polyline} from 'react-native-maps';

import SafeAreaViewComponent from '../components/common/SafeAreaViewComponent';
import HeaderTitle from '../components/common/HeaderTitle';
import SearchBar from '../components/search/SearchBar';
import {COLORS} from '../themes/themes';
import {windowHeight} from '../utils/Dimensions';
import {formatToNaira} from '../Library/Common';

const MapsSearchScreenn = ({navigation, route}) => {
  const item = route?.params;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedQueryData, setSelectedQueryData] = useState();
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  console.log('selectedQueryData', selectedQueryData, routeCoords, routeInfo);

  const pickupCoords = {
    longitude: item?.coordinates?.longitude,
    latitude: item?.coordinates?.latitude,
  };

  const dropoffCoords = {
    longitude: selectedQueryData?.position?.lng,
    latitude: selectedQueryData?.position?.lat,
  };

  console.log('dropoffCoords', dropoffCoords, pickupCoords);

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
            at: `${pickupCoords.latitude},${pickupCoords.longitude}`,
          },
        },
      );
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
    setSelectedQueryData(itemx);
    setQuery(itemx?.title);
    setSuggestions([]);

    getRouteFromHere(pickupCoords, itemx?.position);
  };

  // const decodePolyline = encoded => {
  //   const decoded = polyline.decode(encoded);
  //   return decoded.map(([lat, lng]) => [lng, lat]); // ✅ GeoJSON format
  // };

  // ✅ Fixed polyline decoding function
  const decodePolyline = encoded => {
    try {
      const decoded = polyline.decode(encoded);
      // Ensure coordinates are in [longitude, latitude] format for Mapbox
      const validCoords = decoded
        .map(([lng, lat]) => {
          // Validate coordinates
          if (
            typeof lng === 'number' &&
            typeof lat === 'number' &&
            lng >= -180 &&
            lng <= 180 &&
            lat >= -90 &&
            lat <= 90
          ) {
            return [lng, lat];
          }
          return null;
        })
        .filter(coord => coord !== null);

      console.log('Decoded coordinates:', validCoords);
      return validCoords;
    } catch (error) {
      console.error('Error decoding polyline:', error);
      return [];
    }
  };

  // const getRouteFromHere = async (origin, destination) => {
  //   const params = {
  //     transportMode: 'truck',
  //     origin: `${origin?.latitude},${origin?.longitude}`,
  //     destination: `${destination?.lat},${destination?.lng}`,
  //     return: 'polyline',
  //     apiKey: HERE_API_KEY,
  //   };

  //   const queryString = new URLSearchParams(params).toString();
  //   const url = `https://router.hereapi.com/v8/routes?${queryString}`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     console.log('getRouteFromHere res', data);

  //     const polylineEncoded = data?.routes[0]?.sections[0]?.polyline;
  //     console.log('polylineEncoded', polylineEncoded);

  //     const decoded = decodePolyline(polylineEncoded);
  //     console.log('decoded', decoded);
  //     setRouteCoords(decoded);
  //   } catch (error) {
  //     console.error('Routing error:', error);
  //   }
  // };

  // ✅ Improved route fetching with better error handling
  const getRouteFromHere = async (origin, destination) => {
    if (
      !origin?.latitude ||
      !origin?.longitude ||
      !destination?.lat ||
      !destination?.lng
    ) {
      console.error('Invalid coordinates provided');
      return;
    }

    const params = {
      transportMode: 'car',
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.lat},${destination.lng}`,
      return: 'polyline,summary',
      apiKey: HERE_API_KEY,
    };
    console.log('getRouteFromHere params', params);

    const queryString = new URLSearchParams(params).toString();
    const url = `https://router.hereapi.com/v8/routes?${queryString}`;

    console.log('Origin:', origin);
    console.log('Destination:', destination);
    console.log('Formatted URL:', url);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('HERE API Response:', data);

      // ✅ Better error handling for API response
      if (!data.routes || data.routes.length === 0) {
        console.error('No routes found');
        setRouteCoords([]);
        return;
      }

      const routee = data?.routes[0];

      // ✅ Extract route summary information
      const summary = routee?.sections[0]?.summary;
      console.log('summarysummary', summary);
      if (summary) {
        setRouteInfo({
          distance: summary.length, // in meters
          duration: summary.duration, // in seconds
          baseDuration: summary.baseDuration, // in seconds without traffic
        });
      }
      if (!routee.sections || routee.sections.length === 0) {
        console.error('No route sections found');
        setRouteCoords([]);
        return;
      }

      const polylineEncoded = routee.sections[0].polyline;
      console.log('Encoded polyline:', polylineEncoded);

      if (!polylineEncoded) {
        console.error('No polyline data found');
        setRouteCoords([]);
        return;
      }

      const decoded = decodePolyline(polylineEncoded);
      console.log('Final decoded coordinates:', decoded);

      if (decoded.length > 0) {
        setRouteCoords(decoded);
      } else {
        console.error('No valid coordinates after decoding');
        setRouteCoords([]);
      }
    } catch (error) {
      console.error('Routing error:', error);
      setRouteCoords([]);
    }
  };

  // ✅ Helper functions for formatting
  const formatDistance = meters => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = seconds => {
    if (seconds < 60) {
      return `${Math.round(seconds)} sec`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const formatPerMinute = seconds => {
    if (seconds < 60) {
      return `${Math.round(seconds)}`;
    } else {
      console.log('fff', `${Math.round(seconds / 60)}`);
      return `${Math.round(seconds / 60)}`;
    }
  };

  useEffect(() => {
    console.log('Route updated:', routeCoords);
  }, [routeCoords]);

  const coords = [
    [7.4955, 8.6129], // Wamba
    [7.4958, 9.0579],
    [7.498, 9.2679],
    [7.49, 9.4761],
    [7.4799, 9.0579], // Near Abuja
  ];

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        headerTitle="Your route"
        onLeftIconPress={() => navigation.goBack()}
        leftIcon="close-outline"
      />

      <SearchBar
        searchIcon="radio-button-on-outline"
        searchIconColor={COLORS.vtbBtnColor}
        searchPhrase={item?.userLiveAddress}
      />

      <SearchBar
        searchIcon="search-outline"
        onPressIn={() => fetchSuggestions(query)}
        searchPhrase={query}
        setSearchPhrase={handleInputChange}
      />

      {/* ✅ Route Information Card */}
      {routeInfo && (
        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoRow}>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Distance</Text>
              <Text style={styles.routeInfoValue}>
                {formatDistance(routeInfo?.distance)}
              </Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Duration</Text>
              <Text style={styles.routeInfoValue}>
                {formatDuration(routeInfo?.duration)}
              </Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Est. Cost</Text>
              <Text style={styles.routeInfoValue}>
                {/* ₦{Math.round(routeInfo.distance * 150)} */}
                {formatToNaira(formatPerMinute(routeInfo?.duration) * 1500)}
              </Text>
            </View>
          </View>
        </View>
      )}

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

      {/* ✅ Mapbox Section */}

      {/* ✅ Enhanced Mapbox Section with better bounds calculation */}
      {dropoffCoords?.longitude &&
        dropoffCoords?.latitude &&
        pickupCoords?.longitude &&
        pickupCoords?.latitude && (
          <MapboxGL.MapView
            zoomEnabled={true}
            style={styles.mapContainer}
            styleURL={MapboxGL.StyleURL.Street}>
            <MapboxGL.Camera
              bounds={{
                ne: [
                  Math.max(pickupCoords.longitude, dropoffCoords.longitude) +
                    0.01,
                  Math.max(pickupCoords.latitude, dropoffCoords.latitude) +
                    0.01,
                ],
                sw: [
                  Math.min(pickupCoords.longitude, dropoffCoords.longitude) -
                    0.01,
                  Math.min(pickupCoords.latitude, dropoffCoords.latitude) -
                    0.01,
                ],
                paddingTop: 100,
                paddingBottom: 100,
                paddingLeft: 50,
                paddingRight: 50,
              }}
              animationMode="flyTo"
              animationDuration={1500}
              // centerCoordinate={routeCoords[0]}
              // zoomLevel={10}
            />

            {/* Pickup Marker */}
            <MapboxGL.PointAnnotation
              id="pickup"
              coordinate={[pickupCoords.longitude, pickupCoords.latitude]}>
              <View style={styles.marker} />
            </MapboxGL.PointAnnotation>

            {/* Dropoff Marker */}
            <MapboxGL.PointAnnotation
              id="dropoff"
              coordinate={[dropoffCoords.longitude, dropoffCoords.latitude]}>
              <View style={[styles.marker, {backgroundColor: 'red'}]} />
            </MapboxGL.PointAnnotation>

            {/* ✅ Enhanced Route Line with validation */}
            {routeCoords?.length > 1 && (
              <MapboxGL.ShapeSource
                key={`route-${routeCoords.length}`}
                id="routeSource"
                shape={{
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: routeCoords,
                  },
                }}>
                <MapboxGL.LineLayer
                  id="routeLine"
                  style={{
                    lineColor: '#3498db',
                    lineWidth: 4,
                    lineOpacity: 1,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              </MapboxGL.ShapeSource>
            )}
          </MapboxGL.MapView>
        )}

      {/* ✅ Bottom Action Button */}
      {routeInfo && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log('Book ride pressed');
            }}>
            <Text style={styles.actionButtonText}>
              Book Ride • {formatDistance(routeInfo.distance)} •{' '}
              {formatDuration(routeInfo.duration)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaViewComponent>
  );
};

export default MapsSearchScreenn;

const styles = StyleSheet.create({
  mapContainer: {
    // flex: 1,
    height: windowHeight,
  },
  routeInfoCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  routeInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  suggestionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  pickupMarker: {
    alignItems: 'center',
  },
  dropoffMarker: {
    alignItems: 'center',
  },
  markerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#007AFF',
    marginTop: -3,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
