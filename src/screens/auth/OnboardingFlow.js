import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import PhoneInput from 'react-native-phone-number-input';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import KeyboardAvoidingComponent from '../../components/form/KeyboardAvoidingComponent';
import HeaderTitle from '../../components/common/HeaderTitle';
import FormInput from '../../components/form/FormInput';
import ScrollViewSpace from '../../components/common/ScrollViewSpace';
import FixedBottomContainer from '../../components/common/FixedBottomContainer';
import FormButton from '../../components/form/FormButton';
import {COLORS} from '../../themes/themes';
import CountryPickerx from '../../components/pickerSelect/CountryPicker';
import {getMaxSelectableDateFor17YearsOld} from '../../Library/Common';
import {windowHeight, windowWidth} from '../../utils/Dimensions';

const OnboardingFlow = ({navigation}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [countryObject, setCountryObject] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  const [dateIcon, setDateIcon] = useState('calendar-outline');
  const [dateField, setDateField] = useState(new Date());
  const [open, setOpen] = useState(false);

  const maximumDate = getMaxSelectableDateFor17YearsOld();
  const formattedDob = moment(dob, 'MMM D, YYYY').format('YYYY-MM-DD');

  console.log('phooo', formattedValue, value, phoneCountry, formattedDob);

  // phone number section
  const [value, setValue] = useState('');
  const phoneInput = useRef(null);
  const [formattedValue, setFormattedValue] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('NG');

  console.log('countdd', country, countryObject);

  // Error states
  const [formError, setFormError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [emergencyContactError, setEmergencyContactError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const [addressError, setAddressError] = useState('');

  const onboardUser = async () => {
    const onboardData = {
      fullName: fullName,
      country: country,
      emergencyContact: emergencyContact,
      dateOfBirth: formattedDob,
      phoneNumber: value,
      address: address,
    };

    if (!fullName) {
      setFullNameError('Please provide your full name');
    } else if (!country) {
      setCountryError('Provide your valid country');
    } else if (!emergencyContact) {
      setEmergencyContactError('Provide your valid EmergencyContact');
    } else {
      navigation.navigate('OnboardingFlow2', onboardData);
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
              Onboarding
            </Text>
            <Text style={{color: '#1E1E1EB2', fontSize: 16, fontWeight: '400'}}>
              Please fill in your information to create an account{' '}
            </Text>
          </View>

          <FormInput
            formInputTitle={'Full Name'}
            keyboardType={'default'}
            placeholder="Enter your Fullname"
            value={fullName}
            onChangeText={txt => {
              setFullName(txt);
              setFullNameError('');
              setFormError('');
            }}
            errorMessage={fullNameError}
          />

          <CountryPickerx
            formInputTitle={'Country'}
            countryError={countryError}
            setCountry={setCountry}
            setFormError={setFormError}
            setCountryObject={setCountryObject}
          />

          <View style={styles.auth}>
            <Text style={styles.inputTitle}>Phone Number *</Text>
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode={phoneCountry}
              layout="first"
              placeholderTextColor="#666"
              onChangeText={txt => {
                setValue(txt);
              }}
              onChangeCountry={country => {
                setPhoneCountry(country?.cca2);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
                setPhoneError('');
              }}
              // withDarkTheme
              withShadow
              // autoFocus
              containerStyle={{
                backgroundColor: '#fff',
                borderRadius: 5,
                width: windowWidth / 1.1,
                borderWidth: 1,
                borderColor: '#ccc',
              }}
              textContainerStyle={{
                backgroundColor: '#fff',
                height: windowHeight / 19,
              }}
              codeTextStyle={{
                height: windowHeight / 36,
                marginTop: 5,
                color: 'black',
              }}
              textInputStyle={{color: 'black'}}
              textInputProps={{
                placeholderTextColor: '#666',
                keyboardType: 'numeric',
              }}
            />
            {phoneError ? (
              <Text style={styles.validationError}>{phoneError}</Text>
            ) : null}
          </View>

          <FormInput
            formInputTitle={'Date of Birth'}
            value={dateField}
            onChangeText={text => {
              setDateField(text);
              setDob(text);
              setDobError('');
              setFormError('');
            }}
            onPress={() => setOpen(true)}
            handlePasswordVisibility={() => setOpen(true)}
            rightIcon={dateIcon}
            iconColor="black"
            placeholder={moment(dateField)?.format('dddd, MMMM D, YYYY')}
            placeholderTextColor={'black'}
            width={1.1}
            errorMessage={dobError}
          />

          <DatePicker
            mode="date"
            modal
            maximumDate={maximumDate}
            open={open}
            date={dateField}
            onConfirm={date => {
              setOpen(false);
              setDateField(date);
              setDob(date);
              console.log('dddd', date);
              setDobError('');
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />

          <FormInput
            formInputTitle={'Address'}
            keyboardType={'default'}
            placeholder="Enter your address"
            value={address}
            onChangeText={txt => {
              setAddress(txt);
              setAddressError('');
              setFormError('');
            }}
            errorMessage={addressError}
            multiLine={true}
            numberOfLines={5}
            height={100}
          />

          <FormInput
            formInputTitle={'Emergency Contact'}
            keyboardType={'number-pad'}
            placeholder="Enter your emegency contact"
            value={emergencyContact}
            onChangeText={txt => {
              setEmergencyContact(txt);
              setEmergencyContactError('');
              setFormError('');
            }}
            errorMessage={emergencyContactError}
          />

          <ScrollViewSpace />
        </ScrollView>

        {/* Buttons */}
        <FixedBottomContainer top={1.3}>
          <FormButton
            title={'Continue'}
            width={1.1}
            onPress={onboardUser}
            loading={loading}
            disabled={loading}
            formError={formError}
          />
        </FixedBottomContainer>
      </KeyboardAvoidingComponent>
    </SafeAreaViewComponent>
  );
};

export default OnboardingFlow;

const styles = StyleSheet.create({
  auth: {
    width: windowWidth / 1.1,
    alignSelf: 'center',
    // marginTop: 30,
    marginBottom: 10,
    // backgroundColor: 'red',
  },
});
