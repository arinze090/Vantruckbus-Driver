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

import SafeAreaViewComponent from '../components/common/SafeAreaViewComponent';
import HomeHeader from '../components/common/HomeHeader';

import ScrollViewSpace from '../components/common/ScrollViewSpace';
import Carousels from '../components/common/Carousel';
import {useDispatch, useSelector} from 'react-redux';
import {
  saveProductCatgeories,
  saveShopProducts,
} from '../redux/features/user/userSlice';
import axiosInstance, {baseURL} from '../utils/api-client';
import ServicesCard from '../components/cards/ServicesCard';
import verifyTokenWithoutApi from '../components/hoc/verifyToken';
import MoreCard from '../components/cards/MoreCard';
import {COLORS} from '../themes/themes';
import {windowHeight} from '../utils/Dimensions';
import FormInput from '../components/form/FormInput';
import PickerSelect from '../components/pickerSelect/PickerSelect';
import {rendezvousInterestedInOptions} from '../data/dummyData';

const rendezvousServices = [
  {
    id: 1,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1727131385/booking1_agr60w.jpg',
    title: 'Booking',
    description:
      'Book flights, hotels, and unforgettable experiences all in one place.',
    navigate: 'Booking',
    imagee:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1741344647/Frame_1-3_hclicq.png',
  },
  {
    id: 2,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1727131407/giftcard3_lhowqu.png',
    title: 'GiftCards',
    description:
      'Give personalized gifts, from wellness experiences to luxury indulgences.',
    navigate: 'GiftCardScreen',
    imagee:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1734521568/popular-cards_xnetvh.jpg',
  },
  {
    id: 3,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1742596405/vietnam_k0sxif.jpg',
    title: 'Tour Guides',
    description:
      'Book flights, hotels, and unforgettable experiences all in one place.',
    navigate: 'TourguideScreen',
    imagee:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1742596405/vietnam_k0sxif.jpg',

    // 'https://res.cloudinary.com/rendezvouscare/image/upload/v1742595860/tourrr_lqazjb.png',
  },
  {
    id: 4,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1734443460/31177_zra1ir.jpg',
    title: 'Car Rental',
    description:
      'Give personalized gifts, from wellness experiences to luxury indulgences.',
    navigate: 'CarRental',
    imagee:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1741374339/image_561-2_uwc3ff.png',
  },
];

const rendezvousServices2 = [
  {
    id: 1,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1741344648/image_564_vo61ca.png',
    title: 'Invest in Yourself',
    navigate: 'Therapy',
    description:
      'Take charge of your growth with expert guidance. Book a session with a therapist or life coach.',
  },
  {
    id: 2,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1742595860/tourrr_lqazjb.png',
    title: 'Plan unforgettable tour experiences',
    navigate: 'TourguideScreen',
    description: 'Book a tour guide and explore with ease.',
  },
  {
    id: 3,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1741374339/image_561-2_uwc3ff.png',
    title: 'Rent the sleekest rides',
    navigate: 'CarRental',
    description:
      'Explore, book, and elevate your journey with seamless car rental services across the globe',
  },
  {
    id: 4,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1741344647/Frame_1-3_hclicq.png',
    title: 'Book the best Flights and Places',
    navigate: 'Booking',
    description:
      'Book flights, hotels, and unforgettable experiences all in one place.',
  },
  {
    id: 5,
    image:
      'https://res.cloudinary.com/rendezvouscare/image/upload/v1727131434/store_y9y927.jpg',
    title: 'Explore a World of Extraordinary Products',
    navigate: 'Shop',
    description:
      'Shop unique gift items for your loved ones from our carefully curated marketplace.',
  },
];

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const userProfle = state?.user?.user?.profile;
  console.log('userProfle', userProfle);

  const reduxProductCategories = state?.user?.productCategories;
  console.log('reduxProductCategories', reduxProductCategories);

  const [interestedIn, setInterestedIn] = useState('');

  const [interestedInError, setInterestedInError] = useState('');

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

  const fetchProducts = async () => {
    try {
      await axiosInstance({
        url: 'product',
        method: 'GET',
      })
        .then(res => {
          console.log('fetchProducts res', res?.data);
          dispatch(saveShopProducts(res?.data?.data?.products));
        })
        .catch(err => {
          console.log('fetchProducts err', err?.response?.data);
        });
    } catch (error) {
      console.log('fetchProducts error', error);
    }
  };

  Geolocation.getCurrentPosition(info => console.log('Geolocationinfo', info));

  useEffect(() => {
    // productCategories();
    // fetchProducts();
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={{backgroundColor: COLORS.vtbBtnColor}}>
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
                <Text style={{fontWeight: '600'}}>{userProfle?.username} </Text>{' '}
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
          <Text style={{fontSize: 18, color: 'white', fontWeight: '600'}}>
            Want to Book a Truck ?
          </Text>
        </View>
      </View>
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
