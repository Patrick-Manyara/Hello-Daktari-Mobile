import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import Navigation from './Navigation';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

function App() {
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

  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
});

export default App;
