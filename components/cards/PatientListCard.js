import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";

import HeaderText from "../ui/HeaderText";

import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";
import getImageUri from "../../utils/imageHelper";

export default function PatientListCard({ patient, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [
        styles.patientCard,
        { marginTop: 4 },
        pressed ? css.buttonPressed : null,
      ]}
    >
      <View>
        <Image
          style={styles.imageStyle}
          source={{ uri: getImageUri(Paths.IMAGE_URL, patient.user_image) }}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <HeaderText styleProp={{ fontSize: 14 }}>
          {patient.user_name}
        </HeaderText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  patientCard: {
    width: "96%",
    margin: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: colors.primaryGrey,
    borderBottomWidth: 4,
    paddingVertical: 4
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  imageContainerStyle: {
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 27,
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center"
  }
});
