import React from "react";
import AwesomeIcon from "./AwesomeIcon";
import NormalText from "./NormalText";
import { colors } from "../../assets/styles";
import { Pressable, StyleSheet } from "react-native";

export default function IconButton({
  iconName,
  iconColor,
  iconSize,
  onPress,
  styleProp,
  text,
  textStyle,
  iconStyle,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonStyle,
        styleProp,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <AwesomeIcon
        iconColor={iconColor}
        iconName={iconName}
        iconSize={iconSize}
        iconStyle={iconStyle}
      />

      {text && <NormalText styleProp={textStyle}>{text}</NormalText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    margin: 8,
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: colors.secondaryPink,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
