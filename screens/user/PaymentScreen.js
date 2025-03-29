import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { css } from "../../assets/styles";
import { Paths } from "../../utils/paths";
import { getLongDate, getTimeInAmPm } from "../../utils/dateFormat";
import getImageUri from "../../utils/imageHelper";

import NotificationBell from "../../components/ui/NotificationBell";
import HeaderText from "../../components/ui/HeaderText";
import NormalText from "../../components/ui/NormalText";
import PrimaryButton from "../../components/ui/PrimaryButton";
import RenderOverlay from "../../components/ui/RenderOverlay";

export default function PaymentScreen({ route, navigation }) {
  const [userAddress, setUserAddress] = useState("");
  const [doctor, setDoctor] = useState({});
  const [sessionData, setSessionData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('JamboPay');
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (route.params && route.params.doctor) {
      setDoctor(route.params.doctor);
    }
    if (route.params && route.params.sessionData) {
      setSessionData(route.params.sessionData);
    }
    if (route.params && route.params.address) {
      setUserAddress(route.params.address);
    }
  }, [route.params]);


  let submitForm = async () => {
    setIsSubmitting(true);
    const data = new FormData();
    data.append("session_id", sessionData.session_id);
    if (userAddress) {
      data.append("address", userAddress);
    }

    let res = await fetch(Paths.API_URL + "session.php?action=complete", {
      method: "post",
      body: data,
      headers: {
        "Content-Type": "multipart/form-data; ",
      },
    });

    let responseJson = await res.json();
    setIsSubmitting(false);
    navigation.navigate("SuccessScreen");
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <View>
          <HeaderText styleProp={[css.centerText, { marginVertical: 5 }]}>Payment Methods</HeaderText>

          <View>
            <View style={styles.profileIntro}>
              <View>
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: getImageUri(Paths.IMAGE_URL, doctor.doctor_image)
                  }}
                />
              </View>
              <View style={styles.textArea}>
                <HeaderText styleProp={styles.titleStyle}>
                  {doctor.doctor_name}
                </HeaderText>
                <NormalText styleProp={styles.subTitle}>
                  {doctor.doctor_qualifications}
                </NormalText>
                <NormalText styleProp={styles.subTitle}>
                  Years of Experience: 12 Years
                </NormalText>
              </View>
            </View>

            <View>
              <View style={styles.summaryFlexArea} >
                <NormalText>Date & hour</NormalText>
                {sessionData?.session_date && sessionData?.session_start_time ? (
                  <NormalText>
                    {getLongDate(sessionData.session_date)} |
                    {getTimeInAmPm(sessionData.session_start_time)}
                  </NormalText>
                ) : (
                  <NormalText>Loading...</NormalText>
                )}


              </View>
              <View style={styles.summaryFlexArea} >
                <NormalText>Package</NormalText>
                <NormalText styleProp={{ textTransform: "capitalize" }}>
                  {sessionData.session_mode}
                </NormalText>
              </View>
            </View>

            <View
              style={styles.lineBreak}
            ></View>

            <View>
              <View style={styles.summaryFlexArea} >
                <NormalText>Amount</NormalText>
                <NormalText> Ksh. 3000</NormalText>
              </View>

              <View style={styles.summaryFlexArea} >
                <NormalText>Payment</NormalText>
                <NormalText styleProp={{ textTransform: "capitalize" }}>
                  {selectedOption}
                </NormalText>
              </View>

              <View style={styles.summaryFlexArea} >
                <NormalText>Total</NormalText>
                <NormalText> Ksh. 3000 </NormalText>
              </View>
            </View>

            <PrimaryButton onPress={submitForm}>Pay Now</PrimaryButton>
          </View>

        </View>
      </ScrollView>
      {submitting && <RenderOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: "50%",
  },
  titleStyle: {
    fontSize: 14,
  },
  subTitle: {
    marginTop: 5,
    marginBottom: 5,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profileIntro: {
    flexDirection: "row",
    width: "100%",
  },
  textArea: {
    justifyContent: "center",
    marginLeft: 5,
  },
  summaryFlexArea: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  lineBreak: {
    width: "100%",
    height: 3,
    backgroundColor: "#B3B3B370",
  }
});
