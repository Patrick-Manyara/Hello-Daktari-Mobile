import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import PrimaryButton from "../components/ui/PrimaryButton";
import HeaderText from "../components/ui/HeaderText";
import UserTypeCard from "../components/cards/UserTypeCard";
import NormalText from "../components/ui/NormalText";

import { css } from "../assets/styles";
 

export default function ChoiceScreen({ navigation }) {
  function navigateToScreen(screenName, prop) {
    navigation.navigate(screenName, { user: prop });
  }

  const [userType, setUserType] = useState(null);


  const userTypes = [
    {
      mainText: "I am a patient/client",
      keyProp: "user",
      subText: "Register as a patient and access our services",
      img: require("../assets/images/patients.png")
    },
    {
      mainText: "I am a doctor",
      keyProp: "doctor",
      subText: "Register as a qualified doctor and start consultations",
      img: require("../assets/images/dox.png")
    },
  ];

  return (
    <SafeAreaView style={css.safeAreaView}>
      <HeaderText styleProp={[css.centerText, { marginVertical: 10 }]}>Profile Selection</HeaderText>
      <NormalText styleProp={[css.centerText]}>Choose your preferred profile to proceed</NormalText>
      {userTypes.map((option, index) => (
        <UserTypeCard
          key={index}
          img={option.img}
          mainText={option.mainText}
          subText={option.subText}
          onPress={() => setUserType(option.keyProp)}
          isSelected={userType === option.keyProp}
        />
      ))}

      {userType && (
        <PrimaryButton onPress={() => { navigateToScreen("Login", userType); }}>
          Proceed
        </PrimaryButton>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#4C84C3BF", // Blue overlay with 50% opacity
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
  },
});
