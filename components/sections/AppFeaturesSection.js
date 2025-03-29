import React, {useState } from "react";
import { View } from "react-native";

import AppFeatureCard from "../cards/AppFeatureCard";
import AmbulanceModal from "../modals/AmbulanceModal";

import { css } from "../../assets/styles";
import { useNavigation } from "@react-navigation/native";

export default function AppFeaturesSection({ userData }) {
  const navigation = useNavigation();
  function navigateToScreen(screenName) {
    navigation.navigate(screenName, {
      userData: userData,
    });
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  return (
    <View style={css.flexContainer}>
      <AppFeatureCard
        imageSrc={require("../../assets/icons/woman.png")}
        featureText="Consult a specialist"
        onPress={() => navigateToScreen("BookSessionScreen")}
        bgColor="#FF594D3B"
        txtColor="#FF594D"
      />
      <AppFeatureCard
        imageSrc={require("../../assets/icons/forum.png")}
        featureText="Patient Forum"
        onPress={() => navigateToScreen("ForumScreen")}
        bgColor="#4C84C333"
        txtColor="#4C84C3"
      />
      <AppFeatureCard
        imageSrc={require("../../assets/icons/house.png")}
        featureText="Home Based Care"
        bgColor="#983B2D33"
        txtColor="#983B2D"
        onPress={() => navigateToScreen("HomeVisitScreen")}
      /> 

      <AppFeatureCard
        imageSrc={require("../../assets/icons/board.png")}
        featureText="Medical Records"
        bgColor="#17A18233"
        txtColor="#17A182"
        onPress={() => navigateToScreen("MedicalRecordsScreen")}
      />
      <AppFeatureCard
        imageSrc={require("../../assets/icons/meds.png")}
        featureText="Pharmacy"
        txtColor="#0EA6C6"
        bgColor="#0EA6C633"
        onPress={() => navigateToScreen("Shop")}
      />
      <AppFeatureCard
        imageSrc={require("../../assets/icons/microscope.png")}
        featureText="Lab Services"
        txtColor="#FF594D"
        bgColor="#FF594D3B"
        onPress={() => navigateToScreen("LabScreen")}
      />
      
      <AppFeatureCard
        imageSrc={require("../../assets/icons/ambulance.png")}
        featureText="Ambulance"
        onPress={openModal}
        bgColor="#4C84C333"
        txtColor="#4C84C3"
      />
       <AppFeatureCard
        imageSrc={require("../../assets/icons/nurse.png")}
        featureText="Nursing Services"
        bgColor="#17A18233"
        txtColor="#17A182"
        onPress={() => {}}
      />
      <AppFeatureCard
        imageSrc={require("../../assets/icons/call.png")}
        featureText="Session History"
        txtColor="#0EA6C6"
        bgColor="#0EA6C633"
        onPress={() => navigateToScreen("SessionHistory")}
      />
      <AmbulanceModal visible={isModalVisible} closeModal={closeModal} />
    </View>
  );
}
