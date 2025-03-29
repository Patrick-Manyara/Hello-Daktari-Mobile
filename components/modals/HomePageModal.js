import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Pressable, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";

import PrimaryButton from "../ui/PrimaryButton";
import NormalText from "../ui/NormalText";
import { colors } from "../../assets/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomePageModal({ visible, closeModal }) {
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

  const navigation = useNavigation();

  const navigateToAvailableDoctors = () => {
    navigation.navigate("BookSessionScreen", {
      userData: user,
    });
    closeModal();
  };

  const navigateToManualDetails = () => {
    navigation.navigate("BookAvailableScreen", {
      userData: user,
    });
    closeModal();
  };
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.modalInnerView}>
          <View style={styles.chooseView}>
            <Pressable style={styles.cardStyle} onPress={navigateToManualDetails}>
              <Image
                style={styles.imageStyle}
                source={require("../../assets/icons/team.png")}
              />
              <NormalText styleProp={styles.consultText}>
                Consult Available Doctor
              </NormalText>
            </Pressable>
            <Pressable style={styles.cardStyle} onPress={navigateToAvailableDoctors}>
              <Image
                style={styles.imageStyle}
                source={require("../../assets/icons/form.png")}
              />
              <NormalText styleProp={styles.consultText}>
                Consult A Specialist
              </NormalText>
            </Pressable>
          </View>

          <PrimaryButton onPress={closeModal}>Close</PrimaryButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalInnerView: {
    width: "80%", 
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  chooseView: {
    flexDirection: "row",
    width: "100%",
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  cardStyle: {
    backgroundColor: colors.whiteSmoke,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 5,
    borderRadius: 10,
    width: "45%",
  },
  consultText: {
    fontSize: 10,
    textAlign:"center"
  },
});
