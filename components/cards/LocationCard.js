import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";

import NormalText from "../ui/NormalText";
import HeaderText from "../ui/HeaderText";

import { colors } from "../../assets/styles";


export default function LocationCard({ address, isSelected, onPress }) {
  return (
    <View style={styles.locationCard}>
      <View
        style={styles.innerStyle}
      >
        <Pressable
          style={styles.firstHalf}
          onPress={onPress}
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

          <View style={{ marginLeft: 10 }}>
            <HeaderText styleProp={{ fontSize: 14 }}>
              {address.address_name}
            </HeaderText>
            <NormalText >
              {address.address_location}
            </NormalText>
          </View>
          <View style={{ marginVertical: 2 }}></View>
        </Pressable>

      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  circleStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 2,
    backgroundColor: "white",
  },
  locationCard: {
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
  innerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
  },
  firstHalf: {
    width: "70%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  }
});
