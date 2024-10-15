import React from "react";
import { StyleSheet, View } from "react-native";

import AwesomeIcon from "./AwesomeIcon";

import { faBell } from "@fortawesome/free-regular-svg-icons";
import { colors } from "../../assets/styles";

export default function NotificationBell() {
  return (
    <View style={style.topView}>
      <View style={style.bellWrapper}>
        <AwesomeIcon iconName={faBell} iconColor="#333" />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  topView: {
    width: "100%",
    height: "auto",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  bellWrapper: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: colors.secondaryBlue,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
