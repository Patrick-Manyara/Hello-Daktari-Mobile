import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../assets/styles";

export default function LineBreak() {
  return <View style={styles.hr}></View>;
}

const styles = StyleSheet.create({
  hr: {
    borderTopWidth: 4,
    borderTopColor: colors.secondaryGrey,
    borderRadius: 5,
  },
});
