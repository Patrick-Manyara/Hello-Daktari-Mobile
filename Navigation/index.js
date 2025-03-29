import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContextProvider, {AuthContext} from '../utils/auth-context';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHouse,
  faCartShopping,
  faCartPlus as faCartShoppingOutline,
  faComment,
  faHouseUser as faHome,
  faUser,
  faCalendar,
  faStore,
  faStoreAlt as faShop,
} from '@fortawesome/free-solid-svg-icons';
import {
  faUser as faUserOutline,
  faComment as faChatOutline,
  faCalendar as faDate,
} from '@fortawesome/free-regular-svg-icons';
import {colors} from '../assets/styles';

//SHARED
import Start from '../screens/Start';
import ChoiceScreen from '../screens/ChoiceScreen';
import Login from '../screens/Login';
import UserRegister from '../screens/UserRegister';
import DoctorRegister from '../screens/DoctorRegister';

//USER
import UserHomeScreen from '../screens/user/UserHomeScreen';
import ShopScreen from '../screens/user/ShopScreen';
import CartScreen from '../screens/user/CartScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import BookSessionScreen from '../screens/user/BookSessionScreen';
import BookAvailableScreen from '../screens/user/BookAvailableScreen';
import ForumScreen from '../screens/user/ForumScreen';
import ForumPostScreen from '../screens/user/ForumPostScreen';
import UploadScreen from '../screens/user/UploadScreen';
import HomeVisitScreen from '../screens/user/HomeVisitScreen';
import LabScreen from '../screens/user/LabScreen';
import AllDoctorsScreen from '../screens/user/AllDoctorsScreen';
import DoctorDetailsScreen from '../screens/user/DoctorDetailsScreen';
import AddressScreen from '../screens/user/AddressScreen';
import PaymentScreen from '../screens/user/PaymentScreen';
import SuccessScreen from '../screens/user/SuccessScreen';
import SpecialistScreen from '../screens/user/SpecialistScreen';
import MedicalRecordsScreen from '../screens/user/MedicalRecordsScreen';
import ProductDetailsScreen from '../screens/user/ProductDetailsScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import AddressManager from '../screens/user/AddressManager';
import ShoppingHistoryScreen from '../screens/user/ShoppingHistoryScreen';
import SessionHistoryScreen from '../screens/user/SessionHistoryScreen';

//DOCTOR
import ScheduleScreen from '../screens/doctor/ScheduleScreen';
import DoctorHomeScreen from '../screens/doctor/DoctorHomeScreen';
import DoctorChatRooms from '../screens/doctor/DoctorChatRooms';
import DoctorProfileScreen from '../screens/doctor/DoctorProfileScreen';
import UserChatRooms from '../screens/user/UserChatRooms';
import UserChatScreen from '../screens/user/UserChatScreen';
import AppointmentDetailsScreen from '../screens/doctor/AppointmentDetailsScreen';
import SessionDetailsScreen from '../screens/doctor/SessionDetailsScreen';
import DocAddChatRoom from '../screens/doctor/DocAddChatRoom';
import StartNewChat from '../screens/doctor/StartNewChat';
import ChatScreen from '../screens/doctor/ChatScreen';
import EditBioScreen from '../screens/doctor/EditBioScreen';
import SpecialtyScreen from '../screens/doctor/SpecialtyScreen';
import WalletScreen from '../screens/doctor/WalletScreen';
import AllPatientsScreen from '../screens/doctor/AllPatientsScreen';
import DocForumScreen from '../screens/doctor/DocForumScreen';
import DocForumPost from '../screens/doctor/DocForumPost';
import DoctorScreen from '../screens/doctor/DoctorScreen';

