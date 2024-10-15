import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import * as Font from "expo-font";


export default function MediumText({ children, styleProp }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
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
        { fontFamily: "poppins-semibold" },
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  primaryText: {
    fontSize: 14,
    color: "black",
  },
});
