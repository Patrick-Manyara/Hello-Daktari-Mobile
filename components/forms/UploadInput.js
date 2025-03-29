import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import { colors, css } from "../../assets/styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";

import NormalText from "../ui/NormalText";

export default function UploadInput({ placeholder, onPress }) {
  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [
        css.button,
        { marginTop: 4 },
        pressed ? css.buttonPressed : null,
      ]}
      onPress={onPress}
    >
      <View style={[css.inputContainer, styles.customInput]}>
        <NormalText>{placeholder}</NormalText>
        <FontAwesomeIcon icon={faCloudUpload} color={colors.primaryPink} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  customInput: {
    height: 40,
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 8,
  },
});
