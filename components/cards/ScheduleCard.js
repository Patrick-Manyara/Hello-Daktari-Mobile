import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import NormalText from "../ui/NormalText";

import { colors } from "../../assets/styles";

export default function ScheduleCard({ day, isSelected, onPress, isTime }) {
  let myDay = "";
  let myTime = "";
  if (isTime) {
    myDay = day.start_time;
    myTime = day.end_time;
  } else {
    myDay = day.day;
    myTime = day.date;
  }

  return (
    <Pressable style={{ width: 90 }} onPress={onPress}>
      <View
        style={[
          styles.timeSlot,
          {
            backgroundColor: isSelected
              ? colors.primaryBlue
              : colors.whiteSmoke,
          },
        ]}
      >
        <NormalText
          styleProp={[
            styles.textStyle,
            {
              color: isSelected ? "white" : colors.textColor,
            },
          ]}
        >
          {myDay}
        </NormalText>

        {isTime && (
          <NormalText
            styleProp={[
              styles.textStyle,
              {
                color: isSelected ? "white" : colors.textColor,
              },
            ]}
          >
            to
          </NormalText>
        )}

        <NormalText
          styleProp={[
            styles.textStyle,
            {
              color: isSelected ? "white" : colors.textColor,
            },
          ]}
        >
          {myTime}
        </NormalText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  timeSlot: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.whiteSmoke,
    flexDirection: "column",
    width: "95%",
    height: 50,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 10,
    color: "black",
  },
});
