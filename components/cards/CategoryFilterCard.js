import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import NormalText from "../ui/NormalText";

import { colors } from "../../assets/styles";

export default function CategoryFilterCard({
  categoryName,
  isSelected,
  onPress,
}) {
  return (
    <Pressable style={{ width: 90 }} onPress={onPress}>
      <View
        style={[
          styles.timeSlot,
          {
            backgroundColor: isSelected
              ? colors.primaryBlue
              : colors.categoryBlue,
          },
        ]}
      >
        <NormalText
          styleProp={[
            styles.textStyle,
            {
              color: isSelected ? "white" : colors.textColor,
            },
          ]}
        >
          {categoryName}
        </NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  timeSlot: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryBlue,
    flexDirection: "column",
    width: "95%",
    height: 50,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 8,
    color: "black",
    textTransform: "capitalize",
  },
});
