import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
  Image,
  View,
} from 'react-native';
import {AuthContext} from '../utils/auth-context';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import NormalText from '../components/ui/NormalText';
import PrimaryButton from '../components/ui/PrimaryButton';
import InputHybrid from '../components/forms/InputHybrid';
import HeaderText from '../components/ui/HeaderText';
import MediumText from '../components/ui/MediumText';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {css} from '../assets/styles';
import {Paths} from '../utils/paths';
import RenderOverlay from '../components/ui/RenderOverlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextAreaInput from '../components/forms/TextAreaInput';

export default function DoctorRegister({route, navigation}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGender, setSelectedGender] = useState();

  const [inputs, setInputs] = useState({
    doctor_name: {value: '', isValid: true},
    doctor_email: {value: '', isValid: true},
    doctor_password: {value: '', isValid: true},
    confirm_password: {value: '', isValid: true},
    doctor_passport: {value: '', isValid: true},
    doctor_phone: {value: '', isValid: true},
    doctor_bio: {value: '', isValid: true},
    doctor_dob: {value: '', isValid: true},
    doctor_location: {value: '', isValid: true},
    doctor_qualifications: {value: '', isValid: true},
    doctor_license: {value: '', isValid: true},
    doctor_rate: {value: '', isValid: true},
  });

  const validateInputs = () => {
    let isValid = true;

    if (!inputs.doctor_name.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_name: {...currentInputs.doctor_name, isValid: false},
      }));
    }

    if (!inputs.doctor_email.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_email: {...currentInputs.doctor_email, isValid: false},
      }));
    }

    if (!inputs.doctor_phone.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_phone: {...currentInputs.doctor_phone, isValid: false},
      }));
    }

    // Check for confirm_password
    if (
      inputs.confirm_password.value.trim() !==
      inputs.doctor_password.value.trim()
    ) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        confirm_password: {...currentInputs.confirm_password, isValid: false},
      }));
    }

    // Optionally check for other fields
    Object.keys(inputs).forEach(key => {
      if (
        !inputs[key].value.trim() &&
        key !== 'confirm_password' &&
        key !== 'doctor_password'
      ) {
        isValid = false;
        setInputs(currentInputs => ({
          ...currentInputs,
          [key]: {...currentInputs[key], isValid: false},
        }));
      }
    });

    if (!inputs.doctor_passport.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_passport: {...currentInputs.doctor_passport, isValid: false},
      }));
    }

    if (!inputs.doctor_bio.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_bio: {...currentInputs.doctor_bio, isValid: false},
      }));
    }

    if (!inputs.doctor_location.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_location: {...currentInputs.doctor_location, isValid: false},
      }));
    }

    if (!inputs.doctor_qualifications.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_qualifications: {
          ...currentInputs.doctor_qualifications,
          isValid: false,
        },
      }));
    }

    if (!inputs.doctor_license.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_license: {...currentInputs.doctor_license, isValid: false},
      }));
    }

    if (!inputs.doctor_rate.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        doctor_rate: {...currentInputs.doctor_rate, isValid: false},
      }));
    }
    // Repeat for other inputs
    return isValid;
  };

  function updateInputValueHandler(inputIdentifier, enteredValue) {
    setInputs(currentInputs => {
      return {
        ...currentInputs,
        [inputIdentifier]: {value: enteredValue, isValid: true},
      };
    });
  }

  const [selectedDate, setSelectedDate] = useState(null);
  //DATES

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.log('A date has been picked: ', date);
    setSelectedDate(date); // Update selected date
    updateInputValueHandler('doctor_dob', date.toISOString().split('T')[0]); // Update doctor_dob in YYYY-MM-DD format
    hideDatePicker();
  };

  //SUBMITTING

  const baseUrl = Paths.API_URL + 'doctor';

  const registerDoctor = async () => {
    if (!validateInputs()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    const queryParams = `action=register`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();

    formData.append('doctor_name', inputs.doctor_name.value);
    formData.append('doctor_email', inputs.doctor_email.value);
    formData.append('doctor_password', inputs.doctor_password.value);

    formData.append('doctor_passport', inputs.doctor_passport.value);
    formData.append('doctor_phone', inputs.doctor_phone.value);
    formData.append('doctor_bio', inputs.doctor_bio.value);

    formData.append('doctor_dob', inputs.doctor_dob.value);
    formData.append('doctor_location', inputs.doctor_location.value);
    formData.append('doctor_gender', selectedGender);

    formData.append(
      'doctor_qualifications',
      inputs.doctor_qualifications.value,
    );
    formData.append('doctor_license', inputs.doctor_license.value);
    formData.append('doctor_rate', inputs.doctor_rate.value);

    try {
      fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        },
      })
        .then(response => response.json())
        .then(data => {
          setIsSubmitting(false);
          navigation.navigate('VerifyAccount', {regData: data.regData});
        })
        .catch(error => {
          setIsSubmitting(false);
          console.error('Fetch error:', error);
        });
    } catch (error) {
      setIsSubmitting(false);
      console.error('Request setup error:', error);
    }
  };
  return (
    <SafeAreaView style={css.safeAreaView}>
      <ScrollView>
        <HeaderText styleProp={css.centerText}>Create Your Profile</HeaderText>
        <View>
          <InputHybrid
            placeholder="Doctor Doe"
            onChangeText={value =>
              updateInputValueHandler('doctor_name', value)
            }
            isInvalid={!inputs.doctor_name.isValid}
            label="Enter Your Name"
            value={inputs.doctor_name.value}
          />

          <InputHybrid
            placeholder="test@abc.com"
            onChangeText={value =>
              updateInputValueHandler('doctor_email', value)
            }
            isInvalid={!inputs.doctor_email.isValid}
            label="Enter Your Email"
            keyboardType="email"
            value={inputs.doctor_email.value}
          />

          <InputHybrid
            placeholder="Enter Your Password"
            onChangeText={value =>
              updateInputValueHandler('doctor_password', value)
            }
            isInvalid={!inputs.doctor_password.isValid}
            label="Your Password"
            value={inputs.doctor_password.value}
            secureTextEntry
          />

          <InputHybrid
            placeholder="Confirm Your Password"
            onChangeText={value =>
              updateInputValueHandler('confirm_password', value)
            }
            isInvalid={!inputs.confirm_password.isValid}
            value={inputs.confirm_password.value}
            secureTextEntry
            label="Your Password"
          />

          <InputHybrid
            placeholder="Enter Your ID Number"
            onChangeText={value =>
              updateInputValueHandler('doctor_passport', value)
            }
            isInvalid={!inputs.doctor_passport.isValid}
            value={inputs.doctor_passport.value}
            label="Your ID Number"
          />

          <InputHybrid
            placeholder="Enter Your Phone Number"
            onChangeText={value =>
              updateInputValueHandler('doctor_phone', value)
            }
            isInvalid={!inputs.doctor_phone.isValid}
            label="Your Phone Number"
            value={inputs.doctor_phone.value}
          />

          <Pressable
            onPress={showDatePicker}
            style={[
              css.disabledContainer,
              {
                flexDirection: 'row',
                paddingVertical: 10,
                justifyContent: 'space-between',
              },
            ]}>
            <NormalText>Choose Your Date Of Birth</NormalText>
            <Image
              style={{width: 20, height: 20, objectFit: 'contain'}}
              source={require('../assets/icons/date.png')}
            />
          </Pressable>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {selectedDate && (
              <View>
                <MediumText>Your saved Date of Birth is: </MediumText>
                <NormalText>{selectedDate.toDateString()}</NormalText>
              </View>
            )}
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View>
            <NormalText>Select Your Gender</NormalText>
            <Picker
              style={[css.disabledContainer, styles.myInput]}
              selectedValue={selectedGender}
              onValueChange={itemValue => setSelectedGender(itemValue)}>
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <TextAreaInput
            placeholder="Your Bio"
            onChangeText={value => updateInputValueHandler('doctor_bio', value)}
            value={inputs.doctor_bio.value}
            isInvalid={!inputs.doctor_bio.isValid}
            label="Your Bio"
            numberOfLines={6}
          />

          <InputHybrid
            placeholder="e.g. DPT Doctor of Physical Therapy"
            onChangeText={value =>
              updateInputValueHandler('doctor_qualifications', value)
            }
            isInvalid={!inputs.doctor_qualifications.isValid}
            label="Your Qualifications"
            value={inputs.doctor_qualifications.value}
          />

          <InputHybrid
            placeholder="ABC123"
            label="Enter Your License Number"
            value={inputs.doctor_license.value}
            onChangeText={value =>
              updateInputValueHandler('doctor_license', value)
            }
            isInvalid={!inputs.doctor_license.isValid}
          />

          <InputHybrid
            placeholder="eg Nairobi, Mombasa, Kisumu"
            label="Enter The City You're Located In"
            value={inputs.doctor_location.value}
            onChangeText={value =>
              updateInputValueHandler('doctor_location', value)
            }
            isInvalid={!inputs.doctor_location.isValid}
          />

          <InputHybrid
            placeholder="Enter Your Rate Per Hour"
            label="Rate Per Hour"
            value={inputs.doctor_rate.value}
            onChangeText={value =>
              updateInputValueHandler('doctor_rate', value)
            }
            isInvalid={!inputs.doctor_rate.isValid}
            keyboardType="numeric"
          />

          <PrimaryButton onPress={registerDoctor}>Sign Up</PrimaryButton>
        </View>
        {isSubmitting && <RenderOverlay />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  myInput: {
    height: 50,
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 8,
    marginVertical: 2,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
});
