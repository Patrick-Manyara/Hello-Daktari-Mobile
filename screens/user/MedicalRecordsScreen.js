import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, ScrollView, ToastAndroid, Alert, Platform } from "react-native";
import DocumentPicker from "react-native-document-picker";

import { Paths } from "../../utils/paths";
import { SafeAreaView } from "react-native-safe-area-context";
import { css } from "../../assets/styles";

import NotificationBell from "../../components/ui/NotificationBell";
import RenderOverlay from "../../components/ui/RenderOverlay";
import PrimaryButton from "../../components/ui/PrimaryButton";
import UploadInput from "../../components/forms/UploadInput";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import InputHybrid from "../../components/forms/InputHybrid";
import { useNavigation } from "@react-navigation/native";

export default function MedicalRecordsScreen() {
  const navigation = useNavigation();

  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    let u = await AsyncStorage.getItem("token");
    if (u) {
      u = JSON.parse(u);
      setUser(u);
    }
  };

  //UPLOADS

  const [enteredFileName, setEnteredFileName] = useState("");

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "upload_name":
        setEnteredFileName(enteredValue);
        break;
    }
  }

  const [enteredRecords, setEnteredRecords] = useState("");
  const [enteredRecordsName, setEnteredRecordsName] = useState("");

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Adjust the type based on requirements
      });
      setEnteredRecords(res);
      setEnteredRecordsName(res[0]?.name || "Unknown File"); // Use the first file's name
      ToastAndroid.show("Medical records loaded", ToastAndroid.SHORT);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Handle file picker cancellation
        ToastAndroid.show("File selection cancelled", ToastAndroid.SHORT);
      } else {
        console.error("Error picking file: ", err);
        Alert.alert("Error", "Failed to pick the file. Please try again.");
      }
    }
  };

  const FileName = () => {
    if (!enteredRecords) {
      return <NormalText>No file uploaded</NormalText>;
    } else {
      return <NormalText>{enteredRecordsName} uploaded</NormalText>;
    }
  };

  //SUBMISSION
  const [uploading, setUploading] = useState(false);

  const url = Paths.API_URL + "records.php";

  let submitForm = async () => {
    try {
      if (enteredRecords != null && enteredFileName != "") {
        setUploading(true);

        const data = new FormData();

        const fileToUpload2 = enteredRecords;

        data.append("upload_file", {
          type: "application/pdf",
          uri: enteredRecords[0].uri,
          name: enteredRecords[0].name,
        });
        data.append("user_id", user.user_id);
        data.append("upload_name", enteredFileName);

        let res = await fetch(url, {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data; ",
          },
        });

        if (res.ok) {
          let responseJson = await res.json();
          if (responseJson.data === 1) {
            navigation.navigate("PaymentScreen", {
              from: responseJson.from,
              table_id: responseJson.table_id,
            });
          } else if (responseJson.data === 2) {
            navigation.navigate("SuccessScreen");
          } else {
            Alert.alert("Error");
            console.log("error here");
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
      <ScrollView>
        <HeaderText styleProp={css.centerText}>Upload Your Medical Records</HeaderText>
        <NormalText>
          Store your valuable medical records including previous prescriptions,
          laboratory and imaging reports among others.
        </NormalText>

        <NormalText>
          Enter the file name and upload a file.
        </NormalText>
        <View>
          <InputHybrid
            style={css.input}
            placeholder="Label or File Name"
            placeholderTextColor="black"
            onChangeText={(value) =>
              updateInputValueHandler("upload_name", value)
            }
            value={enteredFileName}
          />

          <UploadInput placeholder="Upload Records" onPress={selectFile} />


          {enteredRecords && (
            <FileName />
          )}


          <PrimaryButton onPress={submitForm}>Submit</PrimaryButton>
        </View>
        {uploading && <RenderOverlay />}
      </ScrollView>
    </SafeAreaView>
  );
}


