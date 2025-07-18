import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import {signOut} from '../../redux/features/user/userSlice';
import ProfileOptionsDisplay from '../../components/common/ProfileOptionsDisplay';
import ScrollViewSpace from '../../components/common/ScrollViewSpace';
import {COLORS} from '../../themes/themes';
import axiosInstance from '../../utils/api-client';
import VerificationStatus from '../../components/common/VerificationStatusBadge';

const settings = [
  {
    iconName: 'person-outline',
    name: 'Profile Settings',
    navigate: 'EditProfile',
  },
  // {
  //   iconName: "settings-outline",
  //   name: "Account Settings",
  //   navigate: "Account",
  // },
  // {
  //   iconName: 'wallet-outline',
  //   name: 'Wallet',
  //   navigate: 'Wallet',
  // },
  // {
  //   iconName: 'heart-outline',
  //   name: 'Wishlists',
  //   navigate: 'Wishlist',
  // },
  // {
  //   iconName: 'cart-outline',
  //   name: 'Cart',
  //   navigate: 'Cart',
  // },
  {
    iconName: 'receipt-outline',
    name: 'Bookings',
    navigate: 'Bookings',
  },
  // {
  //   iconName: "calendar-outline",
  //   name: "Calendar",
  //   navigate: "Bookings",
  // },
  {
    iconName: 'information-circle-outline',
    name: 'Support',
    navigate: 'Support',
  },
  // {
  //   iconName: 'newspaper-outline',
  //   name: 'Blogs & News Feed',
  //   navigate: 'Blog',
  // },
  // {
  //   iconName: 'cart-outline',
  //   name: 'Subscription',
  //   navigate: 'Subscription',
  // },
  // {
  //   iconName: "information-circle-outline",
  //   name: "Help Center",
  //   navigate: "HelpCenter",
  // },
  {
    iconName: 'megaphone-outline',
    name: 'Legal',
    navigate: 'Legal',
  },
];

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user;
  const hasVerificationData = userProfle?.User?.verification;
  console.log('userProfle', userProfle, hasVerificationData);

  const transformedData = userProfle?.profile_pictures?.map(item => ({
    uri: item,
  }));

  const [visible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const onLoadEnd = () => {
    setLoading(true);
  };

  function logout() {
    dispatch(signOut());
  }

  const deletAccountFunction = async () => {
    try {
      await axiosInstance({
        url: 'admin/status/bulk-delete',
        method: 'POST',
        data: {
          userIds: userProfle?.user_id,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        console.log('deletAccountFunction res', res);
      });
    } catch (error) {
      console.log('deactivateAccount error', error?.response);
    }
  };

  const deactivateAccount = async () => {
    Alert.alert(
      'Deactivate Account',
      'Are you sure you want to delete your Rendezvous account? Your account and all associated data will be permanently removed upon confirmation. If this action was not initiated by you, please reply "NO". Please be certain, as this action is irreversible.',
      [
        {
          text: 'No',
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes, Delete it',
          onPress: () => {
            console.log('Delete account');
            deletAccountFunction();
          },
        },
      ],
    );
  };
  return (
    <SafeAreaViewComponent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 10}}>
        <View style={styles.profileSection}>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
            }}>
            {loading ? (
              <SkeletonPlaceholder
                highlightColor={COLORS.skeletonBgColor}
                backgroundColor={COLORS.skeletonHighlightColor}
                speed={1900}>
                <Image style={styles.image} source={''} />
              </SkeletonPlaceholder>
            ) : (
              <Image
                source={{uri: userProfle?.profilePicture}}
                style={styles.image}
                onPress={() => {
                  setIsVisible(true);
                }}
              />
            )}
          </TouchableOpacity>
          <View style={styles.profileDetails}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.profileName}>{userProfle?.fullName}</Text>
              <VerificationStatus
                status={hasVerificationData?.verificationStatus}
              />
            </View>
            <Text style={styles.profileEmail}>{userProfle?.User?.email}</Text>
          </View>
        </View>

        {settings?.map((cur, i) => (
          <ProfileOptionsDisplay
            key={i}
            onPress={() => navigation.navigate(cur?.navigate)}
            title={cur?.name}
            iconName={cur?.iconName}
          />
        ))}

        <TouchableOpacity style={styles.set} onPress={logout}>
          <View style={styles.setsContent}>
            <Ionicons name="log-out-outline" size={20} color={'black'} />
            <Text style={[styles.settingsText]}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.set} onPress={deactivateAccount}>
          <View style={styles.setsContent}>
            <Ionicons name="trash-outline" size={20} color={'black'} />
            <Text style={[styles.settingsText]}>Deactivate Account</Text>
          </View>
        </TouchableOpacity> */}

        <ImageView
          images={transformedData}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />

        <ScrollViewSpace />
      </ScrollView>
    </SafeAreaViewComponent>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileSection: {
    display: 'flex',
    // flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    alignItems: 'center',
    // marginLeft: 20,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  settings: {
    margin: 5,
    marginTop: 30,
    borderTopWidth: 1,
    marginBottom: 20,
    borderColor: '#999',
  },
  set: {
    marginBottom: 0,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'pink',
  },
  setsContent: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    margin: 5,
    marginTop: 10,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    marginLeft: 17,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    color: '#1E1E1E80',
  },
});
