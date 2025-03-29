import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

import NormalText from '../ui/NormalText';
import {colors} from '../../assets/styles';

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
  return (
    <View style={[containerStyle]}>
      {label && (
        <NormalText styleProp={{color: '#00000066', fontSize: 8}}>
          {label}
        </NormalText>
      )}

      <TextInput
        style={[
          styles.textAreaStyle,
          isInvalid && styles.inputInvalid,
          inputStyle,
        ]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={true}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textAreaStyle: {
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    padding: 10,
    backgroundColor: colors.secondaryGrey,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});
