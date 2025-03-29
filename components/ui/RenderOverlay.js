import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function RenderOverlay() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(0,0,0,0.4)",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <ActivityIndicator color="#fff" animating size="large" />
    </View>
  );
}
