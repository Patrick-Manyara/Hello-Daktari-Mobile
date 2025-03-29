import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, Image, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../../utils/auth-context";
import { Paths } from "../../utils/paths";
import { colors, css } from "../../assets/styles";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import ProfileCard from "../../components/cards/ProfileCard";
import getImageUri from "../../utils/imageHelper";


export default function UserProfileScreen({ navigation }) {
  const [user, setUser] = useState([]);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  function navigateToScreen(screenName) {
    navigation.navigate(screenName);
  }

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <HeaderText>Profile</HeaderText>
        <View style={styles.profileMain}>
          <View style={styles.profileMainInner}>
            <Pressable style={styles.imageContainer}>
              <Image
                source={{ uri: getImageUri(Paths.IMAGE_URL, user.user_image) }}
                style={styles.imageStyle}
              />
            </Pressable>
            <View style={{ marginLeft: 10 }}>
              <NormalText styleProp={css.whiteText}>
                {user.user_name}
              </NormalText>
              <NormalText styleProp={css.whiteText}>
                {user.user_email}
              </NormalText>
            </View>
          </View>
        </View>
        <NormalText>General</NormalText>
        <ProfileCard
          src={require("../../assets/icons/pro_user.png")}
          header="Account Information"
          info="Change your account information"
          onPress={() => navigateToScreen("EditProfileScreen")}
        />

        <ProfileCard
          src={require("../../assets/icons/pro_chats.png")}
          header="Chats"
          info="View Your Chats"
          onPress={() => navigateToScreen("UserChatRooms")}
        />

        <ProfileCard
          src={require("../../assets/icons/pro_notes.png")}
          header="Medical Records"
          info="History about your medical records"
        />

        <ProfileCard
          src={require("../../assets/icons/pro_basket.png")}
          header="Shopping History"
          info="View your Shopping History"
          onPress={() => navigateToScreen("ShoppingHistoryScreen")}
        />

        <ProfileCard
          src={require("../../assets/icons/pro_sesh.png")}
          header="Session History"
          info="View Your Session History"
          onPress={() => navigateToScreen("SessionHistoryScreen")}
        />
        <ProfileCard
          src={require("../../assets/icons/pro_add.png")}
          header="Saved Addresses"
          info="View Your Saved Addresses"
          onPress={() => navigateToScreen("AddressManager")}
        />
        <ProfileCard
          src={require("../../assets/icons/pro_logout.png")}
          header="Logout"
          info="Logout of your account"
          onPress={authCtx.logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileMain: {
    backgroundColor: colors.darkBlue,
    padding: 10,
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 10,
    // IOS
    shadowColor: colors.darkBlue,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  profileMainInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
