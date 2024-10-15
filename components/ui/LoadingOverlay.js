import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import NormalText from "./NormalText";

export default function LoadingOverlay({message}) {
  return (
    <View style={styles.rootContainer}>
      <NormalText style={styles.messageStyle}>{message}</NormalText>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  messageStyle: {
    fontSize: 16,
    marginBottom: 12,
  },
});
