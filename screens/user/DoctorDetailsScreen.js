import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { Paths } from "../../utils/paths";

import { colors, css } from "../../assets/styles";
import ScheduleCard from "../../components/cards/ScheduleCard";
import RenderOverlay from "../../components/ui/RenderOverlay";
import getImageUri from "../../utils/imageHelper";
import { getDayMonthAndYear, getTimeInAmPm } from "../../utils/dateFormat";

export default function DoctorDetailsScreen({ route, navigation }) {
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
    <View>
      <HeaderText styleProp={styles.titleStyle}>{doctor.doctor_name}</HeaderText>
      <NormalText styleProp={styles.subTitle}>
        {doctor.doctor_qualifications}
      </NormalText>
      <NormalText styleProp={styles.subTitle}>
        Years of Experience: 12 Years
      </NormalText>

      <View style={styles.ratingArea}>
        <Image source={require("../../assets/icons/star.png")} />
        <NormalText>4.5</NormalText>
      </View>

      {
        sessionData.session_date && (
          <View>
            <NormalText styleProp={css.centerText}>{getDayMonthAndYear(sessionData.session_date)}</NormalText>
            <NormalText styleProp={css.centerText}>At {getTimeInAmPm(sessionData.session_start_time)}</NormalText>
          </View>
        )
      }

      <PrimaryButton styleProp={styles.proceedBtn} onPress={() =>
        sessionData.session_date
          ? submitForm()
          : setActiveTab("schedule")
      } >
        Proceed
      </PrimaryButton>
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

      {selectedDate && selectedEndTime && (
        <PrimaryButton onPress={submitForm}>Proceed</PrimaryButton>
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

  //GET DAYS
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

  //SUBMISSION
  let inputsAreValid;

  let submitForm = async () => {

    if (sessionData.session_date) {
      inputsAreValid = true;
    } else {
      inputsAreValid = selectedDate != null && selectedTime != null && selectedEndTime != null;
    }

    if (inputsAreValid) {
      setUploading(true);

      const data = new FormData();

      if (!sessionData.session_date) {
        data.append("date", selectedDate);
        data.append("preset", false);
        data.append("start_time", selectedTime);
        data.append("end_time", selectedEndTime);
      } else {
        data.append("preset", true);
      }


      data.append("doctor", doctor.doctor_id);
      data.append("session", sessionData.session_id);
      data.append("channel", sessionData.session_channel);

      console.log(data);

      let res = await fetch(Paths.API_URL + "session.php?action=update", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      });

      let responseJson = await res.json();
      if (responseJson.data == true) {
        if (responseJson.vt == "home") {
          navigation.navigate("AddressScreen", {
            doctor: doctor,
            sessionData: responseJson.session_data,
          });
        } else {
          navigation.navigate("PaymentScreen", {
            doctor: doctor,
            sessionData: responseJson.session_data,
          });
        }
      }

      setUploading(false);
    } else {
      alert("Please fill all the fields firsts");
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <HeaderText styleProp={[css.centerText, { marginVertical: 5 }]}>Specialist Profile</HeaderText>
      {isFetching ? (
        <View>
          <NormalText>Fetching</NormalText>
        </View>
      ) : (
        <View>
          {sessionData.session_consultation == "general" && (
            <View>
              <NormalText>
                The system has found this doctor for you.
              </NormalText>
            </View>
          )}
          <View style={styles.innerView}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: getImageUri(Paths.IMAGE_URL, doctor.doctor_image),
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
                        activeTab === "profile"
                          ? colors.primaryBlue
                          : "black",
                    }}
                  >
                    Profile
                  </NormalText>
                </Pressable>

                {
                  !sessionData.session_date && (
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
                            activeTab === "schedule"
                              ? colors.primaryBlue
                              : "black",
                        }}
                      >
                        Schedule
                      </NormalText>
                    </Pressable>
                  )
                }
              </View>




              <View style={styles.contentArea}>
                {activeTab === "profile"
                  ? renderProfileContent()
                  : renderScheduleContent()}
              </View>

            </View>
          </View>
        </View>
      )}

      {uploading && <RenderOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
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
    alignItems: "center",
    marginTop: 10,
    padding: 5,
  },
  imageStyle: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "blue", // Color of the active tab indicator
  },
  contentArea: {
    flex: 2,
  },
  proceedBtn: {
    backgroundColor: colors.turqouise
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
});
