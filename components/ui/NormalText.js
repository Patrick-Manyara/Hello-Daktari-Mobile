import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import * as Font from "expo-font";

export default function NormalText({ children, styleProp, boldProp }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      "poppins-regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      "poppins-semibold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    });
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <Text style={[{ fontSize: 12, color: "black" }, styleProp]}>
        {children}
      </Text>
    );
  }

  return (
    <Text
      style={[
        styles.primaryText,
        styleProp,
        { fontFamily: boldProp ? "poppins-semibold" : "poppins-regular" },
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  primaryText: {
    fontSize: 12,
    color: "black",
    // fontFamily: "poppins-regular",
  },
});
