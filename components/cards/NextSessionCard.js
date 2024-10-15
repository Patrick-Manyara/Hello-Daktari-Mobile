import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, Image } from "react-native";

import NormalText from "../ui/NormalText";

import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";
import { getDayMonthAndYear, getTimeInAmPm } from "../../utils/dateFormat";

export default function NextSessionCard({ session, isToday, onPress }) {
  const [userImage, setUserImage] = useState("");
  useEffect(() => {
    if (session.user_image === null) {
      setUserImage("default.png");
    } else {
      setUserImage(session.user_image);
    }
  }, []);
 
  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [
        styles.sessionCard,
        isToday ? styles.pinkBg : styles.blueBg,
        pressed ? css.buttonPressed : null,
      ]}
      onPress={onPress}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: Paths.IMAGE_URL + userImage }}
      />
      <NormalText styleProp={styles.userName}>{session.user_name}</NormalText>
      <NormalText styleProp={styles.userName}>
        {getDayMonthAndYear(session.session_date)}
      </NormalText>
      <NormalText styleProp={styles.userName}>
        {getTimeInAmPm(session.session_start_time)}
      </NormalText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sessionCard: {
    width: 100,
    height: 180,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  userName: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  pinkBg: {
    backgroundColor: colors.mediumPink,
  },
  blueBg: {
    backgroundColor: colors.darkBlue,
  },
});
