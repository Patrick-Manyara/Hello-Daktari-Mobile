import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  calculateAge,
  getDayMonthAndYear,
  getTimeInAmPm,
} from "../../utils/dateFormat";

import NormalText from "../../components/ui/NormalText";
import MediumText from "../../components/ui/MediumText";
import IconButton from "../../components/ui/IconButton";
import PrimaryButton from "../../components/ui/PrimaryButton";
import TransparentButton from "../../components/ui/TransparentButton";

import { colors, css } from "../../assets/styles";
import { Paths } from "../../utils/paths";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";

export default function SessionDetailsScreen({ route, navigation }) {
  const session = route.params.session;
  const [userImg, setUserImg] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (session.user_image === null) {
      setUserImg("default.png");
    } else {
      setUserImg(session.user_image);
    }
  }, [session]);

  const sessionData = [
    {
      txt: "Date",
      column: getDayMonthAndYear(session.session_date),
    },
    {
      txt: "Start Time",
      column: getTimeInAmPm(session.session_start_time),
    },
    {
      txt: "End Time",
      column: getTimeInAmPm(session.session_end_time),
    },
    {
      txt: "Amount",
      column: "Ksh. 4500",
    },
    {
      txt: "Mode",
      column: session.session_mode,
    },
    {
      txt: "Channel",
      column:
        session.session_channel == null ? "None" : session.session_channel,
    },
    {
      txt: "Link",
      column: session.session_link == null ? "None" : "Click",
    },
  ];

  const navigateToSpecialists = () => {
    navigation.navigate("AllSpecialistsScreen", {
      sessionData: session,
    });
  };

  const navigateToCall = () => {
    navigation.navigate("DoctorCallScreen");
  };

  return (
    <SafeAreaView style={css.safeAreaView}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View>
          <Image
            source={{
              uri:
                Paths.IMAGE_URL +
                (session.user_image === null
                  ? "default.png"
                  : session.user_image),
            }}
            resizeMode="cover"
            style={styles.userImage}
          />
        </View>
        <View style={{ marginLeft: 5 }}>
          <MediumText styleProp={{ color: colors.primaryBlue }}>
            {session.user_name}
          </MediumText>
          <NormalText>{calculateAge(session.user_dob)}</NormalText>
          <NormalText>{session.user_email}</NormalText>
          <NormalText>{session.user_phone}</NormalText>
        </View>
      </View>

      {sessionData.map((item, index) => (
        <View key={index} style={styles.detailStyle}>
          <MediumText>{item.txt}</MediumText>
          <NormalText>{item.column}</NormalText>
        </View>
      ))}

      {session.session_date == today ? (
        <View>
          <NormalText>Hello Doc, the client is already in the call waiting for you</NormalText>
          <View
            style={{
              padding: 5,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              iconName={faCheck}
              iconColor={colors.darkBlue}
              iconSize={20}
              text="Start"
              styleProp={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                width: 100,
                backgroundColor: colors.secondaryBlue,
              }}
              textStyle={{ color: "black" }}
              onPress={navigateToCall}
            />

            <IconButton
              iconName={faClose}
              iconColor={colors.darkBlue}
              iconSize={20}
              text="Cancel"
              styleProp={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                width: 100,
                backgroundColor: colors.secondaryPink,
              }}
              textStyle={{ color: "black" }}
            />
          </View>
        </View>
      ) : (
        <View>
          <PrimaryButton style={{ backgroundColor: colors.primaryBlue }}>
            Accept
          </PrimaryButton>
          <PrimaryButton>Decline</PrimaryButton>
          <TransparentButton
            onPress={() => {
              navigateToSpecialists();
            }}
          >
            Refer
          </TransparentButton>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconImg: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  userImageView: {
    width: 102,
    height: 102,
    borderRadius: 51,
    borderColor: "black",
    borderWidth: 10,
    borderStyle: "solid",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  detailStyle: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    marginVertical: 5,
  },
});
