import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContextProvider, { AuthContext } from "../utils/auth-context";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faCartShopping, faCartPlus as faCartShoppingOutline, faComment, faHouseUser as faHome, faUser, faCalendar, faStore, faStoreAlt as faShop } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserOutline, faComment as faChatOutline, faCalendar as faDate } from '@fortawesome/free-regular-svg-icons';
import { colors } from "../assets/styles";

//SHARED
import Login from "../screens/Login";
import Start from "../screens/Start";

//USER
import WelcomeScreen from "../screens/user/WelcomeScreen";
import MyProfileScreen from "../screens/user/MyProfileScreen";
import ShopScreen from "../screens/user/ShopScreen";
import ForumScreen from "../screens/user/ForumScreen";
import AddressScreen from "../screens/user/AddressScreen";
import BookSessionScreen from "../screens/user/BookSessionScreen";
import AllDoctorsScreen from "../screens/user/AllDoctorsScreen";
import DoctorDetailsScreen from "../screens/user/DoctorDetailsScreen";
import SuccessScreen from "../screens/user/SuccessScreen";
import UploadScreen from "../screens/user/UploadScreen";
import PaymentScreen from "../screens/user/PaymentScreen";
import ForumDetailsScreen from "../screens/user/ForumDetailsScreen";
import HomeVisitScreen from "../screens/user/HomeVisitScreen";
import ProductDetailsScreen from "../screens/user/ProductDetailsScreen";
import CartScreen from "../screens/user/CartScreen";
import CheckoutScreen from "../screens/user/CheckoutScreen";
import LabScreen from "../screens/user/LabScreen";
import UserChatRooms from "../screens/user/UserChatRooms";
import UserChatScreen from "../screens/user/UserChatScreen";
import ShoppingHistoryScreen from "../screens/user/ShoppingHistoryScreen";
import SessionHistoryScreen from "../screens/user/SessionHistoryScreen";
import PlainDocScreen from "../screens/user/PlainDocScreen";
import BookAvailableScreen from "../screens/user/BookAvailableScreen";
import UserCallScreen from "../screens/user/UserCallScreen";
import SearchResultsScreen from "../screens/user/SearchResultsScreen";
import EditProfileScreen from "../screens/user/EditProfileScreen";
import AddressManager from "../screens/user/AddressManager";


//DOCTOR
import DoctorWelcomeScreen from "../screens/doctor/DoctorWelcomeScreen";
import PatientDetailScreen from "../screens/doctor/PatientDetailScreen";
import DoctorChatRooms from "../screens/doctor/DoctorChatRooms";
import ScheduleScreen from "../screens/doctor/ScheduleScreen";
import MyBioScreen from "../screens/doctor/MyBioScreen";
import ChoiceScreen from "../screens/ChoiceScreen";
import ChatScreen from "../screens/doctor/ChatScreen";
import StartNewChat from "../screens/doctor/StartNewChat";
import DocAddChatRoom from "../screens/doctor/DocAddChatRoom";
import ViewScheduleScreen from "../screens/doctor/ViewScheduleScreen";
import EditBioScreen from "../screens/doctor/EditBioScreen";
import SpecialtyScreen from "../screens/doctor/SpecialtyScreen";
import WalletScreen from "../screens/doctor/WalletScreen";
import AllPatientsScreen from "../screens/doctor/AllPatientsScreen";
import SessionDetailsScreen from "../screens/doctor/SessionDetailsScreen";
import AppointmentDetailsScreen from "../screens/doctor/AppointmentDetailsScreen";
import AllSpecialistsScreen from "../screens/doctor/AllSpecialistsScreen";
import SpecialistDetailsScreen from "../screens/doctor/SpecialistDetailsScreen";
import ReferralSuccessScreen from "../screens/doctor/ReferralSuccessScreen";
import DoctorCallScreen from "../screens/doctor/DoctorCallScreen";


