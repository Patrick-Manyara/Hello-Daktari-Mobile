import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  calculateAge,
  getLongDate,
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

import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService, {
  ZegoCallInvitationDialog, ZegoUIKitPrebuiltCallWaitingScreen, ZegoUIKitPrebuiltCallInCallScreen, ZegoSendCallInvitationButton,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import getImageUri from "../../utils/imageHelper";


export default function SessionDetailsScreen({ route, navigation }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Load session data from route params
    const loadedSession = route.params.session;
    setSession(loadedSession);
  }, [route.params.session]);

  const sessionData = session
    ? [
      {
        txt: "Date",
        column: getLongDate(session.session_date),
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
    ]
    : []; // Return an empty array if session is not yet loaded


  const navigateToSpecialists = () => {
    navigation.navigate("AllSpecialistsScreen", {
      sessionData: session,
    });
  };

  const navigateToCall = () => {
    navigation.navigate("DoctorCallScreen");
  };

  if (!session) {
    // Show a loading indicator or return null until session data is available
    return <SafeAreaView><NormalText>Loading session...</NormalText></SafeAreaView>;
  }

  return (
    <SafeAreaView style={css.safeAreaView}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View>
          <Image
            source={{ uri: getImageUri(Paths.IMAGE_URL, session.user_image) }}
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


      <View>
        <NormalText>Hello Doc, the client is already in the call waiting for you</NormalText>
        <View
          style={{
            padding: 5,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ZegoSendCallInvitationButton
            invitees={[
              {
                userID: session.client_id,
                userName: session.user_name,
              },
            ]}
            // Directly pass the single invitee
            isVideoCall={false}
            resourceID={"zego_call"}
          />

          <ZegoSendCallInvitationButton
            invitees={[
              {
                userID: session.client_id,
                userName: session.user_name,
              },
            ]}
            // Directly pass the single invitee
            isVideoCall={true}
            resourceID={"zego_call"}
          />

        </View>
      </View>

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
