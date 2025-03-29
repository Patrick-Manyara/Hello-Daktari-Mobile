import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";

import { colors } from "../../assets/styles";


export default function HeaderText({ children, styleProp }) {

  return (
    <Text style={[styles.primaryText, styleProp]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  primaryText: {
    fontSize: 16,
    color: colors.primaryBlue,
    fontFamily:"Poppins-Bold"
  },
});
