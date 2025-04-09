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

export default function UserRegister({route, navigation}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGender, setSelectedGender] = useState();

  const [inputs, setInputs] = useState({
    user_name: {value: '', isValid: true},
    user_email: {value: '', isValid: true},
    user_phone: {value: '', isValid: true},
    user_password: {value: '', isValid: true},
    confirm_password: {value: '', isValid: true},
    user_passport: {value: '', isValid: true},
    user_dob: {value: '', isValid: true},
    user_blood_group: {value: '', isValid: true},
    user_weight: {value: '', isValid: true},
    user_height: {value: '', isValid: true},
  });

  const validateInputs = () => {
    let isValid = true;

    if (!inputs.user_name.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        user_name: {...currentInputs.user_name, isValid: false},
      }));
    }

    if (!inputs.user_email.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        user_email: {...currentInputs.user_email, isValid: false},
      }));
    }

    if (!inputs.user_phone.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        user_phone: {...currentInputs.user_phone, isValid: false},
      }));
    }

    // Check for confirm_password
    if (
      inputs.confirm_password.value.trim() !== inputs.user_password.value.trim()
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
        key !== 'user_password'
      ) {
        isValid = false;
        setInputs(currentInputs => ({
          ...currentInputs,
          [key]: {...currentInputs[key], isValid: false},
        }));
      }
    });

    if (!inputs.user_passport.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        user_passport: {...currentInputs.user_passport, isValid: false},
      }));
    }

    if (!inputs.user_weight.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        user_weight: {...currentInputs.user_weight, isValid: false},
      }));
    }

    if (!inputs.user_height.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        user_height: {...currentInputs.user_height, isValid: false},
      }));
    }

    if (!inputs.user_blood_group.value.trim()) {
      isValid = false;
      setInputs(currentInputs => ({
        ...currentInputs,
        user_blood_group: {...currentInputs.user_blood_group, isValid: false},
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

  //DATES
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const handleDateChange = (type, value) => {
    let sanitizedValue = value.replace(/[^0-9]/g, ''); // Force numeric input

    if (type === 'year' && sanitizedValue.length > 4) return;
    if (type === 'month' && (sanitizedValue > 12 || sanitizedValue.length > 2))
      return;
    if (type === 'day' && (sanitizedValue > 31 || sanitizedValue.length > 2))
      return;

    let newYear = year,
      newMonth = month,
      newDay = day;

    if (type === 'year') newYear = sanitizedValue;
    if (type === 'month') newMonth = sanitizedValue;
    if (type === 'day') newDay = sanitizedValue;

    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay);

    if (newYear.length === 4 && newMonth.length === 2 && newDay.length === 2) {
      const formattedDate = `${newYear}-${newMonth.padStart(
        2,
        '0',
      )}-${newDay.padStart(2, '0')}`;
      updateInputValueHandler('user_dob', formattedDate);
    }
  };

  //SUBMITTING

  const baseUrl = Paths.API_URL + 'user';

  const registerUser = async () => {
    if (!validateInputs()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    const queryParams = `action=register`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();

    formData.append('user_name', inputs.user_name.value);
    formData.append('user_phone', inputs.user_phone.value);

    // const formattedDate = selectedDate.toISOString().split("T")[0];
    formData.append('user_dob', inputs.user_dob.value);

    formData.append('user_height', inputs.user_height.value);
    formData.append('user_weight', inputs.user_weight.value);

    formData.append('user_email', inputs.user_email.value);
    formData.append('user_password', inputs.user_password.value);
    formData.append('user_passport', inputs.user_passport.value);
    formData.append('user_gender', selectedGender);
    formData.append('user_type', 'user');

    formData.append('user_blood_group', inputs.user_blood_group.value);
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
            placeholder="Enter Your Name"
            onChangeText={value => updateInputValueHandler('user_name', value)}
            isInvalid={false}
            label="Your Name"
          />

          <InputHybrid
            placeholder="Enter Your Email"
            onChangeText={value => updateInputValueHandler('user_email', value)}
            isInvalid={false}
            label="Your Email"
            keyboardType="email"
          />

          <InputHybrid
            placeholder="Enter Your ID Number"
            onChangeText={value =>
              updateInputValueHandler(
                'user_passport',
                value.replace(/[^0-9]/g, ''),
              )
            }
            isInvalid={false}
            label="Your ID Number"
            keyboardType="number-pad"
          />

          <InputHybrid
            placeholder="Enter Your Password"
            onChangeText={value =>
              updateInputValueHandler('user_password', value)
            }
            isInvalid={false}
            label="Your Password"
            secureTextEntry
          />

          <InputHybrid
            placeholder="Confirm Your Password"
            onChangeText={value =>
              updateInputValueHandler('confirm_password', value)
            }
            isInvalid={false}
            secureTextEntry
            label="Your Password"
          />

          <InputHybrid
            placeholder="Enter Your Phone Number"
            onChangeText={value => updateInputValueHandler('user_phone', value)}
            isInvalid={false}
            label="Your Phone Number"
          />

          <NormalText>Enter Your Date of Birth</NormalText>
          <View style={styles.inputRow}>
            <InputHybrid
              placeholder="DD"
              keyboardType="number-pad"
              onChangeText={value => handleDateChange('day', value)}
              value={day}
              containerStyle={{margin: 4, width: '25%'}}
            />
            <InputHybrid
              placeholder="MM"
              keyboardType="number-pad"
              onChangeText={value => handleDateChange('month', value)}
              value={month}
              containerStyle={{margin: 4, width: '25%'}}
            />
            <InputHybrid
              placeholder="YYYY"
              keyboardType="number-pad"
              onChangeText={value => handleDateChange('year', value)}
              value={year}
              containerStyle={{margin: 4, width: '45%'}}
            />
          </View>

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

          <InputHybrid
            placeholder="Enter Your Blood Group"
            label="Your Blood Group"
            onChangeText={value =>
              updateInputValueHandler('user_blood_group', value)
            }
            isInvalid={false}
          />

          <InputHybrid
            placeholder="Enter Your Height"
            label="Your Height in CM"
            onChangeText={value =>
              updateInputValueHandler('user_height', value)
            }
            isInvalid={false}
            keyboardType="number-pad"
          />

          <InputHybrid
            placeholder="Enter Your Weight in Kg"
            label="Your Weight in Kg"
            onChangeText={value =>
              updateInputValueHandler('user_weight', value)
            }
            isInvalid={false}
            keyboardType="number-pad"
          />

          <PrimaryButton onPress={registerUser}>Sign Up</PrimaryButton>
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
