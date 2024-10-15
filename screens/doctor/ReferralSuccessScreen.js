import React from "react";
import { StyleSheet, Image, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, css } from "../../assets/styles";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function ReferralSuccessScreen({ navigation }) {
  function navigateToHome() {
    navigation.navigate("DoctorHome");
  }

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Image
            style={styles.imageStyle}
            source={require("../../assets/icons/circle.png")}
          />
          <HeaderText styleProp={styles.titleStyle}>
            Patient referred Successfully!
          </HeaderText>

          <PrimaryButton onPress={navigateToHome}>Proceed</PrimaryButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    color: colors.primaryBlue,
  },
  pinkText: {
    color: colors.primaryPink,
  },
  ratingArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  innerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 5,
  },
  imageStyle: {
    height: 140,
    width: 140,
  },
});
