import React from "react";
import { View, Image, StyleSheet, Pressable, Platform } from "react-native";

import { colors } from "../../assets/styles";

import NormalText from "../ui/NormalText";

export default function PaymentCard({ text, img1, img2, isSelected, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.paymentCard}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={[
            styles.circleStyle,
            isSelected
              ? {
                  borderColor: colors.primaryBlue,
                  borderStyle: "solid",
                  borderWidth: 2,
                  backgroundColor: colors.primaryBlue,
                }
              : "",
          ]}
        ></View>
        <NormalText styleProp={styles.textStyle}>{text}</NormalText>
      </View>

      <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
        <Image source={img1} />
        <Image source={img2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  viewCard: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 10,
    // IOS
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    backgroundColor: "white",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
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
  },
  paymentCard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    backgroundColor: colors.secondaryGrey,
    alignItems: "center",
    padding: 5,
    marginTop: 10,
  },
});
