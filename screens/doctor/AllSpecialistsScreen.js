import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import DoctorCard from "../../components/cards/DoctorCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

import { css } from "../../assets/styles";
import { Paths } from "../../utils/paths";

export default function AllSpecialistsScreen({ navigation, route }) {
  const [doctors, setDoctors] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [doctor, setDoctor] = useState([]);
  const [sessionData, setSessionData] = useState("");

  useEffect(() => {
    if (route.params && route.params.sessionData) {
      setSessionData(route.params.sessionData);
    }
  }, [route.params]);

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

  const fetchDoctors = async () => {
    setIsFetching(true);
    const fetchUrl = Paths.API_URL + "doctor.php";
    const queryParameters = `action=all_docs&doctor_id=${doctor.doctor_id}`;
    const lien = `${fetchUrl}?${queryParameters}`;

    try {
      const response = await fetch(lien);
      const data = await response.json();

      if (data.data === true) {
        setDoctors(data.doctors);
        setIsFetching(false);
      } else {
        setIsFetching(false);
      }
    } catch (error) {
      setIsFetching(false);
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const navigateToDoctorProfile = (doctor) => {
    navigation.navigate("SpecialistDetailsScreen", {
      doctor: doctor,
      sessionData: sessionData,
    });
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <HeaderText>Doctors</HeaderText>
      {isFetching ? (
        <LoadingOverlay message="Fetching" />
      ) : (
        <ScrollView>
          <View>
            <NormalText>
              Choose a doctors whose rate, location, and working hours align
              with your preferences. Selecting the right doctor ensures that you
              receive care on your terms, making your healthcare experience as
              convenient and comfortable as possible.
            </NormalText>
          </View>
          <View style={css.viewCard}>
            <View style={css.flexContainer}>
              {doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <DoctorCard
                    doctor={doctor}
                    key={doctor.doctor_id} 
                    rating="4.5"
                    onPress={() => navigateToDoctorProfile(doctor)}
                  />
                ))
              ) : (
                <View>
                  <NormalText>No doctors</NormalText>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
