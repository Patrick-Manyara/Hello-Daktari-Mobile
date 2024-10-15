import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import * as Font from "expo-font";

import NormalText from "../ui/NormalText";
import { colors, css } from "../../assets/styles";


export default function TextAreaInput({
  label,
  onChangeText,
  value,
  isInvalid,
  placeholder,
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
        <View style={containerStyle} >
          {label && (
            <NormalText styleProp={{ color: "#00000066", fontSize: 8 }}>
              {label}
            </NormalText>
          )}

          <TextInput
            style={[styles.textAreaStyle, isInvalid && styles.inputInvalid, inputStyle]}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            multiline={true}
            numberOfLines={numberOfLines}
          />
        </View>
      ) : (
        <View>
          <TextInput
            style={[styles.textAreaStyle, isInvalid && styles.inputInvalid, inputStyle]}
            multiline={true}
            numberOfLines={numberOfLines} />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  textAreaStyle: {
    height: 150,
    justifyContent: "flex-start",
    textAlignVertical: 'top',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 14,
    fontFamily: "poppins-regular",
  },
});
