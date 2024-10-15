import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import ScheduleCard from "../../components/cards/ScheduleCard";

import { Paths } from "../../utils/paths";
import { colors, css } from "../../assets/styles";

export default function SpecialistDetailsScreen({ navigation, route }) {
  const [doctor, setDoctor] = useState({});
  const [sessionData, setSessionData] = useState([]);

  const [days, setDays] = useState();
  const [timesArray, setTimesArray] = useState([]);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const [activeTab, setActiveTab] = useState("profile");

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  const [isFetching, setIsFetching] = useState(true);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (route.params && route.params.doctor) {
      setDoctor(route.params.doctor);
      setSessionData(route.params.sessionData);
      fetchDays(route.params.doctor.doctor_id);
    }
  }, [route.params]);

  const renderProfileContent = () => (
    <View style={{ width: "100%" }}>
      <HeaderText styleProp={styles.titleStyle}>
        {doctor.doctor_name}
      </HeaderText>
      <NormalText styleProp={styles.subTitleStyle}>
        {doctor.doctor_qualifications}
      </NormalText>
      <NormalText styleProp={styles.subTitleStyle}>
        Years of Experience: {doctor.doctor_experience} Years
      </NormalText>

      <View style={styles.ratingArea}>
        <Image source={require("../../assets/icons/star.png")} />
        <NormalText>4.5</NormalText>
      </View>
    </View>
  );

  const renderScheduleContent = () => (
    <View>
      <NormalText>Days</NormalText>
      {days && (
        <ScrollView horizontal>
          <View style={{ flexDirection: "row" }}>
            {days.map((day, index) => (
              <ScheduleCard
                isSelected={selectedDay === day.day}
                key={index}
                day={day}
                onPress={() => handleDayClick(day.day)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      <NormalText>Time</NormalText>
      {timesArray.length > 0 ? (
        <ScrollView horizontal>
          <View style={{ flexDirection: "row" }}>
            {timesArray.map((time, index) => (
              <ScheduleCard
                isSelected={selectedTime === time.start_time}
                key={index}
                day={time}
                isTime={true}
                onPress={() => handleTimeClick(time)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <NormalText>No Data To Load</NormalText>
      )}
    </View>
  );

  //SCHEDULE

  function handleDayClick(dayName) {
    setSelectedDay(dayName);
    const selectedDay = days.find((item) => item.day === dayName);

    if (selectedDay) {
      setSelectedDate(selectedDay.date);
      setTimesArray(Object.values(selectedDay.times));
      setSelectedTime("");
    } else {
      console.log("Day not found");
    }
  }

  function handleTimeClick(time) {
    setSelectedTime(time.start_time);
    setSelectedEndTime(time.end_time);
  }

  //fetching

  function fetchDays(doctorId) {
    const baseUrl = Paths.API_URL + "doctor.php";
    const queryParams = `action=fetch_schedule&doctor_id=${doctorId}`;
    const fetchUrl = `${baseUrl}?${queryParams}`;
    try {
      fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          let arr = data.schedule;
          if (Array.isArray(arr)) {
            setDays(data.schedule);
          } else {
            console.log("No specialties");
          }
        })
        .catch((error) => {
          setIsFetching(false);
          console.error("Fetch error:", error);
        });
    } catch (error) {
      setIsFetching(false);
      console.error("Request setup error:", error);
    }
  }

  function navigateToScreen(screenName) {
    navigation.navigate(screenName);
  }

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />

      {isFetching ? (
        <View>
          <NormalText>Fetching</NormalText>
        </View>
      ) : (
        <View>
          {sessionData.session_consultation == "general" && (
            <View>
              <NormalText>The system has found this doctor for you.</NormalText>
            </View>
          )}
          <View style={styles.innerView}>
            <HeaderText>Specialists Profiles</HeaderText>

            <Image
              style={styles.imageStyle}
              source={{
                uri: Paths.IMAGE_URL + doctor.doctor_image,
              }}
            />
            <View>
              <View style={styles.tabBar}>
                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,

                    borderBottomWidth: activeTab === "profile" ? 2 : 0,
                    borderBottomColor:
                      activeTab === "profile" ? colors.primaryBlue : "black",
                  }}
                  onPress={() => setActiveTab("profile")}
                >
                  <NormalText
                    boldProp={activeTab === "profile" ? true : false}
                    styleProp={{
                      color:
                        activeTab === "profile" ? colors.primaryBlue : "black",
                    }}
                  >
                    Profile
                  </NormalText>
                </Pressable>

                <Pressable
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontWeight: activeTab === "schedule" ? "bold" : "normal",
                    borderBottomWidth: activeTab === "schedule" ? 2 : 0,
                    borderBottomColor:
                      activeTab === "schedule" ? colors.primaryBlue : "black",
                  }}
                  onPress={() => setActiveTab("schedule")}
                >
                  <NormalText
                    boldProp={activeTab === "schedule" ? true : false}
                    styleProp={{
                      color:
                        activeTab === "schedule" ? colors.primaryBlue : "black",
                    }}
                  >
                    Schedule
                  </NormalText>
                </Pressable>
              </View>

              {/* Content based on active tab */}
              <View style={styles.tabContentStyle}>
                {activeTab === "profile"
                  ? renderProfileContent()
                  : renderScheduleContent()}

                <View>
                  <PrimaryButton
                    onPress={() => navigateToScreen("ReferralSuccessScreen")}
                  >
                    Proceed
                  </PrimaryButton>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    textAlign: "center",
  },
  subTitle: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  ratingArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  innerView: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    padding: 5,
  },
  imageStyle: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
  tab: {
    padding: 10,
  },
  tabContentStyle: {
    flex: 2,
    width: "100%",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
