import React, {  useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NormalText from "../../components/ui/NormalText";
import LineBreak from "../../components/ui/LineBreak";

import { css } from "../../assets/styles";
import { getLongDate } from "../../utils/dateFormat";

const sortByDay = (a, b) => {
  const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
};

const sortByStartTime = (a, b) => {
  return a.start_time.localeCompare(b.start_time);
};
export default function ViewScheduleScreen({ route, navigation }) {
  const [doctor, setDoctor] = useState([]);
  useEffect(() => {
    if (route.params && route.params.doctor) {
      setDoctor(route.params.doctor);
    }
  }, [route.params]);

  const scheduleData = route.params.schedule;
  const sortedSchedule = scheduleData.sort(sortByDay);

  return (
    <SafeAreaView style={css.safeAreaView}>
      <ScrollView>
        {sortedSchedule.map((daySchedule) => (
          <View style={css.card} key={daySchedule.date}>
            <NormalText>
              {daySchedule.day} - Next: {getLongDate(daySchedule.date)}
            </NormalText>
            {/* <Divider colorProp={Colors.lightBlue} /> */}
            <LineBreak />
            {daySchedule.times.sort(sortByStartTime).map((timeSlot) => (
              <NormalText key={`${timeSlot.start_time}-${timeSlot.end_time}`}>
                {`${timeSlot.start_time} - ${timeSlot.end_time}`}
              </NormalText>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