import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService, {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoSendCallInvitationButton,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import VerifyAccount from '../screens/VerifyAccount';
import {StatusBar} from 'react-native';
import PatientBioScreen from '../screens/doctor/PatientBioScreen';
import MyPatientsScreen from '../screens/doctor/MyPatientsScreen';
import AppointmentsScreen from '../screens/doctor/AppointmentsScreen';

export default () => {
  const Stack = createNativeStackNavigator();
  const UserTab = createBottomTabNavigator();
  const ShopStack = createNativeStackNavigator();
  const CartStack = createNativeStackNavigator();
  const ProfileStack = createNativeStackNavigator();

  const DocTab = createBottomTabNavigator();
  const DocStack = createNativeStackNavigator();
  const ChatStack = createNativeStackNavigator();
  const DocProfileStack = createNativeStackNavigator();

  function TabBarIcon(props) {
    return <FontAwesomeIcon size={16} style={{marginBottom: -3}} {...props} />;
  }

  //USER
  function UserBottomTab() {
    return (
      <UserTab.Navigator
        screenOptions={({route}) => ({
          tabBarActiveTintColor: colors.primaryBlue,
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let icon;

            if (route.name === 'UserHome') {
              icon = !focused ? faHouse : faHome;
            } else if (route.name === 'Shop') {
              icon = focused ? faShop : faStore;
            } else if (route.name === 'Cart') {
              icon = !focused ? faCartShopping : faCartShoppingOutline;
            } else if (route.name === 'Profile') {
              icon = focused ? faUser : faUserOutline;
            }

            return <TabBarIcon icon={icon} color={color} size={size} />;
          },
        })}>
        <UserTab.Screen
          options={{title: ''}}
          name="UserHome"
          component={UserHomePages}
        />
        <UserTab.Screen
          options={{title: ''}}
          name="Shop"
          component={ShopPages}
        />
        <UserTab.Screen
          options={{title: ''}}
          name="Cart"
          component={CartPages}
        />
        <UserTab.Screen
          options={{title: ''}}
          name="Profile"
          component={ProfilePages}
        />
      </UserTab.Navigator>
    );
  }

  function UserHomePages() {
    return (
      <Stack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} />
        <Stack.Screen name="BookSessionScreen" component={BookSessionScreen} />
        <Stack.Screen
          name="BookAvailableScreen"
          component={BookAvailableScreen}
        />
        <Stack.Screen name="ForumScreen" component={ForumScreen} />
        <Stack.Screen name="ForumPostScreen" component={ForumPostScreen} />
        <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />

        <Stack.Screen name="HomeVisitScreen" component={HomeVisitScreen} />
        <Stack.Screen name="SpecialistScreen" component={SpecialistScreen} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen
          name="MedicalRecordsScreen"
          component={MedicalRecordsScreen}
        />
        <Stack.Screen name="LabScreen" component={LabScreen} />
        <Stack.Screen name="AllDoctorsScreen" component={AllDoctorsScreen} />
        <Stack.Screen
          name="DoctorDetailsScreen"
          component={DoctorDetailsScreen}
        />
        <Stack.Screen name="AddressScreen" component={AddressScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen
          options={{headerShown: false}}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallWaitingScreen"
          component={ZegoUIKitPrebuiltCallWaitingScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallInCallScreen"
          component={ZegoUIKitPrebuiltCallInCallScreen}
        />
      </Stack.Navigator>
    );
  }

  function ShopPages() {
    return (
      <ShopStack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <ShopStack.Screen name="ShopScreen" component={ShopScreen} />
        <ShopStack.Screen
          name="ProductDetailsScreen"
          component={ProductDetailsScreen}
        />
      </ShopStack.Navigator>
    );
  }

  function CartPages() {
    return (
      <CartStack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <CartStack.Screen name="CartScreen" component={CartScreen} />
      </CartStack.Navigator>
    );
  }

  function ProfilePages() {
    return (
      <ProfileStack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <ProfileStack.Screen
          name="UserProfileScreen"
          component={UserProfileScreen}
        />
        <ProfileStack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
        />
        <ProfileStack.Screen name="AddressManager" component={AddressManager} />
        <ProfileStack.Screen
          name="ShoppingHistoryScreen"
          component={ShoppingHistoryScreen}
        />
        <ProfileStack.Screen
          name="SessionHistoryScreen"
          component={SessionHistoryScreen}
        />
        <ProfileStack.Screen name="UserChatRooms" component={UserChatRooms} />
        <ProfileStack.Screen name="UserChatScreen" component={UserChatScreen} />
      </ProfileStack.Navigator>
    );
  }

  //DOC
  function DoctorBottomTab() {
    return (
      <DocTab.Navigator
        screenOptions={({route}) => ({
          tabBarActiveTintColor: colors.primaryBlue,
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let icon;

            if (route.name === 'DoctorHome') {
              icon = focused ? faHouse : faHome;
            } else if (route.name === 'DoctorChatRooms') {
              icon = focused ? faComment : faChatOutline;
            } else if (route.name === 'ScheduleScreen') {
              icon = focused ? faCalendar : faDate;
            } else if (route.name === 'DoctorProfile') {
              icon = focused ? faUser : faUserOutline;
            }

            return <TabBarIcon icon={icon} color={color} size={size} />;
          },
        })}>
        <DocTab.Screen
          options={{
            title: '',
          }}
          name="DoctorHome"
          component={DoctorHomePages}
        />
        <DocTab.Screen
          options={{
            title: '',
          }}
          name="DoctorChatRooms"
          component={DoctorChatPages}
        />
        <DocTab.Screen
          options={{
            title: '',
          }}
          name="ScheduleScreen"
          component={ScheduleScreen}
        />
        <DocTab.Screen
          options={{
            title: '',
          }}
          name="DoctorProfile"
          component={DocProfilePages}
        />
      </DocTab.Navigator>
    );
  }

  function DoctorHomePages() {
    return (
      <DocStack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <DocStack.Screen name="DoctorHomeScreen" component={DoctorHomeScreen} />
        <DocStack.Screen
          name="AppointmentDetailsScreen"
          component={AppointmentDetailsScreen}
        />
        <DocStack.Screen
          name="SessionDetailsScreen"
          component={SessionDetailsScreen}
        />
        <DocStack.Screen name="DocForumScreen" component={DocForumScreen} />
        <DocStack.Screen name="DocForumPost" component={DocForumPost} />
        <DocStack.Screen name="DoctorScreen" component={DoctorScreen} />
        <DocStack.Screen name="MyPatients" component={MyPatientsScreen} />
        <DocStack.Screen name="PatientBio" component={PatientBioScreen} />
        <DocStack.Screen
          name="AppointmentsScreen"
          component={AppointmentsScreen}
        />
        <DocStack.Screen
          options={{headerShown: false}}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallWaitingScreen"
          component={ZegoUIKitPrebuiltCallWaitingScreen}
        />
        <DocStack.Screen
          options={{headerShown: false}}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallInCallScreen"
          component={ZegoUIKitPrebuiltCallInCallScreen}
        />
      </DocStack.Navigator>
    );
  }

  function DoctorChatPages() {
    return (
      <ChatStack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <ChatStack.Screen name="DoctorChatRoom" component={DoctorChatRooms} />
        <ChatStack.Screen name="DocAddChatRoom" component={DocAddChatRoom} />
        <ChatStack.Screen name="StartNewChat" component={StartNewChat} />
        <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
      </ChatStack.Navigator>
    );
  }

  function DocProfilePages() {
    return (
      <DocProfileStack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <DocProfileStack.Screen
          name="DoctorProfileScreen"
          component={DoctorProfileScreen}
        />
        <DocProfileStack.Screen
          name="EditBioScreen"
          component={EditBioScreen}
        />
        <DocProfileStack.Screen
          name="SpecialtyScreen"
          component={SpecialtyScreen}
        />
        <DocProfileStack.Screen name="WalletScreen" component={WalletScreen} />
        <DocProfileStack.Screen
          name="AllPatientsScreen"
          component={AllPatientsScreen}
        />
        <DocProfileStack.Screen
          name="PatientBioScreen"
          component={PatientBioScreen}
        />
      </DocProfileStack.Navigator>
    );
  }

  //AUTH
  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: 'white'},
        }}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="ChoiceScreen" component={ChoiceScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UserRegister" component={UserRegister} />
        <Stack.Screen name="DoctorRegister" component={DoctorRegister} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
      </Stack.Navigator>
    );
  }

  function AuthenticatedStack() {
    const [token, setToken] = useState(null); // Initialize token as null
    const [isTryingLogin, setIsTryingLogin] = useState(true);

    useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          // Update token state only if token is fetched successfully
          setToken(JSON.parse(storedToken)); // Parse storedToken to object
        }
        setIsTryingLogin(false);
      }
      fetchToken();
    }, []);

    // Ensure token is defined before accessing its properties
    let comp =
      token && token.user_type === 'user' ? UserBottomTab : DoctorBottomTab;

    if (isTryingLogin) {
      return null;
    }

    return (
      <Stack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007fff',
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={comp} />
      </Stack.Navigator>
    );
  }

  function Root() {
    const [isTryingLogin, setIsTryingLogin] = useState(true);

    const authCtx = useContext(AuthContext);

    useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          authCtx.authenticate(storedToken);
        }
        setIsTryingLogin(false);
      }
      fetchToken();
    }, []);

    if (isTryingLogin) {
      return null;
    }

    return (
      <NavigationContainer>
        <ZegoCallInvitationDialog />
        {!authCtx.isAuthenticated ? <AuthStack /> : <AuthenticatedStack />}
      </NavigationContainer>
    );
  }

  //NAV
  return (
    <AuthContextProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Root />
    </AuthContextProvider>
  );
};
