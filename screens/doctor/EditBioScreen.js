import React, { useState, useEffect } from "react";
import {
  StyleSheet,
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
import TextAreaInput from "../../components/forms/TextAreaInput";

import { css } from "../../assets/styles";
import { Paths } from "../../utils/paths";

export default function EditBioScreen({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  //uploads
  const [enteredImage, setEnteredImage] = useState("");
  const [enteredImageName, setEnteredImageName] = useState("");

  const [doctor, setDoctor] = useState([]);

  useEffect(() => {
    fetchDoctor();
  }, []);

  useEffect(() => {
    // Update inputs state whenever doctor data changes
    setInputs((prevInputs) => ({
      ...prevInputs,
      doctor_name: { value: doctor.doctor_name, isValid: true },
      doctor_phone: { value: doctor.doctor_phone, isValid: true },
      doctor_passport: { value: doctor.doctor_passport, isValid: true },
      doctor_bio: { value: doctor.doctor_bio, isValid: true },
      doctor_statement: { value: doctor.doctor_statement, isValid: true },
      doctor_rate: { value: doctor.doctor_rate, isValid: true },
      doctor_qualifications: {
        value: doctor.doctor_qualifications,
        isValid: true,
      },
      doctor_experience: { value: doctor.doctor_experience, isValid: true },
      doctor_location: { value: doctor.doctor_location, isValid: true },
      doctor_license: { value: doctor.doctor_license, isValid: true },
      doctor_dob: { value: doctor.doctor_dob, isValid: true },
    }));
  }, [doctor]);

  const fetchDoctor = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setDoctor(u);
    }
  };

  const [inputs, setInputs] = useState({
    doctor_name: { value: "", isValid: true },
    doctor_phone: { value: "", isValid: true },
    doctor_passport: { value: "", isValid: true },
    doctor_bio: { value: "", isValid: true },
    doctor_statement: { value: "", isValid: true },
    doctor_rate: { value: "", isValid: true },
    doctor_qualifications: { value: "", isValid: true },
    doctor_experience: { value: "", isValid: true },
    doctor_location: { value: "", isValid: true },
    doctor_license: { value: "", isValid: true },
    doctor_dob: { value: "", isValid: true },
  });

  function updateInputValueHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  //DATES
  const [selectedDate, setSelectedDate] = useState(() => {
    return doctor.doctor_dob ? new Date(doctor.doctor_dob) : new Date();
  });

  useEffect(() => {
    if (doctor.doctor_dob) {
      const dobDate = new Date(doctor.doctor_dob);
      if (!isNaN(dobDate)) {
        setSelectedDate(dobDate);
      }
    }
  }, [doctor.doctor_dob]);

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
    updateInputValueHandler("doctor_dob", date.toISOString().split("T")[0]); // Update doctor_dob in YYYY-MM-DD format
    hideDatePicker();
  };

  //FILE UPLOADS

  const selectFile = async () => {
    let r = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });
    if (r.canceled == false) {
      setEnteredImage(r);
      setEnteredImageName(r.name);
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

  const baseUrl = Paths.API_URL + "doctor.php";

  const submitProfileData = async () => {
    setIsSubmitting(true);

    const queryParams = `action=update`;
    const url = `${baseUrl}?${queryParams}`;
    const formData = new FormData();

    const fileToUpload = enteredImage;
    formData.append("doctor_name", inputs.doctor_name.value);
    formData.append("doctor_phone", inputs.doctor_phone.value);
    formData.append("doctor_passport", inputs.doctor_passport.value);
    formData.append("doctor_bio", inputs.doctor_bio.value);

    const formattedDate = selectedDate.toISOString().split("T")[0];
    formData.append("doctor_dob", formattedDate);

    formData.append("doctor_location", inputs.doctor_location.value);
    formData.append("doctor_license", inputs.doctor_license.value);
    formData.append("doctor_rate", inputs.doctor_rate.value);
    formData.append("doctor_experience", inputs.doctor_experience.value);
    formData.append("doctor_statement", inputs.doctor_statement.value);
    formData.append(
      "doctor_qualifications",
      inputs.doctor_qualifications.value
    );

    formData.append("doctor_id", doctor.doctor_id);
    if (enteredImage != "") {
      formData.append("doctor_image", {
        type: "image/*",
        uri: enteredImage.assets[0].uri,
        name: enteredImage.assets[0].name,
      });
    }
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
          navigation.navigate("MyBioScreen", { newtoken: data.token });
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

          <DisabledInput
            placeholder="Your Name"
            inputText={doctor.doctor_name}
          />
          <DisabledInput
            placeholder="Email Address"
            inputText={doctor.doctor_email}
          />
          <DisabledInput
            placeholder="Your ID/Passport Number"
            inputText={doctor.doctor_passport}
          />

          <InputHybrid
            placeholder="Enter Your Phone Number Here..."
            onChangeText={(value) =>
              updateInputValueHandler("doctor_phone", value)
            }
            value={inputs.doctor_phone.value}
            isInvalid={false}
            label="Your Phone Number"
          />

          <Pressable onPress={showDatePicker} style={[css.disabledContainer, styles.datePickStyle]} >
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

          <TextAreaInput
            placeholder="Your Bio"
            onChangeText={(value) =>
              updateInputValueHandler("doctor_bio", value)
            }
            value={inputs.doctor_bio.value}
            isInvalid={false}
            label="Your Bio"

            numberOfLines={6} />



          <TextAreaInput
            placeholder="Your Qualification"
            onChangeText={(value) =>
              updateInputValueHandler("doctor_qualifications", value)
            }
            value={inputs.doctor_qualifications.value}
            isInvalid={false}
            numberOfLines={6}
            label="Your Qualifications"
          />

          <TextAreaInput
            placeholder="Your Statement"
            onChangeText={(value) =>
              updateInputValueHandler("doctor_statement", value)
            }
            value={inputs.doctor_statement.value}
            isInvalid={false}
            numberOfLines={6}
            label="Your Statement"
          />

          <InputHybrid
            placeholder="Your Hourly Rates"
            onChangeText={(value) =>
              updateInputValueHandler("doctor_rate", value)
            }
            value={inputs.doctor_rate.value}
            isInvalid={false}
            keyboardType="numeric"
            label="Your Hourly Rates"

          />

          <InputHybrid
            placeholder="Your Years of Experience"
            onChangeText={(value) =>
              updateInputValueHandler("doctor_experience", value)
            }
            value={inputs.doctor_experience.value}
            isInvalid={false}
            keyboardType="numeric"
            label="Your Years of Experience"
          />

          <InputHybrid
            placeholder="Your Location"
            onChangeText={(value) =>
              updateInputValueHandler("doctor_location", value)
            }
            value={inputs.doctor_location.value}
            isInvalid={false}
            label="Your Location"

          />

          <InputHybrid
            placeholder="Your License"
            onChangeText={(value) =>
              updateInputValueHandler("doctor_license", value)
            }
            value={inputs.doctor_license.value}
            isInvalid={false}
            label="Your License"

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

const styles = StyleSheet.create({
  datePickStyle: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between"
  }
});