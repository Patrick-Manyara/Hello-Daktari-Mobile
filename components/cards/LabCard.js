import React from "react";
import { View, StyleSheet, Platform } from "react-native";

import HeaderText from "../ui/HeaderText";
import PrimaryButton from "../ui/PrimaryButton";

import { colors } from "../../assets/styles";


export default function LabCard({ lab, onPress, isInCart }) {
  return (
    <View style={styles.labCard}>
      <View
        style={styles.innerStyle}
      >
        <View style={{ width: "80%" }}>
          <HeaderText
            styleProp={styles.labName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {lab.lab_name}
          </HeaderText>
          <HeaderText styleProp={styles.labPrice}>
            Ksh. {lab.lab_price}
          </HeaderText>
        </View>
        <View style={{ width: "20%", justifyContent: "flex-end" }}>
          <PrimaryButton
            onPress={onPress}
            style={isInCart ? styles.inCartStyle : styles.notInCartStyle}
          >
            {isInCart ? "REMOVE" : "ADD"}
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labCard: {
    width: "98%",
    backgroundColor: colors.secondaryGrey,
    margin: 5,
    borderRadius: 12,
    elevation: 4,

    // IOS
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    backgroundColor: "white",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  labName: {
    color: "black",
    fontSize: 12,
  },
  labPrice: {
    fontSize: 10,
  },
  inCartStyle: {
    height: 30,
    borderRadius: 10,
  },
  notInCartStyle: {
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.darkBlue,
  },
  innerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 5,
  }
});
