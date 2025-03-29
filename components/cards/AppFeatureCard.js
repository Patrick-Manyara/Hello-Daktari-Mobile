import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import NormalText from "../ui/NormalText";

import { css } from "../../assets/styles";

export default function AppFeatureCard({
  imageSrc,
  featureText,
  onPress,
  bgColor,
  txtColor,
}) {
  return (
    <Pressable onPress={onPress} style={css.flexColumn}>
      <View style={[styles.featuresCard, { backgroundColor: bgColor }]}>
        <Image style={styles.imageStyle} source={imageSrc} />
        <NormalText styleProp={[styles.textStyle, { color: txtColor }]}>
          {featureText}
        </NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featuresCard: {
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    height: 100,
    borderRadius: 10,
    width: "95%",
  },
  imageStyle: {
    width: 35,
    height: 35,
    objectFit: "contain",
  },
  textStyle: {
    fontSize: 10,
    color: "black",
    marginTop: 2,
  },
});
