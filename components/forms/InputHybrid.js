import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import * as Font from "expo-font";

import NormalText from "../ui/NormalText";

import { colors, css } from "../../assets/styles";

export default function InputHybrid({
  label,
  keyboardType,
  secureTextEntry,
  onChangeText,
  value,
  isInvalid,
  placeholder,
  multiline,
  numberOfLines,
  inputStyle,
  placeholderTextColor,
  containerStyle,
}) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      "poppins-regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    });
    setFontsLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);
  return (
    <>
      {fontsLoaded ? (
        <View
          style={[css.disabledContainer, styles.customInput, containerStyle]}
        >
          {label && (
            <NormalText styleProp={{ color: "#00000066", fontSize: 8 }}>
              {label}
            </NormalText>
          )}

          <TextInput
            style={[styles.input, isInvalid && styles.inputInvalid, inputStyle]}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
        </View>
      ) : (
        <View>
          <TextInput style={[styles.input, isInvalid && styles.inputInvalid]} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    width: "100%",
    fontSize: 14,
    fontFamily: "poppins-regular",
  },
  inputInvalid: {
    backgroundColor: colors.error100,
  },

  customInput: {
    height: 50,
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 8,
  },
});
