import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";

import NormalText from "../ui/NormalText";
import MediumText from "../ui/MediumText";

import { css } from "../../assets/styles";
import { getLongDate } from "../../utils/dateFormat";

export default function AppointmentCard({
  sessionDate,
  dateToday,
  sessionMode,
  onPress,
}) {
  const [backgroundColor, setBackgroundColor] = useState("");
  const [iconSource, setIconSource] = useState("");
  const [dateText, setDateText] = useState("");
  const [sessionIcon, setSessionIcon] = useState("");

  useEffect(() => {
    const assignStates = () => {
      if (sessionDate >= dateToday) {
        setIconSource(require("../../assets/icons/yellow.png"));
        setBackgroundColor("#EFBC408C");
        setDateText("Upcoming");
      } else {
        setIconSource(require("../../assets/icons/green.png"));
        setBackgroundColor("#018B1F70");
        setDateText("Completed");
      }

      if (sessionMode == "live") {
        setSessionIcon(require("../../assets/icons/meeting.png"));
      } else {
        setSessionIcon(require("../../assets/icons/cam.png"));
      }
    };

    assignStates();
  }, []);

  return (
    <Pressable
      android_ripple={{ color: "#ccc" }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: backgroundColor },
        pressed ? css.buttonPressed : null,
      ]}
      onPress={onPress}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={styles.innerStyle}
        >
          <Image style={styles.imgIcon} source={iconSource} />
          <View style={{ marginLeft: 5 }}>
            <MediumText>{dateText}</MediumText>
            <NormalText>{getLongDate(sessionDate)}</NormalText>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Image style={styles.sessionIcon} source={sessionIcon} />
          <Image
            style={styles.sessionIcon}
            source={require("../../assets/icons/trash.png")}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "96%",
    margin: 5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imgIcon: {
    width: 50,
    height: 50,
  },
  sessionIcon: {
    width: 25,
    height: 25,
  },
  innerStyle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  }
});
