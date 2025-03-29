import {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: token => {},
  logout: () => {},
});

export default function AuthContextProvider({children}) {
  const [authToken, setAuthToken] = useState();

  const onUserLogin = async (userID, userName) => {
    try {
      await ZegoUIKitPrebuiltCallService.init(
        675553222, // Ensure this is a number, not a string
        'afb9a0caa68d3216ff02cf663cc3c6db7c9f0e661af44b9b1c2c0e25d85f8185', // This can remain a string
        userID,
        userName,
        [ZIM, ZPNs],
        {
          ringtoneConfig: {
            incomingCallFileName: 'zego_incoming.mp3',
            outgoingCallFileName: 'zego_outgoing.mp3',
          },
          androidNotificationConfig: {
            channelID: 'ZegoUIKit',
            channelName: 'ZegoUIKit',
          },
        },
      );
    } catch (error) {
      console.log('Zego login failed', error);
    }
  };

  const onUserLogout = async () => {
    try {
      await ZegoUIKitPrebuiltCallService.uninit();
    } catch (error) {
      console.log('Zego logout failed', error);
    }
  };

  function authenticate(token) {
    setAuthToken(token);
    AsyncStorage.setItem('token', token);

    // Parse token to ensure it's an object
    const parsedToken = JSON.parse(token);

    // Get userID and userName based on the userType
    const userType = parsedToken.user_type;
    let userID, userName;

    if (userType === 'doctor') {
      userID = parsedToken.doctor_id;
      userName = parsedToken.doctor_name;
    } else if (userType === 'user') {
      userID = parsedToken.user_id;
      userName = parsedToken.user_name;
    }

    if (userID && userName) {
      onUserLogin(userID, userName); // Call ZegoCloud login
    } else {
      console.log('Failed to retrieve userID or userName.');
    }
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem('token');
    onUserLogout(); // Logout from ZegoCloud
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
