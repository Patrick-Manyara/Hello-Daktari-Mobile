import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import * as Font from "expo-font";

import { colors } from "../../assets/styles";


export default function HeaderText({ children, styleProp }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      "poppins-regular": require("../../assets/fonts/Poppins-Regular.ttf"),
      "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
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
      style={[styles.primaryText, styleProp, { fontFamily: "poppins-bold" }]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  primaryText: {
    fontSize: 16,
    color: colors.primaryBlue,
  },
});
