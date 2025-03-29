import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderText from "../../components/ui/HeaderText";
import MediumText from "../../components/ui/MediumText";
import NormalText from "../../components/ui/NormalText";
import CategoryFilterCard from "../../components/cards/CategoryFilterCard";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import AppointmentCard from "../../components/cards/AppointmentCard";
import LineBreak from "../../components/ui/LineBreak";

import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";
import { calculateAge, getTimeInAmPm, getToday } from "../../utils/dateFormat";

export default function AppointmentDetailsScreen({ route, navigation }) {
  const [sessions, setSessions] = useState(route.params.sessions);
  const userName = route.params.sessions[0].user_name;
  const userImage = route.params.sessions[0].user_image;
  const userEmail = route.params.sessions[0].user_email;
  const userPhone = route.params.sessions[0].user_phone;
  const userAge = calculateAge(route.params.sessions[0].user_dob);
  const today = getToday();
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const [futureSessions, setFutureSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  function handlePeriodClick(period) {
    setIsLoading(true);
    setSelectedPeriod(period);
    switch (period) {
      case "all":
        setSessions(route.params.sessions);
        break;

      case "upcoming":
        setSessions(
          sessions.filter((session) => session.session_date >= today)
        );
        break;

      case "today":
        setSessions(
          sessions.filter((session) => session.session_date === today)
        );
        break;

      case "completed":
        setSessions(sessions.filter((session) => session.session_date < today));
        break;

      default:
        break;
    }

    setIsLoading(false);
  }

  const navigateToDetails = (session) => {
    navigation.navigate("SessionDetailsScreen", { session: session });
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <ScrollView>
        <View style={{ flexDirection: "row", }}>
          <View>
            <Image
              source={{
                uri:
                  Paths.IMAGE_URL +
                  (userImage === null ? "default.png" : userImage),
              }}
              resizeMode="cover"
              style={styles.userImage}
            />
          </View>
          <View style={{ marginLeft: 5 }}>
            <MediumText styleProp={{ color: colors.primaryBlue }}>
              {userName}
            </MediumText>
            <NormalText>{userAge}</NormalText>
            <NormalText styleProp={styles.textStyle}>{userEmail}</NormalText>
            <NormalText>{userPhone}</NormalText>
          </View>
        </View>

        <HeaderText styleProp={css.centerText}>Session List</HeaderText>
        <LineBreak />
        <View>
          <ScrollView horizontal>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <CategoryFilterCard
                categoryName={"all"}
                onPress={() => handlePeriodClick("all")}
                isSelected={selectedPeriod === "all"}
              />
              <CategoryFilterCard
                categoryName={"upcoming"}
                onPress={() => handlePeriodClick("upcoming")}
                isSelected={selectedPeriod === "upcoming"}
              />
              <CategoryFilterCard
                categoryName={"today"}
                onPress={() => handlePeriodClick("today")}
                isSelected={selectedPeriod === "today"}
              />
              <CategoryFilterCard
                categoryName={"completed"}
                onPress={() => handlePeriodClick("completed")}
                isSelected={selectedPeriod === "completed"}
              />
            </View>
          </ScrollView>
        </View>
        {isLoading ? (
          <LoadingOverlay message="Loading" />
        ) : (
          <View>
            {sessions.map((session) => (
              <AppointmentCard
                userImage={session.user_image}
                userName={session.user_name}
                sessionDate={session.session_date}
                sessionTime={getTimeInAmPm(session.session_start_time)}
                dateToday={today}
                key={session.session_id}
                sessionMode={session.session_mode}
                onPress={() => navigateToDetails(session)}
                imgIcon={
                  session.session_date >= today
                    ? "../../assets/icons/green.png"
                    : "../../assets/icons/yellow.png"
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  textStyle: {
    textTransform: "none",
  },
});
