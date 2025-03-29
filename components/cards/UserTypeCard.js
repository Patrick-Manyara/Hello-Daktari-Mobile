import React from "react";
import { View, Image, StyleSheet, Pressable, Platform } from "react-native";

import { colors } from "../../assets/styles";

import NormalText from "../ui/NormalText";
import HeaderText from "../ui/HeaderText";

export default function UserTypeCard({ mainText, img, subText, isSelected, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.paymentCard}>
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={{ justifyContent: "flex-start", flexDirection: "row", width: "10%" }}>
          <Image
            style={styles.circleStyle}
            source={
              isSelected
                ? require('../../assets/icons/checked.png')
                : require('../../assets/icons/unchecked.png')
            }
          />
        </View>
        <View style={{ width: "70%" }}>
          <HeaderText styleProp={styles.textStyle}>{mainText}</HeaderText>
          <NormalText styleProp={styles.textStyle}>{subText}</NormalText>
        </View>
        <View style={{ justifyContent: "flex-end", flexDirection: "row", width: "20%" }}>
          <Image style={styles.imageStyle} source={img} />
        </View>
      </View>


    </Pressable>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    marginLeft: 5,
  },
  imageStyle: {
    width: 80,
    height: 80,
    marginLeft: 5,
    objectFit: "cover"
  },
  circleStyle: {
    width: 30,
    height: 30,
    marginLeft: 5,
    objectFit: "contain"
  },
  paymentCard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "auto",
    backgroundColor: colors.secondaryGrey,
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10
  },
});
