import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";

import NormalText from "../ui/NormalText";

import { colors, css } from "../../assets/styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function ProfileCard({ src, header, info, onPress }) {
  return (
    <Pressable
      style={[css.smallerCard, { height: 80, justifyContent: "center" }]}
      onPress={onPress}
    >
      <View style={styles.profileMainInner}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.imageContainer}>
            <Image source={src} style={styles.image} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <NormalText>{header}</NormalText>
            <NormalText>{info}</NormalText>
          </View>
        </View>

        <View style={{ justifyContent: "flex-end" }}>
          <FontAwesomeIcon icon={faArrowRight} color={colors.primaryBlue} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  profileMainInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.secondaryGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 20,
    height: 20,
  },
});
