import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";

import NormalText from "../ui/NormalText";

import { colors } from "../../assets/styles";

export default function UrgencyCard({ text, isSelected, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.urgencyArea}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={[
            styles.circleStyle,
            isSelected
              ? styles.selectedStyle
              : "",
          ]}
        ></View>
        <NormalText styleProp={styles.textStyle}>{text}</NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circleStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
    backgroundColor: "white",
  },
  textStyle: {
    marginLeft: 5,
    fontSize: 12,
  },
  urgencyArea: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    alignItems: "center",
    padding: 5,
    marginTop: 10,
    borderBottomColor: colors.primaryGrey,
    borderBottomWidth: 2
  },
  selectedStyle: {
    borderColor: colors.primaryBlue,
    borderStyle: "solid",
    borderWidth: 2,
    backgroundColor: colors.primaryBlue,
  }
});
