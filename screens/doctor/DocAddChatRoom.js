import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import InputHybrid from "../../components/forms/InputHybrid";
import RenderOverlay from "../../components/ui/RenderOverlay";

import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

import { css } from "../../assets/styles";

export default function DocAddChatRoom({ route, navigation }) {
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

  const [user, setUser] = useState({});

  useEffect(() => {
    if (route.params && route.params.user) {
      setUser(route.params.user);
    }
  }, [route.params]);

  const [addChat, setAddChat] = useState("");

  const createNewChat = async () => {
    setIsSubmitting(true);
    let id = `${Date.now()}`;
    const _doc = {
      id: id,
      user: user,
      doctor: doctor,
      chatName: addChat,
      sender: doctor.doctor_id,
      receiver: user.user_id,
    };

    if (addChat !== "") {
      setDoc(doc(firestore, "chats", id), _doc)
        .then(() => {
          setIsSubmitting(false);
          setAddChat("");
          navigation.navigate("DoctorChatRoom");
        })
        .catch((err) => {
          setIsSubmitting(false);
          console.log("Error:", err);
        });
    } else {
      Alert.alert("Data needed");
      setIsSubmitting(false);
    }
  };

  //RENDER
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NormalText> Starting a new chat with {user.user_name} </NormalText>
      <View style={{ flex: 1 }}>
        <NormalText>Give the chat a chatroom name.</NormalText>
        <InputHybrid
          placeholder="Add Chatroom Name"
          value={addChat}
          onChangeText={(text) => setAddChat(text)}
        />
      </View>
      <View>
        <PrimaryButton onPress={createNewChat}>Send</PrimaryButton>
      </View>
      {isSubmitting && <RenderOverlay />}
    </SafeAreaView>
  );
}
