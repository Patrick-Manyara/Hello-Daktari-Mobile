import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import DoctorCard from "../../components/cards/DoctorCard";

import { css } from "../../assets/styles";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

export default function AllDoctorsScreen({ route, navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [sessionData, setSessionData] = useState("");

  useEffect(() => {
    if (route.params && route.params.doctors) {
      setDoctors(route.params.doctors);
      setSessionData(route.params.sessionData);
    }
  }, [route.params]);

  const navigateToDoctorProfile = (doctor) => {
    navigation.navigate("DoctorDetailsScreen", {
      doctor: doctor,
      sessionData: sessionData,
    });
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <HeaderText styleProp={css.centerText}>Our Doctors</HeaderText>
      <ScrollView>
        <View>
          <NormalText>
            Choose a doctors whose rate, location, and working hours align with
            your preferences. Selecting the right doctor ensures that you
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
              <LoadingOverlay message="Fetching" />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
