import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Alert,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

import { Paths } from "../../utils/paths";
import { css } from "../../assets/styles";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import VisitOption from "../../components/cards/VisitOption";
import PrimaryButton from "../../components/ui/PrimaryButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RenderOverlay from "../../components/ui/RenderOverlay";
import MediumText from "../../components/ui/MediumText";
import LoadingOverlay from "../../components/ui/LoadingOverlay";


export default function BookAvailableScreen({ route, navigation }) {
  const [user, setUser] = useState([]);
  const [hasDoctor, setHasDoctor] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setSelectedDate(date);
    hideDatePicker();
  };

  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    if (route.params && route.params.userData) {
      setUser(route.params.userData);
      if (route.params.userData.doctor_id != null) {
        setHasDoctor(true);
      }
    }
    setIsFetching(false);
  }, [route.params]);

  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  const timeRangeOptions = [];
  for (let i = 8; i <= 20; i += 2) {
    const startTime = i.toString().padStart(2, "0") + ":00";
    const endTime = `${i + 2}:00`;
    const label = `${startTime} - ${endTime}`;
    timeRangeOptions.push({ label, value: i });
  }

  //VISIT TYPE AND CHANNEL
  const [enteredChannel, setEnteredChannel] = useState("");

  const channels = [
    { name: "audio", img: require("../../assets/icons/wave.png") },
    { name: "video", img: require("../../assets/icons/camera.png") },
    { name: "message", img: require("../../assets/icons/comment.png") },
  ];

  const handleChannelClick = (name) => {
    setEnteredChannel(name);
  };

  //SUBMISSION

  const [uploading, setUploading] = useState(false);

  const baseUrl = Paths.API_URL + "session.php";
  const queryParams = `action=auto`;

  const url = `${baseUrl}?${queryParams}`;

  let submitForm = async () => {
    try {
      if (enteredChannel != null) {
        setUploading(true);

        const data = new FormData();
        const formattedDate = selectedDate.toISOString().split("T")[0];

        data.append("date", formattedDate);
        data.append("time", selectedTimeRange);

        data.append("channel", enteredChannel);

        data.append("user_id", user.user_id);

        let res = await fetch(url, {
          method: "POST",
          body: data,
        });
        if (res.ok) {
          let responseJson = await res.json();
          if (responseJson.data === true) {
            navigation.navigate("DoctorDetailsScreen", {
              doctor: responseJson.doctor,
              sessionData: responseJson.session_data,
            });
          } else {
            Alert.alert(responseJson.message);
            console.log(responseJson);
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
      <NotificationBell />
      {isFetching ? (
        <LoadingOverlay />
      ) : (
        <ScrollView>

          <HeaderText styleProp={[css.centerText, { marginVertical: 5 }]}>Consult A Specialist</HeaderText>

          <Pressable onPress={showDatePicker} style={[css.disabledContainer, { flexDirection: "row", paddingVertical: 10, justifyContent: "space-between" }]} >
            <NormalText>Choose Date</NormalText>
            <Image style={{ width: 20, height: 20, objectFit: "contain", }} source={require('../../assets/icons/date.png')} />
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MediumText>Currently Selected: </MediumText>
            <NormalText>{selectedDate.toDateString()}</NormalText>
          </View>


          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <Picker
            style={[css.disabledContainer, css.customInput]}
            selectedValue={selectedTimeRange}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedTimeRange(itemValue);
            }}
          >
            <Picker.Item label="Pick a Time Slot" value={null} />
            {timeRangeOptions.map((item) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.label}
              />
            ))}
          </Picker>

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

          {enteredChannel && (
            <PrimaryButton onPress={submitForm}>Proceed</PrimaryButton>
          )}
        </ScrollView>
      )}
      {uploading && <RenderOverlay />}
    </SafeAreaView>
  );
}
