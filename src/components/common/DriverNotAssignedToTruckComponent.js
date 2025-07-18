import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {checkDriverProfile} from '../../services/userServices';
import {getUser} from '../../redux/features/user/userSlice';
import axiosInstance from '../../utils/api-client';
import ScrollViewSpace from './ScrollViewSpace';
import {COLORS} from '../../themes/themes';
import SafeAreaViewComponent from './SafeAreaViewComponent';
import {windowWidth} from '../../utils/Dimensions';
import TransparentBtn from '../form/TransparentBtn';
import FormButton from '../form/FormButton';

const DriverNotAssignedToTruckComponent = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  const hasVerificationData = userProfle?.User?.verification;
  console.log('userProfle', userProfle, hasVerificationData);

  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestTruck = () => {
    setRequestSent(true);
    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        'Request Sent',
        'Your truck assignment request has been sent to the fleet manager. You will be notified once a truck is assigned.',
        [{text: 'OK', onPress: () => setRequestSent(false)}],
      );
    }, 1500);
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Calling fleet manager...', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Call', onPress: () => console.log('Calling...')},
    ]);
  };

  const handleCheckStatus = () => {
    Alert.alert(
      'Assignment Status',
      'Checking your current assignment status...',
      [{text: 'OK'}],
    );
  };

  const onRefresh = useCallback(() => {
    setLoading(true);
    checkDriverProfile(dispatch, getUser, axiosInstance, setLoading);
  }, []);

  return (
    <SafeAreaViewComponent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 10}}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={COLORS.vtbBtnColor}
            style={{zIndex: 999}}
          />
        }>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.truckIcon}>🚛</Text>
        </View>

        {/* Title and Description */}
        {hasVerificationData?.verificationStatus === 'pending' ? (
          <View>
            <Text style={styles.title}>Awaiting Verification</Text>

            <Text style={styles.subtitle}>
              Thanks for submitting your documents! Your account is currently
              under review. We’ll notify you once you're approved to start
              receiving assignments.
            </Text>
          </View>
        ) : hasVerificationData?.verificationStatus === 'rejected' ? (
          <View>
            <Text style={styles.title}>Awaiting Verification</Text>

            <Text style={styles.subtitle}>
              Thanks for submitting your documents! Your account is currently
              under review. We’ll notify you once you're approved to start
              receiving assignments.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Ready to Drive</Text>
            <Text style={styles.subtitle}>
              You’re all set and verified! ✅ {'\n'} We’re finalizing vehicle
              assignments and will notify you once you’re matched.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <FormButton title={'Request Truck Assignment'} />

          <TransparentBtn
            title={
              hasVerificationData?.verificationStatus === 'pending'
                ? 'Check Verification Status'
                : hasVerificationData?.verificationStatus === 'rejected'
                ? 'Appeal Verification'
                : 'Check Assignment Status'
            }
            onPress={onRefresh}
          />

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={handleContactSupport}
            activeOpacity={0.7}>
            <Text style={styles.tertiaryButtonText}>
              📞 Contact Fleet Manager
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 <Text style={styles.boldText}>Pro Tip:</Text> Assignment
            typically takes 5-15 minutes during peak hours
          </Text>
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>System Online</Text>
        </View>
        <ScrollViewSpace />
      </ScrollView>
    </SafeAreaViewComponent>
  );
};

export default DriverNotAssignedToTruckComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 24,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,

    // lineHeight: 24,
  },
  actionContainer: {
    justifyContent: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    width: windowWidth / 1.2,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
