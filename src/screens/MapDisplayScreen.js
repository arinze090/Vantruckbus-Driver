import {StyleSheet, Text, View, Alert, ActivityIndicator} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

const MapDisplayScreen = ({route}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // Add proper default values to prevent errors with undefined coordinates
  const item = route?.params || {};
  const routeCoords = item?.routeCoords;
  const pickup = item?.pickoffCoords; // assuming this is a typo in your original code
  const dropoff = item?.dropoffCoords;

  // Debug info - remove in production
  console.log('Route params:', item);
  console.log('Route coordinates count:', routeCoords?.length);
  console.log('Pickup:', pickup);
  console.log('Dropoff:', dropoff);

  // Validate coordinates
  useEffect(() => {
    const validateCoordinates = () => {
      setLoading(true);

      // Check if pickup and dropoff are valid
      if (!pickup?.latitude || !pickup?.longitude) {
        setError('Invalid pickup coordinates');
        setLoading(false);
        return false;
      }

      if (!dropoff?.latitude || !dropoff?.longitude) {
        setError('Invalid dropoff coordinates');
        setLoading(false);
        return false;
      }

      // Check route coordinates if they exist
      if (routeCoords && routeCoords.length > 0) {
        for (let i = 0; i < routeCoords.length; i++) {
          if (!routeCoords[i]?.latitude || !routeCoords[i]?.longitude) {
            setError(`Invalid route coordinate at index ${i}`);
            setLoading(false);
            return false;
          }
        }
      }

      setLoading(false);
      return true;
    };

    validateCoordinates();
  }, [pickup, dropoff, routeCoords]);

  // Fit map to coordinates after map is ready and coordinates are valid
  useEffect(() => {
    if (!loading && !error && mapRef.current) {
      // If we have route coordinates, fit to those
      if (routeCoords?.length > 0) {
        setTimeout(() => {
          mapRef.current.fitToCoordinates(routeCoords, {
            edgePadding: {top: 100, right: 50, bottom: 100, left: 50},
            animated: true,
          });
        }, 500); // Short delay to ensure map is fully loaded
      }
      // If no route coords but we have pickup and dropoff, fit to those points
      else if (pickup && dropoff) {
        setTimeout(() => {
          mapRef.current.fitToCoordinates([pickup, dropoff], {
            edgePadding: {top: 100, right: 50, bottom: 100, left: 50},
            animated: true,
          });
        }, 500);
      }
    }
  }, [loading, error, routeCoords, pickup, dropoff]);

  // Display loading indicator or error
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Calculate initial region if no route coordinates
  const initialRegion = {
    latitude: pickup?.latitude || 0,
    longitude: pickup?.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        zoomEnabled={true} // Allow zooming with gestures
        scrollEnabled={true}
        showsUserLocation
        initialRegion={initialRegion}
        onMapReady={() => console.log('Map is ready')}
        onError={error => console.log('Map error:', error)}>
        {pickup && (
          <Marker coordinate={pickup} title="Pickup" pinColor="green" />
        )}

        {dropoff && (
          <Marker coordinate={dropoff} title="Dropoff" pinColor="red" />
        )}

        {routeCoords?.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#00BFFF"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

export default MapDisplayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
