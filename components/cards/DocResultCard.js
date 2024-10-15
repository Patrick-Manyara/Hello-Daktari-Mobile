import React from "react";
import { View, Image, StyleSheet, Pressable, Platform } from "react-native";

import { Paths } from "../../utils/paths";

import HeaderText from "../ui/HeaderText";

import { colors, css } from "../../assets/styles";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../ui/IconButton";

export default function DocResultCard({ doctor, onPress }) {
  return (

    <View style={styles.docCard}>
      <View
        style={styles.innerStyle}
      >
        <View style={{ width: "20%" }}>
          <Image
            source={{ uri: Paths.IMAGE_URL + doctor.doctor_image }}
            style={{ width: 40, height: 40, objectFit: "cover" }}
          />
        </View>
        <View style={{ width: "60%" }}>
          <HeaderText
            styleProp={styles.labName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {doctor.doctor_name}
          </HeaderText>
          <HeaderText styleProp={styles.labPrice}>Ksh. {doctor.doctor_rate}</HeaderText>
        </View>
        <View style={{ width: "20%", justifyContent: "flex-end" }}>
          <IconButton
            iconName={faChevronCircleRight}
            iconColor={colors.primaryBlue}
            iconSize={20}
            onPress={onPress}
          />
        </View>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  docCard: {
    width: "98%",
    backgroundColor: colors.secondaryBlue,
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
  innerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 5,
  }
});
