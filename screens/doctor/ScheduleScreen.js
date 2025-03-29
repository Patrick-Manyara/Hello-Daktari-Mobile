import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Paths } from "../../utils/paths";
import { css } from "../../assets/styles";

import NotificationBell from "../../components/ui/NotificationBell";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import PrimaryButton from "../../components/ui/PrimaryButton";
import TransparentButton from "../../components/ui/TransparentButton";

export default function ScheduleScreen() {
  const [schedule, setSchedule] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    fetchDoctor();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!doctor) return;

        const baseUrl = Paths.API_URL + "doctor.php";
        const queryParams = `action=fetch_schedule&doctor_id=${doctor.doctor_id}`;
        const fetchUrl = `${baseUrl}?${queryParams}`;

        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (Array.isArray(data.schedule)) {
          setSchedule(data.schedule);
        } else {
          console.log("none");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [doctor]);

  const fetchDoctor = async () => {
    try {
      let u = await AsyncStorage.getItem("token");
      if (u) {
        u = JSON.parse(u);
        setDoctor(u);
      }
    } catch (error) {
      console.error("Fetch doctor error:", error);
    }
  };
  //NAVIGATION
  const navigation = useNavigation();

  function navigateToScreen(screenName) {
    navigation.navigate(screenName, { doctor: doctor });
  }

  function navigateToViewSchedule() {
    navigation.navigate("ViewScheduleScreen", {
      doctor: doctor,
      schedule: schedule,
    });
  }

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        {isFetching ? (
          <LoadingOverlay message="Fetching your data" />
        ) : (
          <View>
            {schedule.length > 0 && (
              <View>
                <PrimaryButton onPress={() => { }}>
                  Edit Current Schedule
                </PrimaryButton>
                <TransparentButton onPress={() => navigateToViewSchedule()}>
                  View Current Schedule
                </TransparentButton>
              </View>
            )}
            <View>
              <PrimaryButton onPress={() => { }}>
                Create New Schedule
              </PrimaryButton>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
