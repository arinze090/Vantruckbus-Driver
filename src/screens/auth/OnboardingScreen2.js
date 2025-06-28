import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';

import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {COLORS} from '../../themes/themes';
import {saveLaunchScreen} from '../../redux/features/user/userSlice';

const OnboardingScreen2 = () => {
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const slides = [
    {
      id: 1,
      title: 'Welcome to\nVanTruckBus Logistics',
      subtitle: '',
      description: '',
      image: require('../../assets/onboard2.jpg'),
    },
    {
      id: 2,
      title: 'Lets Start\nA New Experience\nWith Truck Logistics.',
      subtitle: '',
      description:
        "Discover your next adventure with VanTruckBus. we're here to provide you with a seamless car rental experience. Let's get started on your journey.",
      image: require('../../assets/onboard1.jpg'),
    },
  ];

  const onScroll = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      // Navigate to home screen
      console.log('Go to Home');
      AsyncStorage.setItem('alreadyLaunched', 'true').then(() => {
        console.log('its hereee');

        dispatch(saveLaunchScreen(true));
      });
    }
  };

  const renderItem = ({item}) => (
    <ImageBackground
      source={item.image}
      style={styles.image}
      resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <View style={styles.logoBanner}>
          <Image
            source={require('../../assets/VTBLogo.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </ImageBackground>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        ref={flatListRef}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: currentIndex === index ? '#fff' : '#888'},
            ]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={goNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  textContainer: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    lineHeight: 24,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: COLORS.vtbBtnColor,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoBanner: {
    backgroundColor: COLORS.white,
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    marginBottom: 10,
  },
  logo: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default OnboardingScreen2;
