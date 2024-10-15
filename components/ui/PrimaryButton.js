import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

import NormalText from "./NormalText";

import { css, colors } from "../../assets/styles";

export default function PrimaryButton({ children, onPress, styleProp }) {
  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [css.button, pressed ? css.buttonPressed : null]}
      onPress={onPress}
    >
      <View style={[styles.buttonContainer, styleProp]}>
        <NormalText styleProp={[styles.textStyle]}>{children}</NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 14,
    color: "white",
  },
  buttonContainer: {
    width: "auto",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: colors.primaryPink,
    marginTop: 5,
    borderRadius: 12,
  },
});
