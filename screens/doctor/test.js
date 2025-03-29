import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";

import PrimaryButton from "../../components/ui/PrimaryButton";
import NormalText from "../../components/ui/NormalText";
import SessionHistoryCard from "../../components/cards/SessionHistoryCard";
import NextSessionCard from "../../components/cards/NextSessionCard";
import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import MediumText from "../../components/ui/MediumText";

export default function DoctorHomeScreen() {
  const [doctor, setDoctor] = useState([]);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setDoctor(u);
    }
  };

  const dateToday = new Date();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateToday);

  const today = new Date().toISOString().split("T")[0];

  //SESSIONS
  const [isFetching, setIsFetching] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [futureSessions, setFutureSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [userSessions, setUserSessions] = useState([]);

  const fetchSessions = async () => {
    setIsFetching(true);
    const fetchurl = Paths.API_URL + "session.php";
    const queryParams = `action=docall&doctor_id=${doctor.doctor_id}`;
    const url = `${fetchurl}?${queryParams}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data.sessions)) {
        setSessions(data.sessions);

        const future = data.sessions.filter(
          (session) => session.session_date >= today
        );
        const past = data.sessions.filter(
          (session) => session.session_date <= today
        );
        const todaySess = data.sessions.filter(
          (session) => session.session_date == today
        );
        setFutureSessions(future);
        setPastSessions(past);
        setTodaySessions(todaySess);
        setIsFetching(false);
      } else {
        console.log("No sessions");
        setIsFetching(false);
      }
    } catch (error) {
      setIsFetching(false);
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [doctor]);

  const navigation = useNavigation();

  const navigateToDetails = (session) => {
    navigation.navigate("SessionDetailsScreen", { session: session });
  };

  const navigateToAppointment = (item) => {
    const userSess = sessions.filter(
      (session) => session.client_id === item.client_id
    );
    navigation.navigate("AppointmentDetailsScreen", {
      sessions: userSess,
    });
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <HeaderText styleProp={{ fontSize: 16 }}>
          Welcome {doctor.doctor_name}.
        </HeaderText>

        <ImageBackground
          source={require("../../assets/images/bluebg.png")}
          style={styles.backgroundImage}
        >
          <View style={{ padding: 10, borderRadius: 20 }}>
            <NormalText boldProp={true} styleProp={styles.bannerText}>
              {formattedDate}
            </NormalText>

            {todaySessions.length > 0 ? (
              <NormalText styleProp={styles.subText}>
                You have {todaySessions.length} sessions today
              </NormalText>
            ) : (
              <NormalText styleProp={styles.subText}>
                You do not have a session today. Check your activity log below
                for more details.
              </NormalText>
            )}
          </View>
        </ImageBackground>

        {isFetching ? (
          <LoadingOverlay message="Fetching your session history" />
        ) : sessions.length > 0 ? (
          <View>
            {pastSessions.length <= 0 ? (
              <View>
                <NormalText>No sessions found</NormalText>
                <PrimaryButton onPress={fetchSessions}>
                  Reload Data
                </PrimaryButton>
              </View>
            ) : (
              <View>
                <MediumText
                  styleProp={{ color: colors.primaryBlue, marginVertical: 5 }}
                >
                  Today and Upcoming Appointment(s)
                </MediumText>

                {futureSessions.length > 0 && (
                  <ScrollView horizontal={true}>
                    {futureSessions.map((item, index) => {
                      return (
                        <NextSessionCard
                          session={item}
                          key={index}
                          isToday={item.session_date === today ? true : false}
                          onPress={() =>
                            item.session_date === today
                              ? navigateToDetails(item)
                              : navigateToAppointment(item)
                          }
                        />
                      );
                    })}
                  </ScrollView>
                )}

                <View>
                  <MediumText
                    styleProp={{ color: colors.primaryBlue, marginVertical: 5 }}
                  >
                    Past Appointment(s)
                  </MediumText>
                </View>

                {pastSessions.length > 0 && (
                  <View>
                    {pastSessions.map((item, index) => (
                      <SessionHistoryCard
                        session={item}
                        userImg={item.user_image}
                        userName={item.user_name}
                        isToday={item.session_date === today ? true : false}
                        key={index}
                        onPress={() => navigateToAppointment(item)}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <View>
            <NormalText>No Sessions Found</NormalText>
            <PrimaryButton onPress={fetchSessions}>Try Again</PrimaryButton>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: 100,
    resizeMode: "cover",
    borderRadius: 20,
    marginTop: 10,
  },
  bannerText: {
    color: "white",
    fontSize: 16,
  },
  subText: {
    color: "white",
    fontSize: 12,
  },
  cardContainer: {
    flexDirection: "row",
    padding: 10,
  },
  card: {
    backgroundColor: '#E8F5FA',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});
