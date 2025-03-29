import React from "react";
import { Image, StyleSheet, View } from "react-native";

import HeaderText from "../ui/HeaderText";
import NormalText from "../ui/NormalText";

export default function ViewPagerSection({
  imageSrc,
  mainText,
  secondaryText,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.contentView}>
        <Image style={styles.imageStyle} source={imageSrc} />
        <HeaderText styleProp={{ fontSize: 18 }}>{mainText}</HeaderText>
        <NormalText styleProp={{ marginHorizontal: 5 }}>{secondaryText}</NormalText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  contentView: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    height: 250,
    width: 250,
    objectFit: "contain",
  },
  textStyle: {
    textAlign: "center",
  },
});
