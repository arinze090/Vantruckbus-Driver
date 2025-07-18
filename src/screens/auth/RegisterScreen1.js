import {
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import PhoneInput from 'react-native-phone-number-input';
import Toast from 'react-native-toast-message';

import FormInput from '../../components/form/FormInput';
import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import HeaderTitle from '../../components/common/HeaderTitle';
import {COLORS} from '../../themes/themes';
import FormButton from '../../components/form/FormButton';
import FixedBottomContainer from '../../components/common/FixedBottomContainer';
import ScrollViewSpace from '../../components/common/ScrollViewSpace';
import {setUserDestination} from '../../redux/features/user/userSlice';
import {checkPasswordMatch, emailValidator} from '../../Library/Validation';
import KeyboardAvoidingComponent from '../../components/form/KeyboardAvoidingComponent';

import {windowHeight, windowWidth} from '../../utils/Dimensions';
import axiosInstance from '../../utils/api-client';
import {RNToast} from '../../Library/Common';

const RegisterScreen1 = ({navigation}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // phone number section
  const [value, setValue] = useState('');
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('NG');

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye-outline');

  // Error states
  const [formError, setFormError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // This function handles the password visibility displaying the icons
  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye-outline') {
      setRightIcon('eye-off-outline');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off-outline') {
      setRightIcon('eye-outline');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const registerDriver = async () => {
    const registerData = {
      email: email,
      password: newPassword,
      role: 'Driver',
    };

    if (!email) {
      setEmailError('Provide your email address');
    } else if (!newPassword) {
      setPasswordError('Provide your password');
    } else {
      setLoading(true);
      try {
        await axiosInstance({
          url: 'api/auth/driver-signup',
          method: 'POST',
          data: registerData,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            console.log('registerDriver res', res);
            setLoading(false);

            if (res?.data) {
              console.log('registerDriver data', res?.data);

              RNToast(
                Toast,
                'We sent a 6-digit code to your email for verification',
              );
              navigation.navigate('EmailVerification', {email: email});
            }
          })
          .catch(err => {
            console.log('Login err', err?.response);
            setLoading(false);
            setFormError(err?.response?.data?.message);
            Alert.alert(
              'Signup Failed',
              'Something went wrong, please try again later',
            );
          });
      } catch (error) {
        console.log('registerDriver error', error);
      }
    }
  };

  return (
    <SafeAreaViewComponent>
      <KeyboardAvoidingComponent>
        <HeaderTitle
          leftIcon={'arrow-back-outline'}
          // progress={50}
          onLeftIconPress={() => {
            navigation.goBack();
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingTop: 0}}>
          <View style={{marginBottom: 20, padding: 20}}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 24,
                fontWeight: '600',
                lineHeight: 24,
              }}>
              Create an Account
            </Text>
            <Text style={{color: '#1E1E1EB2', fontSize: 16, fontWeight: '400'}}>
              Please fill in your information to create an account{' '}
            </Text>
          </View>

          <FormInput
            formInputTitle={'Email Address'}
            placeholder="Enter your email address"
            keyboardType={'email-address'}
            value={email}
            onChangeText={txt => {
              setEmail(txt);
              setFormError('');
              if (!emailValidator(txt)) {
                setEmailError('Please enter a valid email');
              } else {
                setEmailError('');
              }
            }}
            errorMessage={emailError}
          />

          <FormInput
            formInputTitle={'Password'}
            placeholder="Password"
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={passwordVisibility}
            textContentType="password"
            rightIcon={rightIcon}
            iconColor="#1E1E1EB2"
            value={newPassword}
            onChangeText={text => {
              setNewPassword(text);
              setPasswordError('');
              setFormError('');
            }}
            handlePasswordVisibility={handlePasswordVisibility}
            marginBottom={10}
            errorMessage={passwordError}
          />
          <ScrollViewSpace />
        </ScrollView>

        {/* Buttons */}
        <FixedBottomContainer top={1.4}>
          <FormButton
            title={'Sign Up'}
            width={1.1}
            onPress={registerDriver}
            loading={loading}
            disabled={loading}
            formError={formError}
          />

          <View style={styles.alreadySection}>
            <Text style={[styles.alreadyText]}>
              Already have an account?{'  '}
            </Text>
            <TouchableOpacity
              style={styles.signup}
              onPress={() => {
                dispatch(setUserDestination(null));
                navigation.navigate('Login');
              }}>
              <Text
                style={{
                  color: COLORS.vtbBtnColor,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </FixedBottomContainer>
      </KeyboardAvoidingComponent>
    </SafeAreaViewComponent>
  );
};

export default RegisterScreen1;

const styles = StyleSheet.create({
  alreadySection: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // position: "absolute",
    bottom: 0,
    flexDirection: 'row',
    marginTop: 20,
  },
  alreadyText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
  signup: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: "red",
    // marginTop: 10,
  },
  auth: {
    width: windowWidth / 1.1,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputTitle: {
    marginBottom: 10,
    fontSize: 15,
    color: 'black',
    fontWeight: '700',
  },
  validationError: {
    color: 'red',
    fontWeight: '500',
    fontSize: 13,
  },
});
