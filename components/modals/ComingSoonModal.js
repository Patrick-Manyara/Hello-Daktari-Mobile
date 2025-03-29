import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  Linking,
} from "react-native";

import PrimaryButton from "../ui/PrimaryButton";
import NormalText from "../ui/NormalText";
import { colors } from "../../assets/styles";

export default function ComingSoonModal({ visible, closeModal, phoneNumber }) {
  const makePhoneCall = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      alert("Phone number is not available");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.modalInnerView}>
          <View style={styles.chooseView}>
            <Pressable style={styles.ambulanceCard} onPress={makePhoneCall}>
              <Image
                style={styles.imageStyle}
                source={require("../../assets/icons/out.png")}
              />
              <NormalText styleProp={styles.consultText}>
                External Call
              </NormalText>
            </Pressable>
            <Pressable style={styles.ambulanceCard}>
              <Image
                style={styles.imageStyle}
                source={require("../../assets/icons/in.png")}
              />
              <NormalText styleProp={styles.consultText}>In-App</NormalText>
              <NormalText styleProp={styles.consultText}>
                (Coming Soon)
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
  ambulanceCard: {
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
  },
});
