import React, { useState, useEffect, useContext } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import PatientListCard from "../../components/cards/PatientListCard";

import { Paths } from "../../utils/paths";
import { css } from "../../assets/styles";

export default function StartNewChat({ route, navigation }) {
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

  const [chats, setChats] = useState({});

  useEffect(() => {
    if (route.params && route.params.chats) {
      setChats(route.params.chats);
    }
  }, [route.params]);

  //SESSIONS
  const [isFetching, setIsFetching] = useState(true);
  const [patients, setPatients] = useState([]);

  const fetchPatients = () => {
    if (!doctor) return; 

    setIsFetching(true);
    const fetchurl = Paths.API_URL + "doctor.php";
    const queryParams = `action=patients&doctor_id=${doctor.doctor_id}`;
    const url = `${fetchurl}?${queryParams}`;
    // console.log(url);
    try {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);

          if (chats.length > 0) {
            // Filter patients based on whether their user_id is found in chats array
            const filteredPatients = data.patients.filter((patient) =>
              chats.some((chat) => chat.user.user_id !== patient.user_id)
            );

            setPatients(filteredPatients);
          } else {
            setPatients(data.patients);
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
  };

  useEffect(() => {
    fetchPatients();
  }, [doctor]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPatients();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <PatientListCard
      onPress={() => {
        navigation.navigate("DocAddChatRoom", { user: item });
      }}
      patient={item}
    />
  );
  return (
    <SafeAreaView style={css.safeAreaView}>
      {isFetching ? (
        <LoadingOverlay message="Fetching your client list" />
      ) : (
        <View>
          <HeaderText styleProp={css.centerText}>Your Patients</HeaderText>
          <NormalText styleProp={css.centerText}>Click any of the below clients to start a chat</NormalText>
          <FlatList
            data={patients}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
