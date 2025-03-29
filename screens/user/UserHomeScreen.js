import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { css } from "../../assets/styles";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import NotificationBell from "../../components/ui/NotificationBell";
import NormalText from "../../components/ui/NormalText";
import HeaderText from "../../components/ui/HeaderText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import HomePageModal from "../../components/modals/HomePageModal";
import AppFeaturesSection from "../../components/sections/AppFeaturesSection";
import SearchInput from "../../components/forms/SearchInput";

export default function UserHomeScreen() {
  const [user, setUser] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  function BannerArea() {
    return (
      <View style={{ borderRadius: 10 }}>
        <ImageBackground
          source={require("../../assets/images/banner.png")}
          style={styles.backgroundImage}
          imageStyle={styles.imageBackgroundStyle}
        >
          <View style={styles.mainView}>
            <View style={styles.leftHalfView}>
              <NormalText>Find & Search Your Favorite Doctor</NormalText>
              <Image source={require("../../assets/images/curve.png")} />
              <NormalText>
                Instant consultations with our trusted doctors
              </NormalText>
              <PrimaryButton onPress={openModal}>Consult A Doctor</PrimaryButton>
              <HomePageModal visible={isModalVisible} closeModal={closeModal} />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  function AdArea() {
    return (
      <View style={{ borderRadius: 10 }}>
        <ImageBackground
          source={require("../../assets/images/banner3.png")}
          style={styles.backgroundImage}
          imageStyle={styles.imageBackgroundStyle}
        >
          <Pressable style={styles.outerView}>
            <View style={styles.innerView}>
              <View style={styles.firstHalf}>
                <HeaderText styleProp={[css.smallerText, { color: "white" }]}>
                  Get 30% Discount on your First Purchase
                </HeaderText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <HeaderText styleProp={[css.smallerText, { color: "white" }]}>
                    Shop Now
                  </HeaderText>

                  <FontAwesomeIcon  icon={faArrowRight} color="#fff" />
                </View>
              </View>
              <View style={styles.secondHalf}>
                <Image source={require("../../assets/images/panadol.png")} />
              </View>
            </View>
          </Pressable>
        </ImageBackground>
      </View>
    );
  }
  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <View>
          <HeaderText>Welcome Back, {user.user_name} </HeaderText>
          <SearchInput message="Doctors, Products or Services" />

          <BannerArea />
          <HeaderText styleProp={css.smallerText}>
            What we have prepared for you!
          </HeaderText>
          <AppFeaturesSection userData={user} />
          <AdArea />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 10,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    padding: 5,
    borderRadius: 10,
  },
  leftHalfView: {
    width: "50%",
    justifyContent: "flex-start",
  },
  outerView: {
    width: "100%",
    margin: 5,
    borderRadius: 10,
  },
  imageBackgroundStyle: {
    borderRadius: 10, // Applies the borderRadius to the actual image
  },
  innerView: {
    flexDirection: "row",
    width: "100%",
  },
  firstHalf: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  secondHalf: {
    width: "50%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
