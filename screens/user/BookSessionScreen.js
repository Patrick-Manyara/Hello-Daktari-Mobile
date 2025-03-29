import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

import { Paths } from "../../utils/paths";
import { css } from "../../assets/styles";

import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import UrgencyCard from "../../components/cards/UrgencyCard";
import VisitOption from "../../components/cards/VisitOption";
import PrimaryButton from "../../components/ui/PrimaryButton";
import RenderOverlay from "../../components/ui/RenderOverlay";

export default function BookSessionScreen({ route, navigation }) {
  const [user, setUser] = useState([]);
  const [hasDoctor, setHasDoctor] = useState(false);

  useEffect(() => {
    if (route.params && route.params.userData) {
      setUser(route.params.userData);
      fetchSpecialties();
      if (route.params.userData.doctor_id != null) {
        setHasDoctor(true);
      }
    }
  }, [route.params]);

  // SPECIALTIES
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const fetchSpecialties = () => {
    const fetchurl = Paths.API_URL + "session.php?action=specialties";
    try {
      fetch(fetchurl)
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          let arr = data.specialties;
          if (Array.isArray(arr)) {
            setSpecialties(data.specialties);
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
  };

  //VISIT TYPE AND CHANNEL
  const [enteredVisitType, setEnteredVisitType] = useState(null);
  const [enteredChannel, setEnteredChannel] = useState("");

  const visitTypes = [
    { name: "home", img: require("../../assets/icons/home.png") },
    { name: "online", img: require("../../assets/icons/camera.png") },
    { name: "physical", img: require("../../assets/icons/hospital.png") },
  ];

  const handleVisitTypeClick = (name) => {
    setEnteredVisitType(name);
  };

  const channels = [
    { name: "audio", img: require("../../assets/icons/wave.png") },
    { name: "video", img: require("../../assets/icons/camera.png") },
    { name: "message", img: require("../../assets/icons/comment.png") },
  ];

  const handleChannelClick = (name) => {
    setEnteredChannel(name);
  };

  //REBOOKING
  const [selectedOption, setSelectedOption] = useState(null);

  const rebookOptions = [
    {
      text: "Find A New Doctor",
      keyProp: "new",
    },
    {
      text: "Rebook With The Same Doctor",
      keyProp: "rebook",
    },
  ];

  function handleRebookOption(keyProp) {
    setSelectedOption(keyProp);
  }

  //SUBMISSION
  const [uploading, setUploading] = useState(false);

  const baseUrl = Paths.API_URL + "session.php";
  let queryParams;
  if (selectedOption === "rebook") {
    queryParams = `action=rebook`;
  } else {
    queryParams = `action=manual`;
  }

  const url = `${baseUrl}?${queryParams}`;

  let submitForm = async () => {
    try {
      if (enteredVisitType != null) {
        setUploading(true);

        const fd = new FormData();
        fd.append("specialty", selectedSpecialty);
        fd.append("visitType", enteredVisitType);
        if (enteredChannel != "") {
          fd.append("channel", enteredChannel);
        }
        fd.append("user_id", user.user_id);

        let res = await fetch(url, {
          method: "POST",
          body: fd,
        });
        if (res.ok) {
          let responseJson = await res.json();
          if (responseJson.type === "new") {
            navigation.navigate("AllDoctorsScreen", {
              doctors: responseJson.doctors,
              sessionData: responseJson.session_data,
            });
          } else if (responseJson.type === "rebook") {
            navigation.navigate("DoctorDetailsScreen", {
              doctor: responseJson.doctor,
              sessionData: responseJson.session_data,
            });
          } else {
            Alert.alert("Error");
          }
        } else {
          console.log("error here");
        }

        setUploading(false);
      } else {
        setUploading(false);
        alert("Please fill all the fields first");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      {isFetching ? (
        <View>
          <Text>Fetching</Text>
        </View>
      ) : (
        <ScrollView>
          <HeaderText styleProp={[css.centerText, { marginVertical: 5 }]}>Consult A Specialist</HeaderText>
          <NormalText>
            Seamlessly schedule both virtual and physical appointments according
            to your convenience.
          </NormalText>

          <View>
            {hasDoctor && (
              <View>
                <NormalText styleProp={{ marginVertical: 5 }}>
                  You already have a doctor registered to your account. Would
                  you like to rebook a session with the same doctor or find a
                  new doctor.
                </NormalText>

                {rebookOptions.map((option, index) => (
                  <UrgencyCard
                    key={index}
                    text={option.text}
                    onPress={() => handleRebookOption(option.keyProp)}
                    isSelected={selectedOption === option.keyProp}
                  />
                ))}
              </View>
            )}

            <View>
              {selectedOption !== "rebook" && (
                <View>
                  {specialties.length > 0 && (
                    <Picker
                      style={[css.disabledContainer, styles.myInput]}
                      selectedValue={selectedSpecialty}
                      itemStyle={{ color: "black" }}
                      onValueChange={(itemValue, itemIndex) => {
                        setSelectedSpecialty(itemValue);
                      }}
                    >
                      <Picker.Item label="Select a specialty" value={null} />
                      {specialties.map((item) => (
                        <Picker.Item
                          key={item.doc_category_id}
                          label={item.doc_category_name}
                          value={item.doc_category_id}
                        />
                      ))}
                    </Picker>
                  )}
                </View>
              )}

              <HeaderText styleProp={css.centerText}>Type of visit</HeaderText>
              <View style={css.optionContainer}>
                {visitTypes.map((visitType, index) => (
                  <VisitOption
                    key={index}
                    style={css.optionColumn}
                    name={visitType.name}
                    img={visitType.img}
                    onPress={() => handleVisitTypeClick(visitType.name)}
                    isSelected={enteredVisitType === visitType.name}
                  />
                ))}
              </View>

              {enteredVisitType === "online" && (
                <View>
                  <HeaderText styleProp={css.centerText}>Channel</HeaderText>

                  <View style={css.optionContainer}>
                    {channels.map((channel, index) => (
                      <VisitOption
                        key={index}
                        style={css.optionColumn}
                        name={channel.name}
                        img={channel.img}
                        onPress={() => handleChannelClick(channel.name)}
                        isSelected={enteredChannel === channel.name}
                      />
                    ))}
                  </View>
                </View>
              )}

              <PrimaryButton onPress={submitForm}>Proceed</PrimaryButton>
            </View>
          </View>
        </ScrollView>
      )}
      {uploading && <RenderOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  myInput: {
    height: 50,
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 8,
    marginVertical: 2,
    color: "black",
  },
});
