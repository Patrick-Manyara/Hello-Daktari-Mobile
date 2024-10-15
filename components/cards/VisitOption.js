import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

import { colors } from "../../assets/styles";

export default function VisitOption({ img, name, onPress, isSelected }) {
  return (
    <Pressable style={{ width: "33.33%" }} onPress={onPress}>
      <View
        style={[
          styles.visitCard,
          {
            backgroundColor: isSelected
              ? colors.primaryPink
              : colors.whiteSmoke,
          },
        ]}
      >
        <Image source={img} style={styles.imageStyle} />
        <Text style={styles.textStyle}>{name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  visitCard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.whiteSmoke,
    flexDirection: "row",
    width: "95%",
    height: 50,
    borderRadius: 10,
  },
  imageStyle: {
    width: 15,
    height: 15,
    objectFit: "contain",
    marginRight: 5,
  },
  textStyle: {
    fontSize: 10,
    color: colors.primaryBlue,
    textTransform: "capitalize",
  },
});
