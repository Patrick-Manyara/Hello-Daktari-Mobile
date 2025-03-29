import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {AuthContext} from '../utils/auth-context';
import {SafeAreaView} from 'react-native-safe-area-context';

import NormalText from '../components/ui/NormalText';
import PrimaryButton from '../components/ui/PrimaryButton';
import InputHybrid from '../components/forms/InputHybrid';
import HeaderText from '../components/ui/HeaderText';

import {css} from '../assets/styles';
import {Paths} from '../utils/paths';
import MediumText from '../components/ui/MediumText';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import TransparentButton from '../components/ui/TransparentButton';

export default function Login({route, navigation}) {
  const [userType, setUserType] = useState('');
  useEffect(() => {
    if (route.params && route.params.user) {
      setUserType(route.params.user);
    }
  }, [route.params]);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId:
        '794608530929-8vnkrcmeaov2135cfs4fmumv6mjrdf0g.apps.googleusercontent.com', // From Google Cloud Console
      offlineAccess: true, // To get refresh token
    });

    // Log Google Sign-In Configuration
    console.log('Google Sign-In Configured with:', {
      webClientId:
        '794608530929-8vnkrcmeaov2135cfs4fmumv6mjrdf0g.apps.googleusercontent.com',
      offlineAccess: true,
    });

    // Test Play Services Availability
    GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
      .then(() => {
        console.log('Google Play Services are available.');
      })
      .catch(error => {
        console.error('Google Play Services Error:', error);
      });
  }, []); // Run only once when the app initializes

  const [email, setemail] = useState(null);
  const [password, setpassword] = useState(null);
  const [loading, setloading] = useState(null);

  const authCtx = useContext(AuthContext);

  async function debugSignIn() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
    } catch (error) {
      console.log('Error Code:', error.code);
      console.log('Error Message:', error.message);
    }
  }

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);

      // Send userInfo.idToken to your backend for further authentication.
      const {idToken} = userInfo;
      const url = Paths.API_URL + 'google.php';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({idToken}),
      });

      const res = await response.json();
      if (res.status === 1) {
        let responseData = JSON.stringify(res.data);
        console.log(responseData);
        // authCtx.authenticate(responseData);
      } else {
        Alert.alert('Authentication Failed', res.message);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-In Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-In In Progress');
      } else {
        Alert.alert('An error occurred', error.message);
      }
    }
  };

  const submitForm = () => {
    const data = new FormData();
    const url = Paths.API_URL + 'auth.php';

    if (email == null || password == null) {
      Alert.alert('Enter all Fields', 'please enter all fields');
    } else {
      setloading(true);
      data.append('email', email);
      data.append('password', password);
      data.append('type', userType);
      const options = {
        method: 'POST',
        body: data,
      };

      fetch(url, options)
        .then(res => res.json())
        .then(async res => {
          if (res.status === 1) {
            let responseData = JSON.stringify(res.data);
            authCtx.authenticate(responseData);
          } else {
            Alert.alert(
              'Something went wrong',
              "It seems the email or password don't match our records",
            );
          }
        })
        .catch(e => {
          Alert.alert('something went wrong', 'It seems something went wrong');
        })
        .finally(() => {
          setloading(false);
        });
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <HeaderText styleProp={[css.centerText, {marginVertical: 10}]}>
        Welcome Back
      </HeaderText>
      <NormalText styleProp={[css.centerText, {textTransform: 'capitalize'}]}>
        Login To Your {userType} Account
      </NormalText>
      <View style={styles.authContent}>
        <InputHybrid
          containerStyle={styles.inputStyle}
          keyboardType="email-address"
          onChangeText={text => setemail(text)}
          placeholder="youremail@gmail.com"
          label="Enter Your Email Here"
        />
        <InputHybrid
          containerStyle={styles.containerStyle}
          placeholder="1234"
          secureTextEntry
          onChangeText={text => setpassword(text)}
          label="Enter Your Password Here"
        />
        {loading ? (
          <View>
            <ActivityIndicator animating size="large" />
          </View>
        ) : (
          <PrimaryButton styleProp={styles.buttonStyle} onPress={submitForm}>
            Login
          </PrimaryButton>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <NormalText styleProp={{marginHorizontal: 2}}>
            Dont Have An Account?
          </NormalText>
          <Pressable
            onPress={() => {
              navigation.navigate(
                userType == 'user' ? 'UserRegister' : 'DoctorRegister',
              );
            }}>
            <HeaderText>Sign Up Now</HeaderText>
          </Pressable>
        </View>

        {/* <View>
          <TransparentButton onPress={debugSignIn}>
            SIgn Up With Google
          </TransparentButton>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authContent: {
    marginHorizontal: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    margin: 10,
  },
  buttonStyle: {
    width: Dimensions.get('window').width - 50,
    margin: 10,
    borderRadius: 20,
  },
});
