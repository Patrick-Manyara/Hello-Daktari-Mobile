import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationBell from "../../components/ui/NotificationBell";
import NormalText from "../../components/ui/NormalText";
import { colors, css } from "../../assets/styles";

export default function WalletScreen() {
  return (
    <SafeAreaView style={css.safeAreaView}>
      <NotificationBell />
      <ScrollView>
        <NormalText>Your wallet will appear here</NormalText>
      </ScrollView>
    </SafeAreaView>
  );
}
