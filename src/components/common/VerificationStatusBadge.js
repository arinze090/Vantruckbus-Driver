import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VerificationStatus = ({status}) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return {
          icon: 'checkmark-circle-outline',
          color: 'green',
          label: 'Verified',
        };
      case 'pending':
        return {icon: 'hourglass-outline', color: 'orange', label: 'Pending'};
      default:
        return {
          icon: 'close-circle-outline',
          color: 'red',
          label: 'Not Verified',
        };
    }
  };

  const {icon, color, label} = getStatusConfig();

  return (
    <View style={styles.statusContainer}>
      <Ionicons name={icon} size={18} color={color} />
      {/* <Text style={[styles.statusText, {color}]}>{label}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VerificationStatus;
