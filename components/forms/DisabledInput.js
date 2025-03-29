import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import NormalText from "../ui/NormalText";
import { css } from "../../assets/styles";

export default function DisabledInput({ placeholder, inputText }) {
  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [
        css.button,
        { marginTop: 4 },
        pressed ? css.buttonPressed : null,
      ]}
    >
      <View style={[css.disabledContainer, styles.customInput]}>
        <NormalText
          styleProp={{ color: "#00000066", fontSize: 8, marginLeft: 5 }}
        >
          {placeholder}
        </NormalText>
        <NormalText styleProp={{ marginLeft: 5 }}>{inputText}</NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  customInput: {
    height: 50,
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 8,
  },
});