export default () => {
   const UserTab = createBottomTabNavigator();
   const Stack = createNativeStackNavigator();
   const ShopStack = createNativeStackNavigator();
   const CartStack = createNativeStackNavigator();
   const ProfileStack = createNativeStackNavigator();

   const DocTab = createBottomTabNavigator();
   const DocStack = createNativeStackNavigator();
   const ChatStack = createNativeStackNavigator();
   const DocProfileStack = createNativeStackNavigator();


   function TabBarIcon(props) {
      return <FontAwesomeIcon size={16} style={{ marginBottom: -3 }} {...props} />;
   }

   //USER

   function UserBottomTab() {
      return (
         <UserTab.Navigator
            screenOptions={({ route }) => ({
               tabBarActiveTintColor: colors.primaryBlue,
               headerShown: false,
               tabBarIcon: ({ focused, color, size }) => {
                  let icon;

                  if (route.name === "Welcome") {
                     icon = !focused ? faHouse : faHome;
                  } else if (route.name === "Shop") {
                     icon = focused ? faShop : faStore;
                  } else if (route.name === "Cart") {
                     icon = !focused ? faCartShopping : faCartShoppingOutline;
                  } else if (route.name === "Profile") {
                     icon = focused ? faUser : faUserOutline;
                  }

                  return <TabBarIcon icon={icon} color={color} size={size} />;
               },
            })}
         >
            <UserTab.Screen
               options={{ title: "" }}
               name="Welcome"
               component={UserStack}
            />
            <UserTab.Screen
               options={{ title: "" }}
               name="Shop"
               component={ShopPages}
            />
            <UserTab.Screen
               options={{ title: "" }}
               name="Cart"
               component={CartPages}
            />
            <UserTab.Screen
               options={{ title: "" }}
               name="Profile"
               component={ProfilePages}
            />
         </UserTab.Navigator>
      );
   }

   function UserStack() {
      return (
         <Stack.Navigator
            screenOptions={{
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="BookSessionScreen" component={BookSessionScreen} />
            <Stack.Screen
               name="BookAvailableScreen"
               component={BookAvailableScreen}
            />

            <Stack.Screen name="AllDoctorsScreen" component={AllDoctorsScreen} />
            <Stack.Screen
               name="DoctorDetailsScreen"
               component={DoctorDetailsScreen}
            />
            <Stack.Screen name="AddressScreen" component={AddressScreen} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
            <Stack.Screen name="UserCallScreen" component={UserCallScreen} />
            <Stack.Screen name="ForumScreen" component={ForumScreen} />

            <Stack.Screen
               name="ForumDetailsScreen"
               component={ForumDetailsScreen}
            />
            <Stack.Screen name="HomeVisitScreen" component={HomeVisitScreen} />
            <Stack.Screen name="UploadScreen" component={UploadScreen} />

            <Stack.Screen name="LabScreen" component={LabScreen} />
            <Stack.Screen name="SingleProductScreen" component={ProductDetailsScreen} />
            <Stack.Screen
               name="UserChatRooms"
               component={UserChatRooms}
            />
            <Stack.Screen
               name="UserChatScreen"
               component={UserChatScreen}
            />

            <Stack.Screen name="PlainDocScreen" component={PlainDocScreen} />
            <Stack.Screen
               name="SearchResultsScreen"
               component={SearchResultsScreen}
            />
         </Stack.Navigator>
      );
   }

   function ShopPages() {
      return (
         <ShopStack.Navigator
            screenOptions={{
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
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
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
            <CartStack.Screen name="CartScreen" component={CartScreen} />
            <CartStack.Screen name="CheckoutScreen" component={CheckoutScreen} />
         </CartStack.Navigator>
      );
   }

   function ProfilePages() {
      return (
         <ProfileStack.Navigator
            screenOptions={{
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
            <ProfileStack.Screen
               options={{
                  title: "",
               }}
               name="MyProfileScreen"
               component={MyProfileScreen}
            />
            <ProfileStack.Screen
               options={{
                  title: "",
               }}
               name="EditProfileScreen"
               component={EditProfileScreen}
            />
            <ProfileStack.Screen
               options={{
                  title: "",
               }}
               name="UserChatRooms"
               component={UserChatRooms}
            />
            <ProfileStack.Screen
               options={{
                  title: "",
               }}
               name="UserChatScreen"
               component={UserChatScreen}
            />
            <ProfileStack.Screen
               name="AddressManager"
               component={AddressManager}
            />
            <ProfileStack.Screen
               name="ShoppingHistoryScreen"
               component={ShoppingHistoryScreen}
            />
            <ProfileStack.Screen
               name="SessionHistoryScreen"
               component={SessionHistoryScreen}
            />
         </ProfileStack.Navigator>
      );
   }

   //DOC
   function DoctorBottomTab() {
      return (
         <DocTab.Navigator
            screenOptions={({ route }) => ({
               tabBarActiveTintColor: colors.primaryBlue,
               headerShown: false,
               tabBarIcon: ({ focused, color, size }) => {
                  let icon;

                  // Set the icon name based on the route name and whether the tab is focused
                  if (route.name === "Welcome2") {
                     icon = focused ? faHouse : faHome;
                  } else if (route.name === "DoctorChatRooms") {
                     icon = focused ? faComment : faChatOutline;
                  } else if (route.name === "ScheduleScreen") {
                     icon = focused ? faCalendar : faDate;
                  } else if (route.name === "DoctorProfile") {
                     icon = focused ? faUser : faUserOutline;
                  }

                  // Return the TabBarIcon component with the appropriate icon name
                  return <TabBarIcon icon={icon} color={color} size={size} />;
               },
            })}
         >
            <DocTab.Screen
               options={{
                  title: "",
               }}
               name="Welcome2"
               component={DoctorStack}
            />
            <DocTab.Screen
               options={{
                  title: "",
               }}
               name="DoctorChatRooms"
               component={DoctorChats}
            />
            <DocTab.Screen
               options={{
                  title: "",
               }}
               name="ScheduleScreen"
               component={ScheduleScreen}
            />
            <DocTab.Screen
               options={{
                  title: "",
               }}
               name="DoctorProfile"
               component={DocProfilePages}
            />
         </DocTab.Navigator>
      );
   }

   function DoctorStack() {
      return (
         <DocStack.Navigator
            screenOptions={{
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
            <DocStack.Screen name="DoctorHome" component={DoctorWelcomeScreen} />
            <DocStack.Screen
               name="PatientDetailScreen"
               component={PatientDetailScreen}
            />
            <DocStack.Screen name="DoctorCallScreen" component={DoctorCallScreen} />

            <DocStack.Screen
               name="ViewScheduleScreen"
               component={ViewScheduleScreen}
            />

            <DocStack.Screen
               name="AppointmentDetailsScreen"
               component={AppointmentDetailsScreen}
            />
            <DocStack.Screen
               name="SessionDetailsScreen"
               component={SessionDetailsScreen}
            />
            <DocStack.Screen
               name="AllSpecialistsScreen"
               component={AllSpecialistsScreen}
            />
            <DocStack.Screen
               name="SpecialistDetailsScreen"
               component={SpecialistDetailsScreen}
            />
            <DocStack.Screen
               name="ReferralSuccessScreen"
               component={ReferralSuccessScreen}
            />
         </DocStack.Navigator>
      );
   }

   function DoctorChats() {
      return (
         <ChatStack.Navigator
            screenOptions={{
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
            <ChatStack.Screen name="DoctorChatRoom" component={DoctorChatRooms} />

            <ChatStack.Screen name="DocAddChatRoom" component={DocAddChatRoom} />
            <ChatStack.Screen name="StartNewChat" component={StartNewChat} />
            <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
         </ChatStack.Navigator>
      )
   }

   function DocProfilePages() {
      return (
         <DocProfileStack.Navigator
            screenOptions={{
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
            <DocProfileStack.Screen name="MyBioScreen" component={MyBioScreen} />
            <DocProfileStack.Screen name="EditBioScreen" component={EditBioScreen} />
            <DocProfileStack.Screen name="SpecialtyScreen" component={SpecialtyScreen} />
            <DocProfileStack.Screen name="WalletScreen" component={WalletScreen} />
            <DocProfileStack.Screen
               name="AllPatientsScreen"
               component={AllPatientsScreen}
            />

         </DocProfileStack.Navigator>
      )
   }



   function AuthStack() {
      return (
         <Stack.Navigator
            screenOptions={{
               headerShown: false,
               contentStyle: { backgroundColor: "white" },
            }}
         >
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="ChoiceScreen" component={ChoiceScreen} />
            <Stack.Screen name="Login" component={Login} />
         </Stack.Navigator>
      );
   }

   function AuthenticatedStack() {
      const [token, setToken] = useState(null); // Initialize token as null
      const [isTryingLogin, setIsTryingLogin] = useState(true);

      useEffect(() => {
         async function fetchToken() {
            const storedToken = await AsyncStorage.getItem("token");
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
         token && token.user_type === "user" ? UserBottomTab : DoctorBottomTab;

      if (isTryingLogin) {
         return null;
      }

      return (
         <Stack.Navigator
            screenOptions={{
               tabBarActiveTintColor: "#007fff",
               headerShown: false,
            }}
         >
            <Stack.Screen name="Home" component={comp} />
         </Stack.Navigator>
      );
   }

   function Root() {
      const [loggedIn, setLoggedIn] = useState(false);

      const [isTryingLogin, setIsTryingLogin] = useState(true);

      const authCtx = useContext(AuthContext);

      useEffect(() => {
         async function fetchToken() {
            const storedToken = await AsyncStorage.getItem("token");
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
            {!authCtx.isAuthenticated ? <AuthStack /> : <AuthenticatedStack />}
         </NavigationContainer>
      );
   }

   return (
      <AuthContextProvider>
         <Root />
      </AuthContextProvider>
   );
};
