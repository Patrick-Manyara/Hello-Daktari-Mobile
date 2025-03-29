import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, Image, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../../utils/auth-context";
import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import ProfileCard from "../../components/cards/ProfileCard";

export default function DoctorProfileScreen({ route, navigation }) {
  const [doctor, setDoctor] = useState([]);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    fetchDoctor();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchDoctor();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchDoctor = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setDoctor(u);
    }
  };

  function navigateToScreen(screenName) {
    navigation.navigate(screenName);
  }



  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <View>
          <HeaderText>Profile</HeaderText>
          <View style={styles.profileMain}>
            <View style={styles.profileMainInner}>
              <Pressable style={styles.imageContainer}>
                <Image
                  source={{
                    uri: Paths.IMAGE_URL + doctor.doctor_image,
                  }}
                  style={styles.image}
                />
              </Pressable>
              <View style={{ marginLeft: 10 }}>
                <NormalText styleProp={css.whiteText}>
                  {doctor.doctor_name}
                </NormalText>
                <NormalText styleProp={css.whiteText}>
                  {doctor.doctor_email}
                </NormalText>
              </View>
            </View>
          </View>
          <NormalText>General</NormalText>
          <ProfileCard
            src={require("../../assets/icons/pro_user.png")}
            header="Account Information"
            info="Change your account information"
            onPress={() => navigateToScreen("EditBioScreen")}
          />
          <ProfileCard
            src={require("../../assets/icons/pro_category.png")}
            header="Specialties"
            info="Change your Specialties"
            onPress={() => navigateToScreen("SpecialtyScreen")}
          />
          <ProfileCard
            src={require("../../assets/icons/pro_wallet.png")}
            header="Wallet"
            info="Wallet"
            onPress={() => navigateToScreen("WalletScreen")}
          />
          <ProfileCard
            src={require("../../assets/icons/pro_sesh.png")}
            header="Patients"
            info="Patients"
            onPress={() => navigateToScreen("AllPatientsScreen")}
          />
          <ProfileCard
            src={require("../../assets/icons/pro_logout.png")}
            header="Logout"
            info="Logout of your account"
            onPress={authCtx.logout}
          />
        </View>
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
  imageContainer: {},
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
