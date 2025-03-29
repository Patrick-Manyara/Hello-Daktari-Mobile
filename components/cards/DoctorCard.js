import React from "react";
import { View, Image, StyleSheet, Pressable, Platform } from "react-native";

import { Paths } from "../../utils/paths";

import PrimaryButton from "../ui/PrimaryButton";
import HeaderText from "../ui/HeaderText";
import NormalText from "../ui/NormalText";
import getImageUri from "../../utils/imageHelper";
import MediumText from "../ui/MediumText";

export default function DoctorCard({ onPress, doctor }) {
  return (
    <Pressable style={{ width: "50%" }}>
      <View style={styles.doctorCard}>
        <Image
          source={{
            uri: getImageUri(Paths.IMAGE_URL, doctor.doctor_image)
          }}

          resizeMode="cover"
          style={styles.imageStyle}
        />
        <View style={styles.textArea}>
          <View style={{ height: 40 }}>
            <HeaderText styleProp={styles.titleStyle}>
              {doctor.doctor_name}
            </HeaderText>
          </View>

          <MediumText styleProp={{ fontSize: 10 }}>{doctor.doctor_qualifications}</MediumText>
          <NormalText>Experience: 12 Years</NormalText>
          <View style={styles.ratingArea}>
            <Image source={require("../../assets/icons/star.png")} />
            <NormalText>4.5</NormalText>
          </View>
          <NormalText>Rate/hr: Ksh. {doctor.doctor_rate} </NormalText>
          <PrimaryButton onPress={onPress}>See Profile</PrimaryButton>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  doctorCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    // IOS
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    backgroundColor: "white",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  titleStyle: {
    fontSize: 14,
  },
  textArea: {
    padding: 5,
  },
  ratingArea: {
    flexDirection: "row",
  },
  imageStyle: {
    width: "100%",
    height: 150,
    objectFit: "cover",
  },
});
