import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {formatToNaira} from '../../Library/Common';
import {COLORS} from '../../themes/themes';
import {windowWidth} from '../../utils/Dimensions';
import AvailabilityCard from './AvailabilityCard';

const VtbTruckCard = ({props, onPress}) => {
  console.log('ppp', props);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.vtbCard}>
      {/* Main truck image showcase */}
      <View style={styles.imageContainer}>
        <Image source={{uri: props?.pictures[0]}} style={styles.truckImage} />
      </View>

      {/* Truck info header */}
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.truckName}>{props?.car_name}</Text>
          <Text style={styles.truckType}>{props?.type}</Text>
        </View>
        <AvailabilityCard availability={props?.availability} />
      </View>

      {/* Price section */}
      <View style={styles.priceSection}>
        <Ionicons
          name="cash-outline"
          size={16}
          color={COLORS.primary || '#007AFF'}
          style={styles.priceIcon}
        />
        <Text style={styles.basefareLabel}>Basefare: </Text>
        <Text style={styles.priceAmount}>
          {formatToNaira(props?.price?.[0])}
        </Text>
        <Text style={styles.priceUnit}>/km</Text>
      </View>

      {/* Details section */}
      {/* <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Ionicons
              name="location-outline"
              size={14}
              color={COLORS.appGrey2}
            />
            <Text style={styles.detailLabel}>Location</Text>
          </View>
          <Text style={styles.detailValue}>{props?.location}</Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailHeader}>
            <Ionicons name="cube-outline" size={14} color={COLORS.appGrey2} />
            <Text style={styles.detailLabel}>Capacity</Text>
          </View>
          <Text style={styles.detailValue}>10 tons</Text>
        </View>
      </View> */}
    </TouchableOpacity>
  );
};

export default VtbTruckCard;

const styles = StyleSheet.create({
  vtbCard: {
    width: windowWidth / 1.1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.appGrey,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  truckImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  truckName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  truckType: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.appGrey5,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  priceIcon: {
    marginRight: 6,
  },
  basefareLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  detailItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.appGrey2,
    marginLeft: 4,
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
