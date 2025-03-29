import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";


export default function MediumText({ children, styleProp }) {


  return (
    <Text
      style={[
        styles.primaryText,
        styleProp,
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
    fontFamily: "Poppins-SemiBoldItalic"
  },
});
