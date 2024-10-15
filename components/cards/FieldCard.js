import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";

import NormalText from "../ui/NormalText";
import IconButton from "../ui/IconButton";

import { colors, css } from "../../assets/styles";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function FieldCard({
  title,
  subtitle,
  onPress,
  handleClose,
  isActive,
}) {
  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [
        styles.fieldCard,
        { marginTop: 4 },
        pressed ? css.buttonPressed : null,
      ]}
    >
      <View
        style={styles.innerStyle}
      >
        <View style={{ width: "80%" }}>
          <NormalText
            fontProp="poppins-semibold"
            styleProp={{ marginVertical: 2 }}
          >
            {title}
          </NormalText>
          <NormalText>{subtitle}</NormalText>
        </View>
        <View style={{ width: "20%" }}>
          <IconButton
            onPress={isActive ? handleClose : onPress}
            iconName={isActive ? faArrowUp : faArrowDown}
            iconColor={colors.primaryBlue}
            iconSize={15}
            styleProp={styles.buttonStyle}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fieldCard: {
    width: "95%",
    backgroundColor: colors.secondaryGrey,
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 5,
    // IOS
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    backgroundColor: "white",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  buttonStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: colors.secondaryBlue,
  },
  innerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center"
  }
});
