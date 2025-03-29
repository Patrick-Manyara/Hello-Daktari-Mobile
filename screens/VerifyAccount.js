import React, {useContext, useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../utils/auth-context';

import {css} from '../assets/styles';
import {Paths} from '../utils/paths';

import HeaderText from '../components/ui/HeaderText';
import NormalText from '../components/ui/NormalText';
import PrimaryButton from '../components/ui/PrimaryButton';
import InputHybrid from '../components/forms/InputHybrid';
import RenderOverlay from '../components/ui/RenderOverlay';

export default function VerifyAccount({route, navigation}) {
  const [regData, setRegData] = useState({});
  const [userCode, setUserCode] = useState('');
  const authCtx = useContext(AuthContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (route.params && route.params.regData) {
      setRegData(route.params.regData);
    }
  }, [route.params]);

  //SUBMITTING
  const baseUrl = Paths.API_URL + 'user';

  const verifyCode = async () => {
    if (!regData) return;

    if (userCode == '') {
      alert('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    const queryParams = `action=verify`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();

    if (regData.user_type == 'user') {
      formData.append('user_id', regData.user_id);
      formData.append('user_type', 'user');
    } else {
      formData.append('user_id', regData.doctor_id);
      formData.append('user_type', 'doctor');
    }
    formData.append('user_code', userCode);

    console.log(formData);

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
          if (data.status === 1) {
            setIsSubmitting(false);
            let responseData = JSON.stringify(regData);
            authCtx.authenticate(responseData);
          } else {
            setIsSubmitting(false);
            Alert.alert(
              'Something went wrong',
              "It seems the email or password don't match our records",
            );
          }
        })
        .catch(error => {
          setIsSubmitting(false);
          Alert.alert(
            'Something went wrong',
            "It seems the email or password don't match our records",
          );
        });
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Something went wrong',
        "It seems the email or password don't match our records",
      );
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <View>
        <HeaderText styleProp={css.centerText}>Verify Account</HeaderText>
        {regData && (
          <View>
            <NormalText>
              Kindly enter the verification code you received in your email:
            </NormalText>

            <InputHybrid
              placeholder="Enter Verification Code"
              value={userCode}
              onChangeText={setUserCode}
              keyboardType="numeric"
            />

            <PrimaryButton onPress={verifyCode}>Verify Code</PrimaryButton>
          </View>
        )}
      </View>
      {isSubmitting && <RenderOverlay />}
    </SafeAreaView>
  );
}
