import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";

import NormalText from "../ui/NormalText";
import HeaderText from "../ui/HeaderText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { colors } from "../../assets/styles";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";

export default function AddressCard({
  address,
  isSelected,
  onPress,
  editAddress,
  removeAddress,
}) {
  return (
    <View style={styles.addressCard}>
      <View style={styles.outerStyle}>
        <Pressable
          style={styles.firstHalf}
          onPress={onPress}
        >
          <View
            style={[
              styles.circleStyle,
              isSelected
                ? styles.selectedStyle
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

        <View style={styles.secondHalf}>
          <Pressable onPress={editAddress} style={{ marginRight: 25 }}>
            <FontAwesomeIcon size={20} icon={faPenToSquare} color={colors.primaryBlue} />
          </Pressable>

          <Pressable onPress={removeAddress}>
            <FontAwesomeIcon size={20} icon={faTrashCan} color={colors.colorDanger800} />
          </Pressable>
        </View>
      </View>
    </View>
  );
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
  addressCard: {
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
  selectedStyle: {
    borderColor: colors.primaryBlue,
    borderStyle: "solid",
    borderWidth: 2,
    backgroundColor: colors.primaryBlue,
  },
  firstHalf: {
    width: "70%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  outerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
  },
  secondHalf: {
    width: "30%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  }
});
