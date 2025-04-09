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
  const verifyCode = async () => {
    if (!regData) return;

    if (userCode.trim() === '') {
      alert('Please enter the verification code.');
      return;
    }

    // Compare user input with the expected code from feedback
    if (userCode === regData.user_code) {
      let responseData = JSON.stringify(regData);
      authCtx.authenticate(responseData);
    } else {
      Alert.alert(
        'Invalid Code',
        'The verification code you entered is incorrect.',
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
