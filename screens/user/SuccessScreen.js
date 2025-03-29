import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { css } from "../../assets/styles";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function SuccessScreen({ navigation }) {
  function navigateToHome() {
    navigation.navigate("UserHomeScreen");
  }

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Image
            style={styles.imageStyle}
            source={require("../../assets/icons/circle.png")}
          />
          <HeaderText styleProp={styles.titleStyle}>
            Transaction Successful!
          </HeaderText>
          <NormalText>Kindly check your email for more details.</NormalText>
          <NormalText>Thank you for choosing Hello Daktari.</NormalText>
          <PrimaryButton onPress={navigateToHome}>Return To Home Screen</PrimaryButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    color: "black",
  },
  imageStyle: {
    height: 140,
    width: 140,
  },
});
