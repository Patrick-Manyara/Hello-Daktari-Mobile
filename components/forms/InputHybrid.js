import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

import NormalText from '../ui/NormalText';

import {colors, css} from '../../assets/styles';

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
  return (
    <View style={[css.disabledContainer, styles.customInput, containerStyle]}>
      {label && (
        <NormalText styleProp={{color: '#00000066', fontSize: 8}}>
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
        placeholderTextColor="#696a6b"
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    width: '100%',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  inputInvalid: {
    backgroundColor: colors.error100,
  },
  customInput: {
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
});
