import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  ToastAndroid,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import DisabledInput from "../../components/forms/DisabledInput";
import UploadInput from "../../components/forms/UploadInput";
import RenderOverlay from "../../components/ui/RenderOverlay";
import NotificationBell from "../../components/ui/NotificationBell";
import InputHybrid from "../../components/forms/InputHybrid";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MediumText from "../../components/ui/MediumText";

import { css } from "../../assets/styles";
import { Paths } from "../../utils/paths";


export default function EditProfileScreen({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  //uploads
  const [enteredImage, setEnteredImage] = useState("");

  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // Update inputs state whenever doctor data changes
    setInputs((prevInputs) => ({
      ...prevInputs,
      user_phone: { value: user.user_phone, isValid: true },
      user_bio: { value: user.user_bio, isValid: true },
      user_blood_group: { value: user.user_blood_group, isValid: true },
      user_height: { value: user.user_height, isValid: true },
      user_weight: { value: user.user_weight, isValid: true },
      user_dob: { value: user.user_dob, isValid: true },
    }));
  }, [user]);

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  const [inputs, setInputs] = useState({
    user_phone: { value: "", isValid: true },
    user_bio: { value: "", isValid: true },
    user_blood_group: { value: "", isValid: true },
    user_height: { value: "", isValid: true },
    user_weight: { value: "", isValid: true },
    user_dob: { value: "", isValid: true },
  });

  function updateInputValueHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  const [selectedDate, setSelectedDate] = useState(() => {
    return user.user_dob ? new Date(user.user_dob) : new Date();
  });

  useEffect(() => {
    if (user.user_dob) {
      const dobDate = new Date(user.user_dob);
      if (!isNaN(dobDate)) {
        setSelectedDate(dobDate);
      }
    }
  }, [user.user_dob]);

  //DATES

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);



  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
 
  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setSelectedDate(date); // Update selected date
    updateInputValueHandler("user_dob", date.toISOString().split("T")[0]); // Update user_dob in YYYY-MM-DD format
    hideDatePicker();
  };

  //FILE UPLOADS

  const selectFile = async () => {
    let r = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });
    if (r.canceled == false) {
      setEnteredImage(r);
      ToastAndroid.show("Image loaded", ToastAndroid.SHORT);
    }
  };

  const NAME = () => {
    if (enteredImage == null) {
      return <NormalText></NormalText>;
    } else {
      return <NormalText>{enteredImage.assets[0].name}</NormalText>;
    }
  };

  const baseUrl = Paths.API_URL + "profile.php";

  const submitProfileData = async () => {
    setIsSubmitting(true);

    const queryParams = `action=update`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();

    const fileToUpload = enteredImage;
    formData.append("user_phone", inputs.user_phone.value);
    formData.append("user_bio", inputs.user_bio.value);
    // formData.append("user_dob", inputs.user_dob.value);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    formData.append("user_dob", formattedDate);

    formData.append("user_height", inputs.user_height.value);
    formData.append("user_weight", inputs.user_weight.value);

    formData.append("user_blood_group", inputs.user_blood_group.value);

    formData.append("user_id", user.user_id);
    if (enteredImage != "") {
      formData.append("user_image", {
        type: "image/*",
        uri: enteredImage.assets[0].uri,
        name: enteredImage.assets[0].name,
      });
    }
    console.log(formData)
    try {
      fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          newtoken = JSON.stringify(data.token);
          AsyncStorage.setItem("token", newtoken);
          setIsSubmitting(false);
          navigation.navigate("MyProfileScreen", { newtoken: data.token });
        })
        .catch((error) => {
          setIsSubmitting(false);
          console.error("Fetch error:", error);
        });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Request setup error:", error);
    }
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <HeaderText styleProp={css.centerText}>Edit Your Profile</HeaderText>
        <View>
          <UploadInput placeholder="Upload A New Image" onPress={selectFile} />
          {enteredImage && (
            <NAME />
          )}

          <DisabledInput placeholder="Your Name" inputText={user.user_name} />
          <DisabledInput
            placeholder="Email Address"
            inputText={user.user_email}
          />
          <DisabledInput
            placeholder="Your ID/Passport Number"
            inputText={user.user_passport}
          />

          <InputHybrid
            placeholder="Your Phone Number"
            onChangeText={(value) =>
              updateInputValueHandler("user_phone", value)
            }
            value={inputs.user_phone.value}
            isInvalid={false}
          />

          <Pressable onPress={showDatePicker} style={[css.disabledContainer, { flexDirection: "row", paddingVertical: 10, justifyContent: "space-between" }]} >
            <NormalText>Choose Your Date Of Birth</NormalText>
            <Image style={{ width: 20, height: 20, objectFit: "contain", }} source={require('../../assets/icons/date.png')} />
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MediumText>Your saved Date of Birth is: </MediumText>
            <NormalText>{selectedDate.toDateString()}</NormalText>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <InputHybrid
            placeholder="Your Blood Group"
            onChangeText={(value) =>
              updateInputValueHandler("user_blood_group", value)
            }
            value={inputs.user_blood_group.value}
            isInvalid={false}

          />

          <InputHybrid
            placeholder="Your Height"
            onChangeText={(value) =>
              updateInputValueHandler("user_height", value)
            }
            value={inputs.user_height.value}
            isInvalid={false}
          />

          <InputHybrid
            placeholder="Your Weight in Kg"
            onChangeText={(value) =>
              updateInputValueHandler("user_weight", value)
            }
            value={inputs.user_weight.value}
            isInvalid={false}
            keyboardType="numeric"
          />

          <PrimaryButton onPress={submitProfileData}>
            Edit Profile
          </PrimaryButton>
        </View>
        {isSubmitting && <RenderOverlay />}
      </ScrollView>
    </SafeAreaView>
  );
}
