import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';

import {RNToast} from '../../Library/Common';
import axiosInstance from '../../utils/api-client';
import {getUser} from '../../redux/features/user/userSlice';
import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import HeaderTitle from '../../components/common/HeaderTitle';
import ImagePickerUpload from '../../components/pickerSelect/ImagePickerUpload';
import FixedBottomContainer from '../../components/common/FixedBottomContainer';
import FormButton from '../../components/form/FormButton';

const OnboardingFlow2 = ({route, navigation}) => {
  const item = route.params;
  console.log('item', item);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [formError, setFormError] = useState('');
  const [image, setImage] = useState('');
  const [imageObject, setImageObect] = useState('');

  const openGallery = () => {
    console.log('clickeddd');
    setFormError('');
    ImageCropPicker.openPicker({
      width: 350,
      height: 350,
      cropping: true,
      mediaType: 'photo',
      multiple: false,
      compressImageQuality: 0.1,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
    }).then(image => {
      console.log('imageee', image);
      setImage(image?.sourceURL);
      setImageObect(image);
      setFormError('');
    });
  };

  const clearImage = () => {
    setImage(null);
    setFormError('');
  };

  const completeOnboarding = async () => {
    const formData = new FormData();

    const onboarding1Data = {
      fullName: item?.fullName,
      country: item?.country,
      dateOfBirth: item?.dateOfBirth,
      profilePicture: imageObject,
      phoneNumber: item?.phoneNumber,
      emergencyContact: item?.emergencyContact,
      address: item?.address,
    };
    console.log('onboarding1Data', onboarding1Data);

    formData.append('profilePicture', {
      uri: imageObject?.path,
      name: 'profile-image.jpg',
      type: 'image/jpg',
      size: 1024,
    });

    formData.append('fullName', onboarding1Data?.fullName);
    formData.append('dateOfBirth', onboarding1Data?.dateOfBirth);
    formData.append('phoneNumber', onboarding1Data?.phoneNumber);
    formData.append('emergencyContact', onboarding1Data?.emergencyContact);
    formData.append('address', onboarding1Data?.address);

    console.log('formData', formData);

    setLoading(true);
    try {
      await axiosInstance({
        url: 'api/profile/driver-profile',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
        .then(res => {
          console.log('res', res?.data);
          setLoading(false);

          if (res?.data) {
            console.log('completeOnboarding data', res?.data);
            checkDriverProfile();

            // navigation.navigate('Login');
          } else {
            console.log('message', res?.data?.message);
            setFormError(
              'An error occured while onboarding your profile, please try again later',
            );
          }
        })
        .catch(err => {
          console.log('completeOnboarding err', err?.response);
          setLoading(false);
          setFormError(
            'An error occured while onboarding your profile, please try again later',
          );
        });
    } catch (error) {
      console.log('completeOnboarding error', error?.response);
      setLoading(false);
      setFormError(
        'An error occured while onboarding your profile, please try again later',
      );
    }
  };

  const checkDriverProfile = async () => {
    try {
      const profileResponse = await axiosInstance({
        url: 'api/profile/driverprofile',
        method: 'GET',
      });

      console.log('checkDriverProfile res', profileResponse?.data);

      if (profileResponse?.data) {
        dispatch(getUser(profileResponse?.data));
        RNToast(Toast, 'Awesome. Your profile has been setup 😇');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('checkDriverProfile check error:', error);
    }
  };

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        leftIcon={'arrow-back-outline'}
        progress={100}
        onLeftIconPress={() => {
          navigation.goBack();
        }}
      />
      <ImagePickerUpload
        image={image}
        onOpenGallery={openGallery}
        onClearImagePress={clearImage}
      />

      {/* Buttons */}
      <FixedBottomContainer top={1.2}>
        <FormButton
          title={'Submit'}
          width={1.1}
          onPress={completeOnboarding}
          formError={formError}
          disabled={!image}
          loading={loading}
        />
      </FixedBottomContainer>
    </SafeAreaViewComponent>
  );
};

export default OnboardingFlow2;

const styles = StyleSheet.create({});
